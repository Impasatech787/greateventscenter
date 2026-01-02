export const runtime = "nodejs";
import { withAuth } from "@/lib/withAuth";
import { NextRequest, NextResponse } from "next/server";
import { getTicketData } from "@/lib/getTicketData";

export const GET = withAuth(
  async (_req: NextRequest, params: { bookingId: string }) => {
    try {
      const bookingId = params.bookingId;
      const ticket: Buffer = await getTicketData({ bookingId: bookingId });
      return new NextResponse(Buffer.from(ticket), {
        status: 200,
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `attachment; filename="ticket-${bookingId}.pdf"`,
        },
      });
    } catch (error) {
      console.error(error);
      return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
  },
);
