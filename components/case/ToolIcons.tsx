// Small monochrome marks for the "Tools used" strip. Figma ships as a
// raster asset (public/projects/cms-editor/tools/figma.png); the rest are
// simplified inline SVGs since no brand asset exists for them in the repo.

export function CursorIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-[18px] w-[18px]">
      <path
        d="M5 3.5 19 12l-6.2 1.4L10.5 19.5 5 3.5Z"
        fill="white"
        fillOpacity={0.9}
      />
    </svg>
  );
}

export function ClaudeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-[18px] w-[18px]">
      <g stroke="white" strokeOpacity={0.9} strokeWidth={1.6} strokeLinecap="round">
        <path d="M12 2v20M2 12h20M5 5l14 14M19 5 5 19" />
      </g>
    </svg>
  );
}

export function GithubIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-[18px] w-[18px]">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C6.48 2 2 6.58 2 12.2c0 4.5 2.87 8.32 6.84 9.67.5.1.68-.22.68-.5v-1.94c-2.78.62-3.37-1.36-3.37-1.36-.45-1.18-1.11-1.5-1.11-1.5-.9-.63.07-.62.07-.62 1 .07 1.53 1.05 1.53 1.05.9 1.56 2.35 1.11 2.92.85.09-.66.35-1.11.63-1.37-2.22-.26-4.56-1.14-4.56-5.07 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.71 0 0 .84-.28 2.75 1.05a9.3 9.3 0 0 1 5 0c1.9-1.33 2.75-1.05 2.75-1.05.55 1.4.2 2.45.1 2.71.64.72 1.03 1.63 1.03 2.75 0 3.94-2.34 4.8-4.57 5.06.36.32.68.94.68 1.9v2.82c0 .28.18.61.69.5A10.2 10.2 0 0 0 22 12.2C22 6.58 17.52 2 12 2Z"
        fill="white"
        fillOpacity={0.9}
      />
    </svg>
  );
}

export function VercelIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-[18px] w-[18px]">
      <path d="M12 3 22 20H2L12 3Z" fill="white" fillOpacity={0.9} />
    </svg>
  );
}
