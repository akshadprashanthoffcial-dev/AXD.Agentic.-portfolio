// ============================================================
// Bespoke case study — the Joveo CMS revamp.
// This route deliberately shadows the generic /projects/[slug]
// gallery template: the argument here is a product document, not
// a screen dump, so it gets purpose-built diagrams and copy.
// ============================================================

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getProject } from "@/data/projects";
import FooterBlob from "@/components/FooterBlob";
import Reveal from "@/components/ui/Reveal";
import BlurReveal from "@/components/ui/BlurReveal";
import CTA from "@/components/ui/CTA";
import ScreenFrame from "@/components/case/ScreenFrame";
import FeatureBlock, { type Feature } from "@/components/case/FeatureBlock";
import { FeatureRail } from "@/components/case/FeatureRail";
import LiveDemo from "@/components/case/LiveDemo";
import {
  Card,
  Chain,
  LoopBack,
  Metric,
  Section,
  SectionHead,
  Tag,
} from "@/components/case/CaseKit";
import {
  BeforeAfter,
  CaseProgress,
  OrchestratorCompare,
  TierExplorer,
  TokenEconomics,
  UserGap,
} from "@/components/case/Diagrams";

const P = getProject("cms-editor-revamp")!;

export const metadata: Metadata = {
  title: `${P.fullTitle} — Joveo`,
  description: P.summary,
};

const SECTIONS = [
  { id: "old-workflow", label: "The old workflow" },
  { id: "users", label: "The real problem" },
  { id: "principles", label: "Principles" },
  { id: "strategy", label: "Strategy" },
  { id: "orchestration", label: "AI as orchestrator" },
  { id: "product", label: "The product" },
  { id: "confidence", label: "Confidence" },
  { id: "disclosure", label: "Disclosure" },
  { id: "results", label: "Before / after" },
  { id: "reflections", label: "Reflections" },
];

const OLD_FLOW = [
  "Client",
  "POC",
  "Jira ticket",
  "Implementation",
  "Designer",
  "Frontend eng",
  "Client review",
  "Feedback",
  "Publish",
];

const NEW_FLOW = [
  "Brand",
  "Knowledge",
  "Goal",
  "AI planning",
  "Page structure",
  "Widget suggestions",
  "Editing",
  "Publish",
];

const PRINCIPLES = [
  {
    t: "AI should guide, not replace.",
    d: "The user stays the decision-maker at every step. The model proposes; a human accepts.",
  },
  {
    t: "Reuse before generate.",
    d: "Generation runs only when nothing in the existing widget library can answer the request.",
  },
  {
    t: "Context before prompting.",
    d: "Branding and knowledge base are collected first, because they're what make the output usable.",
  },
  {
    t: "Planning before pixels.",
    d: "Information architecture gets validated while it's still cheap to change — as text, not layout.",
  },
  {
    t: "Progressive disclosure.",
    d: "Complexity is revealed only when the user's task actually requires it.",
  },
  {
    t: "Consistency over creativity.",
    d: "A design system enforcing sameness is what makes generated pages trustworthy at enterprise scale.",
  },
];

const FEATURES: Feature[] = [
  {
    n: "01",
    name: "Brand Studio",
    problem: "Every AI generation looked different from the last one.",
    solution:
      "Typography, colour, spacing, radius and logo are defined before anything is generated — as a brand object the whole system reads from.",
    impact:
      "Every generated page follows the employer's design language from the first render, with no cleanup pass.",
    build:
      "Widgets consume only --brand-* CSS vars set by a BrandScope wrapper, so re-skinning an entire site is a single object swap, never a re-render of content.",
    shot: {
      src: "/projects/cms-editor/02-brand-studio.png",
      alt: "Brand Studio — brand tokens with a live wireframe preview",
      ratio: 1396 / 806,
      caption:
        "Brand Studio: tokens on the left, a live wireframe on the right. You approve the system, not a screenshot of it.",
    },
  },
  {
    n: "02",
    name: "Knowledge Base",
    problem:
      "The model knew how to write a careers page, but nothing about this employer.",
    solution:
      "Connect websites, PDFs and internal documents once, at project setup, and scope them to the project.",
    impact:
      "Generated copy reflects the actual employer brand instead of hallucinating a generic one.",
    shot: {
      src: "/projects/cms-editor/04-knowledge-select.png",
      alt: "Knowledge base selection during project setup",
      ratio: 545 / 526,
      narrow: true,
      caption: "Knowledge base is a setup-time decision, not a prompt-time one.",
    },
  },
  {
    n: "03",
    name: "AI Planning",
    problem: "Users don't think in widgets. They think in outcomes.",
    solution:
      "The model returns an editable page plan — sections in plain language — before any UI is rendered.",
    impact:
      "Structure gets validated in seconds, while changing it still costs a line of text rather than a layout rebuild.",
    build:
      "Planning is a cheap text-only call. Nothing renders until the plan is accepted — the expensive work is gated behind a human yes.",
    shot: {
      src: "/projects/cms-editor/07-planning.png",
      alt: "AI planning output — the page plan in plain language",
      ratio: 1196 / 698,
      caption:
        "The plan is the contract. Everything downstream is an execution of it.",
    },
  },
  {
    n: "04",
    name: "Sitemap",
    problem:
      "Enterprise career sites run to 50+ pages. Traditional CMS trees collapse under that.",
    solution:
      "A pannable planning canvas with nested pages, branch connectors, and hover-level actions instead of a nested folder list.",
    impact:
      "Navigation scales to a real enterprise site without the cognitive load of a file tree.",
    shot: {
      src: "/projects/cms-editor/08-sitemap.png",
      alt: "Sitemap — the career site as a pannable planning canvas",
      ratio: 1392 / 801,
      caption:
        "Pages carry parent relationships and SEO, so the sitemap is the data model — not a diagram of it.",
    },
  },
  {
    n: "05",
    name: "Design Agent",
    problem: "Users shouldn't have to leave the canvas to ask for a change.",
    solution:
      "A context-aware agent that holds the whole site in scope while editing at section level.",
    impact:
      "Precise edits land without regenerating the page around them.",
    build:
      "Plain-language commands parse to typed operations (set text, swap widget, shorten, lengthen) applied to widget state — the same parser backs both the canvas bar and the widget editor chat.",
    shot: {
      src: "/projects/cms-editor/13-design-canvas.png",
      alt: "Design canvas with the agent panel and live brand-skinned preview",
      ratio: 1401 / 805,
      caption:
        "Left: pages, design system, global sections. Centre: the real page. Right: the agent.",
    },
  },
  {
    n: "06",
    name: "Widget Library",
    problem: "Years of existing widget work sat unused while AI rebuilt it.",
    solution:
      "The library lives inside the agent conversation. Recommendations are scored on section type, industry fit, brand-style overlap and usage — and the reasons are shown.",
    impact:
      "Lower token usage, faster results, and consistency that holds across every page of the site.",
    build:
      "A deterministic scorer over 70+ production widgets. Its reason strings become the badges on each card — 'Popular in Healthcare', 'Fits your bold brand'. Confidence is a visible feature, not a hidden score.",
    shot: {
      src: "/projects/cms-editor/14-design-agent.png",
      alt: "Agent panel with scored widget suggestions inline",
      ratio: 396 / 714,
      narrow: true,
      caption:
        "Suggestions arrive in the conversation, each carrying the reason it was picked.",
    },
  },
  {
    n: "07",
    name: "Widget Editor",
    problem: "No AI surface covers every customisation a client will ask for.",
    solution:
      "Conventional direct-manipulation editing stays fully available — per-element text, style and visibility overrides.",
    impact:
      "The ceiling never drops. Advanced users are not forced back through a prompt.",
    build:
      "Every widget primitive emits deterministic element keys ('heading-0', 'button-1'), so an override renders identically in the editor, the canvas and the published site. History is a past/present/future stack.",
    shot: {
      src: "/projects/cms-editor/17-widget-editor.png",
      alt: "Widget editor with per-element overrides",
      ratio: 882 / 648,
      caption:
        "Select any element, override it, undo it. The AI and the inspector write to the same state.",
    },
  },
  {
    n: "08",
    name: "Application Form Builder",
    problem:
      "Form schemas were configured in a different tool from the page they appeared on.",
    solution:
      "The application form becomes a visual building block inside the page itself — editable by the agent and by manual field controls at the same time.",
    impact:
      "The highest-stakes conversion surface on a careers site is designed in context, where its performance is actually decided.",
    build:
      "Field lists are widget settings like any other, so the agent's parser and the inspector's form controls mutate one schema. Neither path is privileged.",
    shot: {
      src: "/projects/cms-editor/19-application-form-1.png",
      alt: "Application form builder — field list with type and required controls",
      ratio: 1586 / 1052,
      caption:
        "Every field is a row with a type and an optional/required toggle — the same list the page renders from.",
    },
  },
];

const REFLECTIONS = [
  {
    t: "Designing AI is mostly designing constraints.",
    d: "The hard problem was never getting a model to generate a layout. It was deciding when it shouldn't — and building the routing that enforces that decision.",
  },
  {
    t: "Existing systems are an asset, not debt.",
    d: "The widget library represented years of design and engineering investment. The right move was to make AI the fastest possible way to reach it.",
  },
  {
    t: "Enterprise trust comes from predictability.",
    d: "Brand systems, plan review, live previews and human approval create the confidence that a pure conversational interface can't offer a team with a legal department.",
  },
  {
    t: "Good AI products mix conversation with direct manipulation.",
    d: "Users switch between prompting and clicking based on the task, sometimes within one edit. The product has to make that switch free.",
  },
];

const CLOSING_TAKEAWAYS = [
  "Fewer teams between a request and a published page — not a nicer editor.",
  "AI's job: make existing work reachable, not replace it.",
  "Every shortcut for a beginner must stay inspectable by an expert.",
  "Design the constraint before the interface.",
];

export default function CmsCaseStudy() {
  return (
    <>
      <CaseProgress sections={SECTIONS} />

      {P.banner && (
        <div className="relative -mt-[1px] h-[70vh] max-h-[760px] min-h-[460px] w-full overflow-hidden bg-black">
          <Image
            src={P.banner}
            alt={`${P.fullTitle ?? P.title} — cover`}
            fill
            priority
            sizes="100vw"
            className="object-contain object-center"
          />
        </div>
      )}

      <article className={`px-5 ${P.banner ? "pt-16" : "pt-32"}`}>
        <div className="mx-auto max-w-5xl">
          {/* ---------------- Hero ---------------- */}
          <header className="mb-20">
            <div className="mb-5 flex flex-wrap items-center gap-2 text-[12px] uppercase tracking-[0.22em] text-white/35">
              <span>{P.client}</span>
              <span className="text-white/15">/</span>
              <span>{P.year}</span>
              <span className="text-white/15">/</span>
              <span>Case study</span>
            </div>

            {/* Long headline, held at a readable size rather than a
                billboard — the sentence is the point, not the scale. */}
            <BlurReveal
              as="h1"
              text={P.fullTitle!}
              className="font-display max-w-4xl text-[clamp(28px,4.6vw,52px)] leading-[1.08] text-white"
            />

            <p className="mt-7 max-w-3xl text-[clamp(17px,2vw,21px)] leading-relaxed text-white/60">
              Reducing weeks of back-and-forth into a guided workflow that
              enables non-technical marketing teams to build career sites
              themselves.
            </p>

            <dl className="mt-12 grid grid-cols-2 gap-8 border-t border-white/10 pt-8 text-sm md:grid-cols-4">
              <Meta term="Role" value={P.role} />
              <Meta term="Timeline" value="2026 — ongoing" />
              <Meta term="Team" value="Solo design, partnered with product & engineering" />
              <Meta term="Scope" value="Service model, product strategy, UX, design system, prototype" />
            </dl>

            <Reveal>
              <p
                className="mt-12 rounded-2xl border border-white/15 px-6 py-8 text-[clamp(18px,2.4vw,24px)] leading-snug text-white/90 md:px-10 md:py-10"
                style={{ background: "var(--brand-sheen-soft)" }}
              >
                I redesigned the{" "}
                <span className="text-brand">service delivery model</span>{" "}
                of Joveo&apos;s enterprise CMS by combining AI planning, reusable
                widget libraries, and guided editing into a self-serve
                experience.
              </p>
            </Reveal>

            <div className="mt-8">
              <CTA label="Try the live prototype" href="#live-demo" size="md" />
            </div>
          </header>

          {/* ---------------- 1. Old workflow ---------------- */}
          <Section id="old-workflow">
            <SectionHead
              index="01"
              eyebrow="Where it started"
              title="The old workflow was a service, not a product"
              lede="Joveo built career sites for enterprise clients. Anything a client wanted changed travelled through a chain of teams before it reached the page."
            />

            <Chain nodes={OLD_FLOW} tone="danger" />
            <LoopBack label="Review → feedback → rebuild, repeated until the client approves." />

            {/* One round-trip, in days — this is what "weeks" was made of */}
            <div className="mt-14 overflow-hidden rounded-2xl border border-white/10">
              <div className="flex flex-wrap items-end justify-between gap-4 p-6 pb-0 md:p-8 md:pb-0">
                <div className="text-[11px] uppercase tracking-[0.2em] text-white/35">
                  One review cycle, measured
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="font-display text-[clamp(30px,5vw,44px)] leading-none text-white">
                    6
                  </span>
                  <span className="text-[13px] text-white/40">
                    days minimum, one pass
                  </span>
                </div>
              </div>

              <div className="grid gap-0 p-6 pt-8 sm:grid-cols-3 md:p-8 md:pt-10">
                <CycleStat n="1" unit="day" label="Design mock" pct={17} first />
                <CycleStat n="2" unit="days" label="Frontend builds it on the CMS" pct={33} />
                <CycleStat n="3" unit="days" label="Client review & feedback" pct={50} last />
              </div>

              <div className="flex items-center gap-3 border-t border-dashed border-[#ef3c3f]/35 bg-[#ef3c3f]/[0.05] px-6 py-4 md:px-8">
                <span className="text-[#ef3c3f]" aria-hidden>
                  ↺
                </span>
                <p className="text-[13px] leading-relaxed text-white/50">
                  A client rarely approves on the first round. Each
                  additional round of feedback repeats the same six days —
                  which is how a single heading change became a multi-week
                  project.
                </p>
              </div>
            </div>

            <Reveal>
              <p className="mt-14 max-w-3xl font-display text-[clamp(20px,3vw,30px)] leading-snug text-white">
                Even changing a heading often required multiple people across
                different teams.
              </p>
            </Reveal>

            <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-white/45">
              That&apos;s the real cost. Not the turnaround time on any single
              request, but the fact that the shape of the process made small
              changes structurally expensive — so clients stopped asking, and
              their career sites went stale.
            </p>
          </Section>

          {/* ---------------- 2. Users ---------------- */}
          <Section id="users">
            <SectionHead
              index="02"
              eyebrow="Reframing"
              title="Why this wasn't a CMS problem"
              lede="The obvious fix was a better editor. But the gap wasn't in the tooling — it was between what the product demanded of its users and what those users actually were."
            />
            <UserGap />
          </Section>

          {/* ---------------- 3. Principles ---------------- */}
          <Section id="principles">
            <SectionHead
              index="03"
              eyebrow="Constraints"
              title="Six principles that decided everything after"
              lede="Written before any interface. Each one resolves a specific argument that came up repeatedly during the build."
            />

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {PRINCIPLES.map((p, i) => (
                <Reveal key={p.t} delay={i * 60}>
                  <Card className="h-full" sheen={i % 2 === 0}>
                    <div className="mb-4 font-display text-[13px] text-white/25">
                      {String(i + 1).padStart(2, "0")}
                    </div>
                    <h3 className="font-display mb-3 text-[19px] leading-snug text-white">
                      {p.t}
                    </h3>
                    <p className="text-[14px] leading-relaxed text-white/50">
                      {p.d}
                    </p>
                  </Card>
                </Reveal>
              ))}
            </div>
          </Section>

          {/* ---------------- 4. Strategy ---------------- */}
          <Section id="strategy">
            <SectionHead
              index="04"
              eyebrow="Product strategy"
              title="Change the question the product asks"
              lede="The old CMS asked users how to build a website. The new one asks what outcome they're trying to reach, then does the translation itself."
            />

            <Chain nodes={NEW_FLOW} tone="brand" />

            <div className="mt-16 grid gap-6 md:grid-cols-2">
              <ScreenFrame
                src="/projects/cms-editor/01-create.png"
                alt="Project creation — brand and knowledge base up front"
                ratio={1391 / 794}
                caption="Setup collects context first: name, knowledge base, brand."
                sizes="(max-width: 768px) 100vw, 480px"
              />
              <ScreenFrame
                src="/projects/cms-editor/05-goal.png"
                alt="Goal capture — describing the site to be built"
                ratio={1394 / 802}
                caption="One prompt box, with templates as an equal path — not a lesser one."
                sizes="(max-width: 768px) 100vw, 480px"
              />
            </div>

            <div className="mt-6">
              <ScreenFrame
                src="/projects/cms-editor/06-templates.png"
                alt="Template gallery — start from a proven structure"
                ratio={1391 / 803}
                caption="Templates are a first-class starting point. Not everyone wants to describe a site from nothing, and pretending otherwise is a conversion problem."
              />
            </div>

            <div className="mt-16 grid grid-cols-2 gap-x-8 gap-y-10 md:grid-cols-4">
              <Metric value={70} suffix="+" label="production widgets in the library" />
              <Metric value={15} label="section types they cover" />
              <Metric value={12} label="career-site page types modelled" />
              <Metric value={5} label="seeded brands the system re-skins live" />
            </div>
          </Section>

          {/* ---------------- 5. Orchestration ---------------- */}
          <Section id="orchestration">
            <SectionHead
              index="05"
              eyebrow="The core decision"
              title="Why AI doesn't generate everything"
              lede="The default assumption for an AI builder is that the model makes the UI. That's the expensive answer, and for an enterprise design system it's also the wrong one."
            />

            <OrchestratorCompare />
            <TokenEconomics />

            <Reveal>
              <div className="mt-12 max-w-3xl">
                <Tag tone="impact">The model</Tag>
                <h3 className="font-display mb-5 text-[clamp(22px,3.4vw,32px)] text-white">
                  AI as an orchestrator
                </h3>
                <p className="text-[16px] leading-relaxed text-white/55">
                  Rather than replacing the design system, AI first searches the
                  existing widget library and company assets before generating
                  anything new. That reduces cost, preserves consistency, and
                  leverages years of existing design work instead of writing it
                  off.
                </p>
              </div>
            </Reveal>
          </Section>

          {/* ---------------- 6. The product ---------------- */}
          <Section id="product">
            <SectionHead
              index="06"
              eyebrow="The product"
              title="Eight surfaces, each answering one problem"
              lede="Feature by feature rather than screen by screen — because the interesting part of each surface is the argument it settles, not its layout."
            />

            <FeatureRail features={FEATURES.map((f) => ({ n: f.n, name: f.name }))} />

            <div>
              {FEATURES.map((f, i) => (
                <FeatureBlock key={f.n} feature={f} flip={i % 2 === 1} />
              ))}
            </div>

            {/* Live demo — the real interaction, not a screenshot of it */}
            <div id="live-demo" className="mt-16 scroll-mt-28 border-t border-white/[0.07] pt-16">
              <Tag tone="impact">Try it</Tag>
              <h3 className="font-display mb-8 text-[clamp(20px,3vw,26px)] text-white">
                Live demo — experience the Brand Studio here
              </h3>
              <LiveDemo />
            </div>

            <div className="mt-10">
              <Tag>Publish, live</Tag>
              <ScreenFrame
                src="/projects/cms-editor/18-preview.png"
                alt="Publish — the assembled site with a live brand switcher"
                ratio={1399 / 796}
                caption="Publish: globals wrap every page, the brand switcher re-skins the whole site live, and every publish snapshots a restorable version."
              />
            </div>
          </Section>

          {/* ---------------- 7. Confidence ---------------- */}
          <Section id="confidence">
            <SectionHead
              index="07"
              eyebrow="Trust"
              title="Designing for confidence instead of magic"
              lede="The seductive version of this product is an empty box that says 'type anything'. I deliberately didn't build that."
            />

            <Chain
              nodes={[
                "See branding",
                "See plan",
                "See pages",
                "See widgets",
                "See suggestions",
                "See preview",
                "Publish",
              ]}
              tone="brand"
            />

            <div className="mt-12 grid gap-6 md:grid-cols-2">
              <Card>
                <Tag tone="problem">What &quot;type anything&quot; costs</Tag>
                <p className="text-[15px] leading-relaxed text-white/55">
                  A blank prompt puts the entire burden of specification on
                  someone who came to the product precisely because they
                  couldn&apos;t specify it. When the output is wrong, they have
                  no model of why — so they can&apos;t fix it, and they
                  don&apos;t trust the next result either.
                </p>
              </Card>
              <Card sheen>
                <Tag tone="impact">What visible steps buy</Tag>
                <p className="text-[15px] leading-relaxed text-white/55">
                  Every stage shows its state before the next one runs. The user
                  builds an accurate mental model of what the system knows, and
                  each approval is a checkpoint they can return to. Trust here
                  isn&apos;t a feeling — it&apos;s the ability to predict the
                  next screen.
                </p>
              </Card>
            </div>
          </Section>

          {/* ---------------- 8. Progressive disclosure ---------------- */}
          <Section id="disclosure">
            <SectionHead
              index="08"
              eyebrow="One product, three users"
              title="Progressive disclosure"
              lede="The same workspace has to serve someone who has never built a page and someone who wants to override a button's letter-spacing. Pick a tier."
            />
            <TierExplorer />
          </Section>

          {/* ---------------- 9. Before / after ---------------- */}
          <Section id="results">
            <SectionHead
              index="09"
              eyebrow="The shift"
              title="From a service model to a product model"
              lede="The measurable change isn't a screen. It's which organisation has to be involved before a career site changes."
            />
            <BeforeAfter />
          </Section>

          {/* ---------------- 10. Reflections ---------------- */}
          <Section id="reflections">
            <SectionHead
              index="10"
              eyebrow="Reflections"
              title="What I'd tell the next person building this"
            />

            <div className="grid gap-4 md:grid-cols-2">
              {REFLECTIONS.map((r, i) => (
                <Reveal key={r.t} delay={i * 70}>
                  <Card className="h-full">
                    <h3 className="font-display mb-3 text-[19px] leading-snug text-white">
                      {r.t}
                    </h3>
                    <p className="text-[14px] leading-relaxed text-white/50">
                      {r.d}
                    </p>
                  </Card>
                </Reveal>
              ))}
            </div>
          </Section>

          {/* ---------------- Closing ---------------- */}
          <Section id="closing" className="border-b border-white/10">
            <div className="max-w-3xl">
              <Tag>What this project taught me</Tag>
              <Reveal>
                <p className="font-display mb-10 text-[clamp(22px,3.6vw,34px)] leading-snug text-white">
                  This shifted how I design —{" "}
                  <span className="text-brand">from interfaces to systems.</span>
                </p>
              </Reveal>

              <div className="space-y-5">
                {CLOSING_TAKEAWAYS.map((line, i) => (
                  <Reveal key={line} delay={i * 70}>
                    <p className="font-display flex gap-4 border-t border-white/10 pt-5 text-[clamp(16px,2.2vw,20px)] leading-snug text-white/90">
                      <span className="text-brand shrink-0">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      {line}
                    </p>
                  </Reveal>
                ))}
              </div>
            </div>
          </Section>
        </div>

        <FooterBlob label="Check out Other Projects !" href="/projects/web-template" />

        <div className="pb-16 text-center">
          <Link
            href="/projects"
            className="text-sm text-white/40 transition-colors hover:text-white/70"
          >
            ← All projects
          </Link>
        </div>
      </article>
    </>
  );
}

function Meta({ term, value }: { term: string; value: string }) {
  return (
    <div>
      <dt className="text-white/35">{term}</dt>
      <dd className="mt-1.5 leading-snug text-white/80">{value}</dd>
    </div>
  );
}

function CycleStat({
  n,
  unit,
  label,
  pct,
  first = false,
  last = false,
}: {
  n: string;
  unit: string;
  label: string;
  /** Share of the 6-day total this step burns, for the fill bar. */
  pct: number;
  first?: boolean;
  last?: boolean;
}) {
  return (
    <div
      className={`relative border-white/10 px-0 pb-1 sm:px-6 sm:pb-0 ${
        first ? "" : "sm:border-l"
      }`}
    >
      <div className="flex items-baseline gap-1.5">
        <span className="font-display text-[clamp(28px,4vw,40px)] leading-none text-white">
          {n}
        </span>
        <span className="text-[13px] text-white/40">{unit}</span>
      </div>
      <div className="mt-2 max-w-[22ch] text-[13px] leading-snug text-white/50">
        {label}
      </div>
      <div className="mt-4 h-1 w-full overflow-hidden rounded-full bg-white/[0.06]">
        <div
          className="h-full rounded-full"
          style={{
            width: `${pct}%`,
            background: last
              ? "rgba(239,60,63,0.55)"
              : "linear-gradient(90deg, var(--brand-orange), var(--brand-purple))",
          }}
        />
      </div>
    </div>
  );
}
