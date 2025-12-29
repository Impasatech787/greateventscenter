import { withAuth } from "@/lib/withAuth";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const POST = withAuth(
  async (req: NextRequest, _params: unknown) => {
    try {
      const body = await req.json();
      const bookingId = body.bookingId ?? null;
      const movieId = body.movieId ?? null;
      const showId = body.showId ?? null;
      const cinemaId = body.cinemaId ?? null;
      const showDate = body.showDate ?? "";
      const startOfDay = new Date(showDate);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(showDate);
      endOfDay.setHours(23, 59, 59, 999);

      const where: any = { show: {} };

      if (bookingId != null) {
        where.id = Number(bookingId);
      }

      if (showId != null) {
        where.show.id = Number(showId);
      }

      if (showDate != "")
        where.show = {
          ...where.show,
          startAt: { gte: startOfDay, lte: endOfDay },
        };
      if (movieId != null) where.show.movieId = Number(movieId);
      if (cinemaId != null)
        where.show.auditorium = { cinemaId: Number(cinemaId) };
      const bookings = await prisma?.booking.findMany({
        where,
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
      return NextResponse.json(
        {
          data: result,
          message: "Bookings Retrieved Successfullt",
        },
        { status: 200 }
      );
    } catch (error) {
      console.error(error);
      return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
  },
  ["Admin"]
);
