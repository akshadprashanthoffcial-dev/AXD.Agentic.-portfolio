"use client";

// ============================================================
// CaseKit, primitives for long-form case-study pages.
// Everything here is dependency-free motion: one IntersectionObserver
// hook flips an `.in` class, CSS in globals.css does the rest.
// ============================================================

import { Fragment, useEffect, useRef, useState } from "react";

/** Adds `.in` to the ref'd element once it scrolls into view. */
export function useInView<T extends HTMLElement>(rootMargin = "-12%") {
  const ref = useRef<T>(null);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          el.classList.add("in");
          setSeen(true);
          io.unobserve(el);
        }
      },
      { threshold: 0, rootMargin: `0px 0px ${rootMargin} 0px` }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [rootMargin]);

  return { ref, seen };
}

/* ------------------------------------------------------------
   Section scaffolding
   ------------------------------------------------------------ */

export function SectionHead({
  index,
  eyebrow,
  title,
  lede,
}: {
  index?: string;
  eyebrow?: string;
  title: string;
  lede?: string;
}) {
  return (
    <header className="mb-12 max-w-3xl">
      {(index || eyebrow) && (
        <div className="mb-4 flex items-center gap-3 text-[12px] uppercase tracking-[0.22em] text-white/50">
          {index && <span className="text-brand font-medium">{index}</span>}
          {eyebrow && <span>{eyebrow}</span>}
        </div>
      )}
      <h2 className="font-display text-[clamp(26px,4.2vw,44px)] leading-[1.1] text-white">
        {title}
      </h2>
      {lede && (
        <p className="mt-5 text-[17px] leading-relaxed text-white/68">{lede}</p>
      )}
    </header>
  );
}

/** A full-width band with a hairline top rule. */
export function Section({
  id,
  children,
  className = "",
}: {
  id?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      id={id}
      className={`scroll-mt-28 border-t border-white/10 py-20 md:py-28 ${className}`}
    >
      {children}
    </section>
  );
}

/* ------------------------------------------------------------
   Chain, the workhorse flow diagram.
   Stacked rail on mobile, inline rail on desktop. Nodes light up
   in sequence; connectors draw themselves between them.
   ------------------------------------------------------------ */

export type ChainTone = "muted" | "danger" | "brand";

const NODE_TONE: Record<ChainTone, string> = {
  muted: "border-white/12 bg-white/[0.03] text-white/72",
  danger: "border-[#ef3c3f]/30 bg-[#ef3c3f]/[0.07] text-white/78",
  brand: "border-white/15 text-white/85",
};

export function Chain({
  nodes,
  tone = "muted",
  dense = false,
  vertical = false,
  className = "",
}: {
  nodes: string[];
  tone?: ChainTone;
  /** Smaller type, for side-by-side lanes. */
  dense?: boolean;
  /** Stay stacked at every breakpoint (lanes compared side by side). */
  vertical?: boolean;
  className?: string;
}) {
  const { ref } = useInView<HTMLDivElement>();

  // Nodes and connectors are siblings, not nested, otherwise each pair
  // shares one flex slot and the rail distributes unevenly.
  const rail = vertical
    ? "flex-col items-stretch"
    : "flex-col items-stretch md:flex-row md:items-stretch";
  const nodeFlex = vertical ? "" : "md:min-w-0 md:flex-1";
  const linkSize = vertical
    ? "h-4 w-px self-center"
    : "h-4 w-px self-center md:h-px md:w-4 md:flex-none";

  return (
    <div
      ref={ref}
      className={`chain chain-tone-${tone} flex ${rail} ${className}`}
    >
      {nodes.map((n, i) => (
        <Fragment key={`${n}-${i}`}>
          <div
            className={`chain-node flex items-center justify-center rounded-xl border px-3 text-center leading-tight ${
              dense ? "py-2 text-[12px]" : "py-2.5 text-[13px] md:text-[12px]"
            } ${nodeFlex} ${NODE_TONE[tone]}`}
            style={{
              transitionDelay: `${i * 90}ms`,
              ...(tone === "brand" ? { background: "var(--brand-sheen)" } : null),
            }}
          >
            {n}
          </div>

          {i < nodes.length - 1 && (
            <div
              className={`chain-link shrink-0 ${linkSize}`}
              style={{ transitionDelay: `${i * 90 + 45}ms` }}
            />
          )}
        </Fragment>
      ))}
    </div>
  );
}

/** The "…and repeat" bracket that closes the old-workflow loop. */
export function LoopBack({ label }: { label: string }) {
  return (
    <div className="mt-5 flex items-center gap-3 rounded-xl border border-dashed border-[#ef3c3f]/35 px-4 py-3">
      <span className="text-[#ef3c3f]" aria-hidden>
        ↺
      </span>
      <span className="text-[13px] text-white/64">{label}</span>
    </div>
  );
}

/* ------------------------------------------------------------
   Metric, count-up stat, fires on scroll-in.
   ------------------------------------------------------------ */

export function Metric({
  value,
  suffix = "",
  prefix = "",
  label,
  decimals = 0,
}: {
  value: number;
  suffix?: string;
  prefix?: string;
  label: string;
  decimals?: number;
}) {
  const { ref, seen } = useInView<HTMLDivElement>("-8%");
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!seen) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setN(value);
      return;
    }
    const dur = 1100;
    const t0 = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / dur);
      // easeOutExpo, fast arrival, soft landing
      const e = p === 1 ? 1 : 1 - Math.pow(2, -10 * p);
      setN(value * e);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [seen, value]);

  return (
    <div ref={ref} className="border-t border-white/10 pt-5">
      <div className="font-display text-[clamp(30px,5vw,48px)] leading-none text-white">
        {prefix}
        {n.toFixed(decimals)}
        {suffix}
      </div>
      <div className="mt-3 text-[13px] leading-snug text-white/60">{label}</div>
    </div>
  );
}

/* ------------------------------------------------------------
   Card, the neutral surface used across the page.
   ------------------------------------------------------------ */

export function Card({
  children,
  className = "",
  sheen = false,
}: {
  children: React.ReactNode;
  className?: string;
  sheen?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border border-white/10 p-6 transition-[border-color,transform] duration-500 ease-out hover:-translate-y-0.5 hover:border-white/20 ${className}`}
      style={sheen ? { background: "var(--brand-sheen-soft)" } : undefined}
    >
      {children}
    </div>
  );
}

/** Small uppercase label used above card body copy. */
export function Tag({
  children,
  tone = "neutral",
}: {
  children: React.ReactNode;
  tone?: "neutral" | "problem" | "solution" | "impact";
}) {
  const tones = {
    neutral: "text-white/50",
    problem: "text-[#ef3c3f]/80",
    solution: "text-[#f59b00]/85",
    impact: "text-[#c88cff]",
  };
  return (
    <div
      className={`mb-2 text-[11px] uppercase tracking-[0.2em] ${tones[tone]}`}
    >
      {children}
    </div>
  );
}
