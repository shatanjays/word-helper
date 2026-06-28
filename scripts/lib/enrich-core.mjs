// ─────────────────────────────────────────────────────────────────────────────
// Enrichment core — fetch + normalise a single word from OPEN, LICENSED sources.
//
// Sources (no auth, openly licensed):
//   • Datamuse  (https://api.datamuse.com)  — PRIMARY. One call with md=dpsrf
//     yields definitions (Wiktionary/WordNet, CC-BY-SA), part of speech,
//     CMUdict syllable count + ARPABET pronunciation, and corpus frequency.
//     Extra calls fetch synonyms / antonyms / related / rhymes.
//   • Free Dictionary API (dictionaryapi.dev) — BEST EFFORT. Real example
//     sentences + IPA phonetics for common words (Wiktionary, CC-BY-SA).
//
// This module NEVER invents definitions, pronunciations, or examples. Example
// generation (the hybrid LLM step) is a SEPARATE pass; here, examples are only
// populated from a real source. Every populated field carries provenance in
// `sources` so the audit can prove where the data came from.
// ─────────────────────────────────────────────────────────────────────────────

import { readFile, writeFile, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const ROOT = path.join(__dirname, "..", "..");
const CACHE_DIR = path.join(ROOT, "data", "cache");

export const LICENSES = {
  datamuse: "Datamuse API — definitions CC-BY-SA 3.0 (Wiktionary), frequency/pronunciation from open corpora (CMUdict, public domain).",
  freedict: "Free Dictionary API (dictionaryapi.dev) — Wiktionary, CC-BY-SA 3.0.",
  "editorial-generated": "Example sentence written by the Word Helper editorial process, grounded in the sourced definition and part of speech.",
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// Sentinel returned by fetchJson when the request FAILED transiently (network
// error, timeout, HTTP 403 WAF block, 429 after retries, 5xx). Distinct from a
// legitimate `null` (HTTP 404 / empty result). Callers MUST NOT cache this — a
// failed fetch should be retried on the next run, never persisted as a negative.
export const FETCH_FAILED = Symbol("fetch-failed");

// ── tiny on-disk cache so re-runs are free and deterministic ──────────────────
async function cacheRead(kind, key) {
  const p = path.join(CACHE_DIR, kind, `${key}.json`);
  if (!existsSync(p)) return undefined;
  try {
    return JSON.parse(await readFile(p, "utf8"));
  } catch {
    return undefined;
  }
}
async function cacheWrite(kind, key, value) {
  const dir = path.join(CACHE_DIR, kind);
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, `${key}.json`), JSON.stringify(value));
}
function safeKey(word) {
  return String(word).toLowerCase().replace(/[^a-z0-9]/g, "_").slice(0, 60) || "_";
}

async function fetchJson(url, { timeout = 9000, retries = 2 } = {}) {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(timeout) });
      // Transient: rate limit (429), CloudFront/WAF abuse block (403), or server
      // error (5xx). Back off and retry; if retries are exhausted, signal FAILURE
      // (NOT a cacheable null) so the word is retried on a later run.
      if (res.status === 429 || res.status === 403 || res.status >= 500) {
        if (attempt === retries) return FETCH_FAILED;
        await sleep(1000 * (attempt + 1));
        continue;
      }
      // 404 / other not-ok with a definite verdict → legitimate "no data" (null,
      // which callers may cache as a negative result).
      if (!res.ok) return null;
      return await res.json();
    } catch {
      // Network error / timeout — transient, do not poison the cache.
      if (attempt === retries) return FETCH_FAILED;
      await sleep(400 * (attempt + 1));
    }
  }
  return FETCH_FAILED;
}

// ── ARPABET → human-readable respelling + IPA ────────────────────────────────
// Respelling matches the curated dictionary house style (e.g. "BYOO-tih-ful").
const ARPA_RESPELL = {
  AA: "ah", AE: "a", AH: "uh", AO: "aw", AW: "ow", AY: "y",
  EH: "eh", ER: "ur", EY: "ay", IH: "ih", IY: "ee", OW: "oh",
  OY: "oy", UH: "uu", UW: "oo",
  B: "b", CH: "ch", D: "d", DH: "th", F: "f", G: "g", HH: "h",
  JH: "j", K: "k", L: "l", M: "m", N: "n", NG: "ng", P: "p",
  R: "r", S: "s", SH: "sh", T: "t", TH: "th", V: "v", W: "w",
  Y: "y", Z: "z", ZH: "zh",
};
const ARPA_IPA = {
  AA: "ɑ", AE: "æ", AH: "ʌ", AO: "ɔ", AW: "aʊ", AY: "aɪ",
  EH: "ɛ", ER: "ɝ", EY: "eɪ", IH: "ɪ", IY: "i", OW: "oʊ",
  OY: "ɔɪ", UH: "ʊ", UW: "u",
  B: "b", CH: "tʃ", D: "d", DH: "ð", F: "f", G: "ɡ", HH: "h",
  JH: "dʒ", K: "k", L: "l", M: "m", N: "n", NG: "ŋ", P: "p",
  R: "ɹ", S: "s", SH: "ʃ", T: "t", TH: "θ", V: "v", W: "w",
  Y: "j", Z: "z", ZH: "ʒ",
};
const VOWELS = new Set(["AA", "AE", "AH", "AO", "AW", "AY", "EH", "ER", "EY", "IH", "IY", "OW", "OY", "UH", "UW"]);

function parseArpa(arpa) {
  // "HH AE1 P IY0" -> [{p:"HH",stress:0},{p:"AE",stress:1},...]
  return String(arpa)
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((tok) => {
      const m = tok.match(/^([A-Z]+)(\d?)$/);
      if (!m) return null;
      return { p: m[1], stress: m[2] ? Number(m[2]) : -1 };
    })
    .filter(Boolean);
}

// Group phonemes into syllables (one vowel nucleus each). For a consonant
// cluster between two vowels, the LAST consonant onsets the next syllable and
// the rest close the previous one (so "abandon" → uh-BAN-duhn, not uh-BA-nduhn).
function syllabify(phonemes) {
  const sylls = [];
  let pending = [];
  for (const ph of phonemes) {
    if (VOWELS.has(ph.p)) {
      let onset = pending;
      if (sylls.length && pending.length >= 2) {
        // keep the last consonant as the onset; push the rest as coda of prev syllable
        onset = pending.slice(-1);
        sylls[sylls.length - 1].phonemes.push(...pending.slice(0, -1));
      }
      sylls.push({ phonemes: [...onset, ph], stress: ph.stress });
      pending = [];
    } else {
      pending.push(ph);
    }
  }
  if (pending.length) {
    if (sylls.length) sylls[sylls.length - 1].phonemes.push(...pending);
    else sylls.push({ phonemes: pending, stress: -1 });
  }
  return sylls;
}

export function arpaToRespelling(arpa) {
  const phonemes = parseArpa(arpa);
  if (!phonemes.length) return "";
  const sylls = syllabify(phonemes);
  if (!sylls.length) return "";
  let primaryIdx = sylls.findIndex((s) => s.stress === 1);
  if (primaryIdx === -1) primaryIdx = sylls.findIndex((s) => s.stress === 2);
  if (primaryIdx === -1) primaryIdx = 0;
  const parts = sylls.map((s, i) => {
    const chunk = s.phonemes.map((ph) => ARPA_RESPELL[ph.p] ?? "").join("");
    return i === primaryIdx ? chunk.toUpperCase() : chunk;
  });
  return parts.filter(Boolean).join("-");
}

export function arpaToIpa(arpa) {
  const phonemes = parseArpa(arpa);
  if (!phonemes.length) return "";
  const sylls = syllabify(phonemes);
  let primaryIdx = sylls.findIndex((s) => s.stress === 1);
  const out = [];
  sylls.forEach((s, i) => {
    if (i === primaryIdx && i > 0) out.push("ˈ");
    out.push(s.phonemes.map((ph) => ARPA_IPA[ph.p] ?? "").join(""));
  });
  return `/${out.join("")}/`;
}

// Syllable break ("beau·ti·ful") derived from the respelling syllables.
export function syllableBreakFromRespell(word, respell) {
  if (!respell || !respell.includes("-")) return word;
  return respell.toLowerCase().split("-").join("·");
}

// ── Datamuse ──────────────────────────────────────────────────────────────────
const POS_MAP = { n: "noun", v: "verb", adj: "adjective", adv: "adverb", u: "" };

async function datamuseMain(word) {
  let cached = await cacheRead("datamuse", safeKey(word));
  if (cached === undefined) {
    const data = await fetchJson(
      `https://api.datamuse.com/words?sp=${encodeURIComponent(word)}&md=dpsrf&max=1`,
    );
    if (data === FETCH_FAILED) return null; // transient failure — do NOT cache, retry next run
    cached = Array.isArray(data) && data[0] ? data[0] : null;
    await cacheWrite("datamuse", safeKey(word), cached);
  }
  return cached;
}

async function datamuseRel(rel, word, max = 8) {
  const kind = `datamuse_${rel}`;
  let cached = await cacheRead(kind, safeKey(word));
  if (cached === undefined) {
    const data = await fetchJson(
      `https://api.datamuse.com/words?${rel}=${encodeURIComponent(word)}&max=${max}`,
    );
    if (data === FETCH_FAILED) return []; // transient failure — do NOT cache an empty list
    cached = Array.isArray(data) ? data.map((d) => d.word).filter((w) => /^[a-z][a-z '-]*$/i.test(w)) : [];
    await cacheWrite(kind, safeKey(word), cached);
  }
  return cached;
}

// ── Free Dictionary API (best effort: real examples + IPA) ───────────────────
async function freeDict(word) {
  let cached = await cacheRead("freedict", safeKey(word));
  if (cached === undefined) {
    const data = await fetchJson(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`, { retries: 1 });
    if (data === FETCH_FAILED) return null; // transient failure — do NOT cache (404 not-found still caches as null)
    cached = Array.isArray(data) && data[0] ? data[0] : null;
    await cacheWrite("freedict", safeKey(word), cached);
  }
  return cached;
}

// Accept only clean, self-contained example sentences. Wiktionary dumps often
// include citations (years, author names, URLs) — those read as junk on a
// dictionary page, so we reject them.
export function isCleanExample(s, word) {
  const t = String(s || "").trim();
  if (t.length < 12 || t.length > 180) return false;
  if (/https?:|www\.|\.com|\.org/i.test(t)) return false;       // URLs
  if (/\b(1[5-9]|20)\d{2}\b/.test(t)) return false;             // year citations
  if (/[—–]/.test(t)) return false;                             // em/en dash → author attribution ("— Leigh Hunt")
  if (/[\[\]{}]/.test(t)) return false;                          // editorial brackets ("[W]ith", "[poets]")
  if (/[“”"].*[“”"]/.test(t)) return false;                     // nested quotes (citation form)
  if ((t.match(/,/g) || []).length > 6) return false;           // over-punctuated fragments
  if (!/[.!?][)”"']?$/.test(t)) return false;                   // must end as a full sentence
  if (!/^[A-Z“"']/.test(t)) return false;                       // must start like a sentence
  // should reference the word or an inflection of it
  const stem = word.toLowerCase().slice(0, Math.max(4, word.length - 3));
  if (!t.toLowerCase().includes(stem)) return false;
  return true;
}

function cleanDef(text) {
  return String(text || "")
    .replace(/^\s*\([^)]*\)\s*/, "") // strip a single leading "(transitive)" style tag
    .replace(/\s+/g, " ")
    .trim();
}

// First sentence of a definition, capped — used as the short/quick meaning so it
// is always a coherent subset of the full definition.
function firstSentence(text) {
  const t = String(text || "").trim();
  if (!t) return "";
  const m = t.match(/^.*?[.!?](\s|$)/);
  let s = (m ? m[0] : t).trim();
  if (s.length > 150) s = s.slice(0, 147).trim() + "…";
  return s;
}

const singleWord = (arr, exclude) =>
  (arr || [])
    .filter((r) => /^[a-z][a-z'-]*$/.test(String(r).toLowerCase()) && r.toLowerCase() !== exclude);

function titleCase(word) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

// Build a polished SEO description grounded in the real short definition.
function buildMeta(word, shortDef, hasSyn, hasAnt) {
  const label = titleCase(word);
  const metaTitle = `${label} — Definition, Pronunciation, Syllables & Examples | Word Helper`;
  const extras = ["definition", "pronunciation", "syllables"];
  if (hasSyn) extras.push("synonyms");
  if (hasAnt) extras.push("antonyms");
  extras.push("example sentences");
  const list = extras.slice(0, -1).join(", ") + ", and " + extras[extras.length - 1];
  const def = shortDef ? `${shortDef} ` : "";
  let metaDescription = `What does ${word} mean? ${def}Learn the ${list} for the word "${word}" at Word Helper.`;
  if (metaDescription.length > 320) metaDescription = metaDescription.slice(0, 317) + "…";
  return { metaTitle, metaDescription };
}

// ── Public: enrich one word into a normalised entry (examples filled separately)
// Returns { entry, ok, reason } — ok=false when a REQUIRED real-source field
// (definition / part of speech / pronunciation / syllables) could not be found.
export async function enrichWord(word, { existing = null, useFreeDict = true, fetchRelated = true } = {}) {
  const lower = String(word).toLowerCase().trim();
  const main = await datamuseMain(lower);
  if (!main) return { ok: false, reason: "no-datamuse", entry: null };
  // CRITICAL: Datamuse `sp=` is "spelled-like" and returns the CLOSEST match when
  // the exact word is not in its corpus (e.g. "afunction" → "function"). Reject
  // any non-exact match so junk/misspelled words.txt tokens never inherit another
  // word's definition, pronunciation, or frequency.
  if (String(main.word || "").toLowerCase() !== lower) {
    return { ok: false, reason: "fuzzy-mismatch", entry: null };
  }

  const tags = Array.isArray(main.tags) ? main.tags : [];
  const posTags = tags.filter((t) => ["n", "v", "adj", "adv"].includes(t));
  const arpaTag = tags.find((t) => t.startsWith("pron:"));
  const freqTag = tags.find((t) => t.startsWith("f:"));
  const arpa = arpaTag ? arpaTag.slice(5).trim() : "";
  const frequency = freqTag ? Number(freqTag.slice(2)) : null;

  // Definitions (Wiktionary via Datamuse): "adj\tHaving a feeling…"
  const defsRaw = Array.isArray(main.defs) ? main.defs : [];
  const parsedDefs = defsRaw.map((d) => {
    const tab = d.indexOf("\t");
    const pos = tab > 0 ? d.slice(0, tab).trim() : "";
    const text = cleanDef(tab > 0 ? d.slice(tab + 1) : d);
    return { pos, text };
  }).filter((d) => d.text.length > 0);

  // Best primary definition: first reasonably long one.
  const primary = parsedDefs.find((d) => d.text.length >= 30) || parsedDefs[0];
  let definition = "";
  let shortDef = "";
  let posList = [];
  if (primary) {
    // Compose a fuller definition from up to two senses for a richer page.
    const second = parsedDefs.find((d) => d !== primary && d.text.length >= 30 && d.pos === primary.pos);
    definition = second ? `${primary.text} ${second.text}` : primary.text;
    if (definition.length > 600) definition = definition.slice(0, 597) + "…";
    shortDef = primary.text.length > 150 ? primary.text.slice(0, 147) + "…" : primary.text;
    // Part of speech: primary first, then any other attested POS (max 2).
    const order = [primary.pos, ...parsedDefs.map((d) => d.pos)];
    const seen = new Set();
    for (const p of order) {
      const full = POS_MAP[p];
      if (full && !seen.has(full)) { seen.add(full); posList.push(full); }
      if (posList.length >= 2) break;
    }
  }
  if (!posList.length) {
    for (const p of posTags) {
      const full = POS_MAP[p];
      if (full && !posList.includes(full)) posList.push(full);
      if (posList.length >= 2) break;
    }
  }
  const partOfSpeech = posList.join(", ");

  // Pronunciation: respelling from ARPABET (house style); IPA as phonetic.
  let pronunciation = arpa ? arpaToRespelling(arpa) : "";
  let phonetic = arpa ? arpaToIpa(arpa) : "";
  const syllables = Number(main.numSyllables) > 0 ? Number(main.numSyllables) : 0;
  let syllableBreak = pronunciation ? syllableBreakFromRespell(lower, pronunciation) : "";

  // Synonyms / antonyms / related / rhymes (parallel, cached). Skipped in the
  // cheap first pass (fetchRelated:false) so the orchestrator can rank by
  // frequency before spending these calls on the words it will actually publish.
  let synonyms = [], antonyms = [], related = [], rhymes = [];
  if (fetchRelated) {
    [synonyms, antonyms, related, rhymes] = await Promise.all([
      datamuseRel("rel_syn", lower, 8),
      datamuseRel("rel_ant", lower, 6),
      datamuseRel("ml", lower, 6),
      datamuseRel("rel_rhy", lower, 6),
    ]);
  }

  const sources = {};
  if (definition) sources.definition = "datamuse";
  if (pronunciation || phonetic) sources.pronunciation = "datamuse";
  if (syllables) sources.syllables = "datamuse";
  if (frequency != null) sources.frequency = "datamuse";

  // Best-effort Free Dictionary pass for a REAL example + cleaner IPA.
  let examples = [];
  if (useFreeDict) {
    const fd = await freeDict(lower);
    if (fd) {
      // IPA phonetic (prefer a non-empty text).
      const fdPhon = (fd.phonetics || []).map((p) => p && p.text).find((t) => t && t.length > 1);
      if (fdPhon) { phonetic = fdPhon; sources.phonetic = "freedict"; }
      // Real example sentence(s) — cleaned of citations/URLs.
      for (const m of fd.meanings || []) {
        for (const d of m.definitions || []) {
          if (d.example && isCleanExample(d.example, lower)) {
            const ex = d.example.trim();
            if (!examples.includes(ex)) examples.push(ex);
            if (examples.length >= 2) break;
          }
        }
        if (examples.length >= 2) break;
      }
      if (examples.length) sources.example = "freedict";
    }
  }

  // Merge with an existing curated/enriched entry (don't overwrite richer data).
  const ex = existing || {};
  const finalSyn = (ex.synonyms && ex.synonyms.length ? ex.synonyms : synonyms)
    .filter((s) => s.toLowerCase() !== lower).slice(0, 8);
  const finalAnt = (ex.antonyms && ex.antonyms.length ? ex.antonyms : antonyms)
    .filter((s) => s.toLowerCase() !== lower).slice(0, 6);
  const finalDef = (ex.definition && ex.definition.length >= definition.length) ? ex.definition : definition;
  // shortDef ALWAYS derived from the chosen definition so the two never disagree.
  const finalShort = firstSentence(finalDef);
  // Prefer freshly-fetched clean examples; only fall back to existing/legacy
  // examples when fresh found none — and always re-run them through the cleaner
  // (legacy data was written before the citation/bracket filters existed).
  if (examples.length === 0 && ex.examples && ex.examples.length) {
    const cleanExisting = ex.examples.filter((s) => isCleanExample(s, lower)).slice(0, 3);
    if (cleanExisting.length) {
      examples = cleanExisting;
      sources.example = ex.sources?.example || "existing"; // preserve provenance (incl. editorial-generated)
    }
  }
  if (ex.pronunciation && !pronunciation) { pronunciation = ex.pronunciation; sources.pronunciation = ex.sources?.pronunciation || "existing"; }

  const hasSyn = finalSyn.length > 0;
  const hasAnt = finalAnt.length > 0;
  // Meta is templated + grounded in the CURRENT definition — always rebuilt for consistency.
  const { metaTitle, metaDescription } = buildMeta(lower, finalShort || (finalDef || "").slice(0, 140), hasSyn, hasAnt);

  const entry = {
    word: lower,
    href: `/word/${encodeURIComponent(lower)}/`,
    partOfSpeech,
    syllables,
    syllableBreak: syllableBreak || lower,
    pronunciation,
    phonetic,
    shortDef: finalShort,
    definition: finalDef,
    examples,
    synonyms: finalSyn,
    antonyms: finalAnt,
    related: singleWord(related, lower).slice(0, 6),
    rhymes: singleWord(rhymes, lower).slice(0, 6),
    frequency,
    metaTitle,
    metaDescription,
    sources,
    license: sources.example === "freedict" || sources.definition === "datamuse"
      ? "CC-BY-SA-3.0"
      : "CC-BY-SA-3.0",
    lastReviewed: null, // stamped by the orchestrator (no Date.now() in build)
  };

  // Required real-source fields (examples may still be empty → filled by the
  // generation pass; that's expected and not a failure here).
  const missing = [];
  if (!entry.definition || entry.definition.length < 30) missing.push("definition");
  if (!entry.partOfSpeech) missing.push("partOfSpeech");
  if (!entry.pronunciation && !entry.phonetic) missing.push("pronunciation");
  if (!entry.syllables) missing.push("syllables");

  return { ok: missing.length === 0, reason: missing.join("+") || "ok", entry, needsExample: entry.examples.length === 0 };
}

// Simple promise-pool for polite concurrency.
export async function mapPool(items, concurrency, worker, onProgress) {
  const results = new Array(items.length);
  let i = 0;
  let done = 0;
  async function run() {
    while (i < items.length) {
      const idx = i++;
      results[idx] = await worker(items[idx], idx);
      done++;
      if (onProgress && done % 25 === 0) onProgress(done, items.length);
    }
  }
  await Promise.all(Array.from({ length: Math.min(concurrency, items.length) }, run));
  if (onProgress) onProgress(done, items.length);
  return results;
}
