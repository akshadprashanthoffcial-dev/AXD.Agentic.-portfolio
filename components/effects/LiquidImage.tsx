"use client";

import { useEffect, useId, useRef } from "react";
import Image from "next/image";

type Props = {
  src: string;
  alt: string;
  ratio?: number;
  priority?: boolean;
  className?: string;
  sizes?: string;
};

/**
 * A cover image with the same liquid-displacement texture as LiquidGlass
 * (feTurbulence + feDisplacementMap), but reactive to the pointer instead of
 * static: the distortion breathes gently on its own and swells slightly
 * when the cursor is over the image. Kept subtle — this is a photograph,
 * not a glass panel — and disabled under prefers-reduced-motion.
 */
export default function LiquidImage({
  src,
  alt,
  ratio = 16 / 9,
  priority = false,
  className = "",
  sizes = "100vw",
}: Props) {
  const uid = useId().replace(/[:]/g, "");
  const filterId = `liquid-img-${uid}`;
  const wrapRef = useRef<HTMLDivElement>(null);
  const dispRef = useRef<SVGFEDisplacementMapElement>(null);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    let target = 6;
    let current = 6;
    let raf = 0;

    const tick = () => {
      current += (target - current) * 0.06;
      dispRef.current?.setAttribute("scale", current.toFixed(2));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const onEnter = () => (target = 16);
    const onLeave = () => (target = 6);
    const onMove = (e: PointerEvent) => {
      const el = wrapRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const dx = (e.clientX - r.left) / r.width - 0.5;
      const dy = (e.clientY - r.top) / r.height - 0.5;
      const dist = Math.min(1, Math.hypot(dx, dy) * 1.6);
      target = 10 + (1 - dist) * 10;
    };

    const el = wrapRef.current;
    el?.addEventListener("pointerenter", onEnter);
    el?.addEventListener("pointerleave", onLeave);
    el?.addEventListener("pointermove", onMove);

    return () => {
      cancelAnimationFrame(raf);
      el?.removeEventListener("pointerenter", onEnter);
      el?.removeEventListener("pointerleave", onLeave);
      el?.removeEventListener("pointermove", onMove);
    };
  }, []);

  return (
    <div
      ref={wrapRef}
      className={`relative w-full overflow-hidden ${className}`}
      style={{ aspectRatio: String(ratio) }}
    >
      <svg aria-hidden width="0" height="0" style={{ position: "absolute" }}>
        <defs>
          <filter id={filterId} x="-10%" y="-10%" width="120%" height="120%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.008 0.011"
              numOctaves={2}
              seed={4}
              result="noise"
            >
              <animate
                attributeName="baseFrequency"
                values="0.006 0.009;0.010 0.013;0.006 0.009"
                dur="16s"
                repeatCount="indefinite"
              />
            </feTurbulence>
            <feGaussianBlur in="noise" stdDeviation="1.5" result="blur" />
            <feDisplacementMap
              ref={dispRef}
              in="SourceGraphic"
              in2="blur"
              scale={6}
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>

      <div className="h-full w-full" style={{ filter: `url(#${filterId})` }}>
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          sizes={sizes}
          className="object-cover"
        />
      </div>
    </div>
  );
}
