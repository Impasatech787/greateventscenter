import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/withAuth";

export const GET = async (req: NextRequest) => {
  try {
    const now = new Date();
    // Start of today
    const startOfToday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );

    // End of tomorrow
    const endOfTomorrow = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + 2
    );
    const movies = await prisma.movie.findMany({
      where: {
        shows: {
          some: {
            startAt: {
              gte: startOfToday,
              lt: endOfTomorrow
            }
          }
        }
      },
      orderBy: {
        releaseDate: "desc"
      }
    });

    const data = movies.map(u => ({
      id: u.id,
      slug: u.slug,
      title: u.title,
      durationMin: u.durationMin,
      language: u.language,
      posterUrl: u.posterUrl,
      genres: u.genres,
    }));
    return NextResponse.json({ data, message: "Success!" }, { status: 200 });
  } catch (ex) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
};