import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { ServiceCard } from "@/components/ServiceCard";
import { services } from "@/lib/content";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Explore SmaKTis services for schools, students, researchers, academics, and biotech R&D teams."
};

export default function ServicesPage() {
  return (
    <>
      <section className="page-hero compact-hero">
        <p className="eyebrow">Services</p>
        <h1>Focused support for education, research, and biotech R&D</h1>
        <p>
          Choose the service path that matches your goal, then start with a
          consultation to define scope, ethics, timeline, and pricing.
        </p>
      </section>

      <section className="section">
        <div className="service-grid all-services">
          {services.map((service) => (
            <ServiceCard key={service.slug} service={service} />
          ))}
        </div>
      </section>

      <section className="cta-band">
        <div>
          <p className="eyebrow">Not sure what fits?</p>
          <h2>A short consultation can turn a broad need into a clear plan.</h2>
        </div>
        <Link className="button light" href="/contact">
          <span>Start a request</span>
          <ArrowRight aria-hidden="true" size={18} />
        </Link>
      </section>
    </>
  );
}
