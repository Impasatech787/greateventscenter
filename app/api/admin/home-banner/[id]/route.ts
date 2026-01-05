import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/withAuth";
import fs from "fs";
import path from "path";
export const GET = withAuth(
  async (_req: NextRequest, params: any) => {
    try {
      const id = Number(params.id);
      const homeBanner = await prisma.homeBanner.findUnique({
        where: { id },
      });

      if (!homeBanner) {
        return NextResponse.json(
          { error: "Home Banner not found" },
          { status: 404 },
        );
      }

      return NextResponse.json(
        { data: homeBanner, message: "Success!" },
        { status: 200 },
      );
    } catch (ex) {
      return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
  },
  ["Admin"],
);

export const DELETE = withAuth(
  async (_req: NextRequest, params: any) => {
    try {
      const id = Number(params.id);
      const homeBanner = await prisma.homeBanner.findUnique({
        where: { id },
      });
      if (!homeBanner) {
        return NextResponse.json(
          { error: "Home Banner not found" },
          { status: 404 },
        );
      }
      // 2️⃣ Delete file if it exists
      if (homeBanner.bannerUrl) {
        const filePath = path.join(
          process.cwd(),
          "public",
          homeBanner.bannerUrl,
        );

        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }
      await prisma.homeBanner.delete({ where: { id } });
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
      const homeBanner = await prisma.homeBanner.findUnique({
        where: { id },
      });
      if (!homeBanner) {
        return NextResponse.json(
          { error: "Home Banner not found" },
          { status: 404 },
        );
      }

      const formData = await req.formData();
      const title = formData.get("title") as string;
      const isActive = formData.get("isActive") === "true";
      const heroText = formData.get("heroText") as string;
      const file = formData.get("banner") as File | null;

      const heroTextExists = await prisma.homeBanner.findFirst({
        where: { id: { not: id }, bannerHero: heroText },
      });

      if (heroTextExists) {
        return NextResponse.json(
          { error: "Similar Hero Text already exists!" },
          { status: 400 },
        );
      }

      let bannerUrl: string = "";
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
        const uploadDir = path.join(
          process.cwd(),
          "public/uploads/home-banner",
        );
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true });
        }
        const fileExt = file.name.split(".").pop();
        const fileName = `${Date.now().toString()}.${fileExt}`;
        const filePath = path.join(uploadDir, fileName);
        fs.writeFileSync(filePath, buffer);
        bannerUrl = `/uploads/home-banner/${fileName}`;
      }

      // 2️⃣ Delete prerevious if it exists
      if (homeBanner.bannerUrl) {
        const filePath = path.join(
          process.cwd(),
          "public",
          homeBanner.bannerUrl,
        );

        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }
      await prisma.homeBanner.update({
        where: { id },
        data: {
          title,
          isActive,
          bannerHero: heroText,
          bannerUrl,
        },
      });
      return NextResponse.json(
        { data: id, message: "Success!" },
        { status: 200 },
      );
    } catch (error) {
      console.log(error);
      return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
  },
  ["Admin"],
);
