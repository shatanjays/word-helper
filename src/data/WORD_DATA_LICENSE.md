# Word Helper — Word Data Source and Licensing

## Current Word Data

The production word list at `dist/assets/word-data.js` is generated at build time from two sources:

1. **Curated seed list** (`src/data/seed-words.txt`) — A hand-curated set of common English words used by tool examples, rhyme data, and fallback behavior. This list is owned by the Word Helper project and is free to use and redistribute.

2. **ENABLE word list** (`src/data/words.txt`) — The ENABLE (Enhanced North American Benchmark Lexicon) word list, a public-domain English word list containing approximately 172,000 words. ENABLE is widely used in competitive word games and is freely available for any use without restriction.

## ENABLE Word List

- **License**: Public domain — no restrictions on use or redistribution
- **Source**: Originally compiled by Alan Beale from public-domain word sources
- **Mirror used**: https://github.com/dolph/dictionary (enable1.txt)
- **Word count**: ~172,000 words
- **Filtered to**: lowercase alphabetic, 2–14 characters, no 4+ consecutive repeated letters

The ENABLE word list has been used in Scrabble tournaments, crossword puzzle software, word-game apps, and academic research. Its public-domain status makes it safe to bundle with and redistribute as part of this project.

## Build Filtering

The build script filters the ENABLE list to:
- Lowercase alphabetic only (`[a-z]`)
- 2–14 characters long
- No four or more consecutive repeated letters
- 12+ letter words further filtered to common word-forming endings (`tion`, `ness`, `ment`, `less`, `able`, `ible`, `ing`, `ful`)
- Capped at 30,000 words for performance

## Fallback Behavior

If `src/data/words.txt` is not present at build time, the build script falls back to the system dictionary at `/usr/share/dict/words` or `/usr/dict/words`. The fallback is acceptable for development but should not be used for production distribution due to unclear redistribution terms.

## Contact

For questions about word data, corrections, or licensing: hello@wordhelper.online
