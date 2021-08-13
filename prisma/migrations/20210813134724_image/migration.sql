/*
  Warnings:

  - You are about to drop the column `logoLqip` on the `Company` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Company" DROP COLUMN "logoLqip",
ADD COLUMN     "logoId" TEXT;

-- CreateTable
CREATE TABLE "Image" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "lqip" TEXT NOT NULL,
    "width" INTEGER NOT NULL,
    "height" INTEGER NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Image.url_unique" ON "Image"("url");

-- AddForeignKey
ALTER TABLE "Company" ADD FOREIGN KEY ("logoId") REFERENCES "Image"("id") ON DELETE SET NULL ON UPDATE CASCADE;
