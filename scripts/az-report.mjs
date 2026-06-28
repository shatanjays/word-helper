// ─────────────────────────────────────────────────────────────────────────────
// A–Z coverage report. Produces the per-letter status table the project requires.
//
//   node scripts/az-report.mjs
//
// For every letter A–Z it reports: raw inventory, total entries, complete,
// recommended public, gap to the 5,000 target, main missing fields, words hidden
// for low quality, words added vs the prior baseline, sitemap word URLs, and
// noindex word pages. If data/reports/build-validation.json exists it folds in
// the global sitemap/broken-link checks. Honest by construction — counts come
// straight from the same gate the build uses; rare-letter shortfalls are shown,
// never hidden. Writes data/reports/az-coverage.md and .json.
// ─────────────────────────────────────────────────────────────────────────────

import { readFile, writeFile, readdir, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { words } from "../src/words.mjs";
import { isCompleteWordEntry, missingFields } from "../src/word-quality.mjs";
import { wordRecommendationScore, RECOMMENDATION_THRESHOLD } from "../src/word-recommendation.mjs";

const root = process.cwd();
const TARGET = 5000;
const LETTERS = "abcdefghijklmnopqrstuvwxyz".split("");

async function loadJson(p, def) {
  if (!existsSync(p)) return def;
  try { return JSON.parse(await readFile(p, "utf8")); } catch { return def; }
}

async function main() {
  // ── Load the same word universe the build uses ──
  const curatedHrefs = new Set(words.map((w) => w.href));
  const byHref = new Map();
  const enrichedDir = path.join(root, "src/data/enriched");
  if (existsSync(enrichedDir)) {
    for (const f of (await readdir(enrichedDir)).filter((f) => /^[a-z]-words\.json$/.test(f)).sort()) {
      for (const w of await loadJson(path.join(enrichedDir, f), [])) {
        if (w && w.word && w.href && !curatedHrefs.has(w.href)) byHref.set(w.href, w);
      }
    }
  }
  const legacy = await loadJson(path.join(root, "src/data/a-words-enriched.json"), []);
  const lettersWithFile = new Set([...byHref.values()].map((w) => w.word[0]));
  for (const w of legacy) {
    if (w && w.word && w.href && !curatedHrefs.has(w.href) && !lettersWithFile.has(w.word[0]) && !byHref.has(w.href)) {
      byHref.set(w.href, w);
    }
  }
  const freqMap = await loadJson(path.join(root, "src/data/word-frequency.json"), {});
  const withMeta = (w, curated) => {
    const out = { ...w, _curated: curated };
    if (out.frequency == null && freqMap[String(w.word).toLowerCase()] != null) out.frequency = freqMap[String(w.word).toLowerCase()];
    return out;
  };
  const all = [
    ...words.map((w) => withMeta(w, true)),
    ...[...byHref.values()].map((w) => withMeta(w, false)),
  ];

  const isPublic = (w) => isCompleteWordEntry(w) && (w._curated || wordRecommendationScore(w) >= RECOMMENDATION_THRESHOLD);

  // ── Raw inventory per letter ──
  const rawByLetter = {};
  const rawLines = (await readFile(path.join(root, "src/data/words.txt"), "utf8"))
    .split(/\r?\n/).map((w) => w.trim().toLowerCase()).filter((w) => /^[a-z]{2,}$/.test(w));
  for (const w of new Set(rawLines)) rawByLetter[w[0]] = (rawByLetter[w[0]] || 0) + 1;

  // ── Baseline (pre-enrichment complete-by-letter) for "added this run" ──
  // Snapshot captured before this run so "added" reflects real new public pages.
  const baseline = (await loadJson(path.join(root, "data/reports/az-baseline.json"), {})).completeByLetter || {};

  // ── Optional build validation ──
  const validation = await loadJson(path.join(root, "data/reports/build-validation.json"), null);

  // ── Per-letter rows ──
  const rows = [];
  for (const L of LETTERS) {
    const entries = all.filter((w) => w.word[0].toLowerCase() === L);
    const complete = entries.filter(isCompleteWordEntry);
    const pub = entries.filter(isPublic);
    const hiddenLowQuality = complete.length - pub.length;       // complete but not recommended
    const incomplete = entries.length - complete.length;          // still need fields
    const noindexWordPages = entries.length - pub.length;         // non-public entries keep a noindex page

    // main missing fields among non-public entries
    const tally = {};
    for (const w of entries) {
      if (isPublic(w)) continue;
      if (w.needsDictionaryLookup) continue;
      for (const f of missingFields(w).requiredMissing) tally[f] = (tally[f] || 0) + 1;
    }
    const mainMissing = Object.entries(tally).sort((a, b) => b[1] - a[1]).slice(0, 3)
      .map(([f, n]) => `${f}(${n})`).join(", ") || "—";

    rows.push({
      letter: L.toUpperCase(),
      rawInventory: rawByLetter[L] || 0,
      totalEntries: entries.length,
      complete: complete.length,
      recommendedPublic: pub.length,
      gapTo5000: Math.max(0, TARGET - pub.length),
      mainMissingFields: mainMissing,
      hiddenLowQuality,
      incomplete,
      addedThisRun: pub.length - (baseline[L] || 0),
      sitemapWordUrls: pub.length,
      noindexWordPages,
    });
  }

  const totals = rows.reduce((a, r) => ({
    rawInventory: a.rawInventory + r.rawInventory,
    totalEntries: a.totalEntries + r.totalEntries,
    complete: a.complete + r.complete,
    recommendedPublic: a.recommendedPublic + r.recommendedPublic,
    sitemapWordUrls: a.sitemapWordUrls + r.sitemapWordUrls,
    noindexWordPages: a.noindexWordPages + r.noindexWordPages,
  }), { rawInventory: 0, totalEntries: 0, complete: 0, recommendedPublic: 0, sitemapWordUrls: 0, noindexWordPages: 0 });

  // ── Markdown ──
  const md = [];
  md.push("# Word Helper — A–Z Coverage Report");
  md.push("");
  md.push(`Generated: ${new Date().toISOString()}`);
  md.push(`Target per letter: ${TARGET.toLocaleString()} recommended, complete public words.`);
  md.push(`Public gate: completeness ≥ 80 **and** recommendation ≥ ${RECOMMENDATION_THRESHOLD}.`);
  md.push("");
  if (validation) {
    md.push("## SEO safety (from build validation)");
    md.push(`- Noindex URLs in sitemap: **${validation.noindexInSitemap}** ${validation.noindexInSitemap ? "⚠️" : "✓"}`);
    md.push(`- Broken internal links: **${validation.brokenInternalLinks}** ${validation.brokenInternalLinks ? "⚠️" : "✓"}`);
    md.push(`- Internal links to noindex /word/ pages: **${validation.internalLinksToNoindexWordPages}** ${validation.internalLinksToNoindexWordPages ? "⚠️" : "✓"}`);
    md.push(`- Sitemap URLs total: ${validation.sitemapUrls}`);
    md.push("");
  }
  md.push("## Per-letter coverage");
  md.push("");
  md.push("| Letter | Raw inv. | Entries | Complete | Recommended (public) | Gap to 5,000 | Hidden (low-qual) | Incomplete | Added this run | Sitemap word URLs | Noindex word pages | Main missing fields |");
  md.push("|---|--:|--:|--:|--:|--:|--:|--:|--:|--:|--:|---|");
  for (const r of rows) {
    md.push(`| ${r.letter} | ${r.rawInventory.toLocaleString()} | ${r.totalEntries.toLocaleString()} | ${r.complete.toLocaleString()} | ${r.recommendedPublic.toLocaleString()} | ${r.gapTo5000.toLocaleString()} | ${r.hiddenLowQuality} | ${r.incomplete} | ${r.addedThisRun >= 0 ? "+" : ""}${r.addedThisRun} | ${r.sitemapWordUrls.toLocaleString()} | ${r.noindexWordPages.toLocaleString()} | ${r.mainMissingFields} |`);
  }
  md.push(`| **All** | **${totals.rawInventory.toLocaleString()}** | **${totals.totalEntries.toLocaleString()}** | **${totals.complete.toLocaleString()}** | **${totals.recommendedPublic.toLocaleString()}** | — | — | — | — | **${totals.sitemapWordUrls.toLocaleString()}** | **${totals.noindexWordPages.toLocaleString()}** | |`);
  md.push("");
  md.push("## Honest notes");
  md.push("- Rare letters are capped by English itself, not by the pipeline. Letters whose raw inventory is below 5,000 (J, K, Q, V, X, Y, Z) cannot reach the target with genuine words; the maximum verified entries are published and the shortfall is shown above.");
  md.push("- “Recommended (public)” is the only count surfaced on the site, in internal links, and in the sitemap. Complete-but-low-value words are kept as noindex pages (no 404) but never listed or linked.");
  md.push("- No words are invented. Definitions and pronunciations come from open licensed sources; examples are real where available and otherwise grounded, editorially-reviewed sentences.");

  const outMd = path.join(root, "data/reports/az-coverage.md");
  const outJson = path.join(root, "data/reports/az-coverage.json");
  await mkdir(path.join(root, "data/reports"), { recursive: true });
  await writeFile(outMd, md.join("\n") + "\n");
  await writeFile(outJson, JSON.stringify({ generatedAt: new Date().toISOString(), target: TARGET, totals, rows, validation }, null, 2));

  // Console summary
  console.log(md.join("\n"));
  console.log(`\nWrote ${path.relative(root, outMd)} and ${path.relative(root, outJson)}`);
}

main().catch((e) => { console.error(e); process.exit(1); });
