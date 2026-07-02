# AdSense Readiness Checklist

## Current status: NOT READY (June 2026)

Word Helper does not currently have AdSense active. This document tracks what
must be in place before applying. Do not add AdSense code before all items are checked.

---

## Hard blockers — must be resolved first

- [ ] **Custom domain is live** — Google AdSense requires a real domain, not a pages.dev URL. Apply only after `wordhelper.online` is attached and indexed. See `docs/custom-domain-readiness.md`.
- [ ] **Site is indexed under the real domain** — verify in Google Search Console that pages are crawled and indexed at `wordhelper.online`, not `wordhelper-online.pages.dev`.
- [ ] **Privacy Policy is updated** — the current Privacy Policy already states ads are not active and will be disclosed before launch. Update the policy to describe AdSense before activating it.
- [ ] **Cookie Policy is updated** — the current Cookie Policy accurately states no ad cookies are active. Update it before activating AdSense to describe advertising cookies and add opt-out instructions.
- [ ] **Consent mechanism is in place** — EEA/UK visitors require an IAB TCF-compliant CMP before personalized ad cookies are set. Google requires a certified CMP for EEA traffic once AdSense is active.
- [ ] **CSP headers include AdSense domains** — the CSP in `scripts/build.mjs:deployHeaders()` was intentionally tightened (June 2026) to remove pre-emptive AdSense domains while ads are not active. When activating AdSense, restore:
  - `script-src`: add `https://pagead2.googlesyndication.com https://*.googlesyndication.com https://googleads.g.doubleclick.net https://www.googletagmanager.com https://www.google-analytics.com`
  - `connect-src`: add `https://*.google-analytics.com https://*.googlesyndication.com`
  - `frame-src`: add `https://*.googlesyndication.com https://*.doubleclick.net`
  - Also update the CSP in `functions/word/[[slug]].js` — it must stay in sync with `_headers`.

---

## AdSense program policy requirements

These are Google's requirements for publisher approval. Each item must be
verified before submitting an AdSense application.

### Content quality
- [ ] All published pages pass the two-gate quality check (complete + recommended ≥ 50)
- [ ] No thin, auto-generated, or low-value pages are indexed
- [ ] Word pages have clear sourcing notes (editorial policy link)
- [ ] No doorway pages or pages that exist solely for search engine manipulation

### Navigation and UX
- [ ] Every page has clear navigation to the homepage
- [ ] Site has an "About" page explaining what it is
- [ ] Site has a Privacy Policy linked from the homepage footer
- [ ] Contact information is provided and accurate
- [ ] No popups, interstitials, or deceptive UI that could trigger ad fraud concerns

### Technical
- [ ] No other ad networks active alongside AdSense (choose one during initial approval period)
- [ ] AdSense auto-ads or manual ad units placed — NOT both at once for approval
- [ ] `ads.txt` file at site root: `google.com, pub-XXXXXXXXXX, DIRECT, f08c47fec0942fa0`
  - Replace `pub-XXXXXXXXXX` with the actual AdSense publisher ID

### Traffic
- [ ] Site has genuine human traffic (not self-referral, bots, or paid clicks)
- [ ] Google recommends at least several months of organic traffic before applying
- [ ] Search Console shows real impressions and clicks on the domain

---

## Applying for AdSense

1. Sign in to https://adsense.google.com
2. Add `wordhelper.online` as the site URL (not pages.dev)
3. Paste the AdSense verification snippet into the `<head>` of every page
4. In `scripts/build.mjs` `head()` function, add the verification snippet
5. Rebuild and deploy
6. Wait for Google's review (typically 1–4 weeks)

Do not place ad units until AdSense sends an approval email.

**Launch-order rule (critical):** all four policy pages (Privacy, Cookie, Terms,
Advertising Disclosure) currently state that no advertising is active. The updated
"advertising is served by Google AdSense; partners may use cookies; consent shown
where required" versions MUST ship in the SAME deploy that first enables ad code
(`ADS_ENABLED=1`). Never let live ad code and the policies disagree, even for a day —
that contradiction at review time is itself a rejection risk.

---

## Ad placement rules (apply once ads are live)

These rules protect against accidental-click / invalid-traffic rejections, which
are a top cause of AdSense action against interactive tool sites. Encode them in
the `adSlot()` placements in `scripts/build.mjs` (slots are currently gated off
behind `ADS_ENABLED`; set `ADS_ENABLED=1` only after approval).

- **Never adjacent to interactive controls.** No ad may sit next to a tool input,
  a submit/clear/copy button, a tool result panel, or a quiz answer/reveal, where
  it could be mistaken for UI or cause an accidental click.
- **No ads above the fold on thin tool pages.** Require a minimum amount of real
  content above the first ad; do not lead a tool page with an ad.
- **No disguised ads.** Never style or label an ad block to look like site content,
  a result card, or navigation. Keep ad regions clearly distinct.
- **CLS-safe only.** Every slot must reserve its height before the ad loads (the
  existing `.ad-slot` `min-height` pattern) so activating ads causes zero layout
  shift. Re-verify CLS after enabling.
- **Reasonable density.** Keep a healthy content-to-ad ratio; do not stack ad units
  or place more ads than content on a page.
- **Word pages:** at most one in-content unit, placed below the definition +
  examples (the value content), never above the fold or beside the word-tool links.
- **Keep CSPs in sync.** When enabling ads, re-add the AdSense/GA origins to BOTH
  the static `_headers` CSP (`deployHeaders()` in `build.mjs`) AND
  `functions/word/[[slug]].js` together — they must match.

---

## After approval

1. Update Privacy Policy to describe AdSense data practices
2. Update Cookie Policy to describe advertising cookies and link to Google opt-out
3. Update Affiliate Disclosure to confirm ads are now active
4. Expand CSP headers (see Hard Blockers above)
5. Add `ads.txt` to the dist root (it will need to be generated in `scripts/build.mjs` or added as a static file)
6. Implement CMP for EEA/UK visitors before enabling personalized ads in those regions
7. Test ads render correctly across desktop and mobile
