/**
 * Arrow keys, WASD, and swipe, all reduced to one "direction the player wants".
 * The simulation reads that whenever the blob reaches a tile centre.
 */

import { DIRS, type Dir } from "./game";

const KEYS: Record<string, Dir> = {
  ArrowUp: DIRS.up,
  ArrowDown: DIRS.down,
  ArrowLeft: DIRS.left,
  ArrowRight: DIRS.right,
  w: DIRS.up,
  a: DIRS.left,
  s: DIRS.down,
  d: DIRS.right,
};

/** Minimum swipe distance, in CSS pixels, before we call it a direction. */
const SWIPE = 24;

export type InputHandle = { dispose: () => void };

export function attachInput(
  target: HTMLElement,
  onDir: (dir: Dir) => void
): InputHandle {
  const onKey = (e: KeyboardEvent) => {
    const dir = KEYS[e.key] ?? KEYS[e.key.toLowerCase()];
    if (!dir) return;
    // Arrows scroll the page otherwise, which yanks the maze out of view.
    e.preventDefault();
    onDir(dir);
  };

  let startX = 0;
  let startY = 0;
  let tracking = false;

  const onTouchStart = (e: TouchEvent) => {
    const t = e.changedTouches[0];
    startX = t.clientX;
    startY = t.clientY;
    tracking = true;
  };

  const onTouchMove = (e: TouchEvent) => {
    if (!tracking) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - startX;
    const dy = t.clientY - startY;
    if (Math.abs(dx) < SWIPE && Math.abs(dy) < SWIPE) return;
    e.preventDefault();
    onDir(
      Math.abs(dx) > Math.abs(dy)
        ? dx > 0
          ? DIRS.right
          : DIRS.left
        : dy > 0
          ? DIRS.down
          : DIRS.up
    );
    // Re-anchor so a long drag can chain turns without lifting a finger.
    startX = t.clientX;
    startY = t.clientY;
  };

  const onTouchEnd = () => {
    tracking = false;
  };

  window.addEventListener("keydown", onKey);
  target.addEventListener("touchstart", onTouchStart, { passive: true });
  target.addEventListener("touchmove", onTouchMove, { passive: false });
  target.addEventListener("touchend", onTouchEnd, { passive: true });

  return {
    dispose() {
      window.removeEventListener("keydown", onKey);
      target.removeEventListener("touchstart", onTouchStart);
      target.removeEventListener("touchmove", onTouchMove);
      target.removeEventListener("touchend", onTouchEnd);
    },
  };
}
