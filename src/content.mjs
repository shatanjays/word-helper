// site.url is the brand domain — always the intended canonical, NOT the active
// deploy URL. build.mjs line 64 OVERRIDES site.url with HOST_CANONICAL so
// that all canonical/og/sitemap/schema URLs resolve to the actual deploy host.
// To deploy to pages.dev: set HOST_CANONICAL=https://wordhelper-online.pages.dev
// To deploy to live domain: set HOST_CANONICAL=https://wordhelper.online
// See scripts/build.mjs and docs/custom-domain-readiness.md.
export const site = {
  name: "Word Helper",
  url: "https://wordhelper.online",
  email: "hello@wordhelper.online",
  description:
    "Word Helper is an English word toolkit: look up definitions, pronunciation, synonyms, and etymology, then solve word puzzles, find rhymes, count syllables, and build vocabulary. Editorially reviewed.",
};

// REAL, hand-maintained review date for the trust/legal pages. Bump this ONLY
// when a human actually reviews those pages — it renders as "Reviewed <date>"
// and must never silently re-date on rebuilds. (Individual pages may override
// with their own reviewedDate field.) Last genuine review: July 2, 2026 —
// full policy-accuracy + AdSense-readiness pass.
export const legalReviewedDate = "2026-07-02";

// Real, named site creator/owner — honest E-E-A-T (a genuine person, not a
// fabricated credential). Referenced in Organization/Person schema, the footer,
// the /creator/ page, About, Editorial Policy, and (subtly) the word-page note.
export const founder = {
  name: "Jay Sudha",
  fullName: "Shatanjay Sudha",
  url: "https://jaysudha.com/",
  role: "Founder, builder, and editor",
};

export const toolNav = [
  "/tools/word-unscramble/",
  "/tools/anagram-solver/",
  "/tools/rhyme-finder/",
  "/tools/syllable-counter/",
  "/tools/prefix-finder/",
  "/tools/suffix-finder/",
];

export const mainNav = [
  { href: "/word-lab/", label: "Tools" },
  { href: "/word-games/", label: "Word Games" },
  { href: "/writing-tools/", label: "Writing Tools" },
  { href: "/rhyming-words/", label: "Rhyming Words" },
  { href: "/vocabulary/", label: "Vocabulary" },
  { href: "/spelling-patterns/", label: "Spelling Patterns" },
  { href: "/guides/", label: "Guides" },
  { href: "/about/", label: "About" },
];

export const hubNav = [
  { href: "/word-games/", label: "Word Games" },
  { href: "/writing-tools/", label: "Writing Tools" },
  { href: "/rhyming-words/", label: "Rhyming Words" },
  { href: "/vocabulary/", label: "Vocabulary" },
  { href: "/spelling-patterns/", label: "Spelling Patterns" },
  { href: "/guides/", label: "Guides" },
];

export const legalNav = [
  { href: "/privacy-policy/", label: "Privacy Policy" },
  { href: "/terms/", label: "Terms" },
  { href: "/disclaimer/", label: "Disclaimer" },
  { href: "/cookie-policy/", label: "Cookie Policy" },
  { href: "/editorial-policy/", label: "Editorial Policy" },
  { href: "/affiliate-disclosure/", label: "Advertising Disclosure" },
  { href: "/accessibility/", label: "Accessibility" },
  { href: "/copyright/", label: "Copyright & DMCA" },
];

export const tools = [
  {
    id: "word-unscramble",
    icon: "unscramble",
    href: "/tools/word-unscramble/",
    title: "Word Unscramble",
    h1: "Word Unscramble",
    metaTitle: "Word Unscramble - Unscramble Letters Into Words",
    metaDescription:
      "Use Word Helper to unscramble letters into valid words, filter by length or pattern, and group buildable words by word length.",
    intro:
      "Enter scrambled letters, add optional filters, and find words that can be built from those exact letters.",
    answer:
      "A word unscrambler finds valid words that can be made from the letters you enter. Word Helper checks letter counts so a word only appears if it can be built from the available letters.",
    primaryKeyword: "word unscramble",
    keywords:
      "unscramble letters, word unscrambler, scrambled letters, words from letters, word game helper",
    buttonLabel: "Unscramble Letters",
    resultHeading: "Words you can build from these letters",
    emptyState:
      "Enter scrambled letters like \"tca\" or \"listen\" to find words you can build from those exact letters.",
    noResultState:
      "No matching words found. Try removing a filter, lowering the minimum length, or using a wildcard for an unknown letter.",
    examples: [
      { label: "tca", value: "tca", note: "Try act and cat." },
      { label: "listen", value: "listen", note: "Find silent, enlist, inlets, and tinsel." },
      { label: "a?ple", value: "a?ple", note: "Use ? as a wildcard." },
    ],
    how: [
      "Word Helper counts every letter you enter and compares that count with each candidate word.",
      "Duplicate letters matter. A word with two t's will only appear when your letters include two t's, unless a wildcard can cover the missing letter.",
      "Starts-with, ends-with, contains, and length filters reduce the result set so word-game players can scan quickly.",
      "Wildcards such as ? or * can stand in for unknown letters when a game tile or missing clue is uncertain.",
    ],
    tips: [
      "Start with fewer filters, then narrow the list once you know the word length.",
      "Use contains when a board already gives you a fixed middle letter.",
      "Scan the longest groups first when a word game rewards longer answers.",
    ],
    faqs: [
      {
        q: "How do I unscramble letters into words?",
        a: "Type the letters you have, then run the tool. Word Helper checks which words can be built from those letters and groups the results by length.",
      },
      {
        q: "How does Word Helper handle duplicate letters?",
        a: "It uses letter-frequency matching. If a result needs two copies of a letter, your input must include two copies or enough wildcards to cover the gap.",
      },
      {
        q: "Can I use a wildcard for unknown letters?",
        a: "Yes. Use ? or * for an unknown letter. Wildcards can fill missing letters after the exact letters are counted.",
      },
      {
        q: "Why do filters reduce the number of unscrambled words?",
        a: "Filters remove words that do not match your chosen starting letters, ending letters, contained letters, or length range.",
      },
    ],
    related: ["/tools/anagram-solver/", "/tools/prefix-finder/", "/tools/suffix-finder/"],
    disclaimer:
      "Word lists can vary by game or dictionary. Check your game's accepted dictionary before playing a final answer.",
  },
  {
    id: "anagram-solver",
    icon: "anagram",
    href: "/tools/anagram-solver/",
    title: "Anagram Solver",
    h1: "Anagram Solver",
    metaTitle: "Anagram Solver - Exact and Partial Anagrams",
    metaDescription:
      "Solve anagrams from letters, words, or short phrases. Choose exact mode or partial mode and copy grouped anagram results.",
    intro:
      "Find exact anagrams that use every letter or smaller words hidden inside a longer set of letters.",
    answer:
      "An anagram solver rearranges letters to find valid words or phrases. Exact mode uses every letter once, while partial mode finds smaller words that can be made from the same letters.",
    primaryKeyword: "anagram solver",
    keywords:
      "solve anagram, anagram finder, phrase anagram, letters to anagrams, exact anagram",
    buttonLabel: "Solve Anagram",
    resultHeading: "Anagrams found from your letters",
    emptyState:
      "Enter letters or a short phrase, then choose exact mode or partial mode.",
    noResultState:
      "No anagrams found. Try partial mode, remove punctuation, or use fewer letters.",
    examples: [
      { label: "listen", value: "listen", note: "Exact anagrams include silent, enlist, and tinsel." },
      { label: "stone", value: "stone", note: "Find notes, tones, and onset." },
      { label: "earth", value: "earth", note: "Exact anagrams include heart and hater." },
    ],
    how: [
      "Exact mode uses every letter exactly once, after spaces and punctuation are removed.",
      "Partial mode allows smaller valid words that can be made from some of the letters.",
      "Not every rearrangement is a valid word, so Word Helper checks candidates against a local word list.",
      "Anagram solving is stricter than broad word unscrambling when exact mode is selected.",
    ],
    tips: [
      "Use exact mode for classic anagram clues.",
      "Use partial mode when you want playable smaller words from a longer phrase.",
      "Remove extra words from a long phrase if the exact result set is too narrow.",
    ],
    faqs: [
      {
        q: "What is an anagram?",
        a: "An anagram is a word or phrase made by rearranging the letters of another word or phrase.",
      },
      {
        q: "What is the difference between exact and partial anagram mode?",
        a: "Exact mode uses every cleaned letter once. Partial mode finds smaller words that can be made from some of the same letters.",
      },
      {
        q: "Does the anagram solver ignore spaces?",
        a: "Yes. Spaces and punctuation are removed before matching, so short phrases can be checked by their letters.",
      },
      {
        q: "Why are some rearrangements not valid anagrams?",
        a: "A rearrangement only appears when it matches a word in the local word list. Random letter orders are not shown as valid results.",
      },
    ],
    related: ["/tools/word-unscramble/", "/tools/prefix-finder/", "/word-games/"],
    disclaimer:
      "Exact anagrams depend on the available word list. Proper nouns and phrase-level anagrams may not be included.",
  },
  {
    id: "rhyme-finder",
    icon: "rhyme",
    href: "/tools/rhyme-finder/",
    title: "Rhyme Finder",
    h1: "Rhyme Finder",
    metaTitle: "Rhyme Finder - Perfect Rhymes, Near Rhymes, and Similar Endings",
    metaDescription:
      "Find rhyme ideas for poems, lyrics, captions, rap lines, and classroom writing with perfect rhymes, near rhymes, and similar endings.",
    intro:
      "Search for rhyme ideas by word and compare perfect rhymes, near rhymes, and spelling-based similar endings.",
    answer:
      "A rhyme finder suggests words with similar ending sounds or spelling patterns. Perfect rhymes match more closely, while near rhymes and similar endings can help with songs, poems, captions, and creative writing.",
    primaryKeyword: "rhyme finder",
    keywords:
      "rhyming words, words that rhyme, find rhymes, near rhymes, perfect rhymes, rhyme ideas",
    buttonLabel: "Find Rhymes",
    resultHeading: "Rhyming ideas for this word",
    emptyState:
      "Enter a word like \"light\", \"time\", or \"day\" to find rhyme ideas.",
    noResultState:
      "No strong rhymes found. Try a shorter word, check the spelling, or search for a similar ending sound.",
    examples: [
      { label: "light", value: "light", note: "Try bright, flight, night, and right." },
      { label: "time", value: "time", note: "Try climb, rhyme, chime, and prime." },
      { label: "day", value: "day", note: "Try play, stay, way, and say." },
    ],
    how: [
      "Word Helper uses curated rhyme examples first, then spelling-ending logic when pronunciation data is not available.",
      "Perfect rhymes are the closest matches in the available data.",
      "Near rhymes can feel more natural in lyrics because they avoid forced word choice.",
      "Similar endings are useful for brainstorming, but matching letters do not always mean matching sound.",
    ],
    tips: [
      "Read rhyme choices aloud before using them in a poem or lyric.",
      "Choose the word that fits the meaning, not only the sound.",
      "Use near rhymes when a perfect rhyme makes the line feel stiff.",
    ],
    faqs: [
      {
        q: "What words rhyme with light?",
        a: "Common close rhymes for light include bright, flight, night, right, sight, and slight.",
      },
      {
        q: "What is the difference between perfect rhymes and near rhymes?",
        a: "Perfect rhymes match more closely in ending sound. Near rhymes share enough sound to feel connected but may not match exactly.",
      },
      {
        q: "Can near rhymes work better in lyrics?",
        a: "Yes. Near rhymes often sound more natural in songs, rap lines, and captions because they give writers more flexible word choices.",
      },
      {
        q: "Why do similar endings not always sound like rhymes?",
        a: "English spelling and pronunciation do not always match. Similar ending letters can be useful, but sound and accent still matter.",
      },
    ],
    related: ["/tools/syllable-counter/", "/rhyming-words/", "/writing-tools/"],
    disclaimer:
      "Rhyme results include spelling-based fallback suggestions. They are brainstorming aids, not a full pronunciation dictionary.",
  },
  {
    id: "syllable-counter",
    icon: "syllable",
    href: "/tools/syllable-counter/",
    title: "Syllable Counter",
    h1: "Syllable Counter",
    metaTitle: "Syllable Counter - Count Syllables in Words and Sentences",
    metaDescription:
      "Estimate syllables in a word, sentence, poem, speech, or paragraph with total counts and a word-by-word breakdown.",
    intro:
      "Paste a word, line, or paragraph to estimate syllables and inspect the rhythm word by word.",
    answer:
      "A syllable counter estimates how many spoken beats appear in a word or sentence. Word Helper gives a clear word-by-word breakdown based on standard English pronunciation; accent and poetic usage can shift the final count.",
    primaryKeyword: "syllable counter",
    keywords:
      "count syllables, syllable checker, syllables in a word, syllable breakdown, poetry syllable counter",
    buttonLabel: "Count Syllables",
    resultHeading: "Syllable breakdown",
    emptyState:
      "Paste a word, sentence, or paragraph to see syllable totals and a word-by-word breakdown.",
    noResultState: "Add readable words so Word Helper can estimate syllables.",
    examples: [
      { label: "beautiful", value: "beautiful", note: "Beautiful is commonly counted as 3 syllables." },
      { label: "education", value: "education", note: "Education is commonly counted as 4 syllables." },
      { label: "The morning sky is beautiful.", value: "The morning sky is beautiful.", note: "Try a short sentence breakdown." },
    ],
    how: [
      "The estimator counts vowel groups, adjusts for common silent-e endings, and applies a small exception list for frequent words.",
      "Syllables can vary by accent, dialect, and whether a word is used in strict poetry meter.",
      "The summary shows total syllables, words, sentences, and average syllables per word.",
      "The word-by-word breakdown helps writers spot rhythm changes in poems, speeches, and classroom writing.",
    ],
    tips: [
      "Use the word breakdown to find the line that feels too long.",
      "Read the sentence aloud if the count seems close but not quite right.",
      "For poetry, treat the result as a starting point and make final choices by sound.",
    ],
    faqs: [
      {
        q: "How do I count syllables in a word?",
        a: "The count starts from spoken vowel beats, then adjusts for silent letters and common pronunciation patterns.",
      },
      {
        q: "Why can syllable counts vary?",
        a: "Accent, dialect, speech speed, and poetic usage can change how a word is spoken.",
      },
      {
        q: "Can this help with poetry meter?",
        a: "Yes. It can help you draft and compare line rhythm, but final meter should be checked by reading the line aloud.",
      },
      {
        q: "How does Word Helper estimate syllables?",
        a: "It uses vowel-group estimation, silent-e handling, and common exceptions to produce a practical count.",
      },
    ],
    related: ["/tools/rhyme-finder/", "/rhyming-words/", "/writing-tools/"],
    disclaimer:
      "This tool follows standard English pronunciation; counts can shift with accent, dialect, and poetic usage.",
  },
  {
    id: "prefix-finder",
    icon: "prefix",
    href: "/tools/prefix-finder/",
    title: "Prefix Finder",
    h1: "Prefix Finder",
    metaTitle: "Prefix Finder - Find Words Starting With a Prefix",
    metaDescription:
      "Find words starting with a chosen prefix or starting letter pattern, group them by length, and copy vocabulary lists.",
    intro:
      "Type a prefix or starting pattern to find words that begin with those exact letters.",
    answer:
      "A prefix finder shows words that begin with the letters you enter. Some prefixes carry meaning, but this tool matches starting letters exactly so users can study patterns, spelling, and word families.",
    primaryKeyword: "prefix finder",
    keywords:
      "words starting with, words beginning with, prefix words, words with prefix, vocabulary prefix",
    buttonLabel: "Find Prefix Words",
    resultHeading: "Words starting with this prefix",
    emptyState:
      "Type a prefix like \"pre\", \"un\", or \"re\" to find words that begin with that exact pattern.",
    noResultState:
      "No words found with that prefix. Try a shorter prefix such as \"pre\" instead of a full word beginning.",
    examples: [
      { label: "pre", value: "pre", note: "prepare, predict, prefix, preview" },
      { label: "un", value: "un", note: "undo, unfair, unlock, unknown" },
      { label: "re", value: "re", note: "rebuild, return, rewrite, redo" },
      { label: "mis", value: "mis", note: "mistake, misread, misunderstand" },
    ],
    how: [
      "The prefix finder matches starting letters exactly, not only meaning-based prefixes.",
      "Shorter prefixes usually return more words because more words share the same beginning.",
      "Prefix patterns help students see vocabulary families and spelling relationships.",
      "Word-game players can combine prefix results with length filters to narrow possible answers.",
    ],
    tips: [
      "Try two or three letters first, then add more letters if the list is too broad.",
      "Use length filters when a clue or game board gives you a fixed word size.",
      "Compare words in the same prefix family to see how meaning shifts.",
    ],
    faqs: [
      {
        q: "What words start with pre?",
        a: "Common examples include prepare, predict, prefix, preview, prevent, preheat, and prepay.",
      },
      {
        q: "Does a prefix finder match meaning or letters?",
        a: "This tool matches starting letters exactly. Some matches are meaningful prefixes, while others only share the same spelling pattern.",
      },
      {
        q: "Why do shorter prefixes return more words?",
        a: "Shorter patterns are less restrictive, so more words begin with them.",
      },
      {
        q: "Can prefixes help vocabulary learning?",
        a: "Yes. Prefix families can help learners connect spelling, meaning, and word formation.",
      },
    ],
    related: ["/tools/suffix-finder/", "/vocabulary/", "/spelling-patterns/"],
    disclaimer:
      "Prefix results are letter-based. A word can start with the same letters without using that prefix as a meaning unit.",
  },
  {
    id: "suffix-finder",
    icon: "suffix",
    href: "/tools/suffix-finder/",
    title: "Suffix Finder",
    h1: "Suffix Finder",
    metaTitle: "Suffix Finder - Find Words Ending With a Suffix",
    metaDescription:
      "Find words ending with a chosen suffix or ending pattern, group results by length, and copy spelling or vocabulary lists.",
    intro:
      "Type a suffix or ending pattern to find words that end with those exact letters.",
    answer:
      "A suffix finder shows words that end with the letters you enter. Some suffixes carry grammar meaning, but Word Helper matches ending letters exactly to help with spelling, vocabulary, and word pattern discovery.",
    primaryKeyword: "suffix finder",
    keywords:
      "words ending with, suffix words, words with suffix, ending words, spelling endings",
    buttonLabel: "Find Suffix Words",
    resultHeading: "Words ending with this suffix",
    emptyState:
      "Type a suffix like \"ing\", \"less\", or \"tion\" to find words ending with that exact pattern.",
    noResultState:
      "No words found with that suffix. Try removing extra letters or searching a shorter ending like \"ing\" instead of \"playing\".",
    examples: [
      { label: "ing", value: "ing", note: "reading, writing, running, thinking" },
      { label: "less", value: "less", note: "careless, fearless, harmless, useless" },
      { label: "tion", value: "tion", note: "action, creation, direction, motion" },
      { label: "able", value: "able", note: "readable, usable, washable" },
    ],
    how: [
      "The suffix finder matches ending letters exactly, not only grammatical suffixes.",
      "Endings such as -ing and -tion return many results because they are common word-forming patterns.",
      "Suffixes can change tense, part of speech, or meaning, but spelling-based endings can also appear for other reasons.",
      "Spelling learners can use suffix groups to compare how base words change.",
    ],
    tips: [
      "Try the shortest meaningful ending first.",
      "Use length filters to avoid lists that are too broad.",
      "Compare endings such as -able and -ible to study spelling choices.",
    ],
    faqs: [
      {
        q: "What words end with ing?",
        a: "Common examples include reading, writing, running, thinking, making, learning, and building.",
      },
      {
        q: "Does a suffix finder match grammar or letters?",
        a: "This tool matches ending letters exactly. Some results are true grammatical suffixes, while others are spelling matches.",
      },
      {
        q: "Why do endings like tion return many words?",
        a: "-tion is a common English ending, so many nouns share it.",
      },
      {
        q: "Can suffixes help spelling?",
        a: "Yes. Looking at ending patterns helps learners compare word families and notice common spelling changes.",
      },
    ],
    related: ["/tools/prefix-finder/", "/vocabulary/", "/spelling-patterns/"],
    disclaimer:
      "Suffix results are letter-based. A word can end with the same letters without using that ending as a grammar suffix.",
  },
  {
    id: "word-finder",
    icon: "search",
    href: "/tools/word-finder/",
    title: "Word Finder",
    h1: "Word Finder",
    metaTitle: "Word Finder - Find Words by Letters, Length & Pattern",
    metaDescription:
      "Find English words that contain specific letters, start or end with a pattern, and match a length range. A fast word finder for games, writing, and study.",
    intro:
      "Find words that contain the letters you choose — then narrow by starting letters, ending letters, and length.",
    answer:
      "A word finder searches a large English word list for words that match your letters and filters. Enter the letters a word must contain, then refine by start, end, or length to find the exact word you need.",
    primaryKeyword: "word finder",
    keywords:
      "word finder, find words, words with letters, words containing letters, word search helper",
    buttonLabel: "Find Words",
    resultHeading: "Words that match your letters",
    emptyState:
      "Enter letters a word must contain — e.g. \"ae\" — and add optional start, end, or length filters.",
    noResultState:
      "No matching words found. Try fewer required letters, a wider length range, or removing a start/end filter.",
    examples: [
      { label: "ae", value: "ae", note: "Words containing both a and e." },
      { label: "zz", value: "zz", note: "Words containing a double z." },
      { label: "qu", value: "qu", note: "Words containing q and u." },
    ],
    how: [
      "Word Helper keeps only words that contain every letter you list (in any position).",
      "Starts-with and ends-with filters trim the list to a specific shape.",
      "The length range removes words that are too short or too long for your need.",
      "Results are grouped by length so you can scan the most useful words first.",
    ],
    tips: [
      "Start with one or two required letters, then add filters once the list is large.",
      "Use the length range for word games that need an exact letter count.",
      "Combine a starting letter with a required letter to solve crossword-style clues.",
    ],
    faqs: [
      {
        q: "How do I find words with certain letters?",
        a: "Type the letters a word must contain, then run the tool. Word Helper returns words that include all of those letters, grouped by length.",
      },
      {
        q: "How is Word Finder different from the unscrambler?",
        a: "The unscrambler builds words only from the exact letters you enter. Word Finder returns any word that contains your letters, even longer words with extra letters.",
      },
      {
        q: "Can I limit results by length?",
        a: "Yes. Set a minimum and maximum length to match a word game tile count or a crossword slot.",
      },
    ],
    related: ["/tools/word-unscramble/", "/tools/anagram-solver/", "/tools/prefix-finder/"],
    disclaimer:
      "Words come from the public-domain ENABLE word list plus a supplementary system list, which can differ from a specific game's official dictionary.",
  },
  {
    id: "synonym-finder",
    icon: "wordexplorer",
    href: "/tools/synonym-finder/",
    title: "Synonym Finder",
    h1: "Synonym Finder",
    metaTitle: "Synonym Finder - Find Synonyms for Any Word",
    metaDescription:
      "Find synonyms and similar words for any English word. A fast, clean synonym finder for writing, vocabulary, and finding the right word.",
    intro:
      "Enter a word to find synonyms and closely related words — useful for writing, paraphrasing, and building vocabulary.",
    answer:
      "A synonym finder shows words with the same or similar meaning to the word you enter. Word Helper draws synonyms from an open language dataset so you can quickly find a clearer or stronger alternative.",
    primaryKeyword: "synonym finder",
    keywords:
      "synonym finder, synonyms, similar words, another word for, thesaurus",
    buttonLabel: "Find Synonyms",
    resultHeading: "Synonyms and similar words",
    emptyState:
      "Enter a word like \"happy\", \"important\", or \"fast\" to find synonyms and similar words.",
    noResultState:
      "No synonyms found for that word. Check the spelling, or try a more common base form of the word.",
    examples: [
      { label: "happy", value: "happy", note: "glad, joyful, content, cheerful" },
      { label: "important", value: "important", note: "significant, crucial, vital" },
      { label: "fast", value: "fast", note: "quick, rapid, swift, speedy" },
    ],
    how: [
      "Enter a single word and Word Helper looks up words with a similar meaning.",
      "Synonyms are ranked roughly by how closely they match, with the strongest first.",
      "The best synonym depends on context — tone, formality, and shade of meaning all matter.",
      "Copy any synonym with one click, or look it up in Word Explorer to read its full definition, pronunciation, and examples.",
    ],
    tips: [
      "Read a synonym in your sentence before using it — close meanings still differ in tone.",
      "Use the base form of a word (e.g. \"run\" rather than \"running\") for the best results.",
      "Pair this with the Antonym Finder to contrast meanings while you write.",
    ],
    faqs: [
      {
        q: "How do I find a synonym for a word?",
        a: "Type the word and run the tool. Word Helper returns words with a similar meaning, with the closest matches first.",
      },
      {
        q: "Where do the synonyms come from?",
        a: "Synonyms are drawn from an open, freely licensed language dataset (the Datamuse API, which builds on open thesaurus and corpus data).",
      },
      {
        q: "Why are some synonyms only loosely related?",
        a: "Language rarely has perfect synonyms. Some results are close in meaning rather than exact, so always check the word in your own sentence.",
      },
    ],
    related: ["/tools/antonym-finder/", "/tools/rhyme-finder/", "/word-explorer/"],
    disclaimer:
      "Synonyms are suggestions, not exact equivalents. Meaning, tone, and formality can differ — confirm the word fits your context.",
  },
  {
    id: "antonym-finder",
    icon: "rhyme",
    href: "/tools/antonym-finder/",
    title: "Antonym Finder",
    h1: "Antonym Finder",
    metaTitle: "Antonym Finder - Find Opposites of Any Word",
    metaDescription:
      "Find antonyms and opposite words for any English word. A clean, fast antonym finder for writing, vocabulary, and clear contrast.",
    intro:
      "Enter a word to find its antonyms — the opposite words that sharpen contrast in your writing.",
    answer:
      "An antonym finder shows words that mean the opposite of the word you enter. Word Helper draws antonyms from an open language dataset to help you find precise contrast for writing and study.",
    primaryKeyword: "antonym finder",
    keywords:
      "antonym finder, antonyms, opposite words, opposite of, word opposites",
    buttonLabel: "Find Antonyms",
    resultHeading: "Antonyms and opposites",
    emptyState:
      "Enter a word like \"happy\", \"open\", or \"increase\" to find its opposites.",
    noResultState:
      "No antonyms found for that word. Many words have no direct opposite — try a more common word or its base form.",
    examples: [
      { label: "happy", value: "happy", note: "sad, unhappy, miserable" },
      { label: "open", value: "open", note: "closed, shut" },
      { label: "increase", value: "increase", note: "decrease, reduce" },
    ],
    how: [
      "Enter a single word and Word Helper looks up words with the opposite meaning.",
      "Not every word has a clean opposite — abstract and technical words often have none.",
      "Antonyms are most useful for adjectives, common verbs, and directional words.",
      "Copy any antonym with one click, or look it up in Word Explorer to read its full definition, pronunciation, and examples.",
    ],
    tips: [
      "Use the base form of a word for the clearest opposites.",
      "If a word has no direct antonym, try a related word that does.",
      "Pair this with the Synonym Finder to map a word's full range of meaning.",
    ],
    faqs: [
      {
        q: "How do I find the opposite of a word?",
        a: "Type the word and run the tool. Word Helper returns words with the opposite meaning, where one exists.",
      },
      {
        q: "Why do some words return no antonyms?",
        a: "Many words — especially nouns and technical terms — have no true opposite. Antonyms are most common for adjectives and directional verbs.",
      },
      {
        q: "Where do the antonyms come from?",
        a: "Antonyms are drawn from an open, freely licensed language dataset (the Datamuse API, which builds on open thesaurus and corpus data).",
      },
    ],
    related: ["/tools/synonym-finder/", "/tools/rhyme-finder/", "/word-explorer/"],
    disclaimer:
      "Antonyms are suggestions. Opposite meaning depends on context, so confirm the word fits the contrast you intend.",
  },
  {
    id: "word-counter",
    icon: "syllable",
    href: "/tools/word-counter/",
    title: "Word Counter",
    h1: "Word Counter",
    metaTitle: "Word Counter - Count Words, Characters & Reading Time",
    metaDescription:
      "Paste text to count words, characters, sentences, paragraphs, and estimated reading time. A fast, private word counter that runs in your browser.",
    intro:
      "Paste or type text to see word count, character count, sentences, paragraphs, and estimated reading time.",
    answer:
      "A word counter measures the length of your text. Paste anything in and Word Helper counts words, characters (with and without spaces), sentences, paragraphs, and gives an estimated reading time. Everything runs in your browser — your text is never sent anywhere.",
    primaryKeyword: "word counter",
    keywords:
      "word counter, character counter, count words, word count tool, reading time",
    buttonLabel: "Count Text",
    resultHeading: "Your text at a glance",
    emptyState:
      "Paste or type text above to count words, characters, sentences, paragraphs, and reading time.",
    noResultState:
      "Add some text to count.",
    examples: [
      { label: "Short paragraph", value: "Word Helper is a fast, private word counter. It runs entirely in your browser, so your text never leaves your device.", note: "Counts words, characters, and reading time." },
      { label: "Social post", value: "Just finished my first 5k run! Three months ago I couldn't jog to the end of the street. Small steps every day really do add up. #running #progress", note: "Check a caption against platform limits." },
      { label: "Article excerpt", value: "Vocabulary grows fastest when you meet new words in context. Reading widely exposes you to words you would never study deliberately, and each encounter strengthens the memory of words you already half-know. That is why researchers consistently find that heavy readers have larger vocabularies than people who study word lists alone. The most effective approach combines both: read for breadth, then study the words that keep appearing.", note: "See reading and speaking time scale with length." },
    ],
    how: [
      "Words are counted as runs of letters, numbers, or apostrophes separated by spaces or punctuation.",
      "Characters are reported both with and without spaces.",
      "Sentences are estimated from end punctuation (. ! ?) and paragraphs from blank lines.",
      "Reading time assumes an average pace of about 200 words per minute.",
    ],
    tips: [
      "Use it to hit length limits for essays, meta descriptions, social posts, or abstracts.",
      "Check character counts for titles and bios with strict limits.",
      "Paste a draft to gauge reading time before publishing.",
    ],
    faqs: [
      {
        q: "Is my text sent to a server?",
        a: "No. The word counter runs entirely in your browser. Your text is never uploaded or stored.",
      },
      {
        q: "How is reading time calculated?",
        a: "Reading time is the word count divided by an average reading speed of about 200 words per minute, rounded to a friendly estimate.",
      },
      {
        q: "How are words counted?",
        a: "A word is a run of letters, numbers, or apostrophes. Spaces and punctuation separate words, so hyphenated terms may count as one or two depending on formatting.",
      },
    ],
    related: ["/tools/syllable-counter/", "/tools/word-finder/", "/word-lists/"],
    disclaimer:
      "Counts are estimates. Sentence and paragraph detection depends on punctuation and spacing, and reading time varies by reader and content.",
  },
  {
    id: "random-word-generator",
    icon: "spark",
    href: "/tools/random-word-generator/",
    title: "Random Word Generator",
    h1: "Random Word Generator",
    metaTitle: "Random Word Generator - Get Random English Words",
    metaDescription:
      "Generate random English words for brainstorming, games, writing prompts, and warm-ups. Filter by length and starting letter, then generate as many as you need.",
    intro:
      "Generate random English words — optionally filtered by length and starting letter — for prompts, games, and brainstorming.",
    answer:
      "A random word generator gives you unpredictable English words on demand. Word Helper draws from an in-browser dictionary of more than 90,000 English words and lets you filter by length and starting letter, which is handy for writing prompts, word games, brainstorming, and vocabulary practice.",
    primaryKeyword: "random word generator",
    keywords:
      "random word generator, random words, word generator, random english word, writing prompt words",
    buttonLabel: "Generate Words",
    resultHeading: "Your random words",
    emptyState:
      "Choose how many words you want (and optional filters), then generate.",
    noResultState:
      "No words matched those filters. Try a wider length range or a different starting letter.",
    examples: [
      { label: "10 words", value: "10", note: "Generate ten random words." },
      { label: "5 words", value: "5", note: "Generate five random words." },
    ],
    how: [
      "Word Helper picks words at random from an in-browser English dictionary of more than 90,000 words.",
      "The count control sets how many words you get (up to 50 at a time).",
      "Optional filters limit results by length range and starting letter.",
      "Generate again any time for a fresh set.",
    ],
    tips: [
      "Use it for daily writing prompts or creative warm-ups.",
      "Generate themed sets by setting a starting letter for word games.",
      "Pair short random words with the Anagram Solver or Rhyme Finder.",
    ],
    faqs: [
      {
        q: "Where do the random words come from?",
        a: "From an in-browser dictionary of more than 90,000 English words, drawn from the public-domain ENABLE word list, a supplementary word list, and Word Helper's published word pages.",
      },
      {
        q: "Can I control the words I get?",
        a: "Yes. You can set how many words to generate and filter by length range and starting letter.",
      },
      {
        q: "Are the words always real English words?",
        a: "Yes — every result comes from the curated word list, though acceptance in a specific game dictionary can still vary.",
      },
    ],
    related: ["/tools/word-finder/", "/tools/word-unscramble/", "/tools/rhyme-finder/"],
    disclaimer:
      "Words come from the public-domain ENABLE word list plus a supplementary system list, which can differ from a specific game's official dictionary.",
  },
];

export const hubs = [
  {
    href: "/word-games/",
    icon: "games",
    title: "Word Games Hub",
    h1: "Word Game Tools — Solve Letters, Anagrams, and Patterns",
    metaTitle: "Word Game Helper — Unscramble Letters, Anagrams, and Patterns | Word Helper",
    metaDescription:
      "Comprehensive word game tools for unscrambling letters, solving exact and partial anagrams, finding words by pattern, and checking letter counts. Works for Scrabble, Wordle, crosswords, and any letter-based game.",
    answer:
      "Word Helper supports word-game play by turning letters and patterns into scannable word lists. Search by available letters, exact anagrams, starting letters, ending letters, or word length — then apply pattern filters to narrow results to what the board allows.",
    sections: [
      {
        heading: "Finding words from your rack",
        text: "Start with Word Unscramble when you have a set of letters on your rack. The tool checks exact letter counts, so a word only appears if your letters can actually build it. Duplicate letters are handled correctly: one tile cannot make a two-tile word unless a wildcard covers the gap. Enter your letters, scan the results grouped by length, and pick the highest-scoring option that fits the board.",
      },
      {
        heading: "Using board filters and pattern clues",
        text: "Most games give you fixed information: a required starting letter, a known word length, or a letter that must appear in a specific position. Use the starts-with, ends-with, contains, and length filters after your first broad search. This turns hundreds of results into a short, focused list that matches the board's constraints. The Prefix Finder and Suffix Finder are useful when you know part of the word but not the full answer.",
      },
      {
        heading: "Anagram clues and exact rearrangements",
        text: "Some games and puzzles expect every letter to be used exactly once. Anagram Solver's exact mode handles this: it finds only words that use every cleaned letter. Partial mode finds smaller valid words hiding inside a larger set — useful when a phrase or clue has playable words inside it.",
      },
      {
        heading: "Duplicate letters and word length strategy",
        text: "If your rack has two copies of a letter, words that need two of that letter are valid. If you only have one, they are not — unless a blank tile or wildcard stands in. Word Helper's wildcard support uses ? or * for unknown letters, so a rack with a blank tile can be searched accurately by substituting the unknown position.",
      },
    ],
    links: [
      "/tools/word-unscramble/",
      "/tools/anagram-solver/",
      "/tools/prefix-finder/",
      "/tools/suffix-finder/",
      "/guides/how-to-unscramble-letters/",
      "/guides/exact-anagram-vs-partial-anagram/",
      "/guides/use-word-helper-for-word-games/",
    ],
    faqs: [
      {
        q: "Which tool should I use for scrambled game letters?",
        a: "Use Word Unscramble for broad words-from-letters results, then add pattern filters if the game board gives you fixed letters or a required word length.",
      },
      {
        q: "When should I use the Anagram Solver instead of Word Unscramble?",
        a: "Use Anagram Solver when a clue or game rule expects every letter to be rearranged into another valid word. Use Word Unscramble when you want all buildable words regardless of whether every letter is used.",
      },
      {
        q: "Can prefix and suffix tools help with word games?",
        a: "Yes. Prefix Finder helps when you know the first letters of the answer. Suffix Finder helps when you know the ending. Both tools support length filters to match a known word size.",
      },
      {
        q: "How do I use a wildcard or blank tile?",
        a: "Enter ? or * in place of the unknown letter when searching with Word Unscramble. The wildcard fills the missing position so results include words that need that letter.",
      },
      {
        q: "Are Word Helper results accepted in every word game?",
        a: "Results come from the public-domain ENABLE word list. Different games use different official dictionaries, so confirm final answers in your game's accepted word source before playing.",
      },
    ],
  },
  {
    href: "/writing-tools/",
    icon: "writing",
    title: "Writing Tools Hub",
    h1: "Writing Tools — Rhymes, Rhythm, Word Choice, and Patterns",
    metaTitle: "Writing Tools — Rhymes, Syllables, Word Patterns for Writers | Word Helper",
    metaDescription:
      "Professional writing tools for finding rhyme ideas, checking syllable rhythm, exploring word patterns, and building stronger vocabulary. Designed for poets, songwriters, students, and content writers. Designed for poets, songwriters, students, and content writers.",
    answer:
      "Word Helper gives writers fast, focused support for rhyme ideas, sentence rhythm, vocabulary variation, and word patterns, with clean, relevant results. The tools accelerate drafting and complement a writer's own judgment on meaning, tone, and audience.",
    sections: [
      {
        heading: "Finding rhyme ideas that fit the meaning",
        text: "The Rhyme Finder groups results as perfect rhymes, near rhymes, and similar endings, so you can choose a word by sound AND by meaning. A perfect rhyme that breaks the sentence's logic is weaker than a near rhyme that fits naturally. Read rhyme options aloud before committing — what looks like a match on screen may not work in speech.",
      },
      {
        heading: "Checking sentence and line rhythm",
        text: "The Syllable Counter estimates the number of spoken beats in any word, sentence, or paragraph. Paste a full poem stanza, a song chorus, or a speech section and see where the rhythm shifts. The word-by-word breakdown lets you spot which word is making a line feel too long, too short, or oddly weighted.",
      },
      {
        heading: "Exploring word families and spelling patterns",
        text: "When writing feels repetitive, prefix and suffix tools help you find related forms. If you have used 'create' too often, looking at the create family — creation, creative, creativity, uncreative, recreate — gives you natural variation without changing the meaning. Exploring ending patterns like -ful, -less, and -ness also reveals vocabulary choices you may not have considered.",
      },
      {
        heading: "Word lists for vivid writing",
        text: "The Word Lists section includes a curated collection of strong action verbs, descriptive adjectives, and positive vocabulary — all with meanings and example sentences. Each list is curated for real writing contexts, from blog posts and academic work to creative fiction and captions.",
      },
    ],
    links: [
      "/tools/rhyme-finder/",
      "/tools/syllable-counter/",
      "/tools/prefix-finder/",
      "/tools/suffix-finder/",
      "/word-lists/",
      "/guides/perfect-rhymes-vs-near-rhymes/",
      "/guides/use-word-helper-for-poetry-and-lyrics/",
      "/guides/why-syllable-counts-can-vary/",
    ],
    faqs: [
      {
        q: "Which writing tool should I start with?",
        a: "Start with Rhyme Finder for end-of-line sounds, Syllable Counter for rhythm checks, and prefix or suffix tools for word variation. Word Lists are the best starting point if you need strong verbs or descriptive adjectives.",
      },
      {
        q: "Can Word Helper help with song lyrics?",
        a: "Yes. Rhyme Finder's near-rhyme results are particularly useful for lyrics because they give natural-sounding options that don't feel forced. Syllable Counter helps you match a line's beat to the music.",
      },
      {
        q: "Can Word Helper help with poetry and haiku?",
        a: "Yes. Syllable Counter can estimate syllable counts for haiku (5–7–5), sonnet lines, and other metrical forms. Rhyme Finder supports end rhymes, and the Learn English guide on how syllables work explains open and closed syllables.",
      },
      {
        q: "Do these tools replace editing?",
        a: "No. They give you fast, well-organised options so you can decide quickly. The final word choice is still yours, guided by meaning, tone, and audience.",
      },
      {
        q: "Can I use these tools for captions and social media?",
        a: "Yes. Short lines that rhyme or have strong rhythm often perform better as captions. Rhyme Finder and Syllable Counter are both fast enough to test multiple options quickly.",
      },
    ],
  },
  {
    href: "/rhyming-words/",
    icon: "rhyme",
    title: "Rhyming Words and Rhythm",
    h1: "Rhyming Words — Find Rhymes and Check Line Rhythm",
    metaTitle: "Rhyming Words — Perfect Rhymes, Near Rhymes, and Syllable Rhythm | Word Helper",
    metaDescription:
      "Find rhyming words for any English word. Compare perfect rhymes, near rhymes, and similar endings. Check syllable counts for poem and lyric rhythm.",
    answer:
      "Word Helper helps with rhyme and rhythm by pairing rhyme ideas with syllable counts. That makes it easier to test both the ending sound and the beat count of a line at the same time — important for poems, lyrics, captions, and spoken word.",
    sections: [
      {
        heading: "Perfect rhymes, near rhymes, and similar endings",
        text: "Perfect rhymes share identical ending sounds from the vowel onwards: light and night, dream and stream. They create strong sonic closure and work well in chorus lines or final couplets. Near rhymes — also called slant rhymes or half rhymes — share some sound without matching exactly: love and move, hope and slope. They are widely used in modern lyrics because they sound natural rather than forced. Similar ending spellings are a brainstorming starting point, but they should always be checked aloud because English spelling and pronunciation often differ.",
      },
      {
        heading: "Why syllable count and rhyme work together",
        text: "A rhyme that adds the wrong number of syllables can break a meter that was working. If a poem line runs at 10 syllables and the only available perfect rhyme is a 3-syllable word that pushes the count to 12, the rhythm collapses even though the sound was right. Use the Syllable Counter alongside Rhyme Finder to catch this early: test the rhyme candidate in the full line, count the beats, and adjust.",
      },
      {
        heading: "Near rhymes in songs and rap",
        text: "Near rhymes dominate modern songwriting for practical reasons. English has a limited number of common perfect rhymes for many words. Forcing a perfect rhyme often means choosing a word that fits the sound but not the meaning or the emotional register of the line. Near rhymes give the writer flexibility: the listener feels the rhyme without the word feeling artificial. The Rhyme Finder returns near-rhyme suggestions alongside perfect matches so you can compare both types quickly.",
      },
      {
        heading: "Classroom and educational use",
        text: "Rhyme and syllable tools are useful in classroom settings for teaching poetry meter, practicing pronunciation, helping students hear the stress patterns in English words, and supporting creative writing across age groups. Each tool notes how pronunciation and accent affect results, giving educators an authoritative basis for classroom discussion of how English actually sounds across regions.",
      },
    ],
    links: [
      "/tools/rhyme-finder/",
      "/tools/syllable-counter/",
      "/guides/perfect-rhymes-vs-near-rhymes/",
      "/guides/why-syllable-counts-can-vary/",
      "/guides/use-word-helper-for-poetry-and-lyrics/",
      "/learn-english/how-rhyme-works/",
      "/learn-english/how-syllables-work/",
    ],
    faqs: [
      {
        q: "What words rhyme with night?",
        a: "Perfect rhymes for night include light, right, sight, fight, tight, bright, flight, slight, and might. Near rhymes include words like write, bite, and bite.",
      },
      {
        q: "Should I always choose a perfect rhyme?",
        a: "No. A near rhyme that fits the sentence's meaning and tone is often stronger than a forced perfect rhyme that sounds correct but breaks the logic of the line.",
      },
      {
        q: "Why should I count syllables alongside rhymes?",
        a: "A rhyme that adds too many or too few syllables can break the meter of a poem or song. Checking syllable count ensures the rhyme works for both sound and rhythm.",
      },
      {
        q: "Do similar spelling endings always rhyme?",
        a: "No. English spelling does not always match pronunciation. Words like 'love' and 'prove' look like they should rhyme but do not. Always read candidate rhymes aloud before using them.",
      },
      {
        q: "How many syllables does a haiku line have?",
        a: "Traditional English haiku follows a 5–7–5 syllable pattern. The Syllable Counter tool can estimate syllables for individual lines to help you hit those targets.",
      },
    ],
  },
  {
    href: "/vocabulary/",
    icon: "vocabulary",
    title: "Vocabulary Learning Hub",
    h1: "Vocabulary — Build, Explore, and Practice English Words",
    metaTitle: "Vocabulary Tools — Word Families, Prefixes, Suffixes, and Practice | Word Helper",
    metaDescription:
      "Build English vocabulary with word family exploration, prefix and suffix tools, curated word lists, learning guides, and vocabulary quizzes. Useful for learners, students, and teachers.",
    answer:
      "Word Helper supports vocabulary learning through connected tools: word family pages in Word Explorer, prefix and suffix pattern tools, hand-curated word lists with meanings and examples, eight practical learning guides, and vocabulary quizzes. Every component is designed to move a word from recognition into active use.",
    sections: [
      {
        heading: "Word families: learn one root, gain five words",
        text: "Every word page in Word Explorer includes a word family section showing noun, verb, adjective, and adverb forms with their parts of speech. Learning that 'achieve' connects to 'achievement', 'achievable', 'achiever', and 'overachieve' gives you access to five words for the work of learning one. Use Word Explorer pages as the starting point for family-based vocabulary learning, then move to the prefix and suffix tools to explore related patterns further.",
      },
      {
        heading: "Prefix and suffix patterns",
        text: "The Prefix Finder and Suffix Finder let you explore word-starting and word-ending patterns. Prefixes like un-, re-, pre-, dis-, mis-, and over- appear in hundreds of common words. Suffixes like -tion, -ness, -ful, -less, -able, and -ment signal the grammatical role of a word. Studying these patterns helps learners understand unfamiliar words, make educated guesses from context, and improve spelling accuracy.",
      },
      {
        heading: "Curated word lists for focused learning",
        text: "Word Lists are hand-curated collections of words grouped by theme: common English vocabulary, positive words, academic English, strong action verbs, and descriptive adjectives. Each entry includes the word, its part of speech, a plain-English meaning, and an example sentence. Thematic word learning is more durable than random list memorisation because each word sits in a mental framework that makes recall faster.",
      },
      {
        heading: "Practice quizzes and spaced review",
        text: "The Practice section contains vocabulary quizzes built from Word Explorer definitions. You see a definition and choose the correct word from four options, with instant feedback. Use the quizzes as a spaced review tool: look up a word in Word Explorer, read its full page, then test yourself in Practice to confirm that the word has moved into active memory.",
      },
      {
        heading: "Learning guides for vocabulary strategy",
        text: "The Learn English section includes eight practical guides covering how to build your vocabulary, how word roots work, how syllables affect pronunciation, how to use context clues, common spelling patterns, word families, and memory techniques. These guides offer specific strategies, worked examples, and links to the relevant Word Helper tools.",
      },
    ],
    links: [
      "/tools/prefix-finder/",
      "/tools/suffix-finder/",
      "/tools/word-unscramble/",
      "/tools/anagram-solver/",
      "/word-explorer/",
      "/word-lists/",
      "/learn-english/",
      "/practice/",
      "/learn-english/how-to-build-your-vocabulary/",
      "/learn-english/understanding-word-roots-prefixes-suffixes/",
      "/learn-english/understanding-word-families/",
    ],
    faqs: [
      {
        q: "How can prefixes and suffixes help vocabulary learning?",
        a: "Knowing 20 common prefixes and 15 common suffixes gives you a decoding key for thousands of unfamiliar words. Learners who understand that un- means 'not' and -less means 'without' can make reasonable guesses about words they have never seen before.",
      },
      {
        q: "Are all prefix matches in the Prefix Finder real grammar prefixes?",
        a: "No. The tool matches starting letters exactly. Some matches are meaningful prefix patterns; others only share the same spelling. Word Helper makes this distinction clear on every prefix page so learners understand exactly what each match represents.",
      },
      {
        q: "How many words should I study per day?",
        a: "Five to ten new words per day in context is a manageable target. Quality matters more than quantity. A word understood deeply and tested actively is worth more than twenty words seen passively on a list.",
      },
      {
        q: "Can students use Word Helper in class?",
        a: "Yes. Tools are useful for vocabulary warmups, spelling pattern exploration, and word family discovery. Word lists work well for classroom discussion, and the quizzes can be used for low-pressure vocabulary checks.",
      },
      {
        q: "How is Word Helper different from a standard dictionary?",
        a: "Word Explorer pages bring together pronunciation, syllable breakdowns, word families, synonyms, and example sentences from openly licensed lexical sources, standardized into one clean format. The tools then add interactive capabilities a static dictionary cannot: live letter unscrambling, rhyme suggestion, syllable counting, and pattern-based word search.",
      },
    ],
  },
  {
    href: "/spelling-patterns/",
    icon: "patterns",
    title: "Spelling Patterns Hub",
    h1: "Spelling Patterns — Words by Start, End, and Letter Pattern",
    metaTitle: "Spelling Patterns — Words by Prefix, Suffix, and Letter Pattern | Word Helper",
    metaDescription:
      "Explore English spelling patterns with Prefix Finder and Suffix Finder. Browse words by starting letters, ending letters, common prefixes, and common suffixes. Useful for learners, teachers, and word game players.",
    answer:
      "Word Helper makes English spelling patterns accessible by grouping words that share starting or ending letters. Prefix Finder and Suffix Finder draw from an in-browser dictionary of more than 90,000 English words to show what words follow each pattern — useful for spelling study, word game clues, vocabulary exploration, and classroom practice.",
    sections: [
      {
        heading: "Words that start with a pattern",
        text: "Use Prefix Finder when you know the beginning of a word but not the full answer, or when you want to study a common starting pattern. Enter two or more letters and see all words that begin with that exact sequence. Shorter prefixes return broader lists; adding more letters narrows to specific families. The tool is useful for word games where a board gives you the first letter or letters of a required word.",
      },
      {
        heading: "Words that end with a pattern",
        text: "Use Suffix Finder when you know a word's ending or want to compare words with the same spelling ending. Common endings like -ing, -tion, -ness, -less, -able, and -ible each signal something about a word's grammatical role. Exploring words that end with -tion helps learners recognise the /shun/ sound in noun forms and understand when to choose -sion over -tion.",
      },
      {
        heading: "Spelling patterns versus grammar rules",
        text: "Spelling patterns and grammar rules overlap but are not the same. A word that ends in -ing may be a present participle, a gerund, or simply a word that happens to end with those letters. Word Helper labels its matching as letter-based throughout, so learners understand the difference between a spelling pattern observation and a grammar claim.",
      },
      {
        heading: "Common English spelling patterns to know",
        text: "The most consistent patterns include: the silent-e rule (hop becomes hope; kit becomes kite), consonant doubling before a vowel suffix (run becomes running), vowel digraphs (ea in beach, oa in boat), the ie vs ei split, and common noun endings (-tion, -sion, -ness, -ment). The Learn English guide on common spelling patterns covers each of these with rules, examples, and the exceptions worth memorising.",
      },
    ],
    links: [
      "/tools/prefix-finder/",
      "/tools/suffix-finder/",
      "/vocabulary/",
      "/guides/prefixes-and-suffixes-build-vocabulary/",
      "/learn-english/common-spelling-patterns/",
      "/learn-english/understanding-word-roots-prefixes-suffixes/",
    ],
    faqs: [
      {
        q: "What is a spelling pattern in English?",
        a: "A spelling pattern is a repeated letter arrangement that appears across many words, such as words that start with pre- or end with -tion. These patterns are useful for learning, spelling, and word-game play.",
      },
      {
        q: "Can a spelling pattern differ from a grammar suffix?",
        a: "Yes. A word can share ending letters without using those letters as a grammatical suffix. For example, 'ring' ends in -ing but is not a present participle — it is a noun. Word Helper makes this distinction clear.",
      },
      {
        q: "Which tools are best for spelling pattern practice?",
        a: "Use Prefix Finder for starting-letter patterns and Suffix Finder for ending-letter patterns. Both support length filters so you can focus on words of a specific size.",
      },
      {
        q: "How can spelling patterns help with word games?",
        a: "When a game clue gives you the start or end of a word, pattern tools turn a vague hint into a focused list of candidates that fit the known letters.",
      },
      {
        q: "Are there guides for learning spelling patterns?",
        a: "Yes. The Learn English guide on common spelling patterns covers the silent-e rule, vowel digraphs, consonant doubling, ie vs ei, and common word endings with examples and the key exceptions.",
      },
    ],
  },
  {
    href: "/guides/",
    icon: "guides",
    title: "Word Helper Guides",
    h1: "Word Helper Guides — Practical Word Tool Tutorials",
    metaTitle: "Word Helper Guides — Practical Tutorials for Word Tools and English | Word Helper",
    metaDescription:
      "Read practical guides for unscrambling letters, solving anagrams, choosing rhymes, counting syllables, understanding prefixes and suffixes, and using Word Helper tools for games, poetry, and writing.",
    answer:
      "Word Helper guides explain how to use word tools in real situations — from game letters and anagram clues to rhyme choices and syllable rhythm. Each guide answers a specific practical question, gives worked examples, and links to the relevant tools.",
    sections: [
      {
        heading: "Tool guides: when and how to use each tool",
        text: "Each tool guide explains the right situation for using that tool, shows what good and bad inputs look like, explains how to read results, and points out where the tool's limits apply. The guides for word unscrambling, anagram solving, and word game strategy are written for players who want fast, accurate results — not a generic 'enter letters and press search' walkthrough.",
      },
      {
        heading: "Craft guides: rhyme, syllables, and writing",
        text: "The rhyme and syllable guides explain how to choose between perfect and near rhymes, why syllable counts vary, how to use Word Helper for poem lines and lyrics, and how to test whether a rhyme works in context. These guides are intended for writers — poets, songwriters, students, and content creators — who want to understand the craft decisions behind word choice.",
      },
      {
        heading: "No filler — only practical answers",
        text: "Every guide in this section is written to answer a specific question that a real user has. No guide is longer than it needs to be. No guide repeats information from the tool page it links to. If a guide does not answer a useful question with useful examples and specific tool steps, it is not published.",
      },
    ],
    links: [
      "/guides/how-to-unscramble-letters/",
      "/guides/exact-anagram-vs-partial-anagram/",
      "/guides/perfect-rhymes-vs-near-rhymes/",
      "/guides/why-syllable-counts-can-vary/",
      "/guides/prefixes-and-suffixes-build-vocabulary/",
      "/guides/use-word-helper-for-word-games/",
      "/guides/use-word-helper-for-poetry-and-lyrics/",
      "/tools/word-unscramble/",
      "/tools/anagram-solver/",
      "/tools/rhyme-finder/",
      "/tools/syllable-counter/",
    ],
    faqs: [
      {
        q: "What do the Word Helper guides cover?",
        a: "The guides cover how to unscramble letters without guessing, the difference between exact and partial anagrams, how to choose between perfect and near rhymes, why syllable counts can vary, how prefixes and suffixes build vocabulary, word game strategies, and how to use Word Helper for poetry and lyrics.",
      },
      {
        q: "Are the guides tool tutorials or general writing advice?",
        a: "Both. Tool guides explain how to get the best results from a specific Word Helper tool. Craft guides explain the underlying language concepts — rhyme types, syllable stress, prefix meaning — with the Word Helper tools integrated as practical aids.",
      },
      {
        q: "Do the guides replace the tools?",
        a: "No. The guides help you understand when to use each tool, how to interpret results, and how to handle edge cases. They are meant to be read once, then used as a reference when a result seems unexpected.",
      },
      {
        q: "Are more guides planned?",
        a: "Yes, but only when a guide can answer a real question with useful, specific examples and tool steps. Quality guides that help real users get better results are added on a rolling basis.",
      },
    ],
  },
];

export const guides = [
  {
    href: "/guides/how-to-unscramble-letters/",
    title: "How to Unscramble Letters Without Guessing",
    h1: "How to Unscramble Letters Without Guessing",
    metaTitle: "How to Unscramble Letters Without Guessing",
    metaDescription:
      "Learn how to unscramble letters by checking letter counts, duplicate letters, patterns, and word length clues.",
    answer:
      "To unscramble letters without guessing, count the letters you have, look for fixed patterns, try likely word lengths, and reject any word that uses letters you do not have.",
    quickAnswer:
      "Skip random guessing: tally the letters in front of you, including repeats, apply any known position clues, work through the most likely word lengths, and throw out any candidate that demands a letter your set cannot supply.",
    body: [
      {
        heading: "Start with letter counts",
        text: "Every unscrambling problem comes down to one rule: a word is only possible if your letters can supply every letter it needs, duplicates included. Before you rearrange anything, write out your letters and note which ones repeat. That tally is your budget — any candidate word that overspends it is out, no matter how promising it looks.\n\nTake the letters S, E, T, A, L. STALE, SLATE, LEAST, TALES, and STEAL all work because each uses those five letters exactly once. LATTES does not, even though every letter in it appears in your set — it needs two Ts and you only have one. Duplicates cut both ways: a rack with two Es can build words with one E or two, but never three.\n\nA quick habit that prevents most errors: as you test a candidate, cross letters off your tally one by one. If you reach for a letter that is already crossed off, the word fails. This check takes seconds and beats staring at a jumble hoping something appears.",
      },
      {
        heading: "Use patterns after the first pass",
        text: "Do the broad search first: what words can these letters build at all? Only then apply whatever the board tells you about position. If the puzzle fixes a starting letter, an ending letter, or a letter that must appear somewhere, treat those as filters on your candidate list rather than constraints on your first pass. Narrowing too early makes you miss words.\n\nCertain patterns earn their keep in English. Endings like -ER, -ED, -ING, and -S account for a large share of longer words, and openings like RE-, UN-, and ST- are common too. If your letters include E and R, mentally set ER aside as an ending and ask what the remaining letters can form in front of it.\n\nWord length is a filter of its own. In games that reward long words, scan from the longest candidates down. In fixed-length puzzles, discard everything that is not the right size before you think about order at all.",
      },
      {
        heading: "Work through a real example",
        text: "Suppose your six letters are D, E, N, A, G, R. Step one: count them. Six letters, no duplicates, so every candidate must use each letter at most once.\n\nStep two: try the common endings. These letters include E and R, so set -ER aside and look at what D, A, N, G can form in front of it: DANG gives DANGER. Now try -EN instead, leaving D, A, G, R: GARD gives GARDEN. Two solid words already, and you never tested a random arrangement.\n\nThe same six letters also make GANDER and RANGED — four different six-letter words from one set. That is the payoff of the method: letter counts tell you what is possible, patterns tell you where to look, and the handful of arrangements left is small enough to test quickly.",
      },
      {
        heading: "Try Word Helper",
        text: "When you want the complete picture, type your letters into the Word Unscramble tool. It applies the same letter-count rule automatically, so every result is genuinely buildable from your set. Then scan the list by length, starting with the longest.\n\nIf one letter is unknown — a blank tile, or a smudged clue — use a wildcard to stand in for it, and the tool will try every letter in that position. And if your puzzle requires using every letter exactly once, switch to the Anagram Solver in exact mode: that is the difference between finding words hidden inside your letters and rearranging all of them.",
      },
    ],
    links: ["/tools/word-unscramble/", "/tools/anagram-solver/", "/word-games/"],
    faqs: [
      {
        q: "Should I search every possible letter order?",
        a: "No. A word list plus letter-frequency matching is faster and avoids invalid random arrangements.",
      },
      {
        q: "What if I do not know one letter?",
        a: "Use a wildcard in the Word Unscramble tool to represent the unknown letter.",
      },
    ],
  },
  {
    href: "/guides/exact-anagram-vs-partial-anagram/",
    title: "Exact Anagram vs Partial Anagram: What Is the Difference?",
    h1: "Exact Anagram vs Partial Anagram: What Is the Difference?",
    metaTitle: "Exact Anagram vs Partial Anagram — Definition, Examples, and When to Use Each",
    metaDescription:
      "Understand the difference between exact and partial anagrams. Includes worked examples, when to switch modes, how Word Helper handles punctuation and spaces, and tips for games and puzzles.",
    answer:
      "An exact anagram rearranges every letter of a word or phrase exactly once to make a new valid word or phrase. A partial anagram uses some but not necessarily all of the letters to find smaller valid words. Exact mode is correct for classic anagram clues; partial mode is useful when a longer set of letters contains playable or hidden words.",
    quickAnswer:
      "In an exact anagram, all of the input's letters are reshuffled and each one is used exactly once to form a new valid word or phrase; a partial anagram builds valid words from just a subset of those letters. Choose exact mode for traditional anagram clues, and partial mode when a longer set of letters is hiding shorter playable words.",
    body: [
      {
        heading: "What makes an anagram exact?",
        text: "An exact anagram uses every letter of the input exactly once — nothing left over, nothing repeated. The classic example is 'listen': its six letters rearrange into 'silent', 'enlist', 'tinsel', and 'inlets', each a six-letter word built from L, I, S, T, E, N in a different order.\n\nExact anagrams are strict about letter counts, not just which letters appear. Add a single S to make 'listens' and the old answers all fail — the valid rearrangements become seven-letter words like 'enlists' and 'tinsels'. This is why checking an exact anagram means counting each letter on both sides, not just eyeballing them.",
      },
      {
        heading: "What makes an anagram partial?",
        text: "A partial anagram uses some of the available letters rather than all of them. Enter 'dormitory' and partial mode surfaces 'dirty', 'dorm', 'trod', 'motor', 'moody', and dozens of other shorter words — each one buildable from the letters D, O, R, M, I, T, O, R, Y without needing every one.\n\nThe rule is 'at most this many of each letter', not 'exactly this many'. You can use both Os in 'dormitory' ('moody' does), but you cannot use a letter the input does not contain — there is no P, so 'drip' is out. In practice, partial mode is the same operation as broad word unscrambling: it lists every dictionary word buildable from your letters.",
      },
      {
        heading: "When to use exact mode",
        text: "Use exact mode whenever the puzzle expects a complete rearrangement. Cryptic crossword clues usually work this way: a clue asking you to rearrange STONE into a musical sound wants 'TONES' — five letters in, five letters out. Name anagrams and phrase puzzles ('astronomer' becoming 'moon starer') follow the same rule.\n\nExact mode is also a quick existence check. If you suspect a set of letters hides a full rearrangement, running exact mode tells you immediately whether one exists in the dictionary — and if the list comes back empty, you know to stop hunting for one.",
      },
      {
        heading: "When to use partial mode",
        text: "Partial mode fits any situation where you hold more letters than you need. A seven-letter rack in a word game rarely spells one perfect word, but it almost always contains playable threes, fours, and fives — partial mode lists them all, and you can scan by length to find the highest-scoring option that fits the board.\n\nIt is also the right fallback when exact mode returns nothing. Many letter combinations, especially short or consonant-heavy ones, have no full-length rearrangement at all. Switching to partial mode salvages the search by showing every smaller word the letters can still make.",
      },
      {
        heading: "How Word Helper handles spaces and punctuation",
        text: "Word Helper's Anagram Solver strips spaces and punctuation before comparing letters, so you can paste a phrase and the tool pools all its letters together. 'A gentleman' becomes the ten letters AGENTLEMAN — which rearrange exactly into 'elegant man', one of the best-known phrase anagrams in English.\n\nThe same normalisation makes longer phrase anagrams checkable. 'Election results' and 'Lies — let's recount' look nothing alike on the page, but strip the spaces, apostrophe, and dash and both reduce to the same fifteen letters. The solver does that cleanup first, then applies whichever mode you chose.",
      },
      {
        heading: "Comparing exact and partial: a worked example",
        text: "Take 'stone' and run it through both modes. Exact mode returns only true rearrangements of all five letters: 'tones', 'notes', 'onset', 'steno', and 'seton' (a surgical thread). Each uses S, T, O, N, E precisely once — count the letters in any answer and they match the input.\n\nSwitch to partial mode and the list grows sharply: 'tone', 'note', 'nose', 'nest', 'sent', 'eons', 'tons', 'ones', plus threes like 'net', 'ten', and 'set'. Every one is buildable from a subset of the five letters, but none is required to use them all.\n\nA practical habit: run exact mode first when the puzzle demands a full rearrangement, then drop to partial mode if the list is empty or you simply need more options. The two modes answer different questions — 'what is this word rearranged?' versus 'what can these letters build?'",
      },
    ],
    links: ["/tools/anagram-solver/", "/tools/word-unscramble/", "/word-games/", "/guides/how-to-unscramble-letters/"],
    faqs: [
      {
        q: "What is the difference between exact and partial anagram mode?",
        a: "Exact mode uses every letter exactly once and finds only words that are true rearrangements of the full input. Partial mode uses some of the letters and finds all valid words that can be built from a subset. Use exact for classic anagram clues; use partial for broad word-game letter searches.",
      },
      {
        q: "Does Word Helper remove spaces and punctuation from anagram inputs?",
        a: "Yes. The Anagram Solver strips spaces and punctuation before matching letters. This lets you enter phrases as well as single words.",
      },
      {
        q: "What are famous examples of exact anagrams?",
        a: "Classic examples include: listen/silent, astronomer/moon starer, conversation/voices rant on, dormitory/dirty room, and schoolmaster/the classroom. These all use every letter exactly once.",
      },
      {
        q: "Can a partial anagram use all the letters?",
        a: "Yes. A partial anagram can use all the letters if a matching word happens to need them all, but it is not required to do so. The constraint is 'at most this many of each letter', not 'exactly this many'.",
      },
      {
        q: "Why does exact mode sometimes return no results?",
        a: "Exact mode requires that every letter be used once to form a valid dictionary word. Many letter combinations — especially short or unusual ones — have no exact anagrams. Switching to partial mode usually finds smaller words, even when exact mode is empty.",
      },
    ],
  },
  {
    href: "/guides/perfect-rhymes-vs-near-rhymes/",
    title: "Perfect Rhymes vs Near Rhymes: How Writers Choose Better Rhymes",
    h1: "Perfect Rhymes vs Near Rhymes: Choosing Better Rhymes for Poems and Lyrics",
    metaTitle: "Perfect Rhymes vs Near Rhymes — How Writers Choose Better Rhymes",
    metaDescription:
      "Understand the difference between perfect rhymes and near rhymes. Learn when to use each, how near rhymes improve lyrics, and how to use the Rhyme Finder to explore both types.",
    answer:
      "A perfect rhyme matches the final vowel sound and all sounds after it exactly: light and night, dream and stream. A near rhyme — also called a slant rhyme or half rhyme — shares enough ending sound to feel connected but does not match precisely: love and move, home and storm. Near rhymes are widely used in modern lyrics because they sound natural rather than forced, giving writers more flexibility without breaking the rhythm.",
    quickAnswer:
      "In a perfect rhyme, the stressed vowel and every sound after it are identical — light/night, dream/stream — while a near rhyme (also called a slant or half rhyme) only comes close, like love/move or home/storm. Songwriters lean on near rhymes because they let a line keep its natural phrasing and rhythm instead of bending the meaning to force an exact sound match.",
    body: [
      {
        heading: "What makes a rhyme perfect?",
        text: "A perfect rhyme — also called an exact or true rhyme — matches every sound from the stressed vowel to the end of the word. 'Light' and 'night' both end in /aɪt/. 'Dream' and 'stream' both end in /iːm/. Only the opening sounds differ. The same rule covers longer words: 'borrow' and 'sorrow' match from the stressed vowel onwards, so they rhyme perfectly too.\n\nNote that this is about sound, not spelling. 'Through' and 'blue' look nothing alike on the page but rhyme perfectly in speech. Perfect rhymes deliver a strong sense of closure, which is why they anchor nursery rhymes, traditional ballads, and song choruses — places where the writer wants the ear to feel that a line has resolved.",
      },
      {
        heading: "What makes a rhyme near?",
        text: "A near rhyme — slant rhyme, half rhyme, off rhyme; the terms are interchangeable — shares part of the ending sound without matching all of it. Near rhymes usually fall into two families. In the first, the final consonant matches but the vowel drifts: 'love' and 'move' both end in /v/, but the vowels are /ʌ/ and /uː/. 'Worm' and 'form' work the same way. In the second, the vowel matches but the final consonant differs: 'home' and 'alone' share the /oʊ/ vowel but close on different nasal sounds.\n\nThe effect is connection without finality. A near rhyme signals that two lines belong together while leaving the sound slightly unresolved — which keeps a listener leaning forward rather than feeling the verse click shut.",
      },
      {
        heading: "Why near rhymes dominate modern lyrics",
        text: "English is short on perfect rhymes. 'Orange', 'purple', 'silver', and 'month' have no common perfect rhymes at all, and even everyday words often have only a handful. Insisting on a perfect match frequently means grabbing a word that fits the sound but bends the meaning — the moon/June problem that makes lyrics feel written backwards from the rhyme.\n\nNear rhymes remove that constraint. Emily Dickinson built whole poems on slant rhyme as a deliberate choice, and songwriters from Bob Dylan to Kendrick Lamar rhyme on vowel sounds far more often than on exact endings. When the sense of the line leads and the sound follows, the writing stays natural — and listeners rarely notice, or care, that the match is inexact.",
      },
      {
        heading: "Similar endings versus actual rhymes",
        text: "A third category — eye rhymes — is words that look like they should rhyme but do not sound alike. 'Love' and 'prove' both end in -ove but take different vowels. 'Word' and 'sword' share -ord on the page only. Some of these pairs genuinely rhymed centuries ago: Shakespeare closes Sonnet 116 on 'proved' and 'loved', and pronunciation has drifted apart since, which is why older poetry is full of rhymes that no longer work aloud.\n\nWord Helper's Rhyme Finder groups its results to keep these categories separate: perfect rhymes first, then near rhymes, then similar endings. Treat the last group as a brainstorming list, not a guarantee — a similar spelling is only a lead until your ear confirms it.",
      },
      {
        heading: "How to choose: a practical framework",
        text: "Try perfect rhymes first: if one carries the meaning you want, take it. If every perfect option distorts the line, move to near rhymes and pick the candidate that reads most naturally. Then test by ear — read the whole line aloud, not just the rhyming pair.\n\nHere is that process on a real line. Suppose your line ends on 'love'. The perfect rhymes are a short list: above, dove, glove, shove. A draft like 'I never needed proof of your love / it fits me like a glove' rhymes perfectly but lands on a cliché the rhyme forced into place. So widen to near rhymes that share the stressed /ʌ/ vowel — enough, touch, us — and revise: 'I never needed proof of your love / what you gave was more than enough.'\n\n'Love' and 'enough' end on /v/ and /f/, two sounds made with almost the same mouth shape, so the pair binds the couplet while the meaning stays honest. Read both versions aloud and the near rhyme wins — which is the whole point: rhyme serves the writing, not the other way round.",
      },
    ],
    links: ["/tools/rhyme-finder/", "/tools/syllable-counter/", "/rhyming-words/", "/learn-english/how-rhyme-works/", "/guides/use-word-helper-for-poetry-and-lyrics/"],
    faqs: [
      {
        q: "What is the difference between a perfect rhyme and a near rhyme?",
        a: "A perfect rhyme has an identical ending sound from the stressed vowel onwards: light/night, dream/stream. A near rhyme shares enough sound to feel connected but does not match exactly: love/move, hope/stop. Perfect rhymes are stronger sonically; near rhymes are often more natural in context.",
      },
      {
        q: "Are near rhymes acceptable in poetry?",
        a: "Yes, absolutely. Near rhymes — also called slant rhymes or half rhymes — are standard in modern poetry and lyrics. Emily Dickinson used slant rhyme throughout her work as a deliberate artistic choice. Most contemporary songwriters use near rhymes to avoid the forced, sing-song quality that can result from forcing perfect rhymes.",
      },
      {
        q: "What words have no perfect rhymes in English?",
        a: "Classic examples of words with no common perfect rhymes include: orange, purple, silver, month, and penguin. This is why near rhymes are especially important — forcing a perfect rhyme for these words often results in awkward or obscure choices.",
      },
      {
        q: "How does the Word Helper Rhyme Finder handle near rhymes?",
        a: "The Rhyme Finder returns results in groups: perfect rhymes first, then near rhymes, then similar endings. This lets you see the full range of options and choose based on meaning and context rather than just sound.",
      },
      {
        q: "Should I always read rhyme candidates aloud before using them?",
        a: "Yes. Rhyme is fundamentally about sound, not spelling. A candidate that looks like a rhyme may not sound like one, and a candidate that does not look related may sound surprisingly natural. Reading the full line aloud with the candidate word is the most reliable test.",
      },
    ],
  },
  {
    href: "/guides/why-syllable-counts-can-vary/",
    title: "Why Syllable Counts Can Vary by Accent",
    h1: "Why Syllable Counts Can Vary — Accent, Dialect, and Poetic Meter",
    metaTitle: "Why Syllable Counts Can Vary — Accent, Dialect, and Poetic Usage Explained",
    metaDescription:
      "Learn why syllable counts differ by accent, dialect, speech speed, and poetry. Includes examples of variable words, how to handle them in practice, and how to use the Syllable Counter tool effectively.",
    answer:
      "Syllable counts can vary because spoken English differs significantly by accent, dialect, region, and speech speed. The same word may be one syllable in one accent and two in another. Poetry adds further variation because poets can stretch or compress syllables to fit meter. A syllable counter gives a standard count based on standard English pronunciation; because accent, dialect, speech speed, and poetic meter shift the spoken count, confirm the final count by reading the line aloud.",
    quickAnswer:
      "Accent, region, and speaking pace all shape how English words are pronounced, so one speaker's two-syllable word can genuinely be another's three — and poets bend counts further to fit a meter. A syllable counter gives you a dependable standard estimate; saying the line aloud is how you settle the final count for your own accent and rhythm.",
    body: [
      {
        heading: "Why accent and dialect change the count",
        text: "English is spoken across dozens of distinct accent groups, and many of them give the same word a different number of beats. 'Caramel' is the classic case: many American speakers say CAR-muhl (two syllables), while others say CAR-uh-mel (three). 'Mirror' shrinks to something close to a single beat in parts of the American South. 'Poem' is two syllables in careful speech (POH-em) but drifts toward one in fast conversation.\n\nNone of these are errors — they are ordinary features of accent. That means any syllable count is really a count of one particular pronunciation, and the honest question is always: whose mouth are we counting? For most writing tasks a standard count works fine, but when the count decides whether a line scans, your accent is the one that matters.",
      },
      {
        heading: "How speech speed and connected speech affect counts",
        text: "Even within a single accent, speed changes the count. Linguists call the process elision: unstressed vowels get swallowed at conversational pace. 'Every' is three syllables spoken carefully (EV-er-y) and two in normal speech (EV-ry). 'Temperature' drops from four (TEM-per-a-ture) to three (TEM-pra-cher). 'Comfortable' is four beats read slowly and usually three (COMF-ter-ble) in relaxed talk.\n\nA syllable counter cannot hear you, so it returns one standard estimate per word, built from vowel-group patterns plus a list of known exceptions. Word Helper's counter, for example, uses the everyday two-beat count for 'every' but the careful four-beat count for 'temperature'. Expect small, predictable gaps between the tool's number and what you actually say — that is the nature of counting speech from spelling.",
      },
      {
        heading: "How poetry bends syllable counts",
        text: "Poets have always treated syllable counts as adjustable. Compression removes a beat to fit the meter: 'over' becomes 'o'er', 'ever' becomes 'e'er', and Milton wrote 'heaven' as 'Heav'n' throughout Paradise Lost to spend one beat instead of two. Expansion adds a beat by sounding an ending that is normally silent — most famously the '-èd' ending, where 'banished' (two beats in speech: BAN-isht) stretches to three (BAN-ish-èd) when a Shakespearean line needs the extra syllable, as it does in Romeo and Juliet.\n\nBoth moves run right through classical English verse, and both are still available to you. When you count syllables for a poem, treat the standard count as raw material: the meter of the line decides whether a flexible word gets its long or short reading.",
      },
      {
        heading: "Words where counts commonly vary",
        text: "A short list of words accounts for a large share of 'the counter disagrees with me' moments: 'interest' (2 or 3), 'different' (2 or 3), 'chocolate' (2 or 3), 'family' (2 or 3), 'camera' (2 or 3), 'evening' (2 or 3), 'favourite' (2 or 3), and 'separate' as an adjective (2 or 3). In each case the longer count is the careful, dictionary-style reading and the shorter one is what most speakers produce at normal speed.\n\nThe Syllable Counter returns a single estimate for each — it counts 'different' and 'chocolate' as three, for instance. When one of these words sits in a line you are measuring, test the line aloud with both counts and keep the one your ear accepts.",
      },
      {
        heading: "How to use the Syllable Counter effectively",
        text: "Paste your full line or stanza rather than checking words one at a time. The summary shows the total beat count, and the word-by-word breakdown shows where the beats sit — useful for spotting which word is making a line feel heavy. Here is a worked example with a haiku opening line: 'Every morning light'. The counter breaks it down as ev-ery (2) + morn-ing (2) + light (1) = 5 syllables, so the line fits a haiku's five-beat opening. But if you naturally pronounce 'every' with three full beats — EV-er-y — you will hear six, and the line no longer fits your own reading.\n\nThat is the check to run on any line that matters: get the tool's count, then say the line aloud at normal speed with a hand under your chin. Each chin drop is one syllable. If the ear count and the tool count disagree on a variable word, trust your ear for performance and the tool for consistency across a long draft.",
      },
    ],
    links: ["/tools/syllable-counter/", "/tools/rhyme-finder/", "/rhyming-words/", "/learn-english/how-syllables-work/", "/guides/use-word-helper-for-poetry-and-lyrics/"],
    faqs: [
      {
        q: "Why does the Syllable Counter give a different count than I expect?",
        a: "The tool estimates syllables based on vowel groups and common patterns. Your accent, speech speed, or the specific context of the word may result in a different spoken count. For words with variable pronunciation — like 'interest', 'different', or 'chocolate' — both counts can be correct depending on the speaker.",
      },
      {
        q: "How many syllables does 'comfortable' have?",
        a: "Careful pronunciation gives four syllables: COM-fort-a-ble. Relaxed natural speech often compresses this to three (COMF-ter-ble) or even two in very fast speech. For poetry, either count can be valid depending on the meter of the line.",
      },
      {
        q: "Can Word Helper count syllables in a full poem or paragraph?",
        a: "Yes. The Syllable Counter can estimate syllables for any amount of text — a word, a line, a stanza, or a full paragraph. The summary shows total syllables, word count, sentence count, and average syllables per word.",
      },
      {
        q: "Is there always one correct syllable count for a word?",
        a: "Not always. Accent, dialect, speech speed, and poetic usage can all affect the spoken syllable count. The Syllable Counter gives a standard estimate, but the correct count for your purpose — especially in poetry or song — depends on how the word is actually spoken in that context.",
      },
      {
        q: "How do poets adjust syllable counts for meter?",
        a: "Poets use elision (dropping a syllable: 'o'er' for 'over') and expansion (stretching a syllable: reading 'power' as two syllables). Both techniques were standard in classical English verse and remain available in modern poetry. A syllable counter gives the default count; the poet then adjusts based on the meter.",
      },
    ],
  },
  {
    href: "/guides/prefixes-and-suffixes-build-vocabulary/",
    title: "Prefixes and Suffixes Build Vocabulary",
    h1: "Prefixes and Suffixes: How Word Patterns Build Vocabulary",
    metaTitle: "Prefixes and Suffixes - How Word Patterns Build Vocabulary",
    metaDescription:
      "Use prefix and suffix patterns to study vocabulary families, spelling changes, and word formation.",
    answer:
      "Prefixes and suffixes help vocabulary learning by showing how word beginnings and endings can shape meaning, spelling, and part of speech.",
    quickAnswer:
      "Word beginnings and endings are a shortcut to vocabulary: a prefix usually shifts a word's meaning, while a suffix often changes its grammatical role and its spelling. Learn a handful of each and whole families of related words become readable at a glance.",
    body: [
      {
        heading: "Prefixes show beginnings",
        text: "A prefix is a short unit fixed to the front of a root word, and it usually changes meaning rather than grammar. Un- means 'not' or 'reverse', re- means 'again', mis- means 'wrongly', and pre- means 'before'. Because these meanings stay stable, one root can generate a whole family: from read you get reread (read again), misread (read wrongly), and unread (not yet read). Learn the prefix once and every new family member arrives half-decoded.\n\nTo study a prefix family, open the Prefix Finder and enter the starting letters — re, un, mis, or whatever pattern you are working on. The tool returns every word in its list that begins with those letters, and a length filter keeps the results manageable. Pick out the words where the prefix genuinely carries its meaning and note them together as a set; that grouping is what makes the vocabulary stick.",
      },
      {
        heading: "Suffixes show endings",
        text: "Suffixes do a different job: they usually change a word's part of speech. Watch one root move through the grammar. Care (a noun or verb) becomes careless or careful (adjectives), then carelessly and carefully (adverbs), then carelessness and carefulness (nouns again). Once you recognise -less, -ful, -ly, and -ness, you can place an unfamiliar word correctly in a sentence before you know precisely what it means.\n\nSuffixes also drive most of English's predictable spelling changes. A silent e usually drops before a vowel suffix (hope becomes hoping), a one-syllable word with a short vowel often doubles its final consonant (run becomes running), and a final y after a consonant changes to i (happy becomes happiness). The Suffix Finder lets you pull up every word ending in -ness or -able and compare the joins side by side — a faster way to absorb these rules than memorising them in the abstract.",
      },
      {
        heading: "A worked example: decoding 'unpredictable'",
        text: "Take a word that looks long and read it in parts: un + predict + able. The suffix -able means 'can be done', so predictable means 'can be predicted'. The prefix un- means 'not', so unpredictable means 'cannot be predicted'. The root splits further still — predict comes from Latin prae ('before') and dicere ('to say') — so the whole word unpacks to 'not able to be said in advance'. Three familiar pieces, and a thirteen-letter word needs no dictionary.\n\nThe same pieces rebuild the rest of the family: prediction (the -tion noun), predictably (the adverb), unpredictability (the abstract noun). When you meet any long unfamiliar word, run the same routine — strip a prefix from the front, strip a suffix from the end, and look at what remains. Even a rough decode of the root gets you close enough to confirm the exact meaning quickly.",
      },
      {
        heading: "Spelling is not always meaning",
        text: "A letter pattern can look like an affix without acting as one. Real, reach, and ready all begin with the letters r-e, but none of them means doing something again. Bless ends in -less but is not 'b' plus a suffix, and ring ends in the letters i-n-g even though they are part of the root, not an ending added to anything.\n\nThis is why Word Helper describes the matching in Prefix Finder and Suffix Finder as letter-based. The tools return every word that starts or ends with the letters you type; deciding which results genuinely use the prefix or suffix is your job as the learner. That sorting step is not a flaw in the method. Asking 'is re- doing real work in this word?' forces you to look at the root — and that habit, applied word after word, is exactly what builds vocabulary.",
      },
    ],
    links: ["/tools/prefix-finder/", "/tools/suffix-finder/", "/vocabulary/"],
    faqs: [
      {
        q: "Does every word beginning with re use the prefix re-?",
        a: "No. Some words only share the letters.",
      },
      {
        q: "Can suffix lists help spelling?",
        a: "Yes. Comparing words with the same ending helps learners notice patterns.",
      },
    ],
  },
  {
    href: "/guides/use-word-helper-for-word-games/",
    title: "How to Use Word Helper for Word Games",
    h1: "How to Use Word Helper for Word Games — A Practical Strategy Guide",
    metaTitle: "How to Use Word Helper for Word Games — Strategy and Tool Guide",
    metaDescription:
      "A practical guide to using Word Helper for word games: scrambled letters, anagram clues, starts-with patterns, ends-with clues, wildcards, and word length strategy.",
    answer:
      "For word games, start with the Word Unscramble tool using all available letters, then narrow results using length, starts-with, ends-with, and contains filters based on board clues. Use the Anagram Solver for exact rearrangement clues. Use wildcards for blank tiles or unknown letters. Always confirm final answers against your game's accepted word list before playing.",
    quickAnswer:
      "Begin by running every letter you hold through Word Unscramble with no filters, then trim the results with length, starts-with, ends-with, and contains filters that reflect what the board demands. Switch to the Anagram Solver when a clue needs every letter rearranged, type ? or * for blank tiles, and check any final answer against your game's own dictionary before playing it.",
    body: [
      {
        heading: "Step 1 — Enter all available letters first",
        text: "Open the Word Unscramble tool, type in every letter you hold, and run the search with no filters. This first pass builds your complete inventory — every valid word your rack can produce — before any board constraints enter the picture.\n\nSay your rack is A, E, I, N, R, S, T. The broad search returns seven-letter words such as NASTIER, RETAINS, and RETINAS, plus dozens of shorter options like TRAIN and RINSE. Each of those long words uses all seven letters exactly once.\n\nScan the results by length, longest group first. Longer words usually score more, and it is easier to fall back to a shorter word than to spot a long one you skipped.",
      },
      {
        heading: "Step 2 — Add board constraints as filters",
        text: "Now translate the board into filters. A fixed opening letter becomes a starts-with filter; a required final letter becomes ends-with; a letter that must sit somewhere inside the word becomes contains; a fixed slot size becomes minimum and maximum length.\n\nContinuing the example: if the only open line forces your word to end in S, apply the ends-with filter. NASTIER drops out, while RETAINS and RETINAS survive as seven-letter candidates that fit both your rack and the board.\n\nAdd one constraint at a time. If the list suddenly empties, remove the last filter rather than starting over.",
      },
      {
        heading: "Step 3 — Use wildcards for blank tiles",
        text: "Blank tiles can stand for any letter, and Word Helper handles them with wildcards. Type ? or * in the position of the blank or unknown letter, and the tool fills that slot with every letter that completes a valid word.\n\nSearching t?me, for example, returns TAME, TIME, and TOME — three different words unlocked by the same blank in the second position.\n\nBefore you commit, check whether the blank opens a longer word elsewhere in your results. A blank spent on a three-letter word is often a blank wasted.",
      },
      {
        heading: "Step 4 — Switch to Anagram Solver for clue-based puzzles",
        text: "Cryptic crossword anagram clues — and some puzzle games — require every letter to be rearranged into one complete word. That is a job for the Anagram Solver in exact mode, which only returns words that use each letter exactly once.\n\nFeed it LISTEN and exact mode returns SILENT, ENLIST, TINSEL, and INLETS — all four rearrange the same six letters. Word Unscramble would also list shorter words like NEST and LINE, which are wrong answers for this clue type.\n\nIf exact mode comes back empty, switch to partial mode to find shorter words hidden inside the letters, or return to Word Unscramble with the full set.",
      },
      {
        heading: "Step 5 — Verify results against the game's dictionary",
        text: "Word Helper searches the public-domain ENABLE word list — large and comprehensive, but not the official dictionary of any particular game. Scrabble uses TWL or Collins SOWPODS depending on where you play, Wordle draws from its own curated list, and other games maintain their own databases.\n\nThat means a word in your results may still be rejected in-game. Treat every search as a shortlist of candidates, and confirm the final answer against the game's accepted list before you play it — especially in competitive settings, where a rejected word can cost you a turn.",
      },
      {
        heading: "Prefix and suffix tools for partial-information clues",
        text: "When you know how a word starts but not how it ends, switch to the Prefix Finder: enter the confirmed opening letters and browse everything that begins with them. The Suffix Finder does the same for known endings, and both support length filters.\n\nThis combination suits reveal-as-you-go games like Wordle. If you have confirmed a five-letter word starting with STA, the Prefix Finder with 'sta' and a length of five produces candidates such as STARE, STAIR, STAND, and STACK — a short list to test against the letters you have already ruled in or out.\n\nNeither tool needs your full rack, which makes them the right choice whenever a puzzle gives you position information instead of letters.",
      },
    ],
    links: ["/tools/word-unscramble/", "/tools/anagram-solver/", "/tools/prefix-finder/", "/tools/suffix-finder/", "/word-games/", "/guides/how-to-unscramble-letters/", "/guides/exact-anagram-vs-partial-anagram/"],
    faqs: [
      {
        q: "Which Word Helper tool should I use for word game letters?",
        a: "Start with Word Unscramble for a broad inventory of buildable words. Use filters to narrow by length, starts-with, ends-with, or contains. Switch to Anagram Solver exact mode when a clue requires every letter to be used once. Use Prefix or Suffix Finder when you know part of the answer.",
      },
      {
        q: "How do I use a blank tile or wildcard with Word Helper?",
        a: "Enter ? or * in the position of the blank tile or unknown letter in the Word Unscramble search. The tool treats the wildcard as a flexible letter that can match any letter needed to complete a valid word.",
      },
      {
        q: "Are Word Helper results accepted in Scrabble?",
        a: "Word Helper uses the ENABLE word list, not the official Scrabble dictionaries (TWL or Collins SOWPODS). Results may overlap significantly but are not guaranteed to match. Always verify a word in your game's accepted dictionary before playing it competitively.",
      },
      {
        q: "What is the best strategy for getting high-scoring words in letter games?",
        a: "Run a broad unscramble search first, then review the longest word group — longer words typically score more. Check whether any long words align with bonus squares on the board. Use filters to find words that combine your high-value letters with whatever letters are already on the board.",
      },
      {
        q: "Can I search for words that contain a specific letter at a specific position?",
        a: "Yes. Use the 'contains' filter to specify a letter that must appear somewhere in the word. For a specific position, combine the starts-with and ends-with filters with a length filter to narrow candidates to words of the right size with the right letters at the ends.",
      },
    ],
  },
  {
    href: "/guides/use-word-helper-for-poetry-and-lyrics/",
    title: "How to Use Word Helper for Poetry and Lyrics",
    h1: "How to Use Word Helper for Poetry and Lyrics",
    metaTitle: "How to Use Word Helper for Poetry and Lyrics",
    metaDescription:
      "Use Word Helper to find rhymes, compare near rhymes, check syllables, and improve rhythm in poems and lyrics.",
    answer:
      "For poetry and lyrics, use Rhyme Finder for sound ideas and Syllable Counter to check whether the line rhythm still feels balanced.",
    quickAnswer:
      "When you're writing poems or song lyrics, gather sound options with the Rhyme Finder first, then run your lines through the Syllable Counter to confirm the rhythm still holds together. Sound and rhythm are separate checks — do both before settling on a line.",
    body: [
      {
        heading: "Find rhyme options first",
        text: "Start with the word you can't change — usually the one ending the line you like most. Type it into the Rhyme Finder and the results come back in three groups: perfect rhymes, near rhymes, and similar endings. Perfect rhymes share the full ending sound (moon, soon, noon). Near rhymes share the vowel but bend the final consonant (moon, room, bloom), which often sounds more conversational.\n\nUse the groups deliberately. Perfect rhymes work where you want the rhyme to land hard — a chorus hook, a punchline, the closing couplet of a poem. Near rhymes suit verses, where an exact match every time can start to feel sing-song. Skim both lists before committing to anything.\n\nThe tool runs in your browser from a curated word set and sound patterns, so treat the results as strong starting points rather than a complete inventory of English. When you want to scan a whole ending family at once, the browsable rhyming-words pages are built for exactly that.",
      },
      {
        heading: "Check the line rhythm",
        text: "A rhyme that fits the sound can still wreck the line if it changes the length. Paste your existing line and your new draft into the Syllable Counter and compare the totals. The word-by-word breakdown shows exactly where extra syllables crept in — often an adjective you added just to reach the rhyme.\n\nTwo caveats. The counter estimates spoken syllables, and sung lines can stretch or squeeze words, so your ear makes the final call. And matching the count isn't the whole job: where the stresses fall matters just as much as how many syllables there are. Read both lines aloud and tap the beats — if the emphasis lands on the wrong word, revise even when the numbers agree.",
      },
      {
        heading: "A worked example: finishing a couplet",
        text: "Say your opening line is \"The city sleeps below the moon.\" The Syllable Counter reads it as 8 syllables, so you need a second line that rhymes and keeps roughly that length.\n\nEnter \"moon\" into the Rhyme Finder. Perfect rhymes include soon, noon, and balloon; near rhymes include room and bloom. Drafting from those lists: \"and all the lights go out too soon\" is a perfect rhyme at exactly 8 syllables. Want a softer landing? \"And quiet fills my empty room\" is a near rhyme, also 8 syllables, with a more inward, unresolved feel.\n\nNeither option is the correct one — the perfect rhyme closes the couplet cleanly, while the near rhyme leaves it slightly open. That's the point of listing options before choosing: you're picking a mood, not just a matching sound.",
      },
      {
        heading: "Choose meaning over matching",
        text: "When two candidates both fit the rhythm, pick the one that says what the line actually means. \"Soon\" and \"room\" both scanned in the example above, but they push the couplet in different emotional directions. A technically perfect rhyme that says the wrong thing is a worse choice than a near rhyme that says the right one.\n\nIf every rhyme for your end word forces awkward phrasing, stop fighting the word. Rewrite the line so a friendlier word lands at the end instead — songwriters call this writing toward the rhyme. It's usually faster than forcing a clunky match, and the tools make it cheap to test: swap the end word, pull a fresh rhyme list, and re-count the syllables in under a minute.",
      },
    ],
    links: ["/tools/rhyme-finder/", "/tools/syllable-counter/", "/rhyming-words/"],
    faqs: [
      {
        q: "Do lyrics need perfect rhymes?",
        a: "No. Near rhymes are common and often sound more natural.",
      },
      {
        q: "Can a syllable counter write meter for me?",
        a: "No. It estimates counts so you can make better drafting choices.",
      },
    ],
  },
];

export const legalPages = [
  {
    href: "/about/",
    schemaType: "AboutPage",
    title: "About Word Helper",
    h1: "About Word Helper",
    metaTitle: "About Word Helper — A Complete Word Workspace",
    metaDescription:
      "Learn about Word Helper: the word tools, Word Explorer word pages, Learn English guides, Word Lists, Practice quizzes, and how content is created and reviewed.",
    bodyHtml: [
      `<h2>What Word Helper is</h2>
      <p>Word Helper is a fast word workspace built for every kind of word task — solving scrambled letters, finding rhymes, counting syllables, exploring word meanings, building vocabulary, and learning language patterns. Every section connects to the same word data and quality standard.</p>`,
      `<h2>Who runs Word Helper</h2>
      <p>Word Helper was created by <strong>Jay Sudha</strong>, also known as Shatanjay Sudha. Jay builds practical web tools, calculators, productivity systems, and educational utilities with a focus on clean design, useful content, and fast mobile-first experiences — and Word Helper follows the same philosophy: make useful word tools fast, clear, accessible, and easy to use on mobile. It is run independently and is not affiliated with, or endorsed by, any dictionary publisher, word-game company, or advertiser. More about the creator: <a href="/creator/">Jay Sudha</a> · <a href="https://jaysudha.com/" rel="noopener" target="_blank">jaysudha.com</a>.</p>
      <p>Word Helper combines open lexical sources, structured word data, and human-readable explanations to make word lookup easier for students, writers, learners, puzzle players, and everyday users. The site does not employ a large editorial staff or claim academic credentials it does not have. Instead, it is honest about its method: word data is compiled from openly licensed lexical sources, standardized into one consistent format, screened for quality, and structured for clarity — with a strict gate that decides which pages are complete enough to publish. The editorial responsibilities are described on the <a href="/editorial-team/">Editorial Team</a> page, and full sourcing and license attribution is documented in the <a href="/editorial-policy/">Editorial Policy</a>. Spotted something wrong? Use the <a href="/corrections/">corrections page</a> or email <a href="mailto:hello@wordhelper.online">hello@wordhelper.online</a>.</p>
      <p>Word Helper is an educational and reference tool. It is not an official dictionary, a legal language authority, an academic institution, or a professional writing service.</p>`,
      `<h2>Word Lab — ${tools.length} interactive Word Experiences</h2>
      <p>Word Lab gives you ${tools.length} focused tools for specific word tasks. Each one has a clear input, honest results, and a plain explanation of what the tool can and cannot do.</p>
      <ul>
        <li><strong><a href="/tools/word-unscramble/">Word Unscramble</a></strong> — finds all valid words that can be built from the letters you enter, using letter-frequency matching so only genuinely buildable words appear.</li>
        <li><strong><a href="/tools/anagram-solver/">Anagram Solver</a></strong> — finds exact anagrams that use every letter once, or partial anagrams (smaller words hidden inside a larger set of letters).</li>
        <li><strong><a href="/tools/rhyme-finder/">Rhyme Finder</a></strong> — returns rhyme ideas grouped as perfect rhymes, near rhymes, and similar-ending words.</li>
        <li><strong><a href="/tools/syllable-counter/">Syllable Counter</a></strong> — estimates the spoken syllable count for any word, sentence, or paragraph, with a word-by-word breakdown.</li>
        <li><strong><a href="/tools/prefix-finder/">Prefix Finder</a></strong> — finds words that begin with the exact letters you type, for vocabulary study, spelling patterns, and word-game use.</li>
        <li><strong><a href="/tools/suffix-finder/">Suffix Finder</a></strong> — finds words that end with the exact letters you type, for grammar study, spelling endings, and creative writing.</li>
        <li><strong><a href="/tools/word-finder/">Word Finder</a></strong> — finds words that contain the letters you choose, narrowed by start, end, and length.</li>
        <li><strong><a href="/tools/synonym-finder/">Synonym Finder</a></strong> — finds synonyms and similar words for clearer, stronger writing.</li>
        <li><strong><a href="/tools/antonym-finder/">Antonym Finder</a></strong> — finds antonyms and opposite words for precise contrast.</li>
        <li><strong><a href="/tools/word-counter/">Word Counter</a></strong> — counts words, characters, sentences, and reading time, privately in your browser.</li>
        <li><strong><a href="/tools/random-word-generator/">Random Word Generator</a></strong> — generates random English words for prompts, games, and brainstorming.</li>
      </ul>`,
      `<h2>Word Explorer — in-depth word pages</h2>
      <p>Word Explorer is Word Helper's word-page workspace. Each published word page includes a definition, pronunciation guide, syllable breakdown, part of speech, synonyms, antonyms, word family, and example sentences. This data is compiled from openly licensed sources — the <a href="https://www.datamuse.com/api/" rel="nofollow noopener" target="_blank">Datamuse API</a> (which builds on Wiktionary) and the <a href="https://dictionaryapi.dev/" rel="nofollow noopener" target="_blank">Free Dictionary API</a> — then standardized, screened, and structured to a consistent format. See the <a href="/editorial-policy/">Editorial Policy</a> for full sourcing and attribution.</p>
      <p>The word tools are built from a 327,000-entry source word inventory and, in your browser, match against a curated dictionary of more than 90,000 words. A word earns a full, indexed page only when it passes Word Helper's quality gate — a complete definition, pronunciation, syllables, examples, and synonyms — and the published set grows continuously. Only these complete pages are listed and indexed; the on-site search covers them alongside the tools, guides, and word lists.</p>`,
      `<h2>Learn English, Word Lists, and Practice</h2>
      <p><a href="/learn-english/">Learn English</a> provides plain-language vocabulary guides covering topics like building vocabulary, understanding word roots, how syllables work, how rhyme works, spelling patterns, and memory techniques.</p>
      <p><a href="/word-lists/">Word Lists</a> are hand-curated collections of words organised by theme — common English words, positive vocabulary, academic words, words for writers, strong action verbs, and descriptive adjectives. Every word in a list includes its meaning and an example sentence.</p>
      <p><a href="/practice/">Practice</a> contains vocabulary quizzes built from Word Explorer definitions. You see a definition and choose the correct word from four options. Each quiz is a quick, self-paced vocabulary check with instant feedback.</p>`,
      `<h2>Who Word Helper is for</h2>
      <p>Word Helper is built for word-game players who need valid words from scrambled letters, writers who want rhyme options or rhythm checks, students and teachers looking for vocabulary and spelling patterns, English learners building their word knowledge, and anyone who wants a fast, clearly explained answer to a word question.</p>`,
      `<h2>How to read Word Helper results</h2>
      <p>Word Helper is descriptive: it reflects how English is actually used rather than enforcing a single game dictionary, classroom rule, or style guide. Syllable counts follow standard English pronunciation and may differ by accent, dialect, and speech speed. Rhyme results combine pronunciation and spelling patterns. Each page explains how its results are produced so you can apply them confidently in your own context.</p>`,
      `<h2>Reporting errors and contacting us</h2>
      <p>The site is maintained and reviewed by Word Helper. If you notice an error, a confusing result, a missing word, or any content concern, <a href="/contact/">contact Word Helper at hello@wordhelper.online</a>. Content corrections and tool accuracy issues are reviewed and fixed as quickly as possible.</p>`,
    ],
  },
  {
    href: "/contact/",
    schemaType: "ContactPage",
    title: "Contact Word Helper",
    h1: "Contact Word Helper",
    metaTitle: "Contact Word Helper — Questions, Corrections, and Feedback",
    metaDescription:
      "Contact Word Helper for tool questions, word corrections, accessibility feedback, or content improvement suggestions. We respond within a few business days.",
    bodyHtml: [
      `<h2>How to reach us</h2>
      <p>Send an email to <a href="mailto:hello@wordhelper.online">hello@wordhelper.online</a>. Every message is read and answered by Word Helper. Here are the most common reasons people contact us:</p>
      <ul>
        <li><strong>Tool result questions or corrections</strong> — if a word is missing, a result seems wrong, or a filter is not working as expected</li>
        <li><strong>Missing word reports</strong> — if a word you searched for is not in the dictionary or is missing pronunciation, examples, or synonyms</li>
        <li><strong>Accessibility feedback</strong> — if any part of the site is difficult to use with a screen reader, keyboard, or other assistive technology</li>
        <li><strong>Content corrections or factual errors</strong> — if a definition, etymology, syllable count, or pronunciation guide contains an error</li>
        <li><strong>General feedback or improvement suggestions</strong> — if you have ideas for tools, word lists, guides, or features that would make Word Helper more useful</li>
        <li><strong>Copyright or content concerns</strong> — if you believe any Word Helper content may overlap with copyrighted material you hold or represent</li>
        <li><strong>Partnership or collaboration inquiries</strong> — if you represent an educational organisation, publisher, or technology company interested in working with Word Helper</li>
      </ul>`,
      `<h2>What to include in your message</h2>
      <p>For tool-related reports, please include the page URL and the specific input you used. For example: <em>&ldquo;I searched for 'tca' on the Word Unscramble page and expected to see 'cat' but it did not appear in the results.&rdquo;</em> The more specific your description, the faster we can reproduce the issue and fix it.</p>
      <p>For definition or content corrections, include the word page URL, the section you believe contains an error, and a brief explanation of what you think is incorrect and why. We take content accuracy seriously and investigate every report.</p>
      <p>For accessibility issues, describe what you were trying to do, what assistive technology or browser you were using, and what happened instead of what you expected. Accessibility reports are treated as a high priority.</p>`,
      `<h2>Response time</h2>
      <p>Word Helper is maintained independently. We aim to read and respond to feedback within a few business days. Tool corrections and content fixes are prioritized and applied as quickly as we can after verifying the issue — we do not wait for a scheduled update cycle.</p>
      <p>We read every message and use the feedback to improve the site. If your issue requires a longer investigation, we will acknowledge your message while we look into it.</p>`,
      `<h2>What we do with your message</h2>
      <p>Your email address and message content are used only to respond to your request and, where relevant, to improve the website. We do not sell, share, or publish contact information. We do not add you to any mailing list without explicit permission. Contact data is retained only as long as needed to address your inquiry and is then deleted.</p>
      <p>For more detail about how Word Helper handles personal data, see the <a href="/privacy-policy/">Privacy Policy</a>.</p>`,
      `<h2>Other ways to explore Word Helper</h2>
      <p>If you have a question about how a specific tool works, the <a href="/guides/">Word Helper Guides</a> cover how to get the best results from each tool. If you are looking for information about how content is created or reviewed, the <a href="/editorial-policy/">Editorial Policy</a> explains our standards. If you have a question about advertising, see the <a href="/affiliate-disclosure/">Advertising Disclosure</a>.</p>`,
      `<h2>Who runs Word Helper</h2>
      <p>Word Helper is created and maintained by <a href="/creator/">Jay Sudha</a> (Shatanjay Sudha), an independent builder of practical web tools and educational utilities. For more about the creator, visit <a href="https://jaysudha.com/" rel="noopener" target="_blank">jaysudha.com</a>.</p>`,
    ],
  },
  {
    href: "/creator/",
    schemaType: "ProfilePage",
    mainEntityPerson: true,
    title: "Jay Sudha — Creator of Word Helper",
    h1: "Jay Sudha — Creator of Word Helper",
    reviewedLabel: "Page reviewed",
    metaTitle: "Jay Sudha — Creator of Word Helper",
    metaDescription:
      "Word Helper is created and maintained by Jay Sudha (Shatanjay Sudha), an independent builder of practical web tools, calculators, and educational utilities. Learn more.",
    bodyHtml: [
      `<h2>Who created Word Helper</h2>
      <p>Word Helper was created by <strong>Jay Sudha</strong>, also known as Shatanjay Sudha. Jay builds practical digital tools for everyday users — including calculators, productivity systems, finance tools, and language utilities. Word Helper follows the same product philosophy: make useful tools fast, clear, accessible, and easy to use on mobile.</p>
      <p>Word Helper is part of a broader set of practical online tools Jay builds and maintains. You can find more of that work at <a href="https://jaysudha.com/" rel="noopener" target="_blank">jaysudha.com</a>.</p>`,
      `<h2>Why Jay Sudha built Word Helper</h2>
      <p>Jay built Word Helper to make everyday word lookup faster, clearer, and more useful for students, writers, learners, and word-game players. The goal is not to replace official dictionaries or professional language advice — it is to put practical tools, structured word information, real examples, related words, and a visible correction path together in one clean, mobile-first place.</p>
      <p>Word Helper helps people find word meanings, check synonyms and antonyms, explore example sentences, improve vocabulary, solve word games, find rhymes, unscramble letters, count syllables, improve writing clarity, and learn English words through simple explanations — for anyone who wants a clear, fast answer to a word question.</p>`,
      `<h2>Product philosophy</h2>
      <p>The same principles shape every part of Word Helper:</p>
      <ul>
        <li><strong>Fast tools</strong> — results appear instantly, without heavy pages or waiting.</li>
        <li><strong>Clean, uncluttered design</strong> — the answer you came for is the thing you see first.</li>
        <li><strong>No unnecessary friction</strong> — no sign-up, no pop-ups, no dark patterns.</li>
        <li><strong>Practical examples</strong> — words shown in real sentences, not just defined in isolation.</li>
        <li><strong>Clear explanations</strong> — plain-English notes alongside the reference data.</li>
        <li><strong>Transparent sources</strong> — every word page and tool says where its data comes from.</li>
        <li><strong>A real correction process</strong> — mistakes can be reported and are reviewed and fixed.</li>
        <li><strong>Mobile-first</strong> — the whole site is built to work well on a phone.</li>
      </ul>`,
      `<h2>Creator credibility</h2>
      <p>Jay Sudha is the creator of Word Helper and several practical online tools. His product work focuses on simple interfaces, clear explanations, mobile-first performance, and useful everyday systems. Word Helper follows the same approach: fast tools, structured word information, transparent source notes, and visible correction paths. This is grounded, working-product credibility — Word Helper does not claim linguistic credentials, academic accreditation, or expert certification it does not have.</p>`,
      `<h2>An honest note on scope</h2>
      <p>Word Helper is an educational reference and word-tools website, not an official dictionary, an academic institution, a certification body, or a legal language authority. Word meanings and usage can change by context. It combines open lexical sources with clear formatting and human-readable explanations. The editorial process is described in the <a href="/editorial-policy/">Editorial Policy</a>, the ongoing editorial responsibilities on the <a href="/editorial-team/">Editorial Team</a> page, and corrections are welcome through the <a href="/corrections/">corrections page</a>.</p>`,
      `<h2>Contact</h2>
      <p>For questions, corrections, or anything about the site, email <a href="mailto:hello@wordhelper.online">hello@wordhelper.online</a> or use the <a href="/contact/">contact page</a>. For more about the creator, visit <a href="https://jaysudha.com/" rel="noopener" target="_blank">jaysudha.com</a>.</p>`,
    ],
  },
  {
    href: "/editorial-team/",
    schemaType: "ProfilePage",
    title: "Editorial Team",
    h1: "The Word Helper Editorial Team",
    reviewedLabel: "Team page reviewed",
    metaTitle: "Editorial Team — Who Builds and Reviews Word Helper",
    metaDescription:
      "Meet the Word Helper Editorial Team: who maintains the word tools and word pages, how data quality is reviewed, how corrections are handled, and what Word Helper does and does not claim.",
    bodyHtml: [
      `<h2>Who we are</h2>
      <p>Word Helper is built and maintained under the collective name <strong>Word Helper Editorial Team</strong>, led by the site's creator <a href="/creator/">Jay Sudha</a> (Shatanjay Sudha). We are word-tool builders and language enthusiasts — not a university department, a dictionary publisher, or a panel of credentialed lexicographers, and we do not claim to be. We think being clear about that is more trustworthy than inventing authority we do not have.</p>
      <p>Our role is practical: we choose and license good open data sources, turn that data into clean and consistent word pages and tools, decide which pages are complete enough to publish, screen AI-assisted text, and fix mistakes when readers report them.</p>`,
      `<h2>What the editorial team is responsible for</h2>
      <ul>
        <li><strong>Source selection and licensing.</strong> Choosing open, properly licensed data sources (the Datamuse API building on Wiktionary, the Free Dictionary API, and the public-domain ENABLE word list) and crediting them — see the <a href="/editorial-policy/">Editorial Policy</a> for full attribution.</li>
        <li><strong>Data standardization.</strong> Normalizing definitions, pronunciations, syllables, and word data into one consistent, readable format.</li>
        <li><strong>The quality gate.</strong> Maintaining the rules that decide which word pages are complete and useful enough to publish and index — and keeping thin entries out of search.</li>
        <li><strong>Overseeing AI-assisted text.</strong> Maintaining the automated screening rules that AI-assisted example sentences must pass before they ship, and reviewing any reported issues by hand. AI is never used to author definitions or etymologies.</li>
        <li><strong>Handling corrections.</strong> Reading every error report, verifying it, fixing the source data, and rebuilding the affected pages — see <a href="/corrections/">how to report a correction</a>.</li>
        <li><strong>Accessibility and usability.</strong> Keeping the site fast, mobile-friendly, keyboard-operable, and readable.</li>
      </ul>`,
      `<h2>How we work with sources and AI</h2>
      <p>Word Helper's word data is compiled from openly licensed lexical sources and then standardized, quality-checked, and structured by the team. Example sentences may be AI-assisted and are automatically screened for accuracy. We do not scrape or republish content from commercial dictionaries, and we do not present machine output as expert authorship. The full method, sources, and licensing are documented in the <a href="/editorial-policy/">Editorial Policy</a>.</p>`,
      `<h2>What we do not claim</h2>
      <p>We do not claim individual academic or linguistic credentials, named expert authors, awards, or institutional affiliation. Word Helper is a free reference and learning aid — useful for writers, students, teachers, English learners, and word-game players — and is not a replacement for an authoritative or game-specific dictionary. For competitive, academic, or professional use, confirm results in the dictionary your context requires.</p>`,
      `<h2>Reaching the team</h2>
      <p>You can reach the editorial team directly at <a href="mailto:hello@wordhelper.online">hello@wordhelper.online</a>. To report a specific error, the fastest route is the structured <a href="/corrections/">corrections page</a>. For anything else, the <a href="/contact/">contact page</a> lists the most common reasons people write to us.</p>`,
    ],
    faqs: [
      {
        q: "Who writes the content on Word Helper?",
        a: "Word data is compiled from openly licensed sources (Datamuse/Wiktionary, the Free Dictionary API, and the public-domain ENABLE list), then standardized, quality-checked, and structured by the Word Helper Editorial Team. Example sentences may be AI-assisted and are screened for accuracy; definitions and etymologies are not AI-authored.",
      },
      {
        q: "Does Word Helper have credentialed linguists or named expert authors?",
        a: "No. Word Helper is run by a small independent team under the collective name Word Helper Editorial Team. We do not claim individual academic credentials, named expert authors, or institutional affiliation — we are transparent about being a practical word-tools project.",
      },
      {
        q: "How do I report a mistake on a word page?",
        a: "Use the corrections page, which has a pre-filled report link for each type of issue (definition, example, synonym, pronunciation, and more), or email hello@wordhelper.online with the page URL and what looks wrong. Verified corrections are applied to the source data and the page is rebuilt.",
      },
    ],
  },
  {
    href: "/corrections/",
    title: "Report a Correction",
    h1: "Report a correction or issue",
    reviewedLabel: "Corrections page reviewed",
    metaTitle: "Report a Correction — Word Helper",
    metaDescription:
      "Found a wrong definition, a poor example, an incorrect synonym, a broken tool, or an accessibility issue on Word Helper? Use these structured links to report it — every report is reviewed and fixed.",
    bodyHtml: [
      `<h2>How corrections work</h2>
      <p>Word Helper compiles word data from open sources and standardizes it, so occasional errors do happen. We review correction requests to improve clarity, usefulness, and source handling. Every report is read by the <a href="/editorial-team/">editorial team</a>, verified, applied to the source data, and the affected page is rebuilt — we do not wait for a scheduled update cycle to fix a confirmed error. Pick the closest match below; each link opens your email app with a helpful subject line and a short template to fill in.</p>`,
      `<h2>Report a word or content issue</h2>
      <ul class="correction-list">
        <li><strong>Wrong or unclear definition</strong> — <a href="mailto:hello@wordhelper.online?subject=Word%20Helper%20correction%3A%20definition&body=Page%20URL%3A%20%0AWhat%20looks%20wrong%3A%20%0ASuggested%20correction%3A%20">report a definition problem</a></li>
        <li><strong>Missing definition or meaning</strong> — <a href="mailto:hello@wordhelper.online?subject=Word%20Helper%20correction%3A%20missing%20definition&body=Page%20URL%3A%20%0AWord%3A%20%0AWhat%20is%20missing%3A%20">report a missing definition</a></li>
        <li><strong>A better example sentence</strong> — <a href="mailto:hello@wordhelper.online?subject=Word%20Helper%20correction%3A%20example%20sentence&body=Page%20URL%3A%20%0ACurrent%20example%3A%20%0ASuggested%20example%3A%20">suggest a clearer example</a></li>
        <li><strong>Incorrect synonym</strong> — <a href="mailto:hello@wordhelper.online?subject=Word%20Helper%20correction%3A%20synonym&body=Page%20URL%3A%20%0AWhich%20synonym%20is%20wrong%3A%20%0AWhy%3A%20">report a synonym</a></li>
        <li><strong>Incorrect antonym</strong> — <a href="mailto:hello@wordhelper.online?subject=Word%20Helper%20correction%3A%20antonym&body=Page%20URL%3A%20%0AWhich%20antonym%20is%20wrong%3A%20%0AWhy%3A%20">report an antonym</a></li>
        <li><strong>Pronunciation issue</strong> — <a href="mailto:hello@wordhelper.online?subject=Word%20Helper%20correction%3A%20pronunciation&body=Page%20URL%3A%20%0AWhat%20looks%20wrong%3A%20%0AWhat%20it%20should%20be%3A%20">report a pronunciation issue</a></li>
        <li><strong>Syllable count issue</strong> — <a href="mailto:hello@wordhelper.online?subject=Word%20Helper%20correction%3A%20syllables&body=Page%20URL%3A%20%0AWord%3A%20%0ASyllable%20count%20shown%20vs%20expected%3A%20">report a syllable issue</a></li>
        <li><strong>Rhyme result issue</strong> — <a href="mailto:hello@wordhelper.online?subject=Word%20Helper%20correction%3A%20rhyme&body=Word%3A%20%0AWhat%20looks%20wrong%3A%20">report a rhyme issue</a></li>
        <li><strong>Offensive or sensitive wording</strong> — <a href="mailto:hello@wordhelper.online?subject=Word%20Helper%20report%3A%20offensive%20or%20sensitive%20wording&body=Page%20URL%3A%20%0AWhat%20the%20concern%20is%3A%20">report a sensitive-wording concern</a></li>
      </ul>`,
      `<h2>Report a tool, source, or policy issue</h2>
      <ul class="correction-list">
        <li><strong>Broken or wrong tool result</strong> — <a href="mailto:hello@wordhelper.online?subject=Word%20Helper%20report%3A%20tool%20result&body=Tool%20page%20URL%3A%20%0AWhat%20you%20entered%3A%20%0AWhat%20you%20expected%3A%20%0AWhat%20happened%3A%20">report a tool problem</a></li>
        <li><strong>Source or licensing issue</strong> — <a href="mailto:hello@wordhelper.online?subject=Word%20Helper%20report%3A%20source%20or%20licensing&body=Page%20URL%3A%20%0ASource%20concern%3A%20">report a source issue</a></li>
        <li><strong>Accessibility barrier</strong> — <a href="mailto:hello@wordhelper.online?subject=Word%20Helper%20report%3A%20accessibility&body=Page%20URL%3A%20%0AAssistive%20tech%20or%20browser%3A%20%0AWhat%20you%20were%20trying%20to%20do%3A%20%0AWhat%20happened%3A%20">report an accessibility issue</a> (treated as high priority)</li>
        <li><strong>Privacy or data concern</strong> — <a href="mailto:hello@wordhelper.online?subject=Word%20Helper%20report%3A%20privacy&body=Your%20question%20or%20concern%3A%20">contact us about privacy</a> (see the <a href="/privacy-policy/">Privacy Policy</a>)</li>
        <li><strong>Advertising concern</strong> — <a href="mailto:hello@wordhelper.online?subject=Word%20Helper%20report%3A%20advertising&body=Page%20URL%3A%20%0AYour%20concern%3A%20">report an advertising concern</a> (see the <a href="/affiliate-disclosure/">Advertising Disclosure</a>)</li>
        <li><strong>Copyright concern</strong> — <a href="mailto:hello@wordhelper.online?subject=Word%20Helper%20report%3A%20copyright&body=Page%20URL%3A%20%0AMaterial%20you%20hold%20rights%20to%3A%20%0ADetails%3A%20">report a copyright concern</a></li>
        <li><strong>Something else</strong> — <a href="mailto:hello@wordhelper.online?subject=Word%20Helper%20report%3A%20other&body=Page%20URL%3A%20%0AYour%20message%3A%20">send any other issue</a></li>
      </ul>`,
      `<h2>What to include</h2>
      <p>The more specific your report, the faster we can reproduce and fix it. Wherever possible include the <strong>page URL</strong>, the exact <strong>word or input</strong> involved, and a short note on what is wrong and what you would expect instead. If your email app does not open from the links above, just write to <a href="mailto:hello@wordhelper.online">hello@wordhelper.online</a> with those details.</p>`,
      `<h2>What happens next</h2>
      <p>We read every message. Confirmed content corrections and tool fixes are prioritized, applied to the source files, and the updated pages are rebuilt and redeployed as quickly as we can. For more on our review process and sources, see the <a href="/editorial-policy/">Editorial Policy</a>.</p>`,
    ],
    faqs: [
      {
        q: "How long does it take to fix a reported error?",
        a: "Confirmed content corrections and tool fixes are prioritized and applied as quickly as possible after we verify the issue — we do not wait for a scheduled update cycle. More involved reports are acknowledged while we investigate.",
      },
      {
        q: "What information should I include in a correction?",
        a: "Include the page URL, the exact word or input involved, what looks wrong, and what you would expect instead. The structured report links on this page pre-fill a template with those fields.",
      },
    ],
  },
  {
    href: "/privacy-policy/",
    title: "Privacy Policy",
    h1: "Privacy Policy",
    metaTitle: "Privacy Policy - Word Helper",
    metaDescription:
      "Read the Word Helper Privacy Policy: how tool inputs are handled, what browser storage is used, and how contact information is managed.",
    body: [
      "Word Helper is an English word-tools workspace. This Privacy Policy explains how this website handles information in a plain-language way. It reflects the site's current state — not hypothetical future features. This policy will be updated before any advertising or analytics services are activated.",
      "How tool inputs are handled. Most Word Helper tools — Word Unscramble, Anagram Solver, Prefix Finder, Suffix Finder, Word Finder, Rhyme Finder, Syllable Counter, Word Counter, and Random Word Generator — run entirely in your browser. Your input is not sent to any server. Two tools, Synonym Finder and Antonym Finder, send the word you type to the Datamuse API (api.datamuse.com) to retrieve results; Datamuse is an open language-data service and its privacy information is available at datamuse.com. Word Helper does not sell the words or text you type, and does not store them on its own servers — the only transmission of your input is the API lookups described in this policy. Do not enter private, sensitive, regulated, or confidential text into any Word Helper tool.",
      "Word pages and dictionary lookups. When you open a word page (under /word/), use the word-lookup feature, or browse word-list cards, your browser may send that single word to the Free Dictionary API (api.dictionaryapi.dev) to retrieve definitions, pronunciations, and example sentences. Word Helper attaches no personal information to the request; as with any web request, your IP address and browser details are technically visible to the API operator, and to our hosting provider (Cloudflare), which processes requests to serve this site. The Free Dictionary API is a separate third party from Datamuse.",
      "Word Helper uses local browser storage (localStorage) to remember your recently used tools, recent tool inputs, any saved favourites, and a small cache of dictionary results so repeat word lookups are instant. This data stays on your device and is not transmitted to any Word Helper server. You can clear all of it at any time through your browser's storage settings.",
      "Advertising. Word Helper does not currently serve advertising. If advertising is added in the future, this Privacy Policy will be updated before any ad code is activated, and a consent mechanism will be provided where required by applicable law. At that point, advertising services such as Google AdSense may use cookies and similar technologies to serve ads.",
      "Analytics. Word Helper does not currently use web analytics services or tracking cookies. If analytics are added in the future, this Privacy Policy will be updated before any analytics code is activated.",
      "Children's privacy. Word Helper is a general-audience reference and learning site. It does not require an account, does not knowingly collect personal information from children, and builds no profile of any visitor. The only way to send us personal information is by emailing us directly. If you are a parent or guardian and believe a child has sent us personal information through the contact email, write to hello@wordhelper.online and we will delete it.",
      "If you contact Word Helper at hello@wordhelper.online, your email address and message are used only to respond to your request and, where relevant, to improve the website. We do not sell, share, or publish contact information. Contact data is retained only as long as needed to address your inquiry.",
      "Your choices and regional rights. If you are in the EEA, the UK, or California, you have rights over your personal data, including access, correction, deletion, and the right to object to processing. Because Word Helper requires no account, serves no ads, and runs tool processing in your browser, it does not build a personal profile of you. You can clear browser localStorage at any time through your browser settings.",
      "Who is responsible for your data. Word Helper is operated independently. For any privacy question or data request, contact hello@wordhelper.online and we will respond as quickly as we can.",
      "If you have questions about this policy, contact us at hello@wordhelper.online. The date this policy was last reviewed is shown at the top of this page.",
    ],
  },
  {
    href: "/terms/",
    title: "Terms and Conditions",
    h1: "Terms and Conditions",
    metaTitle: "Terms and Conditions — Word Helper",
    metaDescription:
      "Read the Word Helper Terms and Conditions covering use of the word tools, Word Explorer pages, learning guides, word lists, and practice quizzes.",
    bodyHtml: [
      `<h2>Acceptance of terms</h2>
      <p>These Terms and Conditions govern your use of Word Helper. By using any part of this website — including the Word Lab tools, Word Explorer word pages, Learn English guides, Word Lists, or Practice quizzes — you agree to these terms. If you do not agree, do not use the website.</p>`,
      `<h2>What Word Helper provides</h2>
      <p>Word Helper provides a comprehensive suite of eleven word tools for writing support, vocabulary learning, word game play, spelling pattern discovery, and creative word exploration — including Word Unscramble, Anagram Solver, Rhyme Finder, Syllable Counter, Prefix Finder, Suffix Finder, Word Finder, Synonym Finder, Antonym Finder, Word Counter, and Random Word Generator. The site also includes searchable word pages, curated word lists, guided learning articles, and vocabulary quizzes.</p>
      <p>All tools, word pages, guides, lists, and quizzes are openly accessible and do not require registration. Word Helper does not currently display advertising. If advertising is added in the future, the Privacy Policy and Cookie Policy will be updated before any ad code is activated.</p>`,
      `<h2>Accuracy and limitations of results</h2>
      <p>Tool results reflect standard English usage and the Word Helper word list. Acceptance can differ across specific game dictionaries, pronunciation standards, accents, dialects, regional usage, and classroom or editorial rules. Word Helper does not warrant that a given result will be accepted in any specific game, contest, publication, classroom, or professional context.</p>
      <p>Syllable counts follow standard English pronunciation and may differ across regional accents and dialects. Rhyme suggestions span perfect rhymes, near rhymes, and similar endings, and are best confirmed by reading aloud. Unscramble and anagram results draw on the public-domain ENABLE word list, which may differ from a specific game's official word list. These notes are documented on each relevant page.</p>`,
      `<h2>Permitted use</h2>
      <p>You may use Word Helper freely — for personal, educational, creative, and professional work, including writing you do for your job. You may share links to Word Helper pages, and you may use tool results and word content in your own learning, writing, and word game play. What you may not do is republish or redistribute the site's editorial content itself commercially without permission, as described below.</p>
      <p>You may not copy, republish, redistribute, scrape, or reproduce Word Helper's definitions, examples, guides, or other editorial content for any commercial purpose without written permission. You may not attempt to reverse engineer, scrape at scale, overload, or interfere with the operation of this website.</p>`,
      `<h2>No professional advice</h2>
      <p>Word Helper is an educational word-tools platform. Nothing on this site constitutes legal, medical, financial, linguistic authority, or other professional advice. Do not rely on Word Helper results for professional, academic, publishing, legal, or medical purposes without independent verification.</p>`,
      `<h2>Third-party services</h2>
      <p>Word Helper currently uses no advertising or analytics services. Two tools (Synonym Finder and Antonym Finder) and the word pages query open language APIs — the Datamuse API and the Free Dictionary API — as described in the <a href="/privacy-policy/">Privacy Policy</a>. If further third-party services are added in the future — such as advertising or analytics — the relevant policies will be updated before activation, and any such services will be governed by their own terms and privacy policies.</p>`,
      `<h2>Changes to these terms</h2>
      <p>Word Helper reserves the right to update these Terms and Conditions at any time. Continued use of the website after any change constitutes your acceptance of the updated terms. If you have questions about these terms, contact us at <a href="mailto:hello@wordhelper.online">hello@wordhelper.online</a>.</p>`,
    ],
  },
  {
    href: "/disclaimer/",
    title: "Disclaimer",
    h1: "Disclaimer",
    metaTitle: "Disclaimer - Word Helper",
    metaDescription:
      "Read the Word Helper disclaimer covering word lists, syllable counts, rhyme suggestions, and educational use.",
    bodyHtml: [
      `<h2>Educational purpose</h2>
      <p>Word Helper is an educational platform intended to support learning, creativity, and word exploration. All tools, word pages, guides, and practice sessions are provided for educational purposes. Word Helper is not a legal, medical, financial, or professional authority on language.</p>
      <p>Word Helper is a free reference and learning aid — not a replacement for an authoritative or game-specific dictionary. For competitive word games, academic work, or professional writing, confirm results in the dictionary or style guide your context requires.</p>`,
      `<h2>Word meanings vary by context</h2>
      <p>English word meanings are not fixed. The same word may carry different meanings in different contexts, fields, time periods, or regions. Definitions on Word Helper reflect common general meanings and are provided for learning purposes. They do not cover every technical, legal, medical, or domain-specific use of a word. For specialized meanings in professional contexts, consult authoritative sources in the relevant field.</p>`,
      `<h2>How definitions and examples are produced</h2>
      <p>Definitions, pronunciations, syllable counts, and related words on Word Helper are compiled from openly licensed lexical sources — such as Wiktionary (via the Datamuse API) and the Free Dictionary API — and standardized into a consistent format. Example sentences are drawn from these sources where available, and are otherwise generated and then automatically screened for clarity. Because this process is largely automated, occasional errors or awkward phrasings can occur; please <a href="/corrections/">report anything that looks wrong</a> and we will review and correct it. Sourcing and license attribution is documented in the <a href="/editorial-policy/">Editorial Policy</a>.</p>`,
      `<h2>Pronunciation and syllable counts vary by accent</h2>
      <p>Pronunciation guides and syllable counts on Word Helper follow standard English pronunciation. Spoken English varies by accent, dialect, region, and speech speed, so a syllable count common in one accent may differ in another. Pronunciation is provided to guide learners; confirm it aloud in the context where it matters. Pronunciation is shown as a guide to help learners, not as the sole correct form. Always check pronunciation aloud in the context where it matters.</p>`,
      `<h2>Word tool results depend on source word lists</h2>
      <p>Word Unscramble, Anagram Solver, Prefix Finder, and Suffix Finder results come from a curated dictionary built on the public-domain ENABLE word list plus a supplementary word list. A word that appears in results is valid in this dictionary but may not be accepted by every game dictionary, classroom rule, or publication style guide. Word Helper does not guarantee that any result will be accepted in a specific game, class, or editorial context.</p>`,
      `<h2>Rhyme results are brainstorming aids</h2>
      <p>Rhyme suggestions from Word Helper are organized as perfect rhymes, near rhymes, and spelling-based similar endings. Because English spelling and pronunciation do not always align, similar-ending words are best confirmed by reading aloud. Rhyme results should be read aloud and evaluated for meaning, sound, and audience before use in published writing, lyrics, or spoken performance.</p>`,
      `<h2>No warranty</h2>
      <p>Word Helper is provided for educational and informational purposes without warranties of any kind, express or implied. For competitive, academic, publishing, or professional use, confirm results against the specific rules required by your game, class, editor, publisher, or professional context. If you have questions, contact us at hello@wordhelper.online.</p>`,
    ],
  },
  {
    href: "/editorial-policy/",
    title: "Editorial Policy",
    h1: "Editorial Policy",
    metaTitle: "Editorial Policy - Word Helper",
    metaDescription:
      "Learn how Word Helper writes, reviews, and maintains educational word-tool content.",
    bodyHtml: [
      `<h2>Purpose and ownership</h2>
      <p>Word Helper uses open lexical data and structured word information to create practical reference pages and tools. The website is created and maintained by <strong><a href="/creator/">Jay Sudha</a></strong> (Shatanjay Sudha), a builder of practical online tools and educational utilities. The editorial goal is to make word information easier to understand, compare, and use for students, writers, learners, and word-game players. The site does not claim to be an official dictionary or an academic authority.</p>`,
      `<h2>How word content is created</h2>
      <p>Word Helper compiles its word data from open, openly licensed language sources and standardizes it into one consistent format. Definitions, parts of speech, pronunciations, syllable counts, synonyms, antonyms, and related words are drawn from the <a href="https://www.datamuse.com/api/" rel="nofollow noopener" target="_blank">Datamuse API</a> (which builds on Wiktionary and other open datasets) and the <a href="https://dictionaryapi.dev/" rel="nofollow noopener" target="_blank">Free Dictionary API</a>. Example sentences use real dictionary citations where available, and are otherwise generated and then automatically screened for clarity and accuracy before publication.</p>
      <p>Word Helper's own editorial work is the <strong>selection, standardization, screening, and structuring</strong> of this data — choosing which words and senses to surface, formatting each entry to a consistent template, filtering out low-quality or malformed results, and applying a strict quality gate (below) that decides which pages are complete enough to publish and index. We do not claim to have independently authored every definition; we curate and quality-control openly licensed reference data and present it clearly.</p>`,
      `<h2>How Word Helper builds word pages</h2>
      <p>Word Helper publishes a large library of word pages. Here is honestly how they are built, so readers and search engines understand what they are:</p>
      <ul>
        <li>Word data is <strong>structured from open lexical sources</strong> (see above) and formatted into one consistent template for practical, fast lookup.</li>
        <li>A page may include a definition, a plain-English "in simple terms" line, example sentences, synonyms, antonyms, related words, rhymes, syllables, part of speech, and learning notes — <strong>but not every word has every section</strong>. Sections appear only when reliable data exists for them.</li>
        <li>Where data is missing or uncertain, the page uses a <strong>graceful fallback</strong> rather than an empty box, and invites a correction.</li>
        <li><strong>Priority word pages</strong> — common, high-intent words — receive additional editorial formatting: a closer look at meaning, how close synonyms differ in tone, common confusions, and examples at different levels. This richer layer is added by hand for a curated set of words and grows over time.</li>
        <li>Every page carries a source and correction note, and users can <a href="/corrections/">report an issue</a> at any time.</li>
        <li>Word Helper does not claim official dictionary status; it is an educational reference that structures and formats open language data for easier use.</li>
      </ul>`,
      `<h2>How data sources are handled</h2>
      <p>Word Helper uses the public-domain ENABLE word list as its word-list backbone. This list covers valid English words and is used solely as a word inventory — its presence does not imply any editorial quality claim about individual words. Tool results (unscramble, anagram, prefix, suffix) are drawn from this list with letter-frequency logic. Rhyme and syllable tools use pattern-matching logic. All source usage is documented and reviewed for license compatibility before deployment.</p>`,
      `<h2>How corrections are reviewed</h2>
      <p>Content corrections can be submitted by email to hello@wordhelper.online. Reports of factual errors, definition inaccuracies, broken tool results, or misleading content are treated as high priority. Corrections are reviewed, verified, and applied to the source files. Updated pages are rebuilt and redeployed as quickly as possible. We do not wait for a scheduled update cycle to fix confirmed errors.</p>`,
      `<h2>Sources, licensing, and attribution</h2>
      <p>Word Helper builds on openly licensed reference data and credits its sources:</p>
      <ul>
        <li><strong>Headword inventory:</strong> the public-domain <strong>ENABLE</strong> word list (~172,000 words), extended with a supplementary open word list to a ~327,000-entry source inventory used at build time. The word-game tools — unscramble, anagram, prefix, suffix, and finder — match against a curated in-browser dictionary of more than 90,000 words drawn from this inventory and the published word pages.</li>
        <li><strong>Definitions &amp; word data:</strong> the <a href="https://www.datamuse.com/api/" rel="nofollow noopener" target="_blank">Datamuse API</a>, which incorporates content from <strong>Wiktionary</strong>. Wiktionary text is available under the <a href="https://creativecommons.org/licenses/by-sa/3.0/" rel="nofollow noopener" target="_blank">Creative Commons Attribution-ShareAlike 3.0 (CC BY-SA 3.0)</a> license; where Word Helper reuses such content it is credited here and shared under the same terms.</li>
        <li><strong>Supplementary definitions, IPA, and example citations:</strong> the <a href="https://dictionaryapi.dev/" rel="nofollow noopener" target="_blank">Free Dictionary API</a>.</li>
      </ul>
      <p>Word Helper does not scrape or republish content from commercial dictionaries. If you believe any entry overlaps with material you hold rights to, <a href="/contact/">contact us</a> and we will review and revise or remove it promptly.</p>`,
      `<h2>Quality standards for indexed word pages</h2>
      <p>Word Helper publishes word pages in two clearly defined tiers, and only pages that meet a real quality bar are listed in the sitemap and indexed by search engines:</p>
      <ul>
        <li><strong>Complete entries</strong> carry the full treatment: a full definition, a pronunciation guide, a syllable breakdown, a confirmed part of speech, example sentences, synonyms and antonyms, a word family section, an etymology note, and a memory tip.</li>
        <li><strong>Core entries</strong> are lighter but still substantive: a full definition, a pronunciation and syllable breakdown, a part of speech, at least two example sentences, and at least four synonyms. Additional fields such as etymology, antonyms, word family, and memory tips are added over time, at which point the entry is promoted toward a complete entry.</li>
      </ul>
      <p>Pages that have not yet reached the core standard are held back from search: they carry a <code>noindex</code> tag and are excluded from the sitemap until they meet the editorial bar. They remain reachable through A–Z browsing so the tools stay useful, while only fully developed entries are surfaced in search results. This is a deliberate editorial quality gate.</p>`,
      `<h2>How AI tools are used in content production</h2>
      <p>Word Helper uses AI language models as an aid in the content process in two specific, limited ways:</p>
      <ul>
        <li><strong>Example-sentence generation:</strong> When a word page lacks a human-authored example sentence from the source APIs, an AI language model is used to generate a candidate sentence. All AI-generated sentences are then automatically screened against a clarity and accuracy checklist before appearing on the site.</li>
        <li><strong>Standardization assistance:</strong> AI tools assist with normalizing data formats, checking for obvious inconsistencies, and flagging entries that need human review.</li>
      </ul>
      <p>AI is not used to author definitions, etymologies, or any content claimed to be drawn from open sources. When a definition comes from Wiktionary or the Free Dictionary API, it is attributed and reproduced (with standardization) from that source — it is not AI-authored. If you spot an example sentence that reads as unnatural or inaccurate, please <a href="/contact/">report it</a> and it will be reviewed and corrected or replaced.</p>`,
      `<h2>FAQ and schema accuracy</h2>
      <p>Every FAQ visible on a Word Helper page is reflected accurately in the page's FAQ schema. Schema is not added for content that is not visible to the user. Tool explanations in schemas reflect the actual logic used by the tool on that page.</p>`,
      `<h2>How to report a content issue</h2>
      <p>Send a description of the issue to hello@wordhelper.online, including the URL of the page and as much detail as possible about the error. All reports are read and responded to within a few business days.</p>`,
    ],
  },
  {
    href: "/cookie-policy/",
    title: "Cookie Policy",
    h1: "Cookie Policy",
    metaTitle: "Cookie Policy - Word Helper",
    metaDescription:
      "Read the Word Helper Cookie Policy, covering local browser storage, and the site's current approach to advertising and analytics.",
    body: [
      "Word Helper uses local browser storage (localStorage) to remember your recently used tools, recent tool inputs for each tool, any saved favourites, and a small cache of dictionary results so repeat word lookups load instantly. These values are stored only on your device and are not shared with any third party. There is no server-side storage of tool inputs. Clearing your browser's storage removes all of them.",
      "Advertising cookies. Word Helper does not currently display advertising, and no advertising cookies are set by or through this site. If advertising is added in the future — such as Google AdSense — this Cookie Policy will be updated before any ad code is activated, and a consent mechanism will be shown where required by law.",
      "Analytics cookies. Word Helper does not currently use web analytics services. No analytics cookies or tracking pixels are active on this site. If analytics are added in the future, this policy will be updated before activation.",
      "You can control, disable, or clear cookies and localStorage through your browser settings. Clearing localStorage will reset your recent-tools list, recent inputs, and saved favourites. This does not affect the core word-tool functionality of the site.",
      "For more information about managing cookies in your browser, see the help documentation for your browser (Chrome, Firefox, Safari, or Edge). If you have questions about this policy, contact us at hello@wordhelper.online. The date this policy was last reviewed is shown at the top of this page.",
    ],
  },
  {
    href: "/affiliate-disclosure/",
    title: "Advertising & Affiliate Disclosure",
    h1: "Advertising & Affiliate Disclosure",
    metaTitle: "Advertising & Affiliate Disclosure — Word Helper",
    metaDescription:
      "How advertising works on Word Helper: ads never influence definitions, tools, or editorial content; how future ads will be separated, labeled, and placed responsibly.",
    bodyHtml: [
      `<h2>About Word Helper's independence</h2>
      <p>Word Helper is a comprehensive English word-tools platform and word workspace, built and maintained by Word Helper for word-game players, writers, students, teachers, and English learners. All tool pages, word pages, learning guides, word lists, and quizzes are created independently with no influence from advertisers, sponsors, or external commercial partners.</p>`,
      `<h2>How Word Helper is supported</h2>
      <p>Word Helper does not currently display advertising and has no active commercial relationships. The site is maintained independently. If advertising is added in the future — such as through Google AdSense — it will be clearly separated from editorial content, the Privacy and Cookie policies will be updated before launch, and a consent mechanism will be shown where required. Revenue from any future advertising would help cover the costs of hosting, development, and maintaining the free tools and content on this site.</p>`,
      `<h2>Advertising principles</h2>
      <p>If and when ads are shown on Word Helper, these rules apply:</p>
      <ul>
        <li><strong>Ads never influence content.</strong> Advertising does not affect word meanings, definitions, tool results, rankings, word-list selections, or any editorial decision.</li>
        <li><strong>Ads are separate from tools and content.</strong> Ad units are visually distinct from site content and are never styled to look like tool buttons, results, or navigation.</li>
        <li><strong>Ads are not endorsements.</strong> The appearance of an ad does not mean Word Helper recommends the advertised product or service.</li>
        <li><strong>No accidental-click placements.</strong> Ads are kept away from tool inputs, submit and copy buttons, quiz answers, and tool result panels, and are placed so they never push core content out of view or cause layout shift.</li>
        <li><strong>Third-party partners and cookies.</strong> Advertising partners may use cookies or similar technologies where permitted by law and by your consent choices. Details are covered in the <a href="/privacy-policy/">Privacy Policy</a> and <a href="/cookie-policy/">Cookie Policy</a>.</li>
      </ul>`,
      `<h2>Affiliate links</h2>
      <p>Word Helper does not currently use any affiliate links. If affiliate links, sponsored recommendations, sponsored word lists, or paid placements are added in the future, each instance will be clearly labeled with a disclosure such as "affiliate link", "sponsored", or "advertisement" placed near the relevant link or content.</p>
      <p>Any future affiliate relationships will be subject to these conditions: they will not influence which words, tools, guides, or educational content appear on the site; they will not affect the accuracy or completeness of tool results; and they will not be used in a way that misleads users about the nature of the relationship.</p>`,
      `<h2>Editorial independence</h2>
      <p>All editorial decisions on Word Helper — which words to include, how definitions are written, which guides are published, and how tools work — are made based on educational usefulness and quality standards. Advertising revenue, affiliate compensation, and commercial relationships do not influence these decisions.</p>
      <p>Word Helper's Editorial Policy explains in detail how content is created, reviewed, and corrected. If you believe any content on this site has been commercially influenced in a way that is not disclosed, please contact us at <a href="mailto:hello@wordhelper.online">hello@wordhelper.online</a>.</p>`,
      `<h2>Questions about commercial relationships</h2>
      <p>If you have questions about how Word Helper is supported, what advertising is shown, or any commercial relationship that may affect this site, contact us at <a href="mailto:hello@wordhelper.online">hello@wordhelper.online</a>. We are committed to being transparent about how the platform is supported and sustained.</p>`,
    ],
  },
  {
    href: "/accessibility/",
    title: "Accessibility Statement",
    h1: "Accessibility Statement",
    reviewedLabel: "Statement reviewed",
    metaTitle: "Accessibility Statement — Word Helper",
    metaDescription:
      "How Word Helper works to keep its word tools, word pages, and reading content usable with a keyboard, screen reader, and on mobile — and how to report an accessibility issue.",
    bodyHtml: [
      `<h2>Our commitment</h2>
      <p>Word Helper aims to be usable by as many people as possible, including people who navigate with a keyboard, use a screen reader, need larger text, or rely on high-contrast settings. We work toward the <a href="https://www.w3.org/WAI/WCAG22/quickref/" rel="nofollow noopener" target="_blank">Web Content Accessibility Guidelines (WCAG) 2.2 level AA</a> as a practical target. Accessibility is treated as an ongoing effort, not a one-time checkbox.</p>`,
      `<h2>What we do</h2>
      <p>Across the site we aim to provide:</p>
      <ul>
        <li>Semantic page structure — a single main heading per page, logical heading order, and landmark regions (header, navigation, main, footer).</li>
        <li>A "skip to content" link and full keyboard operability, with visible focus outlines on links, buttons, and form controls.</li>
        <li>Labelled form fields on every tool and search box, so screen readers announce what each input is for.</li>
        <li>Tool results and quiz feedback announced through live regions, so updates are conveyed without a visual cue alone.</li>
        <li>Text contrast checked against the AA threshold, with information never conveyed by colour alone.</li>
        <li>Mobile-first layouts with comfortable tap targets and form fields sized to avoid unexpected zoom on phones.</li>
        <li>Reduced-motion support: decorative motion is removed for visitors who prefer reduced motion.</li>
      </ul>`,
      `<h2>Known limitations</h2>
      <p>Word Helper is built and maintained by a small independent team, and some areas are still improving. Word data is compiled from open sources, so occasional formatting quirks can affect how a screen reader reads an entry. The interactive tools rely on JavaScript; core word pages and content remain readable without it, but some tool interactions do not. If you hit a barrier, we want to hear about it.</p>`,
      `<h2>Reporting an accessibility issue</h2>
      <p>If any part of Word Helper is difficult to use with assistive technology, please tell us. Use the accessibility option on the <a href="/corrections/">corrections page</a>, or email <a href="mailto:hello@wordhelper.online?subject=Word%20Helper%20accessibility%20issue">hello@wordhelper.online</a> with the page URL, the assistive technology or browser you were using, what you were trying to do, and what happened instead. Accessibility reports are treated as a high priority.</p>`,
    ],
    faqs: [
      {
        q: "Which accessibility standard does Word Helper follow?",
        a: "Word Helper works toward WCAG 2.2 level AA as a practical target. It is an ongoing effort rather than a formal certification, and we fix reported issues as a high priority.",
      },
      {
        q: "How do I report an accessibility problem?",
        a: "Use the accessibility category on the corrections page, or email hello@wordhelper.online with the page URL, your browser or assistive technology, and a short description of the problem.",
      },
    ],
  },
  {
    href: "/copyright/",
    title: "Copyright & DMCA",
    h1: "Copyright & DMCA",
    reviewedLabel: "Notice reviewed",
    metaTitle: "Copyright & DMCA — Word Helper",
    metaDescription:
      "How Word Helper handles copyright: the open, licensed sources it builds on, its own site content, and how to send a copyright or DMCA takedown request.",
    bodyHtml: [
      `<h2>Word data and open sources</h2>
      <p>Word Helper builds its word pages and tools on openly licensed and public-domain language data — chiefly the <a href="https://www.datamuse.com/api/" rel="nofollow noopener" target="_blank">Datamuse API</a> (which draws on Wiktionary, available under <a href="https://creativecommons.org/licenses/by-sa/3.0/" rel="nofollow noopener" target="_blank">CC BY-SA 3.0</a>), the <a href="https://dictionaryapi.dev/" rel="nofollow noopener" target="_blank">Free Dictionary API</a>, and the public-domain ENABLE word list. Word Helper does not scrape or republish content from commercial dictionaries. Full sourcing and licensing is documented in the <a href="/editorial-policy/">Editorial Policy</a>.</p>`,
      `<h2>Word Helper's own content</h2>
      <p>The site's original writing — guides, curated word lists, tool explanations, editorial notes, page formatting, and the site design — is created by Word Helper and © ${new Date().getFullYear()} Word Helper. You are welcome to link to and use tool results in your own work; please do not republish the site's editorial content commercially without permission, as set out in the <a href="/terms/">Terms</a>.</p>`,
      `<h2>Copyright and DMCA requests</h2>
      <p>If you believe any content on Word Helper infringes a copyright you own or represent, contact us and we will review it promptly. Please email <a href="mailto:hello@wordhelper.online?subject=Word%20Helper%20copyright%2FDMCA%20request&body=Page%20URL%3A%20%0AThe%20work%20you%20hold%20rights%20to%3A%20%0AYour%20relationship%20to%20the%20work%3A%20%0AContact%20details%3A%20">hello@wordhelper.online</a> and include:</p>
      <ul>
        <li>The exact URL(s) on Word Helper you are reporting.</li>
        <li>A description of the copyrighted work you believe has been used.</li>
        <li>Your relationship to the work (owner or authorised representative).</li>
        <li>Your contact details so we can follow up.</li>
        <li>A statement that you have a good-faith belief the use is not authorised by the rights holder or the law.</li>
      </ul>
      <p>Verified requests are handled as a high priority — content is reviewed and revised or removed as appropriate. You can also start from the <a href="/corrections/">corrections page</a>, which has a copyright option.</p>`,
    ],
  },
  {
    href: "/site-updates/",
    title: "Site Updates",
    h1: "Site Updates",
    reviewedLabel: "Last updated",
    metaTitle: "Site Updates — Word Helper",
    metaDescription:
      "A changelog of meaningful improvements to Word Helper: new tools, new content, quality fixes, and policy updates.",
    bodyHtml: [
      `<h2>What this page tracks</h2>
      <p>This page records meaningful changes to Word Helper — new tools, substantial content improvements, quality fixes, and policy updates. It does not list every small style tweak or technical rebuild. It exists so readers can see that the site is actively maintained and improving, and so corrections are visible rather than silent.</p>`,
      `<h2>July 2026</h2>
      <ul>
        <li><strong>Creator identity added:</strong> Word Helper now clearly identifies its creator and maintainer, <a href="/creator/">Jay Sudha</a> (Shatanjay Sudha), across the About, Editorial Policy, Contact, and Editorial Team pages, with a dedicated Creator page and machine-readable creator information.</li>
        <li><strong>Accessibility Statement published:</strong> a new <a href="/accessibility/">Accessibility Statement</a> describes the site's WCAG 2.2 AA target, what is in place, known limitations, and how to report an accessibility issue.</li>
        <li><strong>Word tools accuracy fix:</strong> corrected the in-browser word dictionary so common everyday words are included, and updated tool descriptions to state the real dictionary size honestly.</li>
        <li><strong>Word pages improved:</strong> added a plain-language "In simple terms" line to word pages where a reliable definition allows it, without inventing meanings.</li>
        <li><strong>Fifteen new word lists and guides</strong> added across writing, exams, word games, and everyday vocabulary.</li>
        <li><strong>Policy accuracy pass:</strong> tightened privacy, cookie, terms, disclaimer, and advertising pages for internal consistency and precise, non-overclaiming wording.</li>
      </ul>`,
      `<h2>June 2026</h2>
      <ul>
        <li><strong>Five new word tools added:</strong> Word Finder (offline, find words containing specific letters), Synonym Finder, Antonym Finder (both using live Datamuse results), Word Counter (in-browser text statistics), and Random Word Generator. Total tools now: 11.</li>
        <li><strong>Site-wide quality audit completed:</strong> fixed factual claims on homepage quiz card, corrected privacy/cookie/affiliate policy language to accurately reflect that advertising and analytics are not currently active, removed outdated dark-mode reference from Cookie Policy.</li>
        <li><strong>Content Security Policy tightened:</strong> pre-emptive AdSense/Analytics domains removed from CSP headers. These will be restored only when advertising is actually activated.</li>
        <li><strong>Host canonical corrected:</strong> canonical URLs, sitemap, and schema now resolve to the site's active production host, rather than to a branded domain that was not yet attached at the time (June 2026). Policies and how-to guides updated to reflect current state.</li>
        <li><strong>Editorial Policy updated:</strong> added explicit AI disclosure section explaining where AI is used in content production (example-sentence generation and standardization only), and what AI is not used for.</li>
        <li><strong>Single-theme design:</strong> dark mode removed; site now uses one premium warm light theme.</li>
        <li><strong>Edge-cache bug fixed:</strong> word pages were occasionally serving stale content after a redeploy. Root cause (stale colo-level cache not cleared on direct-upload deploys) identified and fixed by removing shared-cache usage from the Pages Function.</li>
      </ul>`,
      `<h2>How to report an issue</h2>
      <p>If you notice an error, a stale correction, or anything that looks wrong, please <a href="/contact/">contact Word Helper</a>. Corrections go live as quickly as we can confirm and fix them — we do not wait for a scheduled update.</p>`,
    ],
  },
];
