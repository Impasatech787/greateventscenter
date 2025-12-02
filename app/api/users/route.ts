import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const users = await prisma.user.findMany({
    include: { posts: true },
  });

  return NextResponse.json(users);
}

export async function POST(req: Request) {
  const body = await req.json();
  const { email, name } = body;
  console.log("Received signup data:", body);

  if (!email) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }

  const user = await prisma.user.create({
    data: { email, name },
  });

  return NextResponse.json(user, { status: 201 });
}
