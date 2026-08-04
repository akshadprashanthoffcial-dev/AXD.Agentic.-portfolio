"use client";

// ============================================================
// FeatureRail — a scroll-reactive dot rail scoped to the 8 product
// features. Each dot reveals as its feature scrolls into view, and
// the current feature's dot stays highlighted while you're in it.
// Only visible while the reader is actually inside the features list.
// ============================================================

import { useEffect, useState } from "react";

export function FeatureRail({
  features,
}: {
  features: { n: string; name: string }[];
}) {
  const [active, setActive] = useState(0);
  const [visible, setVisible] = useState(false);
  const [revealed, setRevealed] = useState<Set<number>>(new Set([0]));

  useEffect(() => {
    const els = features
      .map((f) => document.getElementById(`feature-${f.n}`))
      .filter((el): el is HTMLElement => !!el);
    if (els.length === 0) return;

    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const first = els[0].getBoundingClientRect();
        const last = els[els.length - 1].getBoundingClientRect();
        const inRange =
          first.top < window.innerHeight * 0.7 && last.bottom > window.innerHeight * 0.2;
        setVisible(inRange);

        const line = window.innerHeight * 0.45;
        let current = 0;
        els.forEach((el, i) => {
          if (el.getBoundingClientRect().top <= line) current = i;
        });
        setActive(current);
        setRevealed((prev) => {
          if (prev.has(current)) return prev;
          const next = new Set(prev);
          for (let i = 0; i <= current; i++) next.add(i);
          return next;
        });
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
  }, [features]);

  return (
    <nav
      aria-label="Product features"
      aria-hidden={!visible}
      className="fixed top-1/2 right-24 z-30 hidden -translate-y-1/2 flex-col items-end gap-3 transition-opacity duration-300 xl:flex"
      style={{ opacity: visible ? 1 : 0, pointerEvents: visible ? "auto" : "none" }}
    >
      {features.map((f, i) => {
        const on = i === active;
        const shown = revealed.has(i);
        return (
          <a
            key={f.n}
            href={`#feature-${f.n}`}
            aria-label={f.name}
            title={f.name}
            className="cursor-pointer rounded-full p-1.5 transition-transform duration-200 hover:scale-125"
          >
            <span
              className="block rounded-full transition-all duration-500 ease-out"
              style={{
                width: on ? 10 : 6,
                height: on ? 10 : 6,
                opacity: shown ? 1 : 0,
                transform: shown ? "scale(1)" : "scale(0.4)",
                background: on
                  ? "linear-gradient(90deg, var(--brand-orange), var(--brand-purple))"
                  : "rgba(255,255,255,0.28)",
                boxShadow: on ? "0 0 0 3px rgba(255,255,255,0.12)" : "none",
              }}
            />
          </a>
        );
      })}
    </nav>
  );
}
