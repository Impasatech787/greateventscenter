import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/withAuth";
import { slugify } from "@/lib/slug";

export const GET = withAuth(async (req: NextRequest) => {
  try {
    const movies = await prisma.movie.findMany({
    });

    const data = movies.map(u => ({
      id: u.id,
      slug: u.slug,
      title: u.title,
      description: u.description,
      durationMin: u.durationMin,
      language: u.language,
      releaseDate: u.releaseDate,
      posterUrl: u.posterUrl,
      trailerUrl: u.trailerUrl,
      genres: u.genres,
      casts: u.casts,
      rating: u.rating,
      createdAt: u.createdAt,
      updatedAt: u.updatedAt,
    }));
    return NextResponse.json({ data, message: "Success!" }, { status: 200 });
  } catch (ex) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}, ["Admin"]);

export const POST = withAuth(async (req: NextRequest) => {
  try {
    const body = await req.json();
    const { title, description, durationMin, language, releaseDate, trailerUrl, genres, casts, rating } = body;

    const slug = slugify(title);
    const slugExists = await prisma.movie.findUnique({
      where: { slug }
    });
    if(slugExists){
      return NextResponse.json({ error: "Similar title already exists!" }, { status: 400 });
    }
    
    const data = await prisma.movie.create({
      data: { slug, title, description, durationMin, language, releaseDate, trailerUrl, genres, casts, rating }
    });
    return NextResponse.json({ data: data.id, message: "Success!" }, { status: 200 });
  } catch (ex) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}, ["Admin"]);