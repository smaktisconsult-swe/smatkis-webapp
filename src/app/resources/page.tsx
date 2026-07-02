import type { Metadata } from "next";
import { BookOpen } from "lucide-react";

import { resourcePosts } from "@/lib/content";

export const metadata: Metadata = {
  title: "Resources",
  description:
    "Practical academic, research, and biotech R&D resources from SmaKTis Consultancy."
};

export default function ResourcesPage() {
  return (
    <>
      <section className="page-hero compact-hero">
        <p className="eyebrow">Resources</p>
        <h1>Practical notes for academic and research work</h1>
        <p>
          The resource library will grow with guidance on scientific writing,
          literature review, data interpretation, and early R&D decisions.
        </p>
      </section>

      <section className="section">
        <div className="resource-grid large">
          {resourcePosts.map((post) => (
            <article className="resource-card" key={post.slug}>
              <BookOpen aria-hidden="true" size={24} />
              <p>{post.category} · {post.readMinutes} min read</p>
              <h2>{post.title}</h2>
              <span>{post.excerpt}</span>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
