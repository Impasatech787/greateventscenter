import { withAuth } from "@/lib/withAuth";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const GET = withAuth(
  async (_req: NextRequest, _params: unknown) => {
    try {
      const bookings = await prisma.booking.findMany({
        select: {
          id: true,
          priceCents: true,
          show: {
            select: {
              movie: { select: { title: true } },
              auditorium: {
                select: { name: true, cinema: { select: { name: true } } },
              },
              startAt: true,
            },
          },
          user: {
            select: {
              email: true,
              firstName: true,
              lastName: true,
              id: true,
            },
          },
          createdAt: true,
          status: true,
          bookingSeats: {
            include: {
              seat: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      });
      const result = bookings.map((b) => ({
        id: b.id,
        movieTitle: b.show.movie?.title || "Untitled Movie",
        auditoriumName: b.show.auditorium.name,
        cinemaName: b.show.auditorium.cinema.name,
        startAt: b.show.startAt,
        user: b.user,
        status: b.status,
        bookedAt: b.createdAt,
        totalAmount: b.priceCents,
        seats: b.bookingSeats.map((seat) => {
          return {
            name: `${seat.seat?.row}-${seat.seat?.number}`,
            type: `${seat.seat?.seatType}`,
          };
        }),
      }));
      return NextResponse.json({ data: result }, { status: 200 });
    } catch {
      return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
  },
  ["Admin"],
);
