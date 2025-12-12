import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/withAuth";

export const GET = withAuth(async (req: NextRequest) => {
  try {
    const cinemas = await prisma.cinema.findMany({
    });

    const data = cinemas.map(u => ({
      id: u.id,
      name: u.name,
    }));    
    return NextResponse.json({ data, message: "Success!" }, { status: 200 });
  } catch (ex) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}, ["Admin"]);

export const POST = withAuth(async (req: NextRequest) => {
  try {
    const body = await req.json();
    const { name } = body;
    const data = await prisma.cinema.create({
      data: {name}
    });
    return NextResponse.json({ data: data.id, message: "Success!" }, { status: 200 });
  } catch (ex) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}, ["Admin"]);

