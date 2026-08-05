/**
 * Tool marks for the about-page marquee. Simplified, hand-drawn homages of
 * each product's icon in its own brand colour, sized on a 24-grid. Adobe apps
 * keep their familiar lettered tile, which is how they read at this size.
 * No hooks, so these stay usable from server components.
 */

type Props = { size?: number };

function Tile({
  size = 24,
  fill,
  stroke,
  label,
  color,
}: Props & { fill: string; stroke: string; label: string; color: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <rect x="1.5" y="1.5" width="21" height="21" rx="5" fill={fill} stroke={stroke} />
      <text
        x="12"
        y="16.4"
        textAnchor="middle"
        fontSize="10"
        fontWeight="700"
        fontFamily="system-ui, sans-serif"
        fill={color}
      >
        {label}
      </text>
    </svg>
  );
}

export function FigmaLogo({ size = 24 }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M8.5 2h3.5v5H8.5a2.5 2.5 0 0 1 0-5z" fill="#F24E1E" />
      <path d="M12 2h3.5a2.5 2.5 0 0 1 0 5H12V2z" fill="#FF7262" />
      <path d="M12 7h3.5a2.5 2.5 0 0 1 0 5H12V7z" fill="#A259FF" />
      <path d="M8.5 7H12v5H8.5a2.5 2.5 0 0 1 0-5z" fill="#1ABCFE" />
      <path d="M8.5 12H12v2.5a2.5 2.5 0 1 1-3.5-2.5z" fill="#0ACF83" />
    </svg>
  );
}

export const AfterEffectsLogo = (p: Props) => (
  <Tile {...p} fill="#00005B" stroke="#9999FF" label="Ae" color="#9999FF" />
);
export const PhotoshopLogo = (p: Props) => (
  <Tile {...p} fill="#001E36" stroke="#31A8FF" label="Ps" color="#31A8FF" />
);
export const IllustratorLogo = (p: Props) => (
  <Tile {...p} fill="#330000" stroke="#FF9A00" label="Ai" color="#FF9A00" />
);

export function ProcreateLogo({ size = 24 }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <defs>
        <linearGradient id="pcr" x1="0" y1="0" x2="24" y2="24">
          <stop stopColor="#FFC700" />
          <stop offset="0.5" stopColor="#FF5A5A" />
          <stop offset="1" stopColor="#8E4BFF" />
        </linearGradient>
      </defs>
      <rect x="1.5" y="1.5" width="21" height="21" rx="6" fill="url(#pcr)" />
      <path
        d="M7.5 16c1.6.6 3.2.4 4.6-.6 1.5-1 2-2.6 1.4-3.9-.5-1-1.7-1.3-2.5-.7-.7.5-.8 1.5-.2 2"
        stroke="#fff"
        strokeWidth="1.6"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

export function BlenderLogo({ size = 24 }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="13" cy="14" r="6.4" fill="#EA7600" />
      <circle cx="13" cy="14" r="3" fill="#fff" />
      <circle cx="13" cy="14" r="1.5" fill="#265787" />
      <path d="M3 10.5h7.5L6.2 14 3 10.5z" fill="#265787" />
      <path d="M8 6.6l6.6 2.2-2.2 1.4L8 6.6z" fill="#265787" />
    </svg>
  );
}

export function FramerLogo({ size = 24 }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5.5 2.5h13v6.5h-6.5l-6.5-6.5z" fill="#0099FF" />
      <path d="M5.5 9h13l-6.5 6.5H5.5V9z" fill="#66C2FF" />
      <path d="M12 15.5v6l-6.5-6.5H12z" fill="#0099FF" />
    </svg>
  );
}

export function ClaudeLogo({ size = 24 }: Props) {
  // Anthropic's burst mark, simplified to eight tapered rays.
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <g fill="#D97757">
        {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
          <rect
            key={a}
            x="11"
            y="2.6"
            width="2"
            height="8.8"
            rx="1"
            transform={`rotate(${a} 12 12)`}
          />
        ))}
      </g>
    </svg>
  );
}

export function CursorLogo({ size = 24 }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 2.5l8.5 4.9v9.2L12 21.5 3.5 16.6V7.4L12 2.5z" fill="#3E3E3E" />
      <path d="M12 2.5l8.5 4.9L12 12.3 3.5 7.4 12 2.5z" fill="#8A8A8A" />
      <path d="M12 12.3l8.5-4.9v9.2L12 21.5v-9.2z" fill="#5C5C5C" />
    </svg>
  );
}

export function MidjourneyLogo({ size = 24 }: Props) {
  // The sailboat mark, pared back to hull + sails.
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" fill="none">
      <path
        d="M3 15.5c3.2-.6 5.4-2.6 6.6-6 .9-2.6 1.3-4 1.3-4s.5 2.4 2 4.6c1.5 2.2 3.6 3.7 6.1 4.3"
        stroke="#fff"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4 17.4c2.4 1.6 5 2.4 8 2.4s5.6-.8 8-2.4"
        stroke="#fff"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function GeminiLogo({ size = 24 }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <defs>
        <linearGradient id="gem" x1="2" y1="20" x2="22" y2="4">
          <stop stopColor="#4796E3" />
          <stop offset="0.5" stopColor="#9177C7" />
          <stop offset="1" stopColor="#D96570" />
        </linearGradient>
      </defs>
      <path
        d="M12 2c.5 5.2 4.8 9.5 10 10-5.2.5-9.5 4.8-10 10-.5-5.2-4.8-9.5-10-10 5.2-.5 9.5-4.8 10-10z"
        fill="url(#gem)"
      />
    </svg>
  );
}

export function RunwayLogo({ size = 24 }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <rect x="2.5" y="2.5" width="19" height="19" rx="4" fill="#fff" />
      <path d="M9 7.5l7 4.5-7 4.5v-9z" fill="#000" />
    </svg>
  );
}

export function VeoLogo({ size = 24 }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" fill="none">
      <defs>
        <linearGradient id="veo" x1="3" y1="20" x2="21" y2="4">
          <stop stopColor="#4796E3" />
          <stop offset="1" stopColor="#D96570" />
        </linearGradient>
      </defs>
      <rect x="2.5" y="4.5" width="19" height="15" rx="4" stroke="url(#veo)" strokeWidth="1.8" />
      <path d="M10 9.6l5 2.4-5 2.4V9.6z" fill="url(#veo)" />
    </svg>
  );
}

/** name (as used in data/operator.ts) → mark */
export const TOOL_LOGOS: Record<string, (p: Props) => React.ReactElement> = {
  Figma: FigmaLogo,
  "Figma MCP": FigmaLogo,
  "After Effects": AfterEffectsLogo,
  Photoshop: PhotoshopLogo,
  Illustrator: IllustratorLogo,
  Procreate: ProcreateLogo,
  Blender: BlenderLogo,
  Framer: FramerLogo,
  "Claude Code": ClaudeLogo,
  Cursor: CursorLogo,
  Midjourney: MidjourneyLogo,
  Gemini: GeminiLogo,
  Runway: RunwayLogo,
  "Veo-3": VeoLogo,
};
