import { withAuth } from "@/lib/withAuth";
import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@/lib/prisma";

export const POST = withAuth(
  async (req: NextRequest, _params: unknown) => {
    try {
      const { movieId, date, audiId } = await req.json();

      const booking = await Prisma?.booking.findMany({
        where: {
          movieId,
          auditorium: audiId,
        },
      });
      console.log(booking);
    } catch (error) {
      console.error(error);
      return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
  },
  ["Admin"],
);
