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

On this machine, Node.js is at `/Applications/Codex.app/Contents/Resources/node` if it is not on your PATH:

```bash
/Applications/Codex.app/Contents/Resources/node scripts/build.mjs
/Applications/Codex.app/Contents/Resources/node scripts/dev-server.mjs
```

The dev server tries port `3006` first and moves to the next free port if it is occupied. Watch the terminal output for the exact port number after startup.

### If another server already occupies port 3006:

```bash
node scripts/dev-server.mjs --port 3007
```

Or find and stop the old server:

```bash
lsof -ti:3006 | xargs kill -9
```

Then run the normal dev command.

## Production Metadata

SEO-facing URLs, canonical tags, Open Graph URLs, Twitter Cards, JSON-LD schema, sitemap, robots.txt, footer references, and legal references all use:

```
https://wordhelper.online
```

Localhost URLs appear only in dev-server output. They are not written into any production-facing file.

## Word Data

The build reads curated seed words from `src/data/seed-words.txt` and supplements with the project-bundled word list at `src/data/words.txt`. That file is the **ENABLE word list** (Enhanced North American Benchmark Lexicon), a public-domain English word list containing approximately 172,000 words, safe for redistribution in any project.

If `src/data/words.txt` is not present, the build falls back to the system dictionary at `/usr/share/dict/words` (acceptable for development only, not for production distribution).

A denylist of bare affixes (`ing`, `er`, `ly`, `pre`, `re`, `un`, etc.) prevents non-words from entering the list. Output is capped at 30,000 words.

See `src/data/WORD_DATA_LICENSE.md` for full source documentation and licensing details.

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
- `404.html`, `_headers`, `_redirects` — static-host deployment metadata

## Deployment

Use Node.js 22 or newer. The repository includes Vercel and Netlify configuration files, and the generated `dist/` output also includes headers and a custom 404 fallback for static hosts that support `_headers` and `_redirects`.

### Vercel

```bash
npm run verify:deploy
vercel --prod
```

Vercel settings are declared in `vercel.json`:
- Build command: `npm run build`
- Output directory: `dist`
- Trailing slash URLs: enabled

### Netlify

```bash
npm run verify:deploy
netlify deploy --prod --dir=dist
```

Netlify settings are declared in `netlify.toml`:
- Build command: `npm run build`
- Publish directory: `dist`
- Node version: `22`

### Cloudflare Pages or another static host

```bash
npm run verify:deploy
```

Then publish the `dist/` directory.

## Domain Check

To scan dist for any remaining placeholder or localhost references:

```bash
node scripts/check-domain-email.mjs
```

For a full deployment sanity check, including route files, sitemap size, 404 handling, headers, and output size:

```bash
npm run verify:deploy
```
