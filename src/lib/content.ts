export type ServiceSlug =
  | "education-support"
  | "student-research-support"
  | "research-consultancy"
  | "biotech-rd-support"
  | "workshops-training";

export type Service = {
  slug: ServiceSlug;
  title: string;
  eyebrow: string;
  audience: string;
  summary: string;
  description: string;
  image: string;
  imageAlt: string;
  icon: "graduation" | "book" | "microscope" | "flask" | "presentation";
  cta: string;
  startingFrom: string;
  outcomes: string[];
  includes: string[];
};

export const services: Service[] = [
  {
    slug: "education-support",
    title: "Education Support",
    eyebrow: "Schools and learners",
    audience: "High schools, science departments, and individual learners",
    summary:
      "Science tutoring, substitute teaching, and classroom-ready support across chemistry, physics, mathematics, biochemistry, and molecular biology.",
    description:
      "SmaKTis supports schools and learners with structured science teaching, tutoring, and academic project guidance. The service is especially useful for schools that need dependable subject expertise and learners who need clear, rigorous explanations.",
    image: "/images/education-support.png",
    imageAlt:
      "A bright science classroom prepared with lab glassware, equations, and teaching materials.",
    icon: "graduation",
    cta: "Request education support",
    startingFrom: "135 SEK/hour",
    outcomes: [
      "Clearer understanding of difficult science topics",
      "Reliable subject support for schools with staffing needs",
      "Focused tutoring plans around goals, level, and timeline"
    ],
    includes: [
      "Chemistry, physics, mathematics, biochemistry, and molecular biology support",
      "Substitute teaching support for high schools",
      "Private tutoring and academic project guidance",
      "Workshop or seminar options for school groups"
    ]
  },
  {
    slug: "student-research-support",
    title: "Student Research Support",
    eyebrow: "Master's and PhD guidance",
    audience: "Master's students, PhD candidates, and early researchers",
    summary:
      "Ethical research coaching for literature reviews, thesis structure, scientific writing, proofreading, data interpretation, and presentations.",
    description:
      "Students keep full ownership of their academic work while receiving expert guidance on structure, evidence, scientific clarity, and interpretation. The service is designed to improve confidence and quality without crossing academic integrity boundaries.",
    image: "/images/student-research.png",
    imageAlt:
      "A research desk with literature notes, a laptop chart, and scientific writing materials.",
    icon: "book",
    cta: "Book student support",
    startingFrom: "1,500 SEK/project",
    outcomes: [
      "A clearer research question and project structure",
      "Stronger scientific writing and argument flow",
      "Better preparation for thesis, manuscript, or presentation milestones"
    ],
    includes: [
      "Literature review coaching",
      "Thesis and project structure feedback",
      "Scientific writing review and proofreading",
      "Data analysis and interpretation support"
    ]
  },
  {
    slug: "research-consultancy",
    title: "Research Consultancy",
    eyebrow: "Life science projects",
    audience: "Researchers, academics, labs, and research groups",
    summary:
      "Proposal preparation, manuscript support, wet lab consultation, literature reviews, data analysis, and research assistantship for life science work.",
    description:
      "SmaKTis brings PhD-level expertise in biochemistry, molecular diagnostics, molecular biology, and drug discovery to research teams that need additional scientific capacity, interpretation, or writing support.",
    image: "/images/research-consultancy.png",
    imageAlt:
      "A modern life science workspace with microscope, pipettes, sample tubes, and biomolecular data on a tablet.",
    icon: "microscope",
    cta: "Discuss a research project",
    startingFrom: "5,000 SEK/project",
    outcomes: [
      "Sharper proposals, manuscripts, and research reports",
      "Additional capacity for literature review and data interpretation",
      "Structured progress on complex lab or analysis tasks"
    ],
    includes: [
      "Wet lab consultation and assistantship",
      "Experiment planning support",
      "Proposal and manuscript preparation",
      "Systematic literature reviews and data interpretation"
    ]
  },
  {
    slug: "biotech-rd-support",
    title: "Biotech R&D Support",
    eyebrow: "R&D and startups",
    audience: "Biotech startups, R&D teams, and scientific founders",
    summary:
      "Literature intelligence, biomolecular data interpretation, mechanism-of-action analysis, research reports, and early R&D project support.",
    description:
      "For biotech teams, SmaKTis helps translate scientific literature and biomolecular data into practical R&D insight. The work can support project prioritization, mechanism exploration, and evidence-based decision-making.",
    image: "/images/biotech-rd.png",
    imageAlt:
      "A biotech R&D workspace with molecular pathway visualization, protein model, and clean data charts.",
    icon: "flask",
    cta: "Request R&D support",
    startingFrom: "Custom quote",
    outcomes: [
      "More confident early R&D decisions",
      "Clearer molecular mechanism and pathway interpretation",
      "Research summaries that founders and technical teams can use"
    ],
    includes: [
      "Scientific literature intelligence",
      "Biomolecular data interpretation",
      "Drug signaling pathway and mechanism-of-action support",
      "Research reports and recurring R&D assistance"
    ]
  },
  {
    slug: "workshops-training",
    title: "Workshops and Training",
    eyebrow: "Institutional learning",
    audience: "Schools, universities, research groups, and companies",
    summary:
      "Practical training sessions on scientific writing, research methods, literature reviews, data analysis fundamentals, and responsible research support.",
    description:
      "Workshops give teams a focused way to build capability around research planning, scientific communication, and responsible academic practice. Sessions can be tailored for students, teachers, labs, or R&D teams.",
    image: "/images/workshops-training.png",
    imageAlt:
      "A professional seminar room prepared for a science workshop with notebooks, projector, and presentation materials.",
    icon: "presentation",
    cta: "Plan a workshop",
    startingFrom: "10,000 SEK/session",
    outcomes: [
      "Shared understanding across a class, lab, or team",
      "Practical methods participants can apply immediately",
      "A tailored training format for institutional goals"
    ],
    includes: [
      "Scientific writing sessions",
      "Research methods and project planning",
      "Literature review and evidence synthesis training",
      "Data analysis fundamentals and responsible research practice"
    ]
  }
];

export const audiencePaths = [
  {
    title: "Schools",
    copy: "Reliable science teaching and substitute support for high school settings.",
    href: "/services/education-support"
  },
  {
    title: "Students",
    copy: "Ethical academic support for research planning, writing, and data interpretation.",
    href: "/services/student-research-support"
  },
  {
    title: "Researchers",
    copy: "Scientific writing, proposal, lab, literature review, and analysis support.",
    href: "/services/research-consultancy"
  },
  {
    title: "Biotech Teams",
    copy: "R&D insight for literature intelligence, molecular pathways, and mechanisms.",
    href: "/services/biotech-rd-support"
  }
];

export const processSteps = [
  {
    title: "Consult",
    copy: "Share the goal, audience, current materials, timeline, and constraints."
  },
  {
    title: "Scope",
    copy: "Define the deliverables, ethics, confidentiality needs, budget, and schedule."
  },
  {
    title: "Agree",
    copy: "Confirm the project terms before work begins, including revision expectations."
  },
  {
    title: "Deliver",
    copy: "Receive structured updates and final outputs prepared for the agreed purpose."
  },
  {
    title: "Improve",
    copy: "Use feedback and follow-up support to keep the project moving forward."
  }
];

export const resourcePosts = [
  {
    slug: "prepare-for-research-consultation",
    title: "How to prepare for a research consultation",
    category: "Research Planning",
    readMinutes: 4,
    excerpt:
      "A practical checklist for turning an early research question into a focused project conversation."
  },
  {
    slug: "ethical-academic-support",
    title: "What ethical academic support should look like",
    category: "Academic Integrity",
    readMinutes: 5,
    excerpt:
      "How students can get meaningful guidance while keeping ownership of their own academic work."
  },
  {
    slug: "biotech-literature-intelligence",
    title: "Why literature intelligence matters before early R&D experiments",
    category: "Biotech R&D",
    readMinutes: 6,
    excerpt:
      "How structured scientific review can reduce uncertainty before costly lab work."
  }
];

export function getService(slug: string) {
  return services.find((service) => service.slug === slug);
}
