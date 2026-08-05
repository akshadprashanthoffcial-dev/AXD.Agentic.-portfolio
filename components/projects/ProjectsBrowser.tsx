"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { PROJECTS, CATEGORIES, type Category, type Project } from "@/data/projects";
import Sparkles from "@/components/ui/Sparkles";
import { CATEGORY_ICONS } from "@/components/ui/Icons";
import { gsap, ScrollTrigger } from "@/lib/gsap";

export default function ProjectsBrowser() {
  const [active, setActive] = useState<Category | null>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const list = (active ? PROJECTS.filter((p) => p.categories.includes(active)) : PROJECTS)
    // Top work first, original order preserved within each tier.
    .slice()
    .sort((a, b) => Number(!!b.featured) - Number(!!a.featured));

  // Rows remount on every filter change (see the `key` below), so this
  // rebinds a fresh ScrollTrigger.batch each time rather than running once.
  // Rows already on screen when the filter changes reveal immediately, since
  // ScrollTrigger checks each new trigger's position against the current
  // scroll on creation; rows further down wait for the scroll to reach them.
  useEffect(() => {
    const rows = gsap.utils.toArray<HTMLElement>(".proj-row", listRef.current);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(rows, { opacity: 1 });
      return;
    }
    const ctx = gsap.context(() => {
      ScrollTrigger.batch(rows, {
        start: "top 90%",
        once: true,
        onEnter: (batch) =>
          gsap.fromTo(
            batch,
            { opacity: 0, y: 34, scale: 0.98, filter: "blur(8px)" },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              filter: "blur(0px)",
              duration: 0.85,
              ease: "power3.out",
              stagger: 0.1,
              overwrite: true,
            }
          ),
      });
      ScrollTrigger.refresh();
    }, listRef);
    return () => ctx.revert();
  }, [active, list.length]);

  return (
    <div>
      {/* Filter chips, kept to a single line */}
      <div className="filter-row mx-auto mb-16 max-w-5xl items-center">
        <FilterChip label="All" active={active === null} onClick={() => setActive(null)} />
        {CATEGORIES.map((c) => (
          <FilterChip
            key={c}
            label={c}
            active={active === c}
            onClick={() => setActive(active === c ? null : c)}
          />
        ))}
      </div>

      {/* Rows, image left, details right. Keying each row on the active
          filter remounts the list, so the scroll reveal above rebinds and
          replays on every filter change. */}
      <div ref={listRef} className="flex flex-col">
        {list.map((p) => (
          <Row key={`${active ?? "all"}-${p.slug}`} project={p} />
        ))}
      </div>

      {list.length === 0 && (
        <p className="py-16 text-center text-white/40">Nothing filed under that one yet.</p>
      )}
    </div>
  );
}

function Row({ project: p }: { project: Project }) {
  const external = Boolean(p.externalUrl);
  const rowClass =
    "proj-row group relative grid items-center gap-8 border-t border-white/10 py-10 transition-[border-color,background-color] duration-500 ease-out hover:border-white/25 hover:bg-white/[0.015] md:grid-cols-[minmax(0,0.95fr)_1.35fr] md:gap-14 md:py-14";
  // Read by the global cursor, which morphs into a pill with this text.
  const cursorLabel = external ? "View on Behance" : "View";

  const body = (
    <>
      {/* Cover */}
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl border border-white/10 transition-[transform,border-color] duration-500 ease-out group-hover:-translate-y-1 group-hover:border-white/20">
        {p.cover ? (
          <Image
            src={p.cover}
            alt={p.title}
            fill
            sizes="(max-width: 768px) 100vw, 42vw"
            className={`transition-transform duration-700 group-hover:scale-105 ${
              p.coverFit === "contain" ? "object-contain p-4" : "object-cover"
            }`}
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
        {p.featured && (
          <span
            className="top-badge absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full border border-white/20 px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.12em] text-white backdrop-blur-md"
            style={{ background: "var(--brand-sheen)" }}
          >
            <Sparkles size={12} tone="white" />
            Top work
          </span>
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
            {external ? "↗" : "→"}
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
        <span className="mt-4 inline-flex items-center gap-2.5 text-sm uppercase tracking-wide text-white/35">
          {p.clientLogo && (
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-white/95 p-1">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.clientLogo} alt="" className="max-h-full max-w-full object-contain" />
            </span>
          )}
          {p.client}
        </span>
      </div>
    </>
  );

  return external ? (
    <a
      href={p.externalUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={rowClass}
      data-cursor-label={cursorLabel}
    >
      {body}
    </a>
  ) : (
    <Link href={`/projects/${p.slug}`} className={rowClass} data-cursor-label={cursorLabel}>
      {body}
    </Link>
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
      aria-pressed={active}
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
