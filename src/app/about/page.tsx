import type { Metadata } from "next";
import { Award, Compass, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about SmaKTis Consultancy, its mission, founder expertise, and approach to ethical academic and research support."
};

export default function AboutPage() {
  return (
    <>
      <section className="page-hero">
        <p className="eyebrow">About SmaKTis</p>
        <h1>A Sweden-based consultancy for academic and life science progress</h1>
        <p>
          SmaKTis Consultancy is led by Jacob Olaleye Onireti, PhD, with
          expertise across biochemistry, molecular diagnostics, molecular
          biology, and drug discovery.
        </p>
      </section>

      <section className="section split-section">
        <div>
          <p className="eyebrow">Mission</p>
          <h2>Reliable, high-quality, and ethical support</h2>
          <p>
            The mission is to help students, professional researchers, and
            organizations achieve academic and research goals through tailored
            support that respects integrity, confidentiality, and scientific
            quality.
          </p>
        </div>
        <div className="value-stack">
          <article>
            <Award aria-hidden="true" size={24} />
            <h3>Scientific expertise</h3>
            <p>
              Support grounded in life science research, diagnostics, molecular
              biology, and drug discovery experience.
            </p>
          </article>
          <article>
            <Compass aria-hidden="true" size={24} />
            <h3>Tailored guidance</h3>
            <p>
              Services are scoped around the client type, timeline, deliverable,
              and expected decision or learning outcome.
            </p>
          </article>
          <article>
            <ShieldCheck aria-hidden="true" size={24} />
            <h3>Ethical delivery</h3>
            <p>
              Academic support is guidance-led and designed to keep ownership
              and authorship where they belong.
            </p>
          </article>
        </div>
      </section>

      <section className="section vision-band">
        <p className="eyebrow">Vision</p>
        <h2>
          To become a trusted partner for schools, universities, researchers,
          and biotech start-ups in Sweden.
        </h2>
      </section>
    </>
  );
}
