import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";

type VerifyPayload = {
  userId: number;
  email: string;
  purpose?: string;
};

export async function GET(req: NextRequest) {
  try {
    const token = req.nextUrl.searchParams.get("token");
    if (!token) {
      return NextResponse.json(
        { error: "Verification token is required." },
        { status: 400 },
      );
    }

    let payload: VerifyPayload;
    try {
      payload = jwt.verify(token, process.env.JWT_SECRET!) as VerifyPayload;
    } catch {
      return NextResponse.json(
        { error: "Invalid or expired verification token." },
        { status: 400 },
      );
    }

    if (payload.purpose && payload.purpose !== "verify-email") {
      return NextResponse.json(
        { error: "Invalid verification token." },
        { status: 400 },
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: Number(payload.userId) },
      select: {
        id: true,
        email: true,
        emailVerifiedAt: true,
        emailVerificationTokenHash: true,
        emailVerificationExpiresAt: true,
      },
    });

    if (!user || user.email !== payload.email) {
      return NextResponse.json(
        { error: "Account not found." },
        { status: 404 },
      );
    }

    if (user.emailVerifiedAt) {
      return NextResponse.json(
        { message: "Email already verified." },
        { status: 200 },
      );
    }

    if (!user.emailVerificationTokenHash || !user.emailVerificationExpiresAt) {
      return NextResponse.json(
        { error: "Verification token is invalid." },
        { status: 400 },
      );
    }

    if (user.emailVerificationExpiresAt.getTime() < Date.now()) {
      return NextResponse.json(
        { error: "Verification token has expired." },
        { status: 400 },
      );
    }

    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
    if (tokenHash !== user.emailVerificationTokenHash) {
      return NextResponse.json(
        { error: "Verification token is invalid." },
        { status: 400 },
      );
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerifiedAt: new Date(),
        emailVerificationTokenHash: null,
        emailVerificationExpiresAt: null,
      },
    });

    return NextResponse.json(
      { message: "Email verified successfully." },
      { status: 200 },
    );
  } catch (error) {
    console.error("Verify email error:", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
