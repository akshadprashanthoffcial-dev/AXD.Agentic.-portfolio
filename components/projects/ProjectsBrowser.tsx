"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { PROJECTS, CATEGORIES, type Category } from "@/data/projects";
import Sparkles from "@/components/ui/Sparkles";
import { CATEGORY_ICONS } from "@/components/ui/Icons";

export default function ProjectsBrowser() {
  const [active, setActive] = useState<Category | null>(null);
  const list = active
    ? PROJECTS.filter((p) => p.categories.includes(active))
    : PROJECTS;

  return (
    <div>
      {/* Filter chips */}
      <div className="mx-auto mb-16 flex max-w-4xl flex-wrap items-center justify-center gap-3">
        <FilterChip
          label="All"
          active={active === null}
          onClick={() => setActive(null)}
        />
        {CATEGORIES.map((c) => (
          <FilterChip
            key={c}
            label={c}
            active={active === c}
            onClick={() => setActive(active === c ? null : c)}
          />
        ))}
      </div>

      {/* Rows — image left, details right (matches Figma) */}
      <div className="flex flex-col">
        {list.map((p) => (
          <Link
            key={p.slug}
            href={`/projects/${p.slug}`}
            className="group relative grid items-center gap-8 border-t border-white/10 py-10 transition-[border-color,background-color] duration-500 ease-out hover:border-white/25 hover:bg-white/[0.015] md:grid-cols-[minmax(0,0.95fr)_1.35fr] md:gap-14 md:py-14"
          >
            {/* Cover */}
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl border border-white/10 transition-[transform,border-color] duration-500 ease-out group-hover:-translate-y-1 group-hover:border-white/20">
              {p.cover ? (
                <Image
                  src={p.cover}
                  alt={p.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 42vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
              ) : (
                <div
                  className="h-full w-full transition-transform duration-700 group-hover:scale-105"
                  style={{
                    background:
                      "radial-gradient(120% 120% at 30% 0%, rgba(161,31,242,0.14), rgba(245,155,0,0.07) 40%, rgba(255,255,255,0.02))",
                  }}
                />
              )}
            </div>

            {/* Details */}
            <div className="transition-transform duration-500 ease-out md:group-hover:translate-x-2">
              <h3 className="font-display flex items-center gap-3 text-[clamp(30px,4.4vw,52px)] leading-[1.02] text-white">
                <span>{p.title}</span>
                <span
                  aria-hidden
                  className="translate-x-[-6px] text-[0.5em] text-white/40 opacity-0 transition-all duration-500 ease-out group-hover:translate-x-0 group-hover:text-white/70 group-hover:opacity-100"
                >
                  →
                </span>
              </h3>
              <div className="mt-5 flex flex-wrap gap-2.5">
                {p.categories.map((c) => {
                  const CatIcon = CATEGORY_ICONS[c];
                  return (
                    <span
                      key={c}
                      className="inline-flex items-center gap-1.5 rounded-full border border-white/15 px-3.5 py-1.5 text-[13px] text-white/75"
                      style={{ background: "var(--brand-sheen)" }}
                    >
                      {CatIcon ? <CatIcon size={13} /> : <Sparkles size={13} />}
                      {c}
                    </span>
                  );
                })}
              </div>
              <p className="mt-5 max-w-lg text-white/45">{p.summary}</p>
              <span className="mt-4 inline-block text-sm uppercase tracking-wide text-white/35">
                {p.client}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

function FilterChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  const CatIcon = CATEGORY_ICONS[label];
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition-all duration-300 ${
        active
          ? "border-transparent text-white"
          : "border-white/15 text-white/65 hover:border-white/35 hover:text-white"
      }`}
      style={active ? { background: "var(--brand-gradient)" } : { background: "var(--brand-sheen)" }}
    >
      {CatIcon ? (
        <CatIcon size={14} tone={active ? "white" : "gradient"} />
      ) : (
        <Sparkles size={14} tone={active ? "white" : "gradient"} />
      )}
      {label}
    </button>
  );
}
