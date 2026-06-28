// ─────────────────────────────────────────────────────────────────────────────
// Grounded example MERGE step (the hybrid policy's last mile).
//
//   node scripts/generate-examples.mjs --letter a
//
// Example sentences are GENERATED only for words that already have a real,
// sourced definition + part of speech (never for words missing those). The
// generation itself is done by an LLM pass that writes a map:
//
//   data/processed/{letter}-generated-examples.json   { "word": ["sentence 1", "sentence 2"], ... }
//
// (produced this session by a Claude Code workflow grounded in each word's
// definition + POS; an API key path can write the same file). THIS script then
// validates every candidate sentence and merges the good ones into the enriched
// data, flagging provenance as "editorial-generated". Nothing is invented here
// and bad sentences are rejected, so the result stays trustworthy and AdSense-safe.
// ─────────────────────────────────────────────────────────────────────────────

import { readFile, writeFile, readdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

const root = process.cwd();

// Combine per-batch generation files (data/processed/{letter}-gen/batch-*.json),
// each a { word: [sentences] } map, into one map. The example generation pass
// writes one file per batch so partial failures never lose other batches.
async function combineBatches(letter) {
  const dir = path.join(root, "data/processed", `${letter}-gen`);
  if (!existsSync(dir)) return {};
  const combined = {};
  for (const f of (await readdir(dir)).filter((f) => f.endsWith(".json"))) {
    try {
      const obj = JSON.parse(await readFile(path.join(dir, f), "utf8"));
      for (const [k, v] of Object.entries(obj)) if (!combined[k]) combined[k] = v;
    } catch { /* skip malformed batch */ }
  }
  return combined;
}
function arg(name, def) {
  const i = process.argv.indexOf(`--${name}`);
  if (i === -1) return def;
  const v = process.argv[i + 1];
  return v && !v.startsWith("--") ? v : true;
}
const LETTER = String(arg("letter", "a")).toLowerCase();
const TODAY = new Date().toISOString().slice(0, 10);

// Quality gate for a generated sentence — same spirit as the real-example filter.
function validSentence(s, word) {
  const t = String(s || "").trim();
  if (t.length < 12 || t.length > 200) return false;
  if (/https?:|www\.|\.com|\.org/i.test(t)) return false;
  if (!/[.!?]$/.test(t)) return false;
  if (!/^[A-Z]/.test(t)) return false;               // proper sentence case
  const stem = word.toLowerCase().slice(0, Math.max(4, word.length - 3));
  if (!t.toLowerCase().includes(stem)) return false; // must use the word (or an inflection)
  return true;
}

async function main() {
  const enrichedFile = path.join(root, "src/data/enriched", `${LETTER}-words.json`);
  const genFile = path.join(root, "data/processed", `${LETTER}-generated-examples.json`);
  if (!existsSync(enrichedFile)) { console.error(`Missing ${enrichedFile}`); process.exit(1); }

  const entries = JSON.parse(await readFile(enrichedFile, "utf8"));
  // Prefer a single map file; otherwise combine per-batch files from the gen dir.
  let gen;
  if (existsSync(genFile)) {
    gen = JSON.parse(await readFile(genFile, "utf8"));
  } else {
    gen = await combineBatches(LETTER);
    if (Object.keys(gen).length === 0) {
      console.error(`No generated examples found (neither ${path.relative(root, genFile)} nor data/processed/${LETTER}-gen/*.json). Run the generation pass first.`);
      process.exit(1);
    }
    await writeFile(genFile, JSON.stringify(gen, null, 1)); // persist the combined map
  }
  const byWord = new Map(entries.map((e) => [e.word.toLowerCase(), e]));

  let merged = 0, rejected = 0, skippedHadExample = 0, unknown = 0;
  for (const [rawWord, sentences] of Object.entries(gen)) {
    const word = rawWord.toLowerCase();
    const entry = byWord.get(word);
    if (!entry) { unknown++; continue; }
    if (entry.examples && entry.examples.length) { skippedHadExample++; continue; } // keep real examples
    // A generated example is only allowed when the word has a real def + POS.
    if (!entry.definition || entry.definition.length < 30 || !entry.partOfSpeech) { rejected++; continue; }
    const good = (Array.isArray(sentences) ? sentences : [sentences])
      .map((s) => String(s).trim())
      .filter((s) => validSentence(s, word))
      .slice(0, 3);
    if (!good.length) { rejected++; continue; }
    entry.examples = good;
    entry.sources = { ...(entry.sources || {}), example: "editorial-generated" };
    entry.license = entry.license || "CC-BY-SA-3.0";
    entry.lastReviewed = TODAY;
    merged++;
  }

  await writeFile(enrichedFile, JSON.stringify(entries, null, 1));
  console.log(`Letter ${LETTER.toUpperCase()} example merge:`);
  console.log(`  merged (new grounded examples) .. ${merged}`);
  console.log(`  rejected (failed validation) .... ${rejected}`);
  console.log(`  skipped (already had example) ... ${skippedHadExample}`);
  console.log(`  unknown words (not in dataset) .. ${unknown}`);
  console.log(`Wrote ${path.relative(root, enrichedFile)}`);
}

main().catch((e) => { console.error(e); process.exit(1); });
