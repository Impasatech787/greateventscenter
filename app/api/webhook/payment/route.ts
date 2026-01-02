import { NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import { emailTicket } from "@/lib/emailTicket";
import { Prisma } from "@/app/generated/prisma";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-12-15.clover",
});

export async function POST(req: Request) {
  try {
    const sig = req.headers.get("stripe-signature");
    if (!sig) return new Response("Missing stripe-signature", { status: 400 });
    const rawBody = await req.text();
    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(
        rawBody,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET!
      );
    } catch (error) {
      return new Response(`Webhook Error ${error}`, { status: 400 });
    }
    try {
      let shouldEmailTicket = false;
      let ticketEmailBookingId: string | null = null;
      let ticketEmailTo: string | null = null;
      let ticketEmailName = "";

      await prisma.$transaction(async (tx) => {
        const existing = await tx.stripeEvent.findUnique({
          where: { stripeEventId: event.id },
          select: { id: true },
        });
        if (existing) return;
        const obj = event.data.object as unknown as Record<string, unknown>;
        const objType = typeof obj.object === "string" ? obj.object : null;
        const objId = typeof obj.id === "string" ? obj.id : null;
        const objPaymentIntent =
          typeof obj.payment_intent === "string" ? obj.payment_intent : null;
        const objReceiptEmail =
          typeof obj.receipt_email === "string" ? obj.receipt_email : null;
        const objMetadata =
          obj.metadata && typeof obj.metadata === "object"
            ? (obj.metadata as Record<string, unknown>)
            : null;
        const objCustomerName =
          typeof objMetadata?.customerName === "string"
            ? objMetadata.customerName
            : "";

        const paymentIntentId: string | null =
          objType === "payment_intent" ? objId : objPaymentIntent;

        const stripeEvent = await tx.stripeEvent.create({
          data: {
            stripeEventId: event.id,
            type: event.type,
            livemode: event.livemode ?? false,
            created: typeof event.created === "number" ? event.created : null,
            processedAt: new Date(),
            payload: event as unknown as Prisma.InputJsonValue,
            stripePaymentIntentId: paymentIntentId,
          },
        });

        if (event.type === "payment_intent.succeeded") {
          const pi = event.data.object as Stripe.PaymentIntent;
          const pay = await tx.payment.upsert({
            where: { stripePaymentIntentId: pi.id },
            create: {
              provider: "CARD",
              status: "SUCCEEDED",
              amountCents: pi.amount_received ?? pi.amount,
              currency: pi.currency,
              stripePaymentIntentId: pi.id,
              stripeChargeId: (pi.latest_charge as string) ?? null,
              stripeCustomerId: (pi.customer as string) ?? null,
              livemode: pi.livemode ?? false,
              receiptEmail: pi.receipt_email ?? null,
              metadata: (pi.metadata ?? {}) as unknown as Prisma.InputJsonValue,
              paidAt: new Date(),
              stripeEventLastId: event.id,
              bookingId: pi.metadata?.bookingId
                ? Number(pi.metadata.bookingId)
                : null,
              userId: pi.metadata?.userId ? Number(pi.metadata.userId) : null,
            },
            update: {
              status: "SUCCEEDED",
              amountCents: pi.amount_received ?? pi.amount,
              currency: pi.currency,
              stripeChargeId: (pi.latest_charge as string) ?? null,
              stripeCustomerId: (pi.customer as string) ?? null,
              livemode: pi.livemode ?? false,
              receiptEmail: pi.receipt_email ?? null,
              metadata: (pi.metadata ?? {}) as unknown as Prisma.InputJsonValue,
              paidAt: new Date(),
              stripeEventLastId: event.id,
              bookingId: pi.metadata?.bookingId
                ? Number(pi.metadata.bookingId)
                : undefined,
              userId: pi.metadata?.userId
                ? Number(pi.metadata.userId)
                : undefined,
            },
          });
          if (pi.metadata?.bookingId) {
            const bookingId = Number(pi.metadata.bookingId);
            const booking = await tx.booking.findUnique({
              where: { id: bookingId },
            });
            if (booking && booking.status !== "BOOKED") {
              await tx.booking.update({
                where: { id: bookingId },
                data: {
                  status: "BOOKED",
                  paymentId: pay.id,
                },
              });

              ticketEmailBookingId = String(bookingId);
              ticketEmailTo = pi.receipt_email ?? objReceiptEmail;
              ticketEmailName =
                (typeof pi.metadata?.customerName === "string"
                  ? pi.metadata.customerName
                  : objCustomerName) || "";
              shouldEmailTicket = Boolean(ticketEmailTo);
            }
          }
        }

        //Failed Payment Case
        if (event.type === "payment_intent.payment_failed") {
          const pi = event.data.object as Stripe.PaymentIntent;

          await tx.payment.upsert({
            where: { stripePaymentIntentId: pi.id },
            create: {
              provider: "CARD",
              status: "FAILED",
              amountCents: pi.amount,
              currency: pi.currency,
              stripePaymentIntentId: pi.id,
              stripeCustomerId: (pi.customer as string) ?? null,
              livemode: pi.livemode ?? false,
              receiptEmail: pi.receipt_email ?? null,
              metadata: (pi.metadata ?? {}) as unknown as Prisma.InputJsonValue,
              stripeEventLastId: event.id,
              bookingId: pi.metadata?.bookingId
                ? Number(pi.metadata.bookingId)
                : null,
              userId: pi.metadata?.userId ? Number(pi.metadata.userId) : null,
            },
            update: {
              status: "FAILED",
              stripeEventLastId: event.id,
            },
          });
        }

        if (event.type === "charge.refunded") {
          const charge = event.data.object as Stripe.Charge;

          const paymentIntentId =
            typeof charge.payment_intent === "string"
              ? charge.payment_intent
              : charge.payment_intent?.id;

          if (paymentIntentId) {
            await tx.payment.update({
              where: { stripePaymentIntentId: paymentIntentId },
              data: {
                status: "REFUNDED",
                stripeEventLastId: event.id,
              },
            });

            const payment = await tx.payment.findUnique({
              where: { stripePaymentIntentId: paymentIntentId },
              select: { bookingId: true },
            });

            if (payment?.bookingId) {
              await tx.booking.update({
                where: { id: payment.bookingId },
                data: { status: "CANCELLED" },
              });
            }
          }
        }

        if (paymentIntentId) {
          const pay = await tx.payment.findUnique({
            where: { stripePaymentIntentId: paymentIntentId },
            select: { id: true },
          });
          if (pay) {
            await tx.stripeEvent.update({
              where: { id: stripeEvent.id },
              data: { paymentId: pay.id },
            });
          }
        }
      });

      if (shouldEmailTicket && ticketEmailBookingId && ticketEmailTo) {
        try {
          await emailTicket(
            ticketEmailBookingId,
            ticketEmailTo,
            ticketEmailName
          );
        } catch (error) {
          // Don't fail the webhook after the payment was recorded.
          console.error("Failed to send ticket email", error);
        }
      }
      return NextResponse.json({ received: true });
    } catch (error) {
      console.error(error);
      return NextResponse.json(
        { error: "Webhook processing error" },
        { status: 500 }
      );
    }
  } catch {
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
