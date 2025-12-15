import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/withAuth";

export const GET = withAuth(async (req: NextRequest, params: any) => {
  try {
    const id = Number(params.id);
    const seat = await prisma.seat.findUnique({
        where: {id},
        include:{
          auditorium: true
        }
    });
    if(!seat)
        return NextResponse.json({ error: "Seat not found" }, { status: 404 });

    const data = {
      id: seat.id,
      row: seat.row,
      number: seat.number,
      auditoriumId: seat.auditoriumId,
      auditoriumName: seat.auditorium.name,
      seatType: seat.seatType,
      rowOffset: seat.rowOffset,
      columnOffset: seat.columnOffset
    };
    return NextResponse.json({ data, message: "Success!" }, { status: 200 });
  } catch (ex) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}, ["Admin"]);

export const DELETE = withAuth(async (req: NextRequest, params: any) => {
  try {
    const id = Number(params.id);
    const seat = await prisma.seat.findUnique({
        where: {id: id}
    });
    if(!seat){
        return NextResponse.json({ error: "Seat not found" }, { status: 404 });
    }
    await prisma.seat.delete({ where: { id } });

    return NextResponse.json({ data: id, message: "Success!" }, { status: 200 });
  } catch (ex) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}, ["Admin"]);

export const PATCH = withAuth(async (req: NextRequest, params: any) => {
  try {
    const id = Number(params.id);
    const seat = await prisma.seat.findUnique({
        where: {id}
    });
    if(!seat){
        return NextResponse.json({ error: "Seat not found" }, { status: 404 });
    }
    const body = await req.json();
    const { auditoriumId, row, number, seatType, rowOffset, columnOffset } = body;
    await prisma.seat.update({ where: { id }, data: { auditoriumId, row, number, seatType, rowOffset, columnOffset }});
    
    return NextResponse.json({ data: id, message: "Success!" }, { status: 200 });
  } catch (ex) {
    console.log(ex);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}, ["Admin"]);