ALTER TABLE "LeadInquiry" ADD COLUMN "consultationDate" TEXT NOT NULL DEFAULT '';
ALTER TABLE "LeadInquiry" ADD COLUMN "consultationTime" TEXT NOT NULL DEFAULT '';
ALTER TABLE "LeadInquiry" ADD COLUMN "consultationTimeZone" TEXT NOT NULL DEFAULT 'Europe/Stockholm';
ALTER TABLE "LeadInquiry" ADD COLUMN "consultationDurationMinutes" INTEGER NOT NULL DEFAULT 30;
