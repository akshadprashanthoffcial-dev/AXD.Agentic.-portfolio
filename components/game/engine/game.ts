/**
 * EAT.JOBS simulation — pure state plus a fixed-timestep `step()`.
 *
 * No React, no canvas, no DOM. The rules in one place:
 *  - Both the blob and AI race around a maze eating "job" pellets.
 *  - The round ends when the last pellet is gone. You win the level if you ate
 *    strictly more than half of them.
 *  - Touching AI doesn't kill you, it "restructures your role": a short stun.
 */

import { LEVELS, findChar, isOpen, type Level } from "./maze";

export type Dir = { x: number; y: number };

export const DIRS = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
  none: { x: 0, y: 0 },
} as const;

export type PowerType = "coffee" | "committee" | "recruiter" | "union";

export const POWERS: Record<
  PowerType,
  { label: string; blurb: string; seconds: number }
> = {
  coffee: { label: "Coffee", blurb: "You move 40% faster", seconds: 4 },
  committee: {
    label: "Committee",
    blurb: "AI is stuck in a stakeholder alignment meeting",
    seconds: 4,
  },
  recruiter: { label: "Recruiter", blurb: "The route to the nearest job", seconds: 3 },
  union: { label: "Union", blurb: "AI has been asked to stop, and did", seconds: 2 },
};

const POWER_TYPES = Object.keys(POWERS) as PowerType[];

/** Player speed in tiles per second. Everything else is relative to this. */
const BASE_SPEED = 5.4;
/** Seconds between one power-up being collected and the next appearing. */
const POWER_RESPAWN = 7;
/** How long a bump from AI freezes you, and how long you're immune after. */
const STUN_SECONDS = 0.9;
const STUN_IMMUNITY = 2.5;

/**
 * Entities live on the tile grid, not in free space: a tile plus `p`, the
 * fraction already travelled towards the next tile in `dir`. Turns are only
 * taken at `p === 0`. Keeping the grid position exact is what makes the
 * movement feel arcade-tight, and means no amount of float drift can ever
 * work an entity into a wall.
 */
export type Entity = {
  tx: number;
  ty: number;
  /** Progress towards the next tile, 0 to just under 1. */
  p: number;
  dir: Dir;
  /** The direction the player has asked for; taken at the next tile centre. */
  want: Dir;
};

/** Continuous position, for drawing and for distance checks. */
export const ex = (e: Entity) => e.tx + e.dir.x * e.p;
export const ey = (e: Entity) => e.ty + e.dir.y * e.p;

export type GameState = {
  levelIndex: number;
  level: Level;
  rows: string[];
  width: number;
  height: number;
  /** Pellet presence, indexed y * width + x. */
  pellets: Uint8Array;
  pelletsTotal: number;
  pelletsLeft: number;
  saved: number;
  automated: number;
  player: Entity;
  ai: Entity;
  /** Seconds of simulated time since the round started. */
  time: number;
  stunUntil: number;
  immuneUntil: number;
  power: { type: PowerType; x: number; y: number } | null;
  powerAt: number;
  active: { type: PowerType; until: number } | null;
  /** Tile path from the player to the nearest pellet, for the recruiter hint. */
  hint: { x: number; y: number }[];
  outcome: "playing" | "won" | "lost";
};

const idx = (s: { width: number }, x: number, y: number) => y * s.width + x;

export function createGame(levelIndex: number): GameState {
  const level = LEVELS[Math.min(levelIndex, LEVELS.length - 1)];
  const rows = level.rows;
  const width = rows[0].length;
  const height = rows.length;
  const pellets = new Uint8Array(width * height);
  let total = 0;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (rows[y][x] === ".") {
        pellets[y * width + x] = 1;
        total++;
      }
    }
  }
  const p = findChar(rows, "P");
  const a = findChar(rows, "A");

  const state: GameState = {
    levelIndex,
    level,
    rows,
    width,
    height,
    pellets,
    pelletsTotal: total,
    pelletsLeft: total,
    saved: 0,
    automated: 0,
    player: { tx: p.x, ty: p.y, p: 0, dir: DIRS.none, want: DIRS.none },
    ai: { tx: a.x, ty: a.y, p: 0, dir: DIRS.none, want: DIRS.none },
    time: 0,
    stunUntil: 0,
    immuneUntil: 0,
    power: null,
    powerAt: 3,
    active: null,
    hint: [],
    outcome: "playing",
  };
  return state;
}

/**
 * Breadth-first search from a tile. `goal` decides what we're looking for.
 * Returns the path of tiles to the closest match, starting at the tile after
 * `from`. Empty when nothing is reachable.
 */
function bfs(
  s: GameState,
  from: { x: number; y: number },
  goal: (x: number, y: number) => boolean
): { x: number; y: number }[] {
  const start = idx(s, from.x, from.y);
  const prev = new Int32Array(s.width * s.height).fill(-1);
  const seen = new Uint8Array(s.width * s.height);
  seen[start] = 1;
  const queue: number[] = [start];
  let head = 0;
  let found = -1;

  while (head < queue.length) {
    const cur = queue[head++];
    const cx = cur % s.width;
    const cy = (cur - cx) / s.width;
    if (cur !== start && goal(cx, cy)) {
      found = cur;
      break;
    }
    for (const d of [DIRS.up, DIRS.down, DIRS.left, DIRS.right]) {
      const nx = cx + d.x;
      const ny = cy + d.y;
      if (!isOpen(s.rows, nx, ny)) continue;
      const n = idx(s, nx, ny);
      if (seen[n]) continue;
      seen[n] = 1;
      prev[n] = cur;
      queue.push(n);
    }
  }

  if (found === -1) return [];
  const path: { x: number; y: number }[] = [];
  for (let cur = found; cur !== -1 && cur !== start; cur = prev[cur]) {
    const x = cur % s.width;
    path.unshift({ x, y: (cur - x) / s.width });
  }
  return path;
}

/**
 * The AI's wrong turn: a random open direction, preferring not to double back
 * so it commits to the mistake rather than dithering on the spot.
 */
function confidentlyWrong(s: GameState, e: Entity): Dir {
  const open = [DIRS.up, DIRS.down, DIRS.left, DIRS.right].filter((d) =>
    isOpen(s.rows, e.tx + d.x, e.ty + d.y)
  );
  if (!open.length) return DIRS.none;
  const forward = open.filter((d) => !(d.x === -e.dir.x && d.y === -e.dir.y));
  const pool = forward.length ? forward : open;
  return pool[Math.floor(Math.random() * pool.length)];
}

const hasPellet = (s: GameState, x: number, y: number) => s.pellets[idx(s, x, y)] === 1;

/**
 * Advance one entity along the grid. `onTile` fires every time it is standing
 * on a tile centre — including the one it starts the step on — which is where
 * pellets get eaten and where the AI re-targets.
 */
function move(
  s: GameState,
  e: Entity,
  speed: number,
  dt: number,
  onTile: (e: Entity) => void
) {
  if (speed <= 0) return;
  let remaining = speed * dt;

  // One dt can cross several tiles at high speed; the guard is just insurance
  // against a pathological speed value spinning here forever.
  for (let guard = 0; remaining > 0 && guard < 64; guard++) {
    if (e.p === 0) {
      onTile(e);
      if (
        (e.want.x !== 0 || e.want.y !== 0) &&
        isOpen(s.rows, e.tx + e.want.x, e.ty + e.want.y)
      ) {
        e.dir = e.want;
      }
      const stopped = e.dir.x === 0 && e.dir.y === 0;
      if (stopped || !isOpen(s.rows, e.tx + e.dir.x, e.ty + e.dir.y)) return;
    }

    const need = 1 - e.p;
    if (remaining < need) {
      e.p += remaining;
      return;
    }
    remaining -= need;
    e.tx += e.dir.x;
    e.ty += e.dir.y;
    e.p = 0;
  }
}

function eat(s: GameState, e: Entity, who: "player" | "ai") {
  const i = idx(s, e.tx, e.ty);
  if (s.pellets[i] !== 1) return;
  s.pellets[i] = 0;
  s.pelletsLeft--;
  if (who === "player") s.saved++;
  else s.automated++;
}

/** Somewhere open, pellet-free, and not right on top of the player. */
function pickPowerTile(s: GameState): { x: number; y: number } | null {
  const options: { x: number; y: number }[] = [];
  for (let y = 0; y < s.height; y++) {
    for (let x = 0; x < s.width; x++) {
      if (!isOpen(s.rows, x, y)) continue;
      if (hasPellet(s, x, y)) continue;
      const far = Math.abs(x - s.player.tx) + Math.abs(y - s.player.ty);
      if (far < 4) continue;
      options.push({ x, y });
    }
  }
  if (!options.length) return null;
  return options[Math.floor(Math.random() * options.length)];
}

/** Advance the simulation by a fixed `dt` (seconds). Mutates and returns `s`. */
export function step(s: GameState, dt: number): GameState {
  if (s.outcome !== "playing") return s;
  s.time += dt;

  const active = s.active && s.active.until > s.time ? s.active : null;
  if (s.active && !active) s.active = null;

  // ---- player -------------------------------------------------------------
  const stunned = s.time < s.stunUntil;
  const playerSpeed = active?.type === "coffee" ? BASE_SPEED * 1.4 : BASE_SPEED;
  if (!stunned) move(s, s.player, playerSpeed, dt, (e) => eat(s, e, "player"));

  // ---- AI -----------------------------------------------------------------
  // Greedy: re-target the nearest remaining pellet each time it lands on a
  // tile centre. Its speed, not its cleverness, is the difficulty.
  let aiSpeed = BASE_SPEED * s.level.aiSpeed;
  if (active?.type === "committee") aiSpeed *= 0.45;
  if (active?.type === "union") aiSpeed = 0;

  move(s, s.ai, aiSpeed, dt, (e) => {
    eat(s, e, "ai");
    if (Math.random() < s.level.confusion) {
      e.want = confidentlyWrong(s, e);
      return;
    }
    const path = bfs(s, { x: e.tx, y: e.ty }, (x, y) => hasPellet(s, x, y));
    // No pellets left to chase; the round is about to end anyway.
    e.want = path.length ? { x: path[0].x - e.tx, y: path[0].y - e.ty } : DIRS.none;
  });

  // ---- contact ------------------------------------------------------------
  const dx = ex(s.player) - ex(s.ai);
  const dy = ey(s.player) - ey(s.ai);
  if (dx * dx + dy * dy < 0.62 * 0.62 && s.time > s.immuneUntil && !stunned) {
    s.stunUntil = s.time + STUN_SECONDS;
    s.immuneUntil = s.time + STUN_SECONDS + STUN_IMMUNITY;
  }

  // ---- power-ups ----------------------------------------------------------
  if (!s.power && s.time >= s.powerAt) {
    const tile = pickPowerTile(s);
    if (tile) {
      s.power = {
        type: POWER_TYPES[Math.floor(Math.random() * POWER_TYPES.length)],
        ...tile,
      };
    } else {
      s.powerAt = s.time + 2;
    }
  }
  if (s.power) {
    const near =
      Math.abs(ex(s.player) - s.power.x) < 0.6 &&
      Math.abs(ey(s.player) - s.power.y) < 0.6;
    if (near) {
      s.active = { type: s.power.type, until: s.time + POWERS[s.power.type].seconds };
      s.power = null;
      s.powerAt = s.time + POWER_RESPAWN;
    }
  }

  // Recruiter draws the route to the nearest job. Recomputed each step so the
  // line stays honest as pellets disappear underneath it.
  s.hint =
    active?.type === "recruiter"
      ? bfs(s, { x: s.player.tx, y: s.player.ty }, (x, y) => hasPellet(s, x, y))
      : [];

  // ---- end of round -------------------------------------------------------
  if (s.pelletsLeft === 0) {
    s.outcome = s.saved > s.pelletsTotal / 2 ? "won" : "lost";
  }

  return s;
}

export const isStunned = (s: GameState) => s.time < s.stunUntil;
