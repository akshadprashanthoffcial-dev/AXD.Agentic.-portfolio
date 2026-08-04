"use client";

// ============================================================
// LiveDemo — a working port of Brand Studio from talent-cms-studio:
// pick a branding on the left, the career-site preview on the right
// re-skins instantly from that brand's real tokens (color, type,
// radius). No editing/chat here — Brand Studio is a branding picker,
// not a content editor, so this only ports that one behavior.
// ============================================================

import { useState } from "react";

type Brand = {
  id: string;
  name: string;
  primary: string;
  primaryContrast: string;
  bg: string;
  text: string;
  muted: string;
  radius: string;
  heading: string;
};

const BRANDS: Brand[] = [
  {
    id: "meridian",
    name: "Meridian Health",
    primary: "#0e7c66",
    primaryContrast: "#ffffff",
    bg: "#f5faf8",
    text: "#122420",
    muted: "#5b7370",
    radius: "12px",
    heading: "'DM Sans', sans-serif",
  },
  {
    id: "nova",
    name: "Nova Labs",
    primary: "#2563eb",
    primaryContrast: "#ffffff",
    bg: "#f7f9ff",
    text: "#0f172a",
    muted: "#5a6a85",
    radius: "10px",
    heading: "'Space Grotesk', sans-serif",
  },
  {
    id: "harvest",
    name: "Harvest & Co",
    primary: "#c2410c",
    primaryContrast: "#ffffff",
    bg: "#fffaf3",
    text: "#33251c",
    muted: "#8a7263",
    radius: "16px",
    heading: "'Manrope', sans-serif",
  },
  {
    id: "atlas",
    name: "Atlas Manufacturing",
    primary: "#1e3a5f",
    primaryContrast: "#ffffff",
    bg: "#f6f8fa",
    text: "#16222f",
    muted: "#5f6f7e",
    radius: "4px",
    heading: "'Roboto Slab', serif",
  },
  {
    id: "aurelia",
    name: "Aurelia Private Bank",
    primary: "#14281d",
    primaryContrast: "#f5efe0",
    bg: "#faf8f2",
    text: "#1c2620",
    muted: "#6e7a70",
    radius: "2px",
    heading: "'Playfair Display', serif",
  },
];

export default function LiveDemo() {
  const [brand, setBrand] = useState(BRANDS[1]);

  return (
    <div className="grid gap-0 overflow-hidden rounded-2xl border border-white/12 md:grid-cols-[280px_1fr]">
      {/* Brandings list */}
      <div className="border-b border-white/10 bg-white/[0.02] p-4 md:border-r md:border-b-0">
        <div className="mb-3 px-1 text-[11px] uppercase tracking-[0.2em] text-white/35">
          Brandings
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1 md:flex-col md:overflow-visible md:pb-0">
          {BRANDS.map((b) => {
            const active = b.id === brand.id;
            return (
              <button
                key={b.id}
                onClick={() => setBrand(b)}
                className={`flex shrink-0 items-center gap-3 rounded-xl border px-3.5 py-3 text-left transition-colors duration-200 md:w-full ${
                  active
                    ? "border-white/25 bg-white/[0.06]"
                    : "border-white/10 hover:border-white/18 hover:bg-white/[0.03]"
                }`}
              >
                <span className="relative flex h-6 w-9 shrink-0 items-center">
                  <span
                    className="absolute left-0 h-6 w-6 rounded-full border-2 border-black/40"
                    style={{ background: b.primary }}
                  />
                  <span
                    className="absolute left-3 h-6 w-6 rounded-full border-2 border-black/40"
                    style={{ background: b.muted }}
                  />
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-[13px] text-white/85">
                    {b.name}
                  </span>
                  <span className="block truncate text-[11px] text-white/35">
                    {b.heading.split(",")[0].replace(/['"]/g, "")}
                  </span>
                </span>
                {active && (
                  <span className="ml-auto shrink-0 text-brand" aria-hidden>
                    ✓
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Live preview */}
      <div>
        <div className="flex items-center gap-2 border-b border-white/10 bg-white/[0.02] px-5 py-3">
          <span className="h-1.5 w-1.5 rounded-full bg-brand" aria-hidden />
          <span className="text-[11px] uppercase tracking-[0.18em] text-white/40">
            Live preview — {brand.name}
          </span>
        </div>

        <div
          className="transition-colors duration-500"
          style={{ background: brand.bg, color: brand.text }}
        >
          {/* Mini nav */}
          <div
            className="flex items-center justify-between border-b px-6 py-4 sm:px-10"
            style={{ borderColor: "rgba(0,0,0,0.06)" }}
          >
            <div className="flex items-center gap-2.5">
              <span
                className="h-4 w-4 rounded-[4px]"
                style={{ background: brand.primary }}
              />
              <span
                className="text-[13px] font-semibold uppercase tracking-wide"
                style={{ fontFamily: brand.heading }}
              >
                {brand.name}
              </span>
            </div>
            <div className="hidden items-center gap-5 text-[13px] sm:flex" style={{ color: brand.muted }}>
              <span>Life</span>
              <span>Teams</span>
              <span>Jobs</span>
              <span
                className="rounded-md px-3.5 py-1.5 text-[12px] font-semibold"
                style={{
                  background: brand.primary,
                  color: brand.primaryContrast,
                  borderRadius: brand.radius,
                }}
              >
                View Jobs
              </span>
            </div>
          </div>

          {/* Hero */}
          <div className="px-6 py-14 text-center sm:px-12 sm:py-16">
            <div
              className="mb-4 text-[12px] font-semibold uppercase tracking-[0.2em]"
              style={{ color: brand.primary }}
            >
              Careers
            </div>
            <h3
              className="mx-auto max-w-lg text-[clamp(22px,3.6vw,34px)] font-bold leading-[1.15]"
              style={{ fontFamily: brand.heading }}
            >
              Grow your future with us
            </h3>
            <p
              className="mx-auto mt-4 max-w-sm text-[14px] leading-relaxed"
              style={{ color: brand.muted }}
            >
              A look at your body copy in this brand, re-skinned live from
              real tokens — color, type and radius, zero manual styling.
            </p>

            <div className="mt-7 flex items-center justify-center gap-3">
              <span
                className="px-5 py-2.5 text-[13px] font-semibold"
                style={{
                  background: brand.primary,
                  color: brand.primaryContrast,
                  borderRadius: brand.radius,
                }}
              >
                Primary CTA
              </span>
              <span
                className="border px-5 py-2.5 text-[13px] font-semibold"
                style={{
                  borderColor: brand.primary,
                  color: brand.primary,
                  borderRadius: brand.radius,
                }}
              >
                Secondary
              </span>
            </div>

            <div className="mx-auto mt-9 grid max-w-md grid-cols-3 gap-3">
              {["a", "b", "c"].map((k, i) => (
                <div
                  key={k}
                  className="rounded-lg border p-3"
                  style={{ borderColor: "rgba(0,0,0,0.08)", background: "rgba(255,255,255,0.5)" }}
                >
                  <span
                    className="mb-2 block h-4 w-4 rounded-full"
                    style={{ background: i === 1 ? brand.primary : brand.muted, opacity: i === 2 ? 0.35 : 1 }}
                  />
                  <span className="block h-1.5 w-full rounded-full" style={{ background: "rgba(0,0,0,0.08)" }} />
                  <span className="mt-1.5 block h-1.5 w-2/3 rounded-full" style={{ background: "rgba(0,0,0,0.06)" }} />
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div
            className="flex items-center justify-between px-6 py-3.5 text-[11px] sm:px-10"
            style={{ background: brand.text, color: "rgba(255,255,255,0.5)" }}
          >
            <span>© {brand.name}</span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full" style={{ background: brand.primary }} />
              <span className="h-2 w-2 rounded-full" style={{ background: brand.muted }} />
              <span className="h-2 w-2 rounded-full border border-white/40" />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
