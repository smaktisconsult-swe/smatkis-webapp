import type { Metadata } from "next";
import { CircleAlert, Mail, MapPin, Phone } from "lucide-react";

import { ContactForm } from "@/components/ContactForm";
import {
  BOOKING_TIME_ZONE,
  getBookingDateTime,
  type UnavailableConsultationSlot
} from "@/lib/booking";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Book a Consultation",
  description:
    "Book a 30-minute consultation slot with SmaKTis Consultancy for academic, research, teaching, workshop, or biotech R&D support."
};

export const dynamic = "force-dynamic";

type ContactPageProps = {
  searchParams?: Promise<ContactPageSearchParams>;
};

type ContactPageSearchParams = {
  booking?: string | string[];
};

const bookingMessages = {
  invalid: "Please choose a valid future weekday consultation slot.",
  unavailable:
    "That consultation slot has just been booked. Please choose another available time.",
  error:
    "We could not save this consultation request. Please try again or contact SmaKTis directly."
};

async function getUnavailableConsultationSlots(): Promise<UnavailableConsultationSlot[]> {
  try {
    const today = getBookingDateTime().date;
    const [bookedSlots, blockedSlots] = await Promise.all([
      prisma.leadInquiry.findMany({
        where: {
          consultationDate: {
            gte: today
          },
          consultationTimeZone: BOOKING_TIME_ZONE
        },
        select: {
          consultationDate: true,
          consultationTime: true
        }
      }),
      prisma.blockedConsultationSlot.findMany({
        where: {
          date: {
            gte: today
          },
          timeZone: BOOKING_TIME_ZONE
        },
        select: {
          date: true,
          time: true
        }
      })
    ]);

    return [
      ...bookedSlots.map((slot) => ({
        date: slot.consultationDate,
        time: slot.consultationTime,
        label: "Booked"
      })),
      ...blockedSlots.map((slot) => ({
        date: slot.date,
        time: slot.time,
        label: "Unavailable"
      }))
    ];
  } catch (error) {
    console.error("Unable to load unavailable consultation slots", error);
    return [];
  }
}

function getBookingMessage(booking: string | string[] | undefined) {
  const key = Array.isArray(booking) ? booking[0] : booking;

  if (key === "invalid" || key === "unavailable" || key === "error") {
    return bookingMessages[key];
  }

  return null;
}

export default async function ContactPage({ searchParams }: ContactPageProps) {
  const unavailableSlotsPromise = getUnavailableConsultationSlots();
  const resolvedSearchParams: ContactPageSearchParams = searchParams
    ? await searchParams
    : {};
  const unavailableSlots = await unavailableSlotsPromise;
  const bookingMessage = getBookingMessage(resolvedSearchParams.booking);

  return (
    <>
      <section className="page-hero compact-hero">
        <p className="eyebrow">Book a consultation</p>
        <h1>Choose a 30-minute slot and share what you need</h1>
        <p>
          Select an available consultation time, then share the audience,
          deadline, project type, and expected output. SmaKTis will respond with
          next steps for scope and pricing.
        </p>
      </section>

      <section className="section contact-layout">
        <div className="contact-form-stack">
          {bookingMessage ? (
            <div className="form-alert" role="alert">
              <CircleAlert aria-hidden="true" size={20} />
              <p>{bookingMessage}</p>
            </div>
          ) : null}

          <ContactForm unavailableSlots={unavailableSlots} />
        </div>

        <aside className="contact-panel">
          <h2>Direct contact</h2>
          <a href="mailto:smaktisconsult@gmail.com">
            <Mail aria-hidden="true" size={18} />
            smaktisconsult@gmail.com
          </a>
          <a href="tel:+46729392765">
            <Phone aria-hidden="true" size={18} />
            (+46) 0729392765
          </a>
          <span>
            <MapPin aria-hidden="true" size={18} />
            Södertälje / Stockholm, Sweden
          </span>
          <p>
            Slots are 30 minutes and shown in Stockholm time. For student
            support, include your deadline and institution rules. For research
            or biotech work, note any confidentiality or NDA needs.
          </p>
        </aside>
      </section>
    </>
  );
}
