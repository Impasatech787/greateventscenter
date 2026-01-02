import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status") ?? "Scheduled";

    const events = await prisma.event.findMany({
      where: {
        status: {
          equals: status,
          mode: "insensitive",
        },
      },
      include: {
        cinema: {
          select: {
            id: true,
            name: true,
            location: true,
          },
        },
      },
      orderBy: [{ date: "asc" }, { startTime: "asc" }],
    });

    const data = events.map((event) => ({
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
    }));

    return NextResponse.json({ data, message: "Success!" }, { status: 200 });
  } catch (ex) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
};
