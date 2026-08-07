import Image from "next/image";
import type { Domain } from "./domains";

const TEMPLATE_DIMENSIONS: Record<string, { width: number; height: number }> = {
  healthcare: { width: 1424, height: 6865 },
  technology: { width: 1424, height: 6865 },
  construction: { width: 1423, height: 6873 },
  retail: { width: 1440, height: 7848 },
  banking: { width: 1425, height: 8213 },
};

/**
 * Template preview with browser chrome and full template screenshot.
 * Images are scrollable in a constrained viewport, showing the full domain template.
 */
export default function TemplatePreview({ domain }: { domain: Domain }) {
  const { width, height } = TEMPLATE_DIMENSIONS[domain.id] || TEMPLATE_DIMENSIONS.healthcare;

  return (
    <div
      className="relative overflow-hidden rounded-[22px] border border-white/10"
      style={{ boxShadow: "0 50px 90px -50px rgba(0,0,0,0.95)", background: "var(--brand-sheen)" }}
    >
      {/* Browser chrome */}
      <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
        <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
        <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
        <span className="ml-2.5 rounded-full bg-white/[0.06] px-3.5 py-1 text-[12px] text-white/40">
          {domain.url}
        </span>
      </div>

      {/* Scrollable viewport with template screenshot */}
      <div className="relative h-[460px] overflow-y-auto" style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(255,255,255,0.25) transparent" }}>
        <Image
          src={`/projects/smart-templates/${domain.id}.png`}
          alt={`${domain.name} template screenshot`}
          width={width}
          height={height}
          className="w-full"
          priority={domain.id === "healthcare"}
          unoptimized
        />
      </div>
    </div>
  );
}
