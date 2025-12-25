import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/withAuth";
import { BookingStatus } from "@/app/generated/prisma";
import { AuthUser } from "@/lib/auth";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2025-12-15.clover",
});

export const GET = withAuth(
  async (req: NextRequest, _params: unknown, user: AuthUser) => {
    try {
      const bookings = await prisma.booking.findMany({
        where: {
          userId: Number(user.id),
        },
        include: {
          show: {
            select: {
              movie: {
                select: {
                  title: true,
                  posterUrl: true,
                },
              },
              startAt: true,
            },
          },
          bookingSeats: {
            select: {
              seat: {
                select: {
                  row: true,
                  number: true,
                  seatType: true,
                },
              },
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      const data = bookings.map((u) => ({
        id: u.id,
        movieTitle: u.show?.movie?.title,
        moviePosterUrl: u.show?.movie?.posterUrl,
        startAt: u.show.startAt,
        reservedAt: u.reservedAt,
        seats: u.bookingSeats.map((seat) => {
          return {
            name: seat.seat?.row + "-" + seat.seat?.number,
            seatType: seat.seat?.seatType,
          };
        }),
        quantity: u.bookingSeats.length,
        totalPrice: u.priceCents,
      }));
      return NextResponse.json({ data, message: "Success!" }, { status: 200 });
    } catch {
      return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
  },
);

export const POST = withAuth(
  async (req: NextRequest, _params: unknown, user: AuthUser) => {
    try {
      const body = await req.json();
      const showId = Number(body?.showId);
      const seats = Array.isArray(body?.seats)
        ? body.seats
            .map((s: unknown) => Number(s))
            .filter((n: number) => Number.isFinite(n))
        : [];

      if (!showId || seats.length === 0) {
        return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
      }

      if (!process.env.STRIPE_SECRET_KEY) {
        return NextResponse.json(
          { error: "Stripe is not configured" },
          { status: 500 },
        );
      }
      if (!process.env.NEXT_PUBLIC_BASE_URL) {
        return NextResponse.json(
          { error: "NEXT_PUBLIC_BASE_URL is not configured" },
          { status: 500 },
        );
      }

      const HOLD_MINUTES = 10;
      try {
        const booking = await prisma.$transaction(async (tx) => {
          const show = await tx.show.findUnique({
            where: { id: showId },
            select: {
              id: true,
              auditoriumId: true,
            },
          });

          if (!show) {
            throw new Error("Show not found");
          }

          const audiSeats = await tx.seat.findMany({
            where: {
              id: { in: seats },
              auditoriumId: show.auditoriumId,
            },
          });

          if (audiSeats.length !== seats.length) {
            throw new Error("One or more seats are invalid");
          }
          //if status is initated or booked and not expired , then cannot book except for the case when the booking user is the same as the current user
          const now = new Date();
          const alreadyBooked = await tx.bookingSeat.findFirst({
            where: {
              seatId: { in: seats },
              booking: {
                showId,
                OR: [
                  { status: BookingStatus.BOOKED },
                  { status: BookingStatus.INITIATED, expiresAt: { gt: now } },
                ],
                NOT: { userId: Number(user.id) },
              },
            },
          });

          if (alreadyBooked) {
            throw new Error("One or more seats already booked");
          }

          const prices = await tx.seatPrice.findMany({
            where: {
              showId,
              seatType: {
                in: audiSeats.map((s) => s.seatType),
              },
            },
          });

          const priceMap = new Map(
            prices.map((p) => [p.seatType, p.priceCents]),
          );

          const totalPrice = audiSeats.reduce((sum, seat) => {
            const price = priceMap.get(seat.seatType);
            if (!price) {
              throw new Error(`Price not set for seat type ${seat.seatType}`);
            }
            return sum + price;
          }, 0);

          const booking = await tx.booking.create({
            data: {
              showId,
              userId: Number(user.id),
              priceCents: totalPrice,
              status: BookingStatus.INITIATED,
              expiresAt: new Date(Date.now() + HOLD_MINUTES * 60 * 1000),
              reservedAt: new Date(Date.now()),
              bookingSeats: {
                create: seats.map((seatId: number) => ({
                  seatId,
                })),
              },
            },
            select: {
              id: true,
              showId: true,
              status: true,
              expiresAt: true,
              priceCents: true,
            },
          });
          return booking;
        });

        const stripeSession = await stripe.checkout.sessions.create({
          mode: "payment",
          payment_method_types: ["card"],
          customer_email: user.email || undefined,
          client_reference_id: booking.id.toString(),
          // expires_at: Math.floor(Date.now() / 1000) + 900,
          line_items: [
            {
              price_data: {
                currency: "usd",
                product_data: {
                  name: `Booking #${booking.id} (Show #${booking.showId})`,
                },
                unit_amount: booking.priceCents,
              },
              quantity: 1,
            },
          ],
          success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/bookings/success?session_id={CHECKOUT_SESSION_ID}&bookingId=${booking.id}`,
          cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/bookings/cancel?bookingId=${booking.id}`,
          metadata: {
            bookingId: booking.id.toString(),
            showId: booking.showId.toString(),
          },
        });

        await prisma.booking.update({
          where: { id: booking.id },
          data: {
            paymentReferenceId: stripeSession.id,
          },
        });

        return NextResponse.json(
          {
            data: {
              bookingId: booking.id,
              expiresAt: booking.expiresAt,
              priceCents: booking.priceCents,
              stripeSessionId: stripeSession.id,
              checkoutUrl: stripeSession.url,
            },
            message: "Success!",
          },
          { status: 200 },
        );
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Bad request";
        return NextResponse.json({ error: message }, { status: 400 });
      }
    } catch (error) {
      console.log(error);
      return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
  },
);
