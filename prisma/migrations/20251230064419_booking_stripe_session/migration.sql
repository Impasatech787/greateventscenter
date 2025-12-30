/*
  Warnings:

  - A unique constraint covering the columns `[stripeCheckoutSessionId]` on the table `booking` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "booking" ADD COLUMN     "stripeCheckoutSessionId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "booking_stripeCheckoutSessionId_key" ON "booking"("stripeCheckoutSessionId");
