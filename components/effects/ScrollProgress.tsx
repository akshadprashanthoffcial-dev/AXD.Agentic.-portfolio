"use client";

import { useEffect, useRef } from "react";

/**
 * Brand-gradient reading-progress rail pinned to the top of the viewport.
 * Started life inside the CMS case study (`CaseProgress`); it now lives here
 * because every project page carries it.
 *
 * The width is written straight to `transform` from the rAF callback rather
 * than through React state, so a fast scroll doesn't queue a render per frame.
 */
export default function ScrollProgress() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const el = ref.current;
        if (!el) return;
        const max = document.documentElement.scrollHeight - window.innerHeight;
        const pct = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
        el.style.transform = `scaleX(${pct})`;
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
  }, []);

  return <div ref={ref} className="case-progress" style={{ transform: "scaleX(0)" }} aria-hidden />;
}
