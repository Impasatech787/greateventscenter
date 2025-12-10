import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = body;
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }
    if (!password) {
      return NextResponse.json(
        { error: "Password is required" },
        { status: 400 },
      );
    }
    const user = await prisma.user.findUnique({
      include: {
        user_roles: {
          include: { role: true },
        },
      },
      where: { email },
    });
    if (user && user.passwordHash) {
      const isValid = await bcrypt.compare(password, user.passwordHash);
      if (isValid) {
        const token = jwt.sign(
          {
            userId: user.id,
            email: user.email,
            roles: user.user_roles.map((r) => r.role.name),
          },
          process.env.JWT_SECRET!,
          { expiresIn: "1d" },
        );
        return NextResponse.json(
          { data: token, message: "Success!" },
          { status: 200 },
        );
      }
    }
    return NextResponse.json(
      { error: "Incorrect email or password" },
      { status: 401 },
    );
  } catch (error) {
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
