import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/withAuth";
import fs from "fs";
import path from "path";

export const GET = withAuth(async (req: NextRequest, params: any) => {
  try {
    const id = Number(params.id);
    const service = await prisma.service.findUnique({
      where: { id },
    });

    if (!service) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 });
    }

    const data = {
      id: service.id,
      heading: service.heading,
      subheading: service.subheading,
      href: service.href,
      mediaUrl: service.mediaUrl,
      createdAt: service.createdAt,
      updatedAt: service.updatedAt,
    };

    return NextResponse.json({ data, message: "Success!" }, { status: 200 });
  } catch (ex) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}, ["Admin"]);

export const DELETE = withAuth(async (req: NextRequest, params: any) => {
  try {
    const id = Number(params.id);
    const service = await prisma.service.findUnique({
      where: { id },
    });

    if (!service) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 });
    }

    await prisma.service.delete({ where: { id } });

    if (service.mediaUrl) {
      const oldPath = path.join(process.cwd(), "public", service.mediaUrl);
      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }
    }

    return NextResponse.json({ data: id, message: "Success!" }, { status: 200 });
  } catch (ex) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}, ["Admin"]);

export const PATCH = withAuth(async (req: NextRequest, params: any) => {
  try {
    const id = Number(params.id);
    const service = await prisma.service.findUnique({
      where: { id },
    });

    if (!service) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 });
    }

    const formData = await req.formData();
    const heading = formData.get("heading") as string;
    const subheading = formData.get("subheading") as string;
    const href = formData.get("href") as string;

    if (!heading?.trim() || !subheading?.trim() || !href?.trim()) {
      return NextResponse.json(
        { error: "Heading, subheading, and link are required" },
        { status: 400 },
      );
    }

    const file = formData.get("file") as File | null;
    let mediaUrl = service.mediaUrl;

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

      const uploadDir = path.join(process.cwd(), "public/uploads/services");
      if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now().toString()}.${fileExt}`;
      const filePath = path.join(uploadDir, fileName);
      fs.writeFileSync(filePath, buffer);

      mediaUrl = `/uploads/services/${fileName}`;

      if (service.mediaUrl) {
        const oldPath = path.join(process.cwd(), "public", service.mediaUrl);
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }
    }

    await prisma.service.update({
      where: { id },
      data: { heading, subheading, href, mediaUrl },
    });

    return NextResponse.json({ data: id, message: "Success!" }, { status: 200 });
  } catch (ex) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}, ["Admin"]);
