/**
 * Draws a GameState onto a 2D context, in axd.labs colours.
 *
 * Everything is drawn at a small internal resolution (TILE px per maze tile)
 * and upscaled by the canvas' CSS size with `image-rendering: pixelated`, so
 * the chunky arcade look is real pixels rather than a filter.
 */

import { POWERS, ex, ey, isStunned, type GameState } from "./game";

/** Internal pixels per maze tile. */
export const TILE = 20;

const ORANGE = "#f59b00";
const PURPLE = "#a11ff2";
const RED = "#ef3c3f";
const WALL_FILL = "#1b0a2b";
const WALL_EDGE = "#4a1d78";

const POWER_INITIAL: Record<string, string> = {
  coffee: "C",
  committee: "M",
  recruiter: "R",
  union: "U",
};

export function canvasSize(s: GameState) {
  return { width: s.width * TILE, height: s.height * TILE };
}

export function render(ctx: CanvasRenderingContext2D, s: GameState, reduceMotion: boolean) {
  const { width, height } = canvasSize(s);
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, width, height);

  drawMaze(ctx, s);
  drawPellets(ctx, s);
  if (s.hint.length) drawHint(ctx, s);
  if (s.power) drawPower(ctx, s, reduceMotion);
  drawAi(ctx, s);
  drawBlob(ctx, s, reduceMotion);
}

function drawMaze(ctx: CanvasRenderingContext2D, s: GameState) {
  for (let y = 0; y < s.height; y++) {
    for (let x = 0; x < s.width; x++) {
      if (s.rows[y][x] !== "#") continue;
      const px = x * TILE;
      const py = y * TILE;
      ctx.fillStyle = WALL_FILL;
      ctx.fillRect(px, py, TILE, TILE);
      // A lit top edge, so the maze reads as extruded rather than flat.
      ctx.fillStyle = WALL_EDGE;
      ctx.fillRect(px, py, TILE, 2);
    }
  }
}

function drawPellets(ctx: CanvasRenderingContext2D, s: GameState) {
  ctx.font = "7px ui-monospace, monospace";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "rgba(255,255,255,0.72)";
  for (let y = 0; y < s.height; y++) {
    for (let x = 0; x < s.width; x++) {
      if (s.pellets[y * s.width + x] !== 1) continue;
      ctx.fillText("job", x * TILE + TILE / 2, y * TILE + TILE / 2);
    }
  }
}

function drawHint(ctx: CanvasRenderingContext2D, s: GameState) {
  ctx.fillStyle = "rgba(245,155,0,0.85)";
  for (const t of s.hint) {
    ctx.fillRect(t.x * TILE + TILE / 2 - 1, t.y * TILE + TILE / 2 - 1, 2, 2);
  }
}

function drawPower(ctx: CanvasRenderingContext2D, s: GameState, reduceMotion: boolean) {
  if (!s.power) return;
  const cx = s.power.x * TILE + TILE / 2;
  const cy = s.power.y * TILE + TILE / 2;
  const pulse = reduceMotion ? 1 : 0.85 + Math.sin(s.time * 6) * 0.15;
  const r = 6 * pulse;

  ctx.fillStyle = ORANGE;
  ctx.fillRect(cx - r, cy - r, r * 2, r * 2);
  ctx.fillStyle = "#000";
  ctx.font = "bold 8px ui-monospace, monospace";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(POWER_INITIAL[s.power.type] ?? "?", cx, cy + 0.5);
}

function drawAi(ctx: CanvasRenderingContext2D, s: GameState) {
  const cx = ex(s.ai) * TILE + TILE / 2;
  const cy = ey(s.ai) * TILE + TILE / 2;

  // Deliberately flatter and duller than the blob. It has no inner life.
  ctx.fillStyle = RED;
  ctx.beginPath();
  ctx.arc(cx, cy, 8, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#000";
  ctx.font = "bold 8px ui-monospace, monospace";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("AI", cx, cy + 0.5);
}

function drawBlob(ctx: CanvasRenderingContext2D, s: GameState, reduceMotion: boolean) {
  const cx = ex(s.player) * TILE + TILE / 2;
  const cy = ey(s.player) * TILE + TILE / 2;

  // While stunned, flicker — the blob is "being restructured".
  if (isStunned(s) && !reduceMotion && Math.floor(s.time * 12) % 2 === 0) return;

  const r = 8;
  const grad = ctx.createLinearGradient(cx, cy - r, cx, cy + r);
  grad.addColorStop(0, ORANGE);
  grad.addColorStop(0.49, PURPLE);
  grad.addColorStop(1, RED);

  ctx.save();
  ctx.shadowColor = "rgba(161,31,242,0.75)";
  ctx.shadowBlur = 10;
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // The two eye bars, same as the real axd.blob.
  const looking = s.player.dir;
  const ox = looking.x * 1.4;
  const oy = looking.y * 1.4;
  ctx.fillStyle = "#fff";
  ctx.fillRect(cx - 3.5 + ox, cy - 3 + oy, 2, 6);
  ctx.fillRect(cx + 1.5 + ox, cy - 3 + oy, 2, 6);
}

/** Label + remaining seconds for the HUD's power-up slot. */
export function activePowerLabel(s: GameState) {
  if (!s.active || s.active.until <= s.time) return null;
  const meta = POWERS[s.active.type];
  return { label: meta.label, blurb: meta.blurb, left: s.active.until - s.time };
}
