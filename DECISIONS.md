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

## 9. Bespoke case studies *(v0.5)*

- **A project may shadow the generic gallery.** `app/projects/cms-editor-revamp/page.tsx` is a static route that wins over `app/projects/[slug]`. The slug is listed in `BESPOKE` inside `[slug]/page.tsx` so `generateStaticParams` doesn't also generate it.
- **Why:** the CMS project's argument is a product document (service model → strategy → cost model → surfaces), not a screen gallery. `Project.blocks` is empty for it; `fullTitle` carries the long headline while `title` stays short enough for the list card.
- **Case kit** (`components/case/`): `CaseKit.tsx` (useInView, Section, SectionHead, `Chain`, Metric count-up, Card, Tag) · `Diagrams.tsx` (OrchestratorCompare, TokenEconomics, TierExplorer, BeforeAfter, UserGap, CaseProgress) · `FeatureBlock.tsx` · `ScreenFrame.tsx`.
- **`Chain` renders nodes and connectors as siblings, not nested pairs.** Nesting each node+connector in one `flex-1` wrapper made the rail distribute unevenly and pushed connectors beside nodes instead of between them. Node labels wrap rather than truncate.
- **`ScreenFrame`** wraps every screenshot in browser chrome with pointer-tilt and a **click-to-zoom lightbox** — these product screens are too dense to read inline.
- Motion stays dependency-free: one IntersectionObserver flips `.in`, the `/* Case-study layer */` block in `globals.css` does the rest. All of it collapses under `prefers-reduced-motion`.

### Known content gaps (owner: Akshad)

- Figma MCP hit the Starter-plan call limit at 18 of 28 screens. **Still to pull** from file `olklbklMEAsoOd2ilJ5wkb`: `2252:255111`–`2252:255114` (**Application Form Builder** — feature 08 currently runs copy-only), `2252:255109`/`255110` (widget-library suggestions), `255107` (publish modal), `255108` (your-sites list), `255099`/`255100` (sitemap fragments). Drop into `public/projects/cms-editor/` and add a `shot` to the matching entry in `FEATURES`.
- **Old-CMS screenshots were never supplied.** Section 09 argues before/after structurally. Adding real old-CMS screens beside the new ones would make it land harder.

---

### Changelog

- **2026-08-04 — v0.8** Found and fixed a **site-wide** lightbox/fixed-positioning bug: `app/template.tsx`'s page-enter animation used `animation-fill-mode: both`, which keeps a *finished* animation "in effect" forever — and Chromium resolves its `filter`/`transform` end-state as `blur(0px)` / an identity matrix rather than a literal `none`, even though the keyframe says `none`. Any non-`none` filter or transform on an ancestor permanently creates a new containing block for `position: fixed` descendants, which is why `ScreenFrame`'s zoom lightbox (and potentially any other fixed-position UI) was rendering pinned thousands of pixels down the document instead of centered in the viewport. Fixed by making `template.tsx` a client component that strips the `page-enter` class on `animationend`, returning the wrapper to a plain unstyled div once the entrance animation finishes. Verified with a throwaway Playwright script (installed and removed) that walked the ancestor chain via `getComputedStyle` and confirmed the lightbox now centers correctly. Also fixed 4 instances of `filter: blur(0)` → `filter: none` in `globals.css` end-states (`.page-enter`, `.reveal.in`, `.blur-reveal.in .blur-letter`, `.tier-panel`) for the same underlying reason, though only the animation (not transition) ones actually persist post-completion.
- Swapped in the latest banner/cover replacements from `Joveo/banner.png` + `Joveo/cover.png`; banner container now sized to the true source aspect ratio (`2884/968`) via `aspectRatio` instead of a fixed `vh` crop.
- Reverted the hero "service delivery model" paragraph back to the original copy (the "managed service / who's behind the glass" reframe read as invented) and reverted `data/projects.ts` `intro` to match.
- Re-added `components/case/FeatureRail.tsx` — deleted in v0.7, restored per follow-up request — a dot rail scoped only to the 8-feature list (`right-24`, distinct lane from `CaseProgress`'s `right-6`) that reveals each dot as its feature scrolls into view and highlights the active one.
- Rewrote the closing "What this project taught me" section from 4 description cards to 4 single-line numbered statements — no supporting paragraphs, index + line only.

- **2026-08-04 — v0.7** CMS case-study follow-up pass: swapped in the replacement banner/cover files and dropped the dark gradient overlay on the banner (flat image, no scrim); reverted the hero paragraph to the original "service delivery model" copy (the reframed version read as made-up); removed `FeatureRail` entirely (the reader didn't want a second scroll rail after seeing it live) — `components/case/FeatureRail.tsx` deleted; removed the standalone "field picker" screenshot block from the product section (feature 08's own screenshot stays); fixed `ScreenFrame`'s zoom lightbox, which was constraining the full image to the *thumbnail's* declared aspect ratio — it now renders the source file directly via a plain `<img>` sized by its own intrinsic dimensions (`max-h-[88vh] max-w-[92vw] object-contain`), so mismatched `ratio` props on any screenshot no longer clip the zoomed view; and rebuilt `LiveDemo` from a click-to-edit hero + command bar into a straight port of **Brand Studio**'s picker UI — a left list of brandings (swatch pair, name, font) and a live-updating career-site preview on the right, no chat/editing surface (that part wasn't real, only the brand re-skin was).

- **2026-08-04 — v0.6** CMS case-study revision pass: added a real banner/cover (`public/projects/cms-editor/{banner,cover}.png`, `Project.banner` field), reframed the summary to "Joveo still delivers career sites as a service — I rebuilt the tooling layer, which internal devs now use" instead of implying the service model itself changed, swapped the external "View Prototype" CTA for an in-page anchor to `#live-demo`, redesigned the review-cycle stat block as a connected timeline with a rollup total, removed the "old CMS exposed its implementation" paragraph and the "Supporting surfaces" screenshot strip, bumped the widget-library stat from 35 → 70+ everywhere it's cited, added a routing explainer to the Cost Model bars, gave feature 08 (Application Form Builder) real screenshots, restyled the live-demo section header, rewrote the closing section as four short bolded takeaways, and added `components/case/FeatureRail.tsx` — a second scroll-reactive rail (dots + names) that only appears while the reader is inside the 8-feature list and tracks which one is active, alongside the existing top-level `CaseProgress` rail.

- **2026-07-26 — v0.1** Initial full build: scaffold, tokens, axd.blob, search routing, nav overlay, and all pages (Home, About, Projects list + detail ×5, Contact, Oops, 404).
- **2026-07-26 — v0.2** Effects pass: fluid-motion background, faithful blob (57:1266), ripple rings, liquid-glass search/nav, inline hover-expand nav (no modal), CTA per SVG, 3D About portrait, animated social avatars, About tile-ring + glow, projects list layout.
- **2026-07-26 — v0.3** Revisions: reverted search bar + nav to **transparent** (gradient border + black fill) — liquid glass removed from both; blob highlights fully blurred via feathered radial mask + large filter region (no hard edge); ripple rings made visible + centered (fixed keyframe translate that offset them → removed the stray "circles on the right"); nav dropdown now opens on focus with **premade default suggestions**; **Neue Montreal** self-hosted from `app/fonts/` (`next/font/local`, was Hanken stand-in); home hero spacing tightened (blob 240, calmer scale).
- **2026-08-03 — v0.5** Bespoke CMS case study: renamed the project to *Reimagining an Enterprise CMS into an AI-first Self-Serve Platform*, added a purpose-built long-form route with animated service-blueprint / orchestrator / token-cost / progressive-disclosure diagrams, 18 Figma screens in zoomable browser frames, and problem→solution→impact→how-it's-built blocks for 8 product surfaces.
- **2026-07-26 — v0.4** Personality + polish pass:
  - **Typewriter hero** (`components/ui/Typewriter.tsx`): the home headline now cycles a set of `HERO_PHRASES` (intro / what-I-do / fun facts / "are you hiring?") with a type→hold→delete loop and a gradient caret. Reduced-motion shows the first phrase only.
  - **RippleRings removed from the home hero** — with `fill-mode` unset, the delayed rings sat at full opacity before their turn, reading as a *static purple circle* behind the blob on load. Dropped it from `app/page.tsx` (component file kept, now unused).
  - **BlurReveal** (`components/ui/BlurReveal.tsx`): Apple-style letter-by-letter reveal — each glyph settles in from just above with a soft blur, staggered, fired on scroll-in. Applied to headings on About / Projects list / Project detail / Contact; body copy uses the existing block `Reveal` blur (letter-splitting every paragraph would be heavy + hurt readability).
  - **Nav blob → home link**: the collapsed nav blob is now a `Link` to `/` (stops propagation so it doesn't also focus the search input).
  - **Meaningful icons** (`components/ui/Icons.tsx`): suggestion chips + project filters/tags now use icons matched to their meaning (person / grid / envelope; play / seal / browser / compass / eye) instead of the generic sparkle.
  - **Blob click reaction**: clicking any `AxdBlob` triggers a flicker/blink + gradient scale-wave (`blobBurstFx`) and spawns an expanding ripple ring (`blob-burst`). Reduced-motion disables it.
  - **Projects list hover**: subtle row lift on the cover, faint row bg/border warm-up, details nudge right, and a fading `→` on the title.
  - **Instagram** handle updated to **@axd.labs** (new share URL) across `data/site.ts` + Contact.
