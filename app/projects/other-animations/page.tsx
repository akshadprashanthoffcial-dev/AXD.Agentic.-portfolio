// ============================================================
// Bespoke case study - Other Animations.
// A small reel of logo reveals / motion pieces, each clip plays
// on hover (desktop) or tap (touch), no autoplay.
// ============================================================

import type { Metadata } from "next";
import Link from "next/link";
import { PROJECTS, getProject } from "@/data/projects";
import BlurReveal from "@/components/ui/BlurReveal";
import FooterBlob from "@/components/FooterBlob";
import ScrollFX from "@/components/effects/ScrollFX";
import { CATEGORY_ICONS } from "@/components/ui/Icons";
import { AfterEffectsLogo, BlenderLogo } from "@/components/ui/ToolLogos";
import HoverPlayVideo from "@/components/projects/HoverPlayVideo";

const P = getProject("other-animations")!;

export const metadata: Metadata = {
  title: `${P.fullTitle} - ${P.client}`,
  description: P.summary,
};

const CLIPS = [
  { title: "Orange Animation", src: "/projects/Other-Animation/orange-animation.mov" },
  { title: "Summer Logo", src: "/projects/Other-Animation/summer-logo-final.mp4" },
  { title: "Mudra Logo", src: "/projects/Other-Animation/final-mudra-logo.mov" },
];

const TOOLS = [
  { name: "Blender", node: <BlenderLogo size={20} /> },
  { name: "After Effects", node: <AfterEffectsLogo size={20} /> },
];

export default function OtherAnimationsCaseStudy() {
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

        {/* ---------------- Clips ---------------- */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
          {CLIPS.map((clip, i) => (
            <section key={clip.title} data-reveal className="flex flex-col gap-4">
              <HoverPlayVideo src={clip.src} title={clip.title} />
              <div className="flex items-baseline gap-2.5">
                <span className="font-display text-[12px] tracking-[0.08em] text-white/35">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="font-display text-[20px] text-white">{clip.title}</h3>
              </div>
            </section>
          ))}
        </div>
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
