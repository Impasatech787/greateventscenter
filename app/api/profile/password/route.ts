import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { withAuth } from "@/lib/withAuth";
import { AuthUser } from "@/lib/auth";

export const POST = withAuth(async (req: NextRequest, _params: unknown, user: AuthUser) => {
  try {
    const body = await req.json();
    const currentPassword = String(body?.currentPassword || "");
    const newPassword = String(body?.newPassword || "");

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ error: "Current and new password are required." }, { status: 400 });
    }
    if (newPassword.length < 8) {
      return NextResponse.json({ error: "New password must be at least 8 characters." }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({
      where: { id: Number(user.id) },
      select: { passwordHash: true },
    });

    if (!existingUser?.passwordHash) {
      return NextResponse.json({ error: "Password change is unavailable for this account." }, { status: 400 });
    }

    const isValid = await bcrypt.compare(currentPassword, existingUser.passwordHash);
    if (!isValid) {
      return NextResponse.json({ error: "Current password is incorrect." }, { status: 401 });
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id: Number(user.id) },
      data: { passwordHash },
    });

    return NextResponse.json({ message: "Password updated successfully." }, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
});
