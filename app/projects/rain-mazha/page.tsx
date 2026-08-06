// ============================================================
// Bespoke case study - Rain / Mazha music video animation.
// A two-person freelance project: illustration + AE animation
// for a Malayalam single, "RAIN" (Sachin Balu / Gypsy Myths
// Studios). Embeds the real YouTube video as the centrepiece.
// ============================================================

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PROJECTS, getProject } from "@/data/projects";
import BlurReveal from "@/components/ui/BlurReveal";
import FooterBlob from "@/components/FooterBlob";
import CTA from "@/components/ui/CTA";
import ScrollFX from "@/components/effects/ScrollFX";
import { CATEGORY_ICONS } from "@/components/ui/Icons";
import { AfterEffectsLogo } from "@/components/ui/ToolLogos";

const P = getProject("rain-mazha")!;
const YOUTUBE_URL = "https://youtu.be/u87dGIlVpzc";
const YOUTUBE_EMBED = "https://www.youtube.com/embed/u87dGIlVpzc";

export const metadata: Metadata = {
  title: `${P.fullTitle} - ${P.client}`,
  description: P.summary,
};

const CREDITS = [
  { role: "Produced by", name: "Gypsy Myths Studios" },
  { role: "Vocals & Arrangement", name: "Sachin Balu" },
  { role: "Music", name: "Harikrishnan Payyavoor" },
  { role: "Lyrics", name: "Dipin Mundalur" },
  { role: "Illustration", name: "Sanghamithra K" },
  { role: "Motion Graphics", name: "Akshad Prashanth" },
];

export default function RainMazhaCaseStudy() {
  const internal = PROJECTS.filter((p) => !p.externalUrl);
  const idx = internal.findIndex((p) => p.slug === P.slug);
  const next = internal[(idx + 1) % internal.length];

  return (
    <>
      {P.banner && (
        <div className="relative -mt-[1px] h-[46vh] max-h-[420px] min-h-[260px] w-full overflow-hidden bg-black">
          <Image
            src={P.banner}
            alt={`${P.fullTitle ?? P.title}, cover`}
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent" />
        </div>
      )}
      <article className={`px-5 ${P.banner ? "pt-16" : "pt-32"}`}>
      <ScrollFX />
      <div className="mx-auto max-w-4xl">
        {/* ---------------- Hero ---------------- */}
        <header className="mb-14">
          <div className="mb-5 flex flex-wrap items-center gap-2">
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
            <span
              className="inline-flex items-center gap-1.5 rounded-full border border-white/15 px-3 py-1 text-[13px] text-white/70"
              style={{ background: "var(--brand-sheen)" }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z" />
                <circle cx="12" cy="12" r="2.6" />
              </svg>
              13K+ views
            </span>
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
                <span
                  className="inline-flex items-center gap-2 rounded-full border border-white/15 py-1 pl-1 pr-3 text-[13px] text-white/80"
                  style={{ background: "var(--brand-sheen)" }}
                >
                  <span className="flex h-5 w-5 items-center justify-center overflow-hidden rounded-full">
                    <AfterEffectsLogo size={20} />
                  </span>
                  After Effects
                </span>
              </dd>
            </div>
          </dl>
        </header>

        {/* ---------------- Intro ---------------- */}
        <div className="mb-12 max-w-2xl space-y-5 text-[18px] leading-relaxed text-white/70">
          {P.intro.map((para, i) => (
            <p key={i} data-reveal>
              {para}
            </p>
          ))}
        </div>

        {/* ---------------- Credits ---------------- */}
        <div data-reveal className="mb-16 flex flex-wrap gap-2.5">
          {CREDITS.map((c) => (
            <span
              key={c.role}
              className="inline-flex items-center gap-2 rounded-full border border-white/15 px-3.5 py-1.5 text-[13px] text-white/70"
              style={{ background: "var(--brand-sheen-soft)" }}
            >
              <span className="text-white/40">{c.role}</span>
              <span className="text-white/85">{c.name}</span>
            </span>
          ))}
        </div>

        {/* ---------------- Video ---------------- */}
        <section data-reveal>
          <div
            className="overflow-hidden rounded-[22px] border border-white/10"
            style={{ boxShadow: "0 30px 60px -30px rgba(0,0,0,0.8)" }}
          >
            <div className="relative w-full" style={{ aspectRatio: "16/9" }}>
              <iframe
                src={YOUTUBE_EMBED}
                title="RAIN - Sachin Balu, Music Video"
                className="absolute inset-0 h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            </div>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-between gap-6">
            <p className="max-w-md text-[15px] leading-relaxed text-white/45">
              Watch the full music video on YouTube, or read the credits above for who made what.
            </p>
            <CTA label="Watch on YouTube" href={YOUTUBE_URL} external size="md" />
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
    </>
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
