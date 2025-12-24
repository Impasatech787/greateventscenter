import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/withAuth";
import { SeatType } from "@/app/generated/prisma";

export const GET = withAuth(
  async (req: NextRequest, params: unknown) => {
    try {
      const id = Number((params as { id: string }).id);
      const show = await prisma.show.findUnique({
        where: { id: id },
      });
      if (!show)
        return NextResponse.json({ error: "Show not found" }, { status: 404 });

      const seatPrices = await prisma.seatPrice.findMany({
        where: { showId: id },
      });

      const data = {
        id: show.id,
        movieId: show.movieId,
        startAt: show.startAt,
        auditoriumId: show.auditoriumId,
        seatPrices: seatPrices.map((sp) => ({
          seatType: sp.seatType,
          priceCents: sp.priceCents,
        })),
      };

      return NextResponse.json({ data, message: "Success!" }, { status: 200 });
    } catch {
      return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
  },
  ["Admin"]
);

export const DELETE = withAuth(
  async (req: NextRequest, params: unknown) => {
    try {
      const id = Number((params as { id: string }).id);
      const show = await prisma.show.findUnique({
        where: { id: id },
      });
      if (!show) {
        return NextResponse.json({ error: "Show not found" }, { status: 404 });
      }
      await prisma.show.delete({ where: { id } });

      return NextResponse.json(
        { data: id, message: "Success!" },
        { status: 200 }
      );
    } catch {
      return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
  },
  ["Admin"]
);

export const PATCH = withAuth(
  async (req: NextRequest, params: unknown) => {
    try {
      const id = Number((params as { id: string }).id);
      const show = await prisma.show.findUnique({
        where: { id },
      });
      if (!show) {
        return NextResponse.json({ error: "Show not found" }, { status: 404 });
      }
      const body = await req.json();
      const { movieId, startAt, auditoriumId, seatPrices } = body;

      const requestedMovieId = movieId != null ? Number(movieId) : show.movieId;
      const requestedAuditoriumId =
        auditoriumId != null ? Number(auditoriumId) : show.auditoriumId;
      const requestedStart = startAt != null ? new Date(startAt) : show.startAt;

      if (!requestedMovieId || !requestedAuditoriumId) {
        return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
      }

      if (Number.isNaN(requestedStart.getTime())) {
        return NextResponse.json({ error: "Invalid startAt" }, { status: 400 });
      }

      const requestedMovie = await prisma.movie.findUnique({
        where: { id: requestedMovieId },
        select: { durationMin: true },
      });
      if (!requestedMovie) {
        return NextResponse.json({ error: "Movie not found" }, { status: 400 });
      }

      const requestedEnd = new Date(
        requestedStart.getTime() + requestedMovie.durationMin * 60_000
      );

      const candidateShows = await prisma.show.findMany({
        where: {
          id: { not: id },
          auditoriumId: requestedAuditoriumId,
          startAt: { lt: requestedEnd },
        },
        include: {
          movie: { select: { durationMin: true } },
        },
      });
      //When calculating conflicting show make sure to exclude the current show being updated
      const conflictingShow = candidateShows.find((s) => {
        if (s.id === id) return false;
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

      if (seatPrices != null) {
        const seatTypeRows = await prisma.seat.findMany({
          where: { auditoriumId: requestedAuditoriumId },
          distinct: ["seatType"],
          select: { seatType: true },
        });

        const auditoriumSeatTypes = seatTypeRows
          .map((s) => s.seatType)
          .filter(Boolean);

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

        await prisma.seatPrice.deleteMany({ where: { showId: id } });
        await prisma.seatPrice.createMany({
          data: auditoriumSeatTypes.map((seatType) => ({
            showId: id,
            seatType,
            priceCents: priceBySeatType.get(seatType)!,
          })),
        });
      }

      await prisma.show.update({
        where: { id },
        data: {
          movieId: requestedMovieId,
          startAt: requestedStart,
          auditoriumId: requestedAuditoriumId,
        },
      });

      return NextResponse.json(
        { data: id, message: "Success!" },
        { status: 200 }
      );
    } catch (ex) {
      console.log(ex);
      return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
  },
  ["Admin"]
);
