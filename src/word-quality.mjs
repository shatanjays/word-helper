// ─────────────────────────────────────────────────────────────────────────────
// Word completeness — the SINGLE SOURCE OF TRUTH for whether a word entry is
// good enough to be shown publicly (A-Z listings, search suggestions, internal
// links, sitemap, indexable detail page).
//
// Rules:
//  • Never fabricate data. This module only INSPECTS the fields a word already
//    has; it never invents definitions, examples, or pronunciations.
//  • A word is "complete" only when every REQUIRED field is present and the
//    0–100 completeness score is at least PUBLIC_SCORE_THRESHOLD (80).
//  • Words below the bar stay in the internal database but are hidden from the
//    public surface until they are enriched.
// ─────────────────────────────────────────────────────────────────────────────

export const PUBLIC_SCORE_THRESHOLD = 80;

const str = (v) => (v == null ? "" : String(v)).trim();
const list = (v) => (Array.isArray(v) ? v.filter((x) => str(x).length > 0) : []);

// A real part of speech — the browse stubs carry the placeholder "word".
function hasRealPartOfSpeech(w) {
  const pos = str(w.partOfSpeech).toLowerCase();
  return pos.length > 0 && pos !== "word";
}

function definitionText(w) {
  return str(w.definition || w.shortDef);
}

// Pronunciation OR phonetic spelling (IPA, respelling, or a syllable respelling).
function hasPronunciation(w) {
  return str(w.pronunciation).length > 0 || str(w.phonetic).length > 0;
}

// ── Field-level checks (also used by the audit report) ───────────────────────
export function wordFieldStatus(w) {
  const examples = list(w.examples);
  const synonyms = list(w.synonyms);
  const antonyms = list(w.antonyms);
  const related = list(w.related);
  const wordFamily = list(w.wordFamily);
  return {
    word: str(w.word).length > 0,
    definition: definitionText(w).length >= 30,
    partOfSpeech: hasRealPartOfSpeech(w),
    example: examples.length >= 1,
    syllables: Number(w.syllables) > 0,
    pronunciation: hasPronunciation(w),
    seoTitle: str(w.metaTitle).length >= 10,
    seoDescription: str(w.metaDescription).length >= 50,
    // recommended
    synonyms: synonyms.length >= 1,
    antonyms: antonyms.length >= 1,
    etymology: str(w.etymology).length > 0,
    relatedWords: related.length >= 1 || wordFamily.length >= 1,
    multipleExamples: examples.length >= 3,
  };
}

// Required fields a public word page MUST have (hard gate).
export const REQUIRED_FIELDS = [
  "word",
  "definition",
  "partOfSpeech",
  "example",
  "syllables",
  "pronunciation",
  "seoTitle",
  "seoDescription",
];

// ── Completeness score (0–100) ───────────────────────────────────────────────
// Required fields total 84; with every required field present a word already
// clears the 80 threshold. Recommended fields add up to 16 more so richer
// entries rank higher in the audit.
const SCORE_WEIGHTS = {
  word: 5,
  definition: 25,
  partOfSpeech: 12,
  example: 18,
  syllables: 8,
  pronunciation: 8,
  seoTitle: 4,
  seoDescription: 4,
  synonyms: 6,
  antonyms: 3,
  etymology: 3,
  relatedWords: 2,
  multipleExamples: 2,
};

export function wordCompletenessScore(w) {
  // Browse stubs / lookup placeholders are never scored as real entries.
  if (!w || w.needsDictionaryLookup) return 0;
  const status = wordFieldStatus(w);
  let score = 0;
  for (const [field, weight] of Object.entries(SCORE_WEIGHTS)) {
    if (status[field]) score += weight;
  }
  return Math.min(100, score);
}

// ── The public gate ──────────────────────────────────────────────────────────
export function isCompleteWordEntry(w) {
  if (!w || w.needsDictionaryLookup) return false;
  const status = wordFieldStatus(w);
  for (const field of REQUIRED_FIELDS) {
    if (!status[field]) return false;
  }
  return wordCompletenessScore(w) >= PUBLIC_SCORE_THRESHOLD;
}

// Which required/recommended fields a word is missing (for reporting + tooltips).
export function missingFields(w) {
  const status = wordFieldStatus(w);
  const allFields = Object.keys(SCORE_WEIGHTS);
  return {
    requiredMissing: REQUIRED_FIELDS.filter((f) => !status[f]),
    recommendedMissing: allFields.filter((f) => !REQUIRED_FIELDS.includes(f) && !status[f]),
  };
}

// A short, honest "noun · 3 syllables" / "noun / verb" micro-label for cards.
// Never shows a quality badge — every visible word is already complete.
export function wordMicroMeta(w) {
  const posRaw = str(w.partOfSpeech);
  const pos = hasRealPartOfSpeech(w) ? posRaw.replace(/\s*\/\s*/g, " / ") : "";
  const syl = Number(w.syllables) > 0 ? Number(w.syllables) : 0;
  const parts = [];
  if (pos) parts.push(pos);
  if (syl > 0) parts.push(`${syl} syllable${syl === 1 ? "" : "s"}`);
  return parts.join(" · ");
}
