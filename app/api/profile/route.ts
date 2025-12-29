import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAuth } from "@/lib/withAuth";
import { AuthUser } from "@/lib/auth";

export const GET = withAuth(async (_req: NextRequest, _params: unknown, user: AuthUser) => {
  const userId = Number(user.id);
  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const profile = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      userRoles: {
        include: { role: true },
      },
    },
  });

  if (!profile) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }

  const data = {
    id: profile.id,
    firstName: profile.firstName,
    lastName: profile.lastName,
    email: profile.email,
    createdAt: profile.createdAt,
    roles: profile.userRoles.map((r) => r.role.name),
  };

  return NextResponse.json({ data, message: "Success!" }, { status: 200 });
});
