/**
 * Small line-icon set drawn to match the brand — gradient stroke, 24-grid,
 * rounded caps. Each icon is chosen to match the meaning of its label so the
 * suggestion chips and project filters read at a glance. No hooks, so these
 * are safe inside server components (same pattern as Sparkles).
 */

type IconProps = { size?: number; tone?: "gradient" | "white" };

function Svg({
  size = 18,
  tone = "gradient",
  children,
}: IconProps & { children: React.ReactNode }) {
  const stroke = tone === "white" ? "rgba(255,255,255,0.8)" : "url(#axd-ic)";
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={stroke}
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {tone === "gradient" && (
        <defs>
          <linearGradient id="axd-ic" x1="0" y1="0" x2="24" y2="24">
            <stop stopColor="#F59B00" />
            <stop offset="0.5" stopColor="#A11FF2" />
            <stop offset="1" stopColor="#EF3C3F" />
          </linearGradient>
        </defs>
      )}
      {children}
    </svg>
  );
}

/* ---- intent icons (home suggestion chips) ---- */

// "Who is Akshad?" → a person.
export function UserIcon(p: IconProps) {
  return (
    <Svg {...p}>
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5 20c0-3.6 3.1-6 7-6s7 2.4 7 6" />
    </Svg>
  );
}

// "Show me the projects" → a gallery grid.
export function GridIcon(p: IconProps) {
  return (
    <Svg {...p}>
      <rect x="3.5" y="3.5" width="7" height="7" rx="1.5" />
      <rect x="13.5" y="3.5" width="7" height="7" rx="1.5" />
      <rect x="3.5" y="13.5" width="7" height="7" rx="1.5" />
      <rect x="13.5" y="13.5" width="7" height="7" rx="1.5" />
    </Svg>
  );
}

// "How do I get in touch?" → an envelope.
export function MailIcon(p: IconProps) {
  return (
    <Svg {...p}>
      <rect x="3" y="5" width="18" height="14" rx="3" />
      <path d="M4 7l8 6 8-6" />
    </Svg>
  );
}

/* ---- category icons (project filters) ---- */

// Motion Graphics → a play triangle.
export function MotionIcon(p: IconProps) {
  return (
    <Svg {...p}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M10.5 9l5 3-5 3z" />
    </Svg>
  );
}

// Brand Identity → a badge / seal.
export function BrandIcon(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M12 3l2.2 1.6 2.7-.2.9 2.6 2.2 1.6-.9 2.6.9 2.6-2.2 1.6-.9 2.6-2.7-.2L12 21l-2.2-1.6-2.7.2-.9-2.6L4 15.6l.9-2.6L4 10.4l2.2-1.6.9-2.6 2.7.2z" />
      <path d="M9.5 12l1.8 1.8 3.2-3.6" />
    </Svg>
  );
}

// Web Designs → a browser window.
export function WebIcon(p: IconProps) {
  return (
    <Svg {...p}>
      <rect x="3" y="4.5" width="18" height="15" rx="2.5" />
      <path d="M3 9h18" />
      <path d="M6 6.75h.01M8.5 6.75h.01" />
    </Svg>
  );
}

// Art Direction → a compass (setting the direction).
export function ArtDirectionIcon(p: IconProps) {
  return (
    <Svg {...p}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M15.2 8.8l-1.6 4-4 1.6 1.6-4z" />
    </Svg>
  );
}

// Visual Design → an eye.
export function VisualIcon(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z" />
      <circle cx="12" cy="12" r="2.6" />
    </Svg>
  );
}

/* ---- lookup helpers ---- */

export const SUGGESTION_ICONS = {
  user: UserIcon,
  grid: GridIcon,
  mail: MailIcon,
} as const;

export type SuggestionIcon = keyof typeof SUGGESTION_ICONS;

export const CATEGORY_ICONS: Record<string, (p: IconProps) => React.ReactElement> = {
  "Motion Graphics": MotionIcon,
  "Brand Identity": BrandIcon,
  "Web Designs": WebIcon,
  "Art Direction": ArtDirectionIcon,
  "Visual Design": VisualIcon,
};
