-- Default terms on the business profile (roadmap P1 templates / default terms).
ALTER TABLE "BusinessProfile" ADD COLUMN "defaultDueInDays" INTEGER NOT NULL DEFAULT 14;
ALTER TABLE "BusinessProfile" ADD COLUMN "defaultTaxRateBps" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "BusinessProfile" ADD COLUMN "defaultNotes" TEXT;
