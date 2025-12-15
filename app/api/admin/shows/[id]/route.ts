import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/withAuth";

export const GET = withAuth(async (req: NextRequest, params: any) => {
  try {
    const id = Number(params.id);
    const show = await prisma.show.findUnique({
        where: {id: id}
    });
    if(!show)
        return NextResponse.json({ error: "Show not found" }, { status: 404 });

    const data = {
      id: show.id,
      movieId: show.movieId,
      startAt: show.startAt,
      auditoriumId: show.auditoriumId,
    };
    return NextResponse.json({ data, message: "Success!" }, { status: 200 });
  } catch (ex) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}, ["Admin"]);

export const DELETE = withAuth(async (req: NextRequest, params: any) => {
  try {
    const id = Number(params.id);
    const show = await prisma.show.findUnique({
        where: {id: id}
    });
    if(!show){
        return NextResponse.json({ error: "Show not found" }, { status: 404 });
    }
    await prisma.show.delete({ where: { id } });

    return NextResponse.json({ data: id, message: "Success!" }, { status: 200 });
  } catch (ex) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}, ["Admin"]);

export const PATCH = withAuth(async (req: NextRequest, params: any) => {
  try {
    const id = Number(params.id);
    const show = await prisma.show.findUnique({
        where: {id}
    });
    if(!show){
        return NextResponse.json({ error: "Show not found" }, { status: 404 });
    }
    const body = await req.json();
    const { movieId, startAt, auditoriumId } = body;
    await prisma.show.update({ where: { id }, data: { movieId, startAt, auditoriumId }});
    
    return NextResponse.json({ data: id, message: "Success!" }, { status: 200 });
  } catch (ex) {
    console.log(ex);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}, ["Admin"]);