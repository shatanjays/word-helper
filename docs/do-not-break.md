# Do Not Break — WordHelper.online

Hard constraints for any future Claude/Codex/Cursor run on this repo. Violating
these is a regression even if the build passes.

## Stack reality
- This is a **custom Node.js static generator** (`scripts/build.mjs`), **not Next.js**.
  Build: `npm run build` → emits `dist/`. Package manager: **npm**. No lockfile, no framework.
- Pages are plain HTML/CSS/JS. No React/Vue. Do not introduce a framework or heavy deps.

## Single source of truth
- The **effective** canonical host is `HOST_CANONICAL` in `scripts/build.mjs` (defaults to
  `https://wordhelper-online.pages.dev`; `build.mjs` reassigns `site.url` to it at startup).
  `src/content.mjs` → `site.url` holds the brand host but is overridden by `HOST_CANONICAL`
  for every real build. Everything (canonical, OG, sitemap, robots, JSON-LD) derives from it
  via `absolute()` / `${site.url}`. **Never hardcode the host** anywhere else. To switch to
  the branded domain later, change `HOST_CANONICAL` / use `npm run build:live` — see
  `docs/custom-domain-readiness.md`.

## Word pages & the index gate
- ~64,000 in-depth word pages are published (those passing the quality gate). In production
  (`SHARD_PAGES=1`, the default for `build:prod`/`build:live`) they are **not** emitted as
  64k individual files — they are packed into gzipped JSON shards under `dist/_shards/` and
  served by the Pages Function `functions/word/[[slug]].js` (scoped by `dist/_routes.json` to
  `/word/*`). This keeps the deploy under Cloudflare's free-plan 20k-file cap. **Do not**
  start emitting a static page per word, and **do not** publish browse-word stubs as indexed
  pages (that recreates 100k+ thin pages → AdSense risk). There is no `/word/* /word-lookup/`
  rewrite in `_redirects`; unpublished words are linked through the `noindex` lookup template
  only where `wordHref()` routes them.
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
