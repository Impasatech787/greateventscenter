-- CreateEnum
CREATE TYPE "BlogStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'REMOVED', 'ARCHIVED');

-- AlterTable
ALTER TABLE "blog" ADD COLUMN     "status" "BlogStatus" NOT NULL DEFAULT 'DRAFT';
