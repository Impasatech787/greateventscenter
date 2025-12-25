import { withAuth } from "@/lib/withAuth";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { TicketData } from "@/lib/ticketGenerator";
import puppeteer from "puppeteer";

export const GET = withAuth(
  async (_req: NextRequest, params: { bookingId: string }) => {
    try {
      console.log("Params:", params);
      const bookingId = params.bookingId;

      const bookingData = await prisma.booking.findUnique({
        where: { id: Number(bookingId) },
        include: {
          show: {
            include: {
              auditorium: true,
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

      const seatNames = bookingData.bookingSeats.map((bs) =>
        bs.seat?.row && bs.seat?.number
          ? `${bs.seat.row}-${bs.seat.number}`
          : "Unknown Seat"
      );

      const seatItems = bookingData.bookingSeats.reduce(
        (acc: { [key: string]: TicketData["items"][0] }, bs) => {
          const seatType = bs.seat?.seatType ?? "Unknown";
          const priceCents =
            bookingData.show.seatPrices.find(
              (sp) => sp.seatType === bs.seat?.seatType
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
        {}
      );

      const ticketData: TicketData = {
        movieTitle: bookingData.show.movie?.title ?? "Untitled Movie",
        moviePosterUrl: bookingData.show.movie?.posterUrl ?? "",
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
          name: "Great Events Center",
          location: "123 Main St, Anytown, USA",
          phone: "555-1234",
          email: "  ",
        },
      };
      const ticketBuffer = await generateTicketBuffer(ticketData);
      return new NextResponse(Buffer.from(ticketBuffer), {
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
  }
);

async function generateTicketBuffer(
  ticketData: TicketData
): Promise<Uint8Array> {
  const { generateTicket } = await import("@/lib/ticketGenerator");
  const html = await generateTicket({ show: ticketData });

  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 100, height: 600 });
  await page.setContent(html, { waitUntil: "networkidle0" });
  const pdfBuffer = await page.pdf({
    printBackground: true,
    pageRanges: "1",
    preferCSSPageSize: true,
  });

  await browser.close();
  return new Uint8Array(pdfBuffer);
}
