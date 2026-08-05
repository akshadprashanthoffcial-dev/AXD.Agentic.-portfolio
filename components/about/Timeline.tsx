"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { TIMELINE } from "@/data/operator";
import { gsap, ScrollTrigger } from "@/lib/gsap";

/**
 * Experience, on a spine that fills as you scroll past it. The fill is a
 * ScrollTrigger-scrubbed GSAP tween, height tied directly to how far the
 * block has scrolled through the viewport rather than to a clock, so it
 * tracks scroll position exactly (including scrolling back up).
 */
export default function Timeline() {
  const wrap = useRef<HTMLDivElement>(null);
  const fill = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = wrap.current;
    const bar = fill.current;
    if (!el || !bar) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      bar.style.height = "100%";
      return;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        bar,
        { height: "0%" },
        {
          height: "100%",
          ease: "none",
          scrollTrigger: {
            trigger: el,
            // A gentle lead, the line is never behind the reader.
            start: "top 75%",
            end: "bottom 55%",
            scrub: 0.4,
          },
        }
      );
    });
    return () => ctx.revert();
  }, []);

  // Reveal each row as it scrolls into view, batched with GSAP rather than
  // an IntersectionObserver so it shares the same engine as the fill above.
  useEffect(() => {
    const rows = wrap.current?.querySelectorAll<HTMLElement>(".tl-row");
    if (!rows?.length) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(rows, { opacity: 1 });
      rows.forEach((r) => r.classList.add("in"));
      return;
    }
    const ctx = gsap.context(() => {
      ScrollTrigger.batch(rows, {
        start: "top 88%",
        once: true,
        onEnter: (batch) => {
          batch.forEach((el) => el.classList.add("in"));
          gsap.fromTo(
            batch,
            { opacity: 0, y: 24, filter: "blur(6px)" },
            {
              opacity: 1,
              y: 0,
              filter: "blur(0px)",
              duration: 0.75,
              ease: "power3.out",
              stagger: 0.08,
              overwrite: true,
            }
          );
        },
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <div ref={wrap} className="relative pl-8 md:pl-12">
      {/* Spine */}
      <span
        aria-hidden
        className="absolute left-[7px] top-2 bottom-2 w-px md:left-[11px]"
        style={{ background: "rgba(255,255,255,0.12)" }}
      >
        <span
          ref={fill}
          className="absolute left-0 top-0 block w-px"
          style={{ height: 0, background: "var(--brand-gradient)" }}
        />
      </span>

      <div className="flex flex-col">
        {TIMELINE.map((t, i) => {
          const inner = (
            <div className="grid gap-2 py-7 md:grid-cols-[1fr_auto] md:items-baseline md:gap-8">
              <div>
                <h3 className="font-display flex items-center gap-2.5 text-xl text-white">
                  {t.logo && (
                    <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white/95 p-1">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={t.logo} alt="" className="max-h-full max-w-full object-contain" />
                    </span>
                  )}
                  {t.org}
                  {t.projectSlug && (
                    <span
                      aria-hidden
                      className="ml-2 inline-block translate-x-[-4px] text-[0.7em] text-white/35 opacity-0 transition-all duration-400 ease-out group-hover:translate-x-0 group-hover:text-white/70 group-hover:opacity-100"
                    >
                      →
                    </span>
                  )}
                </h3>
                <p className="mt-1 flex flex-wrap items-center gap-2 text-white/75">
                  {t.role}
                  {t.freelance && (
                    <span
                      className="rounded-full border border-white/15 px-2.5 py-0.5 text-[11px] uppercase tracking-[0.12em] text-white/55"
                      style={{ background: "var(--brand-sheen)" }}
                    >
                      Freelance
                    </span>
                  )}
                </p>
                <p className="mt-2 max-w-xl text-[15px] leading-relaxed text-white/45">
                  {t.note}
                </p>
              </div>
              <span className="whitespace-nowrap text-sm text-white/35">{t.period}</span>
            </div>
          );

          return (
            <div key={`${t.org}-${t.period}`} className="tl-row relative border-t border-white/10 first:border-t-0">
              {/* Node */}
              <span
                aria-hidden
                className="tl-node absolute -left-[32px] top-9 h-[15px] w-[15px] rounded-full border-2 border-black md:-left-[44px]"
                style={{ background: i === 0 ? "var(--brand-gradient)" : "rgba(255,255,255,0.25)" }}
              />
              {t.projectSlug ? (
                <Link
                  href={`/projects/${t.projectSlug}`}
                  className="group block transition-colors duration-300 hover:bg-white/[0.03]"
                >
                  {inner}
                </Link>
              ) : (
                inner
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
