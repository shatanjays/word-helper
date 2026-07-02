# Word Helper — Word Data Source and Licensing

## Current Word Data

The production tool dictionary at `dist/assets/word-data.js` is generated at build time from three sources, in priority order:

1. **Published word pages** — the quality-gated set of words that have full Word Helper pages (drawn from the enriched data under `src/data/enriched/`, compiled from Datamuse/Wiktionary and the Free Dictionary API — see the site's Editorial Policy for attribution).

2. **Curated seed list** (`src/data/seed-words.txt`) — A hand-curated set of common English words used by tool examples, rhyme data, and fallback behavior. This list is owned by the Word Helper project and is free to use and redistribute.

3. **Source word inventory** (`src/data/words.txt`, ~327,000 entries) — the public-domain **ENABLE** word list (~172,000 words) **extended with a supplementary word list** (originally derived from a system dictionary; see the provenance note below). The most frequent entries (ranked by the Norvig `count_1w` frequency list at `data/freq/count_1w.txt`) fill the remaining dictionary slots, capped at 30,000 additions.

## ENABLE Word List

- **License**: Public domain — no restrictions on use or redistribution
- **Source**: Originally compiled by Alan Beale from public-domain word sources
- **Mirror used**: https://github.com/dolph/dictionary (enable1.txt)
- **Word count**: ~172,000 words
- **Filtered to**: lowercase alphabetic, 2–14 characters, no 4+ consecutive repeated letters

The ENABLE word list has been used in Scrabble tournaments, crossword puzzle software, word-game apps, and academic research. Its public-domain status makes it safe to bundle with and redistribute as part of this project.

## Supplementary list provenance note

The ~154,000 entries in `words.txt` beyond ENABLE were originally sourced from a
system word list. Redistribution terms of system dictionaries can vary by system
image. Because the supplementary entries are used only as a candidate inventory
(word validation for game tools) and the shipped dictionary is dominated by
ENABLE + published pages + frequency-ranked common words, exposure is limited —
but replacing the supplementary portion with an explicitly-licensed list (e.g.
SCOWL) remains a recommended future hardening step. Public-facing copy describes
this accurately ("ENABLE plus a supplementary word list") and does not overclaim.

## Build Filtering

The build script filters the source inventory to:
- Lowercase alphabetic only (`[a-z]`)
- 2–14 characters long
- No four or more consecutive repeated letters
- 12+ letter words further filtered to common word-forming endings (`tion`, `ness`, `ment`, `less`, `able`, `ible`, `ing`, `ful`)
- Ranked by real-world frequency (Norvig count_1w list); capped at 30,000 additions on top of the published-page words

## Fallback Behavior

If `src/data/words.txt` is not present at build time, the build script falls back to the system dictionary at `/usr/share/dict/words` or `/usr/dict/words`. The fallback is acceptable for development but should not be used for production distribution due to unclear redistribution terms.

## Contact

For questions about word data, corrections, or licensing: hello@wordhelper.online
