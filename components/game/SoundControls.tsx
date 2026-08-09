"use client";

import { useEffect, useState } from "react";
import type { GameAudio } from "./engine/audio";

const STORE = "eatjobs.sound";

type Saved = { muted: boolean; volume: number };

function load(): Saved {
  if (typeof window === "undefined") return { muted: false, volume: 0.7 };
  try {
    const raw = window.localStorage.getItem(STORE);
    if (!raw) return { muted: false, volume: 0.7 };
    const parsed = JSON.parse(raw) as Partial<Saved>;
    return {
      muted: Boolean(parsed.muted),
      volume: typeof parsed.volume === "number" ? parsed.volume : 0.7,
    };
  } catch {
    return { muted: false, volume: 0.7 };
  }
}

/** Mute toggle and volume slider, remembered between visits. */
export default function SoundControls({ audio }: { audio: GameAudio }) {
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(0.7);

  // Read on mount rather than in useState, so the server and first client
  // render agree and hydration doesn't mismatch.
  useEffect(() => {
    const saved = load();
    setMuted(saved.muted);
    setVolume(saved.volume);
    audio.setMuted(saved.muted);
    audio.setVolume(saved.volume);
  }, [audio]);

  const persist = (next: Saved) => {
    try {
      window.localStorage.setItem(STORE, JSON.stringify(next));
    } catch {
      // Private mode, storage full — the setting just won't outlive the visit.
    }
  };

  const toggle = () => {
    const next = !muted;
    setMuted(next);
    audio.ensure();
    audio.setMuted(next);
    persist({ muted: next, volume });
  };

  const onVolume = (v: number) => {
    setVolume(v);
    audio.ensure();
    audio.setVolume(v);
    if (muted && v > 0) {
      setMuted(false);
      audio.setMuted(false);
    }
    persist({ muted: muted && v === 0, volume: v });
  };

  return (
    <div className="eatjobs-sound">
      <button
        type="button"
        className="eatjobs-sound-btn"
        onClick={toggle}
        aria-pressed={muted}
        aria-label={muted ? "Unmute the game" : "Mute the game"}
        title={muted ? "Unmute" : "Mute"}
      >
        <Speaker muted={muted} />
      </button>
      <input
        className="eatjobs-sound-range"
        type="range"
        min={0}
        max={1}
        step={0.05}
        value={muted ? 0 : volume}
        onChange={(e) => onVolume(Number(e.target.value))}
        aria-label="Volume"
      />
    </div>
  );
}

/** Drawn on the same pixel grid as everything else in the cabinet. */
function Speaker({ muted }: { muted: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" shapeRendering="crispEdges" aria-hidden>
      <g fill="currentColor">
        <rect x="2" y="6" width="2" height="4" />
        <rect x="4" y="5" width="2" height="6" />
        <rect x="6" y="3" width="2" height="10" />
        {muted ? (
          <>
            <rect x="10" y="5" width="2" height="2" />
            <rect x="12" y="7" width="2" height="2" />
            <rect x="10" y="9" width="2" height="2" />
            <rect x="14" y="5" width="2" height="2" />
            <rect x="14" y="9" width="2" height="2" />
          </>
        ) : (
          <>
            <rect x="10" y="6" width="2" height="4" />
            <rect x="13" y="4" width="2" height="8" />
          </>
        )}
      </g>
    </svg>
  );
}
