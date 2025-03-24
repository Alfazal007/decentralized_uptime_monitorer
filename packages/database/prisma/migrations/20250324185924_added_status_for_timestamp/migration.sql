-- CreateEnum
CREATE TYPE "Status" AS ENUM ('Good', 'Bad', 'Grey');

-- CreateTable
CREATE TABLE "StatusTimeStamp" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "Status" NOT NULL DEFAULT 'Grey',

    CONSTRAINT "StatusTimeStamp_pkey" PRIMARY KEY ("id")
);
