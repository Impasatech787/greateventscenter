import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (_req: NextRequest, params: any) => {
  try {
    const id = Number(params.id);
    if (!Number.isFinite(id)) {
      return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    }

    const event = await prisma.event.findUnique({
      where: { id },
      include: {
        cinema: {
          select: {
            id: true,
            name: true,
            location: true,
          },
        },
      },
    });

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    const data = {
      id: event.id,
      title: event.title,
      category: event.category,
      status: event.status,
      date: event.date.toISOString().split("T")[0],
      startTime: event.startTime,
      endTime: event.endTime,
      capacity: event.capacity,
      priceCents: event.priceCents,
      thumbnailUrl: event.thumbnailUrl,
      description: event.description,
      cinema: {
        id: event.cinema.id,
        name: event.cinema.name,
        location: event.cinema.location,
      },
    };

    return NextResponse.json({ data, message: "Success!" }, { status: 200 });
  } catch (ex) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
};
