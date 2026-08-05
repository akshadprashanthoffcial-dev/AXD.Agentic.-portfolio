// ============================================================
// FeatureBlock, one product surface, argued as
// Problem → Solution → Impact, next to the screen that proves it.
// Alternates side so the page has rhythm.
// ============================================================

import ScreenFrame from "./ScreenFrame";
import Reveal from "@/components/ui/Reveal";

export type Feature = {
  n: string;
  name: string;
  problem: string;
  solution: string;
  impact: string;
  /** Implementation note, the design-engineer layer. Optional. */
  build?: string;
  shot?: {
    src: string;
    alt: string;
    caption?: string;
    ratio?: number;
    /** Portrait panels get capped so they don't tower over the copy. */
    narrow?: boolean;
  };
};

export default function FeatureBlock({
  feature,
  flip = false,
}: {
  feature: Feature;
  flip?: boolean;
}) {
  const { n, name, problem, solution, impact, build, shot } = feature;

  return (
    <div
      id={`feature-${n}`}
      className={`grid scroll-mt-28 items-center gap-10 border-t border-white/[0.07] py-16 md:gap-14 lg:py-20 ${
        shot ? "lg:grid-cols-2" : ""
      }`}
    >
      <Reveal className={`${flip ? "lg:order-2" : ""} ${shot ? "" : "max-w-3xl"}`}>
        <div className="mb-4 flex items-center gap-3">
          <span className="text-brand font-display text-[13px]">{n}</span>
          <h3 className="font-display text-[clamp(22px,3.4vw,32px)] text-white">
            {name}
          </h3>
        </div>

        <dl className="space-y-5">
          <Row label="Problem" tone="text-[#ef3c3f]/80" value={problem} />
          <Row label="Solution" tone="text-[#f59b00]/85" value={solution} />
          <Row label="Impact" tone="text-[#c88cff]" value={impact} />
        </dl>

        {build && (
          <div
            className="mt-6 rounded-xl border border-white/10 px-5 py-4"
            style={{ background: "var(--brand-sheen-soft)" }}
          >
            <div className="mb-1.5 text-[11px] uppercase tracking-[0.2em] text-white/35">
              How it's built
            </div>
            <p className="font-mono text-[13px] leading-relaxed text-white/55">
              {build}
            </p>
          </div>
        )}
      </Reveal>

      {shot && (
        <div className={flip ? "lg:order-1" : ""}>
          <ScreenFrame
            src={shot.src}
            alt={shot.alt}
            caption={shot.caption}
            ratio={shot.ratio}
            className={shot.narrow ? "mx-auto max-w-[360px]" : ""}
            sizes={
              shot.narrow
                ? "(max-width: 1024px) 90vw, 360px"
                : "(max-width: 1024px) 100vw, 560px"
            }
          />
        </div>
      )}
    </div>
  );
}

function Row({
  label,
  tone,
  value,
}: {
  label: string;
  tone: string;
  value: string;
}) {
  return (
    <div className="grid gap-1 sm:grid-cols-[92px_1fr] sm:gap-5">
      <dt className={`pt-0.5 text-[11px] uppercase tracking-[0.2em] ${tone}`}>
        {label}
      </dt>
      <dd className="text-[15px] leading-relaxed text-white/60">{value}</dd>
    </div>
  );
}
