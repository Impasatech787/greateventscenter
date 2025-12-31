import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt, { type SignOptions } from "jsonwebtoken";
import crypto from "crypto";

function sha256(input: string) {
  return crypto.createHash("sha256").update(input).digest("hex");
}

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
    if (!user?.passwordHash) {
      return NextResponse.json(
        { error: "Incorrect email or password" },
        { status: 401 },
      );
    }
    if (!user.emailVerifiedAt) {
      return NextResponse.json(
        { error: "Please verify your email before signing in." },
        { status: 403 },
      );
    }
    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      return NextResponse.json(
        { error: "Incorrect email or password" },
        { status: 401 },
      );
    }

    const roles = user.userRoles.map((r) => r.role.name);
    const sid = crypto.randomUUID();

    const accessToken = jwt.sign(
      { userId: user.id, email: user.email, roles, sid },
      process.env.JWT_ACCESS_SECRET ?? process.env.JWT_SECRET!,
      {
        expiresIn:
          (process.env.TOKEN_EXPIRATION as NonNullable<
            SignOptions["expiresIn"]
          >) ?? "1d",
      },
    );

    const refreshToken = jwt.sign(
      { userId: user.id, sid },
      process.env.JWT_REFRESH_SECRET ?? process.env.JWT_SECRET!,
      {
        expiresIn:
          (process.env.REFRESH_TOKEN_EXPIRATION as NonNullable<
            SignOptions["expiresIn"]
          >) ?? "1d",
      },
    );

    await prisma.session.create({
      data: {
        sid,
        userId: user.id,
        refreshTokenHash: sha256(refreshToken),
      },
    });

    const response = NextResponse.json(
      {
        data: {
          token: accessToken,
          refreshToken,
          expiresAt: Date.now() + 86400 * 1000,
          roles,
        },
        message: "Success!",
      },
      { status: 200 },
    );
    return response;
  } catch (error) {
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
