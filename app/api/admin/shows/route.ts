import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/withAuth";
import { SeatType } from "@/app/generated/prisma";

export const GET = withAuth(async () => {
  try {
    const shows = await prisma.show.findMany({});

    //return movie name and auditorium name along with ids
    const showsWithDetails = await Promise.all(
      shows.map(async (show) => {
        const movie = await prisma.movie.findUnique({
          where: { id: show.movieId ?? undefined },
        });
        const auditorium = await prisma.auditorium.findUnique({
          where: { id: show.auditoriumId },
        });
        return {
          ...show,
          movieTitle: movie?.title || "Unknown",
          auditoriumName: auditorium?.name || "Unknown",
        };
      })
    );

    const data = showsWithDetails.map((u) => ({
      id: u.id,
      movieId: u.movieId,
      movieTitle: u.movieTitle,
      auditoriumName: u.auditoriumName,
      startAt: u.startAt,
      auditoriumId: u.auditoriumId,
    }));
    return NextResponse.json({ data, message: "Success!" }, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}, ["Admin"]);

export const POST = withAuth(
  async (req: NextRequest) => {
    try {
      const body = await req.json();
      //seatPrices is an object with key as seat type and value as price for that specific show
      const { movieId, startAt, auditoriumId, seatPrices } = body;

      if (!movieId || !startAt || !auditoriumId || !seatPrices) {
        return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
      }

      const requestedStart = new Date(startAt);
      if (Number.isNaN(requestedStart.getTime())) {
        return NextResponse.json({ error: "Invalid startAt" }, { status: 400 });
      }

      const requestedMovie = await prisma.movie.findUnique({
        where: { id: Number(movieId) },
        select: { durationMin: true },
      });
      if (!requestedMovie) {
        return NextResponse.json({ error: "Movie not found" }, { status: 400 });
      }

      const requestedEnd = new Date(
        requestedStart.getTime() + requestedMovie.durationMin * 60_000
      );

      // Validate the auditorium is available (overlapping intervals) for the requested time.
      const candidateShows = await prisma.show.findMany({
        where: {
          auditoriumId: Number(auditoriumId),
          startAt: { lt: requestedEnd },
        },
        include: {
          movie: { select: { durationMin: true } },
        },
      });

      const conflictingShow = candidateShows.find((s) => {
        const existingStart = s.startAt;
        const existingDurationMin = s.movie?.durationMin ?? 0;
        const existingEnd = new Date(
          existingStart.getTime() + existingDurationMin * 60_000
        );
        return existingStart < requestedEnd && existingEnd > requestedStart;
      });

      if (conflictingShow) {
        return NextResponse.json(
          {
            error: "Auditorium is not available at the given time",
            conflictingShowId: conflictingShow.id,
          },
          { status: 400 }
        );
      }

      const requestedAuditoriumId = Number(auditoriumId);

      const seatTypeRows = await prisma.seat.findMany({
        where: { auditoriumId: requestedAuditoriumId },
        distinct: ["seatType"],
        select: { seatType: true },
      });

      const auditoriumSeatTypes = seatTypeRows
        .map((s) => s.seatType)
        .filter(Boolean);

      if (auditoriumSeatTypes.length === 0) {
        return NextResponse.json(
          { error: "Auditorium has no seats" },
          { status: 400 }
        );
      }

      const priceBySeatType = new Map<SeatType, number>();
      if (Array.isArray(seatPrices)) {
        for (const entry of seatPrices) {
          const seatType = entry?.seatType;
          const priceCents = entry?.priceCents ?? entry?.price;
          if (!seatType || typeof priceCents !== "number") continue;
          if (!Object.values(SeatType).includes(seatType)) continue;
          priceBySeatType.set(seatType, Math.round(priceCents));
        }
      } else if (seatPrices && typeof seatPrices === "object") {
        for (const [key, value] of Object.entries(seatPrices)) {
          if (!Object.values(SeatType).includes(key as SeatType)) continue;
          if (typeof value !== "number") continue;
          priceBySeatType.set(key as SeatType, Math.round(value));
        }
      }

      const missingSeatTypes = auditoriumSeatTypes.filter(
        (st) => !priceBySeatType.has(st)
      );
      if (missingSeatTypes.length) {
        return NextResponse.json(
          {
            error: "Missing seat prices for one or more seat types",
            missingSeatTypes,
          },
          { status: 400 }
        );
      }

      const data = await prisma.show.create({
        data: {
          movieId: Number(movieId),
          startAt: requestedStart,
          auditoriumId: requestedAuditoriumId,
          seatPrices: {
            create: auditoriumSeatTypes.map((seatType) => ({
              seatType,
              priceCents: priceBySeatType.get(seatType)!,
            })),
          },
        },
      });
      return NextResponse.json(
        { data: data.id, message: "Success!" },
        { status: 200 }
      );
    } catch {
      return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
  },
  ["Admin"]
);
