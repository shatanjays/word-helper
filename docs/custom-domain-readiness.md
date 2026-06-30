# Custom Domain Readiness

## Current state (June 2026)

- Production URL: **https://wordhelper-online.pages.dev**
- Custom domain: **wordhelper.online** — domain is owned but not yet attached to the Cloudflare Pages project
- All canonical URLs, OG tags, sitemaps, and JSON-LD schemas resolve to `wordhelper-online.pages.dev`

## When to switch to the live domain

Only switch after ALL of the following are true:

1. `wordhelper.online` resolves correctly in DNS (both A and CNAME via Cloudflare dashboard)
2. The custom domain is attached in the Cloudflare Pages dashboard (project → Custom Domains tab)
3. `curl -sI https://wordhelper.online/` returns HTTP 200 (or 301 → 200)
4. `curl -sI https://www.wordhelper.online/` returns a redirect to the apex domain (or vice-versa)
5. SSL certificate is provisioned and active (Cloudflare manages this automatically)

## How to switch

### Step 1 — Update package.json

`build:prod` currently builds for pages.dev. After the domain is live, update it to the branded domain:

```json
"build:prod": "SITE_ENV=production HOST_CANONICAL=https://wordhelper.online node scripts/build.mjs"
```

You can keep `build:live` as-is (it already uses `wordhelper.online`), or remove the distinction.

### Step 2 — Update HOST_CANONICAL default in build.mjs

In `scripts/build.mjs` around line 55, change the default fallback:

```js
// Before:
const HOST_CANONICAL = (process.env.HOST_CANONICAL || "https://wordhelper-online.pages.dev")...

// After:
const HOST_CANONICAL = (process.env.HOST_CANONICAL || "https://wordhelper.online")...
```

This ensures the default is self-correcting even if `HOST_CANONICAL` is not set.

### Step 3 — Rebuild and deploy

`npm run build:prod` and `build:live` now set `SHARD_PAGES=1`, which serves the
~64k word pages from gzipped JSON shards via `functions/word/[[slug]].js`. This is
**required** on the Cloudflare free plan: a non-sharded build emits ~116k files and
exceeds the 20,000-file cap (and fails `npm run check:deploy`). Use the sharded
command for any real deploy; `npm run build:prod:unsharded` exists only for local
inspection.

```bash
cd "word helper"
npm run verify:deploy   # sharded build + validate + domain + deploy-output checks
npx wrangler pages deploy dist --project-name=wordhelper-online --branch=main
```

### Step 4 — Verify

```bash
# Check canonical URLs in built HTML
grep -r 'rel="canonical"' dist/index.html

# Confirm sitemap uses the new host
head -5 dist/sitemap.xml

# Confirm OG URL
grep 'og:url' dist/index.html
```

### Step 5 — Run the validator

```bash
HOST_CANONICAL=https://wordhelper.online node --max-old-space-size=4096 scripts/validate-build.mjs
```

## What changes automatically when HOST_CANONICAL is set

All of these derive from `HOST_CANONICAL` in build.mjs — no manual find-replace needed:

- `<link rel="canonical">` on every static page
- `og:url` meta tags
- `sitemap.xml` and `sitemap_index.xml` `<loc>` values
- JSON-LD `@id`, `url`, `potentialAction.target` fields
- `llms.txt` site URL
- `robots.txt` `Sitemap:` line
- `check-deploy-output.mjs` sitemap URL check
- `validate-build.mjs` sitemap URL stripping
- `generate-report.mjs` sitemap URL output

## Policy pages

The Privacy Policy, Cookie Policy, and Affiliate Disclosure refer to the site generically (not by URL). The contact email `hello@wordhelper.online` is always real — it does not need to change.

## AdSense note

Google AdSense should not be applied for on `wordhelper-online.pages.dev`. Apply only after `wordhelper.online` is live and indexed. See `docs/adsense-readiness.md`.
