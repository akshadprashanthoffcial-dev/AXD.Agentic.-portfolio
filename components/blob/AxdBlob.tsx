"use client";

import { useRouter } from "next/navigation";
import { type CSSProperties, useEffect, useId, useRef, useState } from "react";
import PixelWipe from "@/components/game/PixelWipe";
import { GameAudio } from "@/components/game/engine/audio";

type Mode = "hero" | "nav" | "footer";

type Props = {
  /** Pixel diameter of the whole blob (glow included). */
  size?: number;
  mode?: Mode;
  /** Follow the pointer. Turn off for purely decorative instances. */
  interactive?: boolean;
  /**
   * Three quick taps open the hidden game. Only set this on an instance that
   * isn't already wrapped in a link — see FooterBlob, whose navigation would
   * fight it.
   */
  secret?: boolean;
  className?: string;
};

/**
 * How long each tap keeps counting towards the three-tap sequence. Comfortably
 * more than a second, so a steady one-click-per-second rhythm always gets
 * there rather than racing the reset.
 */
const TAP_WINDOW = 1800;

const TAP_LINES = [
  "Click me more for a reality check",
  "Careful. One more click…",
];

const rand = (a: number, b: number) => a + Math.random() * (b - a);

/**
 * axd.blob, the site's character. Renders the exact Figma vector
 * (node 57:1266) with independently animated layers:
 *  - gradient body (soft blurred orb), slow rotation + breathe, tilts to cursor
 *  - internal highlights (plus-lighter), drift
 *  - eyes, damped pointer tracking, blink, and idle look-around
 * Honors prefers-reduced-motion (gentle blink only).
 */
export default function AxdBlob({
  size = 320,
  mode = "hero",
  interactive = true,
  secret = false,
  className = "",
}: Props) {
  const router = useRouter();
  const uid = useId().replace(/:/g, "");
  const rootRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<SVGGElement>(null);
  const highlightRef = useRef<SVGGElement>(null);
  const eyesRef = useRef<SVGGElement>(null);
  const [reduce, setReduce] = useState(false);
  // Click reaction: flicker/blink + an expanding ripple ring.
  const [burst, setBurst] = useState(false);
  const [rings, setRings] = useState<number[]>([]);
  const ringSeq = useRef(0);
  // Three taps open /eat-jobs. The window is per tap, not for the whole
  // sequence, so a steady one-click-a-second rhythm still gets you there.
  const taps = useRef(0);
  const tapTimer = useRef<number | null>(null);
  const [charging, setCharging] = useState(false);
  const [bubble, setBubble] = useState<string | null>(null);
  const [wiping, setWiping] = useState(false);
  // Same chiptune voice as the arcade itself, so the sound identity starts
  // before the game screen does. Only on the instance that leads there —
  // sound on every blob across the site (nav, footer) wasn't asked for and
  // would be a surprise on pages that have nothing to do with the game.
  const audio = useRef<GameAudio | null>(null);
  if (secret && !audio.current) audio.current = new GameAudio();

  useEffect(
    () => () => {
      if (tapTimer.current !== null) window.clearTimeout(tapTimer.current);
      audio.current?.close();
    },
    []
  );

  const countTap = () => {
    if (tapTimer.current !== null) window.clearTimeout(tapTimer.current);
    taps.current += 1;

    if (taps.current >= 3) {
      taps.current = 0;
      setBubble(null);
      setWiping(true);
      return;
    }

    setBubble(TAP_LINES[taps.current - 1]);
    tapTimer.current = window.setTimeout(() => {
      taps.current = 0;
      setBubble(null);
    }, TAP_WINDOW);
  };

  const onActivate = () => {
    if (secret) {
      countTap();
      // The click itself is the user gesture, so the context is free to
      // start here even on the very first tap.
      audio.current?.ensure();
      audio.current?.tap();
    }
    // The same squash every time — the reaction that only fired on the second
    // tap felt the most alive, so it's now what every click does.
    setCharging(false);
    requestAnimationFrame(() => setCharging(true));
    window.setTimeout(() => setCharging(false), 540);
    setBurst(false);
    // re-enable on the next frame so the animation restarts on rapid clicks
    requestAnimationFrame(() => setBurst(true));
    const id = ringSeq.current++;
    setRings((r) => [...r, id]);
    window.setTimeout(() => setRings((r) => r.filter((x) => x !== id)), 950);
    window.setTimeout(() => setBurst(false), 760);
  };

  useEffect(() => {
    const root = rootRef.current;
    const eyes = eyesRef.current;
    if (!root || !eyes) return;

    const prefersReduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    setReduce(prefersReduce);

    const maxEye = 22; // SVG user units (537 box)
    const maxTilt = 14;

    let curX = 0,
      curY = 0,
      tgtX = 0,
      tgtY = 0;
    let tiltX = 0,
      tiltY = 0,
      tiltTX = 0,
      tiltTY = 0;
    let lastMove = performance.now() - 5000;
    let idleTgt = { x: 0, y: 0 };
    let nextIdle = 0;
    let blinkUntil = 0;
    let nextBlink = performance.now() + rand(2400, 5000);
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      const r = root.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.hypot(dx, dy);
      const ang = Math.atan2(dy, dx);
      const reach = Math.min(1, dist / (r.width * 1.2 || size));
      tgtX = Math.cos(ang) * maxEye * (0.4 + 0.6 * reach);
      tgtY = Math.sin(ang) * maxEye * (0.4 + 0.6 * reach);
      tiltTX = Math.cos(ang) * maxTilt * reach;
      tiltTY = Math.sin(ang) * maxTilt * reach;
      lastMove = performance.now();
    };

    const frame = (now: number) => {
      if (now - lastMove > 2500) {
        if (now > nextIdle) {
          const a = Math.random() * Math.PI * 2;
          const m = maxEye * rand(0.3, 0.9);
          idleTgt = { x: Math.cos(a) * m, y: Math.sin(a) * m };
          nextIdle = now + rand(1200, 2600);
        }
        tgtX += (idleTgt.x - tgtX) * 0.04;
        tgtY += (idleTgt.y - tgtY) * 0.04;
        tiltTX *= 0.95;
        tiltTY *= 0.95;
      }

      curX += (tgtX - curX) * 0.12;
      curY += (tgtY - curY) * 0.12;
      tiltX += (tiltTX - tiltX) * 0.08;
      tiltY += (tiltTY - tiltY) * 0.08;

      let sy = 1;
      if (now > nextBlink) {
        blinkUntil = now + 120;
        nextBlink = now + rand(2600, 6200);
      }
      if (now < blinkUntil) sy = 0.12;

      eyes.setAttribute(
        "transform",
        `translate(${curX.toFixed(1)} ${curY.toFixed(1)}) translate(258.5 245.5) scale(1 ${sy.toFixed(
          3
        )}) translate(-258.5 -245.5)`
      );
      if (bodyRef.current) {
        bodyRef.current.setAttribute(
          "transform",
          `translate(${(tiltX).toFixed(1)} ${(tiltY).toFixed(1)})`
        );
      }
      if (highlightRef.current) {
        highlightRef.current.setAttribute(
          "transform",
          `translate(${(tiltX * 1.6).toFixed(1)} ${(tiltY * 1.6).toFixed(1)})`
        );
      }
      raf = requestAnimationFrame(frame);
    };

    if (prefersReduce || !interactive) {
      raf = requestAnimationFrame(function loop(now: number) {
        let sy = 1;
        if (now > nextBlink) {
          blinkUntil = now + 150;
          nextBlink = now + rand(3600, 7200);
        }
        if (now < blinkUntil) sy = 0.14;
        eyes.setAttribute(
          "transform",
          `translate(258.5 245.5) scale(1 ${sy.toFixed(3)}) translate(-258.5 -245.5)`
        );
        raf = requestAnimationFrame(loop);
      });
      return () => cancelAnimationFrame(raf);
    }

    window.addEventListener("mousemove", onMove, { passive: true });
    raf = requestAnimationFrame(frame);
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, [size, interactive]);

  const spin: CSSProperties | undefined = !reduce
    ? { animation: "blobRotate 26s linear infinite", transformBox: "fill-box", transformOrigin: "center" }
    : undefined;
  const drift: CSSProperties | undefined = !reduce
    ? { animation: "highlightDrift 12s ease-in-out infinite", transformBox: "fill-box", transformOrigin: "center" }
    : undefined;

  return (
    <div
      ref={rootRef}
      className={`axd-blob relative shrink-0 ${burst ? "is-burst" : ""} ${
        charging ? "is-charging" : ""
      } ${className}`}
      style={{ width: size, height: size }}
      onClick={onActivate}
      aria-hidden="true"
    >
      {rings.map((id) => (
        <span key={id} className="blob-burst" />
      ))}

      {bubble && (
        <span className="blob-bubble" aria-hidden>
          {bubble}
        </span>
      )}
      <svg
        viewBox="0 0 537 537"
        width={size}
        height={size}
        fill="none"
        style={{ overflow: "visible" }}
      >
        <defs>
          <linearGradient
            id={`g-${uid}`}
            x1="269"
            y1="100"
            x2="269"
            y2="436"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#F59B00" />
            <stop offset="0.492011" stopColor="#A11FF2" />
            <stop offset="1" stopColor="#EF3C3F" />
          </linearGradient>
          <filter
            id={`fb-${uid}`}
            x="3.4"
            y="2.4"
            width="531.2"
            height="531.2"
            filterUnits="userSpaceOnUse"
          >
            <feGaussianBlur stdDeviation="40" />
          </filter>
          <filter
            id={`fh-${uid}`}
            x="-250%"
            y="-250%"
            width="600%"
            height="600%"
            filterUnits="objectBoundingBox"
          >
            <feGaussianBlur stdDeviation="34" />
          </filter>
          {/* Feathered mask so highlights fade softly (no hard border) */}
          <radialGradient
            id={`mg-${uid}`}
            cx="269"
            cy="268"
            r="152"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0.55" stopColor="#fff" />
            <stop offset="1" stopColor="#000" />
          </radialGradient>
          <mask id={`m-${uid}`} maskUnits="userSpaceOnUse" x="0" y="0" width="537" height="537">
            <rect x="0" y="0" width="537" height="537" fill={`url(#mg-${uid})`} />
          </mask>
        </defs>

        {/* Body, soft blurred gradient orb (glow + core). Slow spin + breathe. */}
        <g ref={bodyRef}>
          <g style={spin}>
            <circle
              cx="269"
              cy="268"
              r="168"
              fill={`url(#g-${uid})`}
              filter={`url(#fb-${uid})`}
            />
          </g>
        </g>

        {/* Internal highlights (plus-lighter), masked to the face. Drift. */}
        <g mask={`url(#m-${uid})`}>
          <g ref={highlightRef}>
            <g style={{ mixBlendMode: "plus-lighter" }}>
              <g style={drift}>
                {/* upper-left soft light (two overlapping blurred circles) */}
                <circle cx="204" cy="216" r="40" fill="#fff" filter={`url(#fh-${uid})`} />
                <circle cx="204" cy="216" r="40" fill="#fff" filter={`url(#fh-${uid})`} />
                {/* lower-right soft crescent */}
                <ellipse cx="362" cy="359" rx="65" ry="72" fill="#fff" filter={`url(#fh-${uid})`} />
                <ellipse cx="362" cy="359" rx="102" ry="113" fill="#fff" fillOpacity="0.72" filter={`url(#fh-${uid})`} />
              </g>
            </g>
          </g>
        </g>

        {/* Eyes */}
        <g ref={eyesRef}>
          <rect x="210" y="197" width="32" height="97" rx="12" fill="#fff" />
          <rect x="275" y="197" width="32" height="97" rx="12" fill="#fff" />
        </g>
      </svg>

      {/* Pixels close over the screen, then the game page opens them again. */}
      {wiping && (
        <PixelWipe mode="cover" onDone={() => router.push("/eat-jobs")} />
      )}
    </div>
  );
}
