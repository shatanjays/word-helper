# Do Not Break — WordHelper.online

Hard constraints for any future Claude/Codex/Cursor run on this repo. Violating
these is a regression even if the build passes.

## Stack reality
- This is a **custom Node.js static generator** (`scripts/build.mjs`), **not Next.js**.
  Build: `npm run build` → emits `dist/`. Package manager: **npm**. No lockfile, no framework.
- Pages are plain HTML/CSS/JS. No React/Vue. Do not introduce a framework or heavy deps.

## Single source of truth
- The canonical host lives in `src/content.mjs` → `site.url` (`https://wordhelper.online`).
  Everything (canonical, OG, sitemap, robots) derives from it via `absolute()` / `${site.url}`.
  **Never hardcode the host** anywhere else.

## Word pages & the index gate
- Only ~2,215 word pages exist as static files (96 curated + ~2,119 enriched a-words).
  The ~107k A–Z "browse" words are **stubs with no static page**; their `/word/<slug>/`
  links resolve via the `_redirects` rewrite `/word/* /word-lookup/ 200` to the single
  noindexed client-lookup template. **Do not** start emitting a static page per browse word
  (that recreates 100k+ thin pages → AdSense risk).
- `isPublishable(w)` in `build.mjs` is the **single** index-eligibility gate. Sitemap
  membership and the `noindex` flag both derive from it. Keep them in sync.
- `emit(route)` records `route.noindex`; `sitemap()` excludes noindex routes. If you add a
  new noindex page type, return `{ href, html, noindex: true }` from its render fn.

## Schema (JSON-LD)
- Every page must keep its existing `@type` blocks. You may ADD properties/types; never
  delete a node. Word pages: DefinedTerm + WebPage + BreadcrumbList + FAQPage (+ base
  Organization + WebSite). Tools: WebPage + SoftwareApplication + Offer + BreadcrumbList +
  FAQPage. After edits, confirm all `ld+json` blocks still `JSON.parse` cleanly.

## Tool computation logic is out of scope
- Do not "improve" or refactor the unscramble/anagram/rhyme/syllable/prefix/suffix
  algorithms or the word-data pipeline in `site.js` / `build.mjs`.

## SEO assets
- Never delete titles, meta descriptions, the single `<h1>`, canonical, OG/Twitter tags,
  breadcrumbs, internal links, or FAQ structure unless replacing with something stronger.

## Ads
- No AdSense/ad-network code is present. Reserved `.ad-slot` containers are `display:none`
  until `[data-ad-active]`. Activating ads = add the `<ins>` and the attribute; the CSS then
  reserves a CLS-safe min-height. Do not ship empty visible ad boxes (hurts AdSense review).
