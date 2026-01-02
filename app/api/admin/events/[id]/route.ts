import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/withAuth";
import fs from "fs";
import path from "path";

const parseNumber = (value: unknown) => {
  if (value === null || value === undefined || value === "") return null;
  if (typeof value === "number") return value;
  if (typeof value === "string") {
    const parsed = Number(value);
    return Number.isNaN(parsed) ? null : parsed;
  }
  return null;
};

const parseDateOnly = (value: unknown) => {
  if (typeof value !== "string" || !value) return null;
  const parsed = new Date(`${value}T00:00:00`);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

export const GET = withAuth(
  async (req: NextRequest, params: any) => {
    try {
      const id = Number(params.id);
      const event = await prisma.event.findUnique({
        where: { id },
        include: {
          cinema: {
            select: {
              id: true,
              name: true,
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
        cinemaId: event.cinemaId,
        cinemaName: event.cinema.name,
        date: event.date.toISOString().split("T")[0],
        startTime: event.startTime,
        endTime: event.endTime,
        category: event.category,
        status: event.status,
        capacity: event.capacity,
        priceCents: event.priceCents,
        thumbnailUrl: event.thumbnailUrl,
        description: event.description,
        createdAt: event.createdAt,
        updatedAt: event.updatedAt,
      };

      return NextResponse.json({ data, message: "Success!" }, { status: 200 });
    } catch (ex) {
      return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
  },
  ["Admin"],
);

export const DELETE = withAuth(
  async (req: NextRequest, params: any) => {
    try {
      const id = Number(params.id);
      const event = await prisma.event.findUnique({
        where: { id },
      });
      if (!event) {
        return NextResponse.json({ error: "Event not found" }, { status: 404 });
      }
      await prisma.event.delete({ where: { id } });
      return NextResponse.json(
        { data: id, message: "Success!" },
        { status: 200 },
      );
    } catch (ex) {
      return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
  },
  ["Admin"],
);

export const PATCH = withAuth(
  async (req: NextRequest, params: any) => {
    try {
      const id = Number(params.id);
      const event = await prisma.event.findUnique({
        where: { id },
      });
      if (!event) {
        return NextResponse.json({ error: "Event not found" }, { status: 404 });
      }
      const formData = await req.formData();
      const title = formData.get("title") as string;
      const cinemaId = formData.get("cinemaId") as string;
      const date = formData.get("date") as string;
      const startTime = formData.get("startTime") as string;
      const endTime = formData.get("endTime") as string;
      const category = formData.get("category") as string;
      const status = formData.get("status") as string;
      const capacity = formData.get("capacity") as string | null;
      const price = formData.get("price") as string | null;
      const description = formData.get("description") as string | null;

      if (
        !title ||
        !cinemaId ||
        !date ||
        !startTime ||
        !endTime ||
        !category ||
        !status
      ) {
        return NextResponse.json(
          { error: "Invalid payload" },
          { status: 400 },
        );
      }

      const parsedDate = parseDateOnly(date);
      if (!parsedDate) {
        return NextResponse.json({ error: "Invalid date" }, { status: 400 });
      }

      const capacityNumber = parseNumber(capacity);
      if (capacityNumber !== null && capacityNumber < 0) {
        return NextResponse.json(
          { error: "Capacity must be non-negative" },
          { status: 400 },
        );
      }

      const priceNumber = parseNumber(price);
      if (priceNumber !== null && priceNumber < 0) {
        return NextResponse.json(
          { error: "Price must be non-negative" },
          { status: 400 },
        );
      }

      const file = formData.get("thumbnail") as File | null;
      let thumbnailUrl: string | undefined;
      if (file) {
        const allowed = new Set([
          "image/png",
          "image/jpeg",
          "image/webp",
          "image/gif",
        ]);
        if (!allowed.has(file.type)) {
          return NextResponse.json(
            { error: "Invalid image type" },
            { status: 400 },
          );
        }
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const uploadDir = path.join(process.cwd(), "public/uploads/events");
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true });
        }
        const fileExt = file.name.split(".").pop();
        const fileName = `${Date.now().toString()}.${fileExt}`;
        const filePath = path.join(uploadDir, fileName);
        fs.writeFileSync(filePath, buffer);
        thumbnailUrl = `/uploads/events/${fileName}`;
      }

      await prisma.event.update({
        where: { id },
        data: {
          title,
          cinemaId: Number(cinemaId),
          date: parsedDate,
          startTime,
          endTime,
          category,
          status,
          capacity: capacityNumber !== null ? Math.round(capacityNumber) : null,
          priceCents:
            priceNumber !== null ? Math.round(priceNumber * 100) : null,
          description: description || null,
          thumbnailUrl,
        },
      });

      return NextResponse.json(
        { data: id, message: "Success!" },
        { status: 200 },
      );
    } catch (ex) {
      return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
  },
  ["Admin"],
);
