import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/withAuth";
import { slugify } from "@/lib/slug";
import fs from "fs";
import path from "path";
import { BlogStatus } from "@/app/generated/prisma";

export const GET = withAuth(async (req: NextRequest, params: any) => {
  try {
    const id = Number(params.id);
    const blog = await prisma.blog.findUnique({
        where: {id}
    });
    if(!blog)
        return NextResponse.json({ error: "Blog not found" }, { status: 404 });

    const data = {
      id: blog.id,
      title: blog.title,
      slug: blog.slug,
      author: blog.author,
      status: blog.status,
      publishedDate: blog.publishedDate,
      createdAt: blog.createdAt,
      updatedAt: blog.updatedAt,
      content: blog.content,
      featuredMedia: blog.featuredMedia,
    };
    return NextResponse.json({ data, message: "Success!" }, { status: 200 });
  } catch (ex) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}, ["Admin"]);

export const DELETE = withAuth(async (req: NextRequest, params: any) => {
  try {
    const id = Number(params.id);
    const blog = await prisma.blog.findUnique({
        where: {id}
    });
    if(!blog){
        return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }
    await prisma.blog.delete({ where: { id } });

    return NextResponse.json({ data: id, message: "Success!" }, { status: 200 });
  } catch (ex) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}, ["Admin"]);

export const PATCH = withAuth(async (req: NextRequest, params: any) => {
  try {
    const id = Number(params.id);
    const blog = await prisma.blog.findUnique({
        where: {id}
    });
    if(!blog){
        return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    const formData = await req.formData();
    const author = formData.get("author") as string;
    const title = formData.get("title") as string;
    const content = formData.get("content") as string;
    const status = formData.get("status") as BlogStatus;

    const slug = slugify(title);
    const slugExists = await prisma.blog.findFirst({
      where: {
        id: {
          not: id
        },
        slug
      }
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

    if (blog.featuredMedia) {
      const oldPath = path.join(process.cwd(), "public", blog.featuredMedia);
      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath); // Delete the file
      }
    }
    
    await prisma.blog.update({
      where: { id },
      data: { title, slug, author, content, status, featuredMedia }
    });
    
    return NextResponse.json({ data: id, message: "Success!" }, { status: 200 });
  } catch (ex) {
    console.log(ex);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}, ["Admin"]);