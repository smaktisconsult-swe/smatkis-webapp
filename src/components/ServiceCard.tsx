import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import type { Service } from "@/lib/content";
import { IconBadge } from "@/components/IconBadge";

export function ServiceCard({ service }: { service: Service }) {
  return (
    <article className="service-card">
      <div className="service-card-media">
        <Image
          src={service.image}
          alt={service.imageAlt}
          fill
          sizes="(max-width: 760px) 100vw, 33vw"
        />
      </div>
      <div className="service-card-body">
        <div className="service-card-heading">
          <IconBadge icon={service.icon} label={`${service.title} icon`} />
          <div>
            <p>{service.eyebrow}</p>
            <h3>{service.title}</h3>
          </div>
        </div>
        <p>{service.summary}</p>
        <Link className="text-link" href={`/services/${service.slug}`}>
          <span>{service.cta}</span>
          <ArrowRight aria-hidden="true" size={16} />
        </Link>
      </div>
    </article>
  );
}
