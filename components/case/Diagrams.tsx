"use client";

// ============================================================
// Diagrams — the set-pieces of the CMS case study.
// Each one carries an argument, not decoration.
// ============================================================

import { useEffect, useState } from "react";
import { Card, Chain, Tag, useInView } from "./CaseKit";

/* ------------------------------------------------------------
   1. OrchestratorCompare — why AI doesn't generate everything.
   Two lanes side by side + the cost argument underneath.
   ------------------------------------------------------------ */

const NAIVE = [
  "Prompt",
  "AI",
  "New widget",
  "Tokens burned",
  "Human review",
  "Inconsistent",
];

const ORCHESTRATED = [
  "Prompt",
  "Understand intent",
  "Search widget library",
  "Match widget",
  "Apply branding",
  "Retrieve knowledge",
  "Generate only if needed",
];

export function OrchestratorCompare() {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Lane
        kicker="The obvious build"
        title="Generate everything"
        nodes={NAIVE}
        tone="danger"
        note="Every request becomes a new component. Cost scales with usage, and nothing is guaranteed to match anything else on the page."
      />
      <Lane
        kicker="What shipped"
        title="Retrieve, then generate"
        nodes={ORCHESTRATED}
        tone="brand"
        note="Generation is the fallback, not the default. The model's first job is to search 70+ production widgets and decide whether anything new is needed at all."
      />
    </div>
  );
}

function Lane({
  kicker,
  title,
  nodes,
  tone,
  note,
}: {
  kicker: string;
  title: string;
  nodes: string[];
  tone: "danger" | "brand";
  note: string;
}) {
  const brand = tone === "brand";
  return (
    <div
      className="relative overflow-hidden rounded-2xl border p-6 md:p-8"
      style={{
        borderColor: brand ? "rgba(255,255,255,0.15)" : "rgba(239,60,63,0.25)",
        background: brand ? "var(--brand-sheen-soft)" : "rgba(239,60,63,0.035)",
      }}
    >
      <div className="mb-1 text-[11px] uppercase tracking-[0.2em] text-white/35">
        {kicker}
      </div>
      <h3 className="font-display mb-6 text-[22px] text-white">{title}</h3>

      {/* Lanes read top-to-bottom at every breakpoint — they sit side by
          side and are meant to be compared step against step. */}
      <Chain nodes={nodes} tone={tone} dense vertical />

      <p className="mt-6 text-[14px] leading-relaxed text-white/50">{note}</p>
    </div>
  );
}

/** The token-economics bar: what "reuse first" actually buys. */
export function TokenEconomics() {
  const { ref } = useInView<HTMLDivElement>("-8%");

  const rows = [
    { label: "Library match — zero generation", pct: 100, tone: "brand" },
    { label: "Library match + AI-written copy", pct: 34, tone: "brand" },
    { label: "Full component generation", pct: 8, tone: "danger" },
  ];

  return (
    <div ref={ref} className="chain mt-10 rounded-2xl border border-white/10 p-6 md:p-8">
      <div className="mb-1 text-[11px] uppercase tracking-[0.2em] text-white/35">
        Cost model
      </div>
      <h3 className="font-display mb-6 text-[20px] text-white">
        Where a request is allowed to land
      </h3>
      <p className="mb-6 max-w-2xl text-[14px] leading-relaxed text-white/50">
        Every request is routed to the cheapest tier that can still answer
        it — a plain library match, a library match with AI-written copy,
        or, only when nothing fits, full generation. Each row below is a
        landing tier, and the bar is how often real requests should settle
        there.
      </p>

      <div className="space-y-5">
        {rows.map((r, i) => (
          <div key={r.label}>
            <div className="mb-2 flex items-baseline justify-between gap-4 text-[13px]">
              <span className="text-white/65">{r.label}</span>
              <span className="text-white/30">{r.pct}% of requests</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-white/[0.06]">
              <div
                className="chain-node h-full rounded-full"
                style={{
                  width: `${r.pct}%`,
                  transitionDelay: `${i * 140}ms`,
                  background:
                    r.tone === "brand"
                      ? "linear-gradient(90deg, var(--brand-orange), var(--brand-purple))"
                      : "rgba(239,60,63,0.7)",
                }}
              />
            </div>
          </div>
        ))}
      </div>

      <p className="mt-6 text-[14px] leading-relaxed text-white/45">
        Targets, not measurements — the routing policy the prototype encodes.
        Pushing the common case down to a library lookup is what makes the
        feature affordable to run at enterprise volume.
      </p>
    </div>
  );
}

/* ------------------------------------------------------------
   2. TierExplorer — progressive disclosure, made clickable.
   ------------------------------------------------------------ */

const TIERS = [
  {
    id: "beginner",
    label: "Beginner",
    who: "A recruiter marketer who has never built a page.",
    surfaces: ["Plans", "Templates", "AI prompt"],
    hidden: ["Widget internals", "Style controls", "Element overrides"],
    line: "Answers one question — what is this site for — and gets a full draft.",
  },
  {
    id: "intermediate",
    label: "Intermediate",
    who: "An employer-brand owner with opinions about structure.",
    surfaces: ["Widget library", "Recommendations", "Section reordering"],
    hidden: ["Per-element styling", "Component editing"],
    line: "Swaps the recommended widget for the one they actually wanted.",
  },
  {
    id: "advanced",
    label: "Advanced",
    who: "An in-house designer or agency partner.",
    surfaces: ["Widget editor", "Manual styling", "Element overrides", "SEO"],
    hidden: [],
    line: "Drops into any element and overrides it, without leaving the canvas.",
  },
];

export function TierExplorer() {
  const [active, setActive] = useState(0);
  const t = TIERS[active];

  return (
    <div className="rounded-2xl border border-white/10 p-6 md:p-8">
      <div
        role="tablist"
        aria-label="Expertise tiers"
        className="mb-8 flex flex-wrap gap-2"
      >
        {TIERS.map((tier, i) => (
          <button
            key={tier.id}
            role="tab"
            aria-selected={i === active}
            onClick={() => setActive(i)}
            className={`rounded-full border px-4 py-2 text-[13px] transition-colors duration-300 ${
              i === active
                ? "border-white/25 text-white"
                : "border-white/10 text-white/45 hover:border-white/20 hover:text-white/70"
            }`}
            style={i === active ? { background: "var(--brand-sheen)" } : undefined}
          >
            {tier.label}
          </button>
        ))}
      </div>

      <div key={t.id} className="tier-panel grid gap-8 md:grid-cols-[1.1fr_1fr]">
        <div>
          <p className="font-display text-[clamp(20px,3vw,28px)] leading-snug text-white">
            {t.line}
          </p>
          <p className="mt-4 text-[14px] text-white/45">{t.who}</p>
        </div>

        <div className="space-y-6">
          <div>
            <Tag tone="impact">Exposed</Tag>
            <div className="flex flex-wrap gap-2">
              {t.surfaces.map((s) => (
                <span
                  key={s}
                  className="rounded-full border border-white/15 px-3 py-1.5 text-[12px] text-white/75"
                  style={{ background: "var(--brand-sheen)" }}
                >
                  {s}
                </span>
              ))}
            </div>
          </div>

          <div>
            <Tag>Still hidden</Tag>
            {t.hidden.length === 0 ? (
              <p className="text-[13px] text-white/35">
                Nothing — the full surface is available at this tier.
              </p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {t.hidden.map((s) => (
                  <span
                    key={s}
                    className="rounded-full border border-dashed border-white/12 px-3 py-1.5 text-[12px] text-white/30"
                  >
                    {s}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <p className="mt-8 border-t border-white/10 pt-6 text-[14px] text-white/45">
        Same product, same data model. The only thing that changes is how much
        of it the interface admits to.
      </p>
    </div>
  );
}

/* ------------------------------------------------------------
   3. BeforeAfter — the summary table.
   ------------------------------------------------------------ */

const ROWS: [string, string][] = [
  ["Engineering dependent", "Self-serve"],
  ["Manual ticket flow", "Guided AI workflow"],
  ["Static CMS", "Agentic workspace"],
  ["Weeks", "Minutes"],
  ["Technical", "Marketing friendly"],
  ["Separate tools", "Unified experience"],
];

export function BeforeAfter() {
  const { ref } = useInView<HTMLDivElement>("-10%");

  return (
    <div ref={ref} className="ba">
      <div className="mb-10 grid gap-6 md:grid-cols-2">
        <div>
          <Tag tone="problem">Old — service model</Tag>
          <Chain
            nodes={["Service", "Request", "Wait", "Approve", "Repeat"]}
            tone="danger"
            dense
          />
        </div>
        <div>
          <Tag tone="impact">New — product model</Tag>
          <Chain
            nodes={["Self-serve", "Plan", "Generate", "Edit", "Publish"]}
            tone="brand"
            dense
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-white/10">
        <div className="grid grid-cols-2 border-b border-white/10 text-[11px] uppercase tracking-[0.2em]">
          <div className="px-5 py-3 text-white/30 md:px-7">Before</div>
          <div className="px-5 py-3 text-brand md:px-7">After</div>
        </div>
        {ROWS.map(([before, after], i) => (
          <div
            key={before}
            className="ba-row grid grid-cols-2 border-b border-white/[0.06] text-[14px] last:border-b-0 md:text-[15px]"
            style={{ transitionDelay: `${i * 70}ms` }}
          >
            <div className="px-5 py-4 text-white/40 line-through decoration-white/15 md:px-7 md:py-5">
              {before}
            </div>
            <div className="px-5 py-4 text-white/85 md:px-7 md:py-5">{after}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------
   4. UserGap — section 2. What we asked of people vs what they had.
   ------------------------------------------------------------ */

export function UserGap() {
  const demanded = [
    "Widgets",
    "Layouts",
    "Spacing",
    "Responsive rules",
    "Branding",
    "Publishing",
  ];
  const had = [
    "No HTML",
    "No CSS",
    "No design training",
    "No IA training",
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <Tag tone="problem">Who was actually using it</Tag>
        <p className="mb-6 text-[15px] leading-relaxed text-white/60">
          Marketing and talent-brand teams — the people accountable for
          applications, not for markup.
        </p>
        <ul className="space-y-2.5">
          {had.map((h) => (
            <li
              key={h}
              className="flex items-center gap-3 text-[14px] text-white/45"
            >
              <span className="h-1 w-1 shrink-0 rounded-full bg-[#ef3c3f]" />
              {h}
            </li>
          ))}
        </ul>
      </Card>

      <Card>
        <Tag tone="solution">What the old CMS demanded first</Tag>
        <p className="mb-6 text-[15px] leading-relaxed text-white/60">
          The interface exposed its implementation. Every one of these had to be
          understood before the real goal was reachable.
        </p>
        <div className="flex flex-wrap gap-2">
          {demanded.map((d) => (
            <span
              key={d}
              className="rounded-lg border border-white/12 px-3 py-1.5 text-[13px] text-white/55"
            >
              {d}
            </span>
          ))}
        </div>
      </Card>

      <div className="md:col-span-2">
        <div
          className="rounded-2xl border border-white/15 px-6 py-8 text-center md:px-10 md:py-10"
          style={{ background: "var(--brand-sheen-soft)" }}
        >
          <div className="mb-3 text-[11px] uppercase tracking-[0.22em] text-white/35">
            The actual goal
          </div>
          <p className="font-display text-[clamp(22px,3.6vw,34px)] leading-snug text-white">
            Build a careers website that gets applications.
          </p>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------
   5. CaseProgress — reading progress + section rail.
   ------------------------------------------------------------ */

export function CaseProgress({
  sections,
}: {
  sections: { id: string; label: string }[];
}) {
  const [pct, setPct] = useState(0);
  const [active, setActive] = useState(sections[0]?.id ?? "");

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const max = document.body.scrollHeight - window.innerHeight;
        setPct(max > 0 ? Math.min(1, window.scrollY / max) : 0);

        // Active section = the last one whose top has passed 40% of viewport.
        const line = window.innerHeight * 0.4;
        let current = sections[0]?.id ?? "";
        for (const s of sections) {
          const el = document.getElementById(s.id);
          if (el && el.getBoundingClientRect().top <= line) current = s.id;
        }
        setActive(current);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [sections]);

  return (
    <>
      <div
        className="case-progress"
        style={{ transform: `scaleX(${pct})` }}
        aria-hidden
      />

      <nav
        aria-label="Case study sections"
        className="fixed right-6 top-1/2 z-40 hidden -translate-y-1/2 flex-col gap-3 xl:flex"
      >
        {sections.map((s) => {
          const on = s.id === active;
          return (
            <a
              key={s.id}
              href={`#${s.id}`}
              className="group flex items-center justify-end gap-3"
            >
              <span
                className={`text-[11px] uppercase tracking-[0.16em] transition-all duration-300 ${
                  on
                    ? "text-white/70"
                    : "text-white/0 group-hover:text-white/40"
                }`}
              >
                {s.label}
              </span>
              <span
                className="h-1.5 rounded-full transition-all duration-300"
                style={{
                  width: on ? 22 : 6,
                  background: on
                    ? "linear-gradient(90deg, var(--brand-orange), var(--brand-purple))"
                    : "rgba(255,255,255,0.22)",
                }}
              />
            </a>
          );
        })}
      </nav>
    </>
  );
}
