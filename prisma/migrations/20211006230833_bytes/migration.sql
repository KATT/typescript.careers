/*
  Warnings:

  - You are about to drop the column `url` on the `Image` table. All the data in the column will be lost.
  - Added the required column `blob` to the `Image` table without a default value. This is not possible if the table is not empty.
  - Added the required column `mimetype` to the `Image` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Image.url_unique";

-- AlterTable
ALTER TABLE "Image" DROP COLUMN "url",
ADD COLUMN     "blob" BYTEA NOT NULL,
ADD COLUMN     "mimetype" TEXT NOT NULL;
