import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/withAuth";

export const GET = withAuth(async (req: NextRequest, params: any) => {
  try {
    const id = Number(params.id);
    const auditorium = await prisma.auditorium.findUnique({
        where: {id},
        include: {cinema: true}
    });
    if(!auditorium)
        return NextResponse.json({ error: "Auditorium not found" }, { status: 404 });

    const data = {
      id: auditorium.id,
      name: auditorium.name,
      cinemaId: auditorium.cinemaId,
      cinemaName: auditorium.cinema.name
    };
    return NextResponse.json({ data, message: "Success!" }, { status: 200 });
  } catch (ex) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}, ["Admin"]);

export const DELETE = withAuth(async (req: NextRequest, params: any) => {
  try {
    const id = Number(params.id);
    const auditorium = await prisma.auditorium.findUnique({
        where: {id: id}
    });
    if(!auditorium){
        return NextResponse.json({ error: "Auditorium not found" }, { status: 404 });
    }
    await prisma.auditorium.delete({ where: { id } });

    return NextResponse.json({ data: id, message: "Success!" }, { status: 200 });
  } catch (ex) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}, ["Admin"]);

export const PATCH = withAuth(async (req: NextRequest, params: any) => {
  try {
    const id = Number(params.id);
    const auditorium = await prisma.auditorium.findUnique({
        where: {id}
    });
    if(!auditorium){
        return NextResponse.json({ error: "Auditorium not found" }, { status: 404 });
    }
    const body = await req.json();
    const { name, cinemaId } = body;
    const cinema = await prisma.cinema.findUnique({
        where: {id: cinemaId}
    });
    if(!cinema){
        return NextResponse.json({ error: "Cinema not found" }, { status: 404 });
    }
    await prisma.auditorium.update({ where: { id }, data: { name, cinemaId }});
    
    return NextResponse.json({ data: id, message: "Success!" }, { status: 200 });
  } catch (ex) {
    console.log(ex);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}, ["Admin"]);