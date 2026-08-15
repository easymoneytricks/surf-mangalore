-- AlterTable
ALTER TABLE "public"."Coach" ADD COLUMN     "coverPhotoUrl" TEXT,
ADD COLUMN     "websiteUrl" TEXT;

-- CreateIndex
CREATE INDEX "Coach_websiteUrl_idx" ON "public"."Coach"("websiteUrl");
