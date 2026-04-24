# Word Helper

Word Helper is a static word-tools platform for unscrambling letters, solving anagrams, finding rhymes, counting syllables, and exploring prefix or suffix word patterns.

Official production domain: https://wordhelper.online  
Official public email: hello@wordhelper.online

## Local Development

This project has no package dependencies beyond Node.js. Build the static site, then run the local preview server.

### If npm is on your PATH:

```bash
npm run build
npm run dev
```

### If npm is not on your PATH (run Node directly):

```bash
node scripts/build.mjs
node scripts/dev-server.mjs
```

The dev server tries port `3000` first and moves to the next free port if it is occupied. Watch the terminal output for the exact port number after startup.

### If another server already occupies port 3000:

```bash
node scripts/dev-server.mjs --port 3001
```

Or find and stop the old server:

```bash
lsof -ti:3000 | xargs kill -9
```

Then run the normal dev command.

## Production Metadata

SEO-facing URLs, canonical tags, Open Graph URLs, Twitter Cards, JSON-LD schema, sitemap, robots.txt, footer references, and legal references all use:

```
https://wordhelper.online
```

Localhost URLs appear only in dev-server output. They are not written into any production-facing file.

## Word Data

The build reads curated seed words from `src/data/seed-words.txt` and supplements with the system dictionary at `/usr/share/dict/words` when available. A denylist of bare affixes (`ing`, `er`, `ly`, `pre`, `re`, `un`, etc.) prevents non-words from entering the list.

See `src/data/WORD_DATA_LICENSE.md` for source documentation and production licensing notes.

## Build Output

The `dist/` directory contains the complete static site, ready for deployment to any static host (Cloudflare Pages, Vercel, Netlify, or plain object storage).

Key files in dist:
- `index.html` — homepage
- `tools/*/index.html` — six interactive word tools
- `guides/*/index.html` — seven guide articles
- `about/`, `contact/`, `privacy-policy/`, etc. — trust and legal pages
- `assets/site.css` — single stylesheet
- `assets/site.js` — all tool logic
- `assets/word-data.js` — 30,000-word list (sets `window.WORD_HELPER_WORDS`)
- `sitemap.xml`, `robots.txt` — SEO files
- `favicon.svg`, `og-image.svg`, `apple-touch-icon.svg` — brand assets

## Domain Check

To scan dist for any remaining placeholder or localhost references:

```bash
node scripts/check-domain-email.mjs
```
