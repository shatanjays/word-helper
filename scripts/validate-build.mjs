// ─────────────────────────────────────────────────────────────────────────────
// Build validator — SEO safety gate. Run AFTER a build (ideally build:prod).
//
//   node scripts/validate-build.mjs
//
// Checks (all must pass for a safe deploy):
//   1. 0 noindex URLs inside any sitemap.
//   2. 0 broken internal links (every internal href resolves to a real page/file).
//   3. 0 internal links pointing at a noindex /word/ page (no linking to thin/
//      incomplete word pages).
//   4. Every sitemap URL is actually present in dist.
//
// Writes data/reports/build-validation.json and exits non-zero on any violation.
// ─────────────────────────────────────────────────────────────────────────────

import { readFile, writeFile, readdir, mkdir } from "node:fs/promises";
import { existsSync, statSync } from "node:fs";
import path from "node:path";
import { slugFromPath } from "../src/shard-util.mjs";

const root = process.cwd();
const distDir = path.join(root, "dist");

async function walk(dir, out = []) {
  for (const ent of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) await walk(full, out);
    else out.push(full);
  }
  return out;
}

function routeOf(file) {
  // dist/words/a/index.html → /words/a/
  let rel = "/" + path.relative(distDir, file).split(path.sep).join("/");
  rel = rel.replace(/index\.html$/, "");
  if (!rel.endsWith("/")) return rel; // a real file (xml/txt/png)
  return rel;
}

const ROBOTS_NOINDEX = /<meta[^>]+name=["']robots["'][^>]*content=["'][^"']*noindex/i;

function extractInternalLinks(html) {
  const links = new Set();
  const re = /(?:href|src)=["'](\/[^"'#]*)["']/g;
  let m;
  while ((m = re.exec(html))) {
    let href = m[1].split("#")[0].split("?")[0];
    if (!href) continue;
    if (href.startsWith("/assets/")) continue; // hashed assets handled separately
    links.add(href);
  }
  return links;
}

async function main() {
  if (!existsSync(distDir)) {
    console.error("dist/ not found — run `npm run build` (or build:prod) first.");
    process.exit(1);
  }

  const files = await walk(distDir);
  const htmlFiles = files.filter((f) => f.endsWith(".html"));

  // route → { noindex } for every emitted HTML page
  const routeMap = new Map();
  const htmlByRoute = new Map();
  for (const f of htmlFiles) {
    const html = await readFile(f, "utf8");
    const route = routeOf(f);
    routeMap.set(route, { noindex: ROBOTS_NOINDEX.test(html) });
    htmlByRoute.set(route, html);
  }

  // Set of all real dist paths (for non-HTML targets like /sitemap.xml, /og-image.png)
  const filePaths = new Set(files.map((f) => "/" + path.relative(distDir, f).split(path.sep).join("/")));

  // SHARD_PAGES: /word/<slug>/ pages aren't files — they live in dist/_shards/*.json
  // and are served by the Pages Function. Load every sharded slug so the validator
  // treats those URLs as real, indexable pages (they are public by construction).
  const shardedSlugs = new Set();
  const shardsDir = path.join(distDir, "_shards");
  if (existsSync(shardsDir)) {
    for (const sf of await readdir(shardsDir)) {
      if (!sf.endsWith(".json")) continue;
      const obj = JSON.parse(await readFile(path.join(shardsDir, sf), "utf8"));
      for (const k of Object.keys(obj)) shardedSlugs.add(k);
    }
  }

  function resolves(href) {
    const wslug = slugFromPath(href);
    if (wslug && shardedSlugs.has(wslug)) return true;   // /word/<slug>/ served from a shard
    if (href === "/") return routeMap.has("/");
    if (routeMap.has(href)) return true;                 // /foo/ → /foo/index.html
    if (routeMap.has(href + "/")) return true;
    if (filePaths.has(href)) return true;                // /sitemap.xml, /robots.txt, /og-image.png
    // directory route without trailing slash
    const withSlash = href.endsWith("/") ? href : href + "/";
    return routeMap.has(withSlash);
  }
  function targetNoindex(href) {
    const wslug = slugFromPath(href);
    if (wslug && shardedSlugs.has(wslug)) return false;  // sharded word pages are public/indexable
    const r = href.endsWith("/") ? href : href + "/";
    const e = routeMap.get(r) || routeMap.get(href);
    return e ? e.noindex : false;
  }

  // ── 1 + 4: sitemap URLs ──
  // Read the chunk sitemaps (sitemap-words-1.xml, sitemap-pages.xml, …) for page
  // URLs; skip the two index files (sitemap.xml and sitemap_index.xml are
  // sitemapindex documents that point at the chunks, not page lists).
  const sitemapFiles = files.filter((f) => /sitemap[^/]*\.xml$/.test(f) && !/sitemap(_index)?\.xml$/.test(f));
  const sitemapUrls = new Set();
  const host = "https://wordhelper.online";
  for (const sf of sitemapFiles) {
    const xml = await readFile(sf, "utf8");
    const re = /<loc>([^<]+)<\/loc>/g;
    let m;
    while ((m = re.exec(xml))) {
      const u = m[1].trim().replace(host, "").replace(/^https?:\/\/[^/]+/, "");
      sitemapUrls.add(u || "/");
    }
  }
  const noindexInSitemap = [];
  const missingFromDist = [];
  for (const u of sitemapUrls) {
    if (!resolves(u)) missingFromDist.push(u);
    if (targetNoindex(u)) noindexInSitemap.push(u);
  }

  // ── 2 + 3: internal links across every page ──
  const brokenLinks = new Map(); // href → sample source page
  const wordLinksToNoindex = new Map();
  for (const [route, html] of htmlByRoute) {
    for (const href of extractInternalLinks(html)) {
      if (!resolves(href)) {
        if (!brokenLinks.has(href)) brokenLinks.set(href, route);
      } else if (href.startsWith("/word/") && targetNoindex(href)) {
        if (!wordLinksToNoindex.has(href)) wordLinksToNoindex.set(href, route);
      }
    }
  }

  // Duplicate <title> / meta description across static pages. (Word pages are
  // template-unique by headword and live in shards; they are spot-checked live.)
  const titleCounts = new Map();
  const descCounts = new Map();
  for (const [, html] of htmlByRoute) {
    const tm = html.match(/<title>([^<]*)<\/title>/i);
    const dm = html.match(/<meta\s+name=["']description["']\s+content=["']([^"']*)["']/i);
    if (tm) titleCounts.set(tm[1].trim(), (titleCounts.get(tm[1].trim()) || 0) + 1);
    if (dm) descCounts.set(dm[1].trim(), (descCounts.get(dm[1].trim()) || 0) + 1);
  }
  const dupTitles = [...titleCounts.entries()].filter(([, c]) => c > 1);
  const dupDescs = [...descCounts.entries()].filter(([, c]) => c > 1);

  const result = {
    generatedAt: new Date().toISOString(),
    pages: htmlFiles.length,
    shardedWordPages: shardedSlugs.size,
    duplicateStaticTitles: dupTitles.length,
    duplicateStaticMetaDescriptions: dupDescs.length,
    sitemapUrls: sitemapUrls.size,
    noindexInSitemap: noindexInSitemap.length,
    missingFromDist: missingFromDist.length,
    brokenInternalLinks: brokenLinks.size,
    internalLinksToNoindexWordPages: wordLinksToNoindex.size,
    samples: {
      noindexInSitemap: noindexInSitemap.slice(0, 10),
      missingFromDist: missingFromDist.slice(0, 10),
      duplicateStaticTitles: dupTitles.slice(0, 6).map(([t, c]) => `${c}× ${t}`),
      duplicateStaticMetaDescriptions: dupDescs.slice(0, 6).map(([t, c]) => `${c}× ${t.slice(0, 70)}`),
      brokenInternalLinks: [...brokenLinks.entries()].slice(0, 15).map(([h, src]) => `${h}  (on ${src})`),
      internalLinksToNoindexWordPages: [...wordLinksToNoindex.entries()].slice(0, 15).map(([h, src]) => `${h}  (on ${src})`),
    },
  };

  await mkdir(path.join(root, "data/reports"), { recursive: true });
  await writeFile(path.join(root, "data/reports/build-validation.json"), JSON.stringify(result, null, 2));

  const pass = result.noindexInSitemap === 0 && result.missingFromDist === 0 &&
    result.brokenInternalLinks === 0 && result.internalLinksToNoindexWordPages === 0;

  console.log("BUILD VALIDATION");
  console.log("=".repeat(48));
  console.log(`Static pages scanned ............ ${result.pages}`);
  console.log(`Word pages in shards ............ ${result.shardedWordPages}`);
  console.log(`Duplicate static titles ......... ${result.duplicateStaticTitles}   ${result.duplicateStaticTitles ? "⚠" : "✓"}`);
  console.log(`Duplicate static meta descs ..... ${result.duplicateStaticMetaDescriptions}   ${result.duplicateStaticMetaDescriptions ? "⚠" : "✓"}`);
  console.log(`Sitemap URLs .................... ${result.sitemapUrls}`);
  console.log(`Noindex URLs in sitemap ......... ${result.noindexInSitemap}   ${result.noindexInSitemap ? "✗" : "✓"}`);
  console.log(`Sitemap URLs missing from dist .. ${result.missingFromDist}   ${result.missingFromDist ? "✗" : "✓"}`);
  console.log(`Broken internal links ........... ${result.brokenInternalLinks}   ${result.brokenInternalLinks ? "✗" : "✓"}`);
  console.log(`Links to noindex /word/ pages ... ${result.internalLinksToNoindexWordPages}   ${result.internalLinksToNoindexWordPages ? "✗" : "✓"}`);
  for (const [k, arr] of Object.entries(result.samples)) {
    if (arr.length) { console.log(`\n  ${k}:`); arr.forEach((s) => console.log(`    - ${s}`)); }
  }
  console.log(`\nRESULT: ${pass ? "PASS ✓" : "FAIL ✗"}`);
  console.log("Wrote data/reports/build-validation.json");
  if (!pass) process.exitCode = 1;
}

main().catch((e) => { console.error(e); process.exit(1); });
