import React from "react";

type Props = {
  children: React.ReactNode;
  /** Corner radius, px. */
  radius?: number;
  /** Frost strength 0..1 — higher = more opaque (more readable text). */
  frost?: number;
  className?: string;
  style?: React.CSSProperties;
};

/**
 * Liquid-glass surface: frosted backdrop blur + brand tint + a refractive
 * SVG displacement, a glassy inset rim, and a slow sheen sweep. The effect
 * lives ONLY inside the box; content sits above it and stays readable.
 */
export default function LiquidGlass({
  children,
  radius = 32,
  frost = 0.14,
  className = "",
  style,
}: Props) {
  return (
    <div
      className={`relative isolate overflow-hidden ${className}`}
      style={{ borderRadius: radius, ...style }}
    >
      {/* Glass layer — reliable frosted blur */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10"
        style={{
          borderRadius: radius,
          backdropFilter: "blur(14px) saturate(1.7)",
          WebkitBackdropFilter: "blur(14px) saturate(1.7)",
          background: `linear-gradient(180deg, rgba(255,255,255,${frost}), rgba(255,255,255,${
            frost * 0.35
          })), var(--brand-sheen-soft)`,
          boxShadow:
            "inset 0 1px 0 rgba(255,255,255,0.35), inset 0 0 0 1px rgba(255,255,255,0.12), inset 0 -8px 24px rgba(0,0,0,0.25)",
        }}
      />
      {/* Liquid refraction texture (distortion applied to the layer itself) */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-40 mix-blend-overlay"
        style={{
          borderRadius: radius,
          background: "var(--brand-sheen)",
          filter: "url(#axd-liquid)",
        }}
      />
      {/* Sheen sweep */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 -z-10 w-1/3"
        style={{
          background:
            "linear-gradient(105deg, transparent, rgba(255,255,255,0.18), transparent)",
          animation: "glassSheen 7s ease-in-out infinite",
        }}
      />
      {children}
    </div>
  );
}

/** Inject once (e.g. in layout) so the displacement filter is available. */
export function GlassFilterDefs() {
  return (
    <svg
      aria-hidden
      width="0"
      height="0"
      style={{ position: "absolute", width: 0, height: 0 }}
    >
      <defs>
        <filter id="axd-liquid" x="0%" y="0%" width="100%" height="100%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.008 0.012"
            numOctaves="2"
            seed="7"
            result="noise"
          />
          <feGaussianBlur in="noise" stdDeviation="2" result="blur" />
          <feDisplacementMap
            in="SourceGraphic"
            in2="blur"
            scale="42"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </defs>
    </svg>
  );
}
