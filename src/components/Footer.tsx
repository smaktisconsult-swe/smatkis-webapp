import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";

import { services } from "@/lib/content";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-grid">
        <div>
          <p className="footer-brand">SmaKTis Consultancy</p>
          <p className="footer-copy">
            Academic and life science research support for students, schools,
            researchers, and biotech innovators in Sweden.
          </p>
        </div>

        <div>
          <h2>Services</h2>
          <ul>
            {services.map((service) => (
              <li key={service.slug}>
                <Link href={`/services/${service.slug}`}>{service.title}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2>Company</h2>
          <ul>
            <li>
              <Link href="/about">About</Link>
            </li>
            <li>
              <Link href="/process">Process</Link>
            </li>
            <li>
              <Link href="/resources">Resources</Link>
            </li>
            <li>
              <Link href="/contact">Contact</Link>
            </li>
          </ul>
        </div>

        <address>
          <h2>Contact</h2>
          <a href="mailto:smaktisconsult@gmail.com">
            <Mail aria-hidden="true" size={16} />
            smaktisconsult@gmail.com
          </a>
          <a href="tel:+46729392765">
            <Phone aria-hidden="true" size={16} />
            (+46) 0729392765
          </a>
          <span>
            <MapPin aria-hidden="true" size={16} />
            Södertälje / Stockholm, Sweden
          </span>
        </address>
      </div>

      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} SmaKTis Consultancy.</span>
        <span>Ethical academic support. Confidential project handling.</span>
      </div>
    </footer>
  );
}
