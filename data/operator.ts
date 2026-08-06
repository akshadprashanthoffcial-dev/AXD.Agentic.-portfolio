// ============================================================
// AKSHAD, bio, skills, tools, experience.
// Source of truth: Akshad's 2026 résumé. Keep this file in sync
// with the résumé rather than editing copy inside components.
// ============================================================

export type ToolGroup = {
  group: string;
  items: { name: string; use: string }[];
};

const TOOL_GROUPS: ToolGroup[] = [
  {
    group: "Design",
    items: [
      { name: "Figma", use: "Design & systems" },
      { name: "After Effects", use: "Motion" },
      { name: "Photoshop", use: "Imaging" },
      { name: "Illustrator", use: "Vector" },
      { name: "Procreate", use: "Illustration" },
      { name: "Blender", use: "3D" },
      { name: "Framer", use: "Web" },
    ],
  },
  {
    group: "AI",
    items: [
      { name: "Claude Code", use: "Design engineering" },
      { name: "Cursor", use: "Building" },
      { name: "Figma MCP", use: "Design → code" },
      { name: "Midjourney", use: "Imagery" },
      { name: "Gemini", use: "Nano Banana" },
      { name: "Runway", use: "Video" },
      { name: "Veo-3", use: "Video" },
    ],
  },
];

export const OPERATOR = {
  name: "Akshad Prashanth",
  firstName: "AKSHAD",
  lastName: "PRASHANTH",
  title: "Visual and Design Engineer",
  /** Where he's from. Shown under the role on the about page. */
  location: "From Kannur, Kerala",
  portrait: "/operator/portrait.jpg",
  hasPortrait: true,
  intro: [
    "I'm a designer working where visual design, product thinking and AI-powered creation overlap.",
    "I've built design systems and CMS-driven experiences at Joveo, designed campaign creatives seen by millions at Myntra, and run brand identities end to end for startups and studios, all while keeping a foot firmly in branding and motion.",
    "The goal I'm building toward: art direction that bridges creativity, technology and AI.",
  ],
  /** The five things said out loud on the about page, in the order they're
   *  said. `icon` keys into CATEGORY_ICONS (components/ui/Icons.tsx). */
  capabilities: [
    {
      icon: "Experience Design",
      label: "Product experience design",
      detail: "End to end, from research and flows to the shipped surface.",
    },
    {
      icon: "Visual Design",
      label: "Visual design",
      detail: "Layout, type and colour doing the work of a clear hierarchy.",
    },
    {
      icon: "Brand Identity",
      label: "Brand identity design",
      detail: "Marks, systems and guidelines a brand can actually live in.",
    },
    {
      icon: "Motion Graphics",
      label: "Motion graphics",
      detail: "Micro-interactions and short-form animation with intent.",
    },
    {
      icon: "Web Designs",
      label: "Website design",
      detail: "Marketing sites and product surfaces, designed to ship.",
    },
  ],
  toolGroups: TOOL_GROUPS,
  /** Flat list, used by the marquee band. */
  tools: TOOL_GROUPS.flatMap((g) => g.items),
  achievements: [
    "Patent application filed, an assistive liquid-medication device for visually impaired users (team)",
    "Winner, IIT BHU Advertisement Competition - FMC Weeknd, IIT Varanasi (team)",
  ],
  education: [
    {
      school: "PDPM Indian Institute of Information Technology, Jabalpur",
      award: "Bachelor's in Design",
      period: "2022 - 2026",
    },
    {
      school: "St. Antony's Public School, Kottayam",
      award: "Senior Secondary (PCM)",
      period: "2022",
    },
  ],
};

export type TimelineEntry = {
  org: string;
  role: string;
  period: string;
  note: string;
  projectSlug?: string;
  /** Renders a small "Freelance" pill beside the role. */
  freelance?: boolean;
  /** Company mark shown beside the name, from public/logos/. */
  logo?: string;
};

export const TIMELINE: TimelineEntry[] = [
  {
    org: "Joveo",
    role: "Visual Design Intern",
    logo: "/logos/joveo.png",
    period: "Nov 2025 - Jul 2026",
    note: "Sole designer on the Implementation team - CMS-based career sites for enterprise clients, a 70+ widget library, and internal design tooling built with Claude, Cursor and Figma MCP.",
    projectSlug: "cms-editor-revamp",
  },
  {
    org: "Myntra",
    role: "Creative Intern, CRM",
    logo: "/logos/myntra.png",
    period: "Jul - Nov 2025",
    note: "Push, in-app and social creatives for India's biggest fashion sales, including the deal templates for Big Fashion Festival.",
    projectSlug: "myntra-crm",
  },
  {
    org: "Swarnabhoomi Academy of Music",
    role: "Design Consultant",
    period: "Aug 2025 - Jun 2026",
    note: "End-to-end design across social, events and web for three semesters, plus brand and campaign for CAMP'ED, a music camp launch.",
  },
  {
    org: "Loomero",
    freelance: true,
    role: "Brand Designer",
    period: "Nov - Dec 2024",
    note: "Identity for a clothing startup, plus two distinct sub-brands: DRIPPS and ARVIO.",
    projectSlug: "loomero",
  },
  {
    org: "Minto.ai",
    freelance: true,
    role: "Motion Graphics",
    period: "Oct - Nov 2024",
    note: "Product introduction film for Spider AI, motion graphics and edit.",
  },
  {
    org: "Epsilon Delta Technologies",
    freelance: true,
    role: "Brand Designer",
    period: "Jan - Feb 2023",
    note: "Brand identity and guidelines for a new startup, including web layout and colour system.",
  },
];
