import Link from "next/link";
import Sparkles from "@/components/ui/Sparkles";
import { SUGGESTION_ICONS, type SuggestionIcon } from "@/components/ui/Icons";

type Props = {
  label: string;
  href?: string;
  onClick?: () => void;
  /** Named icon that matches the meaning of the label. Falls back to sparkles. */
  icon?: SuggestionIcon;
};

const chipClass =
  "group inline-flex items-center gap-2.5 rounded-full border border-white/15 px-4 py-2.5 text-[15px] font-medium text-white/80 " +
  "shadow-[0_10px_24px_rgba(0,0,0,0.4)] backdrop-blur-sm transition-all duration-300 " +
  "hover:border-white/35 hover:text-white hover:-translate-y-0.5";

const chipStyle = { background: "var(--brand-sheen)" } as React.CSSProperties;

export default function SuggestionChip({ label, href, onClick, icon }: Props) {
  const Icon = icon ? SUGGESTION_ICONS[icon] : null;
  const inner = (
    <>
      {Icon ? <Icon size={18} /> : <Sparkles size={18} />}
      <span className="whitespace-nowrap">{label}</span>
    </>
  );

  if (href) {
    return (
      <Link href={href} className={chipClass} style={chipStyle}>
        {inner}
      </Link>
    );
  }
  return (
    <button type="button" onClick={onClick} className={chipClass} style={chipStyle}>
      {inner}
    </button>
  );
}
