# Word Helper — Pre-deploy Quality Checklist

The single gate to run before every production deploy. It ties together the
automated checks (scripts the repo already ships) and the manual trust / E-E-A-T
checks that protect long-term SEO authority and future Google AdSense approval.

> Status legend: ☐ = to verify each deploy. Nothing here guarantees AdSense
> approval — Google controls that — but every item removes a known rejection or
> quality-regression risk.

---

## 0. Build the production output (correct file regime)

The canonical production deploy uses **shard mode** so the ~64k word pages ship
as gzipped JSON shards served by `functions/word/[[slug]].js`, keeping the file
count under Cloudflare's free-plan 20,000-file cap.

```bash
# Free Cloudflare plan (20k file cap) — REQUIRED regime for the real deploy:
SHARD_PAGES=1 npm run build:prod

# (Plain `npm run build:prod` emits ~116k individual files and will FAIL
#  check:deploy / exceed the free-plan cap. Only use it for local inspection.)
```

- ☐ Build completes with exit code 0 and **no errors/warnings** in the log.
- ☐ `dist/_routes.json` and `dist/_shards/` exist (confirms shard mode ran).
- ☐ Build summary prints the expected host (`https://wordhelper-online.pages.dev`)
      and a sane page/word count.

## 1. Automated gates

```bash
node scripts/validate-build.mjs        # structural validation (titles, canonicals, schema, etc.)
npm run check:domain                   # check-domain-email.mjs — email/host consistency
npm run check:deploy                   # check-deploy-output.mjs — file cap, sitemap, robots, no non-prod URLs
```

- ☐ `validate-build.mjs` passes. (Note: it is heap-hungry on the full 64k build;
      run with `node --max-old-space-size=4096 scripts/validate-build.mjs` if it OOMs.)
- ☐ `check:deploy` passes: file count under cap, sitemap URL count under 50k,
      **zero** non-production (non-pages.dev) URLs in the sitemap, no `/404/` in
      sitemap, every sitemap route resolves, robots.txt points at the sitemap.
- ☐ `check:domain` passes: contact email + canonical host consistent.

> Gap to remember: `npm run verify:deploy` currently chains build → check:domain →
> check:deploy but **not** `validate-build.mjs`. Run `validate-build.mjs` manually
> (or add it to the script) until that's wired in.

## 2. URLs, canonicals & indexing (technical SEO)

- ☐ Canonical, `og:url`, sitemap `<loc>`, and the robots `Sitemap:` line all use
      the **same** host — `https://wordhelper-online.pages.dev` today (never the
      not-yet-live branded domain).
- ☐ Canonicals are absolute and self-referential on every indexable page type
      (home, tool, word, list, guide, hub, policy).
- ☐ Only `/search/` and `/word-lookup/` are `noindex, follow`; nothing indexable
      carries an accidental `noindex`. Noindex pages are absent from every sitemap.
- ☐ New pages added this deploy appear in the correct sub-sitemap and are linked
      from nav/footer/hub (no orphans).
- ☐ Zero broken internal links (every card/link points to a real or
      rewrite-covered route).

## 3. Structured data

- ☐ Each page type emits the right JSON-LD and **all of it parses** (no trailing
      commas / broken JSON). Spot-check: home, a tool, a word page, a guide, a
      list, About, Editorial Team.
- ☐ Schema matches **visible** content (no `FAQPage` without visible Q&A; no
      fabricated `aggregateRating`, author credentials, or aspirational fields).
- ☐ All schema `@id`/`url` values use the pages.dev host.
- ☐ Run a sample through Google's Rich Results Test before a branded-domain launch.

## 4. Counts & factual accuracy (trust)

- ☐ Every public number is accurate and consistent everywhere it appears
      (homepage, tool pages, About, footer, meta, JSON-LD): tool count, quiz word
      count, guide count, word-list count, published-page count, word-database size.
- ☐ Counts are derived from a single source of truth (constants / `.length`), not
      hardcoded magic strings that can drift.
- ☐ The 327,000-word figure is described as the **tool/word database** (what it
      is), never as the on-site "search index" (which is small).
- ☐ "Last updated / reviewed" dates are build-driven, not stale hardcoded prose.

## 5. Policy pages accuracy

- ☐ No claims that advertising or analytics are active (they are not).
- ☐ Third-party data flows disclosed accurately: Synonym & Antonym Finder send the
      typed word to `api.datamuse.com`; word pages / word-lookup / word-list cards
      send the word to `api.dictionaryapi.dev`; everything else runs in-browser.
- ☐ `localStorage` keys all disclosed (recent tools, recent inputs, favourites,
      dictionary cache).
- ☐ Privacy Policy includes a children's-privacy statement, user-rights, and
      data-retention sections; real contact email present.
- ☐ No reference presents the branded domain as the current live host.

## 6. E-E-A-T & publisher identity

- ☐ About, Editorial Policy, Editorial Team, and Corrections pages exist, are
      linked, and carry honest identity (no invented people, degrees, awards,
      board, reviews, or traffic claims).
- ☐ Word pages carry the source/review note, AI-assist disclosure, last-generated
      date, and a working correction link.

## 7. Content quality (anti-thin / anti-doorway)

- ☐ No thin/doorway pages indexed; the publish gate (`isCompleteWordEntry` +
      recommendation score) is intact and sitemap/noindex stay in sync.
- ☐ New guides/lists have original explanation, real examples, internal links to
      tools + word pages, useful FAQ, Article/Breadcrumb schema, and a correction
      link — no filler, no keyword stuffing.

## 8. UX, accessibility & performance

- ☐ Mobile spot-check: hero, a tool, a word page, a list, a guide (no overflow, no
      tap-target crowding, form inputs don't trigger iOS zoom).
- ☐ Keyboard: skip link works, focus states visible, all controls reachable.
- ☐ Dynamic results & quiz feedback announce via `aria-live`.
- ☐ Colour contrast meets WCAG 2.2 AA for informational text.
- ☐ No browser console errors on home / tool / word / list / guide pages.
- ☐ No third-party scripts, trackers, or ad code present; heavy data scripts are
      `defer`/scoped; no layout shift (reserved slots).

## 9. Hard rules (never ship a violation)

- ☐ No dark mode. No popups/interstitials/dark-pattern UX.
- ☐ No active AdSense or ad code (and no ad slots near buttons/inputs/results).
- ☐ No fake authors, credentials, reviews, awards, expert claims, or traffic
      claims. No claim of Google affiliation or guaranteed approval.
- ☐ No existing URLs broken; no indexed pages deleted.

---

### Quick command block

```bash
SHARD_PAGES=1 npm run build:prod \
  && node --max-old-space-size=4096 scripts/validate-build.mjs \
  && npm run check:domain \
  && npm run check:deploy
# then manually walk sections 2–9 above before:
# npx wrangler pages deploy dist --project-name=wordhelper-online --branch=main
```
