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
  "Visual Design",
  "Brand Identity",
  "Product Design",
  "Experience Design",
  "Web Designs",
  "Motion Graphics",
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
    cover: "/projects/myntra-crm/cover-list.jpg",
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
    slug: "lego-rebranding",
    title: "LEGO Rebranding",
    fullTitle: "LEGO Rebranding, a childhood icon, widened",
    client: "LEGO (Personal Project)",
    year: "2023",
    categories: ["Brand Identity", "Visual Design"],
    featured: true,
    summary:
      "Rebranding a childhood icon for an audience that never stopped building, reframing play as focus, patience and craft.",
    role: "Concept & Art Direction",
    period: "2023",
    tools: ["Figma"],
    deliverables: ["Identity refresh", "Packaging", "Campaign", "Art direction"],
    intro: [
      "The brief was open: rebrand any well-known name and redefine its purpose so it feels welcoming to a new audience. I chose LEGO and reframed it around the adult builder, play as focus and craft rather than something you grow out of.",
      "The goal was to widen the doorway without dismantling the equity already built into the logo, colour and system.",
    ],
    caseSections: [
      {
        label: "Challenge",
        heading: "Refresh without erasing",
        body: "Rework one of the most recognised brands on earth without dismantling the equity in its brick, logo and primary palette.",
      },
      {
        label: "Approach",
        heading: "Keep the brick, rebuild the room",
        body: "Retain the brick and primary colours, but rebuild the surrounding system, a calmer layout language, grown-up photography and copy that speaks to builders.",
      },
      {
        label: "Outcome",
        heading: "Same joy, new audience",
        body: "A rebrand concept expressed across identity, packaging and campaign that invites an older audience in while keeping the play intact.",
      },
    ],
    cover:
      "https://framerusercontent.com/images/Le1kWnlYb7kErCEUfHZqlDacaE.png?scale-down-to=1024",
    gallery: [
      "Le1kWnlYb7kErCEUfHZqlDacaE",
      "PpOx5L93vKhxOPtJC4gt6RrADM",
      "1r4BXvVgJw8hRC86GpERrJ2E4",
      "6iJ9Usrj7IkHXHRIfQ8PiLEV6Xc",
      "foBvvGAHgPAlSiGXldnKe7N3d0",
      "YjNegxzJtrWwVVgHRK5oOW4WUs",
      "mPTE8RYhk7FqZmuKGPkgrbE97T0",
      "nHhTAUxjKtoyFU4pvbPgXY2b8CY",
      "3QBfB6WFmgRh1oXUhvEgDmOtc",
      "8OabC83f8gRp5Xc5lizhJQyAKc",
      "mu21MjvOWEr0HJXV4TOBXqsu3c",
      "7WaODQudyHHEjGTvOjwmgg7FZCE",
      "04HCijJtz18HPDEHHlZLSl6YBig",
    ].map((id) => ({
      src: `https://framerusercontent.com/images/${id}.png?scale-down-to=1024`,
    })),
    blocks: [],
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
    categories: ["Brand Identity", "Visual Design"],
    summary:
      "A personal identity experiment exploring monsoon as a mood, type, texture and motion around the word 'Mazha' (rain).",
    role: "Designer",
    period: "2026",
    tools: ["Illustrator", "Photoshop", "After Effects"],
    intro: [
      "Mazha is the Malayalam word for rain. This is a self-initiated identity study: how do you make a brand feel like the first monsoon shower, cool, textured, a little unpredictable?",
      "The exploration covers a wordmark, a palette pulled from wet-season light, and a set of motion tests where type behaves like water on glass.",
    ],
    blocks: [
      { span: "full" },
      { span: "full" },
    ],
  },
  {
    slug: "blossom-3d-animation",
    title: "Blossom",
    fullTitle: "Blossom, a vintage car showcase in 3D",
    client: "Personal",
    year: "2024",
    categories: ["Motion Graphics"],
    featured: true,
    summary:
      "An 11-second 3D showcase animation of two vintage cars, modelled and rendered in Blender with post in After Effects.",
    role: "3D Artist & Animator",
    period: "2024",
    tools: ["Blender", "After Effects"],
    prototypeUrl: "https://www.behance.net/gallery/196650735/Blossom-3D-Animation",
    prototypeLabel: "View on Behance",
    intro: [
      "Blossom is a short 3D showcase piece built around two vintage cars, a study in lighting, camera choreography and material work rather than narrative. The full model, scene and lighting were built in Blender, with compositing and finishing passes done in After Effects.",
      "The goal was a clean, premium showcase feel: the kind of confident camera move and material realism you'd expect from an automotive reveal, compressed into eleven seconds.",
    ],
    cover:
      "https://mir-s3-cdn-cf.behance.net/project_modules/1400_webp/fb2b94196650735.66234b6ef2b5e.png",
    gallery: [
      "https://mir-s3-cdn-cf.behance.net/project_modules/1400_webp/fb2b94196650735.66234b6ef2b5e.png",
      "https://mir-s3-cdn-cf.behance.net/project_modules/max_1200_webp/f27a49196650735.6623a6edb467f.png",
      "https://mir-s3-cdn-cf.behance.net/project_modules/1400_webp/379ebd196650735.6623a6edb4e34.png",
      "https://mir-s3-cdn-cf.behance.net/project_modules/1400_webp/7841d1196650735.6623a6edb3d1c.png",
      "https://mir-s3-cdn-cf.behance.net/project_modules/1400_webp/be48c8196650735.6623a6edb41d1.png",
      "https://mir-s3-cdn-cf.behance.net/project_modules/1400_webp/174b46196650735.6623a6edb34e8.png",
      "https://mir-s3-cdn-cf.behance.net/project_modules/1400_webp/aca86e196650735.6624aa6739035.png",
    ].map((src) => ({ src })),
    blocks: [],
  },
  {
    slug: "product-animations",
    title: "Product Animations",
    client: "Joveo",
    year: "2026",
    categories: ["Motion Graphics", "Product Design"],
    clientLogo: "/logos/joveo.png",
    summary:
      "Micro-interactions and product motion studies, easing, calibration and the small moments that make software feel alive.",
    role: "Designer",
    period: "2026",
    tools: ["After Effects", "Figma", "Claude Code"],
    intro: [
      "Motion is the difference between software that works and software that feels good. This is an ongoing set of studies: loading states, transitions, empty states and the calibration of easing curves until a movement reads as 'right'.",
      "Each clip is a small experiment, try more directions, measure what feels natural, keep what's good.",
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
