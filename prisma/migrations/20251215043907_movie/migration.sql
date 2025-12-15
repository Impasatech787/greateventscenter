/*
  Warnings:

  - You are about to drop the column `movieTitle` on the `show` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "show" DROP COLUMN "movieTitle",
ADD COLUMN     "movieId" INTEGER;

-- CreateTable
CREATE TABLE "movie" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "durationMin" INTEGER NOT NULL,
    "language" TEXT NOT NULL,
    "releaseDate" TIMESTAMP(3) NOT NULL,
    "posterUrl" TEXT,
    "trailerUrl" TEXT,
    "genres" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "movie_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "show" ADD CONSTRAINT "show_movieId_fkey" FOREIGN KEY ("movieId") REFERENCES "movie"("id") ON DELETE CASCADE ON UPDATE CASCADE;
