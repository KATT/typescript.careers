/*
  Warnings:

  - You are about to drop the column `blob` on the `Image` table. All the data in the column will be lost.
  - Added the required column `base64` to the `Image` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Image" DROP COLUMN "blob",
ADD COLUMN     "base64" TEXT NOT NULL;
