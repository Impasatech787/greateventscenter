import { withAuth } from "@/lib/withAuth";
import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export const GET = withAuth(
  async (_req: NextRequest) => {
    try {
      const payments = await prisma.payment.findMany({
        include: {
          user: {
            select: { id: true, firstName: true, lastName: true, email: true },
          },
        },
      });
      console.log(payments);
      return NextResponse.json({ data: payments }, { status: 200 });
    } catch (error) {
      console.error(error);
      return NextResponse.json({ error: "Server Error" }, { status: 500 });
    }
  },
  ["Admin"]
);
