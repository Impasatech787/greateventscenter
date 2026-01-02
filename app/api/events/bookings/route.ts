import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/withAuth";
import { BookingStatus } from "@/app/generated/prisma";
import { AuthUser } from "@/lib/auth";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2025-12-15.clover",
});

export const POST = withAuth(
  async (req: NextRequest, _params: unknown, user: AuthUser) => {
    try {
      const body = await req.json();
      const eventId = Number(body?.eventId);
      const quantity = Number(body?.quantity);

      if (!eventId || !Number.isFinite(quantity) || quantity <= 0) {
        return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
      }

      const event = await prisma.event.findUnique({
        where: { id: eventId },
        select: {
          id: true,
          title: true,
          status: true,
          capacity: true,
          priceCents: true,
        },
      });

      if (!event) {
        return NextResponse.json({ error: "Event not found" }, { status: 404 });
      }

      if (event.status.toLowerCase() !== "scheduled") {
        return NextResponse.json(
          { error: "Event is not available for booking" },
          { status: 400 },
        );
      }

      if (event.capacity) {
        const booked = await prisma.eventBooking.aggregate({
          where: {
            eventId,
            status: {
              in: [BookingStatus.INITIATED, BookingStatus.BOOKED],
            },
          },
          _sum: {
            quantity: true,
          },
        });
        const alreadyBooked = booked._sum.quantity ?? 0;
        if (alreadyBooked + quantity > event.capacity) {
          return NextResponse.json(
            { error: "Not enough tickets remaining" },
            { status: 400 },
          );
        }
      }

      const priceCents = event.priceCents ?? 0;
      const totalPrice = priceCents * quantity;

      const booking = await prisma.eventBooking.create({
        data: {
          eventId,
          userId: Number(user.userId),
          status: priceCents > 0 ? BookingStatus.INITIATED : BookingStatus.BOOKED,
          quantity,
          priceCents: totalPrice,
          reservedAt: new Date(),
        },
        select: {
          id: true,
        },
      });

      if (priceCents <= 0) {
        return NextResponse.json(
          {
            data: {
              bookingId: booking.id,
              checkoutUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/events/bookings/success?bookingId=${booking.id}`,
            },
            message: "Success!",
          },
          { status: 200 },
        );
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

      const stripeSession = await stripe.checkout.sessions.create({
        mode: "payment",
        payment_method_types: ["card"],
        customer_email: user.email || undefined,
        client_reference_id: booking.id.toString(),
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: {
                name: `Event: ${event.title}`,
              },
              unit_amount: priceCents,
            },
            quantity,
          },
        ],
        success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/events/bookings/success?session_id={CHECKOUT_SESSION_ID}&bookingId=${booking.id}`,
        cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/events/bookings/cancel?bookingId=${booking.id}`,
        metadata: {
          bookingId: booking.id.toString(),
          eventId: eventId.toString(),
        },
      });

      await prisma.eventBooking.update({
        where: { id: booking.id },
        data: {
          stripeCheckoutSessionId: stripeSession.id,
        },
      });

      return NextResponse.json(
        {
          data: {
            bookingId: booking.id,
            checkoutUrl: stripeSession.url,
          },
          message: "Success!",
        },
        { status: 200 },
      );
    } catch (error) {
      console.error(error);
      return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
  },
  ["User", "Admin"],
);
