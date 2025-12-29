import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/withAuth";

export const GET = withAuth(
  async (req: NextRequest) => {
    try {
      const { searchParams } = new URL(req.url);
      const cinemaName = searchParams.get("name");
      const cinemas = await prisma.cinema.findMany({
        where: {
          name: {
            contains: cinemaName ?? "",
            mode: "insensitive",
          },
        },
      });

      const data = cinemas.map((u) => ({
        id: u.id,
        name: u.name,
        location: u.location,
      }));
      return NextResponse.json({ data, message: "Success!" }, { status: 200 });
    } catch (ex) {
      return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
  },
  ["Admin"],
);

export const POST = withAuth(
  async (req: NextRequest) => {
    try {
      const body = await req.json();
      const { name, location } = body;
      const data = await prisma.cinema.create({
        data: { name, location },
      });
      return NextResponse.json(
        { data: data.id, message: "Success!" },
        { status: 200 },
      );
    } catch (ex) {
      return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
  },
  ["Admin"],
);
