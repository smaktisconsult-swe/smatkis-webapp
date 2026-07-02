import Link from "next/link";
import { ArrowRight, Microscope } from "lucide-react";

import { services } from "@/lib/content";

export function Header() {
  return (
    <header className="site-header">
      <Link className="brand" href="/" aria-label="SmaKTis Consultancy home">
        <span className="brand-mark">
          <Microscope aria-hidden="true" size={22} />
        </span>
        <span>
          <strong>SmaKTis</strong>
          <small>Consultancy</small>
        </span>
      </Link>

      <nav className="main-nav" aria-label="Main navigation">
        <Link href="/services">Services</Link>
        <Link href="/process">Process</Link>
        <Link href="/resources">Resources</Link>
        <Link href="/about">About</Link>
      </nav>

      <div className="header-actions">
        <Link className="ghost-link" href="/contact">
          Contact
        </Link>
        <Link className="button button-small" href="/contact">
          <span>Book</span>
          <ArrowRight aria-hidden="true" size={16} />
        </Link>
      </div>

      <div className="service-strip" aria-label="Service shortcuts">
        {services.map((service) => (
          <Link key={service.slug} href={`/services/${service.slug}`}>
            {service.title}
          </Link>
        ))}
      </div>
    </header>
  );
}
