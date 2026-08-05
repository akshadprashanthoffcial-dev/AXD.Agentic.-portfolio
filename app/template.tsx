"use client";

// Re-mounts on every navigation → gives each page its settle-in entrance.
//
// The "page-enter" class drives a CSS animation (opacity/transform/filter)
// with fill-mode `both` so the entrance state holds. But a *finished*
// fill-mode animation stays "in effect" forever unless removed, and its
// resolved filter/transform values (interpolated against blur()/translateY())
// are never a true `none`, even when the keyframe says `none`. A non-none
// filter or transform on ANY ancestor permanently creates a new containing
// block for every position:fixed descendant, which breaks fixed lightboxes/
// modals anywhere on the page. So the class is dropped once the animation
// ends, returning this wrapper to a plain, unstyled div.
import { useEffect, useRef, useState } from "react";

export default function Template({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [entering, setEntering] = useState(true);

  useEffect(() => {
    // Mount-once: this component remounts fresh on every navigation
    // (that's the whole point of template.tsx), so there's no case
    // where `entering` needs to flip back to true after mount.
    const el = ref.current;
    if (!el) return;
    const onDone = () => setEntering(false);
    el.addEventListener("animationend", onDone);
    return () => el.removeEventListener("animationend", onDone);
  }, []);

  return (
    <div ref={ref} className={entering ? "page-enter" : undefined}>
      {children}
    </div>
  );
}
