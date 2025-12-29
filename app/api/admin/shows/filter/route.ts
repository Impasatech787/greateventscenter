import { withAuth } from "@/lib/withAuth";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const POST = withAuth(
  async (req: NextRequest, _params: unknown) => {
    try {
      const body = await req.json();
      const movieId = body.movieId ?? null;
      const cinemaId = body.cinemaId ?? null;
      const showDate = body.showDate ?? "";
      const startOfDay = new Date(showDate);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(showDate);
      endOfDay.setHours(23, 59, 59, 999);

      const where: any = {};
      if (movieId != null) where.movieId = Number(movieId);
      if (showDate != "") where.startAt = { gte: startOfDay, lte: endOfDay };
      if (cinemaId != null) where.auditorium = { cinemaId: Number(cinemaId) };

      const shows = await prisma?.show.findMany({
        where,
        select: {
          id: true,
          auditorium: {
            select: { name: true },
          },
          startAt: true,
        },
      });
      const result = shows.map((show) => ({
        id: show.id,
        audiName: show.auditorium.name,
        startTime: show.startAt,
      }));
      return NextResponse.json(
        {
          data: result,
          message: "Bookings Retrieved Successfullt",
        },
        { status: 200 },
      );
    } catch (error) {
      console.error(error);
      return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
  },
  ["Admin"],
);
