import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/withAuth";

export const GET = withAuth(
  async (req: NextRequest) => {
    try {
      const shows = await prisma.show.findMany({});

      //return movie name and auditorium name along with ids
      const showsWithDetails = await Promise.all(
        shows.map(async (show) => {
          const movie = await prisma.movie.findUnique({
            where: { id: show.movieId ?? undefined },
          });
          const auditorium = await prisma.auditorium.findUnique({
            where: { id: show.auditoriumId },
          });
          return {
            ...show,
            movieTitle: movie?.title || "Unknown",
            auditoriumName: auditorium?.name || "Unknown",
          };
        })
      );

      const data = showsWithDetails.map((u) => ({
        id: u.id,
        movieId: u.movieId,
        movieTitle: u.movieTitle,
        auditoriumName: u.auditoriumName,
        startAt: u.startAt,
        auditoriumId: u.auditoriumId,
      }));
      return NextResponse.json({ data, message: "Success!" }, { status: 200 });
    } catch (ex) {
      return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
  },
  ["Admin"]
);

export const POST = withAuth(
  async (req: NextRequest) => {
    try {
      const body = await req.json();
      const { movieId, startAt, auditoriumId } = body;

      const data = await prisma.show.create({
        data: { movieId, startAt, auditoriumId },
      });
      return NextResponse.json(
        { data: data.id, message: "Success!" },
        { status: 200 }
      );
    } catch (ex) {
      return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
  },
  ["Admin"]
);
