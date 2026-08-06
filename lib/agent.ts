// ============================================================
// The agent brain. No LLM, no network call, no API key.
//
// It is a deterministic intent router: normalise → alias → stem →
// score every intent by weighted keyword/phrase overlap (with
// fuzzy matching so typos still land) → answer from a handcrafted
// script. The same question always produces the same answer, which
// is what makes it read as a system that *knows* things rather
// than one that improvises.
//
// Three tiers of reply:
//   1. Routed    - the question maps onto a page that exists, so
//                  the answer summarises it and links there.
//   2. Answered  - the question is about Akshad but has no page of
//                  its own (rates, availability, process, tools).
//   3. Deflected - out of scope. Never a dead end: the fallback
//                  echoes the query, names the nearest thing it
//                  does know, and offers real chips.
// ============================================================

import { PROJECTS } from "@/data/projects";
import { OPERATOR, TIMELINE } from "@/data/operator";
import { SITE } from "@/data/site";

export type AgentAction = {
  label: string;
  href: string;
  external?: boolean;
};

export type AgentReply = {
  /** Intent id. Stable, and rendered as a data attribute so it's testable. */
  id: string;
  /** The answer. Kept to a few sentences, this is a search bar, not a chat app. */
  text: string;
  /** Links offered under the answer. First one is primary. */
  actions: AgentAction[];
  /** Follow-up questions, clicking one asks it. */
  chips: string[];
  /** 0..1. Under CONFIDENCE_FLOOR the reply is a deflection. */
  confidence: number;
  tier: "routed" | "answered" | "deflected";
};

// ------------------------------------------------------------
// 1. Normalising
// ------------------------------------------------------------

const CONTRACTIONS: Record<string, string> = {
  "what's": "what is",
  "whats": "what is",
  "who's": "who is",
  "whos": "who is",
  "where's": "where is",
  "wheres": "where is",
  "how's": "how is",
  "hows": "how is",
  "you're": "you are",
  "youre": "you are",
  "i'm": "i am",
  "im": "i am",
  "don't": "do not",
  "dont": "do not",
  "can't": "cannot",
  "cant": "cannot",
  "isn't": "is not",
  "aren't": "are not",
  "u": "you",
  "ur": "your",
  "pls": "please",
  "plz": "please",
};

/** Words that carry no intent, dropped before scoring. */
const STOPWORDS = new Set([
  "a", "an", "the", "is", "are", "was", "were", "be", "been", "am", "of", "to",
  "in", "on", "at", "for", "with", "and", "or", "but", "if", "then", "than",
  "so", "that", "this", "these", "those", "it", "its", "as", "by", "from",
  "into", "about", "me", "my", "mine", "you", "your", "yours", "i", "we",
  "us", "our", "he", "she", "they", "them", "his", "her", "their", "some",
  "any", "all", "just", "please", "hey", "ok", "okay", "well", "very",
  "really", "much", "many", "there", "here", "up", "out", "do", "does", "did",
  "have", "has", "had", "get", "got", "would", "could", "should", "will",
  "shall", "may", "might", "one", "also", "more", "most", "like",
]);

/**
 * Synonyms folded onto one canonical token, so an intent only has to
 * list the canonical form. This is where most of the "it understood me"
 * feeling comes from, far more than the fuzzy matcher.
 */
const ALIASES: Record<string, string> = {
  // person
  akshad: "akshad", axd: "akshad", prashanth: "akshad", akshat: "akshad",
  // about
  bio: "about", biography: "about", background: "about", story: "about",
  yourself: "about", himself: "about", intro: "about", introduction: "about",
  // work / projects
  project: "work", projects: "work", portfolio: "work", works: "work",
  case: "work", casestudy: "work", studies: "work", study: "work",
  showcase: "work", stuff: "work", things: "work", made: "work",
  built: "work", build: "work", designed: "work", shipped: "work",
  // contact
  contact: "contact", reach: "contact", touch: "contact", email: "email",
  mail: "email", gmail: "email", dm: "contact", message: "contact",
  linkedin: "linkedin", instagram: "instagram", insta: "instagram",
  ig: "instagram", socials: "contact", social: "contact",
  // hiring
  hire: "hire", hiring: "hire", recruit: "hire", recruiter: "hire",
  job: "hire", jobs: "hire", role: "hire", position: "hire",
  opportunity: "hire", vacancy: "hire", intern: "hire",
  internship: "hire", opening: "hire", openings: "hire",
  vacancies: "hire", hires: "hire",
  available: "available", availability: "available",
  notice: "available", joining: "available", start: "available",
  freelance: "freelance", freelancing: "freelance", contract: "freelance",
  commission: "freelance", collab: "freelance", collaborate: "freelance",
  // money
  rate: "rate", rates: "rate", price: "rate", pricing: "rate",
  cost: "rate", charge: "rate", fee: "rate", salary: "rate",
  budget: "rate", quote: "rate", ctc: "rate", money: "rate", pay: "rate",
  // resume
  resume: "resume", cv: "resume", curriculum: "resume",
  // skills / tools
  skill: "skill", skills: "skill", capability: "skill", strength: "skill",
  expertise: "skill", speciality: "skill", specialty: "skill",
  tool: "tool", tools: "tool", software: "tool", app: "tool", apps: "tool",
  stack: "tool", figma: "figma", blender: "blender", photoshop: "photoshop",
  illustrator: "illustrator", procreate: "procreate", framer: "framer",
  aftereffects: "aftereffects", ae: "aftereffects",
  cursor: "cursor", claude: "ai", chatgpt: "ai", gpt: "ai", llm: "ai",
  midjourney: "ai", gemini: "ai", runway: "ai", veo: "ai", genai: "ai",
  ai: "ai", artificial: "ai", intelligence: "ai", mcp: "ai",
  // disciplines
  motion: "motion", animation: "motion", animations: "motion",
  animate: "motion", animated: "motion", video: "motion", reel: "motion",
  gif: "motion", vfx: "motion", "3d": "threed", threed: "threed",
  render: "threed", cgi: "threed",
  brand: "branding", branding: "branding", identity: "branding",
  logo: "branding", logos: "branding", mark: "branding",
  packaging: "branding", rebrand: "branding",
  ui: "product", ux: "product", product: "product", app_design: "product",
  interface: "product", usability: "product", wireframe: "product",
  prototype: "product", saas: "product", dashboard: "product",
  web: "web", website: "web", websites: "web", site: "web", sites: "web",
  landing: "web", webpage: "web", frontend: "code", front: "code",
  code: "code", coding: "code", develop: "code", developer: "code",
  development: "code", engineer: "code", engineering: "code",
  react: "code", nextjs: "code", next: "code", typescript: "code",
  javascript: "code", html: "code", css: "code", tailwind: "code",
  graphic: "visual", visual: "visual", poster: "visual", layout: "visual",
  typography: "visual", type: "visual", colour: "visual", color: "visual",
  illustration: "visual", art: "visual",
  campaign: "campaign", creative: "campaign", crm: "campaign",
  marketing: "campaign", ad: "campaign", ads: "campaign",
  advertisement: "campaign", push: "campaign", banner: "campaign",
  system: "designsystem", systems: "designsystem",
  // employers / education
  joveo: "joveo", myntra: "myntra", minto: "minto", loomero: "loomero",
  swarnabhoomi: "swarnabhoomi", epsilon: "epsilon",
  iiitdm: "education", iiit: "education", college: "education",
  university: "education", degree: "education", studied: "education",
  school: "education", graduation: "education", graduate: "education",
  student: "education", jabalpur: "education", btech: "education",
  bdes: "education", education: "education",
  experience: "experience", worked: "experience", work_history: "experience",
  career: "experience", history: "experience", cvhistory: "experience",
  company: "experience", companies: "experience", employer: "experience",
  years: "experience", yrs: "experience",
  award: "award", awards: "award", achievement: "award",
  achievements: "award", recognition: "award", prize: "award",
  patent: "award", awarded: "award",
  // place
  based: "location", location: "location", live: "location",
  lives: "location", city: "location", country: "location",
  from: "location", located: "location", where: "where",
  bangalore: "location", bengaluru: "location", kerala: "location",
  kannur: "location", india: "location", remote: "remote",
  relocate: "remote", relocation: "remote", onsite: "remote",
  // process
  process: "process", approach: "process", method: "process",
  methodology: "process", workflow: "process", philosophy: "process",
  think: "process", thinking: "process", how: "how", why: "why",
  // meta
  bot: "bot", robot: "bot", agent: "bot", chatbot: "bot", real: "bot",
  human: "bot", model: "bot", trained: "bot", prompt: "bot",
  help: "help", commands: "help", ask: "help",
  // small talk
  hi: "greet", hello: "greet", hey_there: "greet", yo: "greet",
  sup: "greet", namaste: "greet", greetings: "greet", howdy: "greet",
  morning: "greet", evening: "greet",
  thanks: "thanks", thank: "thanks", thx: "thanks", ty: "thanks",
  cheers: "thanks", bye: "bye", goodbye: "bye", later: "bye",
  joke: "joke", funny: "joke", laugh: "joke",
  favourite: "favourite", favorite: "favourite", best: "favourite",
  proudest: "favourite", top: "favourite", recommend: "favourite",
};

/** Very light stemmer, enough to fold plurals and gerunds. */
function stem(w: string): string {
  if (w.length > 4 && w.endsWith("ies")) return w.slice(0, -3) + "y";
  if (w.length > 4 && w.endsWith("sses")) return w.slice(0, -2);
  if (w.length > 3 && w.endsWith("s") && !w.endsWith("ss") && !w.endsWith("us"))
    return w.slice(0, -1);
  if (w.length > 5 && w.endsWith("ing")) return w.slice(0, -3);
  if (w.length > 4 && w.endsWith("ed")) return w.slice(0, -2);
  return w;
}

export type Parsed = {
  raw: string;
  /** Lowercased, punctuation stripped, contractions expanded. */
  flat: string;
  /** Content tokens after aliasing + stemming. */
  tokens: string[];
  /** Every token including stopwords, for phrase checks. */
  all: string[];
  /** who / what / where / when / why / how / can / null */
  question: string | null;
};

export function parse(query: string): Parsed {
  const raw = query.trim();
  let flat = raw
    .toLowerCase()
    .replace(/[‘’]/g, "'")
    .replace(/[^a-z0-9'\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  for (const [k, v] of Object.entries(CONTRACTIONS)) {
    flat = flat.replace(new RegExp(`\\b${k.replace("'", "'")}\\b`, "g"), v);
  }

  const all = flat.split(" ").filter(Boolean);
  const question =
    all.find((w) =>
      ["who", "what", "where", "when", "why", "how", "can", "could", "which"].includes(w)
    ) ?? null;

  const tokens = all
    .map((w) => w.replace(/^-+|-+$/g, ""))
    .filter((w) => w.length > 0 && !STOPWORDS.has(w))
    .map(canonical);

  return { raw, flat, tokens, all, question };
}

const ALIAS_KEYS = Object.keys(ALIASES);

/**
 * Token → canonical concept. Exact alias, then the stem's alias, then a
 * *fuzzy* alias, which is what makes "myntrra", "resmue", "brandng" and
 * "protfolio" behave like the words they were meant to be. Doing the typo
 * correction here rather than only at scoring time means one correction
 * feeds every intent instead of each intent needing its own misspellings.
 */
function canonical(word: string): string {
  const direct = ALIASES[word] ?? ALIASES[word.replace(/-/g, "")];
  if (direct) return direct;

  const s = stem(word);
  if (ALIASES[s]) return ALIASES[s];

  const tol = word.length >= 8 ? 2 : word.length >= 5 ? 1 : 0;
  if (tol > 0) {
    let best: { key: string; d: number } | null = null;
    for (const key of ALIAS_KEYS) {
      if (Math.abs(key.length - word.length) > tol) continue;
      const d = editDistance(word, key, tol);
      if (d <= tol && (!best || d < best.d)) best = { key, d };
      if (best?.d === 1) break;
    }
    if (best) return ALIASES[best.key];
  }
  return s;
}

// ------------------------------------------------------------
// 2. Fuzzy matching
// ------------------------------------------------------------

/**
 * Damerau-Levenshtein (optimal string alignment), early-bailing once the row
 * minimum exceeds `max`. Transpositions cost 1, not 2, which matters a lot for
 * real typing: "resmue" is one swap away from "resume", not two edits.
 */
function editDistance(a: string, b: string, max: number): number {
  if (a === b) return 0;
  if (Math.abs(a.length - b.length) > max) return max + 1;
  let prev2: number[] = [];
  let prev = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    const curr = [i];
    let rowMin = i;
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      let v = Math.min(prev[j] + 1, curr[j - 1] + 1, prev[j - 1] + cost);
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) {
        v = Math.min(v, prev2[j - 2] + 1);
      }
      curr[j] = v;
      if (v < rowMin) rowMin = v;
    }
    if (rowMin > max) return max + 1;
    prev2 = prev;
    prev = curr;
  }
  return prev[b.length];
}

/** Typo tolerance scales with word length: none for tiny words. */
function tolerance(w: string): number {
  if (w.length <= 3) return 0;
  if (w.length <= 6) return 1;
  return 2;
}

type Match = "exact" | "fuzzy" | "prefix" | null;

function tokenMatch(token: string, key: string): Match {
  if (token === key) return "exact";
  const tol = Math.min(tolerance(token), tolerance(key));
  if (tol > 0 && editDistance(token, key, tol) <= tol) return "fuzzy";
  if (key.length >= 4 && token.length >= 4) {
    if (key.startsWith(token) || token.startsWith(key)) return "prefix";
  }
  return null;
}

// ------------------------------------------------------------
// 3. The intent registry
// ------------------------------------------------------------

type Intent = {
  id: string;
  /** Whole phrases. Matching one is strong evidence. */
  phrases?: string[];
  /** Canonical tokens (post-alias). */
  keys: string[];
  /** Proper nouns, essentially. A project's own name is far better evidence
   *  than a shared discipline word, so it outscores one. */
  strong?: string[];
  /** Tokens that make this intent much more likely when paired with a key. */
  boost?: string[];
  /** Tokens that rule this intent out entirely. */
  block?: string[];
  answer: string | ((p: Parsed) => string);
  actions?: AgentAction[];
  chips?: string[];
  tier: "routed" | "answered";
  /** Tiebreaker when two intents score the same. */
  weight?: number;
};

const firstName = "Akshad";
const nProjects = PROJECTS.length;
const motionCount = PROJECTS.filter((p) => p.categories.includes("Motion Graphics")).length;
const brandCount = PROJECTS.filter((p) => p.categories.includes("Brand Identity")).length;

const CHIPS_DEFAULT = ["Show me the work", "Are you available for work?", "What tools do you use?"];

/** One intent per project, generated from real data so the copy can't drift. */
const PROJECT_ALIASES: Record<string, string[]> = {
  "cms-editor-revamp": ["cms", "editor", "enterprise", "joveo", "selfserve", "aifirst", "platform"],
  "myntra-crm": ["myntra", "crm", "campaign", "fashion", "sale", "push", "ecommerce"],
  "web-template": ["template", "career", "careers", "web", "healthcare"],
  "product-animations": ["joveo", "product", "explainer", "demo"],
  "rain-mazha": ["rain", "mazha", "music", "malayalam", "song", "lyric"],
  dripps: ["dripps", "streetwear", "genz", "tee", "clothing"],
  "manas-home-gardens": ["manas", "garden", "gardens", "plant", "botanical"],
  loomero: ["loomero", "loom", "weave", "essentials", "clothing"],
  "la-la-animation": ["lala", "vandine", "thedum"],
  "other-animations": ["misc", "reveal", "reveals", "shorts"],
  "spider-ai-animation": ["spider", "minto"],
  tapse: ["tapse", "medicine", "medication", "accessibility", "device", "patent", "blind"],
  "onam-logo-reveal": ["onam", "reveal", "title"],
  "blossom-3d-animation": ["blossom", "car", "cars", "vintage", "geometry"],
};

/** The tokens that only ever mean this one project. Scored as proper nouns. */
const PROJECT_NAMES: Record<string, string[]> = {
  "cms-editor-revamp": ["cms"],
  "myntra-crm": ["myntra", "crm"],
  "web-template": ["template"],
  "rain-mazha": ["rain", "mazha"],
  dripps: ["dripps"],
  "manas-home-gardens": ["manas"],
  loomero: ["loomero"],
  "la-la-animation": ["lala", "vandine", "thedum"],
  "spider-ai-animation": ["spider"],
  tapse: ["tapse"],
  "onam-logo-reveal": ["onam"],
  "blossom-3d-animation": ["blossom"],
};

function projectIntents(): Intent[] {
  return PROJECTS.map((p) => {
    const keys = [
      ...p.title.toLowerCase().split(/\W+/),
      ...p.slug.split("-"),
      ...(PROJECT_ALIASES[p.slug] ?? []),
    ]
      .filter((t) => t.length > 2 && !STOPWORDS.has(t))
      .map((t) => ALIASES[t] ?? t);

    const actions: AgentAction[] = p.externalUrl
      ? [{ label: `Open ${p.title} on Behance`, href: p.externalUrl, external: true }]
      : [{ label: `Open ${p.title}`, href: `/projects/${p.slug}` }];

    return {
      id: `project:${p.slug}`,
      keys: Array.from(new Set(keys)),
      strong: PROJECT_NAMES[p.slug] ?? [],
      phrases: [p.title.toLowerCase()],
      answer: `${p.title} - ${p.client}, ${p.year}. ${p.summary}`,
      actions,
      chips: ["Show me the work", `What tools did that use?`, "Are you available for work?"],
      tier: "routed" as const,
      weight: 2,
    };
  });
}

const INTENTS: Intent[] = [
  // ---------- navigation ----------
  {
    id: "about",
    // Deliberately NOT a bare "tell me about" - that phrase opens questions
    // about projects far more often than questions about the person.
    phrases: [
      "who is akshad", "who are you", "about you", "about yourself",
      "tell me about akshad", "tell me about yourself", "tell me about you",
    ],
    keys: ["about", "akshad", "designer"],
    answer: `I'm ${firstName} Prashanth, a ${OPERATOR.title.toLowerCase()} working where visual design, product thinking and AI-assisted building overlap. ${OPERATOR.location.replace("From", "Originally from")}, currently based in ${SITE.operatedFrom}.`,
    actions: [
      { label: "Read the full story", href: "/about" },
      { label: "Download my resume", href: "/resume.pdf", external: true },
    ],
    chips: ["Where have you worked?", "What do you do exactly?", "Show me the work"],
    tier: "routed",
    weight: 3,
  },
  {
    id: "projects",
    phrases: ["show me the work", "show me your work", "see the work", "all projects"],
    keys: ["work"],
    answer: `${nProjects} pieces are up: enterprise product design at Joveo, campaign work at Myntra, brand identities for startups, and a stack of motion and 3D. The list filters by discipline.`,
    actions: [{ label: "Browse all projects", href: "/projects" }],
    chips: ["Show me motion work", "Show me branding work", "What's your best project?"],
    tier: "routed",
    weight: 3,
  },
  {
    id: "contact",
    phrases: ["get in touch", "how do i contact", "how do i reach", "contact you"],
    keys: ["contact", "email", "linkedin", "instagram"],
    answer: `Fastest route is email: ${SITE.email}. I'm also on LinkedIn and Instagram (@${SITE.instagramHandle}).`,
    actions: [
      { label: "Contact page", href: "/contact" },
      { label: "Email me", href: `mailto:${SITE.email}`, external: true },
    ],
    chips: ["Are you available for work?", "Can I see your resume?", "Where are you based?"],
    tier: "routed",
    weight: 3,
  },
  {
    id: "resume",
    phrases: ["can i see your resume", "send me your cv", "download resume"],
    keys: ["resume"],
    answer:
      "The 2026 resume is a PDF, one page, and it matches everything on this site. There's a copy on the about page too.",
    actions: [
      { label: "Download resume (PDF)", href: "/resume.pdf", external: true },
      { label: "Or read the about page", href: "/about" },
    ],
    chips: ["Where have you worked?", "What are your skills?", "Get in touch"],
    tier: "routed",
    weight: 3,
  },

  // ---------- discipline filters ----------
  {
    id: "motion",
    phrases: ["show me motion", "motion graphics", "animation work"],
    keys: ["motion", "threed"],
    boost: ["work"],
    answer: `${motionCount} motion pieces are up: a Malayalam music video that's crossed 13K views, product films for Joveo, logo reveals, and 3D work built in Blender. After Effects and Blender do most of the lifting.`,
    actions: [{ label: "See the motion work", href: "/projects" }],
    chips: ["Tell me about Rain / Mazha", "Show me 3D work", "What tools do you use?"],
    tier: "routed",
    weight: 2,
  },
  {
    id: "branding",
    phrases: ["brand identity", "logo design", "branding work"],
    keys: ["branding"],
    boost: ["work"],
    answer: `${brandCount} identity projects, run end to end: Dripps (Gen-Z streetwear), Loomero (minimal essentials), Manas Home Gardens (botanical), plus campaign identity work at Myntra. Marks, type systems, packaging, guidelines.`,
    actions: [{ label: "See the branding work", href: "/projects" }],
    chips: ["Tell me about Dripps", "Tell me about Loomero", "Are you available for work?"],
    tier: "routed",
    weight: 2,
  },
  {
    id: "product",
    phrases: ["product design", "ui ux", "ux work"],
    keys: ["product", "designsystem"],
    boost: ["work"],
    answer:
      "The deepest product work is the Joveo CMS revamp: turning a service-delivered enterprise career-site build into a self-serve, AI-assisted platform, plus a 70+ widget library and the design system behind it.",
    actions: [{ label: "Read the CMS case study", href: "/projects/cms-editor-revamp" }],
    chips: ["What was your role at Joveo?", "Do you code?", "Show me the work"],
    tier: "routed",
    weight: 2,
  },
  {
    id: "webwork",
    phrases: ["web design", "website work", "landing page"],
    keys: ["web"],
    boost: ["work"],
    answer:
      "Web work is mostly career sites: a composable template system at Joveo whose sections re-skin to any employer's brand without breaking layout. This site is in that family too, hand-built in Next.js.",
    actions: [{ label: "See the web template project", href: "/projects/web-template" }],
    chips: ["How was this site built?", "Do you code?", "Show me the work"],
    tier: "routed",
    weight: 2,
  },

  // ---------- facts with no page of their own ----------
  {
    id: "hiring",
    phrases: [
      "are you hiring", "are you available", "open to work", "looking for a job",
      "can i hire you", "are you free", "do you take freelance",
    ],
    keys: ["hire", "available", "freelance", "remote"],
    strong: ["hire", "available", "freelance"],
    answer:
      "Yes, open to it. Full-time design roles, and freelance for brand and motion. Currently wrapping up at Joveo (Nov 2025 - Jul 2026), and happy to talk remote or relocate.",
    actions: [
      { label: "Get in touch", href: "/contact" },
      { label: "Email me", href: `mailto:${SITE.email}`, external: true },
    ],
    chips: ["What are your rates?", "Where are you based?", "Can I see your resume?"],
    tier: "answered",
    weight: 3,
  },
  {
    id: "rates",
    phrases: ["what are your rates", "how much do you charge", "what is your budget"],
    keys: ["rate"],
    answer:
      "Depends entirely on the scope: a logo system and a full career-site build aren't the same conversation. Send me what you have in mind and I'll come back with a number.",
    actions: [{ label: "Start that conversation", href: "/contact" }],
    chips: ["Are you available for work?", "Show me branding work", "Get in touch"],
    tier: "answered",
    weight: 3,
  },
  {
    id: "location",
    phrases: ["where are you based", "where do you live", "where are you from"],
    keys: ["location"],
    boost: ["where"],
    answer: `Based in ${SITE.operatedFrom}, originally from Kannur, Kerala. I studied design at IIITDM Jabalpur. Remote works fine, and I'm open to relocating.`,
    actions: [{ label: "More on the about page", href: "/about" }],
    chips: ["Are you available for work?", "Where have you worked?", "Get in touch"],
    tier: "answered",
    weight: 3,
  },
  {
    id: "experience",
    phrases: [
      "where have you worked", "work experience", "past companies",
      "how many years of experience", "who have you worked for",
    ],
    keys: ["experience", "joveo", "myntra", "minto", "swarnabhoomi", "epsilon"],
    answer: `${TIMELINE.length} roles so far. Joveo (Visual Design Intern, Nov 2025 - Jul 2026, sole designer on the Implementation team), Myntra (Creative Intern on CRM, Jul - Nov 2025), Swarnabhoomi Academy of Music as design consultant, plus freelance brand and motion for Loomero, Minto.ai and Epsilon Delta.`,
    actions: [
      { label: "See the full timeline", href: "/about" },
      { label: "Download my resume", href: "/resume.pdf", external: true },
    ],
    chips: ["What did you do at Joveo?", "What did you do at Myntra?", "What are your skills?"],
    tier: "answered",
    weight: 3,
  },
  {
    id: "skills",
    phrases: ["what are your skills", "what can you do", "what do you do"],
    keys: ["skill"],
    answer: `Five things, in the order I'd claim them: ${OPERATOR.capabilities
      .map((c) => c.label.toLowerCase())
      .join(", ")}. The through-line is that I can take something from research to a shipped, built surface.`,
    actions: [{ label: "See it broken down", href: "/about" }],
    chips: ["What tools do you use?", "Do you code?", "Show me the work"],
    tier: "answered",
    weight: 2,
  },
  {
    id: "tools",
    phrases: ["what tools do you use", "what software", "your stack"],
    keys: ["tool", "figma", "blender", "photoshop", "illustrator", "procreate", "aftereffects", "framer", "cursor"],
    answer: `Design: ${OPERATOR.toolGroups[0].items
      .map((t) => t.name)
      .join(", ")}. AI: ${OPERATOR.toolGroups[1].items.map((t) => t.name).join(", ")}.`,
    actions: [{ label: "See what each one is for", href: "/about" }],
    chips: ["How do you use AI?", "Do you code?", "Show me motion work"],
    tier: "answered",
    weight: 2,
  },
  {
    id: "ai",
    phrases: ["how do you use ai", "do you use ai", "ai workflow"],
    keys: ["ai"],
    block: ["bot"],
    answer:
      "As a production partner, not an author. Midjourney and Gemini for imagery at Myntra; Claude Code, Cursor and Figma MCP for turning designs into working prototypes at Joveo. The judgment about what ships stays mine.",
    actions: [{ label: "The clearest example", href: "/projects/cms-editor-revamp" }],
    chips: ["Do you code?", "What tools do you use?", "How was this site built?"],
    tier: "answered",
    weight: 2,
  },
  {
    id: "code",
    phrases: ["do you code", "can you code", "are you a developer", "do you build"],
    keys: ["code"],
    answer:
      "Yes, that's the 'design engineer' half. Next.js, React and TypeScript, with Claude Code and Cursor. I build the prototypes I design, which is how the Joveo CMS work got real enough for engineering to pick up.",
    actions: [{ label: "The prototype it produced", href: "/projects/cms-editor-revamp" }],
    chips: ["How was this site built?", "How do you use AI?", "What are your skills?"],
    tier: "answered",
    weight: 2,
  },
  {
    id: "thissite",
    phrases: [
      "how was this site built", "how did you make this site",
      "what is this site built with", "is this site made with ai",
      "this site", "this website", "this portfolio", "this page",
      "built this", "make this", "made this", "how did you build",
    ],
    keys: ["thissite"],
    answer:
      "Next.js, React, TypeScript and Tailwind, written with Claude Code. The background is a WebGL fluid simulation, the blob is a hand-animated SVG, and this search bar is a keyword intent router, not a language model, which is why it answers instantly and offline.",
    actions: [{ label: "See the work that led here", href: "/projects/cms-editor-revamp" }],
    chips: ["Do you code?", "How do you use AI?", "Who is Akshad?"],
    tier: "answered",
    weight: 3,
  },
  {
    id: "education",
    phrases: ["where did you study", "what did you study", "your education"],
    keys: ["education"],
    answer: `${OPERATOR.education[0].award} at ${OPERATOR.education[0].school}, ${OPERATOR.education[0].period}.`,
    actions: [{ label: "More on the about page", href: "/about" }],
    chips: ["Where have you worked?", "What awards have you won?", "What are your skills?"],
    tier: "answered",
    weight: 2,
  },
  {
    id: "awards",
    phrases: [
      "what awards", "any achievements", "have you won", "did you win",
      "won anything", "any recognition",
    ],
    keys: ["award"],
    answer: `Two worth naming. ${OPERATOR.achievements[0]}. And ${OPERATOR.achievements[1].toLowerCase()}.`,
    actions: [
      {
        label: "The patent project",
        href: PROJECTS.find((p) => p.slug === "tapse")!.externalUrl!,
        external: true,
      },
      { label: "Full recognition list", href: "/about" },
    ],
    chips: ["Tell me about Tapse", "Where did you study?", "Show me the work"],
    tier: "answered",
    weight: 2,
  },
  {
    id: "process",
    phrases: ["what is your process", "how do you work", "your approach", "design philosophy"],
    keys: ["process"],
    answer:
      "Understand the constraint before touching the interface, validate structure while it's still cheap text, then build it so the argument survives contact with engineering. Most of my case studies are written that way because that's the order it happened in.",
    actions: [{ label: "The clearest example of it", href: "/projects/cms-editor-revamp" }],
    chips: ["Do you code?", "What are your skills?", "What's your best project?"],
    tier: "answered",
    weight: 2,
  },
  {
    id: "favourite",
    phrases: ["what is your best project", "favourite project", "what should i look at first"],
    keys: ["favourite"],
    boost: ["work"],
    answer:
      "The Joveo CMS revamp, if you only have time for one: it's the piece where research, product strategy, design system and a built prototype all had to hold together. If you want something faster to enjoy, the Rain / Mazha music video.",
    actions: [
      { label: "Read the CMS case study", href: "/projects/cms-editor-revamp" },
      { label: "Watch Rain / Mazha", href: "/projects/rain-mazha" },
    ],
    chips: ["Show me the work", "What's your process?", "Are you available for work?"],
    tier: "answered",
    weight: 2,
  },
  {
    id: "joveo",
    phrases: ["what did you do at joveo", "your role at joveo", "tell me about joveo"],
    keys: ["joveo"],
    answer: `${TIMELINE[0].role} at Joveo, ${TIMELINE[0].period}. ${TIMELINE[0].note}`,
    actions: [{ label: "The CMS case study", href: "/projects/cms-editor-revamp" }],
    chips: ["Show me the product animations", "Where else have you worked?", "Do you code?"],
    tier: "answered",
    weight: 3,
  },
  {
    id: "myntra",
    phrases: ["what did you do at myntra", "your role at myntra", "tell me about myntra"],
    keys: ["myntra"],
    answer: `${TIMELINE[1].role} at Myntra, ${TIMELINE[1].period}. ${TIMELINE[1].note}`,
    actions: [{ label: "See the Myntra work", href: "/projects/myntra-crm" }],
    chips: ["How do you use AI?", "Where else have you worked?", "Show me the work"],
    tier: "answered",
    weight: 3,
  },

  // ---------- meta / small talk ----------
  {
    id: "meta.bot",
    phrases: [
      "are you an ai", "are you a bot", "are you chatgpt", "are you real",
      "are you human", "what model are you", "are you a language model",
    ],
    keys: ["bot"],
    answer:
      "No model behind this, honestly. It's a hand-written intent router: keywords, synonyms and a fuzzy matcher over everything on this site. If I answer something, it's because Akshad wrote that answer.",
    actions: [{ label: "See what it's built on", href: "/projects/cms-editor-revamp" }],
    chips: ["What can I ask you?", "Who is Akshad?", "How was this site built?"],
    tier: "answered",
    weight: 3,
  },
  {
    id: "meta.help",
    phrases: [
      "what can i ask", "what can you do", "help", "what do you know",
      "what should i ask", "how does this work",
    ],
    keys: ["help"],
    answer:
      "Ask about the work (any project by name, or a discipline like motion or branding), about Akshad (experience, skills, tools, education, where he's based), or the practical stuff (availability, rates, resume, how to get in touch).",
    actions: [{ label: "Or just browse everything", href: "/projects" }],
    chips: ["Who is Akshad?", "Show me motion work", "Are you available for work?"],
    tier: "answered",
    weight: 3,
  },
  {
    id: "smalltalk.greet",
    phrases: ["hello", "hi there", "good morning", "good evening"],
    keys: ["greet"],
    answer:
      "Hey. I'm AXD, the agent version of Akshad's portfolio. Ask me about the work, the experience, or whether he's free.",
    chips: CHIPS_DEFAULT,
    tier: "answered",
    weight: 1,
  },
  {
    id: "smalltalk.howareyou",
    phrases: ["how are you", "how is it going", "how do you do", "you good"],
    keys: [],
    answer:
      "Rendering at 60fps and mildly over-caffeinated. More usefully: everything Akshad has shipped is one question away.",
    chips: CHIPS_DEFAULT,
    tier: "answered",
    weight: 2,
  },
  {
    id: "smalltalk.thanks",
    phrases: ["thank you", "thanks a lot", "appreciate it"],
    keys: ["thanks"],
    answer: "Any time. If you're hiring, the contact page is the useful next click.",
    actions: [{ label: "Get in touch", href: "/contact" }],
    chips: ["Are you available for work?", "Can I see your resume?", "Show me the work"],
    tier: "answered",
    weight: 2,
  },
  {
    id: "smalltalk.bye",
    phrases: ["goodbye", "see you", "bye bye"],
    keys: ["bye"],
    answer: "Later. The work stays here whenever you want another look.",
    chips: CHIPS_DEFAULT,
    tier: "answered",
    weight: 2,
  },
  {
    id: "smalltalk.joke",
    phrases: ["tell me a joke", "say something funny", "make me laugh"],
    keys: ["joke"],
    answer:
      "A designer walks into a bar. Then walks out and comes back in with 4px more padding. Anyway, the work is better than the material.",
    chips: CHIPS_DEFAULT,
    tier: "answered",
    weight: 2,
  },
  {
    id: "smalltalk.compliment",
    phrases: [
      "this is nice", "cool site", "i love this", "this is amazing",
      "great portfolio", "nice work", "well done", "this is sick", "awesome",
    ],
    keys: [],
    answer:
      "Appreciated, genuinely. It was built by hand, no template, so that lands. The work behind it is the actual point though.",
    actions: [{ label: "Go see it", href: "/projects" }],
    chips: ["How was this site built?", "What's your best project?", "Are you available for work?"],
    tier: "answered",
    weight: 2,
  },
  {
    id: "smalltalk.personal",
    phrases: [
      "how old are you", "are you single", "what is your age", "your birthday",
      "do you have a girlfriend", "are you married",
    ],
    keys: [],
    answer:
      "That one's above my pay grade, I only hold the professional record. Ask me about the work and I get a lot more useful.",
    chips: CHIPS_DEFAULT,
    tier: "answered",
    weight: 2,
  },
];

const ALL_INTENTS: Intent[] = [...INTENTS, ...projectIntents()];

// A couple of keys are phrase-only concepts with no natural alias.
const EXTRA_KEY_TOKENS: Record<string, string[]> = {
  // Deliberately empty: "web" and "website" belong to the web-work intent.
  // "how was *this* site built" is a phrase question, so phrases carry it.
  thissite: [],
};

// ------------------------------------------------------------
// 4. Scoring
// ------------------------------------------------------------

const CONFIDENCE_FLOOR = 0.34;

function scoreIntent(intent: Intent, p: Parsed): number {
  if (intent.block?.some((b) => p.tokens.includes(b))) return 0;

  let s = 0;

  // Phrase hits are the strongest signal, they're whole questions.
  for (const phrase of intent.phrases ?? []) {
    if (p.flat.includes(phrase)) s += 7 + phrase.split(" ").length * 0.4;
  }

  // "how was this site built" style intents keep an explicit key list.
  const keys =
    intent.id === "thissite" ? EXTRA_KEY_TOKENS.thissite : intent.keys;

  const hit = new Set<string>();
  for (const t of p.tokens) {
    let matched = false;
    for (const k of intent.strong ?? []) {
      const m = tokenMatch(t, k);
      if (!m || hit.has(k)) continue;
      hit.add(k);
      s += m === "exact" ? 6.5 : m === "fuzzy" ? 4.5 : 2.4;
      matched = true;
      break;
    }
    if (matched) continue;
    for (const k of keys) {
      const m = tokenMatch(t, k);
      if (!m) continue;
      if (hit.has(k)) continue;
      hit.add(k);
      s += m === "exact" ? 4 : m === "fuzzy" ? 2.6 : 1.6;
      break;
    }
  }

  if (s > 0) {
    for (const b of intent.boost ?? []) {
      if (p.tokens.includes(b) || p.all.includes(b)) s += 1.6;
    }
    s += (intent.weight ?? 1) * 0.25;
  }

  // Long rambling queries shouldn't out-score short precise ones just by
  // brushing more keywords, so normalise gently by query length.
  const len = Math.max(1, p.tokens.length);
  return s / (1 + Math.max(0, len - 3) * 0.06);
}

// ------------------------------------------------------------
// 5. Deflections, the "I don't know that" path
// ------------------------------------------------------------

/** Deterministic hash, so the same question always gets the same reply. */
function hash(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

const DEFLECTIONS = [
  "I've got nothing filed under that one. I only know Akshad's work, his experience and how to reach him.",
  "That's outside what I hold. My whole world is this portfolio: the projects, the experience, and the contact details.",
  "Not something I can answer, I'm afraid, I'm a portfolio, not a search engine. Try me on the work instead.",
  "No match for that. What I'm good for: the projects, where he's worked, what he uses, and whether he's free.",
];

/** Query looks like keyboard mash: no vowels, or one long unbroken string. */
function looksLikeGibberish(p: Parsed): boolean {
  if (!p.flat) return false;
  const letters = p.flat.replace(/[^a-z]/g, "");
  if (letters.length < 4) return false;
  const vowels = (letters.match(/[aeiou]/g) ?? []).length;
  return vowels / letters.length < 0.18 || /(.)\1{4,}/.test(letters);
}

/**
 * The near miss. Even below the floor there's usually *some* intent with a
 * non-zero score; naming it is what stops a fallback feeling like a 404.
 */
function nearestTopic(ranked: { intent: Intent; score: number }[]): Intent | null {
  const best = ranked[0];
  return best && best.score > 0.9 ? best.intent : null;
}

function deflect(p: Parsed, ranked: { intent: Intent; score: number }[]): AgentReply {
  const near = nearestTopic(ranked);

  if (looksLikeGibberish(p)) {
    return {
      id: "fallback.gibberish",
      text: "That one isn't a word I know, and I checked twice. Try a project name, or ask what Akshad does.",
      actions: [{ label: "Browse everything instead", href: "/projects" }],
      chips: ["What can I ask you?", "Who is Akshad?", "Show me the work"],
      confidence: 0,
      tier: "deflected",
    };
  }

  if (near) {
    const label =
      typeof near.answer === "string" ? near.answer : near.answer(p);
    return {
      id: `fallback.near:${near.id}`,
      text: `Not sure that's something I hold. The closest thing I have: ${label}`,
      actions: near.actions ?? [{ label: "Browse everything", href: "/projects" }],
      chips: near.chips ?? CHIPS_DEFAULT,
      confidence: 0.25,
      tier: "deflected",
    };
  }

  const opener = DEFLECTIONS[hash(p.flat) % DEFLECTIONS.length];
  return {
    id: "fallback.unknown",
    text: `${opener}${p.raw.length <= 40 ? ` ("${p.raw}" drew a blank.)` : ""}`,
    actions: [{ label: "See what I do know", href: "/projects" }],
    chips: ["What can I ask you?", "Who is Akshad?", "Are you available for work?"],
    confidence: 0,
    tier: "deflected",
  };
}

// ------------------------------------------------------------
// 6. Public API
// ------------------------------------------------------------

export const OPENING_REPLY: AgentReply = {
  id: "opening",
  text: "Ask me about the work, the experience, or whether Akshad's free. I answer from what's actually on this site.",
  actions: [],
  chips: ["Who is Akshad?", "Show me the work", "Are you available for work?"],
  confidence: 1,
  tier: "answered",
};

/** Punctuation, emoji or whitespace only, nothing survived normalising. */
const EMPTY_REPLY: AgentReply = {
  id: "fallback.empty",
  text: "That's not much to go on. Try a project name, or ask what Akshad does.",
  actions: [{ label: "Browse everything", href: "/projects" }],
  chips: ["What can I ask you?", "Who is Akshad?", "Show me the work"],
  confidence: 0,
  tier: "deflected",
};

export function ask(query: string): AgentReply {
  const p = parse(query);
  if (!p.flat) return query.trim() ? EMPTY_REPLY : OPENING_REPLY;

  const ranked = ALL_INTENTS.map((intent) => ({
    intent,
    score: scoreIntent(intent, p),
  }))
    .filter((r) => r.score > 0)
    .sort(
      (a, b) => b.score - a.score || (b.intent.weight ?? 1) - (a.intent.weight ?? 1)
    );

  const top = ranked[0];
  // Score → confidence, saturating. ~4 points (one exact keyword) reads as 0.5.
  const confidence = top ? top.score / (top.score + 4) : 0;

  if (!top || confidence < CONFIDENCE_FLOOR) return deflect(p, ranked);

  const { intent } = top;
  return {
    id: intent.id,
    text: typeof intent.answer === "string" ? intent.answer : intent.answer(p),
    actions: intent.actions ?? [],
    chips: intent.chips ?? CHIPS_DEFAULT,
    confidence,
    tier: intent.tier,
  };
}

/** Where <Enter> should land when the bar is used purely as navigation (nav pill). */
export function routeFor(query: string): string | null {
  const reply = ask(query);
  if (reply.tier === "deflected") return null;
  const internal = reply.actions.find((a) => !a.external);
  return internal?.href ?? null;
}
