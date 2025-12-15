-- CreateTable
CREATE TABLE "banner" (
    "id" SERIAL NOT NULL,
    "movieId" INTEGER,
    "tag" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "buttonText" TEXT NOT NULL,
    "link" TEXT NOT NULL,

    CONSTRAINT "banner_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "banner" ADD CONSTRAINT "banner_movieId_fkey" FOREIGN KEY ("movieId") REFERENCES "movie"("id") ON DELETE SET NULL ON UPDATE CASCADE;
