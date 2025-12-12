import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/withAuth";

export const GET = withAuth(async (req: NextRequest) => {
  try {
    const auditoriums = await prisma.auditorium.findMany({
      include: {
        cinema: true
      }
    });

    const data = auditoriums.map(u => ({
      id: u.id,
      name: u.name,
      cinemaId: u.cinemaId,
      cinemaName: u.cinema.name
    }));    
    return NextResponse.json({ data, message: "Success!" }, { status: 200 });
  } catch (ex) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}, ["Admin"]);

export const POST = withAuth(async (req: NextRequest) => {
  try {
    const body = await req.json();
    const { name, cinemaId } = body;
    const cinema = await prisma.cinema.findUnique({
        where: {id: cinemaId}
    });
    if(!cinema){
        return NextResponse.json({ error: "Cinema not found" }, { status: 404 });
    }
    const data = await prisma.auditorium.create({
      data: {name, cinemaId}
    });
    return NextResponse.json({ data, message: "Success!" }, { status: 200 });
  } catch (ex) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}, ["Admin"]);

