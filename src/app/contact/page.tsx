import type { Metadata } from "next";
import { Mail, MapPin, Phone } from "lucide-react";

import { ContactForm } from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Book a Consultation",
  description:
    "Book a 30-minute consultation slot with SmaKTis Consultancy for academic, research, teaching, workshop, or biotech R&D support."
};

export default function ContactPage() {
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
        <ContactForm />

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
