/*
  Warnings:

  - Added the required column `websiteId` to the `StatusTimeStamp` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "StatusTimeStamp" ADD COLUMN     "websiteId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "StatusTimeStamp" ADD CONSTRAINT "StatusTimeStamp_websiteId_fkey" FOREIGN KEY ("websiteId") REFERENCES "Website"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
