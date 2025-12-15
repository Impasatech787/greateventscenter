import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/withAuth";

export const GET = withAuth(async (req: NextRequest) => {
  try {
    const shows = await prisma.show.findMany({
    });

    const data = shows.map(u => ({
      id: u.id,
      movieId: u.movieId,
      startAt: u.startAt,
      auditoriumId: u.auditoriumId,
    }));
    return NextResponse.json({ data, message: "Success!" }, { status: 200 });
  } catch (ex) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}, ["Admin"]);

export const POST = withAuth(async (req: NextRequest) => {
  try {
    const body = await req.json();
    const { movieId, startAt, auditoriumId } = body;
    const data = await prisma.show.create({
      data: { movieId, startAt, auditoriumId }
    });
    return NextResponse.json({ data: data.id, message: "Success!" }, { status: 200 });
  } catch (ex) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}, ["Admin"]);

