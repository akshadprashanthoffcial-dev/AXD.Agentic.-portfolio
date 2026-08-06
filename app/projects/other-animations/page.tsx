// ============================================================
// Bespoke case study - Other Animations.
// A small reel of logo reveals / motion pieces, laid out as a
// vertical list, each clip autoplaying (muted, looped). The Mudra
// Logo clip is a real YouTube upload (its source file is too large
// to ship in the repo), embedded with autoplay+mute+loop params to
// match the local clips' behaviour.
// ============================================================

import type { Metadata } from "next";
import Link from "next/link";
import { PROJECTS, getProject } from "@/data/projects";
import BlurReveal from "@/components/ui/BlurReveal";
import FooterBlob from "@/components/FooterBlob";
import ScrollFX from "@/components/effects/ScrollFX";
import { CATEGORY_ICONS } from "@/components/ui/Icons";
import { AfterEffectsLogo, BlenderLogo } from "@/components/ui/ToolLogos";

const P = getProject("other-animations")!;

export const metadata: Metadata = {
  title: `${P.fullTitle} - ${P.client}`,
  description: P.summary,
};

type Clip =
  | { title: string; kind: "local"; src: string }
  | { title: string; kind: "youtube"; id: string };

const CLIPS: Clip[] = [
  { title: "Summer Logo", kind: "local", src: "/projects/Other-Animation/summer-logo-final.mp4" },
  // "Orange Animation" pulled for now — orange-animation.mov is a native
  // QuickTime codec (likely ProRes) that browsers can't decode, it renders
  // as a black box. Re-add once it's re-exported as H.264 MP4.
  { title: "Mudra Logo", kind: "youtube", id: "9H7diJr9NPU" },
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

        {/* ---------------- Clips, vertical autoplaying list ---------------- */}
        <div className="flex flex-col gap-14">
          {CLIPS.map((clip, i) => (
            <section key={clip.title} data-reveal className="flex flex-col gap-4">
              <div className="flex items-baseline gap-2.5">
                <span className="font-display text-[12px] tracking-[0.08em] text-white/35">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="font-display text-[20px] text-white">{clip.title}</h3>
              </div>

              <div
                className="overflow-hidden rounded-[22px] border border-white/10 bg-black"
                style={{ boxShadow: "0 30px 60px -30px rgba(0,0,0,0.8)" }}
              >
                {clip.kind === "local" ? (
                  <video
                    src={clip.src}
                    autoPlay
                    loop
                    muted
                    playsInline
                    preload={i === 0 ? "auto" : "metadata"}
                    className="block w-full"
                  />
                ) : (
                  <div className="relative w-full" style={{ aspectRatio: "16/9" }}>
                    <iframe
                      src={`https://www.youtube.com/embed/${clip.id}?autoplay=1&mute=1&loop=1&playlist=${clip.id}&controls=1`}
                      title={`${clip.title}, video player`}
                      className="absolute inset-0 h-full w-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      referrerPolicy="strict-origin-when-cross-origin"
                      allowFullScreen
                    />
                  </div>
                )}
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
