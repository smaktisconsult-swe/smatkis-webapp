-- CreateIndex
CREATE UNIQUE INDEX "LeadInquiry_consultation_slot_key" ON "LeadInquiry"("consultationDate", "consultationTime", "consultationTimeZone");
