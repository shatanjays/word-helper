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

## 6. Static assets win over `_redirects` splats on Pages
- **Note (relied upon):** `/word/* /word-lookup/ 200` does NOT clobber the real
  `/word/<slug>/index.html` files — Cloudflare Pages serves existing static assets before
  applying splat rewrites (same reason the SPA `/* /index.html 200` pattern works). Verified
  by design; re-confirm if Cloudflare changes asset/redirect precedence.
