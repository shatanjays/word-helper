// ─────────────────────────────────────────────────────────────────────────────
// Word database quality audit.
//
// Scores every word entry (curated + enriched) with the SAME gate the build
// uses (src/word-quality.mjs), then reports how many words are publicly
// complete vs. held back, and which fields are missing across the database.
//
//   node scripts/audit-words.mjs           # print report
//   node scripts/audit-words.mjs --json    # also write data/reports/word-quality-audit.json
// ─────────────────────────────────────────────────────────────────────────────
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { words } from "../src/words.mjs";
import {
  isCompleteWordEntry,
  wordCompletenessScore,
  wordFieldStatus,
  missingFields,
  REQUIRED_FIELDS,
  PUBLIC_SCORE_THRESHOLD,
} from "../src/word-quality.mjs";

const root = process.cwd();

async function loadEnriched() {
  const p = path.join(root, "src/data/a-words-enriched.json");
  if (!existsSync(p)) return [];
  try {
    const data = JSON.parse(await readFile(p, "utf8"));
    const curatedHrefs = new Set(words.map((w) => w.href));
    return data.filter((w) => !curatedHrefs.has(w.href));
  } catch {
    return [];
  }
}

function pct(n, total) {
  return total === 0 ? "0.0%" : `${((n / total) * 100).toFixed(1)}%`;
}

async function main() {
  const enriched = await loadEnriched();
  const all = [
    ...words.map((w) => ({ ...w, _source: "curated" })),
    ...enriched.map((w) => ({ ...w, _source: "enriched" })),
  ];

  const total = all.length;
  const complete = all.filter(isCompleteWordEntry);
  const incomplete = all.filter((w) => !isCompleteWordEntry(w));

  // Field-presence tallies across the whole database.
  const missing = {
    definition: 0,
    example: 0,
    pronunciation: 0,
    partOfSpeech: 0,
    syllables: 0,
    synonyms: 0,
    antonyms: 0,
    seoTitle: 0,
    seoDescription: 0,
    etymology: 0,
    relatedWords: 0,
  };
  for (const w of all) {
    const s = wordFieldStatus(w);
    for (const f of Object.keys(missing)) {
      if (!s[f]) missing[f] += 1;
    }
  }

  // Score distribution buckets.
  const buckets = { "0-19": 0, "20-39": 0, "40-59": 0, "60-79": 0, "80-100": 0 };
  for (const w of all) {
    const sc = wordCompletenessScore(w);
    if (sc < 20) buckets["0-19"]++;
    else if (sc < 40) buckets["20-39"]++;
    else if (sc < 60) buckets["40-59"]++;
    else if (sc < 80) buckets["60-79"]++;
    else buckets["80-100"]++;
  }

  // Words that are ONE required field away from publishable (enrichment targets).
  const nearMiss = incomplete
    .filter((w) => !w.needsDictionaryLookup)
    .map((w) => ({ word: w.word, score: wordCompletenessScore(w), ...missingFields(w) }))
    .filter((r) => r.requiredMissing.length === 1)
    .sort((a, b) => b.score - a.score);

  const byLetter = {};
  for (const w of complete) {
    const l = (w.word[0] || "?").toLowerCase();
    byLetter[l] = (byLetter[l] || 0) + 1;
  }

  const lines = [];
  lines.push("WORD DATABASE QUALITY AUDIT");
  lines.push("=".repeat(52));
  lines.push(`Gate: all required fields present + score >= ${PUBLIC_SCORE_THRESHOLD}`);
  lines.push(`Required fields: ${REQUIRED_FIELDS.join(", ")}`);
  lines.push("");
  lines.push(`Total word entries .............. ${total}`);
  lines.push(`  curated ...................... ${words.length}`);
  lines.push(`  enriched ..................... ${enriched.length}`);
  lines.push(`COMPLETE (public, score 80+) .... ${complete.length}  (${pct(complete.length, total)})`);
  lines.push(`INCOMPLETE (held back) .......... ${incomplete.length}  (${pct(incomplete.length, total)})`);
  lines.push("");
  lines.push("Missing fields (count across all entries):");
  lines.push(`  definitions .................. ${missing.definition}`);
  lines.push(`  example sentences ............ ${missing.example}`);
  lines.push(`  pronunciation ................ ${missing.pronunciation}`);
  lines.push(`  part of speech ............... ${missing.partOfSpeech}`);
  lines.push(`  syllables .................... ${missing.syllables}`);
  lines.push(`  synonyms ..................... ${missing.synonyms}`);
  lines.push(`  antonyms ..................... ${missing.antonyms}`);
  lines.push(`  SEO title .................... ${missing.seoTitle}`);
  lines.push(`  SEO description .............. ${missing.seoDescription}`);
  lines.push(`  etymology .................... ${missing.etymology}`);
  lines.push(`  related words ................ ${missing.relatedWords}`);
  lines.push("");
  lines.push("Completeness score distribution:");
  for (const [range, n] of Object.entries(buckets)) {
    lines.push(`  ${range.padEnd(7)} ${String(n).padStart(5)}  ${pct(n, total)}`);
  }
  lines.push("");
  lines.push(`Complete words by letter: ${Object.entries(byLetter).sort().map(([l, n]) => `${l.toUpperCase()}:${n}`).join("  ")}`);
  lines.push("");
  lines.push(`One-field-away from publishable: ${nearMiss.length}`);
  for (const r of nearMiss.slice(0, 15)) {
    lines.push(`  ${r.word.padEnd(18)} score ${String(r.score).padStart(3)}  missing: ${r.requiredMissing.join(", ")}`);
  }
  if (nearMiss.length > 15) lines.push(`  …and ${nearMiss.length - 15} more`);

  const report = lines.join("\n");
  console.log(report);

  if (process.argv.includes("--json")) {
    const dir = path.join(root, "data/reports");
    await mkdir(dir, { recursive: true });
    const payload = {
      generatedAt: new Date().toISOString(),
      threshold: PUBLIC_SCORE_THRESHOLD,
      requiredFields: REQUIRED_FIELDS,
      totals: { total, curated: words.length, enriched: enriched.length, complete: complete.length, incomplete: incomplete.length },
      missing,
      scoreBuckets: buckets,
      completeByLetter: byLetter,
      completeWords: complete.map((w) => w.word).sort(),
      nearMiss,
    };
    await writeFile(path.join(dir, "word-quality-audit.json"), JSON.stringify(payload, null, 2));
    await writeFile(path.join(dir, "word-quality-audit.txt"), report + "\n");
    console.log(`\nWrote data/reports/word-quality-audit.json and .txt`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
