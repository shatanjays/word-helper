// ─────────────────────────────────────────────────────────────────────────────
// Letter enrichment orchestrator.
//
//   node scripts/enrich-letter.mjs --letter a [--limit 9000] [--enrich 7000]
//                                  [--concurrency 10] [--no-freedict]
//
// Strategy (API-budget aware — Datamuse is the primary source):
//   Pass A  cheap Datamuse-only call per candidate (def + POS + pronunciation +
//           syllables + frequency). Keep entries that have all REQUIRED real
//           fields (everything except the example sentence).
//   Rank    by frequency desc, then completeness — most useful words first.
//   Pass B  for the top --enrich words, fetch synonyms/antonyms/related/rhymes
//           and a REAL example (Free Dictionary). Words with no real example are
//           written to a "needs-example" queue for the grounded generation pass.
//
// Outputs:
//   src/data/enriched/{letter}-words.json     complete-ready entries (the build reads these)
//   src/data/word-frequency.json              merged word→frequency map (build attaches to curated)
//   data/processed/{letter}-needs-example.json queue for generate-examples.mjs
//   data/reports/enrich-{letter}-run.json     run statistics
//
// Re-runnable & resumable: every API response is cached on disk, so re-running
// is fast and deterministic.
// ─────────────────────────────────────────────────────────────────────────────

import { readFile, writeFile, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { enrichWord, mapPool, ROOT } from "./lib/enrich-core.mjs";
import { words } from "../src/words.mjs";
import { isCompleteWordEntry } from "../src/word-quality.mjs";
import { wordRecommendationScore } from "../src/word-recommendation.mjs";

function arg(name, def) {
  const i = process.argv.indexOf(`--${name}`);
  if (i === -1) return def;
  const v = process.argv[i + 1];
  return v && !v.startsWith("--") ? v : true;
}

const LETTER = String(arg("letter", "a")).toLowerCase();
const LIMIT = Number(arg("limit", 9000));        // max candidates for the cheap pass
const ENRICH = Number(arg("enrich", 7000));      // max words to fully enrich (pass B)
const CONCURRENCY = Number(arg("concurrency", 10));
const USE_FREEDICT = arg("no-freedict", false) !== true;
// Free Dictionary is rate-limited; only the most common words are worth the wait
// for a REAL example (the rest get grounded generated examples). Top-N by rank.
const FREEDICT_TOP = Number(arg("freedict-top", 3500));
const TODAY = new Date().toISOString().slice(0, 10);

const ENRICHED_DIR = path.join(ROOT, "src/data/enriched");
const FREQ_FILE = path.join(ROOT, "src/data/word-frequency.json");
const LEGACY_A = path.join(ROOT, "src/data/a-words-enriched.json");

async function loadJson(p, def) {
  if (!existsSync(p)) return def;
  try { return JSON.parse(await readFile(p, "utf8")); } catch { return def; }
}

// Offline corpus-frequency rank (Norvig count_1w.txt: "word\tcount"). Used to
// PRE-RANK candidates so the cheap pass fetches the most common words first
// (fixes the alphabetical-coverage gap and avoids spending API calls on obscure
// tokens that would never be recommended).
async function loadFreqRank() {
  const p = path.join(ROOT, "data/freq/count_1w.txt");
  const rank = new Map();
  if (!existsSync(p)) return rank;
  const lines = (await readFile(p, "utf8")).split(/\r?\n/);
  for (const line of lines) {
    const tab = line.indexOf("\t");
    if (tab <= 0) continue;
    const w = line.slice(0, tab);
    const c = Number(line.slice(tab + 1));
    if (w && Number.isFinite(c)) rank.set(w, c);
  }
  return rank;
}

async function loadCandidates() {
  // 1. existing enriched data for this letter (vetted candidates we want to keep)
  const existingArr = [];
  const newFile = path.join(ENRICHED_DIR, `${LETTER}-words.json`);
  if (existsSync(newFile)) existingArr.push(...(await loadJson(newFile, [])));
  if (LETTER === "a") existingArr.push(...(await loadJson(LEGACY_A, [])));
  const existingByWord = new Map();
  for (const e of existingArr) {
    const w = String(e.word || "").toLowerCase();
    if (w && w[0] === LETTER && !existingByWord.has(w)) existingByWord.set(w, e);
  }

  // 2. curated words for this letter (so we capture their frequency too)
  const curatedWords = new Set(
    words.map((w) => String(w.word).toLowerCase()).filter((w) => w[0] === LETTER),
  );

  // 3. the full raw inventory for this letter
  const lines = (await readFile(path.join(ROOT, "src/data/words.txt"), "utf8"))
    .split(/\r?\n/).map((w) => w.trim().toLowerCase())
    .filter((w) => /^[a-z]{2,}$/.test(w) && w[0] === LETTER);
  const rawSet = new Set(lines);

  // Collect every unique candidate (existing + curated + raw inventory).
  const all = new Set([...existingByWord.keys(), ...curatedWords, ...rawSet]);

  // Pre-rank by offline corpus frequency (desc). Existing/curated entries get a
  // small floor so they are never buried. Words absent from the frequency list
  // sort last, by length then alpha (shorter, common-shaped words first).
  const freqRank = await loadFreqRank();
  const score = (w) => {
    let f = freqRank.get(w) || 0;
    if ((existingByWord.has(w) || curatedWords.has(w)) && f === 0) f = 1; // keep, but below real-freq words
    return f;
  };
  const ordered = [...all].sort((a, b) => {
    const fa = score(a), fb = score(b);
    if (fb !== fa) return fb - fa;
    if (a.length !== b.length) return a.length - b.length;
    return a.localeCompare(b);
  });

  return { ordered, existingByWord, curatedWords, rawTotal: rawSet.size, rankedByFreq: freqRank.size > 0 };
}

async function main() {
  console.log(`\n=== Enrich letter "${LETTER.toUpperCase()}" ===`);
  console.log(`limit=${LIMIT} enrich=${ENRICH} concurrency=${CONCURRENCY} freedict=${USE_FREEDICT}`);
  await mkdir(ENRICHED_DIR, { recursive: true });

  const { ordered, existingByWord, curatedWords, rawTotal } = await loadCandidates();
  const candidates = ordered.slice(0, LIMIT);
  console.log(`Raw "${LETTER}" inventory: ${rawTotal} | existing enriched: ${existingByWord.size} | candidates this run: ${candidates.length}`);

  // ── Pass A: cheap Datamuse-only (def + POS + pron + syllables + frequency) ──
  console.log(`\nPass A — Datamuse base for ${candidates.length} candidates…`);
  const baseResults = await mapPool(
    candidates,
    CONCURRENCY,
    (w) => enrichWord(w, { existing: existingByWord.get(w) || null, useFreeDict: false, fetchRelated: false }),
    (done, total) => process.stdout.write(`\r  ${done}/${total}`),
  );
  process.stdout.write("\n");

  // Keep entries that already have all REQUIRED real fields except example.
  const ready = [];
  for (const r of baseResults) {
    if (r && r.ok && r.entry) ready.push(r.entry);
  }
  // Rank by frequency (desc), then by definition length as a quality tiebreak.
  ready.sort((a, b) => (b.frequency || 0) - (a.frequency || 0) || (b.definition.length - a.definition.length));
  console.log(`Pass A complete-ready (def+POS+pron+syllables): ${ready.length} of ${candidates.length}`);

  // ── Pass B: full enrichment for the top --enrich words ──
  const toEnrich = ready.slice(0, ENRICH);
  console.log(`\nPass B — synonyms/antonyms/related/rhymes + real examples for top ${toEnrich.length}…`);
  const finalEntries = await mapPool(
    toEnrich,
    CONCURRENCY,
    async (entry, idx) => {
      const r = await enrichWord(entry.word, {
        existing: existingByWord.get(entry.word) || null,
        useFreeDict: USE_FREEDICT && idx < FREEDICT_TOP,
        fetchRelated: true,
      });
      if (!r || !r.entry) return null;
      r.entry.lastReviewed = TODAY;
      return r.entry;
    },
    (done, total) => process.stdout.write(`\r  ${done}/${total}`),
  );
  process.stdout.write("\n");

  const entries = finalEntries.filter(Boolean);

  // ── Split: have real example vs. need a generated one ──
  // The GENERATION INPUT is the subset that (a) lacks an example AND (b) would be
  // RECOMMENDED-public once an example is filled — so we only spend LLM effort on
  // words that will actually be published (never obscure/junk entries).
  const placeholderEx = (e) => (e.examples && e.examples.length ? e : { ...e, examples: ["A clear example sentence using " + e.word + "."] });
  const freqOf = new Map(entries.map((e) => [e.word, e.frequency || 0]));
  const needExample = [];
  const genInput = [];
  for (const e of entries) {
    if (e.examples && e.examples.length) continue;
    needExample.push({ word: e.word, partOfSpeech: e.partOfSpeech, definition: e.definition, shortDef: e.shortDef });
    if (wordRecommendationScore(placeholderEx(e)) >= 50) {
      genInput.push({ word: e.word, pos: e.partOfSpeech, def: (e.shortDef || e.definition || "").slice(0, 180) });
    }
  }
  genInput.sort((a, b) => (freqOf.get(b.word) || 0) - (freqOf.get(a.word) || 0));

  // ── Write outputs ──
  const outFile = path.join(ENRICHED_DIR, `${LETTER}-words.json`);
  await writeFile(outFile, JSON.stringify(entries, null, 1));

  // merge frequency map
  const freqMap = await loadJson(FREQ_FILE, {});
  for (const e of entries) if (e.frequency != null) freqMap[e.word] = e.frequency;
  await writeFile(FREQ_FILE, JSON.stringify(freqMap));

  await mkdir(path.join(ROOT, "data/processed"), { recursive: true });
  await writeFile(
    path.join(ROOT, "data/processed", `${LETTER}-needs-example.json`),
    JSON.stringify(needExample, null, 1),
  );
  await writeFile(
    path.join(ROOT, "data/processed", `${LETTER}-gen-input.json`),
    JSON.stringify(genInput),
  );

  // ── Stats ──
  const withRealExample = entries.length - needExample.length;
  const completeNow = entries.filter(isCompleteWordEntry).length; // those already complete (have real example)
  const recommendedReady = entries.filter((e) => {
    const withEx = e.examples.length ? e : { ...e, examples: ["placeholder."] };
    return isCompleteWordEntry(withEx) && wordRecommendationScore(withEx) >= 50;
  }).length;

  const stats = {
    letter: LETTER, generatedAt: new Date().toISOString(),
    rawInventory: rawTotal, candidatesProcessed: candidates.length,
    completeReadyAfterPassA: ready.length, fullyEnriched: entries.length,
    withRealExample, needGeneratedExample: needExample.length,
    genInputRecommendable: genInput.length,
    completeNowWithRealExample: completeNow,
    recommendedReadyOncePublished: recommendedReady,
  };
  await mkdir(path.join(ROOT, "data/reports"), { recursive: true });
  await writeFile(path.join(ROOT, "data/reports", `enrich-${LETTER}-run.json`), JSON.stringify(stats, null, 2));

  console.log(`\n── Letter ${LETTER.toUpperCase()} enrichment summary ──`);
  console.log(`  fully enriched entries ........ ${entries.length}`);
  console.log(`  with REAL example ............. ${withRealExample}`);
  console.log(`  need generated example ........ ${needExample.length}`);
  console.log(`  complete now (real example) ... ${completeNow}`);
  console.log(`  recommended-ready once examples filled ... ${recommendedReady}`);
  console.log(`  gen-input (recommendable, needs example) . ${genInput.length}`);
  console.log(`\nWrote ${outFile}`);
  console.log(`Wrote gen-input: data/processed/${LETTER}-gen-input.json (${genInput.length})`);
}

main().catch((e) => { console.error(e); process.exit(1); });
