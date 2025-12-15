/*
  Warnings:

  - Changed the type of `seatType` on the `seat` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "SeatType" AS ENUM ('REGULAR', 'REGULAR_WHEELCHAIR_ACCESSIBLE');

-- AlterTable
ALTER TABLE "seat" DROP COLUMN "seatType",
ADD COLUMN     "seatType" "SeatType" NOT NULL;
