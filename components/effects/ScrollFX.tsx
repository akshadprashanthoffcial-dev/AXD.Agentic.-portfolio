"use client";

import { useEffect } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

/**
 * Mount once per page to turn on GSAP ScrollTrigger for that page's content.
 * No visual output of its own, it scans for `data-reveal` and fades each
 * element up as it crosses into the viewport, batched so nearby elements
 * stagger together rather than firing independently.
 *
 * Scoped with gsap.context so every trigger it creates is torn down when the
 * page unmounts, since Next's client-side navigation would otherwise leave
 * stale ScrollTriggers pointed at detached nodes.
 */
export default function ScrollFX() {
  useEffect(() => {
    const reveals = gsap.utils.toArray<HTMLElement>("[data-reveal]");
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(reveals, { opacity: 1 });
      return;
    }

    const ctx = gsap.context(() => {
      ScrollTrigger.batch(reveals, {
        start: "top 87%",
        once: true,
        onEnter: (batch) =>
          gsap.fromTo(
            batch,
            { opacity: 0, y: 30, filter: "blur(7px)" },
            {
              opacity: 1,
              y: 0,
              filter: "blur(0px)",
              duration: 0.9,
              ease: "power3.out",
              stagger: 0.09,
              overwrite: true,
            }
          ),
      });
    });

    // New content (images finishing layout, fonts settling) shifts trigger
    // positions; catch up shortly after mount.
    const t = setTimeout(() => ScrollTrigger.refresh(), 300);
    return () => {
      clearTimeout(t);
      ctx.revert();
    };
  }, []);

  return null;
}
