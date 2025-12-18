import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/withAuth";

export const GET = withAuth(async (req: NextRequest) => {
  try {
    const movies = await prisma.movie.findMany({
    });

    const data = movies.map(u => ({
      id: u.id,
      title: u.title,
      description: u.description,
      durationMin: u.durationMin,
      language: u.language,
      releaseDate: u.releaseDate,
      posterUrl: u.posterUrl,
      trailerUrl: u.trailerUrl,
      genres: u.genres,
      createdAt: u.createdAt,
      updatedAt: u.updatedAt,
    }));
    return NextResponse.json({ data, message: "Success!" }, { status: 200 });
  } catch (ex) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
});

export const POST = withAuth(async (req: NextRequest) => {
  try {
    const body = await req.json();
    const { title, description, durationMin, language, releaseDate, trailerUrl, genres } = body;
    const data = await prisma.movie.create({
      data: { title, description, durationMin, language, releaseDate, trailerUrl, genres }
    });
    return NextResponse.json({ data: data.id, message: "Success!" }, { status: 200 });
  } catch (ex) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}, ["Admin"]);