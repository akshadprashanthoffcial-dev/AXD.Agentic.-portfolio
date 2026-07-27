type Props = {
  /** Diameter the rings start at, px (roughly the blob size). */
  base?: number;
  count?: number;
  className?: string;
};

/**
 * Concentric rings that pulse outward from behind the hero blob.
 * Centered on the parent; each ring expands + fades, staggered so a
 * continuous wave travels outward. Pure CSS.
 */
export default function RippleRings({
  base = 260,
  count = 4,
  className = "",
}: Props) {
  return (
    <div
      className={`pointer-events-none absolute inset-0 grid place-items-center ${className}`}
      aria-hidden="true"
    >
      {Array.from({ length: count }).map((_, i) => (
        <span
          key={i}
          className="col-start-1 row-start-1 rounded-full border"
          style={
            {
              width: base,
              height: base,
              borderColor: "rgba(200,140,255,0.45)",
              boxShadow: "0 0 24px rgba(161,31,242,0.25)",
              ["--ripple-op"]: 0.4,
              animation: `ripplePulse ${4.2}s ease-out ${(i * 4.2) / count}s infinite`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}
