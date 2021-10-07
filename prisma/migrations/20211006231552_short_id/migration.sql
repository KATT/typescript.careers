/*
  Warnings:

  - A unique constraint covering the columns `[shortId]` on the table `Job` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Job" ADD COLUMN     "shortId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Job.shortId_unique" ON "Job"("shortId");
