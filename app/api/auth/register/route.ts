import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { Prisma } from "@/app/generated/prisma/client";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { sendVerificationEmail } from "@/lib/email";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, firstName, lastName, password } = body;
    if (!firstName) {
      return NextResponse.json(
        { error: "First name is required" },
        { status: 400 },
      );
    }
    if (!lastName) {
      return NextResponse.json(
        { error: "Last name is required" },
        { status: 400 },
      );
    }
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }
    if (!password) {
      return NextResponse.json(
        { error: "Password is required" },
        { status: 400 },
      );
    }
    const passwordHash = await bcrypt.hash(password, 10);
    try {
      const user = await prisma.user.create({
        data: {
          email,
          firstName,
          lastName,
          passwordHash,
        },
      });
      const emailToken = jwt.sign(
        {
          userId: user.id,
          email: user.email,
          purpose: "verify-email",
        },
        process.env.JWT_SECRET!,
        { expiresIn: "30m" },
      );
      const verificationTokenHash = crypto
        .createHash("sha256")
        .update(emailToken)
        .digest("hex");
      const verificationExpiresAt = new Date(Date.now() + 30 * 60 * 1000);
      await prisma.user.update({
        where: { id: user.id },
        data: {
          emailVerificationTokenHash: verificationTokenHash,
          emailVerificationExpiresAt: verificationExpiresAt,
        },
      });
      try {
        await sendVerificationEmail({
          to: user.email || email,
          name: `${user.firstName} ${user.lastName}`.trim(),
          token: emailToken,
        });
      } catch (emailError) {
        await prisma.user.delete({ where: { id: user.id } });
        console.error("Verification email failed:", emailError);
        return NextResponse.json(
          { error: "Failed to send verification email." },
          { status: 500 },
        );
      }
      return NextResponse.json(
        { message: "Check your email to verify your account." },
        { status: 201 },
      );
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        return NextResponse.json(
          { error: "Email already in use" },
          { status: 409 },
        );
      }
      return NextResponse.json(
        { error: "Failed To Register" },
        { status: 500 },
      );
    }
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
