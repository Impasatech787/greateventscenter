import { withAuth } from "@/lib/withAuth";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { AuthUser } from "@/lib/auth";

export const POST = withAuth(
  async (_req: NextRequest, params: { bookingId: string }, user: AuthUser) => {
    try {
      const bookingId = params.bookingId;
      const booking = await prisma.booking.findUnique({
        where: { id: Number(bookingId) },
        include: {
          show: { select: { startAt: true } },
          user: true,
        },
      });
      if (!booking) {
        return NextResponse.json(
          { error: "Booking Not Found" },
          { status: 404 },
        );
      }
      if (booking.user && booking?.user.id != Number(user.userId)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      const cancelTimeLimit = new Date(
        new Date(booking.show.startAt).getTime() - 2 * 60 * 60 * 1000,
      );
      if (cancelTimeLimit < new Date()) {
        return NextResponse.json(
          { error: "Cancellation TIme Expired" },
          { status: 403 },
        );
      }
      await prisma.booking.update({
        where: { id: booking.id },
        data: {
          status: "CANCELLED",
        },
      });
      return NextResponse.json(
        { message: "Cancellation Successfull" },
        { status: 200 },
      );
    } catch (error) {
      console.error(error);
      return NextResponse.json({ error: "Server Error" }, { status: 500 });
    }
  },
);
