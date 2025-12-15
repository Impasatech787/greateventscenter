/*
  Warnings:

  - You are about to drop the column `seatId` on the `booking` table. All the data in the column will be lost.
  - You are about to drop the column `stripePaymentId` on the `booking` table. All the data in the column will be lost.
  - Added the required column `expiresAt` to the `booking` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `status` on the `booking` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `columnOffset` to the `seat` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rowOffset` to the `seat` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "BookingStatus" AS ENUM ('INITIATED', 'BOOKED', 'EXPIRED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('CASH', 'CARD');

-- DropForeignKey
ALTER TABLE "booking" DROP CONSTRAINT "booking_seatId_fkey";

-- DropForeignKey
ALTER TABLE "booking" DROP CONSTRAINT "booking_userId_fkey";

-- AlterTable
ALTER TABLE "booking" DROP COLUMN "seatId",
DROP COLUMN "stripePaymentId",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "expiresAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "invoiceId" INTEGER,
ADD COLUMN     "paymentMethod" "PaymentMethod",
ADD COLUMN     "paymentReferenceId" TEXT,
DROP COLUMN "status",
ADD COLUMN     "status" "BookingStatus" NOT NULL,
ALTER COLUMN "reservedAt" DROP NOT NULL,
ALTER COLUMN "reservedAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "seat" ADD COLUMN     "columnOffset" INTEGER NOT NULL,
ADD COLUMN     "rowOffset" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "invoice" (
    "id" SERIAL NOT NULL,
    "priceCents" INTEGER NOT NULL,
    "paymentMethod" "PaymentMethod" NOT NULL,
    "userName" TEXT NOT NULL,
    "detailJson" TEXT NOT NULL,
    "remarks" TEXT NOT NULL,

    CONSTRAINT "invoice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bookingSeat" (
    "id" SERIAL NOT NULL,
    "bookingId" INTEGER NOT NULL,
    "seatId" INTEGER,

    CONSTRAINT "bookingSeat_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "booking" ADD CONSTRAINT "booking_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "invoice"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "booking" ADD CONSTRAINT "booking_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookingSeat" ADD CONSTRAINT "bookingSeat_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "booking"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookingSeat" ADD CONSTRAINT "bookingSeat_seatId_fkey" FOREIGN KEY ("seatId") REFERENCES "seat"("id") ON DELETE SET NULL ON UPDATE CASCADE;
