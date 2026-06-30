/**
 * Word Helper — Dictionary Report Generator
 * Reads data/reports/import-report.json and prints a formatted human-readable report.
 * Run: node scripts/generate-report.mjs
 */
import { readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const reportPath = path.join(root, "data/reports/import-report.json");

if (!existsSync(reportPath)) {
  console.error("No report found. Run: node scripts/import-words.mjs first.");
  process.exitCode = 1;
  process.exit();
}

const report = JSON.parse(await readFile(reportPath, "utf8"));
const L = (n) => (typeof n === "number" ? n.toLocaleString() : n);

console.log("\n" + "=".repeat(60));
console.log("WORD HELPER — DICTIONARY IMPORT REPORT");
console.log("=".repeat(60));
console.log(`Generated: ${report.generatedAt}`);
console.log(`Import time: ${report.elapsedSeconds}s`);

console.log("\n── SOURCES ─────────────────────────────────────────────");
for (const src of report.sources) {
  console.log(`\n  ${src.name}`);
  console.log(`    File:    ${src.file}`);
  console.log(`    License: ${src.license}`);
  if (src.rawEntries !== undefined) console.log(`    Raw:     ${L(src.rawEntries)}`);
  if (src.accepted !== undefined) console.log(`    Accepted:${L(src.accepted)}`);
  if (src.rejected !== undefined) console.log(`    Rejected:${L(src.rejected)}`);
  if (src.overrides !== undefined) console.log(`    Override:${L(src.overrides)}`);
}

console.log("\n── TOTALS ──────────────────────────────────────────────");
const t = report.totals;
console.log(`  Total words in system:           ${L(t.totalWords)}`);
console.log(`  Indexable (public word pages):   ${L(t.indexableWords)}`);
console.log(`  Non-indexable (enrichment needed):${L(t.nonIndexableWords)}`);
console.log(`  With original definition:        ${L(t.withDefinition)}`);
console.log(`  With pronunciation:              ${L(t.withPronunciation)}`);
console.log(`  With example sentences:          ${L(t.withExamples)}`);
console.log(`  With synonyms:                   ${L(t.withSynonyms)}`);

console.log("\n── QUALITY DISTRIBUTION ────────────────────────────────");
const q = report.qualityDistribution;
console.log(`  Score 90-100 (excellent):        ${L(q.score90to100)}`);
console.log(`  Score 70-89  (indexable):        ${L(q.score70to89)}`);
console.log(`  Score 50-69  (partial):          ${L(q.score50to69)}`);
console.log(`  Score 1-49   (minimal):          ${L(q.score1to49)}`);
console.log(`  Score 0      (raw ENABLE only):  ${L(q.score0)}`);

console.log("\n── INDEXABLE WORD PAGES ────────────────────────────────");
console.log(`  ${report.indexableWordsList.join(", ")}`);

console.log("\n── KNOWN LIMITATIONS ───────────────────────────────────");
for (const lim of report.limitations) {
  console.log(`  • ${lim}`);
}

console.log("\n── NEXT ENRICHMENT STEPS ───────────────────────────────");
for (const step of report.nextSteps) {
  console.log(`  → ${step}`);
}

console.log("\n" + "=".repeat(60));
console.log("SITEMAP STATUS");
console.log("=".repeat(60));
console.log(`  Word pages in sitemap:  ${L(t.indexableWords)} (quality ≥70 only)`);
console.log(`  Excluded from sitemap:  ${L(t.nonIndexableWords)} (quality <70, needs enrichment)`);
const _sitemapHost = (process.env.HOST_CANONICAL || "https://wordhelper-online.pages.dev").replace(/\/+$/, "");
console.log(`  Sitemap URL:            ${_sitemapHost}/sitemap.xml`);
console.log("=".repeat(60) + "\n");
