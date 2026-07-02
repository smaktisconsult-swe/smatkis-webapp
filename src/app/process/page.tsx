import type { Metadata } from "next";

import { ContactForm } from "@/components/ContactForm";
import { ResearchLoop } from "@/components/ResearchLoop";
import { processSteps } from "@/lib/content";

export const metadata: Metadata = {
  title: "Process",
  description:
    "See how SmaKTis scopes, agrees, delivers, revises, and follows up on academic, research, and R&D support projects."
};

export default function ProcessPage() {
  return (
    <>
      <section className="page-hero">
        <p className="eyebrow">Process</p>
        <h1>Clear agreements, regular updates, and scoped delivery</h1>
        <p>
          Each project begins with a careful consultation so the work is useful,
          ethical, and appropriately sized for the client goal.
        </p>
      </section>

      <section className="section split-section">
        <div className="process-list">
          {processSteps.map((step, index) => (
            <article key={step.title}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <div>
                <h2>{step.title}</h2>
                <p>{step.copy}</p>
              </div>
            </article>
          ))}
        </div>
        <ResearchLoop />
      </section>

      <section className="section request-section">
        <div className="section-heading">
          <p className="eyebrow">Begin</p>
          <h2>Start with a concise project request</h2>
        </div>
        <ContactForm compact />
      </section>
    </>
  );
}
