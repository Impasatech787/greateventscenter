import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  const body = await req.json();
  const { email, password } = body;
  console.log("Received signup data:", body);
  if (!email) {
    return NextResponse.json({ message: "Email is required" }, { status: 400 });
  }
  if (!password) {
    return NextResponse.json({ message: "Password is required" }, { status: 400 });
  }
  const user = await prisma.user.findUnique({
    include: {
        user_roles:{
            include: {role: true}
        }
    },
    where: {email}
  });
  console.log(user)
  if (user && user.passwordHash) {
    const isValid = await bcrypt.compare(password, user.passwordHash);
    if(isValid) {
        const token = jwt.sign(
            { userId: user.id, email: user.email, roles: user.user_roles.map(r => r.role.name) },
            process.env.JWT_SECRET!,
            { expiresIn: "1d" }
        );
        return NextResponse.json({ data: token, message: "Success!" }, { status: 200 });
    }
  }
  return NextResponse.json({ message: "Incorrect email or password" }, { status: 401 });
}
