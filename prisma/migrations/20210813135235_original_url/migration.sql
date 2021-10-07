/*
  Warnings:

  - A unique constraint covering the columns `[originalUrl]` on the table `Image` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Image" ADD COLUMN     "originalUrl" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Image.originalUrl_unique" ON "Image"("originalUrl");
