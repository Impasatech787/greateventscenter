export const runtime = "nodejs";
import { withAuth } from "@/lib/withAuth";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { TicketData } from "@/lib/ticketGenerator";
import { renderToBuffer } from "@react-pdf/renderer";
import { TicketPdf } from "@/lib/pdf/Ticket";
import * as QRCode from "qrcode";
import { BookingStatus } from "@/app/generated/prisma";

export const GET = withAuth(
  async (_req: NextRequest, params: { bookingId: string }) => {
    try {
      const bookingId = params.bookingId;

      const bookingData = await prisma.booking.findUnique({
        where: { id: Number(bookingId) },
        include: {
          show: {
            include: {
              auditorium: {
                include: {
                  cinema: true,
                },
              },
              movie: true,
              seatPrices: true,
            },
          },
          bookingSeats: {
            include: {
              seat: true,
            },
          },
        },
      });
      if (!bookingData) {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
      }
      if (bookingData.status != BookingStatus.BOOKED) {
        return NextResponse.json(
          { error: "Booking not Completed" },
          { status: 401 },
        );
      }

      const seatNames = bookingData.bookingSeats.map((bs) =>
        bs.seat?.row && bs.seat?.number
          ? `${bs.seat.row}-${bs.seat.number}`
          : "Unknown Seat",
      );

      const seatItems = bookingData.bookingSeats.reduce(
        (acc: { [key: string]: TicketData["items"][0] }, bs) => {
          const seatType = bs.seat?.seatType ?? "Unknown";
          const priceCents =
            bookingData.show.seatPrices.find(
              (sp) => sp.seatType === bs.seat?.seatType,
            )?.priceCents ?? 0;
          const key = `${seatType}-${priceCents}`;
          if (acc[key]) {
            acc[key].quantity = (acc[key].quantity ?? 1) + 1;
          } else {
            acc[key] = {
              seatType,
              priceCents,
              quantity: 1,
            };
          }
          return acc;
        },
        {},
      );

      const ticketData: TicketData = {
        movieTitle: bookingData.show.movie?.title ?? "Untitled Movie",
        moviePosterUrl: process.env.NEXT_PUBLIC_BASE_URL
          ? `${process.env.NEXT_PUBLIC_BASE_URL}${
              bookingData.show.movie?.posterUrl ?? "default.jpg"
            }`
          : "",
        movieDurationMinutes: bookingData.show.movie?.durationMin ?? 0,
        movieRating: bookingData.show.movie?.rating ?? "NR",
        movieGenre: bookingData.show.movie?.genres ?? "Unknown",
        auditoriumName: bookingData.show.auditorium?.name ?? "Main Hall",
        startAt: bookingData.show.startAt.toISOString(),
        totalPriceCents: bookingData.priceCents,
        seats: seatNames,
        items: Object.values(seatItems),
        bookingId: bookingData.id,
        instructions: [
          "Bring this ticket to the venue.",
          "Arrive 30 minutes before showtime.",
          "Enjoy the movie!",
        ],
        invoiceId: bookingData?.invoiceId ?? 0,
        cinema: {
          name: bookingData.show.auditorium?.cinema?.name ?? "Cinema",
          location:
            bookingData.show.auditorium?.cinema?.location ??
            "7440 CROWN POINT AVE, OMAHA NE 68134",
          phone: "(402) 812-5616",
          email: "info@greateventscenter.com",
        },
      };

      ticketData.moviePosterUrl =
        ticketData.moviePosterUrl ||
        "https://via.placeholder.com/240x360.png?text=No+Image";

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
      const ticket = await renderToBuffer(<TicketPdf show={ticketData} />);
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
