/**
 * Small line-icon set drawn to match the brand, gradient stroke, 24-grid,
 * rounded caps. Each icon is chosen to match the meaning of its label so the
 * suggestion chips and project filters read at a glance. Built on
 * lucide-react (shadcn's icon set); the shared gradient is defined once in
 * the root layout (id="axd-ic") and referenced here by url(#axd-ic).
 */

import {
  User,
  LayoutGrid,
  Mail,
  PlayCircle,
  BadgeCheck,
  AppWindow,
  Compass,
  Eye,
  Lightbulb,
  Layers,
  Waypoints,
  Briefcase,
  MapPin,
  type LucideIcon,
} from "lucide-react";

type IconProps = { size?: number; tone?: "gradient" | "white" };

function make(Lucide: LucideIcon) {
  return function Icon({ size = 18, tone = "gradient" }: IconProps) {
    const stroke = tone === "white" ? "rgba(255,255,255,0.8)" : "url(#axd-ic)";
    return (
      <Lucide
        size={size}
        stroke={stroke}
        strokeWidth={1.7}
        fill="none"
        aria-hidden="true"
      />
    );
  };
}

/* ---- intent icons (home suggestion chips) ---- */

// "Who is Akshad?" → a person.
export const UserIcon = make(User);

// "Show me the projects" → a gallery grid.
export const GridIcon = make(LayoutGrid);

// "How do I get in touch?" → an envelope.
export const MailIcon = make(Mail);

/* ---- category icons (project filters) ---- */

// Motion Graphics → a play control.
export const MotionIcon = make(PlayCircle);

// Brand Identity → a badge / seal.
export const BrandIcon = make(BadgeCheck);

// Web Designs → a browser window.
export const WebIcon = make(AppWindow);

// Art Direction (retired filter) → a compass.
export const ArtDirectionIcon = make(Compass);

// Visual Design → an eye.
export const VisualIcon = make(Eye);

// Projects → a lightbulb.
export const ProjectIcon = make(Lightbulb);

// Product Design → layered artboards.
export const ProductIcon = make(Layers);

// Experience Design → a journey of connected nodes.
export const ExperienceIcon = make(Waypoints);

// Current role, a briefcase. Sits beside the title on the about page.
export const RoleIcon = make(Briefcase);

// Where I'm from, a map pin. Sits under the title on the about page.
export const PinIcon = make(MapPin);

/* ---- lookup helpers ---- */

export const SUGGESTION_ICONS = {
  user: UserIcon,
  grid: GridIcon,
  mail: MailIcon,
} as const;

export type SuggestionIcon = keyof typeof SUGGESTION_ICONS;

export const CATEGORY_ICONS: Record<string, (p: IconProps) => React.ReactElement> = {
  "Visual Design": VisualIcon,
  "Brand Identity": BrandIcon,
  "Product Design": ProductIcon,
  "Experience Design": ExperienceIcon,
  "Web Designs": WebIcon,
  "Motion Graphics": MotionIcon,
  Projects: ProjectIcon,
  // Retired filter, kept so any older tag still renders an icon.
  "Art Direction": ArtDirectionIcon,
};
