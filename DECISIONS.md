# axd.labs — Decision Log

A running log of the important build decisions for the agent-style portfolio.
Concise on purpose — only decisions that would surprise someone new. **Add a
short entry with each new feature or prompt.**

---

## 1. Concept

- **The portfolio is an agent.** Recruiters "talk" to it: a character greets them, a search bar answers questions and routes to the right page, suggestion chips guide exploration.
- **The character is `axd.blob`** — one component reused everywhere (`components/blob/AxdBlob.tsx`). Referred to by name across the codebase.
- **Voice:** plain, friendly English (no clinical/"cleanroom" lexicon). Recruiters are the primary audience.

## 2. Stack *(locked)*

- **Framework:** Next.js 16 (App Router), React 19, TypeScript. Async dynamic `params` (`Promise<…>`).
- **Styling:** Tailwind v4, PostCSS-only, no config file. Tokens live in `app/globals.css` (`@theme` + CSS vars).
- **Motion:** dependency-free — hand-rolled `requestAnimationFrame` + CSS keyframes. **No** framer-motion / gsap.
- **Port:** `3006`. This is a **new** app; the older `axd-labs-site/` is untouched.

## 3. Visual system *(from Figma "AXD New Portfolio")*

- **Canvas:** pure black `#000`. Text tiers white / 70% / 45%.
- **Brand gradient:** `#F59B00 → #A11FF2 (49%) → #EF3C3F`. Used for the blob, borders, chip fills, glows, painted text (`.text-brand`).
- **Type:** display = **Neue Montreal** (self-hosted from `app/fonts/*.otf` via `next/font/local`), body = **Inter** (`next/font/google`).
- **Signature components:** gradient-bordered pill search bar with a blur glow; `rounded-full` sparkle suggestion chips over `--brand-sheen`.

## 4. axd.blob behavior

- Layers move **independently**: glow (breathe + proximity reaction), body (brand gradient + rotating conic sheen, tilts toward cursor), internal highlights (drift, `plus-lighter`), eyes (two white bars).
- **Eyes** track the pointer with damped lerp, **blink** on a random interval, and **look around** autonomously when the pointer is idle (>2.5s).
- One shared rAF loop; `prefers-reduced-motion` collapses to a gentle blink only.
- Props: `size`, `mode: hero | nav | footer`, `interactive`.

## 5. Search / routing *(client-side, no LLM)*

- `lib/search.ts` is a small intent index over real content (projects + about + contact).
- Live suggestions in the dropdown as you type; Enter routes to the top match.
- **No confident match → `/oops`** fun page (echoes the query, offers real chips).
- Nav on non-home pages = minimized blob pill → opens the expanded search overlay.

## 6. Content

- **5 projects** matching the Figma frames: `myntra-crm` (real, 8 images + copy ported from `axd-labs-site`), plus `cms-editor-revamp`, `web-template`, `rain-mazha`, `product-animations` — real copy/tags, **grey-box placeholders** for images until assets are added (drop files in `public/projects/<slug>/` and set `src` in `data/projects.ts`).
- Categories (filters): Motion Graphics · Brand Identity · Web Designs · Art Direction · Visual Design.
- About/contact content ported from `axd-labs-site/data`.

## 7. Known TODOs (content owner: Akshad)

- **Portrait:** add `public/operator/portrait.jpg`, then set `OPERATOR.hasPortrait = true`.
- Real images + captions for the four placeholder projects.
- Confirm the Joveo role/period line in `data/operator.ts`.

---

## 8. Effects & motion layer *(v0.2)*

- **FluidCursor** (`components/effects/FluidCursor.tsx`): WebGL fluid simulation as a fixed full-screen background (`-z-10`), splat colors biased to the brand palette. Pointer-events-none, listens on window, disabled under reduced-motion. Dye state persists across client navigations (mounted once in layout).
- **axd.blob** now renders the *exact* Figma vector (node 57:1266) as inline SVG with real gaussian-blur filters — soft dreamy orb, not a crisp circle. Layers (body spin/breathe, highlights drift, eyes track/blink) animate independently.
- **RippleRings** (`components/effects/RippleRings.tsx`): concentric expanding rings behind the home hero blob.
- **LiquidGlass** (`components/effects/LiquidGlass.tsx`): frosted backdrop-blur + brand tint + inset rim + sheen sweep + SVG displacement overlay (`GlassFilterDefs` injected once in layout). Applied to the home search bar and the nav search box + dropdown. `url()` is intentionally NOT in `backdrop-filter` (Chrome drops the whole declaration) — blur stays reliable; distortion is a separate overlay.
- **Nav** (`components/nav/NavPill.tsx`) reworked: collapsed blob+"AXD" pill → **hover expands inline into a search bar**; focus/typing shows an **inline frosted dropdown** (higher frost for readability). No modal, no page blur.
- **CTA** (`components/ui/CTA.tsx`): matches Figma CTA.svg — brand-gradient 14% fill, white/15 2px border, white sparkle + label, soft downward shadow. Used for "View Prototype" and "Get in touch".
- **FloatingCard** (`components/effects/FloatingCard.tsx`): 3D pointer-tilt (preserve-3d) on the About portrait.
- **SocialAvatars** (`components/ui/SocialAvatars.tsx`): animated avatar-group of social links (overlap → spread on hover, lift + tooltip). On About + Contact.
- **About bottom** reworked to match Figma 53:1189: portrait inside a circular tile ring with a large radial brand glow.
- **Projects list** reworked to match Figma 53:681: consistent left image + right title/chips/client (no alternating).

---

### Changelog

- **2026-07-26 — v0.1** Initial full build: scaffold, tokens, axd.blob, search routing, nav overlay, and all pages (Home, About, Projects list + detail ×5, Contact, Oops, 404).
- **2026-07-26 — v0.2** Effects pass: fluid-motion background, faithful blob (57:1266), ripple rings, liquid-glass search/nav, inline hover-expand nav (no modal), CTA per SVG, 3D About portrait, animated social avatars, About tile-ring + glow, projects list layout.
- **2026-07-26 — v0.3** Revisions: reverted search bar + nav to **transparent** (gradient border + black fill) — liquid glass removed from both; blob highlights fully blurred via feathered radial mask + large filter region (no hard edge); ripple rings made visible + centered (fixed keyframe translate that offset them → removed the stray "circles on the right"); nav dropdown now opens on focus with **premade default suggestions**; **Neue Montreal** self-hosted from `app/fonts/` (`next/font/local`, was Hanken stand-in); home hero spacing tightened (blob 240, calmer scale).
- **2026-07-26 — v0.4** Personality + polish pass:
  - **Typewriter hero** (`components/ui/Typewriter.tsx`): the home headline now cycles a set of `HERO_PHRASES` (intro / what-I-do / fun facts / "are you hiring?") with a type→hold→delete loop and a gradient caret. Reduced-motion shows the first phrase only.
  - **RippleRings removed from the home hero** — with `fill-mode` unset, the delayed rings sat at full opacity before their turn, reading as a *static purple circle* behind the blob on load. Dropped it from `app/page.tsx` (component file kept, now unused).
  - **BlurReveal** (`components/ui/BlurReveal.tsx`): Apple-style letter-by-letter reveal — each glyph settles in from just above with a soft blur, staggered, fired on scroll-in. Applied to headings on About / Projects list / Project detail / Contact; body copy uses the existing block `Reveal` blur (letter-splitting every paragraph would be heavy + hurt readability).
  - **Nav blob → home link**: the collapsed nav blob is now a `Link` to `/` (stops propagation so it doesn't also focus the search input).
  - **Meaningful icons** (`components/ui/Icons.tsx`): suggestion chips + project filters/tags now use icons matched to their meaning (person / grid / envelope; play / seal / browser / compass / eye) instead of the generic sparkle.
  - **Blob click reaction**: clicking any `AxdBlob` triggers a flicker/blink + gradient scale-wave (`blobBurstFx`) and spawns an expanding ripple ring (`blob-burst`). Reduced-motion disables it.
  - **Projects list hover**: subtle row lift on the cover, faint row bg/border warm-up, details nudge right, and a fading `→` on the title.
  - **Instagram** handle updated to **@axd.labs** (new share URL) across `data/site.ts` + Contact.
