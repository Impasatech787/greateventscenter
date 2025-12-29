import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { BookingStatus } from "@/app/generated/prisma";

type SeatBookStatus = "AVAILABLE" | "HELD" | "BOOKED";

export const GET = async (
  _req: NextRequest,
  ctx: { params: Promise<{ showId: string }> },
) => {
  try {
    const params = await ctx.params;
    const showId = Number(params.showId);
    if (!Number.isFinite(showId)) {
      return NextResponse.json({ error: "Invalid showId" }, { status: 400 });
    }

    const showDetails = await prisma.show.findUnique({
      where: { id: showId },
      include: {
        seatPrices: {
          select: {
            seatType: true,
            priceCents: true,
          },
        },
        auditorium: {
          select: {
            id: true,
            name: true,
            cinemaId: true,
            seats: {
              select: {
                id: true,
                row: true,
                number: true,
                seatType: true,
                rowOffset: true,
                columnOffset: true,
              },
            },
          },
        },
      },
    });

    if (!showDetails) {
      return NextResponse.json({ error: "Show not found" }, { status: 404 });
    }

    const now = new Date();
    const bookingSeats = await prisma.bookingSeat.findMany({
      where: {
        seatId: { not: null },
        booking: {
          showId,
          OR: [
            { status: BookingStatus.BOOKED },
            { status: BookingStatus.INITIATED, expiresAt: { gt: now } },
          ],
        },
      },
      select: {
        seatId: true,
        booking: { select: { status: true, expiresAt: true } },
      },
    });

    const seatStatusById = new Map<number, SeatBookStatus>();
    for (const bs of bookingSeats) {
      if (!bs.seatId) continue;

      if (bs.booking.status === BookingStatus.BOOKED) {
        seatStatusById.set(bs.seatId, "BOOKED");
        continue;
      }

      if (
        bs.booking.status === BookingStatus.INITIATED &&
        bs.booking.expiresAt > now &&
        seatStatusById.get(bs.seatId) !== "BOOKED"
      ) {
        seatStatusById.set(bs.seatId, "HELD");
      }
    }

    const priceBySeatType = new Map(
      showDetails.seatPrices.map((p) => [p.seatType, p.priceCents] as const),
    );

    const data = {
      id: showDetails.id,
      movieId: showDetails.movieId,
      startAt: showDetails.startAt,
      auditoriumId: showDetails.auditoriumId,
      seatPrices: showDetails.seatPrices,
      auditorium: {
        ...showDetails.auditorium,
        seats: showDetails.auditorium.seats.map((s) => ({
          ...s,
          priceCents: priceBySeatType.get(s.seatType) ?? null,
          bookStatus:
            seatStatusById.get(s.id) ?? ("AVAILABLE" as SeatBookStatus),
        })),
      },
    };

    return NextResponse.json({ data, message: "Success!" }, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
};
