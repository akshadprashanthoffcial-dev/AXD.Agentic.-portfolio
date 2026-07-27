export default function Sparkles({
  size = 18,
  tone = "gradient",
}: {
  size?: number;
  tone?: "gradient" | "white";
}) {
  const stroke = tone === "white" ? "rgba(255,255,255,0.8)" : "url(#spk)";
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={stroke}
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {tone === "gradient" && (
        <defs>
          <linearGradient id="spk" x1="0" y1="0" x2="24" y2="24">
            <stop stopColor="#F59B00" />
            <stop offset="0.5" stopColor="#A11FF2" />
            <stop offset="1" stopColor="#EF3C3F" />
          </linearGradient>
        </defs>
      )}
      <path d="M12 3l1.6 4.6L18 9l-4.4 1.4L12 15l-1.6-4.6L6 9l4.4-1.4z" />
      <path d="M19 4v3M17.5 5.5h3" />
    </svg>
  );
}
