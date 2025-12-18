import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/withAuth";
import { slugify } from "@/lib/slug";

export const GET = withAuth(async (req: NextRequest, params: any) => {
  try {
    const id = Number(params.id);
    const movie = await prisma.movie.findUnique({
        where: {id: id}
    });
    if(!movie)
        return NextResponse.json({ error: "Movie not found" }, { status: 404 });

    const data = {
      id: movie.id,
      slug: movie.slug,
      title: movie.title,
      description: movie.description,
      durationMin: movie.durationMin,
      language: movie.language,
      releaseDate: movie.releaseDate,
      posterUrl: movie.posterUrl,
      trailerUrl: movie.trailerUrl,
      genres: movie.genres,
      casts: movie.casts,
      rating: movie.rating,
      createdAt: movie.createdAt,
      updatedAt: movie.updatedAt,
    };
    return NextResponse.json({ data, message: "Success!" }, { status: 200 });
  } catch (ex) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}, ["Admin"]);

export const DELETE = withAuth(async (req: NextRequest, params: any) => {
  try {
    const id = Number(params.id);
    const movie = await prisma.movie.findUnique({
        where: {id: id}
    });
    if(!movie){
        return NextResponse.json({ error: "Movie not found" }, { status: 404 });
    }
    await prisma.movie.delete({ where: { id } });

    return NextResponse.json({ data: id, message: "Success!" }, { status: 200 });
  } catch (ex) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}, ["Admin"]);

export const PATCH = withAuth(async (req: NextRequest, params: any) => {
  try {
    const id = Number(params.id);
    const movie = await prisma.movie.findUnique({
        where: {id}
    });
    if(!movie){
        return NextResponse.json({ error: "Movie not found" }, { status: 404 });
    }
    const body = await req.json();
    const { title, description, durationMin, language, releaseDate, trailerUrl, genres, casts, rating } = body;

    const slug = slugify(title);
    const slugExists = await prisma.movie.findFirst({
      where: {
        id: {
          not: id
        },
        slug
      }
    });
    if(slugExists){
      return NextResponse.json({ error: "Similar title already exists!" }, { status: 400 });
    }

    await prisma.movie.update({
      where: { id },
      data: { slug, title, description, durationMin, language, releaseDate, trailerUrl, genres, casts, rating }});
    
    return NextResponse.json({ data: id, message: "Success!" }, { status: 200 });
  } catch (ex) {
    console.log(ex);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}, ["Admin"]);