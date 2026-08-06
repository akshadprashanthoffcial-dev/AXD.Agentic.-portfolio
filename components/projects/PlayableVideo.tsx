"use client";

// ============================================================
// PlayableVideo — a poster tile with a play button; clicking it
// opens a fullscreen lightbox with the clip autoplaying. Reuses
// the same lightbox chrome/keyboard handling as ProjectGallery.
// ============================================================

import { useCallback, useEffect, useState } from "react";
import Reveal from "@/components/ui/Reveal";

type Props = {
  src: string;
  poster?: string;
  caption?: string;
};

export default function PlayableVideo({ src, poster, caption }: Props) {
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, close]);

  return (
    <>
      <Reveal as="div">
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label={`Play ${caption ?? "animation"}`}
          className="group relative block w-full cursor-pointer overflow-hidden rounded-[28px] border border-white/12"
          style={{ aspectRatio: "16/9", background: "var(--brand-sheen-soft)" }}
        >
          {poster ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={poster}
              alt={caption ?? ""}
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
          ) : (
            <div
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(120% 120% at 50% 0%, rgba(161,31,242,0.14), rgba(255,255,255,0.03) 45%)",
              }}
            />
          )}
          <div className="absolute inset-0 bg-black/25 transition-colors duration-300 group-hover:bg-black/35" />
          <span
            className="absolute left-1/2 top-1/2 flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 backdrop-blur-md transition-transform duration-300 group-hover:scale-110"
            style={{ background: "var(--brand-sheen)" }}
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="#fff" aria-hidden>
              <path d="M8 5.5v13l11-6.5-11-6.5z" />
            </svg>
          </span>
          {caption && (
            <span className="absolute bottom-5 left-6 text-[13px] uppercase tracking-[0.14em] text-white/78">
              {caption}
            </span>
          )}
        </button>
      </Reveal>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={caption ?? "Animation"}
          onClick={close}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/93 p-6 backdrop-blur-[14px]"
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
          <video
            src={src}
            controls
            autoPlay
            playsInline
            onClick={(e) => e.stopPropagation()}
            className="max-h-[86vh] max-w-[92vw] rounded-[14px] shadow-[0_40px_120px_-20px_rgba(0,0,0,0.8)]"
          />
        </div>
      )}
    </>
  );
}
