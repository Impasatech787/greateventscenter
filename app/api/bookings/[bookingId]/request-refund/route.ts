import { AuthUser } from "@/lib/auth";
import { withAuth } from "@/lib/withAuth";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import Stripe from "stripe";
import { BookingStatus, PaymentStatus } from "@/app/generated/prisma";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2025-12-15.clover",
});

export const POST = withAuth(
  async (_req: NextRequest, params: { bookingId: string }, user: AuthUser) => {
    try {
      if (!process.env.STRIPE_SECRET_KEY) {
        return NextResponse.json(
          { error: "Stripe is not configured" },
          { status: 500 }
        );
      }

      const bookingIdNum = Number(params.bookingId);
      if (!Number.isFinite(bookingIdNum)) {
        return NextResponse.json(
          { error: "Invalid bookingId" },
          { status: 400 }
        );
      }

      const booking = await prisma.booking.findUnique({
        where: { id: bookingIdNum },
        select: {
          id: true,
          status: true,
          userId: true,
          payment: {
            select: {
              id: true,
              status: true,
              bookingId: true,
              userId: true,
              provider: true,
              amountCents: true,
              currency: true,
              stripePaymentIntentId: true,
              livemode: true,
            },
          },
        },
      });
      if (!booking) {
        return NextResponse.json(
          { error: "Booking Not Found" },
          { status: 404 }
        );
      }

      if (booking.userId !== Number(user.userId)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      if (!booking.payment) {
        return NextResponse.json(
          { error: "No payment found for this booking" },
          { status: 400 }
        );
      }

      if (
        booking.payment.bookingId &&
        booking.payment.bookingId !== booking.id
      ) {
        return NextResponse.json(
          { error: "Payment does not belong to this booking" },
          { status: 400 }
        );
      }

      if (booking.payment.userId && booking.payment.userId !== booking.userId) {
        return NextResponse.json(
          { error: "Payment does not belong to this user" },
          { status: 400 }
        );
      }

      if (!booking.payment.stripePaymentIntentId) {
        return NextResponse.json(
          { error: "Missing Stripe payment intent" },
          { status: 400 }
        );
      }

      if (
        booking.payment.status === PaymentStatus.REFUNDED ||
        booking.payment.status === PaymentStatus.REFUND_PENDING
      ) {
        return NextResponse.json(
          { error: "Already refunded or refund in progress" },
          { status: 409 }
        );
      }

      if (booking.payment.status !== PaymentStatus.SUCCEEDED) {
        return NextResponse.json(
          { error: "Payment must be SUCCEEDED to refund" },
          { status: 400 }
        );
      }

      // Allow refund if already cancelled OR currently booked.
      if (
        booking.status !== BookingStatus.CANCELLED &&
        booking.status !== BookingStatus.BOOKED
      ) {
        return NextResponse.json(
          { error: "Booking is not eligible for refund" },
          { status: 400 }
        );
      }

      try {
        const refund = await stripe.refunds.create(
          {
            payment_intent: booking.payment.stripePaymentIntentId,
            reason: "requested_by_customer",
            metadata: {
              bookingId: String(booking.id),
              paymentId: String(booking.payment.id),
              userId: String(booking.userId),
            },
          },
          {
            idempotencyKey: `refund_booking_${booking.id}`,
          }
        );

        const isSucceeded = refund.status === "succeeded";
        const isPending = refund.status === "pending";

        if (isSucceeded || isPending) {
          await prisma.$transaction([
            prisma.payment.update({
              where: { id: booking.payment.id },
              data: {
                status: isSucceeded
                  ? PaymentStatus.REFUNDED
                  : PaymentStatus.REFUND_PENDING,
              },
            }),
            prisma.booking.update({
              where: { id: booking.id },
              data: { status: BookingStatus.CANCELLED },
            }),
          ]);
        }

        return NextResponse.json(
          {
            message: isSucceeded
              ? "Refund processed successfully"
              : "Refund created; processing",
            refund: {
              id: refund.id,
              status: refund.status,
              amount: refund.amount,
              currency: refund.currency,
            },
          },
          { status: isSucceeded ? 200 : 202 }
        );
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Stripe refund failed";
        console.error("Stripe refund error", error);
        return NextResponse.json(
          { error: "Stripe refund failed", details: message },
          { status: 500 }
        );
      }
    } catch (error) {
      console.error("Refund failed", error);
      return NextResponse.json(
        { error: "Refund failed", details: (error as Error).message },
        { status: 500 }
      );
    }
  }
);
