import { withAuth } from "@/lib/withAuth";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const GET = withAuth(
  async (_req: NextRequest, params: { id: string }) => {
    try {
      const id = Number(params.id);
      if (!Number.isFinite(id)) {
        return NextResponse.json(
          { error: "Invalid booking id" },
          { status: 400 },
        );
      }

      const booking = await prisma.booking.findUnique({
        where: { id },
        select: {
          id: true,
          showId: true,
          status: true,
          expiresAt: true,
          reservedAt: true,
          createdAt: true,
          priceCents: true,
          invoiceId: true,
          user: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
            },
          },
          payment: true,
          show: {
            select: {
              id: true,
              startAt: true,
              movie: {
                select: {
                  id: true,
                  title: true,
                  durationMin: true,
                  genres: true,
                  rating: true,
                },
              },
              auditorium: {
                select: {
                  id: true,
                  name: true,
                  cinema: {
                    select: {
                      id: true,
                      name: true,
                      location: true,
                    },
                  },
                },
              },
            },
          },
          bookingSeats: {
            include: {
              seat: true,
            },
          },
        },
      });

      if (!booking) {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
      }

      const data = {
        id: booking.id,
        showId: booking.showId,
        status: booking.status,
        createdAt: booking.createdAt,
        reservedAt: booking.reservedAt,
        expiresAt: booking.expiresAt,
        priceCents: booking.priceCents,
        invoiceId: booking.invoiceId,
        paymentMethod: booking.payment?.provider,
        paymentReferenceId: booking.payment?.stripePaymentIntentId,
        user: booking.user,
        show: booking.show,
        seats: booking.bookingSeats.map((bs) => ({
          id: bs.id,
          seatId: bs.seatId,
          name:
            bs.seat?.row && bs.seat?.number
              ? `${bs.seat.row}-${bs.seat.number}`
              : "Unknown",
          type: bs.seat?.seatType ?? null,
        })),
      };

      return NextResponse.json({ data }, { status: 200 });
    } catch (error) {
      console.error(error);
      return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
  },
  ["Admin"],
);
