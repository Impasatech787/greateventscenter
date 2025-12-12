import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/withAuth";
import { BlogStatus } from "@/app/generated/prisma";

export const PATCH = withAuth(async (req: NextRequest, params: any) => {
  try {
    const id = Number(params.id);
    const blog = await prisma.blog.findUnique({
        where: {id}
    });
    if(!blog)
        return NextResponse.json({ error: "Blog not found" }, { status: 404 });

    if (blog.status !== BlogStatus.PUBLISHED) {
        return NextResponse.json({ message: "Cannot remove this blog" }, { status: 400 });
    }

    await prisma.blog.update({
        where: {id},
        data: { status: BlogStatus.REMOVED }
    });

    return NextResponse.json({ data: id, message: "Success!" }, { status: 200 });
  } catch (ex) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}, ["Admin"]);