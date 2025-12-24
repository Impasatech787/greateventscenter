import { withAuth } from "@/lib/withAuth";
import { NextRequest, NextResponse } from "next/server";
import { stripe } from "../route";
import { prisma } from "@/lib/prisma";
import { BookingStatus, PaymentMethod } from "@/app/generated/prisma/edge";
import { AuthUser } from "@/lib/auth";

export const POST = withAuth(
  async (req: NextRequest, _params: unknown, user: AuthUser) => {
    try {
      const body = await req.json();
      const paymentSessionId = body?.paymentSessionId;
      if (!paymentSessionId) {
        return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
      }
      // Here you would typically verify the payment session with your payment provider
      // and confirm the booking in your database.
      try {
        const session = await stripe.checkout.sessions.retrieve(
          paymentSessionId
        );
        const paymentReferenceId = session.payment_intent as string;
        if (session.payment_status === "paid") {
          //get movie title, auditorium name, event venue ,event date from show id,

          const showDetails = await prisma.show.findUnique({
            where: { id: Number(session.metadata?.showId) },
            include: {
              movie: { select: { title: true } },
              auditorium: {
                select: {
                  name: true,
                  cinema: { select: { name: true, location: true } },
                },
              },
            },
          });
          //get bookingSeats for the booking id from session metadata
          const bookingSeats = await prisma.bookingSeat.findMany({
            where: { bookingId: Number(session.metadata?.bookingId) },
            include: { seat: true },
          });

          const invoiveDetail = {
            movieTitle: showDetails?.movie?.title,
            auditoriumName: showDetails?.auditorium?.name,
            cinemaName: showDetails?.auditorium?.cinema?.name,
            cinemaLocation: showDetails?.auditorium?.cinema?.location,
            eventDate: showDetails?.startAt,
            seats: bookingSeats.map((bs) => ({
              seat: (bs.seat?.row ?? "") + (bs.seat?.number ?? ""),
              seatType: bs.seat?.seatType,
            })),
            priceCents: session.amount_total ?? 0,
            userEmail: user?.email ?? "Unknown",
          };

          //first create invoice record after payment is successful

          const invoice = await prisma.invoice.create({
            data: {
              priceCents: session.amount_total ?? 0,
              paymentMethod: PaymentMethod.CARD,
              userName: user?.email ?? "Unknown",
              remarks: `Stripe Payment Intent: ${session.payment_intent}`,
              detailJson: JSON.stringify(invoiveDetail),
            },
          });

          // Payment successful, confirm the booking in your database with prisma

          const bookingId = session.metadata?.bookingId;
          if (bookingId) {
            await prisma.booking.update({
              where: { id: Number(bookingId) },
              data: {
                status: BookingStatus.BOOKED,
                paymentReferenceId: paymentReferenceId,
                paymentMethod: PaymentMethod.CARD,
                invoiceId: invoice.id,
              },
            });
          }
          return NextResponse.json(
            { data: { status: "Booking confirmed" }, message: "Success!" },
            { status: 200 }
          );
        } else {
          // Payment not successful
          return NextResponse.json(
            { error: "Payment not completed" },
            { status: 400 }
          );
        }
      } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
      }
    } catch (error) {
      console.error(error);
      return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
  }
);
