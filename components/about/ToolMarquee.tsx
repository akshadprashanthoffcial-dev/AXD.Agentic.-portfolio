import { OPERATOR } from "@/data/operator";
import { TOOL_LOGOS } from "@/components/ui/ToolLogos";

/**
 * Edge-faded infinite logo strip of the toolkit. Two identical tracks scroll
 * side by side; when the first has travelled exactly its own width the pair
 * is back where it started, so the loop is seamless. Pure CSS, pauses on
 * hover and freezes under reduced motion (see .marquee-* in globals.css).
 */
export default function ToolMarquee() {
  const items = OPERATOR.tools;
  return (
    <div className="marquee" aria-hidden>
      <div className="marquee-track">
        {[0, 1].map((copy) => (
          <div className="marquee-group" key={copy}>
            {items.map((t) => {
              const Logo = TOOL_LOGOS[t.name];
              return (
                <span className="marquee-item" key={`${copy}-${t.name}`}>
                  {Logo && <Logo size={26} />}
                  <span className="font-display text-white/85">{t.name}</span>
                </span>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
