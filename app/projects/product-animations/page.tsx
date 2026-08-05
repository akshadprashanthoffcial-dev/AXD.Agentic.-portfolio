// ============================================================
// Bespoke case study - Joveo Product Animations.
// Imported from a Claude Design (`Product Animations.dc.html`):
// a hero + masonry grid of product reels, each either a real
// exported clip or a "drop the file here" placeholder. Clips
// render at their own natural aspect ratio (plain <img>/<video>,
// no forced container) so nothing is cropped or letterboxed,
// packed via CSS columns. Just fill in `src` below as clips land.
// ============================================================

import type { Metadata } from "next";
import Link from "next/link";
import { PROJECTS, getProject } from "@/data/projects";
import BlurReveal from "@/components/ui/BlurReveal";
import FooterBlob from "@/components/FooterBlob";
import ScrollFX from "@/components/effects/ScrollFX";
import { CATEGORY_ICONS } from "@/components/ui/Icons";
import { AfterEffectsLogo, ClaudeLogo, FigmaLogo } from "@/components/ui/ToolLogos";

const P = getProject("product-animations")!;

export const metadata: Metadata = {
  title: `${P.fullTitle} - ${P.client}`,
  description: P.summary,
};

type ProductReel = {
  title: string;
  desc: string;
  /** Exported GIF/MP4 in public/projects/product-animations/. Empty until shipped. */
  src?: string;
};

const PRODUCTS: ProductReel[] = [
  {
    title: "Talent CRM",
    src: "/projects/product-animations/talent-crm-campaign-creation.gif",
    desc: "Creating a personalised AI hiring campaign, targeting the right candidates automatically.",
  },
  {
    title: "Talent CRM, campaign analytics",
    src: "/projects/product-animations/talent-crm-analytics.gif",
    desc: "Live analytics for the AI campaign, tracking reach and pipeline movement at a glance.",
  },
  {
    title: "Staffing Advisor, analytics",
    src: "/projects/product-animations/staffing-advisor-analytics.gif",
    desc: "Guided analytics that help staffing teams plan roles and budgets, and see where to spend to hit their targets.",
  },
  {
    title: "Staffing Advisor, health distribution",
    src: "/projects/product-animations/staffing-advisor-health-distribution.gif",
    desc: "A breakdown of pipeline health across open roles, surfacing where attention is needed.",
  },
  {
    title: "Staffing Advisor, recruiter bandwidth",
    src: "/projects/product-animations/staffing-advisor-recruiter-bandwidth.gif",
    desc: "Recruiter workload at a glance, so headcount and requisitions stay balanced.",
  },
  {
    title: "Programmatic",
    src: "/projects/product-animations/programmatic-campaign.gif",
    desc: "Automated job advertising that places openings across channels and optimises spend toward the best-performing sources.",
  },
  {
    title: "Programmatic, market & competitive insights",
    src: "/projects/product-animations/programmatic-market-competitive.gif",
    desc: "Market and competitive insight that informs where the next ad dollar should go.",
  },
  {
    title: "AI Messaging",
    src: "/projects/product-animations/ai-messaging.gif",
    desc: "Personalised, automated candidate messaging that keeps applicants engaged without manual follow-up.",
  },
  {
    title: "AI Interviewer",
    src: "/projects/product-animations/ai-interviewer.gif",
    desc: "An AI-led screening conversation that qualifies candidates and hands recruiters a ready shortlist.",
  },
  {
    title: "Chatbot, hiring flow",
    src: "/projects/product-animations/chatbot-hiring-flow.gif",
    desc: "How the chatbot works end-to-end, from a candidate's first question to a captured application.",
  },
  {
    title: "Chatbot, setup",
    src: "/projects/product-animations/chatbot-setup.gif",
    desc: "Setting up the chatbot in a few steps, connect a knowledge source and it's ready to talk.",
  },
  {
    title: "Chatbot, features",
    src: "/projects/product-animations/chatbot-features.gif",
    desc: "Responsive across devices, multi-language support and omnichannel engagement, out of the box.",
  },
];

const TOOLS = [
  { name: "After Effects", node: <AfterEffectsLogo size={20} /> },
  { name: "Figma", node: <FigmaLogo size={20} /> },
];

export default function ProductAnimationsCaseStudy() {
  const internal = PROJECTS.filter((p) => !p.externalUrl);
  const idx = internal.findIndex((p) => p.slug === P.slug);
  const next = internal[(idx + 1) % internal.length];

  return (
    <article className="px-5 pt-32">
      <ScrollFX />
      <div className="mx-auto max-w-4xl">
        {/* ---------------- Hero ---------------- */}
        <header className="mb-14">
          <div className="mb-5 flex flex-wrap gap-2">
            {P.categories.map((c) => {
              const CatIcon = CATEGORY_ICONS[c];
              return (
                <span
                  key={c}
                  className="inline-flex items-center gap-1.5 rounded-full border border-white/15 px-3 py-1 text-[13px] text-white/70"
                  style={{ background: "var(--brand-sheen)" }}
                >
                  {CatIcon && <CatIcon size={13} />}
                  {c}
                </span>
              );
            })}
          </div>

          <BlurReveal
            as="h1"
            text={P.fullTitle!}
            className="font-display max-w-2xl text-[clamp(34px,6vw,56px)] leading-[1.05] text-white"
          />

          <dl className="mt-8 grid grid-cols-2 gap-6 border-t border-white/10 pt-6 text-sm sm:grid-cols-4">
            <Meta term="Client" value={P.client} />
            <Meta term="Role" value={P.role} />
            <Meta term="When" value={P.period} />
            <div>
              <dt className="text-white/35">Tools</dt>
              <dd className="mt-2 flex flex-wrap gap-2">
                {TOOLS.map((t) => (
                  <span
                    key={t.name}
                    className="inline-flex items-center gap-2 rounded-full border border-white/15 py-1 pl-1 pr-3 text-[13px] text-white/80"
                    style={{ background: "var(--brand-sheen)" }}
                  >
                    <span className="flex h-5 w-5 items-center justify-center overflow-hidden rounded-full">
                      {t.node}
                    </span>
                    {t.name}
                  </span>
                ))}
              </dd>
            </div>
          </dl>
        </header>

        {/* ---------------- Intro ---------------- */}
        <div className="mb-16 max-w-2xl space-y-5 text-[18px] leading-relaxed text-white/70">
          {P.intro.map((para, i) => (
            <p key={i} data-reveal>
              {para}
            </p>
          ))}
        </div>

        {/* ---------------- Reels ---------------- */}
        {/* CSS-columns masonry: each tile is only as tall as its own clip,
            no forced aspect-ratio box, so nothing gets cropped or letterboxed. */}
        <div className="columns-1 gap-8 sm:columns-2">
          {PRODUCTS.map((item, i) => (
            <section key={item.title} data-reveal className="mb-8 flex break-inside-avoid flex-col gap-4">
              {item.src ? (
                <div
                  className="overflow-hidden rounded-[22px] border border-white/10 bg-white"
                  style={{ boxShadow: "0 30px 60px -30px rgba(0,0,0,0.8)" }}
                >
                  {item.src.endsWith(".mp4") ? (
                    <video
                      src={item.src}
                      autoPlay
                      loop
                      muted
                      playsInline
                      preload={i === 0 ? "auto" : "metadata"}
                      className="block w-full"
                    />
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element -- animated GIF, needs its native dimensions and no optimizer re-encoding
                    <img
                      src={item.src}
                      alt={`${item.title} animation`}
                      loading={i === 0 ? "eager" : "lazy"}
                      decoding="async"
                      className="block w-full"
                    />
                  )}
                </div>
              ) : (
                <div
                  className="flex aspect-[4/5] w-full flex-col items-center justify-center gap-4 rounded-[22px] border border-white/10 bg-white p-6 text-center"
                  style={{ backgroundImage: "var(--brand-sheen)" }}
                >
                  <div
                    className="flex h-14 w-14 items-center justify-center rounded-full"
                    style={{ background: "var(--brand-gradient)", boxShadow: "0 12px 28px rgba(0,0,0,0.45)" }}
                  >
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 4h16v16H4z" />
                      <path d="M4 9h16M9 4v16" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-display text-[19px]" style={{ color: "rgba(0,0,0,0.85)" }}>
                      {item.title}
                    </div>
                    <div className="mt-1.5 text-[13px]" style={{ color: "rgba(0,0,0,0.5)" }}>
                      Drop the exported GIF / MP4 here
                    </div>
                  </div>
                </div>
              )}

              <div>
                <div className="flex items-baseline gap-2.5">
                  <span className="font-display text-[12px] tracking-[0.08em] text-white/35">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="font-display text-[22px] text-white">{item.title}</h3>
                </div>
                <p className="mt-2 max-w-lg text-[15px] leading-relaxed text-white/45">{item.desc}</p>
              </div>
            </section>
          ))}
        </div>

        {/* ---------------- 404 page design, a live embed ---------------- */}
        <section data-reveal className="mt-16 border-t border-white/10 pt-16">
          <div className="mb-5 flex items-center gap-2.5">
            <h3 className="font-display text-[22px] text-white">404 Page Design</h3>
            <span
              className="inline-flex items-center gap-1.5 rounded-full border border-white/15 py-1 pl-1 pr-3 text-[12px] text-white/70"
              style={{ background: "var(--brand-sheen)" }}
            >
              <span className="flex h-4 w-4 items-center justify-center overflow-hidden rounded-full">
                <ClaudeLogo size={16} />
              </span>
              Made with Claude
            </span>
          </div>
          <p className="mb-6 max-w-lg text-[15px] leading-relaxed text-white/45">
            A lost-in-space 404 for Joveo, live and interactive below, no screen recording, this is the real page running.
          </p>
          <div
            className="overflow-hidden rounded-[22px] border border-white/10"
            style={{ boxShadow: "0 30px 60px -30px rgba(0,0,0,0.8)" }}
          >
            <iframe
              src="/projects/product-animations/techcore_404_light_theme.html"
              title="Joveo 404 page design"
              className="block h-[560px] w-full"
              loading="lazy"
            />
          </div>
        </section>
      </div>

      <FooterBlob label="Check out Other Projects !" href={`/projects/${next.slug}`} />

      <div className="pb-16 text-center">
        <Link href="/projects" className="text-sm text-white/40 transition-colors hover:text-white/70">
          ← All projects
        </Link>
      </div>
    </article>
  );
}

function Meta({ term, value }: { term: string; value: string }) {
  return (
    <div>
      <dt className="text-white/35">{term}</dt>
      <dd className="mt-1 text-white/80">{value}</dd>
    </div>
  );
}
