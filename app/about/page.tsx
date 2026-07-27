import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { OPERATOR, TIMELINE } from "@/data/operator";
import { SITE } from "@/data/site";
import Reveal from "@/components/ui/Reveal";
import BlurReveal from "@/components/ui/BlurReveal";
import FooterBlob from "@/components/FooterBlob";
import FloatingCard from "@/components/effects/FloatingCard";
import SocialAvatars from "@/components/ui/SocialAvatars";
import CTA from "@/components/ui/CTA";

export const metadata: Metadata = {
  title: "About",
  description: OPERATOR.intro[0],
};

export default function AboutPage() {
  return (
    <div className="px-5 pt-32">
      {/* Intro + name */}
      <section className="mx-auto grid max-w-6xl items-start gap-10 md:grid-cols-2">
        <div>
          <h1 className="font-display text-[clamp(44px,9vw,96px)] font-semibold leading-[0.95] tracking-tight text-white">
            <BlurReveal as="span" text={OPERATOR.firstName} className="block" />
            <BlurReveal
              as="span"
              text={OPERATOR.lastName}
              className="block"
              delay={OPERATOR.firstName.length * 18}
            />
          </h1>
          <p className="mt-4 text-white/45">{OPERATOR.title}</p>
          <div className="mt-8 max-w-md space-y-4 text-[18px] leading-relaxed text-white/70">
            {OPERATOR.intro.map((p, i) => (
              <Reveal key={i} delay={i * 70}>
                <p>{p}</p>
              </Reveal>
            ))}
          </div>
        </div>

        {/* Decorative tile cluster */}
        <div className="relative hidden h-[360px] md:block" aria-hidden>
          <TileCluster />
        </div>
      </section>

      {/* Portrait — circular tile ring + big gradient glow (Figma 53:1189) */}
      <section className="relative mx-auto mt-28 flex max-w-6xl justify-center overflow-hidden">
        <div className="relative flex h-[560px] w-full items-center justify-center md:h-[680px]">
          {/* Big radial glow */}
          <div
            className="pointer-events-none absolute bottom-4 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full blur-[80px] md:h-[620px] md:w-[620px]"
            style={{
              background:
                "radial-gradient(circle at 50% 62%, rgba(245,155,0,0.5), rgba(161,31,242,0.55) 40%, rgba(239,60,63,0.4) 64%, transparent 74%)",
            }}
          />
          {/* Tile ring */}
          <PortraitRing />
          {/* Portrait with 3D tilt */}
          <FloatingCard className="relative z-10 w-[280px] md:w-[360px]">
            <div
              className="relative flex aspect-[4/5] items-end justify-center overflow-hidden rounded-3xl border border-white/12 bg-white/[0.04]"
              style={{ transform: "translateZ(40px)" }}
            >
              {OPERATOR.hasPortrait ? (
                <Image
                  src={OPERATOR.portrait}
                  alt={OPERATOR.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 360px"
                  className="object-cover"
                />
              ) : (
                <span className="font-display pb-10 text-2xl text-white/85">
                  {OPERATOR.name}
                </span>
              )}
            </div>
          </FloatingCard>
        </div>
      </section>

      {/* Skills + Tools */}
      <section className="mx-auto mt-28 grid max-w-6xl gap-14 md:grid-cols-2">
        <Reveal>
          <BlurReveal as="h2" text="What I do" className="font-display mb-6 block text-2xl text-white" />
          <ul className="flex flex-wrap gap-2.5">
            {OPERATOR.skills.map((s) => (
              <li
                key={s}
                className="rounded-full border border-white/15 px-4 py-2 text-sm text-white/75"
                style={{ background: "var(--brand-sheen)" }}
              >
                {s}
              </li>
            ))}
          </ul>
        </Reveal>
        <Reveal delay={80}>
          <BlurReveal as="h2" text="Instruments" className="font-display mb-6 block text-2xl text-white" />
          <ul className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
            {OPERATOR.tools.map((t) => (
              <li key={t.name} className="flex items-baseline justify-between border-b border-white/10 pb-2">
                <span className="text-white/80">{t.name}</span>
                <span className="text-white/35">{t.use}</span>
              </li>
            ))}
          </ul>
        </Reveal>
      </section>

      {/* Timeline */}
      <section className="mx-auto mt-28 max-w-6xl">
        <BlurReveal as="h2" text="Where I've been" className="font-display mb-8 block text-2xl text-white" />
        <div className="flex flex-col">
          {TIMELINE.map((t, i) => {
            const inner = (
              <div className="grid gap-2 border-t border-white/10 py-6 md:grid-cols-[180px_1fr_auto] md:items-baseline md:gap-8">
                <span className="font-display text-lg text-white">{t.org}</span>
                <span className="text-white/60">
                  <span className="text-white/80">{t.role}</span> — {t.note}
                </span>
                <span className="text-sm text-white/35">{t.period}</span>
              </div>
            );
            return (
              <Reveal key={i} delay={(i % 3) * 60}>
                {t.projectSlug ? (
                  <Link
                    href={`/projects/${t.projectSlug}`}
                    className="block transition-colors hover:bg-white/[0.03]"
                  >
                    {inner}
                  </Link>
                ) : (
                  inner
                )}
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* Contact nudge */}
      <section className="mx-auto mt-24 flex max-w-6xl flex-col items-center text-center">
        <SocialAvatars />
        <div className="mt-8">
          <CTA label="Get in touch" href="/contact" size="md" />
        </div>
        <p className="mt-4 text-sm text-white/35">Based in {SITE.operatedFrom}</p>
      </section>

      <FooterBlob />
    </div>
  );
}

function PortraitRing() {
  const N = 12;
  const radius = 300;
  return (
    <div className="pointer-events-none absolute inset-0 hidden md:block" aria-hidden>
      {Array.from({ length: N }).map((_, i) => {
        const ang = (i / N) * 360;
        const size = 72 - (i % 3) * 16;
        return (
          <span
            key={i}
            className="absolute left-1/2 top-1/2 rounded-2xl border border-white/10"
            style={{
              width: size,
              height: size,
              marginLeft: -size / 2,
              marginTop: -size / 2,
              opacity: 0.4 + (i % 4) * 0.12,
              background:
                i % 3 === 0
                  ? "var(--brand-sheen)"
                  : "linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))",
              transform: `rotate(${ang}deg) translateY(-${radius}px) rotate(${-ang + i * 4}deg)`,
            }}
          />
        );
      })}
    </div>
  );
}

function TileCluster() {
  // Squares arranged loosely around a circle — echoes the Figma "about" frame.
  const tiles = [
    { x: 6, y: 6, s: 66, o: 0.9 },
    { x: 34, y: 0, s: 58, o: 0.7 },
    { x: 62, y: 8, s: 62, o: 0.8 },
    { x: 84, y: 22, s: 54, o: 0.6 },
    { x: 2, y: 40, s: 58, o: 0.6 },
    { x: 30, y: 52, s: 70, o: 0.85 },
    { x: 60, y: 48, s: 60, o: 0.7 },
    { x: 86, y: 62, s: 50, o: 0.5 },
    { x: 12, y: 74, s: 62, o: 0.7 },
    { x: 44, y: 82, s: 54, o: 0.55 },
  ];
  return (
    <>
      {tiles.map((t, i) => (
        <span
          key={i}
          className="absolute rounded-xl border border-white/10"
          style={{
            left: `${t.x}%`,
            top: `${t.y}%`,
            width: t.s,
            height: t.s,
            opacity: t.o,
            background:
              i % 3 === 0
                ? "var(--brand-sheen)"
                : "linear-gradient(180deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))",
            transform: `rotate(${(i % 2 ? -1 : 1) * (i * 2)}deg)`,
          }}
        />
      ))}
    </>
  );
}
