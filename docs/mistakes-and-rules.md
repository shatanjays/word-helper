# Mistakes → Rules — WordHelper.online

Each entry is a real pitfall hit on this repo, converted into a permanent rule.

## 1. Cards are not implementation
- **Mistake:** ~107k A–Z browse cards linked to `/word/<slug>/` pages that never existed →
  ~107k hard 404s / soft-404s (a near-certain AdSense rejection). An external audit counted
  the cards as "110k published pages" without clicking them.
- **Rule:** Every visible card/link must point to a real route OR a route covered by an
  explicit `_redirects` rewrite. After a build, scan internal links against `dist/` (treat
  rewrite-covered prefixes as valid) and assert **0 broken**.

## 2. Published claims must match reality
- **Mistake:** The Editorial Policy stated every published word page has etymology, word
  family, memory tip, and ≥3 synonyms/antonyms — but the enriched pages have none of those.
  Indexing them would contradict the site's own policy.
- **Rule:** If a trust/policy page describes a quality bar, the indexed set must actually meet
  it. When they diverge, fix the gate or the policy text — never publish a false claim.

## 3. Verify route slugs before linking
- **Mistake:** Homepage linked `/practice/synonym-matching/` but the emitted route is
  `/practice/synonym-match/` → broken link.
- **Rule:** Cross-check every hand-written internal href against the actual `emit()`/`href`
  the render function produces. Prefer referencing the same constant.

## 4. qlmanage scales SVG to fill a square
- **Mistake:** Rendering a 1200×630 OG SVG with `qlmanage -s 1200` produced a 1200×1200 image
  with the design scaled to fill height → horizontal clipping.
- **Rule:** Author the OG SVG as a **1200×1200 square** with the design centered in the middle
  630-row band, render to a true square, then `sips -c 630 1200` center-crop. Commit the PNG
  (`src/assets/og-image.png`) and copy it in the build — do not run qlmanage at build time
  (macOS-only; Cloudflare build hosts are Linux).

## 5. Cloudflare Pages `_redirects` cannot match by hostname
- **Mistake:** Tried to express a `*.pages.dev` → apex 301 in `_redirects`; it only matches
  paths, not hosts.
- **Rule:** Host-based 301 (preview → apex) must be a Cloudflare **Redirect Rule** in the
  dashboard, added after the custom domain is attached. `_redirects` handles path rewrites
  only (e.g. the `/word/*` catch-all). The apex `<link rel=canonical>` is the primary SEO
  signal and is already correct regardless of host.

## 7. Every form/control must be styled — unstyled forms leak native UI
- **Mistake:** The header `.header-search` form had **zero CSS**, so the browser rendered
  a native `<button>Search</button>` that floated out of the header and an oversized
  unstyled icon — read on a live screenshot as a "detached floating button + ghost artifact."
- **Rule:** Never ship a form/interactive component without explicit styles. When adding
  markup in `build.mjs`, add its CSS in the same change. Grep the stylesheet for the new
  class before calling it done.

## 8. Dark theme = lightness ladder + visible borders, never pale shadows
- **Rule:** On dark, separate surfaces with a stepped lightness ladder (page `#0e1524` <
  secondary `#151d30` < card `#1b2438` < elevated `#222c43`) plus visible borders
  (`#2c3650`) and a faint `inset 0 1px 0 rgba(255,255,255,0.05)` top highlight. The light
  theme's pale shadows (opacity ≤0.10) vanish on dark — do not rely on them for separation.
- **Rule:** On dark, a bright accent CTA (`#5e93d6`) needs **dark ink text** (`#0e1524`,
  5.75:1) — white fails AA (3.17:1). The active tab is a *tinted* state (`--navy-soft` bg +
  accent text), never a solid fill, so it stays distinct from the primary CTA.

## 9. Theme default is light, deterministic, no-flash
- **Rule:** First visit always renders **light**, regardless of OS `prefers-color-scheme`.
  The inline `<head>` script sets `data-theme` to `dark` only if `localStorage` says so, else
  `light` — before CSS paint (zero flash). Never reintroduce a `prefers-color-scheme` auto
  switch in the init script, `initTheme()`, or as an `@media` block in CSS; it would override
  the light default. The toggle persists the choice and swaps the moon/sun icon + theme-color.

## 6. Static assets win over `_redirects` splats on Pages
- **Note (relied upon):** `/word/* /word-lookup/ 200` does NOT clobber the real
  `/word/<slug>/index.html` files — Cloudflare Pages serves existing static assets before
  applying splat rewrites (same reason the SPA `/* /index.html 200` pattern works). Verified
  by design; re-confirm if Cloudflare changes asset/redirect precedence.

## 10. The keepalive dev-server can silently corrupt a production dist
- **What happened (July 2026):** `keep-local-server.mjs` (long-running keepalive) restarts
  `dev-server.mjs` whenever its health check fails. The dev server auto-runs a plain
  `node scripts/build.mjs` (staging, unsharded) when `dist/index.html` is missing. A
  production `rm -rf dist && build:prod` made the keeper's dev server unhealthy → keeper
  respawned it → it started its own build that RACED the production build, and a deploy
  uploaded the corrupted half-written dist. The live site briefly served the homepage for
  every URL (SPA fallback, because 404.html was missing from the artifact).
- **Rule:** unattended (keeper-spawned) dev servers run with `DEV_AUTOBUILD=0` and never
  build. Manual `npm run dev` keeps the auto-build convenience.
- **Rule:** immediately before ANY `wrangler pages deploy`, verify dist integrity in the
  same shell: `node scripts/check-deploy-output.mjs` must pass (file count ~2,7xx in shard
  mode; catches a mid-write dist) AND no `build.mjs` process may be running
  (`ps aux | grep '[b]uild.mjs'` empty). After deploying, verify live CONTENT (curl a
  changed page), never just HTTP 200s or wrangler's exit code.
