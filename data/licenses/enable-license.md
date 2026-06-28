# ENABLE Word List — License

**Source**: ENABLE (Enhanced North American Benchmark Lexicon)
**Compiler**: Alan Beale (from public-domain sources)
**License**: Public domain — no restrictions on use, modification, or redistribution
**Mirror**: https://github.com/dolph/dictionary (enable1.txt)
**Word count (raw)**: ~172,000 entries
**Format**: One lowercase word per line

## Usage in Word Helper

The ENABLE list is used as the base word coverage layer in Word Helper's dictionary pipeline.
It provides word validity (is this a real English word?) without definitions, pronunciation, or meanings.
Definitions, examples, and enriched data are added separately from original sources.

## Attribution

No attribution is required for the ENABLE word list (public domain).
This note is kept for project record-keeping only.

## Data enrichment needed

ENABLE provides only word strings. To make word pages indexable, each entry requires:
- Original learner-friendly definition
- Part of speech
- Example sentences
- Pronunciation guide or syllable breakdown
- Quality score ≥ 70
