import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/withAuth";

export const GET = withAuth(async (req: NextRequest, params: any) => {
  try {
    const { searchParams } = new URL(req.url);
    const auditoriumId = Number(searchParams.get("auditoriumId"));
    const seats = await prisma.seat.findMany({
      include: {
        auditorium: true
      },
      where: {
        ...(auditoriumId && {auditoriumId})
      }
    });

    const data = seats.map(u => ({
      id: u.id,
      auditoriumId: u.auditoriumId,
      auditoriumName: u.auditorium.name,
      row: u.row,
      number: u.number,
      seatType: u.seatType,
      rowOffset: u.rowOffset,
      columnOffset: u.columnOffset,
    }));    
    return NextResponse.json({ data, message: "Success!" }, { status: 200 });
  } catch (ex) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}, ["Admin"]);

export const POST = withAuth(async (req: NextRequest) => {
  try {
    const body = await req.json();
    const { auditoriumId, row, number, seatType, rowOffset, columnOffset } = body;
    const data = await prisma.seat.create({
      data: { auditoriumId, row, number, seatType, rowOffset, columnOffset }
    });
    return NextResponse.json({ data: data.id, message: "Success!" }, { status: 200 });
  } catch (ex) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}, ["Admin"]);