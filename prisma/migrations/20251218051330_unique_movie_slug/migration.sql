/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `movie` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "movie_slug_key" ON "movie"("slug");
