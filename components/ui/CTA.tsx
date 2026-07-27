import Link from "next/link";
import Sparkles from "@/components/ui/Sparkles";

type Props = {
  label: string;
  href?: string;
  external?: boolean;
  size?: "md" | "lg";
  className?: string;
};

/**
 * The primary call-to-action pill, matching Figma CTA.svg:
 * brand gradient fill at 14%, white/15 2px border, white sparkle + label,
 * and a soft downward drop shadow.
 */
export default function CTA({
  label,
  href,
  external,
  size = "lg",
  className = "",
}: Props) {
  const pad = size === "lg" ? "px-8 py-5 text-[19px]" : "px-6 py-3.5 text-[16px]";
  const cls =
    `group inline-flex items-center gap-3 rounded-full border-2 border-white/15 font-medium text-white/85 ` +
    `transition-all duration-300 hover:-translate-y-0.5 hover:border-white/30 hover:text-white ${pad} ${className}`;
  const style: React.CSSProperties = {
    background: "var(--brand-sheen)",
    boxShadow: "0 20px 28px -14px rgba(0,0,0,0.55)",
  };
  const inner = (
    <>
      <Sparkles size={size === "lg" ? 24 : 18} tone="white" />
      <span className="whitespace-nowrap">{label}</span>
    </>
  );

  if (href) {
    if (external) {
      return (
        <a href={href} target="_blank" rel="noreferrer" className={cls} style={style}>
          {inner}
        </a>
      );
    }
    return (
      <Link href={href} className={cls} style={style}>
        {inner}
      </Link>
    );
  }
  return (
    <button type="button" className={cls} style={style}>
      {inner}
    </button>
  );
}
