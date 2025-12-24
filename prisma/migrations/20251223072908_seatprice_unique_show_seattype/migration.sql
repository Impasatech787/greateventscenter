/*
  Warnings:

  - A unique constraint covering the columns `[showId,seatType]` on the table `seatPrice` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "seatPrice_showId_seatType_key" ON "seatPrice"("showId", "seatType");
