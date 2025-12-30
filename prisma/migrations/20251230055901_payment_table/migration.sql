/*
  Warnings:

  - You are about to drop the column `paymentMethod` on the `booking` table. All the data in the column will be lost.
  - You are about to drop the column `paymentReferenceId` on the `booking` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('REQUIRES_PAYMENT_METHOD', 'REQUIRES_CONFIRMATION', 'REQUIRES_ACTION', 'PROCESSING', 'REQUIRES_CAPTURE', 'CANCELED', 'SUCCEEDED');

-- AlterTable
ALTER TABLE "booking" DROP COLUMN "paymentMethod",
DROP COLUMN "paymentReferenceId",
ADD COLUMN     "paymentId" INTEGER;

-- CreateTable
CREATE TABLE "payment" (
    "id" SERIAL NOT NULL,
    "provider" "PaymentMethod" NOT NULL DEFAULT 'CARD',
    "status" "PaymentStatus" NOT NULL,
    "amountCents" INTEGER NOT NULL,
    "currency" TEXT NOT NULL,
    "userId" INTEGER,
    "bookingId" INTEGER,
    "invoiceId" INTEGER,
    "stripePaymentIntentId" TEXT NOT NULL,
    "stripeChargeId" TEXT,
    "stripeCustomerId" TEXT,
    "stripeEventLastId" TEXT,
    "livemode" BOOLEAN NOT NULL DEFAULT false,
    "receiptEmail" TEXT,
    "description" TEXT,
    "metadata" JSONB,
    "paidAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stripeEvent" (
    "id" SERIAL NOT NULL,
    "stripeEventId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "livemode" BOOLEAN NOT NULL DEFAULT false,
    "created" INTEGER,
    "processedAt" TIMESTAMP(3),
    "payload" JSONB,
    "stripePaymentIntentId" TEXT,
    "paymentId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "stripeEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "payment_bookingId_key" ON "payment"("bookingId");

-- CreateIndex
CREATE UNIQUE INDEX "payment_stripePaymentIntentId_key" ON "payment"("stripePaymentIntentId");

-- CreateIndex
CREATE UNIQUE INDEX "payment_stripeChargeId_key" ON "payment"("stripeChargeId");

-- CreateIndex
CREATE INDEX "payment_userId_idx" ON "payment"("userId");

-- CreateIndex
CREATE INDEX "payment_status_idx" ON "payment"("status");

-- CreateIndex
CREATE INDEX "payment_stripeCustomerId_idx" ON "payment"("stripeCustomerId");

-- CreateIndex
CREATE UNIQUE INDEX "stripeEvent_stripeEventId_key" ON "stripeEvent"("stripeEventId");

-- CreateIndex
CREATE INDEX "stripeEvent_type_idx" ON "stripeEvent"("type");

-- CreateIndex
CREATE INDEX "stripeEvent_processedAt_idx" ON "stripeEvent"("processedAt");

-- CreateIndex
CREATE INDEX "stripeEvent_stripePaymentIntentId_idx" ON "stripeEvent"("stripePaymentIntentId");

-- CreateIndex
CREATE INDEX "stripeEvent_paymentId_idx" ON "stripeEvent"("paymentId");

-- AddForeignKey
ALTER TABLE "payment" ADD CONSTRAINT "payment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment" ADD CONSTRAINT "payment_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "booking"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment" ADD CONSTRAINT "payment_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "invoice"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stripeEvent" ADD CONSTRAINT "stripeEvent_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "payment"("id") ON DELETE SET NULL ON UPDATE CASCADE;
