import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, CheckCircle2, ShieldCheck } from "lucide-react";

import { ContactForm } from "@/components/ContactForm";
import { IconBadge } from "@/components/IconBadge";
import { getService, services } from "@/lib/content";

type Props = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return services.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = getService(slug);

  if (!service) {
    return {};
  }

  return {
    title: service.title,
    description: service.summary
  };
}

export default async function ServiceDetailPage({ params }: Props) {
  const { slug } = await params;
  const service = getService(slug);

  if (!service) {
    notFound();
  }

  return (
    <>
      <section className="service-detail-hero">
        <div>
          <p className="eyebrow">{service.eyebrow}</p>
          <h1>{service.title}</h1>
          <p>{service.description}</p>
          <div className="hero-actions">
            <Link className="button" href="#request">
              <span>{service.cta}</span>
              <ArrowRight aria-hidden="true" size={18} />
            </Link>
            <Link className="button secondary" href="/services">
              All services
            </Link>
          </div>
        </div>
        <div className="service-detail-media">
          <Image
            src={service.image}
            alt={service.imageAlt}
            fill
            priority
            sizes="(max-width: 900px) 100vw, 44vw"
          />
        </div>
      </section>

      <section className="section service-detail-grid">
        <article>
          <div className="detail-heading">
            <IconBadge icon={service.icon} label={`${service.title} icon`} />
            <div>
              <p className="eyebrow">Typical audience</p>
              <h2>{service.audience}</h2>
            </div>
          </div>
          <p>{service.summary}</p>
          <div className="price-chip">{service.startingFrom}</div>
        </article>

        <article>
          <p className="eyebrow">Expected outcomes</p>
          <ul className="check-list">
            {service.outcomes.map((item) => (
              <li key={item}>
                <CheckCircle2 aria-hidden="true" size={18} />
                {item}
              </li>
            ))}
          </ul>
        </article>

        <article>
          <p className="eyebrow">What can be included</p>
          <ul className="check-list">
            {service.includes.map((item) => (
              <li key={item}>
                <CheckCircle2 aria-hidden="true" size={18} />
                {item}
              </li>
            ))}
          </ul>
        </article>

        <article className="ethics-card">
          <ShieldCheck aria-hidden="true" size={28} />
          <h2>Responsible support</h2>
          <p>
            Student-facing work follows academic integrity standards. Research
            and R&D projects can include confidentiality handling and scoped
            agreements before work begins.
          </p>
        </article>
      </section>

      <section className="section request-section" id="request">
        <div className="section-heading">
          <p className="eyebrow">Request support</p>
          <h2>Tell SmaKTis what you need</h2>
        </div>
        <ContactForm serviceInterest={service.title} />
      </section>
    </>
  );
}
