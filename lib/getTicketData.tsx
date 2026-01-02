import { BookingStatus } from "@/app/generated/prisma";
import { prisma } from "@/lib/prisma";
import { TicketPdf } from "@/lib/pdf/Ticket";
import { renderToBuffer } from "@react-pdf/renderer";
import * as QRCode from "qrcode";
import { TicketData } from "./ticketGenerator";

class TicketDataError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = "TicketDataError";
    this.status = status;
  }
}

export const buildTicketData = async ({
  bookingId,
}: {
  bookingId: string;
}): Promise<TicketData> => {
  const bookingData = await prisma.booking.findUnique({
    where: { id: Number(bookingId) },
    include: {
      show: {
        include: {
          auditorium: { include: { cinema: true } },
          movie: true,
          seatPrices: true,
        },
      },
      bookingSeats: { include: { seat: true } },
    },
  });

  if (!bookingData) {
    throw new TicketDataError("Booking not found", 404);
  }
  if (bookingData.status !== BookingStatus.BOOKED) {
    throw new TicketDataError("Booking not completed", 401);
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
        acc[key] = { seatType, priceCents, quantity: 1 };
      }
      return acc;
    },
    {}
  );

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const posterUrl = bookingData.show.movie?.posterUrl ?? "default.jpg";

  const ticketData: TicketData = {
    movieTitle: bookingData.show.movie?.title ?? "Untitled Movie",
    moviePosterUrl: baseUrl ? `${baseUrl}${posterUrl}` : "",
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
    invoiceId: bookingData.invoiceId ?? 0,
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

  return ticketData;
};

export const renderTicketPdfBuffer = async (ticketData: TicketData) => {
  const qrImageUrl = await QRCode.toDataURL(`${ticketData.bookingId}`, {
    errorCorrectionLevel: "L",
    type: "image/png",
    width: 240,
    margin: 1,
    color: { dark: "#000000", light: "#FFFFFF" },
  });

  const show: TicketData = { ...ticketData, qrImageUrl };
  return renderToBuffer(<TicketPdf show={show} />);
};

export const getTicketData = async ({
  bookingId,
}: {
  bookingId: string;
}): Promise<Buffer> => {
  const ticketData = await buildTicketData({ bookingId });
  return renderTicketPdfBuffer(ticketData);
};
