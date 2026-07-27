// ============================================================
// THE OPERATOR — Akshad. Bio, skills, tools, experience.
// Ported from axd-labs-site/data/operator.ts (plain voice).
// TODO(Akshad): drop a portrait into public/operator/portrait.jpg
// and confirm the Joveo timeline line.
// ============================================================

export const OPERATOR = {
  name: "Akshad Prashanth",
  firstName: "AKSHAD",
  lastName: "PRASHANTH",
  title: "Designer · Lab Operator",
  portrait: "/operator/portrait.jpg",
  // Flip to true once public/operator/portrait.jpg exists.
  hasPortrait: false,
  intro: [
    "I'm a designer who treats every project like an experiment: try more directions, measure what works, keep what's good.",
    "I've designed campaigns seen by millions of users at Myntra, and I build brands, websites and marketing creatives end to end — combining design craft with AI tools to move faster without losing quality.",
    "This site is my lab. The experiments below are the work; the operator is me.",
  ],
  skills: [
    "Brand identity",
    "Campaign design",
    "Visual design",
    "Motion & interaction",
    "AI-assisted workflows",
    "Design systems",
  ],
  tools: [
    { name: "Figma", use: "Design" },
    { name: "Photoshop", use: "Imaging" },
    { name: "Illustrator", use: "Vector" },
    { name: "Midjourney", use: "AI imagery" },
    { name: "Gemini", use: "AI imagery" },
    { name: "ChatGPT", use: "Ideation" },
    { name: "After Effects", use: "Motion" },
    { name: "Claude Code", use: "AI coding" },
  ],
};

export type TimelineEntry = {
  org: string;
  role: string;
  period: string;
  note: string;
  projectSlug?: string;
};

export const TIMELINE: TimelineEntry[] = [
  {
    org: "Myntra",
    role: "Design Intern — CRM Team",
    period: "Jun – Dec 2025",
    note: "Campaign creatives for India's biggest fashion sales, sent to millions of users.",
    projectSlug: "myntra-crm",
  },
  {
    org: "Joveo",
    role: "Product Designer",
    period: "2026 – present",
    note: "Designing tools that help teams build career sites — CMS, widgets and web templates.",
    projectSlug: "cms-editor-revamp",
  },
  {
    org: "axd.labs",
    role: "Founder / Lab Operator",
    period: "2026 – present",
    note: "Personal design laboratory — brand, web and AI experiments, including this site.",
  },
];
