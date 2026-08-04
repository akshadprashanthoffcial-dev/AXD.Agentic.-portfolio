// ============================================================
// PROJECTS — the work. One entry per project.
// Media lives in public/projects/[slug]/ .
// Myntra is fully written up with real images; the four Joveo /
// personal projects carry real copy + tags with grey-box image
// placeholders until assets are added (drop files in the folder
// and set `src`).
// ============================================================

// Filter categories used on the /projects list page.
export const CATEGORIES = [
  "Motion Graphics",
  "Brand Identity",
  "Web Designs",
  "Art Direction",
  "Visual Design",
] as const;
export type Category = (typeof CATEGORIES)[number];

// A block on the project detail page. `src` present → real image;
// absent → grey placeholder box (matching the Figma layout).
export type Block = {
  span: "full" | "half"; // full-bleed row, or half of a 2-up row
  ratio?: number; // width / height, defaults per span
  src?: string;
  caption?: string;
};

export type Project = {
  slug: string;
  title: string;
  /** Long-form headline for bespoke case-study pages. Falls back to `title`. */
  fullTitle?: string;
  client: string;
  year: string;
  categories: Category[];
  summary: string; // one line, shown on the list + detail hero
  role: string;
  period: string;
  tools: string[];
  prototypeUrl?: string; // "View Prototype" CTA
  intro: string[]; // detail-page opening paragraphs
  cover?: string; // list-page thumbnail; grey box if absent
  banner?: string; // bespoke case-study hero banner
  blocks: Block[]; // detail-page gallery
};

export const PROJECTS: Project[] = [
  {
    slug: "myntra-crm",
    title: "CRM Campaign Design",
    client: "Myntra",
    year: "2025",
    categories: ["Art Direction", "Visual Design", "Brand Identity"],
    summary:
      "Push, email and in-app campaign creatives for India's biggest fashion sale events — reaching millions of Myntra users.",
    role: "Design Intern — CRM Team",
    period: "Jul – Nov 2025",
    tools: ["Figma", "Photoshop", "Illustrator", "Midjourney", "Gemini", "ChatGPT"],
    intro: [
      "Myntra's CRM team sends daily campaigns to millions of users — push notifications, emails, and in-app banners. The job wasn't just producing creatives; it was making visuals compelling enough to earn a tap during India's most competitive shopping events, while staying true to each sale's design language.",
      "I owned the deal templates for entire sales — 20+ creatives per event across offer types — plus in-app revenue banners styled as festive editorial product photography. AI became a production partner: Midjourney and Gemini for imagery and festive backgrounds, with design judgment deciding what actually shipped.",
      "The takeaway: speed alone doesn't improve marketing. AI only becomes valuable when it's paired with strong design judgment and a clear understanding of how customers actually behave.",
    ],
    cover: "/projects/myntra-crm/cover-list.jpg",
    blocks: [
      { span: "full", src: "/projects/myntra-crm/hero.jpg", caption: "Big Fashion Festival — campaign hero" },
      { span: "half", src: "/projects/myntra-crm/method-1.jpg", caption: "Big Fashion Festival — concept study and visual direction" },
      { span: "half", src: "/projects/myntra-crm/method-2.jpg", caption: "Big Fashion Festival — sale identity, live on the app" },
      { span: "full", src: "/projects/myntra-crm/method-3.jpg", caption: "'One Order Free' — explorations and the final creative" },
      { span: "half", src: "/projects/myntra-crm/result-1.jpg", caption: "End of Reason Sale — campaign identity" },
      { span: "half", src: "/projects/myntra-crm/result-2.jpg", caption: "End of Reason Sale — deal templates" },
      { span: "half", src: "/projects/myntra-crm/result-3.jpg", caption: "Diwali Sale — deal templates" },
      { span: "half", src: "/projects/myntra-crm/result-4.jpg", caption: "Wedding season — in-app revenue banners" },
    ],
  },
  {
    slug: "cms-editor-revamp",
    title: "Reimagining an Enterprise CMS",
    fullTitle:
      "Reimagining an Enterprise CMS into an AI-first Self-Serve Platform",
    client: "Joveo",
    year: "2026",
    categories: ["Web Designs", "Visual Design"],
    summary:
      "Turning weeks of cross-team back-and-forth into a guided workflow that lets non-technical marketing teams build enterprise career sites themselves.",
    role: "Visual Designer → Product Designer → Design Engineer",
    period: "2026",
    tools: ["Figma", "Next.js", "React", "TypeScript", "Claude Code"],
    prototypeUrl: "https://talent-cms-studio.vercel.app/",
    intro: [
      "I redesigned the service delivery model of Joveo's enterprise CMS by combining AI planning, reusable widget libraries, and guided editing into a self-serve experience.",
    ],
    cover: "/projects/cms-editor/cover.png",
    banner: "/projects/cms-editor/banner.png",
    blocks: [],
  },
  {
    slug: "web-template",
    title: "Web Template",
    client: "Joveo",
    year: "2026",
    categories: ["Web Designs", "Visual Design"],
    summary:
      "A flexible career-site web template system — sections that stay on-brand across very different employers.",
    role: "Product Designer",
    period: "2026",
    tools: ["Figma", "Next.js"],
    intro: [
      "A template is only useful if it survives contact with real, wildly different brands. This system is a set of composable sections — hero, departments, featured jobs, testimonials, locations — that reflow and re-skin to each employer's identity without breaking layout.",
      "The demo build (a healthcare careers site) stress-tests the system end to end, from statistics and awards strips to an interactive locations map.",
    ],
    blocks: [
      { span: "full" },
      { span: "half" },
      { span: "half" },
      { span: "full" },
    ],
  },
  {
    slug: "rain-mazha",
    title: "Rain / Mazha",
    client: "Personal",
    year: "2026",
    categories: ["Brand Identity", "Art Direction"],
    summary:
      "A personal identity experiment exploring monsoon as a mood — type, texture and motion around the word 'Mazha' (rain).",
    role: "Designer",
    period: "2026",
    tools: ["Illustrator", "Photoshop", "After Effects"],
    intro: [
      "Mazha is the Malayalam word for rain. This is a self-initiated identity study: how do you make a brand feel like the first monsoon shower — cool, textured, a little unpredictable?",
      "The exploration covers a wordmark, a palette pulled from wet-season light, and a set of motion tests where type behaves like water on glass.",
    ],
    blocks: [
      { span: "full" },
      { span: "full" },
    ],
  },
  {
    slug: "product-animations",
    title: "Product Animations",
    client: "Joveo",
    year: "2026",
    categories: ["Motion Graphics", "Visual Design"],
    summary:
      "Micro-interactions and product motion studies — easing, calibration and the small moments that make software feel alive.",
    role: "Designer",
    period: "2026",
    tools: ["After Effects", "Figma", "Claude Code"],
    intro: [
      "Motion is the difference between software that works and software that feels good. This is an ongoing set of studies: loading states, transitions, empty states and the calibration of easing curves until a movement reads as 'right'.",
      "Each clip is a small experiment — try more directions, measure what feels natural, keep what's good.",
    ],
    blocks: [
      { span: "full" },
      { span: "half" },
      { span: "half" },
      { span: "full" },
      { span: "full" },
    ],
  },
];

export function getProject(slug: string): Project | undefined {
  return PROJECTS.find((p) => p.slug === slug);
}
