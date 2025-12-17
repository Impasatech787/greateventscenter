import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/withAuth";
import { slugify } from "@/lib/slug";
import fs from "fs";
import path from "path";
import { BlogStatus } from "@/app/generated/prisma";

export const GET = withAuth(async (req: NextRequest) => {
  try {
    const blogs = await prisma.blog.findMany({
    });

    const data = blogs.map(u => ({
      id: u.id,
      title: u.title,
      slug: u.slug,
      author: u.author,
      status: u.status,
      publishedDate: u.publishedDate,
      createdAt: u.createdAt,
      updatedAt: u.updatedAt,
      content: u.content,
      featuredMedia: u.featuredMedia,
    }));
    return NextResponse.json({ data, message: "Success!" }, { status: 200 });
  } catch (ex) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}, ["Admin"]);

export const POST = withAuth(async (req: NextRequest) => {
  try {
    const formData = await req.formData();
    const author = formData.get("author") as string;
    const title = formData.get("title") as string;
    const content = formData.get("content") as string;
    const status = formData.get("status") as BlogStatus;

    const slug = slugify(title);
    const slugExists = await prisma.blog.findUnique({
      where: { slug }
    });
    if(slugExists){
      return NextResponse.json({ error: "Similar title already exists!" }, { status: 400 });
    }

    const file = formData.get("file") as File | null;
    var featuredMedia: string | null = null;
    if (file){
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

      // Create folder if not exists
      const uploadDir = path.join(process.cwd(), "public/uploads/blogs");
      if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

      const fileExt = file.name.split('.').pop();
      const fileName = Date.now().toString()+ "." + fileExt;
      const filePath = path.join(uploadDir, fileName);
      fs.writeFileSync(filePath, buffer);

      featuredMedia = `/uploads/blogs/${fileName}`;
    }

    const data = await prisma.blog.create({
      data: { title, slug, author, content, featuredMedia, status }
    });
    return NextResponse.json({ data: data.id, message: "Success!" }, { status: 200 });
  } catch (ex) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}, ["Admin"]);