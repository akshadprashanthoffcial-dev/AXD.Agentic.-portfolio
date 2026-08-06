// ============================================================
// ARCHIVED projects, kept for later but deliberately not shown on
// the site right now. Not imported anywhere. To bring one back,
// copy its entry into `PROJECTS` in `data/projects.ts`.
// ============================================================

import type { Project } from "@/data/projects";

export const ARCHIVED_PROJECTS: Project[] = [
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
];
