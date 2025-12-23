import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/withAuth";
import { BookingStatus } from "@/app/generated/prisma";
import { AuthUser } from "@/lib/auth";

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
                },
              },
            },
          },
        },
      });

      const data = bookings.map((u) => ({
        id: u.id,
        movieTitle: u.show?.movie?.title,
        moviePosterUrl: u.show?.movie?.posterUrl,
        startAt: u.show.startAt,
        reservedAt: u.reservedAt,
        seats: u.bookingSeats
          .map((s) => ({ seatNo: s.seat?.row ?? "" + s.seat?.number }))
          .join(","),
      }));
      return NextResponse.json({ data, message: "Success!" }, { status: 200 });
    } catch {
      return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
  }
);

export const POST = withAuth(
  async (req: NextRequest, _params: unknown, user: AuthUser) => {
    try {
      const body = await req.json();
      const { showId, seats } = body;
      if (!showId || !seats?.length) {
        return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
      }
      const HOLD_MINUTES = 2;
      try {
        const booking = await prisma.$transaction(async (tx) => {
          const show = await tx.show.findUnique({
            where: { id: showId },
            select: {
              id: true,
              auditoriumId: true,
              seatPrices: true,
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
            prices.map((p) => [p.seatType, p.priceCents])
          );

          const totalPrice = audiSeats.reduce((sum, seat) => {
            let price = priceMap.get(seat.seatType);
            if (!price) {
              // throw new Error(`Price not set for seat type ${seat.seatType}`);
              price = 50;
            }
            return sum + price;
          }, 0);

          const booking = await prisma.booking.create({
            data: {
              showId,
              userId: Number(user.id),
              priceCents: totalPrice,
              status: BookingStatus.INITIATED,
              expiresAt: new Date(Date.now() + HOLD_MINUTES * 60 * 1000),
              bookingSeats: {
                create: seats.map((seatId: number) => ({
                  seatId,
                })),
              },
            },
          });

          return booking;
        });
        return NextResponse.json(
          { data: booking, message: "Success!" },
          { status: 200 }
        );
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Bad request";
        return NextResponse.json({ error: message }, { status: 400 });
      }
    } catch {
      return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
  }
);
