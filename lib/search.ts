// ============================================================
// Smart client-side "agent" routing.
// Turns a free-text query into the right page. No LLM — a small
// intent index over the real site content. Off-topic queries fall
// through to the /oops fun page.
// ============================================================

import { PROJECTS } from "@/data/projects";

export type Suggestion = {
  href: string;
  label: string;
  hint?: string; // small right-aligned context ("Project", "About"…)
};

type Entry = {
  href: string;
  label: string;
  hint: string;
  keywords: string[];
  weight: number; // base rank
};

// Build the searchable index once.
const BASE: Entry[] = [
  {
    href: "/about",
    label: "About Akshad",
    hint: "About",
    weight: 3,
    keywords: [
      "about",
      "who",
      "akshad",
      "prashanth",
      "bio",
      "biography",
      "experience",
      "background",
      "skill",
      "skills",
      "resume",
      "cv",
      "you",
      "yourself",
      "designer",
      "operator",
      "story",
    ],
  },
  {
    href: "/projects",
    label: "All projects",
    hint: "Projects",
    weight: 3,
    keywords: [
      "project",
      "projects",
      "work",
      "works",
      "case",
      "study",
      "studies",
      "portfolio",
      "experiment",
      "experiments",
      "show",
      "everything",
      "motion",
      "brand",
      "web",
      "art",
      "visual",
    ],
  },
  {
    href: "/contact",
    label: "Get in touch",
    hint: "Contact",
    weight: 3,
    keywords: [
      "contact",
      "hire",
      "hiring",
      "email",
      "mail",
      "reach",
      "touch",
      "linkedin",
      "instagram",
      "connect",
      "talk",
      "available",
      "work with",
      "recruit",
      "recruiter",
      "job",
      "message",
    ],
  },
  ...PROJECTS.map<Entry>((p) => ({
    href: `/projects/${p.slug}`,
    label: p.title,
    hint: p.client,
    weight: 4,
    keywords: [
      ...p.title.toLowerCase().split(/\W+/),
      p.client.toLowerCase(),
      ...p.categories.map((c) => c.toLowerCase()),
      ...p.categories.flatMap((c) => c.toLowerCase().split(/\W+/)),
      ...p.tools.map((t) => t.toLowerCase()),
    ].filter(Boolean),
  })),
];

function tokenize(q: string): string[] {
  return q
    .toLowerCase()
    .split(/\W+/)
    .filter((t) => t.length > 1);
}

function score(entry: Entry, tokens: string[], raw: string): number {
  if (tokens.length === 0) return 0;
  let s = 0;
  const label = entry.label.toLowerCase();
  if (raw && label.includes(raw)) s += 6;
  for (const t of tokens) {
    if (label.includes(t)) s += 3;
    if (entry.keywords.some((k) => k === t)) s += 3;
    else if (entry.keywords.some((k) => k.includes(t) || t.includes(k))) s += 1.2;
  }
  return s > 0 ? s + entry.weight * 0.1 : 0;
}

/** Ranked suggestions for the dropdown as the user types. */
export function suggest(query: string, limit = 4): Suggestion[] {
  const raw = query.trim().toLowerCase();
  const tokens = tokenize(query);
  if (!raw) {
    // default surface: about, projects, contact
    return BASE.filter((e) => ["/about", "/projects", "/contact"].includes(e.href)).map(
      ({ href, label, hint }) => ({ href, label, hint })
    );
  }
  return BASE.map((e) => ({ e, s: score(e, tokens, raw) }))
    .filter((x) => x.s > 0)
    .sort((a, b) => b.s - a.s)
    .slice(0, limit)
    .map(({ e }) => ({ href: e.href, label: e.label, hint: e.hint }));
}

/**
 * Where should <Enter> take the user?
 * Best confident match, else the fun page (with the query echoed).
 */
export function route(query: string): string {
  const raw = query.trim();
  if (!raw) return "/";
  const results = suggest(query, 1);
  if (results.length > 0) return results[0].href;
  return `/oops?q=${encodeURIComponent(raw)}`;
}
