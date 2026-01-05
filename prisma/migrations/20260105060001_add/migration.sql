-- CreateTable
CREATE TABLE "homeBanner" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "bannerUrl" TEXT NOT NULL,
    "bannerHero" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "homeBanner_pkey" PRIMARY KEY ("id")
);
