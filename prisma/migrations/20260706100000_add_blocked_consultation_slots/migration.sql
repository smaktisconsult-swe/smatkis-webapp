-- CreateTable
CREATE TABLE "BlockedConsultationSlot" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "date" TEXT NOT NULL,
    "time" TEXT NOT NULL,
    "timeZone" TEXT NOT NULL DEFAULT 'Europe/Stockholm',
    "reason" TEXT,
    "blockedByEmail" TEXT,

    CONSTRAINT "BlockedConsultationSlot_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BlockedConsultationSlot_slot_key" ON "BlockedConsultationSlot"("date", "time", "timeZone");

-- CreateIndex
CREATE INDEX "BlockedConsultationSlot_date_time_idx" ON "BlockedConsultationSlot"("date", "time");
