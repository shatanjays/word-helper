/**
 * Word Helper — Dictionary Import Pipeline
 *
 * Reads all legally usable word sources, normalizes entries,
 * merges curated data, applies quality scoring, and writes
 * the processed word index to data/processed/word-index.json.
 *
 * Sources:
 *   1. ENABLE word list (src/data/words.txt) — public domain, 172K+ words
 *   2. Curated rich entries (src/words.mjs) — manually authored, full quality
 *
 * Future sources (add to /data/sources/ and extend this script):
 *   - CMU Pronouncing Dictionary (BSD license) — for pronunciation data
 *   - WordNet (Princeton license) — for synsets, relations, definitions
 *   - Custom enrichment JSON files in /data/sources/enrichments/
 */

import { readFile, writeFile, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

// ── Syllable estimation ────────────────────────────────────────────
// Approximation only. Curated entries have exact syllable data.
function estimateSyllables(word) {
  if (!word || word.length === 0) return 1;
  const w = word.toLowerCase().replace(/(?:es?|ed)$/, "").replace(/e$/, "");
  const groups = w.match(/[aeiouy]+/g);
  return Math.max(1, groups ? groups.length : 1);
}

function estimateSyllableBreak(word) {
  const count = estimateSyllables(word);
  if (count === 1) return word;
  // Simple split: divide into roughly equal chunks
  const len = word.length;
  const chunkSize = Math.ceil(len / count);
  const parts = [];
  for (let i = 0; i < len; i += chunkSize) {
    parts.push(word.slice(i, i + chunkSize));
  }
  return parts.join("·");
}

// ── Quality scoring ────────────────────────────────────────────────
// Returns 0–100. Pages need ≥70 to be indexable.
function scoreEntry(entry) {
  let score = 0;
  if (entry.definition || entry.simpleDefinition || entry.detailedDefinition) score += 30;
  if (entry.examples && entry.examples.length >= 2) score += 20;
  if (entry.examples && entry.examples.length >= 1) score += 5;
  if (entry.synonyms && entry.synonyms.length >= 3) score += 8;
  if (entry.antonyms && entry.antonyms.length >= 1) score += 4;
  if (entry.pronunciation || entry.syllableBreak) score += 8;
  if (entry.syllableCount && entry.syllableCount > 0) score += 2;
  if (entry.wordFamily && entry.wordFamily.length >= 2) score += 8;
  if (entry.partOfSpeech) score += 5;
  if (entry.etymology) score += 4;
  if (entry.usageNote) score += 3;
  if (entry.faqs && entry.faqs.length >= 2) score += 3;
  return Math.min(100, score);
}

// ── Slug generation ────────────────────────────────────────────────
function makeSlug(word) {
  return word
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

// ── Normalize ENABLE word entry ────────────────────────────────────
function normalizeEnableWord(rawWord) {
  const word = rawWord.trim().toLowerCase();
  if (!word || !/^[a-z][a-z'-]*[a-z]$/.test(word) && word.length < 2) return null;
  if (word.length < 2) return null;
  const slug = makeSlug(word);
  const syllableCount = estimateSyllables(word);
  const syllableBreak = estimateSyllableBreak(word);

  const entry = {
    word,
    slug,
    syllableCount,
    syllableBreak,
    source: ["enable"],
    qualityScore: 0,
    isIndexable: false,
    reviewStatus: "raw",
    hasDefinition: false,
    hasExamples: false,
    hasPronunciation: false,
    hasSynonyms: false,
    hasPartOfSpeech: false,
  };

  entry.qualityScore = scoreEntry(entry);
  return entry;
}

// ── Normalize curated word entry ───────────────────────────────────
function normalizeCuratedWord(curatedEntry) {
  const word = curatedEntry.word.trim().toLowerCase();
  const slug = makeSlug(word);

  const entry = {
    word,
    slug,
    href: curatedEntry.href || `/word/${slug}/`,
    pronunciation: curatedEntry.pronunciation || null,
    partOfSpeech: curatedEntry.partOfSpeech || null,
    syllableCount: curatedEntry.syllables || estimateSyllables(word),
    syllableBreak: curatedEntry.syllableBreak || estimateSyllableBreak(word),
    metaTitle: curatedEntry.metaTitle || null,
    metaDescription: curatedEntry.metaDescription || null,
    definition: curatedEntry.definition || null,
    shortDef: curatedEntry.shortDef || null,
    examples: curatedEntry.examples || [],
    synonyms: curatedEntry.synonyms || [],
    antonyms: curatedEntry.antonyms || [],
    wordFamily: curatedEntry.wordFamily || [],
    relatedWords: curatedEntry.related || [],
    etymology: curatedEntry.etymology || null,
    memoryTip: curatedEntry.memoryTip || null,
    commonMistake: curatedEntry.commonMistake || null,
    usageNote: curatedEntry.usageNote || null,
    faqs: curatedEntry.faqs || [],
    relatedTools: curatedEntry.relatedTools || [],
    source: ["curated"],
    reviewStatus: "approved",
    hasDefinition: !!(curatedEntry.definition || curatedEntry.shortDef),
    hasExamples: !!(curatedEntry.examples && curatedEntry.examples.length > 0),
    hasPronunciation: !!curatedEntry.pronunciation,
    hasSynonyms: !!(curatedEntry.synonyms && curatedEntry.synonyms.length > 0),
    hasPartOfSpeech: !!curatedEntry.partOfSpeech,
  };

  entry.qualityScore = scoreEntry(entry);
  entry.isIndexable = entry.qualityScore >= 70;
  return entry;
}

// ── Main pipeline ──────────────────────────────────────────────────
async function main() {
  const startTime = Date.now();
  console.log("=== Word Helper — Dictionary Import Pipeline ===\n");

  // 1. Read ENABLE word list
  const enablePath = path.join(root, "src/data/words.txt");
  if (!existsSync(enablePath)) {
    console.error("ERROR: src/data/words.txt not found. Aborting.");
    process.exitCode = 1;
    return;
  }

  console.log("Reading ENABLE word list...");
  const rawEnable = await readFile(enablePath, "utf8");
  const enableLines = rawEnable.split("\n").map((l) => l.trim()).filter(Boolean);
  console.log(`  Raw ENABLE entries: ${enableLines.length.toLocaleString()}`);

  // 2. Load curated entries
  console.log("Loading curated word entries...");
  const { words: curatedWords } = await import("../src/words.mjs");
  console.log(`  Curated entries: ${curatedWords.length}`);

  // 3. Build curated map (slug → curated entry)
  const curatedMap = new Map();
  for (const entry of curatedWords) {
    const slug = makeSlug(entry.word);
    curatedMap.set(slug, entry);
  }

  // 4. Process ENABLE words
  console.log("\nProcessing ENABLE word list...");
  const wordIndex = new Map(); // slug → entry
  let enableRejected = 0;
  let enableDuplicates = 0;

  for (const rawWord of enableLines) {
    const entry = normalizeEnableWord(rawWord);
    if (!entry) {
      enableRejected++;
      continue;
    }
    if (wordIndex.has(entry.slug)) {
      enableDuplicates++;
      continue;
    }
    wordIndex.set(entry.slug, entry);
  }

  const enableAccepted = wordIndex.size;
  console.log(`  Accepted: ${enableAccepted.toLocaleString()}`);
  console.log(`  Rejected (malformed): ${enableRejected.toLocaleString()}`);
  console.log(`  Duplicates skipped: ${enableDuplicates.toLocaleString()}`);

  // 5. Merge curated entries (curated always overrides ENABLE)
  console.log("\nMerging curated entries (curated overrides ENABLE)...");
  let curatedNew = 0;
  let curatedOverride = 0;

  for (const [slug, curatedRaw] of curatedMap) {
    const normalized = normalizeCuratedWord(curatedRaw);
    if (!wordIndex.has(slug)) {
      curatedNew++;
    } else {
      curatedOverride++;
      // Preserve ENABLE source alongside curated
      normalized.source = ["curated", "enable"];
    }
    wordIndex.set(slug, normalized);
  }

  console.log(`  Curated entries merged (override): ${curatedOverride}`);
  console.log(`  Curated entries added (new): ${curatedNew}`);

  // 6. Final counts
  const allEntries = Array.from(wordIndex.values());
  const indexableEntries = allEntries.filter((e) => e.isIndexable);
  const withDefinition = allEntries.filter((e) => e.hasDefinition);
  const withPronunciation = allEntries.filter((e) => e.hasPronunciation);
  const withExamples = allEntries.filter((e) => e.hasExamples);
  const withSynonyms = allEntries.filter((e) => e.hasSynonyms);
  const rawOnly = allEntries.filter((e) => e.reviewStatus === "raw");

  // 7. Sort: curated first, then alphabetically
  allEntries.sort((a, b) => {
    if (a.reviewStatus === "approved" && b.reviewStatus !== "approved") return -1;
    if (b.reviewStatus === "approved" && a.reviewStatus !== "approved") return 1;
    return a.word.localeCompare(b.word);
  });

  // 8. Write processed word index
  const outDir = path.join(root, "data/processed");
  await mkdir(outDir, { recursive: true });
  const indexPath = path.join(outDir, "word-index.json");
  await writeFile(indexPath, JSON.stringify(allEntries, null, 0));
  const indexSizeKB = Math.round((await readFile(indexPath)).byteLength / 1024);
  console.log(`\nWord index written: ${indexPath}`);
  console.log(`  Size: ${indexSizeKB.toLocaleString()} KB`);

  // 9. Write a compact indexable-only file for A-Z browsing
  const indexablePath = path.join(outDir, "indexable-words.json");
  await writeFile(indexablePath, JSON.stringify(
    indexableEntries.map((e) => ({
      word: e.word,
      slug: e.slug,
      href: e.href,
      partOfSpeech: e.partOfSpeech,
      syllableCount: e.syllableCount,
      shortDef: e.shortDef,
      qualityScore: e.qualityScore,
    })),
    null,
    0,
  ));
  console.log(`  Indexable words file: ${indexablePath}`);

  // 10. Generate report data
  const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
  const report = {
    generatedAt: new Date().toISOString(),
    elapsedSeconds: parseFloat(elapsed),
    sources: [
      {
        name: "ENABLE Word List",
        file: "src/data/words.txt",
        license: "Public domain",
        rawEntries: enableLines.length,
        accepted: enableAccepted,
        rejected: enableRejected,
        duplicates: enableDuplicates,
      },
      {
        name: "Curated Rich Entries",
        file: "src/words.mjs",
        license: "Original — Word Helper",
        rawEntries: curatedWords.length,
        overrides: curatedOverride,
        newEntries: curatedNew,
      },
    ],
    totals: {
      totalWords: allEntries.length,
      indexableWords: indexableEntries.length,
      nonIndexableWords: allEntries.length - indexableEntries.length,
      rawEnableOnly: rawOnly.length,
      withDefinition: withDefinition.length,
      withPronunciation: withPronunciation.length,
      withExamples: withExamples.length,
      withSynonyms: withSynonyms.length,
    },
    qualityDistribution: {
      score90to100: allEntries.filter((e) => e.qualityScore >= 90).length,
      score70to89: allEntries.filter((e) => e.qualityScore >= 70 && e.qualityScore < 90).length,
      score50to69: allEntries.filter((e) => e.qualityScore >= 50 && e.qualityScore < 70).length,
      score1to49: allEntries.filter((e) => e.qualityScore >= 1 && e.qualityScore < 50).length,
      score0: allEntries.filter((e) => e.qualityScore === 0).length,
    },
    indexableWordsList: indexableEntries.map((e) => e.word),
    limitations: [
      "ENABLE list provides word strings only — no definitions, pronunciation, or meanings.",
      "Definitions, examples, synonyms, and other enriched data are available only for manually curated entries.",
      `${rawOnly.length.toLocaleString()} entries are raw ENABLE-only and will not appear as public word pages until enriched.`,
      "Syllable counts for non-curated entries are estimates (vowel-group approximation), not authoritative.",
      "No etymology, pronunciation, or semantic data available for ENABLE-only entries yet.",
      "Future enrichment sources (CMU Pronouncing Dictionary, open WordNet data) should be added to /data/sources/ and imported via dedicated scripts.",
    ],
    nextSteps: [
      "Add CMU Pronouncing Dictionary to /data/sources/ for pronunciation data on ~134K words.",
      "Add open pronunciation/syllable data for frequency-ranked words.",
      "Write original definitions for highest-frequency words to promote them to indexable.",
      "Create /scripts/import-pronunciation.mjs for CMU data pipeline.",
      "Create /scripts/import-wordnet.mjs for WordNet synset pipeline (if license permits).",
      "Implement /data/sources/enrichments/*.json for batch definition enrichment.",
      "Run quality review on enriched entries and update reviewStatus to 'approved'.",
    ],
  };

  const reportsDir = path.join(root, "data/reports");
  await mkdir(reportsDir, { recursive: true });
  await writeFile(path.join(reportsDir, "import-report.json"), JSON.stringify(report, null, 2));
  console.log(`  Report written: data/reports/import-report.json`);

  // 11. Console summary
  console.log("\n" + "=".repeat(50));
  console.log("DICTIONARY IMPORT REPORT");
  console.log("=".repeat(50));
  console.log(`Total words in system:        ${report.totals.totalWords.toLocaleString()}`);
  console.log(`Indexable (public pages):     ${report.totals.indexableWords}`);
  console.log(`Non-indexable (raw/partial):  ${report.totals.nonIndexableWords.toLocaleString()}`);
  console.log(`With definition:              ${report.totals.withDefinition}`);
  console.log(`With pronunciation:           ${report.totals.withPronunciation}`);
  console.log(`With examples:                ${report.totals.withExamples}`);
  console.log(`With synonyms:                ${report.totals.withSynonyms}`);
  console.log(`Quality ≥90 (excellent):      ${report.qualityDistribution.score90to100}`);
  console.log(`Quality 70-89 (indexable):    ${report.qualityDistribution.score70to89}`);
  console.log(`Quality 1-69 (partial):       ${report.qualityDistribution.score50to69 + report.qualityDistribution.score1to49}`);
  console.log(`Quality 0 (raw ENABLE only):  ${report.qualityDistribution.score0.toLocaleString()}`);
  console.log(`\nIndexable words: ${report.indexableWordsList.join(", ")}`);
  console.log(`\nCompleted in ${elapsed}s`);
  console.log("=".repeat(50));
  console.log("\nNOTE: Only indexable word pages will be included in sitemap.");
  console.log("      ENABLE-only entries (quality=0) remain non-indexable until");
  console.log("      enriched with definitions, examples, and pronunciation data.");
  console.log("      See data/reports/import-report.json for full details.");
}

main().catch((err) => {
  console.error("Import pipeline failed:", err);
  process.exitCode = 1;
});
