/**
 * axd.blob rendered in chunky pixels — the arcade's own version of the
 * character, eye bars and all. Used as the certificate's seal, where the
 * smooth SVG blob would have looked like it came from a different game.
 */
export default function PixelBlob({ size = 56 }: { size?: number }) {
  // 11 × 11 grid: 0 empty, 1 body, 2 eye.
  const grid = [
    "00011111000",
    "00111111100",
    "01111111110",
    "11111111111",
    "11211111211",
    "11211111211",
    "11211111211",
    "11111111111",
    "01111111110",
    "00111111100",
    "00011111000",
  ];
  const n = grid.length;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${n} ${n}`}
      shapeRendering="crispEdges"
      role="img"
      aria-label="axd.blob"
    >
      <defs>
        <linearGradient id="pixelBlobBody" x1="0" y1="0" x2="0" y2={n} gradientUnits="userSpaceOnUse">
          <stop stopColor="#F59B00" />
          <stop offset="0.49" stopColor="#A11FF2" />
          <stop offset="1" stopColor="#EF3C3F" />
        </linearGradient>
      </defs>
      {grid.flatMap((row, y) =>
        [...row].map((cell, x) =>
          cell === "0" ? null : (
            <rect
              key={`${x}-${y}`}
              x={x}
              y={y}
              width="1"
              height="1"
              fill={cell === "2" ? "#fff" : "url(#pixelBlobBody)"}
            />
          )
        )
      )}
    </svg>
  );
}
