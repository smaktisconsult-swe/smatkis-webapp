"use server";

import { Prisma } from "@prisma/client";
import { redirect } from "next/navigation";

import {
  BOOKING_TIME_ZONE,
  CONSULTATION_DURATION_MINUTES,
  isBookableConsultationSlot
} from "@/lib/booking";
import { prisma } from "@/lib/prisma";

const required = (value: FormDataEntryValue | null) =>
  typeof value === "string" && value.trim().length > 0;

function redirectToContact(reason: "invalid" | "unavailable" | "error") {
  redirect(`/contact?booking=${reason}`);
}

export async function createLead(formData: FormData) {
  const name = formData.get("name");
  const email = formData.get("email");
  const clientType = formData.get("clientType");
  const serviceInterest = formData.get("serviceInterest");
  const consultationDate = formData.get("consultationDate");
  const consultationTime = formData.get("consultationTime");
  const message = formData.get("message");
  const consent = formData.get("consent") === "on";

  if (
    !required(name) ||
    !required(email) ||
    !required(clientType) ||
    !required(serviceInterest) ||
    !required(consultationDate) ||
    !required(consultationTime) ||
    !required(message) ||
    !consent
  ) {
    redirectToContact("invalid");
  }

  const consultationDateValue = String(consultationDate).trim();
  const consultationTimeValue = String(consultationTime).trim();
  const consultationTimeZone =
    String(formData.get("consultationTimeZone") ?? "").trim() ||
    BOOKING_TIME_ZONE;
  const consultationDurationMinutes =
    Number(formData.get("consultationDurationMinutes") ?? CONSULTATION_DURATION_MINUTES) ||
    CONSULTATION_DURATION_MINUTES;

  if (
    consultationTimeZone !== BOOKING_TIME_ZONE ||
    consultationDurationMinutes !== CONSULTATION_DURATION_MINUTES ||
    !isBookableConsultationSlot(consultationDateValue, consultationTimeValue)
  ) {
    redirectToContact("invalid");
  }

  const blockedSlot = await prisma.blockedConsultationSlot.findUnique({
    where: {
      BlockedConsultationSlot_slot_key: {
        date: consultationDateValue,
        time: consultationTimeValue,
        timeZone: consultationTimeZone
      }
    }
  });

  if (blockedSlot) {
    redirectToContact("unavailable");
  }

  const data = {
    name: String(name).trim(),
    email: String(email).trim(),
    phone: String(formData.get("phone") ?? "").trim() || null,
    clientType: String(clientType).trim(),
    serviceInterest: String(serviceInterest).trim(),
    consultationDate: consultationDateValue,
    consultationTime: consultationTimeValue,
    consultationTimeZone,
    consultationDurationMinutes,
    timeline: String(formData.get("timeline") ?? "").trim() || null,
    budgetRange: String(formData.get("budgetRange") ?? "").trim() || null,
    message: String(message).trim(),
    consent
  };

  try {
    await prisma.leadInquiry.create({ data });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      redirectToContact("unavailable");
    }

    console.error("Unable to save lead inquiry", error);
    redirectToContact("error");
  }

  redirect("/thank-you");
}
