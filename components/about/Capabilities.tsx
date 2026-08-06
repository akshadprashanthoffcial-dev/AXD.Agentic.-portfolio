"use client";

import { useRef } from "react";
import { OPERATOR } from "@/data/operator";
import { CATEGORY_ICONS } from "@/components/ui/Icons";

/**
 * "What I do" as a numbered statement list rather than a chip cloud, since
 * five sentences read as a claim, not a keyword dump. Each row has its own
 * icon and a supporting line, and lights up the number + icon on hover.
 */
export default function Capabilities() {
  return (
    <ol className="flex flex-col">
      {OPERATOR.capabilities.map((c, i) => (
        <Row key={c.label} index={i} {...c} />
      ))}
    </ol>
  );
}

function Row({
  index,
  icon,
  label,
  detail,
}: {
  index: number;
  icon: string;
  label: string;
  detail: string;
}) {
  const ref = useRef<HTMLLIElement>(null);
  const Icon = CATEGORY_ICONS[icon];

  return (
    <li
      ref={ref}
      className="group flex items-start gap-5 border-t border-white/10 py-5 first:border-t-0"
    >
      <span className="font-display mt-0.5 w-6 shrink-0 text-sm text-white/40 transition-colors duration-300 group-hover:text-white/72">
        {String(index + 1).padStart(2, "0")}
      </span>
      <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/12 transition-[border-color,transform] duration-300 group-hover:-translate-y-0.5 group-hover:border-white/30">
        {Icon ? <Icon size={16} /> : null}
      </span>
      <div className="min-w-0">
        <p className="font-display text-[19px] leading-snug text-white">{label}</p>
        <p className="mt-1 text-[14px] leading-relaxed text-white/55">{detail}</p>
      </div>
    </li>
  );
}
