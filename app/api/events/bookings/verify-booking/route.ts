import { withAuth } from "@/lib/withAuth";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { BookingStatus } from "@/app/generated/prisma/edge";
import { AuthUser } from "@/lib/auth";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2025-12-15.clover",
});

export const POST = withAuth(
  async (req: NextRequest, _params: unknown, user: AuthUser) => {
    try {
      const body = await req.json();
      const paymentSessionId = body?.paymentSessionId;
      const bookingIdParam = body?.bookingId;

      if (!paymentSessionId && !bookingIdParam) {
        return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
      }

      if (bookingIdParam && !paymentSessionId) {
        const booking = await prisma.eventBooking.findUnique({
          where: { id: Number(bookingIdParam) },
        });
        if (!booking) {
          return NextResponse.json(
            { error: "Booking not found" },
            { status: 404 },
          );
        }
        if (booking.userId && booking.userId !== Number(user.userId)) {
          return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }
        if (booking.status === BookingStatus.BOOKED) {
          return NextResponse.json(
            {
              data: {
                bookingId: booking.id,
                ticketPdfUrl: `/api/events/bookings/download-ticket/${booking.id}`,
              },
            },
            { status: 200 },
          );
        }
      }

      const session = await stripe.checkout.sessions.retrieve(
        paymentSessionId,
        { expand: ["payment_intent", "customer"] },
      );

      const bookingIdFromStripe = session.metadata?.bookingId;
      if (!bookingIdFromStripe) {
        return NextResponse.json(
          { error: "Missing bookingId in Stripe metadata" },
          { status: 400 },
        );
      }

      const bookingId = Number(bookingIdFromStripe);
      if (!Number.isFinite(bookingId)) {
        return NextResponse.json(
          { error: "Invalid bookingId in metadata" },
          { status: 400 },
        );
      }

      const booking = await prisma.eventBooking.findUnique({
        where: { id: bookingId },
      });

      if (!booking) {
        return NextResponse.json(
          { error: "Booking not found" },
          { status: 404 },
        );
      }

      if (booking.userId && booking.userId !== Number(user.userId)) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }

      if (session.payment_status !== "paid") {
        return NextResponse.json(
          { error: "Payment not completed" },
          { status: 400 },
        );
      }

      const paidAmount = session.amount_total ?? 0;
      if (paidAmount !== booking.priceCents) {
        return NextResponse.json(
          { error: "Payment amount mismatch" },
          { status: 400 },
        );
      }

      await prisma.eventBooking.update({
        where: { id: bookingId },
        data: {
          status: BookingStatus.BOOKED,
          reservedAt: new Date(),
        },
      });

      return NextResponse.json(
        {
          data: {
            bookingId,
            ticketPdfUrl: `/api/events/bookings/download-ticket/${bookingId}`,
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
