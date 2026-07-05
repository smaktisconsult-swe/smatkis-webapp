"use server";

import { LeadStatus, Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import {
  BOOKING_TIME_ZONE,
  isBookableConsultationSlot,
  isISODateString
} from "@/lib/booking";
import {
  createAdminSession,
  destroyAdminSession,
  isAdminAuthConfigured,
  requireAdminSession,
  verifyAdminCredentials
} from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

const leadStatuses = Object.values(LeadStatus);

function getStringValue(formData: FormData, key: string) {
  const value = formData.get(key);

  return typeof value === "string" ? value.trim() : "";
}

function getReturnDate(formData: FormData, fallback?: string) {
  const returnDate = getStringValue(formData, "returnDate") || fallback || "";

  return isISODateString(returnDate) ? returnDate : undefined;
}

function redirectToAdmin(key: string, value: string, date?: string) {
  const params = new URLSearchParams();
  params.set(key, value);

  if (date && isISODateString(date)) {
    params.set("date", date);
  }

  redirect(`/admin?${params.toString()}`);
}

export async function signInAdmin(formData: FormData) {
  if (!isAdminAuthConfigured()) {
    redirectToAdmin("auth", "config");
  }

  const email = getStringValue(formData, "email");
  const password = getStringValue(formData, "password");
  const isValid = await verifyAdminCredentials(email, password);

  if (!isValid) {
    redirectToAdmin("auth", "failed");
  }

  await createAdminSession(email);
  redirect("/admin");
}

export async function signOutAdmin() {
  await destroyAdminSession();
  redirectToAdmin("auth", "signed-out");
}

export async function blockConsultationSlot(formData: FormData) {
  const session = await requireAdminSession();
  const date = getStringValue(formData, "date");
  const time = getStringValue(formData, "time");
  const reason = getStringValue(formData, "reason") || null;
  const returnDate = getReturnDate(formData, date);

  if (!isBookableConsultationSlot(date, time)) {
    redirectToAdmin("slot", "invalid", returnDate);
  }

  const existingBooking = await prisma.leadInquiry.findUnique({
    where: {
      LeadInquiry_consultation_slot_key: {
        consultationDate: date,
        consultationTime: time,
        consultationTimeZone: BOOKING_TIME_ZONE
      }
    },
    select: {
      id: true
    }
  });

  if (existingBooking) {
    redirectToAdmin("slot", "booked", returnDate);
  }

  try {
    await prisma.blockedConsultationSlot.create({
      data: {
        date,
        time,
        timeZone: BOOKING_TIME_ZONE,
        reason,
        blockedByEmail: session.email
      }
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      redirectToAdmin("slot", "already-blocked", returnDate);
    }

    console.error("Unable to block consultation slot", error);
    redirectToAdmin("slot", "error", returnDate);
  }

  revalidatePath("/admin");
  revalidatePath("/contact");
  redirectToAdmin("slot", "blocked", returnDate);
}

export async function unblockConsultationSlot(formData: FormData) {
  await requireAdminSession();
  const id = getStringValue(formData, "id");
  const returnDate = getReturnDate(formData);

  if (!id) {
    redirectToAdmin("slot", "invalid", returnDate);
  }

  try {
    await prisma.blockedConsultationSlot.delete({
      where: {
        id
      }
    });
  } catch (error) {
    console.error("Unable to unblock consultation slot", error);
    redirectToAdmin("slot", "error", returnDate);
  }

  revalidatePath("/admin");
  revalidatePath("/contact");
  redirectToAdmin("slot", "unblocked", returnDate);
}

export async function updateLeadStatus(formData: FormData) {
  await requireAdminSession();
  const id = getStringValue(formData, "id");
  const status = getStringValue(formData, "status");
  const returnDate = getReturnDate(formData);

  if (!id || !leadStatuses.includes(status as LeadStatus)) {
    redirectToAdmin("lead", "invalid", returnDate);
  }

  try {
    await prisma.leadInquiry.update({
      where: {
        id
      },
      data: {
        status: status as LeadStatus
      }
    });
  } catch (error) {
    console.error("Unable to update lead status", error);
    redirectToAdmin("lead", "error", returnDate);
  }

  revalidatePath("/admin");
  redirectToAdmin("lead", "updated", returnDate);
}
