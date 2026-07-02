import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  ClipboardCheck,
  GraduationCap,
  ShieldCheck
} from "lucide-react";

import { ResearchLoop } from "@/components/ResearchLoop";
import { ServiceCard } from "@/components/ServiceCard";
import {
  audiencePaths,
  processSteps,
  resourcePosts,
  services
} from "@/lib/content";

export default function HomePage() {
  return (
    <>
      <section className="hero-section">
        <div className="hero-content">
          <p className="eyebrow">Academic and life science consultancy</p>
          <h1>Expert Academic and Life Science Research Support in Sweden</h1>
          <p className="hero-copy">
            SmaKTis helps schools, students, researchers, and biotech teams with
            tutoring, scientific writing, literature review, data interpretation,
            lab consultation, and tailored project guidance.
          </p>
          <div className="hero-actions">
            <Link className="button" href="/contact">
              <span>Book a consultation</span>
              <ArrowRight aria-hidden="true" size={18} />
            </Link>
            <Link className="button secondary" href="/services">
              Explore services
            </Link>
          </div>
          <div className="hero-proof" aria-label="SmaKTis trust highlights">
            <span>
              <ShieldCheck aria-hidden="true" size={18} />
              Ethical support
            </span>
            <span>
              <GraduationCap aria-hidden="true" size={18} />
              PhD-level expertise
            </span>
            <span>
              <ClipboardCheck aria-hidden="true" size={18} />
              Clear scope and delivery
            </span>
          </div>
        </div>

        <div className="hero-visual">
          <Image
            src="/images/smaktis-hero.png"
            alt="Scientific workspace with laptop charts, molecular notes, microscope slide, and academic materials."
            fill
            priority
            sizes="(max-width: 900px) 100vw, 48vw"
          />
          <div className="hero-visual-panel">
            <strong>15-25</strong>
            <span>target monthly clients in year one</span>
          </div>
        </div>
      </section>

      <section className="section audience-section" aria-labelledby="audience-title">
        <div className="section-heading">
          <p className="eyebrow">Who it helps</p>
          <h2 id="audience-title">Specialist support for distinct academic and research needs</h2>
        </div>
        <div className="audience-grid">
          {audiencePaths.map((audience) => (
            <Link className="audience-card" href={audience.href} key={audience.title}>
              <span>{audience.title}</span>
              <p>{audience.copy}</p>
              <ArrowRight aria-hidden="true" size={18} />
            </Link>
          ))}
        </div>
      </section>

      <section className="section services-preview" aria-labelledby="services-title">
        <div className="section-heading row">
          <div>
            <p className="eyebrow">Services</p>
            <h2 id="services-title">From classroom support to biotech R&D insight</h2>
          </div>
          <Link className="text-link" href="/services">
            <span>View all services</span>
            <ArrowRight aria-hidden="true" size={16} />
          </Link>
        </div>
        <div className="service-grid">
          {services.slice(0, 3).map((service) => (
            <ServiceCard key={service.slug} service={service} />
          ))}
        </div>
      </section>

      <section className="section split-section" aria-labelledby="why-title">
        <div>
          <p className="eyebrow">Why SmaKTis</p>
          <h2 id="why-title">Scientific depth with a careful, ethical delivery model</h2>
          <p>
            The consultancy is built around reliable support, clear agreements,
            confidentiality, and responsible academic practice. Each project
            begins with a scoped consultation so the work fits the client,
            deadline, and expected outcome.
          </p>
          <ul className="check-list">
            <li>
              <CheckCircle2 aria-hidden="true" size={18} />
              Biochemistry, molecular diagnostics, molecular biology, and drug
              discovery expertise.
            </li>
            <li>
              <CheckCircle2 aria-hidden="true" size={18} />
              Support for individual clients, institutions, research groups, and
              early R&D teams.
            </li>
            <li>
              <CheckCircle2 aria-hidden="true" size={18} />
              Academic integrity boundaries for student-facing work.
            </li>
          </ul>
        </div>
        <ResearchLoop />
      </section>

      <section className="section process-preview" aria-labelledby="process-title">
        <div className="section-heading">
          <p className="eyebrow">Process</p>
          <h2 id="process-title">A clear path from question to deliverable</h2>
        </div>
        <div className="process-grid">
          {processSteps.map((step, index) => (
            <article className="process-step" key={step.title}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <h3>{step.title}</h3>
              <p>{step.copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section resources-preview" aria-labelledby="resources-title">
        <div className="section-heading row">
          <div>
            <p className="eyebrow">Resources</p>
            <h2 id="resources-title">Useful thinking for research and academic work</h2>
          </div>
          <Link className="text-link" href="/resources">
            <span>Read resources</span>
            <ArrowRight aria-hidden="true" size={16} />
          </Link>
        </div>
        <div className="resource-grid">
          {resourcePosts.map((post) => (
            <article className="resource-card" key={post.slug}>
              <p>{post.category} · {post.readMinutes} min read</p>
              <h3>{post.title}</h3>
              <span>{post.excerpt}</span>
            </article>
          ))}
        </div>
      </section>

      <section className="cta-band">
        <div>
          <p className="eyebrow">Start with a scoped conversation</p>
          <h2>Ready to discuss an academic, research, or R&D goal?</h2>
        </div>
        <Link className="button light" href="/contact">
          <span>Book a consultation</span>
          <ArrowRight aria-hidden="true" size={18} />
        </Link>
      </section>
    </>
  );
}
