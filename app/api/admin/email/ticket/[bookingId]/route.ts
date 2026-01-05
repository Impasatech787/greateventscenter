import { withAuth } from "@/lib/withAuth";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { emailTicket } from "@/lib/emailTicket";

export const POST = withAuth(
  async (_req: NextRequest, params: { bookingId: string }) => {
    try {
      const bookingId = params.bookingId;
      const booking = await prisma.booking.findUnique({
        where: { id: Number(bookingId) },
        include: {
          user: {
            select: { email: true, firstName: true, lastName: true },
          },
        },
      });
      if (!booking) {
        return NextResponse.json(
          { error: "No Booking Found" },
          { status: 404 },
        );
      }
      try {
        await emailTicket(
          bookingId,
          booking.user?.email ?? "",
          `${booking.user?.firstName} ${booking.user?.lastName}`,
        );
        return NextResponse.json(
          { message: "Email Sent SUccessfully" },
          { status: 200 },
        );
      } catch (error) {
        console.error("Failed to send ticket email", error);
        return NextResponse.json(
          { error: "Failed to Send Email" },
          { status: 500 },
        );
      }
    } catch (error) {
      console.error(error);
      return NextResponse.json({ error: "Server Error" }, { status: 500 });
    }
  },
  ["Admin"],
);
