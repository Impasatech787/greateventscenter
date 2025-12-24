import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/withAuth";

export const GET = withAuth(
  async (req: NextRequest, params: unknown) => {
    try {
      const id = Number((params as { id: string }).id);
      const auditorium = await prisma.auditorium.findUnique({
        where: { id },
        include: { cinema: true },
      });
      if (!auditorium)
        return NextResponse.json(
          { error: "Auditorium not found" },
          { status: 404 }
        );

      // Along with the auditorium details return the distinct SeatTypes used in this auditorium.
      const seatTypeRows = await prisma.seat.findMany({
        where: { auditoriumId: id },
        distinct: ["seatType"],
        select: { seatType: true },
      });
      const seatTypes = seatTypeRows.map((s) => s.seatType);

      const data = {
        id: auditorium.id,
        name: auditorium.name,
        cinemaId: auditorium.cinemaId,
        cinemaName: auditorium.cinema.name,
        seatTypes,
      };
      return NextResponse.json({ data, message: "Success!" }, { status: 200 });
    } catch {
      return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
  },
  ["Admin"]
);

export const DELETE = withAuth(
  async (req: NextRequest, params: unknown) => {
    try {
      const id = Number((params as { id: string }).id);
      const auditorium = await prisma.auditorium.findUnique({
        where: { id: id },
      });
      if (!auditorium) {
        return NextResponse.json(
          { error: "Auditorium not found" },
          { status: 404 }
        );
      }
      await prisma.auditorium.delete({ where: { id } });

      return NextResponse.json(
        { data: id, message: "Success!" },
        { status: 200 }
      );
    } catch {
      return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
  },
  ["Admin"]
);

export const PATCH = withAuth(
  async (req: NextRequest, params: unknown) => {
    try {
      const id = Number((params as { id: string }).id);
      const auditorium = await prisma.auditorium.findUnique({
        where: { id },
      });
      if (!auditorium) {
        return NextResponse.json(
          { error: "Auditorium not found" },
          { status: 404 }
        );
      }
      const body = await req.json();
      const { name, cinemaId } = body;
      const cinema = await prisma.cinema.findUnique({
        where: { id: cinemaId },
      });
      if (!cinema) {
        return NextResponse.json(
          { error: "Cinema not found" },
          { status: 404 }
        );
      }
      await prisma.auditorium.update({
        where: { id },
        data: { name, cinemaId },
      });

      return NextResponse.json(
        { data: id, message: "Success!" },
        { status: 200 }
      );
    } catch (ex) {
      console.log(ex);
      return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
  },
  ["Admin"]
);
