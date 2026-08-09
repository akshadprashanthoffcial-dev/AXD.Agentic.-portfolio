"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

const COLS = 18;
const ROWS = 12;
/** Per-row stagger and per-cell animation length, in ms. */
const STEP = 34;
const CELL_MS = 170;

type Props = {
  /** "cover" fills the screen with pixels; "reveal" clears them away. */
  mode: "cover" | "reveal";
  onDone?: () => void;
};

/**
 * The doorway into the arcade: a grid of pixels drops in from the top and
 * rises from the bottom until the screen is full, then does the reverse on the
 * other side of the navigation. Because the covering half ends fully covered
 * and the revealing half starts that way, the route change is invisible.
 *
 * Rendered through a portal on purpose. This is a `position: fixed` overlay,
 * and any ancestor carrying a transform or filter would silently turn itself
 * into its containing block — the same trap that pinned the case-study
 * lightbox thousands of pixels down the page (see DECISIONS.md v0.8).
 */
export default function PixelWipe({ mode, onDone }: Props) {
  const [on, setOn] = useState(false);
  const [ready, setReady] = useState(false);
  const doneRef = useRef(onDone);
  doneRef.current = onDone;

  useEffect(() => setReady(true), []);

  useEffect(() => {
    if (!ready) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // Half the rows stagger in from each edge, so the wave meets in the middle.
    const total = reduce ? 0 : (ROWS / 2) * STEP + CELL_MS;

    // Start on the next frame so the cells animate from their resting state.
    const raf = requestAnimationFrame(() => setOn(true));
    const t = window.setTimeout(() => doneRef.current?.(), total + 40);
    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(t);
    };
  }, [ready]);

  if (!ready) return null;

  const cells = [];
  for (let r = 0; r < ROWS; r++) {
    // Distance from whichever edge this row is nearest.
    const fromEdge = Math.min(r, ROWS - 1 - r);
    for (let c = 0; c < COLS; c++) {
      // A little per-column jitter keeps the edge from looking machine-cut.
      const jitter = ((c * 7 + r * 13) % 5) * 6;
      cells.push(
        <i key={`${r}-${c}`} style={{ animationDelay: `${fromEdge * STEP + jitter}ms` }} />
      );
    }
  }

  return createPortal(
    <div
      className={`pixel-wipe pixel-wipe--${mode} ${on ? "is-on" : ""}`}
      style={{ "--cols": COLS, "--rows": ROWS } as React.CSSProperties}
      aria-hidden
    >
      {cells}
    </div>,
    document.body
  );
}
