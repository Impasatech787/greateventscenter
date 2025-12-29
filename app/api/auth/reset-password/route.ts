import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

type ResetPayload = {
  userId: number;
  email: string;
  purpose?: string;
};

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const token = String(body?.token || "");
    const newPassword = String(body?.newPassword || "");

    if (!token || !newPassword) {
      return NextResponse.json(
        { error: "Token and new password are required." },
        { status: 400 },
      );
    }
    if (newPassword.length < 8) {
      return NextResponse.json(
        { error: "New password must be at least 8 characters." },
        { status: 400 },
      );
    }

    let payload: ResetPayload;
    try {
      payload = jwt.verify(token, process.env.JWT_SECRET!) as ResetPayload;
    } catch {
      return NextResponse.json({ error: "Invalid or expired token." }, { status: 400 });
    }

    if (payload.purpose && payload.purpose !== "reset-password") {
      return NextResponse.json({ error: "Invalid token." }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { id: Number(payload.userId) },
      select: {
        id: true,
        email: true,
        passwordResetTokenHash: true,
        passwordResetExpiresAt: true,
      },
    });

    if (!user || user.email !== payload.email) {
      return NextResponse.json({ error: "Invalid token." }, { status: 400 });
    }

    if (!user.passwordResetTokenHash || !user.passwordResetExpiresAt) {
      return NextResponse.json({ error: "Invalid token." }, { status: 400 });
    }

    if (user.passwordResetExpiresAt.getTime() < Date.now()) {
      return NextResponse.json({ error: "Reset token has expired." }, { status: 400 });
    }

    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
    if (tokenHash !== user.passwordResetTokenHash) {
      return NextResponse.json({ error: "Invalid token." }, { status: 400 });
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash,
        passwordResetTokenHash: null,
        passwordResetExpiresAt: null,
      },
    });

    return NextResponse.json({ message: "Password updated successfully." }, { status: 200 });
  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
