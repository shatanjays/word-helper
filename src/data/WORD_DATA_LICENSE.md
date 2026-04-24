# Word Helper — Word Data Source and Licensing

## Current Word Data

The production word list at `dist/assets/word-data.js` is generated at build time from two sources:

1. **Curated seed list** (`src/data/seed-words.txt`) — A hand-curated set of common English words used by tool examples, rhyme data, and fallback behavior. This list is owned by the Word Helper project and is free to use and redistribute.

2. **System dictionary** (`/usr/share/dict/words`) — When available on the build machine, the build script reads this file to supplement the seed list with additional English words. On macOS, this file is typically derived from public-domain word lists (including BSD and Ispell sources), but the exact redistribution terms depend on the operating system image and distribution.

## Licensing Concern

The macOS `/usr/share/dict/words` redistribution license is not explicitly documented for all OS versions. Before distributing the generated `word-data.js` file publicly, review whether your specific system's dictionary file permits redistribution.

## Recommended Production Alternative

For clear production licensing, replace the system dictionary dependency with one of the following openly licensed word lists:

| Source | License | Notes |
|--------|---------|-------|
| [SCOWL (Spell Checker Oriented Word Lists)](http://wordlist.aspell.net/) | BSD-style (permissive) | 12 size levels, widely used |
| [ENABLE word list](https://everything2.com/title/ENABLE+word+list) | Public domain | ~172,000 words, competitive Scrabble standard |
| [Moby Word Lists](https://en.wikipedia.org/wiki/Moby_Project) | Public domain | Multiple lists including common words |

To use a custom word list: place a plain-text file with one word per line at `src/data/words.txt`, then modify `scripts/build.mjs` to prefer that file over the system dictionary.

## Current Word Count

The generated word list is capped at 30,000 entries, filtered to:
- Lowercase alphabetic only (`[a-z]`)
- 2–14 characters long
- No more than 3 consecutive repeated letters
- Longer words (12+ letters) further filtered to common word-forming endings

## Contact

For questions about word data, corrections, or licensing: hello@wordhelper.online
