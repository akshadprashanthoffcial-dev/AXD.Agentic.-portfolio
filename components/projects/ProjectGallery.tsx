"use client";

// ============================================================
// ProjectGallery, hero image + masonry grid + shared lightbox,
// for the richer "branding project" detail layout. Reuses the
// site's existing reveal/settle motion primitives (no new deps).
// ============================================================

import { useCallback, useEffect, useState } from "react";
import Reveal from "@/components/ui/Reveal";
import type { GalleryImage } from "@/data/projects";

type Props = {
  images: GalleryImage[]; // index 0 is the hero
  title: string;
};

export default function ProjectGallery({ images, title }: Props) {
  const [open, setOpen] = useState<number | null>(null);
  const count = images.length;

  const close = useCallback(() => setOpen(null), []);
  const next = useCallback(
    () => setOpen((i) => (i === null ? null : (i + 1) % count)),
    [count]
  );
  const prev = useCallback(
    () => setOpen((i) => (i === null ? null : (i - 1 + count) % count)),
    [count]
  );

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowRight") next();
      else if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, close, next, prev]);

  if (count === 0) return null;
  const [hero, ...rest] = images;

  return (
    <>
      <Reveal className="mb-6 cursor-zoom-in" as="div">
        <div
          onClick={() => setOpen(0)}
          className="relative w-full overflow-hidden rounded-[28px] border border-white/12"
          style={{ aspectRatio: "16/10", background: "var(--brand-sheen-soft)" }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={hero.src}
            alt={hero.caption ?? title}
            className="absolute inset-0 h-full w-full object-contain p-6"
          />
        </div>
      </Reveal>

      {rest.length > 0 && (
        <section>
          <div className="mb-6 flex flex-wrap items-baseline justify-between gap-3">
            <h2 className="font-display text-[clamp(24px,4vw,40px)] text-white">
              The system
            </h2>
            <span className="text-[13px] uppercase tracking-[0.14em] text-white/35">
              Click any image to zoom
            </span>
          </div>

          <div className="[column-gap:20px] [columns:320px]">
            {rest.map((img, i) => (
              <Reveal
                key={img.src}
                delay={(i % 4) * 60}
                className="mb-5 break-inside-avoid cursor-zoom-in"
                as="div"
              >
                <div
                  onClick={() => setOpen(i + 1)}
                  className="group overflow-hidden rounded-[18px] border border-white/12"
                  style={{ background: "var(--brand-sheen-soft)" }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img.src}
                    alt={img.caption ?? ""}
                    className="block w-full transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                    style={{ transitionTimingFunction: "var(--settle)" }}
                  />
                </div>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {open !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={title}
          onClick={close}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/93 p-8 backdrop-blur-[14px]"
          style={{ animation: "pageEnter 320ms var(--settle) both" }}
        >
          <button
            type="button"
            onClick={close}
            aria-label="Close"
            className="absolute right-6 top-6 flex h-12 w-12 items-center justify-center rounded-full border border-white/12 text-xl text-white"
            style={{ background: "var(--brand-sheen)" }}
          >
            ×
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              prev();
            }}
            aria-label="Previous"
            className="absolute left-6 top-1/2 flex h-[52px] w-[52px] -translate-y-1/2 items-center justify-center rounded-full border border-white/12 text-xl text-white"
            style={{ background: "var(--brand-sheen)" }}
          >
            ←
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              next();
            }}
            aria-label="Next"
            className="absolute right-6 top-1/2 flex h-[52px] w-[52px] -translate-y-1/2 items-center justify-center rounded-full border border-white/12 text-xl text-white"
            style={{ background: "var(--brand-sheen)" }}
          >
            →
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={images[open].src}
            alt={images[open].caption ?? ""}
            onClick={(e) => e.stopPropagation()}
            className="max-h-[82vh] max-w-[88vw] rounded-[14px] object-contain shadow-[0_40px_120px_-20px_rgba(0,0,0,0.8)]"
          />
          <span className="absolute bottom-7 left-0 right-0 text-center text-[13px] uppercase tracking-[0.14em] text-white/45">
            {open + 1} / {count}
          </span>
        </div>
      )}
    </>
  );
}
