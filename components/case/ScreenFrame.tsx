"use client";

// ============================================================
// ScreenFrame — a product screenshot in browser chrome.
// Pointer-tilt, brand glow, and click-to-zoom (these screens are
// dense; the case study is unreadable without a lightbox).
// ============================================================

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { useInView } from "./CaseKit";

type Props = {
  src: string;
  alt: string;
  caption?: string;
  /** width / height of the source image. */
  ratio?: number;
  /** Disables the pointer tilt for small inline panels. */
  flat?: boolean;
  priority?: boolean;
  sizes?: string;
  className?: string;
};

export default function ScreenFrame({
  src,
  alt,
  caption,
  ratio = 1391 / 794,
  flat = false,
  priority = false,
  sizes = "(max-width: 900px) 100vw, 960px",
  className = "",
}: Props) {
  const { ref } = useInView<HTMLDivElement>("-6%");
  const tiltRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(false);

  const onMove = useCallback(
    (e: React.PointerEvent) => {
      if (flat) return;
      const el = tiltRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      el.style.transform = `perspective(1400px) rotateX(${(-py * 4).toFixed(
        2
      )}deg) rotateY(${(px * 5).toFixed(2)}deg)`;
    },
    [flat]
  );

  const onLeave = useCallback(() => {
    const el = tiltRef.current;
    if (el) el.style.transform = "perspective(1400px)";
  }, []);

  // Escape closes the lightbox; body scroll locks while it's open.
  useEffect(() => {
    if (!zoom) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setZoom(false);
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [zoom]);

  return (
    <>
      <figure ref={ref} className={`reveal ${className}`}>
        <div
          ref={tiltRef}
          onPointerMove={onMove}
          onPointerLeave={onLeave}
          className="relative transition-transform duration-500 ease-out"
          style={{ transform: "perspective(1400px)" }}
        >
          {/* Brand glow bloom behind the frame */}
          <div
            aria-hidden
            className="lane-glow pointer-events-none absolute -inset-8 -z-10 rounded-[36px] blur-2xl"
            style={{
              background:
                "radial-gradient(60% 60% at 30% 0%, rgba(161,31,242,0.22), transparent 70%), radial-gradient(50% 50% at 80% 100%, rgba(245,155,0,0.14), transparent 70%)",
            }}
          />

          <button
            type="button"
            onClick={() => setZoom(true)}
            aria-label={`Enlarge screenshot: ${alt}`}
            className="group block w-full cursor-zoom-in overflow-hidden rounded-2xl border border-white/12 bg-[#0b0b0d] text-left shadow-[0_30px_80px_-30px_rgba(0,0,0,0.9)]"
          >
            {/* Browser chrome */}
            <div className="flex items-center gap-2 border-b border-white/8 px-4 py-2.5">
              <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
              <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
              <span className="h-2.5 w-2.5 rounded-full bg-white/[0.07]" />
              <span className="ml-3 truncate text-[11px] text-white/25">
                {alt}
              </span>
            </div>

            <div className="relative w-full" style={{ aspectRatio: String(ratio) }}>
              <Image
                src={src}
                alt={alt}
                fill
                sizes={sizes}
                priority={priority}
                className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.015]"
              />
            </div>
          </button>
        </div>

        {caption && (
          <figcaption className="mt-3.5 text-[13px] leading-relaxed text-white/40">
            {caption}
          </figcaption>
        )}
      </figure>

      {zoom && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={alt}
          onClick={() => setZoom(false)}
          className="fixed inset-0 z-[100] flex cursor-zoom-out items-center justify-center bg-black/92 p-4 backdrop-blur-sm md:p-10"
          style={{ animation: "pageEnter 320ms var(--settle) both" }}
        >
          {/* No forced aspect-ratio box here — the thumbnail's `ratio`
              prop is a crop hint, not a guarantee of the source file's
              true dimensions, so it must not constrain the full image. */}
          <img
            src={src}
            alt={alt}
            className="max-h-[88vh] max-w-[92vw] rounded-xl border border-white/12 object-contain"
          />
          <span className="absolute bottom-5 text-[12px] uppercase tracking-[0.2em] text-white/30">
            click anywhere to close
          </span>
        </div>
      )}
    </>
  );
}
