/*
  Warnings:

  - A unique constraint covering the columns `[logoId]` on the table `Company` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Company_logoId_unique" ON "Company"("logoId");
