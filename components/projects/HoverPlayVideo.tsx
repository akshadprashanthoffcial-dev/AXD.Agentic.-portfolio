"use client";

// ============================================================
// HoverPlayVideo — a muted clip that plays on hover/focus and
// pauses + rewinds when the pointer leaves. Touch/keyboard users
// get a small play affordance that toggles the same way.
// ============================================================

import { useRef, useState } from "react";

type Props = {
  src: string;
  title: string;
};

export default function HoverPlayVideo({ src, title }: Props) {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  const play = () => {
    ref.current?.play();
    setPlaying(true);
  };
  const stop = () => {
    const v = ref.current;
    if (!v) return;
    v.pause();
    v.currentTime = 0;
    setPlaying(false);
  };
  const toggle = () => (playing ? stop() : play());

  return (
    <div
      className="group relative overflow-hidden rounded-[22px] border border-white/10 bg-white"
      style={{ boxShadow: "0 30px 60px -30px rgba(0,0,0,0.8)" }}
      onMouseEnter={play}
      onMouseLeave={stop}
    >
      <video
        ref={ref}
        src={src}
        muted
        loop
        playsInline
        preload="metadata"
        className="block w-full"
      />
      <button
        type="button"
        onClick={toggle}
        aria-label={playing ? `Pause ${title}` : `Play ${title}`}
        className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors duration-300 group-hover:bg-black/10 sm:hidden"
      >
        {!playing && (
          <span
            className="flex h-14 w-14 items-center justify-center rounded-full border border-white/25 backdrop-blur-md"
            style={{ background: "var(--brand-sheen)" }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="#fff" aria-hidden>
              <path d="M8 5.5v13l11-6.5-11-6.5z" />
            </svg>
          </span>
        )}
      </button>
      {!playing && (
        <span
          className="pointer-events-none absolute inset-0 hidden items-center justify-center bg-black/0 transition-colors duration-300 group-hover:bg-black/0 sm:flex"
          aria-hidden
        >
          <span
            className="flex h-14 w-14 items-center justify-center rounded-full border border-white/25 opacity-0 backdrop-blur-md transition-opacity duration-300 group-hover:opacity-100"
            style={{ background: "var(--brand-sheen)" }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="#fff" aria-hidden>
              <path d="M8 5.5v13l11-6.5-11-6.5z" />
            </svg>
          </span>
        </span>
      )}
    </div>
  );
}
