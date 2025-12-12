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
        userRoles: {
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
            roles: user.userRoles.map((r) => r.role.name),
          },
          process.env.JWT_SECRET!,
          { expiresIn: "1d" },
        );
        const response = NextResponse.json(
          {
            data: { token, roles: user.userRoles.map((r) => r.role.name) },
            message: "Success!",
          },
          { status: 200 },
        );
        response.cookies.set("AuthToken", token, {
          httpOnly: true,
          path: "/",
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
        });
        return response;
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
