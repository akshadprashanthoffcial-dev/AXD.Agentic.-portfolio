// ============================================================
// Bespoke case study — Myntra CRM Campaign Design.
// Fixed left-side project facts, right-side scrolling story —
// the cover is the first image in that scroll, followed by the
// details and the rest of the gallery. The layout pattern is
// from axd-labs-site's experiment pages (case-side sticky /
// case-story scroll), ported to this app's Tailwind dark theme.
// ============================================================

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PROJECTS, getProject } from "@/data/projects";
import ImageBlock from "@/components/projects/ImageBlock";
import Reveal from "@/components/ui/Reveal";
import BlurReveal from "@/components/ui/BlurReveal";
import FooterBlob from "@/components/FooterBlob";
import CTA from "@/components/ui/CTA";

const P = getProject("myntra-crm")!;
const COVER_RATIO = 1600 / 1563;
const BEHANCE_URL = "https://www.behance.net/gallery/241507665/Sale-CRM-Creatives";

export const metadata: Metadata = {
  title: `${P.title} — ${P.client}`,
  description: P.summary,
};

const FACTS = [
  { k: "Role", v: P.role },
  { k: "Company", v: P.client },
  { k: "Timeline", v: P.period },
  { k: "Duration", v: "5 months" },
];

const SKILLS = ["Campaign design", "Visual storytelling", "AI-assisted production", "Design systems"];

const TOOLS = [
  { name: "Midjourney", icon: "/projects/myntra-crm/tools/midjourney.png" },
  { name: "Gemini", icon: "/projects/myntra-crm/tools/gemini.png" },
  { name: "ChatGPT", icon: "/projects/myntra-crm/tools/chatgpt.png" },
  { name: "Figma", icon: "/projects/myntra-crm/tools/figma.png" },
  { name: "Photoshop", icon: "/projects/myntra-crm/tools/photoshop.png" },
  { name: "Illustrator", icon: "/projects/myntra-crm/tools/illustrator.png" },
];

const CHALLENGE =
  "Myntra's CRM team sends daily campaigns to millions of users — push notifications, emails, and in-app banners. The job wasn't just producing creatives; it was making visuals compelling enough to earn a tap during India's most competitive shopping events, while staying true to each sale's design language.";

const WORK = [
  "I designed campaign creatives for Myntra's major sale events: Big Fashion Festival, End of Reason Sale, Diwali Sale, Wedding Season and Winter Sale.",
  "I owned the deal templates for entire sales — 20+ creatives per event across different offer types — plus in-app revenue banners styled as festive editorial product photography.",
  "Every creative had to balance three things at once: make the offer stand out, keep the products the hero, and stay inside Myntra's established sale design language.",
];

const AI_NOTE =
  "AI became a production partner. I used Midjourney and Gemini to generate campaign imagery and festive backgrounds, explore more visual directions faster, and cut creative turnaround time — with design judgment deciding what actually shipped.";

const OUTCOME =
  "Creatives shipped in multiple nationwide campaigns across the internship, and the AI-assisted workflow helped the team produce more variations in less time. Performance was tracked through click-through rates, which shaped each next round of designs.";

const LEARNED =
  "Speed alone doesn't improve marketing. AI only becomes valuable when it's paired with strong design judgment and a clear understanding of how customers actually behave.";

// Each sale gets its own named group so more can be dropped in later
// without restructuring the page — just append to this array.
const SALES = [
  {
    name: "Big Fashion Festival",
    images: [
      {
        src: "/projects/myntra-crm/gallery-1.jpg",
        ratio: 1600 / 2098,
        caption: "'One Order Free' — creative explorations for the BFF revenue property",
      },
      {
        src: "/projects/myntra-crm/gallery-2.jpg",
        ratio: 1600 / 2263,
        caption: "Deal templates — BFF push banners and the 'Price Crash' creative",
      },
      {
        src: "/projects/myntra-crm/gallery-3.jpg",
        ratio: 1600 / 2263,
        caption: "Revenue Property (In-App) — festive editorial product photography",
      },
      {
        src: "/projects/myntra-crm/gallery-4.jpg",
        ratio: 1600 / 2263,
        caption: "Revenue Property (In-App) — model photoshoot banners",
      },
    ],
  },
  {
    name: "End of Reason Sale",
    images: [
      { src: "/projects/myntra-crm/eors-cover.jpg", ratio: 1600 / 2264, caption: "End of Reason Sale — campaign identity" },
      { src: "/projects/myntra-crm/eors-1.jpg", ratio: 1600 / 2264, caption: "Deal templates — 'Midnight Steals' billboard and podium creatives" },
      { src: "/projects/myntra-crm/eors-2.jpg", ratio: 1600 / 2264, caption: "Deal templates — VR-frame and drone-frame variants" },
      { src: "/projects/myntra-crm/eors-3.jpg", ratio: 1600 / 2264, caption: "Deal templates — headset, tricopter and crate-frame variants" },
    ],
  },
  {
    name: "Diwali Sale",
    images: [
      { src: "/projects/myntra-crm/diwali-cover.jpg", ratio: 1600 / 2264, caption: "Diwali Sale — campaign identity" },
      { src: "/projects/myntra-crm/diwali-1.jpg", ratio: 1600 / 2264, caption: "Deal templates — 'Shubh Aarambh', 'Crazy Deals' and 'Deals of the Day'" },
      { src: "/projects/myntra-crm/diwali-2.jpg", ratio: 1600 / 2264, caption: "Deal templates — 'Midnight Steals', 'Brand Deal-Lights' and 'Festive Rush Steal'" },
      { src: "/projects/myntra-crm/diwali-3.jpg", ratio: 1600 / 2264, caption: "PERF templates — festive editorial model shoots" },
      { src: "/projects/myntra-crm/diwali-4.jpg", ratio: 1600 / 2264, caption: "Revenue Property (In-App) — footwear and bags" },
      { src: "/projects/myntra-crm/diwali-5.jpg", ratio: 1600 / 2264, caption: "Revenue Property (In-App) — model photoshoot banners" },
    ],
  },
];

// Everything past this point isn't broken out by sale yet — shown as
// one grouped block that links out to the full Behance case study.
const MORE_WORK = [
  { src: "/projects/myntra-crm/more-1.jpg", ratio: 1600 / 2263, caption: "Wedding Season — Revenue Property (In-App)" },
  { src: "/projects/myntra-crm/more-2.jpg", ratio: 1600 / 2263, caption: "Wedding Season — Revenue Property (In-App)" },
  { src: "/projects/myntra-crm/more-3.jpg", ratio: 1600 / 2263, caption: "Big Winter Bonanza — campaign identity and banners" },
  { src: "/projects/myntra-crm/more-4.jpg", ratio: 1600 / 2263, caption: "Black Friday Sale — campaign identity and banners" },
];

export default function MyntraCaseStudy() {
  const idx = PROJECTS.findIndex((p) => p.slug === P.slug);
  const next = PROJECTS[(idx + 1) % PROJECTS.length];

  return (
    <article>
      <div className="px-5 pt-32">
        <div className="mx-auto max-w-6xl">
          {/* ---------------- Cover — first image in the scroll ---------------- */}
          <Reveal>
            <ImageBlock
              src="/projects/myntra-crm/cover-v2.jpg"
              caption={`${P.client} · ${P.title}`}
              ratio={COVER_RATIO}
              priority
              className="mb-14"
            />
          </Reveal>

          {/* ---------------- Header ---------------- */}
          <header className="mb-14">
            <div className="mb-5 flex flex-wrap items-center gap-2 text-[12px] uppercase tracking-[0.22em] text-white/35">
              <span>{P.client}</span>
              <span className="text-white/15">/</span>
              <span>{P.year}</span>
              <span className="text-white/15">/</span>
              <span>Case study</span>
            </div>

            <BlurReveal
              as="h1"
              text={P.title}
              className="font-display max-w-3xl text-[clamp(34px,6vw,64px)] leading-[1.05] text-white"
            />

            <p className="mt-6 max-w-2xl text-[18px] leading-relaxed text-white/60">
              {P.summary}
            </p>
          </header>

          {/* ---------------- Facts + story ---------------- */}
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-16">
            {/* Left — fixed project facts */}
            <aside
              aria-label="Project facts"
              className="grid grid-cols-2 gap-6 self-start rounded-2xl border border-white/10 p-6 sm:grid-cols-4 lg:sticky lg:top-24 lg:grid-cols-1 lg:gap-6"
              style={{ background: "var(--brand-sheen-soft)" }}
            >
              <div className="col-span-2 sm:col-span-4 lg:col-span-1">
                <CTA label="View full project" href={BEHANCE_URL} external size="md" className="w-full justify-center" />
              </div>

              {FACTS.map((f) => (
                <div key={f.k}>
                  <dt className="text-[11px] uppercase tracking-[0.2em] text-white/35">
                    {f.k}
                  </dt>
                  <dd className="mt-1.5 text-[15px] font-medium text-white/85">
                    {f.v}
                  </dd>
                </div>
              ))}

              <div className="col-span-2 lg:col-span-1">
                <dt className="text-[11px] uppercase tracking-[0.2em] text-white/35">
                  Tools
                </dt>
                <dd className="mt-3 flex flex-wrap gap-2.5">
                  {TOOLS.map((t) => (
                    <div key={t.name} className="group relative">
                      <div className="h-8 w-8 overflow-hidden rounded-[9px] border border-white/10 transition-transform duration-200 ease-out group-hover:-translate-y-1 group-hover:border-white/25">
                        <Image src={t.icon} alt={t.name} width={32} height={32} className="h-full w-full object-cover" />
                      </div>
                      <span className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md border border-white/10 bg-black/90 px-2 py-1 text-[10px] text-white/80 opacity-0 transition-opacity duration-150 group-hover:opacity-100">
                        {t.name}
                      </span>
                    </div>
                  ))}
                </dd>
              </div>

              <div className="col-span-2 lg:col-span-1">
                <dt className="text-[11px] uppercase tracking-[0.2em] text-white/35">
                  Skills
                </dt>
                <dd className="mt-2 flex flex-wrap gap-1.5">
                  {SKILLS.map((s) => (
                    <span
                      key={s}
                      className="rounded-full border border-white/12 px-2.5 py-1 text-[11px] text-white/70"
                    >
                      {s}
                    </span>
                  ))}
                </dd>
              </div>
            </aside>

            {/* Right — scrolling story */}
            <div className="min-w-0 max-w-3xl">
              <h2 className="font-display mb-5 text-[clamp(22px,2.8vw,32px)] text-white">
                The challenge
              </h2>
              <p className="text-[16px] leading-relaxed text-white/60">{CHALLENGE}</p>

              <h2 className="font-display mt-14 mb-5 text-[clamp(22px,2.8vw,32px)] text-white">
                What I did
              </h2>
              {WORK.map((para, i) => (
                <p key={i} className="mb-4 text-[16px] leading-relaxed text-white/60">
                  {para}
                </p>
              ))}

              <Reveal>
                <div
                  className="mt-8 max-w-2xl rounded-2xl border-l-2 border-white/25 px-6 py-6"
                  style={{ background: "var(--brand-sheen-soft)" }}
                >
                  <div className="mb-2.5 text-[11px] uppercase tracking-[0.2em] text-white/40">
                    ▪ How AI helped
                  </div>
                  <p className="text-[15px] leading-relaxed text-white/70">{AI_NOTE}</p>
                </div>
              </Reveal>

              {SALES.map((sale) => (
                <div key={sale.name}>
                  <h3 className="font-display mt-14 mb-6 text-[clamp(18px,2.2vw,24px)] text-white/85">
                    {sale.name}
                  </h3>
                  <div className="space-y-6">
                    {sale.images.map((img) => (
                      <Reveal key={img.src}>
                        <ImageBlock src={img.src} caption={img.caption} ratio={img.ratio} />
                      </Reveal>
                    ))}
                  </div>
                </div>
              ))}

              {/* More work — not yet broken out by sale; hover to jump to the full case study */}
              <Reveal>
                <a
                  href={BEHANCE_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="group relative mt-14 block"
                  aria-label="View the full project on Behance"
                >
                  <h3 className="font-display mb-6 text-[clamp(18px,2.2vw,24px)] text-white/85">
                    More from the project
                  </h3>
                  <div className="grid grid-cols-2 gap-4 transition-[filter] duration-300 ease-out group-hover:blur-sm">
                    {MORE_WORK.map((img) => (
                      <ImageBlock key={img.src} src={img.src} caption={img.caption} ratio={img.ratio} />
                    ))}
                  </div>

                  <div className="pointer-events-none absolute inset-x-0 top-[76px] bottom-0 flex items-center justify-center opacity-0 transition-opacity duration-300 ease-out group-hover:opacity-100">
                    <span className="translate-y-2 rounded-full border-2 border-white/15 px-6 py-3.5 text-[16px] font-medium text-white/90 shadow-[0_20px_28px_-14px_rgba(0,0,0,0.55)] transition-transform duration-300 ease-out group-hover:translate-y-0" style={{ background: "var(--brand-sheen)" }}>
                      View full project →
                    </span>
                  </div>
                </a>
              </Reveal>

              <h2 className="font-display mt-14 mb-5 text-[clamp(22px,2.8vw,32px)] text-white">
                The outcome
              </h2>
              <p className="text-[16px] leading-relaxed text-white/60">{OUTCOME}</p>

              <h2 className="font-display mt-14 mb-5 text-[clamp(22px,2.8vw,32px)] text-white">
                What I learned
              </h2>
              <p className="mb-4 text-[16px] leading-relaxed text-white/60">{LEARNED}</p>
            </div>
          </div>
        </div>

        <FooterBlob label="Check out Other Projects !" href={`/projects/${next.slug}`} />

        <div className="pb-16 text-center">
          <Link href="/projects" className="text-sm text-white/40 hover:text-white/70">
            ← All projects
          </Link>
        </div>
      </div>
    </article>
  );
}
