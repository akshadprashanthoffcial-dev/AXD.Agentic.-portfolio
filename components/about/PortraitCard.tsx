"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { OPERATOR } from "@/data/operator";

/**
 * The portrait card that sits beside the name.
 *
 * Desktop: tilts toward the pointer with a glare sweep that tracks it.
 * Mobile: tilts with the phone itself via DeviceOrientation, iOS 13+ needs a
 * user gesture to grant permission, so a small "tilt me" affordance asks for it
 * on first tap. Everything is rAF-throttled and disabled under reduced motion.
 */
export default function PortraitCard() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const glareRef = useRef<HTMLSpanElement>(null);
  const raf = useRef(0);
  const base = useRef<{ beta: number; gamma: number } | null>(null);

  // "unsupported" hides the affordance entirely (desktop / no sensor).
  const [gyro, setGyro] = useState<"unsupported" | "ask" | "on">("unsupported");

  const MAX = 14; // degrees

  // Apply a tilt. x/y are -1..1.
  const apply = (x: number, y: number) => {
    cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame(() => {
      const card = cardRef.current;
      if (!card) return;
      card.style.transform = `perspective(1000px) rotateY(${(x * MAX).toFixed(
        2
      )}deg) rotateX(${(-y * MAX).toFixed(2)}deg)`;
      if (glareRef.current) {
        glareRef.current.style.opacity = "1";
        glareRef.current.style.background = `radial-gradient(60% 60% at ${(
          50 +
          x * 45
        ).toFixed(1)}% ${(50 + y * 45).toFixed(
          1
        )}%, rgba(255,255,255,0.28), transparent 70%)`;
      }
    });
  };

  const reset = () => {
    cancelAnimationFrame(raf.current);
    const card = cardRef.current;
    if (card) card.style.transform = "perspective(1000px) rotateY(0deg) rotateX(0deg)";
    if (glareRef.current) glareRef.current.style.opacity = "0";
  };

  const onMove = (e: React.MouseEvent) => {
    const el = wrapRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    apply((e.clientX - r.left) / r.width - 0.5, (e.clientY - r.top) / r.height - 0.5);
  };

  // Device orientation → tilt, relative to however the phone is being held
  // when the first reading arrives (so it works lying down or upright).
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    if (!coarse || !("DeviceOrientationEvent" in window)) return;

    type PermissionCapable = { requestPermission?: () => Promise<PermissionState> };
    const needsPermission =
      typeof (DeviceOrientationEvent as unknown as PermissionCapable)
        .requestPermission === "function";

    setGyro(needsPermission ? "ask" : "on");
  }, []);

  useEffect(() => {
    if (gyro !== "on") return;
    const onOrient = (e: DeviceOrientationEvent) => {
      const { beta, gamma } = e;
      if (beta == null || gamma == null) return;
      if (!base.current) base.current = { beta, gamma };
      // Clamp to ±25° of travel, then normalise to -1..1.
      const x = Math.max(-1, Math.min(1, (gamma - base.current.gamma) / 25));
      const y = Math.max(-1, Math.min(1, (beta - base.current.beta) / 25));
      apply(x, y);
    };
    window.addEventListener("deviceorientation", onOrient);
    return () => {
      window.removeEventListener("deviceorientation", onOrient);
      cancelAnimationFrame(raf.current);
    };
  }, [gyro]);

  const requestGyro = async () => {
    type PermissionCapable = { requestPermission?: () => Promise<PermissionState> };
    const req = (DeviceOrientationEvent as unknown as PermissionCapable).requestPermission;
    if (!req) return setGyro("on");
    try {
      const res = await req();
      setGyro(res === "granted" ? "on" : "unsupported");
    } catch {
      setGyro("unsupported");
    }
  };

  return (
    <div className="relative mx-auto w-full max-w-[380px] md:mx-0 md:ml-auto">
      {/* Brand glow behind the card */}
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-10 rounded-[48px] blur-[70px]"
        style={{
          background:
            "radial-gradient(circle at 50% 45%, rgba(245,155,0,0.38), rgba(161,31,242,0.42) 45%, rgba(239,60,63,0.28) 68%, transparent 78%)",
        }}
      />

      <div
        ref={wrapRef}
        onMouseMove={onMove}
        onMouseLeave={reset}
        className="relative"
        style={{ transformStyle: "preserve-3d" }}
      >
        <div
          ref={cardRef}
          className="portrait-card relative overflow-hidden rounded-[28px] border border-white/15"
          style={{
            transformStyle: "preserve-3d",
            transition: "transform 420ms var(--settle)",
            willChange: "transform",
            background: "var(--brand-sheen)",
          }}
        >
          <div className="relative aspect-[3/4] w-full">
            <Image
              src={OPERATOR.portrait}
              alt={`${OPERATOR.name}, photographed in Dubai`}
              fill
              priority
              sizes="(max-width: 768px) 88vw, 380px"
              className="object-cover"
              style={{ objectPosition: "50% 22%" }}
            />

            {/* Pointer glare */}
            <span
              ref={glareRef}
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-0 mix-blend-soft-light"
              style={{ transition: "opacity 320ms var(--settle)" }}
            />
          </div>
        </div>

        {/* Mobile-only gyro affordance */}
        {gyro === "ask" && (
          <button
            type="button"
            onClick={requestGyro}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-full border border-white/15 py-2.5 text-[13px] text-white/78 md:hidden"
            style={{ background: "var(--brand-sheen)" }}
          >
            <TiltGlyph /> Tap, then tilt your phone
          </button>
        )}
        {gyro === "on" && (
          <p className="mt-3 flex items-center justify-center gap-2 text-[13px] text-white/55 md:hidden">
            <TiltGlyph /> Tilt your phone
          </p>
        )}
      </div>
    </div>
  );
}

function TiltGlyph() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect
        x="7"
        y="2.5"
        width="10"
        height="19"
        rx="2.5"
        stroke="rgba(255,255,255,0.55)"
        strokeWidth="1.6"
      />
      <path
        d="M3 8.5c-1 2-1 5 0 7M21 8.5c1 2 1 5 0 7"
        stroke="rgba(255,255,255,0.35)"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}
