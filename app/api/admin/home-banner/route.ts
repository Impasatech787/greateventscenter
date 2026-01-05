import { withAuth } from "@/lib/withAuth";
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { prisma } from "@/lib/prisma";

export const GET = withAuth(
  async (_req: NextRequest) => {
    try {
      const homeBanners = await prisma.homeBanner.findMany({
        orderBy: { createdAt: "desc" },
      });
      return NextResponse.json(
        { data: homeBanners, message: "Success!" },
        { status: 200 },
      );
    } catch (error) {
      return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
  },
  ["Admin"],
);

export const POST = withAuth(
  async (req: NextRequest) => {
    try {
      const formData = await req.formData();
      const title = formData.get("title") as string;
      const isActive = formData.get("isActive") === "true";
      const heroText = formData.get("heroText") as string;
      const file = formData.get("banner") as File | null;
      if (!heroText || !file) {
        return NextResponse.json({ error: "Invalid Payload" }, { status: 400 });
      }

      const heroTextExists = await prisma.homeBanner.findFirst({
        where: { bannerHero: heroText },
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

      const data = await prisma.homeBanner.create({
        data: {
          title,
          isActive,
          bannerHero: heroText,
          bannerUrl,
        },
      });

      return NextResponse.json(
        { data: data.id, message: "Success!" },
        { status: 200 },
      );
    } catch (error) {
      console.error(error);
      return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
  },
  ["Admin"],
);
