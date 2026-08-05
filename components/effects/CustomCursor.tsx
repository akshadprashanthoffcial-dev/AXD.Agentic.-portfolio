"use client";

import { useEffect, useRef } from "react";

/**
 * Site-wide custom cursor. Two states, one element:
 *
 * 1. Default — a small circle with `mix-blend-mode: difference`, so it always
 *    reads as a "negative" against whatever is under it (white on dark,
 *    inverted on light) rather than needing a colour of its own.
 * 2. Morphed — hovering any element carrying `data-cursor-label` grows the
 *    dot into a pill (matching the site's standard transparent-chip style)
 *    showing that label. Blend mode is dropped for this state, since the
 *    pill needs to render as itself, not invert its surroundings.
 *
 * A tight rAF spring drives position so it trails just enough to feel
 * physical without lagging behind the pointer. Fine pointers only; the
 * native cursor stays on touch devices (see the `cursor: none` rule, which
 * is scoped to `(hover: hover) and (pointer: fine)` in globals.css).
 */
export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const dot = dotRef.current;
    const label = labelRef.current;
    if (!dot || !label) return;

    const pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const target = { ...pos };
    let frame = 0;
    let visible = false;
    let morphed = false;
    let currentLabel = "";

    const SPRING = 0.32;

    const onMove = (e: PointerEvent) => {
      target.x = e.clientX;
      target.y = e.clientY;

      if (!visible) {
        visible = true;
        pos.x = target.x;
        pos.y = target.y;
        dot.classList.add("in");
      }

      const morphEl = (e.target as HTMLElement).closest<HTMLElement>("[data-cursor-label]");
      const interactive =
        !morphEl && (e.target as HTMLElement).closest("a, button, [role='button'], input, textarea, select");

      if (morphEl) {
        const next = morphEl.dataset.cursorLabel ?? "";
        if (!morphed || next !== currentLabel) {
          currentLabel = next;
          label.textContent = next;
          morphed = true;
          dot.classList.add("morphed");
          dot.classList.remove("hover");
        }
      } else if (morphed) {
        morphed = false;
        dot.classList.remove("morphed");
      }

      if (!morphEl) dot.classList.toggle("hover", Boolean(interactive));
    };

    const onLeaveWindow = () => {
      visible = false;
      morphed = false;
      dot.classList.remove("in", "morphed", "hover");
    };

    const tick = () => {
      frame = requestAnimationFrame(tick);
      pos.x += (target.x - pos.x) * SPRING;
      pos.y += (target.y - pos.y) * SPRING;
      dot.style.transform = `translate3d(${pos.x.toFixed(1)}px, ${pos.y.toFixed(1)}px, 0)`;
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("mouseleave", onLeaveWindow);
    frame = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("mouseleave", onLeaveWindow);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div ref={dotRef} className="global-cursor" aria-hidden>
      <span ref={labelRef} className="global-cursor-label" />
    </div>
  );
}
