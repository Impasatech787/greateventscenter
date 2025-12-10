import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/withAuth";

export const GET = withAuth(async (req: NextRequest) => {
  const users = await prisma.user.findMany({
  });
  const data = users.map(u => ({
    id: u.id,
    firstName: u.firstName,
    lastName: u.lastName,
    email: u.email
  }))
  return NextResponse.json({ data, message: "Success!" }, { status: 200 });
}, ["Admin"]);