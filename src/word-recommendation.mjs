// ─────────────────────────────────────────────────────────────────────────────
// Word RECOMMENDATION scoring — decides which COMPLETE words are worth surfacing
// first (and which sections/filters they belong to). This is layered ON TOP of
// the completeness gate in src/word-quality.mjs:
//
//   • completeness score  (src/word-quality.mjs) → "is this page good enough to
//     publish at all?"  Hard gate, threshold 80.
//   • recommendation score (this file)           → "among publishable words, how
//     useful is it for real users / search / learning / games?"  Threshold 50.
//
// A word is PUBLIC only when BOTH clear their thresholds (isRecommendedPublic).
// Nothing here fabricates data — it only inspects fields the word already has.
// ─────────────────────────────────────────────────────────────────────────────

import {
  wordCompletenessScore,
  isCompleteWordEntry,
  PUBLIC_SCORE_THRESHOLD,
} from "./word-quality.mjs";

export const RECOMMENDATION_THRESHOLD = 50;

const str = (v) => (v == null ? "" : String(v)).trim();
const list = (v) => (Array.isArray(v) ? v.filter((x) => str(x).length > 0) : []);
const clamp = (n, lo, hi) => Math.max(lo, Math.min(hi, n));

// Markers in a definition that signal an obscure / specialist / non-recommended
// entry. We do NOT hide these (they can still be complete), but they should rank
// below everyday vocabulary on browse pages.
const OBSCURITY_MARKERS = [
  "obsolete", "archaic", "rare", "dialect", "dialectal", "nonstandard",
  "alt form", "alternative form", "alternative spelling", "misspelling",
  "initialism", "abbreviation", "acronym", "genus", "obsolete genus",
];
const SPECIALIST_MARKERS = [
  "chemistry", "biochemistry", "anatomy", "botany", "zoology", "mineralogy",
  "pathology", "medicine", "physiology", "taxonomy", "geology", "entomology",
  "pharmacology", "histology", "petrology", "ichthyology",
];

// Per-million corpus frequency (Datamuse `f:` tag). Curated words may lack it;
// fall back to a neutral mid value so they aren't unfairly buried.
function frequencyOf(w) {
  const f = Number(w.frequency);
  if (Number.isFinite(f) && f >= 0) return f;
  return null;
}

function definitionText(w) {
  return str(w.definition || w.shortDef);
}

function lowerDef(w) {
  return definitionText(w).toLowerCase();
}

function hasObscurityMarker(w) {
  const d = lowerDef(w);
  return OBSCURITY_MARKERS.some((m) => d.includes(m));
}

function hasSpecialistMarker(w) {
  const d = lowerDef(w);
  return SPECIALIST_MARKERS.some((m) => d.includes(m));
}

// Looks like a proper noun / non-dictionary token (kept conservative — we only
// flag obvious cases; the completeness gate already removes most junk).
function looksProperOrJunk(w) {
  const word = str(w.word);
  if (!word) return true;
  if (!/^[a-z][a-z'-]*$/.test(word.toLowerCase())) return true; // letters/'/- only
  if (word.length > 18) return true;
  return false;
}

// Definition markers that betray a PROPER NOUN (given names, surnames, places,
// peoples, languages, demonyms). Excluded from the recommended public set — the
// project intentionally does not surface proper nouns. High precision: geography
// markers REQUIRE a capitalized place name so generic phrases like "a state of
// mind" or "a state of balance" are not falsely flagged.
const PROPER_NOUN_MARKERS = [
  /\bgiven name\b/i, /\bsurname\b/i, /\bfamily name\b/i, /\bpatronymic\b/i, /\bnickname\b/i,
  /\btoponym/i, /\bunincorporated community\b/i, /\bcensus-designated place\b/i,
  /\bethnic group\b/i, /\ban? ethnicity\b/i, /\ba language (?:of|spoken)\b/i, /\ba people (?:of|native)\b/i,
  // geography — must be followed by a Capitalized place (case-sensitive)
  /\b(?:city|town|village|hamlet|borough|municipality|commune|river|mountain|lake|sea|ocean|island|county|parish|province|prefecture|canton|region|district|country|kingdom|empire) (?:in|of|on|near) [A-Z]/,
  /\bcapital\b[^.]{0,40}\bof [A-Z]/,
  /\b(?:state|province|territory) of the (?:United States|Union|U\.S\.|United Kingdom)\b/i,
  /\b(?:U\.?S\.?|United States) state\b/i,
  /\b(?:a number of )?places? in (?:the |[A-Z])/,
  /\b(?:citizens?|inhabitants?|residents?|natives?) of (?:the )?[A-Z]/,
  /\b(?:United Kingdom|United States|Great Britain)\b/,
  /\(as a (?:region|place|state|city|country)\)/i,
];
// Demonym / nationality / language adjective: a trigger phrase followed by a
// Capitalized proper noun ("Of or relating to Britain", "relating to Germany").
// Trigger matched case-insensitively; the capital after it case-sensitively.
const DEMONYM_TRIGGERS = [
  "of or relating to ", "relating to ", "pertaining to ", "characteristic of ", "native to ",
];
function hasDemonymMarker(d) {
  const low = d.toLowerCase();
  for (const tr of DEMONYM_TRIGGERS) {
    let i = low.indexOf(tr);
    while (i !== -1) {
      const after = d[i + tr.length];
      if (after && after >= "A" && after <= "Z") return true;
      i = low.indexOf(tr, i + 1);
    }
  }
  return false;
}
export function isLikelyProperNoun(w) {
  // Judge the PRIMARY sense only (shortDef / first sentence). A word whose first
  // meaning is common (e.g. "brown" = a colour) stays even if a later sense is a
  // demonym; a word whose first meaning IS a proper noun is excluded.
  const full = definitionText(w);
  if (!full) return false;
  let d = str(w.shortDef);
  if (d.length < 8) { const m = full.match(/^.*?[.!?](\s|$)/); d = (m ? m[0] : full).trim(); }
  if (/^The [A-Z]/.test(d)) return true;            // "The Adirondacks (as a region)."
  // Lowercase only the first char so a sentence-start article/trigger ("A city
  // in X", "Native of Y") is matchable, while interior place capitals are kept.
  const dTest = d.charAt(0).toLowerCase() + d.slice(1);
  if (PROPER_NOUN_MARKERS.some((r) => r.test(dTest))) return true;
  return hasDemonymMarker(d);
}

// ── Component scores ─────────────────────────────────────────────────────────

// Commonness / frequency (0–28) — the single biggest signal of usefulness.
function frequencyScore(w) {
  const f = frequencyOf(w);
  if (f == null) {
    // No frequency data: infer a modest score from word length (mid-length
    // everyday-shaped words score a little higher than very long ones).
    const len = str(w.word).length;
    return len >= 3 && len <= 9 ? 10 : 6;
  }
  if (f >= 10) return 28;
  if (f >= 3) return 25;
  if (f >= 1) return 21;
  if (f >= 0.3) return 16;
  if (f >= 0.1) return 11;
  if (f >= 0.03) return 7;
  if (f > 0) return 4;
  return 2;
}

// Completeness contribution (0–22).
function completenessContribution(w) {
  return Math.round((wordCompletenessScore(w) / 100) * 22);
}

// Synonyms / antonyms / related richness (0–12).
function richnessScore(w) {
  let s = 0;
  const syn = list(w.synonyms).length;
  const ant = list(w.antonyms).length;
  const rel = list(w.related).length + list(w.wordFamily).length + list(w.rhymes).length;
  if (syn >= 3) s += 6;
  else if (syn >= 1) s += 3;
  if (ant >= 1) s += 3;
  if (rel >= 1) s += 3;
  return clamp(s, 0, 12);
}

// Definition quality (0–9).
function definitionQualityScore(w) {
  const d = definitionText(w);
  const len = d.length;
  let s = 0;
  if (len >= 120) s = 9;
  else if (len >= 60) s = 7;
  else if (len >= 30) s = 5;
  else s = 0;
  return s;
}

// Example quality (0–9). Real sourced examples edge out generated ones.
function exampleQualityScore(w) {
  const ex = list(w.examples);
  if (ex.length === 0) return 0;
  let s = ex.length >= 2 ? 8 : 6;
  const src = str(w.sources?.example).toLowerCase();
  if (src && src !== "editorial-generated" && src !== "generated") s += 1; // real source bonus
  return clamp(s, 0, 9);
}

// Pronunciation availability (0–5).
function pronunciationScore(w) {
  return str(w.pronunciation).length > 0 || str(w.phonetic).length > 0 ? 5 : 0;
}

// Educational + word-game usefulness (0–10).
function educationalScore(w) {
  const word = str(w.word).toLowerCase();
  let s = 0;
  // Word-game friendly: plain alphabetic, common game length.
  if (/^[a-z]+$/.test(word) && word.length >= 3 && word.length <= 9) s += 5;
  else if (/^[a-z]+$/.test(word)) s += 2;
  // Curated/seed list membership or explicit tags raise educational value.
  const tags = list(w.tags).map((t) => t.toLowerCase());
  if (tags.some((t) => ["sat", "gre", "ielts", "toefl", "academic", "vocabulary", "school"].includes(t))) s += 5;
  else if (tags.includes("common")) s += 3;
  else if (definitionQualityScore(w) >= 7) s += 2; // a clear, teachable definition
  return clamp(s, 0, 10);
}

// Spam / obscurity penalty (negative, up to −15).
function obscurityPenalty(w) {
  let p = 0;
  if (hasObscurityMarker(w)) p += 8;
  if (looksProperOrJunk(w)) p += 6;
  const f = frequencyOf(w);
  if (f != null && f > 0 && f < 0.02) p += 4; // extremely rare
  if (str(w.word).length > 14) p += 2;
  return clamp(p, 0, 15);
}

// ── Public recommendation score (0–100) ──────────────────────────────────────
export function wordRecommendationScore(w) {
  if (!w || w.needsDictionaryLookup) return 0;
  const raw =
    frequencyScore(w) +
    completenessContribution(w) +
    richnessScore(w) +
    definitionQualityScore(w) +
    exampleQualityScore(w) +
    pronunciationScore(w) +
    educationalScore(w) -
    obscurityPenalty(w);
  let score = clamp(Math.round(raw), 0, 100);
  // Hard caps that keep low-value entries below the public bar. Curated pages
  // bypass the recommendation gate entirely (see isPublishable), so these only
  // affect auto-enriched words.
  if (isLikelyProperNoun(w)) score = Math.min(score, 30); // proper nouns not surfaced
  if (str(w.word).length <= 2) score = Math.min(score, 40); // thin 1–2 letter headwords
  return score;
}

// ── Difficulty / usage / classification helpers (for cards, filters, sections) ─

// common | intermediate | advanced
export function wordDifficulty(w) {
  const f = frequencyOf(w);
  if (hasObscurityMarker(w)) return "advanced";
  if (f != null) {
    if (f >= 3) return "common";
    if (f >= 0.2) return "intermediate";
    return "advanced";
  }
  // No frequency: lean on definition clarity + length.
  const len = str(w.word).length;
  if (len <= 6 && definitionQualityScore(w) >= 5) return "common";
  if (len <= 10) return "intermediate";
  return "advanced";
}

// A short, human usage label shown on the page (not a quality badge).
export function wordUsageLabel(w) {
  if (hasSpecialistMarker(w)) return "specialist";
  if (hasObscurityMarker(w)) return "literary / rare";
  const diff = wordDifficulty(w);
  if (diff === "common") return "everyday";
  if (diff === "intermediate") return "general";
  return "advanced vocabulary";
}

// Word-game suitability (anagrams, scrabble, unscramble): plain alphabetic,
// 2–12 letters. Used for the "Word-game words" filter/section.
export function isWordGameWord(w) {
  const word = str(w.word).toLowerCase();
  return /^[a-z]+$/.test(word) && word.length >= 2 && word.length <= 12;
}

// The set of classification tags a card/filter can key off. Always returns a
// fresh array; merges any author-supplied w.tags with derived ones.
export function wordClassTags(w) {
  const set = new Set(list(w.tags).map((t) => t.toLowerCase()));
  set.add(wordDifficulty(w)); // common | intermediate | advanced
  if (isWordGameWord(w)) set.add("wordgame");
  return [...set];
}

// ── The combined public gate: complete AND recommended ───────────────────────
export function isRecommendedPublic(w) {
  return isCompleteWordEntry(w) && wordRecommendationScore(w) >= RECOMMENDATION_THRESHOLD;
}

export { PUBLIC_SCORE_THRESHOLD };
