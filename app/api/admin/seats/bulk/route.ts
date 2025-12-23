import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/withAuth";

export const POST = withAuth(
  async (req: NextRequest) => {
    try {
      const body = await req.json();
      const {
        auditoriumId,
        fromRow,
        toRow,
        fromNumber,
        toNumber,
        rowOffset,
        columnOffset,
        seatType,
      } = body;

      const auditorium = await prisma.auditorium.findUnique({
        where: { id: auditoriumId },
      });
      if (!auditorium) {
        return NextResponse.json(
          { error: "Auditorium not found" },
          { status: 404 },
        );
      }

      const rows = parseRowRange(fromRow, toRow);
      const seats = [];
      for (const row of rows) {
        for (let i = fromNumber; i <= toNumber; i++) {
          seats.push({
            auditoriumId,
            row: row,
            number: i.toString(),
            seatType: seatType,
            columnOffset: row == fromRow ? columnOffset : 0,
            rowOffset: i == fromNumber ? rowOffset : 0,
          });
        }
      }

      await prisma.seat.createMany({ data: seats });

      return NextResponse.json({ message: "Success!" }, { status: 200 });
    } catch (ex) {
      console.log(ex);
      return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
  },
  ["Admin"],
);

function parseRowRange(fromRow: string, toRow: string): string[] {
  const rows: string[] = [];

  for (let c = fromRow.charCodeAt(0); c <= toRow.charCodeAt(0); c++) {
    rows.push(String.fromCharCode(c));
  }

  return rows;
}
