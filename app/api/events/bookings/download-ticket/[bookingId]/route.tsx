export const runtime = "nodejs";

import { withAuth } from "@/lib/withAuth";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { renderToBuffer } from "@react-pdf/renderer";
import * as QRCode from "qrcode";
import { BookingStatus } from "@/app/generated/prisma";
import { EventTicketPdf, EventTicketData } from "@/lib/pdf/EventTicket";

export const GET = withAuth(
  async (_req: NextRequest, params: { bookingId: string }) => {
    try {
      const bookingId = Number(params.bookingId);
      if (!Number.isFinite(bookingId)) {
        return NextResponse.json({ error: "Invalid booking id" }, { status: 400 });
      }

      const booking = await prisma.eventBooking.findUnique({
        where: { id: bookingId },
        include: {
          event: {
            include: {
              cinema: true,
            },
          },
        },
      });

      if (!booking) {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
      }

      if (booking.status !== BookingStatus.BOOKED) {
        return NextResponse.json(
          { error: "Booking not completed" },
          { status: 401 },
        );
      }

      const dateLabel = new Date(booking.event.date).toLocaleDateString(
        "en-US",
        {
          month: "short",
          day: "numeric",
          year: "numeric",
        },
      );
      const timeLabel = `${booking.event.startTime} - ${booking.event.endTime}`;

      const ticketData: EventTicketData = {
        eventTitle: booking.event.title,
        eventCategory: booking.event.category,
        thumbnailUrl: booking.event.thumbnailUrl ?? undefined,
        venueName: booking.event.cinema.name,
        venueLocation: booking.event.cinema.location,
        dateLabel,
        timeLabel,
        bookingId: booking.id,
        quantity: booking.quantity,
        priceCents: booking.priceCents,
      };

      ticketData.qrImageUrl = await QRCode.toDataURL(
        `${ticketData.bookingId}`,
        {
          errorCorrectionLevel: "L",
          type: "image/png",
          width: 240,
          margin: 1,
          color: { dark: "#000000", light: "#FFFFFF" },
        },
      );

      const ticket = await renderToBuffer(<EventTicketPdf data={ticketData} />);
      return new NextResponse(Buffer.from(ticket), {
        status: 200,
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `attachment; filename="event-ticket-${bookingId}.pdf"`,
        },
      });
    } catch (error) {
      console.error(error);
      return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
  },
  ["User", "Admin"],
);
