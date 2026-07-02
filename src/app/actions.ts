"use server";

import { redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";

const required = (value: FormDataEntryValue | null) =>
  typeof value === "string" && value.trim().length > 0;

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
    redirect("/contact");
  }

  const data = {
    name: String(name).trim(),
    email: String(email).trim(),
    phone: String(formData.get("phone") ?? "").trim() || null,
    clientType: String(clientType).trim(),
    serviceInterest: String(serviceInterest).trim(),
    consultationDate: String(consultationDate).trim(),
    consultationTime: String(consultationTime).trim(),
    consultationTimeZone:
      String(formData.get("consultationTimeZone") ?? "").trim() ||
      "Europe/Stockholm",
    consultationDurationMinutes:
      Number(formData.get("consultationDurationMinutes") ?? 30) || 30,
    timeline: String(formData.get("timeline") ?? "").trim() || null,
    budgetRange: String(formData.get("budgetRange") ?? "").trim() || null,
    message: String(message).trim(),
    consent
  };

  let saved = false;

  try {
    await prisma.leadInquiry.create({ data });
    saved = true;
  } catch (error) {
    console.error("Unable to save lead inquiry", error);
  }

  redirect(saved ? "/thank-you" : "/contact");
}
