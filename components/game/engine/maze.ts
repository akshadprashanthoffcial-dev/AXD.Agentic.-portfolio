/**
 * EAT.JOBS mazes.
 *
 * Each level is a rectangular grid of characters, all rows the same length:
 *   #  wall
 *   .  a job pellet
 *   P  player spawn (open floor)
 *   A  the AI's spawn (open floor)
 *   o  open floor, no pellet (breathing room / power-up real estate)
 *
 * Player spawns far left, AI far right. `aiSpeed` is a multiple of the
 * player's base speed, so the AI is the difficulty dial, not the maze.
 */

export type Level = {
  /** Fake corporate rollout stage, shown in the HUD. */
  label: string;
  aiSpeed: number;
  /**
   * Chance, at each junction, that the AI takes a random turn instead of the
   * shortest route to the nearest job. Without this it paths perfectly and is
   * unbeatable at any speed; with it, it's confidently wrong now and then,
   * which is both winnable and truer to the joke.
   */
  confusion: number;
  rows: string[];
};

export const LEVELS: Level[] = [
  {
    label: "Pilot program",
    aiSpeed: 0.5,
    confusion: 0.34,
    rows: [
      "#####################",
      "#P...#.......#...o..#",
      "#.###.#.###.#.#####.#",
      "#.#.....#.#.....#...#",
      "#.#.###.#.#.###.#.#.#",
      "#...#...........#.#.#",
      "###.#.#########.#.#.#",
      "#...#.....#.....#...#",
      "#.#####.#.#.#####.#.#",
      "#.......#...#.....#.#",
      "#.#####.###.#.#####.#",
      "#..o..#.......#....A#",
      "#####################",
    ],
  },
  {
    label: "Phase two rollout",
    aiSpeed: 0.64,
    confusion: 0.22,
    rows: [
      "#####################",
      "#P..#.....#.....#..o#",
      "#.#.#.###.#.###.#.#.#",
      "#.#...#.......#...#.#",
      "#.#####.#####.#####.#",
      "#.......#...#.......#",
      "#.#####.#.#.#####.#.#",
      "#.#...#.#.#.#...#.#.#",
      "#.#.#...#...#.#.#.#.#",
      "#...#.#####.#.#...#.#",
      "###.#.#...#.#.#####.#",
      "#o..#...#...#......A#",
      "#####################",
    ],
  },
  {
    label: "Company-wide adoption",
    aiSpeed: 0.78,
    confusion: 0.12,
    rows: [
      "#####################",
      "#P....#.......#....o#",
      "#.###.#.#####.#.###.#",
      "#...#...#...#...#...#",
      "###.#.###.#.###.#.###",
      "#.....#...#...#.....#",
      "#.###.#.#####.#.###.#",
      "#...#.#...#...#.#...#",
      "#.#.#.###.#.###.#.#.#",
      "#.#...#...#...#...#.#",
      "#.#####.#####.#####.#",
      "#o.................A#",
      "#####################",
    ],
  },
];

export const WALL = "#";

/** True when (x, y) is inside the grid and not a wall. */
export function isOpen(rows: string[], x: number, y: number): boolean {
  if (y < 0 || y >= rows.length) return false;
  const row = rows[y];
  if (x < 0 || x >= row.length) return false;
  return row[x] !== WALL;
}

export function findChar(rows: string[], ch: string): { x: number; y: number } {
  for (let y = 0; y < rows.length; y++) {
    const x = rows[y].indexOf(ch);
    if (x !== -1) return { x, y };
  }
  // Every maze is authored with a P and an A; fall back to the top-left floor
  // tile rather than throwing and taking the whole page down.
  return { x: 1, y: 1 };
}
