const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const services = [
  {
    slug: "education-support",
    title: "Education Support",
    audience: "Schools and individual learners",
    summary:
      "Science tutoring, substitute teaching support, and structured academic guidance across chemistry, physics, mathematics, biochemistry, and molecular biology.",
    startingFrom: "135 SEK/hour",
    displayOrder: 1
  },
  {
    slug: "student-research-support",
    title: "Student Research Support",
    audience: "Master's and PhD students",
    summary:
      "Ethical research coaching for literature reviews, thesis structure, scientific writing feedback, proofreading, data interpretation, and presentations.",
    startingFrom: "1,500 SEK/project",
    displayOrder: 2
  },
  {
    slug: "research-consultancy",
    title: "Research Consultancy",
    audience: "Researchers, labs, and academics",
    summary:
      "Proposal preparation, manuscript support, wet lab consultation, literature reviews, data analysis, and research assistantship for life science projects.",
    startingFrom: "5,000 SEK/project",
    displayOrder: 3
  },
  {
    slug: "biotech-rd-support",
    title: "Biotech R&D Support",
    audience: "Biotech startups and R&D teams",
    summary:
      "Literature intelligence, biomolecular data interpretation, mechanism-of-action analysis, research reports, and project support for early R&D decisions.",
    startingFrom: "Custom quote",
    displayOrder: 4
  },
  {
    slug: "workshops-training",
    title: "Workshops and Training",
    audience: "Schools, universities, research groups, and teams",
    summary:
      "Institutional sessions on scientific writing, research methods, literature reviews, data analysis fundamentals, and responsible research practice.",
    startingFrom: "10,000 SEK/session",
    displayOrder: 5
  }
];

const resources = [
  {
    slug: "prepare-for-research-consultation",
    title: "How to prepare for a research consultation",
    excerpt:
      "A practical checklist for turning an early research question into a focused project conversation.",
    category: "Research Planning",
    readMinutes: 4,
    body:
      "Bring your research question, current materials, deadlines, expected deliverables, and any ethical or confidentiality requirements. A strong consultation starts with clarity about scope."
  },
  {
    slug: "ethical-academic-support",
    title: "What ethical academic support should look like",
    excerpt:
      "How students can get meaningful guidance while keeping ownership of their own academic work.",
    category: "Academic Integrity",
    readMinutes: 5,
    body:
      "Ethical support improves understanding, structure, analysis, and presentation. It does not replace the student's own work or misrepresent authorship."
  },
  {
    slug: "biotech-literature-intelligence",
    title: "Why literature intelligence matters before early R&D experiments",
    excerpt:
      "A concise view of how structured scientific review can reduce uncertainty before costly lab work.",
    category: "Biotech R&D",
    readMinutes: 6,
    body:
      "Early biotech teams can use literature intelligence to clarify mechanisms, assess evidence quality, identify risk areas, and prioritize experiments."
  }
];

async function main() {
  for (const service of services) {
    await prisma.serviceOffering.upsert({
      where: { slug: service.slug },
      update: service,
      create: service
    });
  }

  for (const resource of resources) {
    await prisma.resourcePost.upsert({
      where: { slug: resource.slug },
      update: resource,
      create: resource
    });
  }

  await prisma.testimonial.upsert({
    where: { id: "placeholder-testimonial" },
    update: {
      clientType: "Early client feedback",
      quote:
        "SmaKTis is preparing a testimonial library as projects are completed and client approvals are received.",
      attribution: "Anonymous preview",
      isPublished: false
    },
    create: {
      id: "placeholder-testimonial",
      clientType: "Early client feedback",
      quote:
        "SmaKTis is preparing a testimonial library as projects are completed and client approvals are received.",
      attribution: "Anonymous preview",
      isPublished: false
    }
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
