import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { sendPasswordResetEmail } from "@/lib/email";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const email = String(body?.email || "").trim().toLowerCase();

    if (!email) {
      return NextResponse.json({ error: "Email is required." }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, email: true, firstName: true, lastName: true },
    });

    if (!user) {
      return NextResponse.json(
        { message: "If that email exists, we sent a reset link." },
        { status: 200 },
      );
    }

    const resetToken = jwt.sign(
      { userId: user.id, email: user.email, purpose: "reset-password" },
      process.env.JWT_SECRET!,
      { expiresIn: "30m" },
    );

    const resetTokenHash = crypto.createHash("sha256").update(resetToken).digest("hex");
    const resetExpiresAt = new Date(Date.now() + 30 * 60 * 1000);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordResetTokenHash: resetTokenHash,
        passwordResetExpiresAt: resetExpiresAt,
      },
    });

    await sendPasswordResetEmail({
      to: user.email || email,
      name: `${user.firstName} ${user.lastName}`.trim(),
      token: resetToken,
    });

    return NextResponse.json(
      { message: "If that email exists, we sent a reset link." },
      { status: 200 },
    );
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
