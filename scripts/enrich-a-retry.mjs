/**
 * Retry null results + fetch remaining 'a' word candidates.
 * Uses slower rate (1 request/sec) to avoid rate limiting.
 * Merges into src/data/a-words-enriched.json
 *
 * Run: /Applications/Codex.app/Contents/Resources/node scripts/enrich-a-retry.mjs
 */

import { readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

const PROGRESS_FILE = path.join(root, "src/data/a-words-progress.json");
const OUT_FILE = path.join(root, "src/data/a-words-enriched.json");
const DELAY_MS = 800;

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

function toTitle(word) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

async function fetchWord(word) {
  try {
    const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`, {
      signal: AbortSignal.timeout(10000),
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (!Array.isArray(data) || !data[0]) return null;
    const entry = data[0];
    const meanings = entry.meanings || [];
    if (!meanings.length) return null;
    const primary = meanings[0];
    const defObjs = primary.definitions || [];
    if (!defObjs.length) return null;
    const definition = defObjs[0].definition || "";
    if (!definition) return null;
    const shortDef = definition.length > 120 ? definition.slice(0, 117) + "…" : definition;
    const examples = defObjs.filter((d) => d.example).slice(0, 2).map((d) => d.example);
    const synonyms = [...new Set([...(defObjs[0].synonyms || []), ...(primary.synonyms || [])])].slice(0, 5);
    const antonyms = [...new Set([...(defObjs[0].antonyms || []), ...(primary.antonyms || [])])].slice(0, 3);
    let pronunciation = "";
    if (entry.phonetic) pronunciation = entry.phonetic;
    else if (entry.phonetics) {
      const ph = entry.phonetics.find((p) => p.text);
      if (ph) pronunciation = ph.text;
    }
    return {
      word,
      href: `/word/${word}/`,
      partOfSpeech: primary.partOfSpeech || "word",
      syllables: estimateSyllables(word),
      syllableBreak: estimateSyllableBreak(word),
      pronunciation,
      shortDef,
      definition,
      examples,
      synonyms,
      antonyms,
      metaTitle: `${toTitle(word)} — Definition, Synonyms & Examples | Word Helper`,
      metaDescription: `What does ${word} mean? ${shortDef} Learn the definition, synonyms, and usage examples of "${word}" at Word Helper.`,
    };
  } catch (_) {
    return null;
  }
}

async function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function main() {
  // Load current progress and enriched
  let done = {};
  if (existsSync(PROGRESS_FILE)) {
    done = JSON.parse(await readFile(PROGRESS_FILE, "utf8"));
  }
  let enriched = [];
  if (existsSync(OUT_FILE)) {
    enriched = JSON.parse(await readFile(OUT_FILE, "utf8"));
  }
  const enrichedSet = new Set(enriched.map((w) => w.word));

  // Get ALL 'a' candidates from ENABLE list
  const wordsTxt = await readFile(path.join(root, "src/data/words.txt"), "utf8");
  const allWords = wordsTxt.trim().split("\n").map((w) => w.trim().toLowerCase());
  const candidates = allWords.filter(
    (w) => w.startsWith("a") && w.length >= 4 && w.length <= 13 && /^[a-z]+$/.test(w) && !w.startsWith("aa")
  );

  // Targets:
  // 1. Previously null results (common words that got rate-limited)
  const nullWords = Object.entries(done)
    .filter(([, v]) => v === null)
    .map(([k]) => k)
    .filter((w) => !enrichedSet.has(w));

  // 2. Candidates not yet fetched
  const unfetched = candidates.filter((w) => !(w in done) && !enrichedSet.has(w));

  const toFetch = [...nullWords, ...unfetched];
  console.log(`Retrying ${nullWords.length} null results + fetching ${unfetched.length} new = ${toFetch.length} total`);
  console.log(`Already have ${enriched.length} words`);

  let found = 0;
  for (let i = 0; i < toFetch.length; i++) {
    const word = toFetch[i];
    const result = await fetchWord(word);
    done[word] = result;
    if (result && !enrichedSet.has(word)) {
      enriched.push(result);
      enrichedSet.add(word);
      found++;
    }

    if ((i + 1) % 100 === 0) {
      await writeFile(PROGRESS_FILE, JSON.stringify(done));
      await writeFile(OUT_FILE, JSON.stringify(enriched, null, 2));
      const pct = (((i + 1) / toFetch.length) * 100).toFixed(1);
      console.log(`[${pct}%] ${i + 1}/${toFetch.length} — new found: ${found} — total: ${enriched.length}`);
    }

    await sleep(DELAY_MS);
  }

  await writeFile(PROGRESS_FILE, JSON.stringify(done));
  await writeFile(OUT_FILE, JSON.stringify(enriched, null, 2));
  console.log(`\nDone! Total enriched words: ${enriched.length}`);
}

main().catch((e) => { console.error(e); process.exitCode = 1; });
