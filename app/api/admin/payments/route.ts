import { withAuth } from "@/lib/withAuth";
import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export const GET = withAuth(
  async (req: NextRequest) => {
    const params = req.nextUrl.searchParams;
    // const pageIndex = params.get("pageIndex");
    // const pageSize = params.get("pageSize");
    const paymentId = params.get("paymentId");
    const bookingID = params.get("bookingId");
    const userEmail = params.get("userEmail");
    const paidDate = params.get("paidDate");
    const where: any = {};
    if (paymentId) {
      where.id = Number(paymentId);
    }
    if (bookingID) {
      where.bookingId = Number(bookingID);
    }
    if (userEmail) {
      where.receiptEmail = {
        contains: userEmail,
        mode: "insensitive",
      };
    }
    if (paidDate) {
      const startOfDay = new Date(paidDate);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(paidDate);
      endOfDay.setHours(23, 59, 59, 999);
      where.paidAt = { gte: startOfDay, lte: endOfDay };
    }
    try {
      const payments = await prisma.payment.findMany({
        where,
        include: {
          user: {
            select: { id: true, firstName: true, lastName: true, email: true },
          },
        },
      });
      return NextResponse.json({ data: payments }, { status: 200 });
    } catch (error) {
      console.error(error);
      return NextResponse.json({ error: "Server Error" }, { status: 500 });
    }
  },
  ["Admin"],
);
