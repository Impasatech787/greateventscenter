import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const GET = async (_req: NextRequest) => {
  try {
    const homeBanners = await prisma.homeBanner.findMany({
      where: { isActive: true },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(
      { data: homeBanners, message: "Success!" },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
};
