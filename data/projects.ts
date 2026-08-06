// ============================================================
// PROJECTS, the work. One entry per project.
// Media lives in public/projects/[slug]/ .
// Myntra is fully written up with real images; the four Joveo /
// personal projects carry real copy + tags with grey-box image
// placeholders until assets are added (drop files in the folder
// and set `src`).
// ============================================================

// Filter categories used on the /projects list page.
export const CATEGORIES = [
  "Experience Design",
  "Visual Design",
  "Product Design",
  "Motion Graphics",
  "Web Designs",
  "Brand Identity",
  "Projects",
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

// A labelled case-study beat (Challenge / Approach / Outcome, etc.)
export type CaseSection = { label: string; heading: string; body: string };

// A gallery image for the rich (branding-style) detail layout.
export type GalleryImage = { src: string; caption?: string };

export type Project = {
  slug: string;
  title: string;
  /** Long-form headline for bespoke case-study pages. Falls back to `title`. */
  fullTitle?: string;
  client: string;
  year: string;
  categories: Category[];
  /** Top work, pinned to the front of whichever filter it appears under,
   *  and badged in the list. Set it on the pieces you want seen first. */
  featured?: boolean;
  /** When set, the list row links straight out here (Behance, etc.) instead
   *  of to an internal /projects/[slug] page. */
  externalUrl?: string;
  summary: string; // one line, shown on the list + detail hero
  role: string;
  period: string;
  tools: string[];
  prototypeUrl?: string; // external CTA link
  prototypeLabel?: string; // CTA label, defaults to "View Prototype"
  intro: string[]; // detail-page opening paragraphs
  /** Company mark shown beside the client name in the list, from public/logos/. */
  clientLogo?: string;
  cover?: string; // list-page thumbnail; grey box if absent
  /** How the cover fills its 4:3 tile. Deck-style covers (wide slides with
   *  type on them) read better letterboxed than cropped. Defaults to cover. */
  coverFit?: "cover" | "contain";
  banner?: string; // bespoke case-study hero banner
  blocks: Block[]; // detail-page gallery
  /** Chips of physical/digital outputs, deliverables row under the meta grid. */
  deliverables?: string[];
  /** Labelled case-study beats rendered as a Challenge/Approach/Outcome-style grid. */
  caseSections?: CaseSection[];
  /** Rich gallery: index 0 is the hero, the rest render as a lightboxed masonry grid.
   *  When present, this replaces `blocks` on the detail page. */
  gallery?: GalleryImage[];
  /** A click-to-play animation shown below the gallery/blocks, poster image
   *  + play button that opens a fullscreen lightbox video. */
  video?: { src: string; poster?: string; caption?: string };
  /** A real YouTube upload, rendered as a live inline embed (not a lightbox)
   *  with a "Watch on YouTube" CTA underneath. */
  youtube?: { id: string; label?: string };
};

export const PROJECTS: Project[] = [
  {
    slug: "cms-editor-revamp",
    title: "Reimagining an Enterprise CMS",
    fullTitle:
      "Reimagining an Enterprise CMS into an AI-first Self-Serve Platform",
    client: "Joveo",
    year: "2026",
    categories: ["Product Design", "Experience Design"],
    clientLogo: "/logos/joveo.png",
    featured: true,
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
    slug: "myntra-crm",
    title: "CRM Campaign Design",
    client: "Myntra",
    year: "2025",
    categories: ["Visual Design", "Brand Identity"],
    clientLogo: "/logos/myntra.png",
    featured: true,
    summary:
      "Push, email and in-app campaign creatives for India's biggest fashion sale events, reaching millions of Myntra users.",
    role: "Design Intern - CRM Team",
    period: "Jul - Nov 2025",
    tools: ["Figma", "Photoshop", "Illustrator", "Midjourney", "Gemini", "ChatGPT"],
    intro: [
      "Myntra's CRM team sends daily campaigns to millions of users, push notifications, emails, and in-app banners. The job wasn't just producing creatives; it was making visuals compelling enough to earn a tap during India's most competitive shopping events, while staying true to each sale's design language.",
      "I owned the deal templates for entire sales - 20+ creatives per event across offer types, plus in-app revenue banners styled as festive editorial product photography. AI became a production partner: Midjourney and Gemini for imagery and festive backgrounds, with design judgment deciding what actually shipped.",
      "The takeaway: speed alone doesn't improve marketing. AI only becomes valuable when it's paired with strong design judgment and a clear understanding of how customers actually behave.",
    ],
    cover: "/projects/myntra-crm/cover-new.png",
    blocks: [
      { span: "full", src: "/projects/myntra-crm/hero.jpg", caption: "Big Fashion Festival, campaign hero" },
      { span: "half", src: "/projects/myntra-crm/method-1.jpg", caption: "Big Fashion Festival, concept study and visual direction" },
      { span: "half", src: "/projects/myntra-crm/method-2.jpg", caption: "Big Fashion Festival, sale identity, live on the app" },
      { span: "full", src: "/projects/myntra-crm/method-3.jpg", caption: "'One Order Free', explorations and the final creative" },
      { span: "half", src: "/projects/myntra-crm/result-1.jpg", caption: "End of Reason Sale, campaign identity" },
      { span: "half", src: "/projects/myntra-crm/result-2.jpg", caption: "End of Reason Sale, deal templates" },
      { span: "half", src: "/projects/myntra-crm/result-3.jpg", caption: "Diwali Sale, deal templates" },
      { span: "half", src: "/projects/myntra-crm/result-4.jpg", caption: "Wedding season, in-app revenue banners" },
    ],
  },
  {
    slug: "dripps",
    title: "Dripps",
    fullTitle: "Dripps, a loud little symbol for Gen-Z",
    client: "Dripps (Freelance)",
    year: "2024",
    categories: ["Brand Identity", "Visual Design"],
    summary:
      "A bold, fluid mark for a Gen-Z graphic-wear label, built to flex across drops without losing its edge.",
    role: "Brand & Identity Design",
    period: "2024",
    tools: ["Figma", "Procreate"],
    deliverables: ["Logo & symbol", "Wordmark", "Type system", "Social kit"],
    intro: [
      "Dripps is a Gen-Z streetwear label selling graphic tees and pants. The brand needed a symbol with the same energy as the product, expressive, quick to read, and at home on a hangtag, a story and a hoodie back.",
      "The mark had to hold its own beside loud graphic prints, so it was built to be recognisable even when it flexes.",
    ],
    caseSections: [
      {
        label: "Challenge",
        heading: "Cut through the graphic noise",
        body: "Stand out in a crowded graphic-tee market where the logo competes with the very print it sits beside.",
      },
      {
        label: "Approach",
        heading: "Built around the drip",
        body: "A fluid mark and wordmark that flex from clean to distorted, a punchy palette, and a system designed for remix across seasonal drops.",
      },
      {
        label: "Outcome",
        heading: "A kit that travels",
        body: "A confident identity, symbol, wordmark and type, that carries across product, packaging and social without losing its attitude.",
      },
    ],
    cover:
      "https://framerusercontent.com/images/na46dtcubrdFu0lTpFIfzKQXoSc.png?scale-down-to=1024",
    gallery: [
      "na46dtcubrdFu0lTpFIfzKQXoSc",
      "Ufem08fx8u2lQHBXbAqd0GAi1U",
      "GjUeFpZn6H1ycxZiDYlYmVD4ms",
      "vAKb1evbSES10to1r3aniK5CRE",
      "UoVOGPvcBVUWNJVV3wD85BI8IUM",
      "qP6qze6xVKdYUQJYn4O85WTC5ec",
      "1g24wVtUj7AqPg6iJH00Rg68gI8",
      "y275LoZxiuek2kpHIIYrYYye7uo",
      "fM1L2OLA1YbKeViZFAt83kpDQ",
      "01xVHVysoWLiEYtQguvA56M8Rj8",
      "E0Brgq0hU1d0AUkyWOMzSAvGOE",
    ].map((id) => ({
      src: `https://framerusercontent.com/images/${id}.png?scale-down-to=1024`,
    })),
    blocks: [],
  },
  {
    slug: "loomero",
    title: "Loomero",
    fullTitle: "Loomero, a symbol woven from the loom",
    client: "Loomero (Freelance)",
    year: "2023",
    categories: ["Brand Identity", "Visual Design"],
    summary:
      "A brand mark for a label of minimal, solid-colour essentials, drawn from the craft of weaving at the heart of its name.",
    role: "Brand & Identity Design",
    period: "2023",
    tools: ["Figma"],
    deliverables: ["Logo & symbol", "Type system", "Woven labels", "Packaging"],
    intro: [
      "Loomero makes minimal, solid-colour essentials, plain tees and trousers stripped back to fabric and fit. The name traces to the loom, the frame at the heart of weaving, so the identity had to feel as considered and tactile as the cloth itself.",
      "The work centred on a single, quietly confident symbol that could live on a woven label as comfortably as on a shopfront, and a restrained system that lets the garments carry the colour.",
    ],
    caseSections: [
      {
        label: "Challenge",
        heading: "Essential, not invisible",
        body: "Build a mark that reads as 'essential' without disappearing, an identity for a wardrobe of solids that deliberately withholds print and pattern.",
      },
      {
        label: "Approach",
        heading: "Warp meets weft",
        body: "The monogram is derived from crossing threads of a loom, warp and weft resolving into an L. A muted, fabric-led palette and calm type let the product lead.",
      },
      {
        label: "Outcome",
        heading: "Scales from thread to block",
        body: "A flexible symbol that sits quietly on labels, tags and packaging, and scales from a single-thread linemark to a solid block for stamps and embroidery.",
      },
    ],
    cover:
      "https://framerusercontent.com/images/mYwn0VAmbMHWgUzPgXFJowwwQa0.png?scale-down-to=1024",
    gallery: [
      "mYwn0VAmbMHWgUzPgXFJowwwQa0",
      "YvAMj1yQ4bvzJfHZCbAfD5EyW4",
      "PRfwmmGv2O4eBSENHGIoMOPa8M",
      "BT7Q9JHwJFd4s5tV4ULsdRkrns",
      "Cmo5aoCUtQWAeJ4UlVJkKIVEJP8",
      "1Kd55CWvI4HwEpdtcXBwVdRvPg",
      "itJugddbqmEJlLvbOLWisVg8Y",
      "gq0aXDRdbswWOIEcNr3IV00BkQ",
      "CNr7WopMrRnenfcnvm0IwogDU",
      "I1V2xvAhlKYLJK7vj1Rtq0iNmw",
      "rbqz4h6YddCscuvvFbc4J0qY1pU",
      "GdHA0Y9asYETnGQEzo73zy3XiU",
    ].map((id) => ({
      src: `https://framerusercontent.com/images/${id}.png?scale-down-to=1024`,
    })),
    blocks: [],
  },
  {
    slug: "manas-home-gardens",
    title: "Manas Home Gardens",
    fullTitle: "Manas Home Gardens, an identity for a gardener",
    client: "Manas Home Gardens (Freelance)",
    year: "2024",
    categories: ["Brand Identity", "Visual Design"],
    summary:
      "A warm, botanical brand for a gardener who wants to share the plants he grows, guiding first-time owners into the world of an anthophile.",
    role: "Brand & Identity Design",
    period: "2024",
    tools: ["Figma"],
    deliverables: [
      "Logo & wordmark",
      "Botanical illustration",
      "Plant tags",
      "Packaging",
    ],
    intro: [
      "Manas Home Gardens grew out of my father's love of gardening, a house filled with Calathea, Bougainvillea and other plants he now wants to share. The brand leads people gently into the world of an anthophile, favouring guidance and experience over the hard sell.",
      "The identity had to feel like a home rather than a nursery: soft, personal and welcoming to people buying their first extraordinary plant.",
    ],
    caseSections: [
      {
        label: "Challenge",
        heading: "A hobby becomes a home brand",
        body: "Translate a personal, deeply-tended hobby into a brand that feels welcoming to first-time plant owners without losing its warmth.",
      },
      {
        label: "Approach",
        heading: "Botanical and calm",
        body: "Hand-observed leaf forms, an earthy palette and quiet typography, built around a wayfinding tone that walks buyers from 'which plant' to 'how to care for it'.",
      },
      {
        label: "Outcome",
        heading: "Guidance you can hold",
        body: "Packaging, plant tags and a guiding voice that make owning an extraordinary plant feel achievable, an identity that reads as a home, not a store.",
      },
    ],
    cover:
      "https://framerusercontent.com/images/1L4uBflijnb50C8IqZkdg8Glo.png?scale-down-to=1024",
    gallery: [
      "1L4uBflijnb50C8IqZkdg8Glo",
      "QNE4ArNu5pzmUZHISo6Otv7YbI0",
      "iksXSvUAAMBRIxMHLXQC7UgrMcw",
      "sCK0DDs0iImBDlQrFumfvNgwbw",
      "SMW5MRuSytpUpfYXNfv20rU7A",
      "M0aYkCPXQArbIYCdGB7hoMY87I",
      "yH9pe249iQM5zVPHtIDppRNKREg",
      "m6wjAsP3eIgx3CnDbgRIEXw6Mkw",
      "TxyeT6J2iiqqMsbjd0jN3MQkaII",
      "OKJqIsRc3cvNrgeYnvQCZj0",
      "JOjC9C2dIMrNI9jp6cRmRy40EhI",
      "KwJLkwX4fQlGdlgob1My0uya4",
      "FnuRboVDrtFyNTwWPKhnYgIPc",
      "GfDQlYPCGE0apUrYyFnKsKpQZo",
    ].map((id) => ({
      src: `https://framerusercontent.com/images/${id}.png?scale-down-to=1024`,
    })),
    blocks: [],
  },
  {
    // Lives on Behance - `externalUrl` sends the list row straight there, so
    // this entry deliberately has no detail page of its own.
    slug: "tapse",
    title: "Tapse",
    fullTitle: "Tapse, a medicine measuring device for visually impaired users",
    client: "Team project · Patent filed",
    year: "2025",
    categories: ["Projects", "Product Design"],
    featured: true,
    externalUrl:
      "https://www.behance.net/gallery/239180241/Tapse-Medicine-Measuring-Device-for-Visually-Impaired",
    summary:
      "An electricity-free, gravity-based device that lets visually impaired people measure and take liquid medication independently. Patent application filed.",
    role: "Research, ideation, product sketches & storyboarding",
    period: "2025",
    tools: ["Procreate", "Figma", "Blender"],
    intro: [
      "Measuring a dose of liquid medicine is a task that quietly assumes sight. Tapse is a gravity-based mechanism that makes it a tactile, repeatable action instead, no electricity, no display, no guessing.",
      "I led ideation, product sketches, storyboarding and the final presentation. A patent application has been filed for the device.",
    ],
    cover:
      "https://mir-s3-cdn-cf.behance.net/project_modules/1400/822dea239180241.6924465221c14.jpg",
    coverFit: "contain",
    blocks: [],
  },
  {
    slug: "web-template",
    title: "Web Template",
    client: "Joveo",
    year: "2026",
    categories: ["Web Designs", "Visual Design"],
    clientLogo: "/logos/joveo.png",
    summary:
      "A flexible career-site web template system, sections that stay on-brand across very different employers.",
    role: "Product Designer",
    period: "2026",
    tools: ["Figma", "Next.js"],
    intro: [
      "A template is only useful if it survives contact with real, wildly different brands. This system is a set of composable sections, hero, departments, featured jobs, testimonials, locations, that reflow and re-skin to each employer's identity without breaking layout.",
      "The demo build (a healthcare careers site) stress-tests the system end to end, from statistics and awards strips to an interactive locations map.",
    ],
    cover: "/projects/web-template/cover.png",
    blocks: [
      { span: "full" },
      { span: "half" },
      { span: "half" },
      { span: "full" },
    ],
  },
  {
    slug: "rain-mazha",
    fullTitle: "Rain / Mazha, a music video animation",
    title: "Rain / Mazha",
    client: "Gypsy Myths Studios (Freelance)",
    year: "2024",
    categories: ["Motion Graphics", "Visual Design"],
    summary:
      "A hand-illustrated music video animation for 'RAIN', a Malayalam single by Sachin Balu, produced by Gypsy Myths Studios. 13K+ views on YouTube.",
    role: "Motion Graphics, frame ideation",
    period: "2024",
    tools: ["After Effects"],
    intro: [
      "RAIN is a Malayalam single produced by Gypsy Myths Studios. This was a two-person freelance project: illustrations by Sanghamithra K, and the animation was mine, built entirely in After Effects.",
      "I was part of the ideation for the frames alongside Sanghamithra, then took her illustrations and animated the full video, matching the song's mood, a monsoon-soaked, slow-burning heartache. The video has crossed 13K views on YouTube.",
    ],
    cover: "/projects/Rain-Mazha/motion1.png",
    banner: "/projects/Rain-Mazha/motion1.png",
    blocks: [],
  },
  {
    slug: "blossom-3d-animation",
    title: "Blossom",
    fullTitle: "Blossom, exploring Blender's geometry nodes",
    client: "Personal",
    year: "2024",
    categories: ["Motion Graphics"],
    featured: true,
    summary:
      "An 11-second 3D showcase animation of two vintage cars, an exploration of Blender's geometry nodes and drone-style camera movement.",
    role: "3D Artist & Animator",
    period: "2024",
    tools: ["Blender", "After Effects"],
    prototypeUrl: "https://www.behance.net/gallery/196650735/Blossom-3D-Animation",
    prototypeLabel: "View on Behance",
    intro: [
      "Blossom started as a personal exploration of Blender, specifically its geometry nodes and drone-style camera movement, built around two vintage cars as the subject.",
      "The full model, scene and lighting were built in Blender, with the geometry-node setups driving the environment and camera choreography, and compositing and finishing passes done in After Effects.",
    ],
    cover:
      "https://mir-s3-cdn-cf.behance.net/project_modules/1400_webp/fb2b94196650735.66234b6ef2b5e.png",
    gallery: [
      "https://mir-s3-cdn-cf.behance.net/project_modules/1400_webp/fb2b94196650735.66234b6ef2b5e.png",
    ].map((src) => ({ src })),
    youtube: { id: "DZnWUURjkaI" },
    blocks: [],
  },
  {
    slug: "other-animations",
    title: "Other Animations",
    fullTitle: "Other Animations, logo reveals & motion pieces",
    client: "Personal / Freelance",
    year: "2024",
    categories: ["Motion Graphics"],
    summary:
      "A small reel of logo reveals and motion pieces, hover any clip to play it.",
    role: "3D Artist & Animator",
    period: "2024",
    tools: ["Blender", "After Effects"],
    intro: [
      "A shelf for the shorter motion pieces that don't need a case study of their own, logo reveals and standalone animations.",
    ],
    blocks: [],
  },
  {
    slug: "la-la-animation",
    title: "La La Animation",
    fullTitle: "La La Animation, a 3D animation for 'Vandine Thedum'",
    client: "Personal",
    year: "2024",
    categories: ["Motion Graphics"],
    summary:
      "A personal 3D animation piece set to the song 'Vandine Thedum'.",
    role: "3D Artist & Animator",
    period: "2024",
    tools: ["Blender", "After Effects"],
    intro: [
      "A personal 3D animation project built around the song 'Vandine Thedum', modelled, lit and animated in Blender with finishing passes in After Effects.",
    ],
    youtube: { id: "hq-7QU2GojA" },
    blocks: [],
  },
  {
    slug: "spider-ai-animation",
    title: "Spider AI Animation",
    fullTitle: "Spider AI Animation, an introduction film for Minto AI",
    client: "Minto AI (Freelance)",
    year: "2024",
    categories: ["Motion Graphics"],
    summary:
      "An introduction animation made for Minto AI to launch Spider AI, their new product, on their website.",
    role: "Motion Designer",
    period: "2024",
    tools: ["After Effects"],
    intro: [
      "Minto AI needed a way to introduce Spider AI, their new product, to visitors landing on their website. I animated the introduction film that plays the concept in a few seconds rather than making people read a feature list.",
    ],
    youtube: { id: "2EQi3KlLEoM" },
    blocks: [],
  },
  {
    slug: "onam-logo-reveal",
    title: "Onam Logo Reveal",
    fullTitle: "Onam Logo Reveal, a title animation for a college promo",
    client: "Personal / College",
    year: "2024",
    categories: ["Motion Graphics"],
    summary:
      "A title/logo reveal animation made for IIITDM Jabalpur's Onam celebration promo video.",
    role: "Motion Designer",
    period: "2024",
    tools: ["After Effects"],
    intro: [
      "A short title animation for our college's Onam celebration promo video, a logo reveal built to open the trailer before it cuts into the actual event coverage.",
    ],
    cover: "/projects/onam-logo-reveal/cover.jpg",
    youtube: { id: "QSA0YK0QjyM" },
    blocks: [],
  },
  {
    slug: "product-animations",
    title: "Product Animations",
    fullTitle: "Joveo Product Animations",
    client: "Joveo",
    year: "2026",
    categories: ["Motion Graphics", "Visual Design"],
    clientLogo: "/logos/joveo.png",
    summary:
      "Animations for Joveo's core products, built so a product can be shown rather than explained, clients just watch it work.",
    role: "Visual Designer",
    period: "3 weeks",
    tools: ["After Effects", "Figma"],
    intro: [
      "I was asked to make Joveo's products easier to understand through motion. The goal was simple: build animations the team could drop straight into client decks, so a product could be shown rather than explained, clients just watch it work.",
      "Working in After Effects on the screens our product designers had built, I animated each product's core flow. Along the way I collaborated closely with our product managers, which helped me understand what each product really does for customers, the deeper meaning beyond the screens.",
    ],
    cover: "/projects/product-animations/cover.png",
    blocks: [],
  },
];

export function getProject(slug: string): Project | undefined {
  return PROJECTS.find((p) => p.slug === slug);
}
