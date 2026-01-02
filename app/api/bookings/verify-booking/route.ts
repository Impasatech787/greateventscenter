import { withAuth } from "@/lib/withAuth";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { BookingStatus, PaymentMethod } from "@/app/generated/prisma/edge";
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
      if (!paymentSessionId) {
        return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
      }

      try {
        const session = await stripe.checkout.sessions.retrieve(
          paymentSessionId,
          { expand: ["payment_intent", "customer"] },
        );
        const bookingIdFromStripe = session.metadata?.bookingId;
        const showIdFromStripe = session.metadata?.showId;

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

        const booking = await prisma.booking.findUnique({
          where: { id: bookingId },
        });

        if (!booking) {
          return NextResponse.json(
            { error: "Booking not found" },
            { status: 404 },
          );
        }

        // If you require bookings to be tied to a user:
        if (booking.userId && booking.userId !== Number(user.userId)) {
          return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }
        if (session.payment_status !== "paid") {
          return NextResponse.json(
            { error: "Payment not completed" },
            { status: 400 },
          );
        }

        // 5) Validate money (VERY important)
        const paidAmount = session.amount_total ?? 0;
        const paidCurrency = (session.currency ?? "").toLowerCase();

        // If you know expected amount:
        if (paidAmount !== booking.priceCents) {
          return NextResponse.json(
            { error: "Payment amount mismatch" },
            { status: 400 },
          );
        }

        const paymentIntentId =
          typeof session.payment_intent === "string"
            ? session.payment_intent
            : session.payment_intent?.id;

        if (!paymentIntentId) {
          return NextResponse.json(
            { error: "Missing payment_intent" },
            { status: 400 },
          );
        }
        // 6) Compute invoice details (you can reuse your existing logic)
        const showDetails = showIdFromStripe
          ? await prisma.show.findUnique({
              where: { id: Number(showIdFromStripe) },
              include: {
                movie: { select: { title: true } },
                auditorium: {
                  select: {
                    name: true,
                    cinema: { select: { name: true, location: true } },
                  },
                },
              },
            })
          : null;

        const bookingSeats = await prisma.bookingSeat.findMany({
          where: { bookingId },
          include: { seat: true },
        });

        const invoiceDetail = {
          movieTitle: showDetails?.movie?.title,
          auditoriumName: showDetails?.auditorium?.name,
          cinemaName: showDetails?.auditorium?.cinema?.name,
          cinemaLocation: showDetails?.auditorium?.cinema?.location,
          eventDate: showDetails?.startAt,
          seats: bookingSeats.map((bs) => ({
            seat: (bs.seat?.row ?? "") + (bs.seat?.number ?? ""),
            seatType: bs.seat?.seatType,
          })),
          priceCents: paidAmount,
          currency: paidCurrency,
          userEmail: user?.email ?? "Unknown",
          stripeCheckoutSessionId: session.id,
          stripePaymentIntentId: paymentIntentId,
        };

        // 7) Transaction: create invoice + mark booking booked atomically
        // Also: ensure we don't create multiple invoices on refresh.
        //
        //
        const result = await prisma.$transaction(async (tx) => {
          const booking = await tx.booking.findUnique({
            where: { id: bookingId },
          });
          if (!booking) throw new Error("Booking not found");
          if (booking.status === BookingStatus.BOOKED)
            return { already: true as const };

          const pay = await tx.payment.upsert({
            where: { stripePaymentIntentId: paymentIntentId },
            create: {
              status: "SUCCEEDED",
              provider: "CARD",
              amountCents: paidAmount,
              currency: paidCurrency,
              userId: booking?.userId ?? Number(user.userId),
              bookingId: booking.id,
              livemode: session.livemode ?? false,
              stripePaymentIntentId: paymentIntentId,
              stripeCustomerId:
                typeof session.customer === "string"
                  ? session.customer
                  : session.customer?.id,
              receiptEmail:
                session.customer_details?.email ?? user.email ?? null,
              metadata: session.metadata ?? {},
              paidAt: new Date(),
            },
            update: {
              status: "SUCCEEDED",
              amountCents: paidAmount,
              currency: paidCurrency,
              bookingId: booking.id,
              userId: booking?.userId ?? Number(user.userId),
              livemode: session.livemode ?? false,
              stripeCustomerId:
                typeof session.customer === "string"
                  ? session.customer
                  : session.customer?.id,
              receiptEmail:
                session.customer_details?.email ?? user.email ?? null,
              metadata: session.metadata ?? {},
              paidAt: new Date(),
            },
          });

          const invoice = await tx.invoice.create({
            data: {
              priceCents: paidAmount,
              paymentMethod: PaymentMethod.CARD,
              userName: user?.email ?? "Unknown",
              remarks: `Stripe PI: ${paymentIntentId} | Session: ${session.id}`,
              detailJson: JSON.stringify(invoiceDetail),
            },
          });

          await tx.payment.update({
            where: { id: pay.id },
            data: { invoiceId: invoice.id },
          });

          await tx.booking.update({
            where: { id: bookingId },
            data: {
              status: BookingStatus.BOOKED,
              paymentId: pay.id,
              invoiceId: invoice.id,
              reservedAt: new Date(), // optional: record time of booking confirmation
            },
          });
          return { already: false as const, invoiceId: invoice.id };
        });
        return NextResponse.json(
          {
            data: {
              status: result.already
                ? "Already confirmed"
                : "Booking confirmed",
            },
            message: "Success!",
          },
          { status: 200 },
        );

        // const paymentReferenceId = session.payment_intent as string;
        // if (session.payment_status === "paid") {
        //   const showDetails = await prisma.show.findUnique({
        //     where: { id: Number(session.metadata?.showId) },
        //     include: {
        //       movie: { select: { title: true } },
        //       auditorium: {
        //         select: {
        //           name: true,
        //           cinema: { select: { name: true, location: true } },
        //         },
        //       },
        //     },
        //   });
        //   const bookingSeats = await prisma.bookingSeat.findMany({
        //     where: { bookingId: Number(session.metadata?.bookingId) },
        //     include: { seat: true },
        //   });
        //
        //   const invoiveDetail = {
        //     movieTitle: showDetails?.movie?.title,
        //     auditoriumName: showDetails?.auditorium?.name,
        //     cinemaName: showDetails?.auditorium?.cinema?.name,
        //     cinemaLocation: showDetails?.auditorium?.cinema?.location,
        //     eventDate: showDetails?.startAt,
        //     seats: bookingSeats.map((bs) => ({
        //       seat: (bs.seat?.row ?? "") + (bs.seat?.number ?? ""),
        //       seatType: bs.seat?.seatType,
        //     })),
        //     priceCents: session.amount_total ?? 0,
        //     userEmail: user?.email ?? "Unknown",
        //   };
        //
        //   const invoice = await prisma.invoice.create({
        //     data: {
        //       priceCents: session.amount_total ?? 0,
        //       paymentMethod: PaymentMethod.CARD,
        //       userName: user?.email ?? "Unknown",
        //       remarks: `Stripe Payment Intent: ${session.payment_intent}`,
        //       detailJson: JSON.stringify(invoiveDetail),
        //     },
        //   });
        //
        //   const bookingId = session.metadata?.bookingId;
        //   if (bookingId) {
        //     await prisma.booking.update({
        //       where: { id: Number(bookingId) },
        //       data: {
        //         status: BookingStatus.BOOKED,
        //         paymentReferenceId: paymentReferenceId,
        //         paymentMethod: PaymentMethod.CARD,
        //         invoiceId: invoice.id,
        //       },
        //     });
        //   }
        //   return NextResponse.json(
        //     { data: { status: "Booking confirmed" }, message: "Success!" },
        //     { status: 200 },
        //   );
        // } else {
        //   return NextResponse.json(
        //     { error: "Payment not completed" },
        //     { status: 400 },
        //   );
        // }
      } catch (error) {
        console.error(error);
        return NextResponse.json(
          {
            error:
              error instanceof Stripe.errors.StripeError
                ? error.message
                : "Server Error",
          },
          { status: 500 },
        );
      }
    } catch (error) {
      console.error(error);
      return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
  },
);
