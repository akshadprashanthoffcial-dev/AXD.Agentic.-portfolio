"use client";

import { useEffect, useRef } from "react";
import { attachInput } from "./engine/input";
import { createGame, step, type Dir, type GameState } from "./engine/game";
import { TILE, activePowerLabel, canvasSize, render } from "./engine/render";

/** Fixed simulation step. Movement snapping depends on a steady dt. */
const DT = 1 / 120;
/** Seconds of "ready" before the AI is let loose. */
const READY = 1.6;

export type Hud = {
  saved: number;
  automated: number;
  left: number;
  power: { label: string; blurb: string; left: number } | null;
  ready: number;
};

type Props = {
  levelIndex: number;
  /** Bump to restart the same level without remounting. */
  attempt: number;
  onHud: (hud: Hud) => void;
  onEnd: (outcome: "won" | "lost", state: GameState) => void;
};

export default function GameCanvas({ levelIndex, attempt, onHud, onEnd }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  // Latest callbacks, so re-renders never restart the round mid-play.
  const hudRef = useRef(onHud);
  const endRef = useRef(onEnd);
  hudRef.current = onHud;
  endRef.current = onEnd;

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const state: GameState = createGame(levelIndex);
    const { width, height } = canvasSize(state);
    canvas.width = width;
    canvas.height = height;

    const input = attachInput(wrap, (dir: Dir) => {
      state.player.want = dir;
    });

    let raf = 0;
    let last = performance.now();
    let accumulator = 0;
    let ready = READY;
    let hudAt = 0;
    let finished = false;

    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      // Clamp so a stall (tab switch, a slow first paint) can't hand the AI
      // several free seconds of eating the moment we come back.
      const elapsed = Math.min((now - last) / 1000, 0.25);
      last = now;

      if (ready > 0) {
        ready -= elapsed;
      } else if (!finished) {
        accumulator += elapsed;
        while (accumulator >= DT) {
          step(state, DT);
          accumulator -= DT;
        }
      }

      render(ctx, state, reduceMotion);
      if (ready > 0) drawReady(ctx, width, height, ready);

      if (now - hudAt > 100) {
        hudAt = now;
        hudRef.current({
          saved: state.saved,
          automated: state.automated,
          left: state.pelletsLeft,
          power: activePowerLabel(state),
          ready: Math.max(0, ready),
        });
      }

      if (!finished && state.outcome !== "playing") {
        finished = true;
        endRef.current(state.outcome, state);
      }
    };

    const onVisibility = () => {
      // Reset the clock on return, otherwise the first frame back carries a
      // huge elapsed time.
      last = performance.now();
      accumulator = 0;
    };
    document.addEventListener("visibilitychange", onVisibility);
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("visibilitychange", onVisibility);
      input.dispose();
    };
  }, [levelIndex, attempt]);

  return (
    <div ref={wrapRef} className="eatjobs-screen">
      <canvas ref={canvasRef} className="eatjobs-canvas" aria-label="EAT.JOBS maze" />
    </div>
  );
}

function drawReady(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  ready: number
) {
  ctx.fillStyle = "rgba(0,0,0,0.62)";
  ctx.fillRect(0, height / 2 - TILE, width, TILE * 2);
  ctx.fillStyle = "#f59b00";
  ctx.font = "bold 12px ui-monospace, monospace";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(
    ready > 0.8 ? "READY" : "GO",
    width / 2,
    height / 2
  );
}
