import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/withAuth";

export const GET = withAuth(async (req: NextRequest, params: any) => {
  try {
    const id = Number(params.id);
    const cinema = await prisma.cinema.findUnique({
        where: {id: id}
    });
    if(!cinema)
        return NextResponse.json({ error: "Cinema not found" }, { status: 404 });

    const data = {
      id: cinema.id,
      name: cinema.name,
    };
    return NextResponse.json({ data, message: "Success!" }, { status: 200 });
  } catch (ex) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}, ["Admin"]);

export const DELETE = withAuth(async (req: NextRequest, params: any) => {
  try {
    const id = Number(params.id);
    const cinema = await prisma.cinema.findUnique({
        where: {id: id}
    });
    if(!cinema){
        return NextResponse.json({ error: "Cinema not found" }, { status: 404 });
    }
    await prisma.cinema.delete({ where: { id } });

    return NextResponse.json({ data: id, message: "Success!" }, { status: 200 });
  } catch (ex) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}, ["Admin"]);

export const PATCH = withAuth(async (req: NextRequest, params: any) => {
  try {
    const id = Number(params.id);
    const cinema = await prisma.cinema.findUnique({
        where: {id}
    });
    if(!cinema){
        return NextResponse.json({ error: "Cinema not found" }, { status: 404 });
    }
    const body = await req.json();
    const { name } = body;
    await prisma.cinema.update({ where: { id }, data: { name }});
    
    return NextResponse.json({ data: id, message: "Success!" }, { status: 200 });
  } catch (ex) {
    console.log(ex);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}, ["Admin"]);