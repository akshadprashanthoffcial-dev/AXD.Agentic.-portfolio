// ============================================================
// Bespoke case study — Smart Templates (Joveo).
// Hero + problem/idea beats, a "why it's called smart" panel,
// then a sticky domain picker over five re-skinned templates,
// ending on the site's standard blob footer like every other
// project page.
// ============================================================

import type { CSSProperties } from "react";
import type { Metadata } from "next";
import { getProject } from "@/data/projects";
import BlurReveal from "@/components/ui/BlurReveal";
import Reveal from "@/components/ui/Reveal";
import FooterBlob from "@/components/FooterBlob";
import ScrollProgress from "@/components/effects/ScrollProgress";
import DomainShowcase from "./DomainShowcase";

const P = getProject("smart-templates")!;

export const metadata: Metadata = {
  title: `${P.title} - ${P.client}`,
  description: P.summary,
};

const PILLARS = [
  {
    title: "One skeleton, five skins",
    body: "Every template runs the same block order, hero, why us, roles, people, proof, close. Only the treatment changes, so the CMS never had to learn five different structures.",
  },
  {
    title: "Colour does the work",
    body: "Each domain gets one lead colour, one support, one paper. Three decisions per template is what keeps the set feeling related instead of random.",
  },
  {
    title: "Built where it ships",
    body: "Designed directly in our own CMS, not in a design file. If a block couldn't be built by the client, it didn't make it into the template.",
  },
];

const STATS = [
  { value: "2–3 days → minutes", label: "Time to a live career site" },
  { value: "5", label: "Industries covered end to end" },
  { value: "Shipped", label: "Live in the product, used by clients" },
];

const KB_ITEMS = [
  { label: "Brand colours", color: "var(--brand-orange)" },
  { label: "Logo & type", color: "var(--brand-purple)" },
  { label: "Copy & tone", color: "var(--brand-red)" },
  { label: "Photography", color: "var(--brand-orange)" },
  { label: "Live job feed", color: "var(--brand-purple)" },
];

export default function SmartTemplatesPage() {
  return (
    <article>
      <ScrollProgress />
      <div className="px-5 pt-32">
        <div className="mx-auto max-w-5xl">
          {/* ---------------- Hero ---------------- */}
          <header className="mb-16">
            <div className="mb-6 flex items-center gap-3 text-[13px] tracking-[0.14em] text-white/45 uppercase">
              <span className="h-2 w-2 rounded-full" style={{ background: "var(--brand-gradient)" }} />
              Joveo · self-serve CMS · {P.year}
            </div>
            <BlurReveal
              as="h1"
              text="Smart templates"
              className="font-display max-w-3xl text-[clamp(40px,8vw,88px)] leading-[0.98] text-white"
              immediate
            />
            <p className="mt-6 max-w-2xl text-[18px] leading-relaxed text-white/72 sm:text-[20px]">
              {P.summary}
            </p>
            <div className="mt-5 flex flex-wrap gap-2.5">
              {["Visual design", "5 domains", "2–3 days each", "Live in product"].map((chip) => (
                <span
                  key={chip}
                  className="rounded-full border border-white/12 px-4 py-2 text-[14px] text-white/72"
                  style={{ background: "var(--brand-sheen)" }}
                >
                  {chip}
                </span>
              ))}
            </div>
          </header>

          {/* ---------------- Problem / idea ---------------- */}
          <div className="mb-24 grid grid-cols-1 gap-12 sm:grid-cols-2 sm:gap-14">
            <Reveal>
              <div className="mb-5 text-[13px] tracking-[0.14em] text-white/35 uppercase">
                The problem
              </div>
              <p className="font-display text-[26px] leading-tight text-white/90 sm:text-[28px]">
                The blank canvas was the bottleneck, not the tooling.
              </p>
              <p className="mt-5 text-[16px] leading-relaxed text-white/70 sm:text-[17px]">
                Joveo&apos;s CMS is self-serve. Clients build their own career sites, and most of
                them have never opened a design file. They had every block they needed and no idea
                where to put it.
              </p>
            </Reveal>
            <Reveal delay={90}>
              <div className="mb-5 text-[13px] tracking-[0.14em] text-white/35 uppercase">
                The idea
              </div>
              <p className="font-display text-[26px] leading-tight text-white/90 sm:text-[28px]">
                So I designed the starting point instead.
              </p>
              <p className="mt-5 text-[16px] leading-relaxed text-white/70 sm:text-[17px]">
                Five cohesive, industry-specific sites that already look like a designer made them,
                because one did. The user starts at eighty percent and spends their time on the
                twenty that&apos;s actually theirs.
              </p>
            </Reveal>
          </div>

          {/* ---------------- Why it's called smart ---------------- */}
          <section className="mb-28">
            <h2 className="font-display mb-3 text-[clamp(28px,4vw,44px)] text-white">
              Why it&apos;s called smart
            </h2>
            <p className="mb-9 max-w-xl text-[16px] leading-relaxed text-white/65 sm:text-[17px]">
              A template is a layout. This one arrives already knowing who you are, by the time a
              user picks it, their knowledge base is uploaded, so brand, copy, imagery and live job
              data pour straight in.
            </p>

            <Reveal>
              <div
                className="grid grid-cols-1 items-center gap-8 rounded-[28px] border border-white/10 p-7 sm:p-9 lg:grid-cols-[1fr_auto_1fr]"
                style={{ background: "var(--brand-sheen-soft)" }}
              >
                <div className="flex flex-col gap-2.5">
                  <div className="mb-1 text-[12px] tracking-[0.14em] text-white/35 uppercase">
                    Knowledge base
                  </div>
                  {KB_ITEMS.map((item) => (
                    <div
                      key={item.label}
                      className="kb-pulse flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.04] px-4 py-3 text-[15px] text-white/72"
                    >
                      <span className="h-2.5 w-2.5 rounded-[3px]" style={{ background: item.color }} />
                      {item.label}
                    </div>
                  ))}
                </div>

                <div className="flex flex-row items-center gap-2.5 lg:flex-col lg:gap-2.5">
                  <div
                    className="dot-run h-px w-full lg:h-[90px] lg:w-px"
                    style={{
                      background:
                        "repeating-linear-gradient(90deg, rgba(255,255,255,0.55) 0, rgba(255,255,255,0.55) 2px, transparent 2px, transparent 12px)",
                    }}
                  />
                  <div className="shrink-0 text-[11px] tracking-[0.14em] text-white/30 uppercase">
                    fills
                  </div>
                </div>

                <div className="relative flex flex-col gap-2.5 overflow-hidden rounded-[18px] border border-white/10 bg-[#0a0a0a] p-3.5">
                  <div
                    className="scan-pass pointer-events-none absolute inset-x-0 h-16"
                    style={{ background: "linear-gradient(180deg, transparent, rgba(255,255,255,0.08), transparent)" }}
                  />
                  <div className="flex items-center gap-2">
                    <div
                      className="block-fill h-5 w-5 rounded-[6px]"
                      style={{ "--fillTo": "var(--brand-purple)" } as CSSProperties}
                    />
                    <div className="line-fill h-2 rounded-full bg-white/55" style={{ "--lineW": "40%" } as CSSProperties} />
                  </div>
                  <div className="block-fill h-[86px] rounded-xl" style={{ "--fillTo": "var(--brand-orange)" } as CSSProperties} />
                  <div className="line-fill h-2 rounded-full bg-white/45" style={{ "--lineW": "80%" } as CSSProperties} />
                  <div className="line-fill h-2 rounded-full bg-white/25" style={{ "--lineW": "50%" } as CSSProperties} />
                  <div className="mt-1 grid grid-cols-3 gap-2">
                    <div className="block-fill h-11 rounded-[10px]" style={{ "--fillTo": "rgba(245,155,0,0.5)" } as CSSProperties} />
                    <div className="block-fill h-11 rounded-[10px]" style={{ "--fillTo": "rgba(161,31,242,0.5)", animationDelay: "0.4s" } as CSSProperties} />
                    <div className="block-fill h-11 rounded-[10px]" style={{ "--fillTo": "rgba(239,60,63,0.5)", animationDelay: "0.8s" } as CSSProperties} />
                  </div>
                </div>
              </div>
            </Reveal>
          </section>

          {/* ---------------- Domain picker + templates ---------------- */}
          <DomainShowcase />

          {/* ---------------- What held it together ---------------- */}
          <section className="mt-28 mb-24">
            <h2 className="font-display mb-9 text-[clamp(28px,4vw,44px)] text-white">
              What held it together
            </h2>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
              {PILLARS.map((p) => (
                <Reveal key={p.title}>
                  <div
                    className="h-full rounded-[22px] border border-white/10 p-7 transition-transform duration-300 ease-out hover:-translate-y-1 hover:border-white/25"
                    style={{ background: "var(--brand-sheen-soft)" }}
                  >
                    <div className="font-display mb-2.5 text-[20px] text-white">{p.title}</div>
                    <p className="text-[15px] leading-relaxed text-white/60">{p.body}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </section>

          {/* ---------------- Role, outcome, stats ---------------- */}
          <section className="mb-8">
            <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 sm:gap-14">
              <Reveal>
                <div className="mb-5 text-[13px] tracking-[0.14em] text-white/35 uppercase">
                  Role & timeline
                </div>
                <p className="text-[16px] leading-relaxed text-white/72 sm:text-[17px]">
                  Visual designer. Two to three days per domain, designed and built inside our CMS,
                  then packaged as a template and released into the product.
                </p>
              </Reveal>
              <Reveal delay={90}>
                <div className="mb-5 text-[13px] tracking-[0.14em] text-white/35 uppercase">
                  Where it landed
                </div>
                <p className="text-[16px] leading-relaxed text-white/72 sm:text-[17px]">
                  One of the biggest upgrades to the self-serve CMS. Multiple clients are live on
                  it, and{" "}
                  <strong
                    className="rounded-md border-b border-white/28 px-1.5 py-0.5 font-medium text-white/90"
                    style={{ background: "var(--brand-sheen)" }}
                  >
                    a build that used to take two or three days now closes in minutes.
                  </strong>
                </p>
              </Reveal>
            </div>

            <div className="mt-11 grid grid-cols-1 gap-5 sm:grid-cols-3">
              {STATS.map((s) => (
                <Reveal key={s.label}>
                  <div
                    className="rounded-[22px] border border-white/10 p-7"
                    style={{ background: "var(--brand-sheen)" }}
                  >
                    <div
                      className="font-display text-[clamp(30px,4vw,46px)] leading-none tracking-tight"
                      style={{
                        background: "var(--brand-gradient)",
                        WebkitBackgroundClip: "text",
                        backgroundClip: "text",
                        color: "transparent",
                      }}
                    >
                      {s.value}
                    </div>
                    <div className="mt-2.5 text-[14px] text-white/60">{s.label}</div>
                  </div>
                </Reveal>
              ))}
            </div>
          </section>
        </div>

        <FooterBlob label="Check out other Projects !" href="/projects" />
      </div>
    </article>
  );
}
