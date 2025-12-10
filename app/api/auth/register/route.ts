import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  const body = await req.json();
  const { email, firstName, lastName, password } = body;
  if (!firstName) {
    return NextResponse.json({ error: "First name is required" }, { status: 400 });
  }
  if (!lastName) {
    return NextResponse.json({ error: "Last name is required" }, { status: 400 });
  }
  if (!email) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }
  if (!password) {
    return NextResponse.json({ error: "Password is required" }, { status: 400 });
  }
  const passwordHash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { email, firstName, lastName, passwordHash },
  });
  const data = {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
  }
  return NextResponse.json({data, message: "Success!"}, { status: 201 });
}
