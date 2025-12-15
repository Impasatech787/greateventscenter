import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/withAuth";

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
      title: movie.title,
      description: movie.description,
      durationMin: movie.durationMin,
      language: movie.language,
      releaseDate: movie.releaseDate,
      posterUrl: movie.posterUrl,
      trailerUrl: movie.trailerUrl,
      genres: movie.genres,
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
    const { title, description, durationMin, language, releaseDate, trailerUrl, genres } = body;
    await prisma.movie.update({ where: { id }, data: { title, description, durationMin, language, releaseDate, trailerUrl, genres }});
    
    return NextResponse.json({ data: id, message: "Success!" }, { status: 200 });
  } catch (ex) {
    console.log(ex);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}, ["Admin"]);