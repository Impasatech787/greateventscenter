import { NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";

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
        process.env.STRIPE_WEBHOOK_SECRET!,
      );
    } catch (error) {
      return new Response(`Webhook Error ${error}`, { status: 400 });
    }
    try {
      await prisma.$transaction(async (tx) => {
        const existing = await tx.stripeEvent.findUnique({
          where: { stripeEventId: event.id },
          select: { id: true },
        });
        if (existing) return;
        const obj: any = event.data.object;

        const paymentIntentId: string | null =
          obj?.object == "payment_intent"
            ? obj.id
            : (obj?.payment_intent ?? null);

        const stripeEvent = await tx.stripeEvent.create({
          data: {
            stripeEventId: event.id,
            type: event.type,
            livemode: event.livemode ?? false,
            created: typeof event.created === "number" ? event.created : null,
            processedAt: new Date(),
            payload: event as any,
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
              metadata: (pi.metadata ?? {}) as any,
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
              metadata: (pi.metadata ?? {}) as any,
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
              metadata: (pi.metadata ?? {}) as any,
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

        // Link the stripeEvent to payment if we have payment id
        // (optional, but nice)
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
      return NextResponse.json({ received: true });
    } catch (error) {
      console.error(error);
      return NextResponse.json(
        { error: "Webhook processing error" },
        { status: 500 },
      );
    }
  } catch {
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
