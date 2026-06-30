// Sanitizes the synonym / antonym / related arrays that come from open language
// data (Datamuse rel_syn / rel_ant / ml, with a Free Dictionary fallback).
//
// WHY: Datamuse's synonym relation is sense-blind. On polysemous or common words
// it can surface an off-sense or crude candidate — the classic example is the
// noun "cat" (a pet) pulling in the slang verb sense ("to cat" = to vomit), so
// the raw list reads "cast, sick, disgorge, vomit, regurgitate, retch". That is
// exactly the kind of low-quality / unsafe content an AdSense reviewer flags.
//
// This filter is a deterministic, always-on safety net applied at render time
// (no data mutation, fully reversible). It removes a small blocklist of crude /
// bodily-function tokens that are almost never the intended sense on a family-
// friendly reference site, drops multi-word and non-alphabetic entries (the word
// pages link one word at a time), removes self-references and synonym/antonym
// contradictions, de-duplicates "related" against "synonyms", and caps each list.
//
// It intentionally does NOT blocklist ordinary words (sick, cast, guy, …) that
// are legitimate synonyms in other contexts — only the crude cluster is removed.

// Crude / bodily-function tokens that read as noise on a reference site. Kept
// deliberately narrow: every entry here is one that is essentially never the
// wanted synonym sense for a clean English word page.
const NOISE_BLOCKLIST = new Set([
  "vomit", "vomiting", "vomited", "puke", "puking", "puked", "barf", "barfing",
  "retch", "retching", "regurgitate", "regurgitating", "regurgitation",
  "disgorge", "disgorging", "spew", "spewing", "spue", "upchuck", "chunder",
  "hurl", "honk", "boak", "cat", "shit", "crap", "piss", "turd", "fart",
  "defecate", "urinate", "feces", "faeces",
]);

const CAP = 6;

function norm(s) {
  return String(s == null ? "" : s).trim().toLowerCase();
}

// A candidate is renderable only if it is a single alphabetic word (optionally
// hyphenated), is not the headword itself or a trivial inflection of it, and is
// not in the crude blocklist.
function isCleanCandidate(candidate, word) {
  const c = norm(candidate);
  if (!c) return false;
  if (/[^a-z'-]/.test(c)) return false; // drop spaces, digits, "keep down", etc.
  if (NOISE_BLOCKLIST.has(c)) return false;
  const w = norm(word);
  if (c === w) return false;
  if (c === w + "s" || c + "s" === w) return false; // trivial plural echo
  return true;
}

function dedupeKeep(list) {
  const seen = new Set();
  const out = [];
  for (const item of list) {
    const key = norm(item);
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(item);
  }
  return out;
}

// Returns cleaned { synonyms, antonyms, related } for a headword.
// minKeep: a list with fewer than this many clean entries is dropped entirely,
// so we never render a one-item, low-confidence "Synonyms" section.
export function sanitizeRelations(word, { synonyms = [], antonyms = [], related = [] } = {}, { minKeep = 2 } = {}) {
  const cleanSyn = dedupeKeep((synonyms || []).filter((s) => isCleanCandidate(s, word))).slice(0, CAP);
  const cleanAnt = dedupeKeep((antonyms || []).filter((a) => isCleanCandidate(a, word))).slice(0, CAP);

  // Drop any synonym that also appears as an antonym (a contradiction = noise).
  const antSet = new Set(cleanAnt.map(norm));
  const synSet = new Set(cleanSyn.map(norm));
  const finalSyn = cleanSyn.filter((s) => !antSet.has(norm(s)));
  const finalSynSet = new Set(finalSyn.map(norm));

  // "Related" should not just echo the synonyms; keep distinct, clean entries.
  const cleanRel = dedupeKeep(
    (related || [])
      .filter((r) => isCleanCandidate(r, word))
      .filter((r) => !finalSynSet.has(norm(r)) && !antSet.has(norm(r))),
  ).slice(0, CAP);

  return {
    synonyms: finalSyn.length >= minKeep ? finalSyn : [],
    antonyms: cleanAnt.length >= minKeep ? cleanAnt : [],
    related: cleanRel.length >= 1 ? cleanRel : [],
  };
}
