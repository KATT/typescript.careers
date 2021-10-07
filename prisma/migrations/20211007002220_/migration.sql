/*
  Warnings:

  - You are about to drop the column `base64` on the `Image` table. All the data in the column will be lost.
  - Added the required column `blob` to the `Image` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Image" DROP COLUMN "base64",
ADD COLUMN     "blob" BYTEA NOT NULL;
