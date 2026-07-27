# This is NOT the Next.js you know

This version (Next 16) has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

Key gotchas already accounted for in this app:

- Dynamic route `params` is a **Promise** — `params: Promise<{ slug: string }>`, always `await params`.
- Styling is **Tailwind v4** (PostCSS-only, no `tailwind.config.js`). The design system lives in `app/globals.css` under `@theme` + custom-property tokens.
- Motion is **dependency-free** (hand-rolled `requestAnimationFrame` + CSS keyframes). Do not add framer-motion / gsap.
- Dev server runs on **port 3006**.

See `DECISIONS.md` for the running log of product/design decisions — update it with each feature.
