import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest, ctx: any) => {
  try {
    const params = await ctx.params;
    const slug = params.slug;
    const now = new Date();
    const movie = await prisma.movie.findUnique({
      where: {
        slug,
      },
      include: {
        shows: {
          where: {
            startAt: {
              gte: now
            }
          },
          select: {
              id: true,
              startAt: true
          }
        }
      }   
    });
    if(!movie) {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    const data = {
      id: movie.id,
      slug: movie.slug,
      title: movie.title,
      description: movie.description,
      durationMin: movie.durationMin,
      language: movie.language,
      posterUrl: movie.posterUrl,
      trailerUrl: movie.trailerUrl,
      genres: movie.genres,
      casts: movie.casts,
      rating: movie.rating,
      shows: movie.shows.map(s => ({
        id: s.id,
        startAt: s.startAt
      }))
    };
    return NextResponse.json({ data, message: "Success!" }, { status: 200 });
  } catch (ex) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
};