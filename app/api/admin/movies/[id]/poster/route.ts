import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/withAuth";
import path from "path";
import fs from "fs";

export const POST = withAuth(
  async (req: NextRequest, params: any) => {
    try {
      const id = Number(params.id);
      const movie = await prisma.movie.findUnique({
        where: { id },
      });
      if (!movie) {
        return NextResponse.json({ error: "Movie not found" }, { status: 404 });
      }

      const formData = await req.formData();
      const file = formData.get("file") as File | null;
      let featuredMedia: string | null = null;
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
            { status: 400 }
          );
        }
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Create folder if not exists
        const uploadDir = path.join(
          process.cwd(),
          "public/uploads/movie-posters"
        );
        if (!fs.existsSync(uploadDir))
          fs.mkdirSync(uploadDir, { recursive: true });

        const fileExt = file.name.split(".").pop();
        const fileName = Date.now().toString() + "." + fileExt;
        const filePath = path.join(uploadDir, fileName);
        fs.writeFileSync(filePath, buffer);

        featuredMedia = `/uploads/movie-posters/${fileName}`;
      } else {
        return NextResponse.json({ error: "Success!" }, { status: 400 });
      }

      if (movie.posterUrl) {
        const oldPath = path.join(process.cwd(), "public", movie.posterUrl);
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath); // Delete the file
        }
      }

      await prisma.movie.update({
        where: { id },
        data: { posterUrl: featuredMedia },
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
