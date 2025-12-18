-- CreateTable
CREATE TABLE "seatPrice" (
    "id" SERIAL NOT NULL,
    "showId" INTEGER NOT NULL,
    "seatType" "SeatType" NOT NULL,
    "priceCents" INTEGER NOT NULL,

    CONSTRAINT "seatPrice_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "seatPrice" ADD CONSTRAINT "seatPrice_showId_fkey" FOREIGN KEY ("showId") REFERENCES "show"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
