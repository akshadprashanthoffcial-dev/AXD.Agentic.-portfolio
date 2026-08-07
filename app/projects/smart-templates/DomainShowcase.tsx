"use client";

import { useEffect, useRef, useState } from "react";
import Reveal from "@/components/ui/Reveal";
import { DOMAINS } from "./domains";
import TemplatePreview from "./TemplatePreview";

/** Sticky domain picker + the five re-skinned template sections. Scroll-spy
 *  keeps the active tab (and its accent rail) in sync with whichever
 *  section is nearest the top, mirroring the picker in the Banking template
 *  itself, this is the same interaction the system is showing off. */
export default function DomainShowcase() {
  const [active, setActive] = useState(0);
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const sections = sectionRefs.current.filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const idx = sections.indexOf(e.target as HTMLElement);
            if (idx !== -1) setActive(idx);
          }
        });
      },
      { rootMargin: "-20% 0px -55% 0px", threshold: 0 }
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  const scrollTo = (i: number) => {
    sectionRefs.current[i]?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const activeDomain = DOMAINS[active];

  return (
    <div>
      <nav
        className="sticky top-[76px] z-30 -mx-5 border-y border-white/10 bg-black/75 backdrop-blur-xl md:mx-0 md:rounded-2xl md:border"
        aria-label="Template domain picker"
      >
        <div className="relative flex items-stretch">
          <div
            className="absolute bottom-0 h-0.5 transition-[left,background] duration-500 ease-out"
            style={{ width: `${100 / DOMAINS.length}%`, left: `${(active * 100) / DOMAINS.length}%`, background: activeDomain.accent }}
          />
          {DOMAINS.map((d, i) => (
            <button
              key={d.id}
              type="button"
              onClick={() => scrollTo(i)}
              className={`flex-1 px-2 py-4 text-center text-[13px] transition-colors duration-300 sm:text-[14px] ${
                active === i ? "text-white" : "text-white/50 hover:text-white/80"
              }`}
            >
              {d.num} <span className="hidden sm:inline">{d.name}</span>
            </button>
          ))}
        </div>
      </nav>

      <p className="mt-9 max-w-xl text-[14px] text-white/40">
        Every preview below runs dummy copy and placeholder imagery. The system is the point, not the words.
      </p>

      <div className="mt-4 space-y-28">
        {DOMAINS.map((d, i) => (
          <section
            key={d.id}
            id={d.id}
            ref={(el) => {
              sectionRefs.current[i] = el;
            }}
            className="grid scroll-mt-40 grid-cols-1 gap-10 lg:grid-cols-[1fr_1.05fr] lg:items-start lg:gap-14"
          >
            <Reveal>
              <div className="flex items-baseline gap-3.5">
                <span className="font-display text-sm" style={{ color: d.accent }}>
                  {d.num}
                </span>
                <h3 className="font-display text-[36px] leading-[1.05] text-white sm:text-[44px]">
                  {d.name}
                </h3>
              </div>
              <div className="mt-3.5 mb-5 text-[13px] tracking-[0.14em] text-white/35 uppercase">
                {d.client} · {d.tagline}
              </div>
              <p className="text-[16px] leading-relaxed text-white/72 sm:text-[17px]">{d.body}</p>

              <div className="mt-6 flex flex-wrap items-center gap-5">
                {[d.accent, d.dark, d.paper].map((c) => (
                  <div key={c} className="flex items-center gap-2">
                    <span
                      className="h-4 w-4 rounded-md shadow-[inset_0_0_0_1px_rgba(255,255,255,0.22)]"
                      style={{ background: c }}
                    />
                    <span className="text-[13px] tracking-[0.02em] text-white/55">
                      {c.toUpperCase()}
                    </span>
                  </div>
                ))}
              </div>

              <ul className="mt-6 flex flex-col gap-3">
                {d.notes.map((n) => (
                  <li key={n} className="flex gap-3 text-[15px] leading-relaxed text-white/70">
                    <span style={{ color: d.accent }}>—</span>
                    {n}
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal>
              <TemplatePreview domain={d} />
            </Reveal>
          </section>
        ))}
      </div>
    </div>
  );
}
