import { withAuth } from "@/lib/withAuth";
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import path from "path";
import { promises as fs } from "fs";
import { Prisma } from "@/app/generated/prisma/client";

export const POST = withAuth(
  async (req: NextRequest) => {
    try {
      const formData = await req.formData();

      const title = String(formData.get("title") ?? "");
      const slug = String(formData.get("slug") ?? "");
      const author = String(formData.get("author") ?? "");
      const content = String(formData.get("content") ?? "");
      const publishedDateRaw = formData.get("publishedDate");

      if (!title || !slug || !author || !content) {
        return NextResponse.json(
          { error: "Missing required fields" },
          { status: 400 },
        );
      }
      const publishedDate = publishedDateRaw
        ? new Date(String(publishedDateRaw))
        : undefined;

      const file = formData.get("featuredMedia");
      let featuredMediaPath: string | undefined = undefined;

      if (file && file instanceof File && file.size > 0) {
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

        const bytes = Buffer.from(await file.arrayBuffer());

        const ext =
          file.type === "image/png"
            ? "png"
            : file.type === "image/jpeg"
              ? "jpg"
              : file.type === "image/webp"
                ? "webp"
                : file.type === "image/gif"
                  ? "gif"
                  : "bin";

        const randomName = crypto.randomBytes(16).toString("hex");
        const fileName = `${randomName}.${ext}`;

        const uploadDir = path.join(process.cwd(), "public", "uploads");
        await fs.mkdir(uploadDir, { recursive: true });

        const fullPath = path.join(uploadDir, fileName);
        await fs.writeFile(fullPath, bytes);

        featuredMediaPath = `/uploads/${fileName}`;
      }
      const blog = await prisma?.blog.create({
        data: {
          title,
          slug,
          author,
          content,
          publishedDate,
          featuredMedia: featuredMediaPath,
        },
      });

      return NextResponse.json({ blog, message: "Success!" }, { status: 200 });
    } catch (err) {
      if (
        err instanceof Prisma.PrismaClientKnownRequestError &&
        err?.code === "P2002"
      ) {
        return NextResponse.json(
          { error: "Slug already exists" },
          { status: 409 },
        );
      }
      return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
  },
  ["Admin"],
);
