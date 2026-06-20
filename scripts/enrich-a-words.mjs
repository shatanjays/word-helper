/**
 * Enrich 'a' words using Free Dictionary API (dictionaryapi.dev — no auth needed).
 * Saves results to src/data/a-words-enriched.json
 *
 * Run: /Applications/Codex.app/Contents/Resources/node scripts/enrich-a-words.mjs
 */

import { readFile, writeFile, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

const OUT_FILE = path.join(root, "src/data/a-words-enriched.json");
const PROGRESS_FILE = path.join(root, "src/data/a-words-progress.json");
const BATCH_SIZE = 5;
const BATCH_DELAY_MS = 400;

// ── Syllable utilities ────────────────────────────────────────────
function estimateSyllables(word) {
  const w = word.toLowerCase().replace(/(?:es?|ed)$/, "").replace(/e$/, "");
  const groups = w.match(/[aeiouy]+/g);
  return Math.max(1, groups ? groups.length : 1);
}

function estimateSyllableBreak(word) {
  const count = estimateSyllables(word);
  if (count === 1) return word;
  const len = word.length;
  const chunkSize = Math.ceil(len / count);
  const parts = [];
  for (let i = 0; i < len; i += chunkSize) {
    parts.push(word.slice(i, i + chunkSize));
  }
  return parts.join("·");
}

function toTitleCase(word) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

// ── Fetch one word from Free Dictionary API ───────────────────────
async function fetchWord(word) {
  try {
    const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`, {
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (!Array.isArray(data) || !data[0]) return null;

    const entry = data[0];
    const meanings = entry.meanings || [];
    if (!meanings.length) return null;

    // Pick primary meaning
    const primary = meanings[0];
    const defObjs = primary.definitions || [];
    if (!defObjs.length) return null;

    const definition = defObjs[0].definition || "";
    if (!definition) return null;

    const shortDef = definition.length > 120 ? definition.slice(0, 117) + "…" : definition;

    const examples = defObjs
      .filter((d) => d.example)
      .slice(0, 2)
      .map((d) => d.example);

    const synonyms = [
      ...new Set([
        ...(defObjs[0].synonyms || []),
        ...(primary.synonyms || []),
      ]),
    ].slice(0, 5);

    const antonyms = [
      ...new Set([
        ...(defObjs[0].antonyms || []),
        ...(primary.antonyms || []),
      ]),
    ].slice(0, 3);

    // Phonetic
    let pronunciation = "";
    if (entry.phonetic) pronunciation = entry.phonetic;
    else if (entry.phonetics) {
      const ph = entry.phonetics.find((p) => p.text);
      if (ph) pronunciation = ph.text;
    }

    const syllables = estimateSyllables(word);
    const syllableBreak = estimateSyllableBreak(word);

    return {
      word,
      href: `/word/${word}/`,
      partOfSpeech: primary.partOfSpeech || "word",
      syllables,
      syllableBreak,
      pronunciation,
      shortDef,
      definition,
      examples,
      synonyms,
      antonyms,
      metaTitle: `${toTitleCase(word)} — Definition, Synonyms & Examples | Word Helper`,
      metaDescription: `What does ${word} mean? ${shortDef} Learn the definition, synonyms, and usage examples of "${word}" at Word Helper.`,
    };
  } catch (_) {
    return null;
  }
}

async function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

// ── Main ──────────────────────────────────────────────────────────
async function main() {
  // Read word list
  const wordsTxt = await readFile(path.join(root, "src/data/words.txt"), "utf8");
  const allWords = wordsTxt.trim().split("\n").map((w) => w.trim().toLowerCase());

  // Filter: starts with 'a', length 4–13, alphabetic only, skip obscure patterns
  const candidates = allWords.filter(
    (w) =>
      w.startsWith("a") &&
      w.length >= 4 &&
      w.length <= 13 &&
      /^[a-z]+$/.test(w) &&
      !w.startsWith("aa") && // skip 'aa*' obscure words
      !w.endsWith("aaed") &&
      !w.endsWith("aaing")
  );

  // Load already-curated words from words.mjs to avoid duplicates
  // (we'll just dedupe by word name at build time)

  // Load progress if exists
  let done = {};
  if (existsSync(PROGRESS_FILE)) {
    try {
      done = JSON.parse(await readFile(PROGRESS_FILE, "utf8"));
      console.log(`Resuming — ${Object.keys(done).length} words already fetched`);
    } catch (_) {}
  }

  const toFetch = candidates.filter((w) => !(w in done)).slice(0, 5000);
  console.log(`Words to fetch: ${toFetch.length} (target: ${candidates.length} candidates)`);

  let fetched = 0;
  let succeeded = 0;

  for (let i = 0; i < toFetch.length; i += BATCH_SIZE) {
    const batch = toFetch.slice(i, i + BATCH_SIZE);
    const results = await Promise.all(batch.map(fetchWord));

    results.forEach((result, idx) => {
      const word = batch[idx];
      done[word] = result; // null means not found
      if (result) succeeded++;
    });

    fetched += batch.length;

    if (fetched % 50 === 0) {
      await writeFile(PROGRESS_FILE, JSON.stringify(done));
      const pct = ((fetched / toFetch.length) * 100).toFixed(1);
      console.log(`[${pct}%] Fetched ${fetched}/${toFetch.length} — found: ${succeeded}`);
    }

    await sleep(BATCH_DELAY_MS);
  }

  // Final save
  await writeFile(PROGRESS_FILE, JSON.stringify(done));

  // Write enriched words (only successful ones)
  const enriched = Object.values(done).filter(Boolean);
  await writeFile(OUT_FILE, JSON.stringify(enriched, null, 2));
  console.log(`\nDone! ${enriched.length} words with definitions saved to src/data/a-words-enriched.json`);
}

main().catch((e) => { console.error(e); process.exitCode = 1; });
