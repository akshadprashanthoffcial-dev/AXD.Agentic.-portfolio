import type { Metadata } from "next";
import { OPERATOR } from "@/data/operator";
import { SITE } from "@/data/site";
import Reveal from "@/components/ui/Reveal";
import BlurReveal from "@/components/ui/BlurReveal";
import FooterBlob from "@/components/FooterBlob";
import SocialAvatars from "@/components/ui/SocialAvatars";
import CTA from "@/components/ui/CTA";
import PortraitCard from "@/components/about/PortraitCard";
import Capabilities from "@/components/about/Capabilities";
import Toolkit from "@/components/about/Toolkit";
import Timeline from "@/components/about/Timeline";
import ToolMarquee from "@/components/about/ToolMarquee";
import { RoleIcon } from "@/components/ui/Icons";
import ScrollFX from "@/components/effects/ScrollFX";

export const metadata: Metadata = {
  title: "About",
  description: OPERATOR.intro[0],
};

export default function AboutPage() {
  return (
    <div className="px-5 pt-32">
      <ScrollFX />
      {/* ---------- Name + portrait card, side by side ---------- */}
      {/* On mobile the card slots straight under the name; on desktop it moves
          to the right of it, spanning both text rows. */}
      {/* Everything in this hero reveals on mount, not on scroll, the whole
          block is meant to be seen without scrolling, even the parts a tall
          portrait card can push just past the fold on a shorter viewport. */}
      <section className="mx-auto grid max-w-6xl gap-y-10 md:grid-cols-[1.05fr_0.95fr] md:gap-x-12">
        <div className="md:col-start-1 md:row-start-1">
          <Reveal immediate>
            <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 px-3.5 py-1.5 text-[11px] uppercase tracking-[0.16em] text-white/60"
              style={{ background: "var(--brand-sheen)" }}>
              <span className="h-1.5 w-1.5 rounded-full" style={{ background: "var(--brand-gradient)" }} />
              About
            </p>
          </Reveal>

          <h1 className="font-display text-[clamp(40px,8vw,88px)] font-semibold leading-[0.95] tracking-tight text-white">
            <BlurReveal immediate as="span" text={OPERATOR.firstName} className="block" />
            <BlurReveal
              immediate
              as="span"
              text={OPERATOR.lastName}
              className="block text-brand"
              delay={OPERATOR.firstName.length * 18}
            />
          </h1>

          <Reveal immediate delay={120}>
            <p className="font-display mt-6 flex items-center gap-3 text-[clamp(19px,2.4vw,26px)] leading-tight text-white/90">
              <span
                aria-hidden
                className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/15"
                style={{ background: "var(--brand-sheen)" }}
              >
                <RoleIcon size={16} />
              </span>
              {OPERATOR.title}
            </p>
          </Reveal>
        </div>

        {/* The card, tilts to the pointer, or to the phone's gyroscope. */}
        <Reveal
          immediate
          delay={100}
          className="md:col-start-2 md:row-start-1 md:row-span-2 md:self-center"
        >
          <PortraitCard />
        </Reveal>

        <div className="md:col-start-1 md:row-start-2">
          <div className="max-w-md space-y-4 text-[17px] leading-relaxed text-white/70">
            {OPERATOR.intro.map((p, i) => (
              <Reveal immediate key={i} delay={180 + i * 80}>
                <p>{p}</p>
              </Reveal>
            ))}
          </div>

          <Reveal immediate delay={440}>
            <div className="mt-9 flex flex-wrap items-center gap-4">
              <CTA label="See the work" href="/projects" size="md" />
              <a
                href={`mailto:${SITE.email}`}
                className="text-sm text-white/45 underline-offset-4 transition-colors hover:text-white hover:underline"
              >
                {SITE.email}
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ---------- Toolkit marquee ---------- */}
      <section className="mt-20 -mx-5">
        <ToolMarquee />
      </section>

      {/* ---------- Skills + tools ---------- */}
      <section className="mx-auto mt-24 grid max-w-6xl gap-14 md:grid-cols-2">
        <div data-reveal>
          <BlurReveal
            as="h2"
            text="What I do"
            className="font-display mb-6 block text-2xl text-white"
          />
          <Capabilities />
        </div>
        <div data-reveal>
          <BlurReveal
            as="h2"
            text="What I use"
            className="font-display mb-6 block text-2xl text-white"
          />
          <Toolkit />
        </div>
      </section>

      {/* ---------- Experience ---------- */}
      <section className="mx-auto mt-28 max-w-6xl">
        <BlurReveal
          as="h2"
          text="Where I've been"
          className="font-display mb-10 block text-2xl text-white"
        />
        <Timeline />
      </section>

      {/* ---------- Recognition + education ---------- */}
      <section className="mx-auto mt-28 grid max-w-6xl gap-14 md:grid-cols-2">
        <div data-reveal>
          <BlurReveal
            as="h2"
            text="Recognition"
            className="font-display mb-6 block text-2xl text-white"
          />
          <ul className="flex flex-col gap-4">
            {OPERATOR.achievements.map((a) => (
              <li
                key={a}
                className="flex gap-3 border-b border-white/10 pb-4 text-[15px] leading-relaxed text-white/65 last:border-b-0"
              >
                <span
                  aria-hidden
                  className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full"
                  style={{ background: "var(--brand-gradient)" }}
                />
                {a}
              </li>
            ))}
          </ul>
        </div>
        <div data-reveal>
          <BlurReveal
            as="h2"
            text="Education"
            className="font-display mb-6 block text-2xl text-white"
          />
          <ul className="flex flex-col gap-5">
            {OPERATOR.education.map((e) => (
              <li key={e.school} className="border-b border-white/10 pb-5 last:border-b-0">
                <p className="text-white/85">{e.school}</p>
                <p className="mt-1 flex flex-wrap items-baseline gap-x-3 text-sm text-white/40">
                  <span>{e.award}</span>
                  <span>·</span>
                  <span>{e.period}</span>
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ---------- Contact ---------- */}
      <section
        data-reveal
        className="mx-auto mt-28 flex max-w-6xl flex-col items-center text-center"
      >
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
