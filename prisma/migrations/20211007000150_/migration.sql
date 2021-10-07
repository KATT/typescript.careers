-- DropForeignKey
ALTER TABLE "Job" DROP CONSTRAINT "Job_companyId_fkey";

-- DropForeignKey
ALTER TABLE "Job" DROP CONSTRAINT "Job_sourceSlug_fkey";

-- AddForeignKey
ALTER TABLE "Job" ADD CONSTRAINT "Job_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Job" ADD CONSTRAINT "Job_sourceSlug_fkey" FOREIGN KEY ("sourceSlug") REFERENCES "Source"("slug") ON DELETE RESTRICT ON UPDATE CASCADE;

-- RenameIndex
ALTER INDEX "Company.name_unique" RENAME TO "Company_name_key";

-- RenameIndex
ALTER INDEX "Company_logoId_unique" RENAME TO "Company_logoId_key";

-- RenameIndex
ALTER INDEX "Image.originalUrl_unique" RENAME TO "Image_originalUrl_key";

-- RenameIndex
ALTER INDEX "Job.shortId_unique" RENAME TO "Job_shortId_key";

-- RenameIndex
ALTER INDEX "Job.sourceSlug_sourceKey_unique" RENAME TO "Job_sourceSlug_sourceKey_key";

-- RenameIndex
ALTER INDEX "Source.slug_unique" RENAME TO "Source_slug_key";
