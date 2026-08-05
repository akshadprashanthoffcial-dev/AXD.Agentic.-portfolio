"use client";

import { useRef } from "react";
import { OPERATOR } from "@/data/operator";

/**
 * The toolkit, grouped. A brand-tinted spotlight follows the cursor across the
 * panel (position piped into CSS custom properties, so no re-renders), and each
 * row lights up on hover.
 */
export default function Toolkit() {
  const ref = useRef<HTMLDivElement>(null);
  const raf = useRef(0);

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame(() => {
      el.style.setProperty("--mx", `${e.clientX - r.left}px`);
      el.style.setProperty("--my", `${e.clientY - r.top}px`);
      el.style.setProperty("--spot", "1");
    });
  };

  const onLeave = () => {
    cancelAnimationFrame(raf.current);
    ref.current?.style.setProperty("--spot", "0");
  };

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className="spotlight relative grid gap-x-12 gap-y-10 rounded-3xl border border-white/10 p-6 sm:grid-cols-2 md:p-8"
    >
      {OPERATOR.toolGroups.map((g) => (
        <div key={g.group} className="relative z-10">
          <p className="mb-4 text-[11px] uppercase tracking-[0.18em] text-white/35">
            {g.group}
          </p>
          <ul className="flex flex-col">
            {g.items.map((t) => (
              <li
                key={t.name}
                className="group flex items-baseline justify-between gap-4 border-b border-white/10 py-2.5 transition-colors duration-300 last:border-b-0 hover:border-white/25"
              >
                <span className="min-w-0 text-white/80 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-white">
                  {t.name}
                </span>
                <span className="shrink-0 text-right text-sm text-white/30 transition-colors duration-300 group-hover:text-white/60">
                  {t.use}
                </span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
