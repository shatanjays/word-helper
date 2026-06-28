export const site = {
  name: "Word Helper",
  url: "https://wordhelper.online",
  email: "hello@wordhelper.online",
  description:
    "Word Helper is an English word toolkit: look up definitions, pronunciation, synonyms, and etymology, then solve word puzzles, find rhymes, count syllables, and build vocabulary. Editorially reviewed.",
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
  { href: "/affiliate-disclosure/", label: "Affiliate Disclosure" },
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
      { label: "Dormitory", value: "Dormitory", note: "Spaces and punctuation are ignored." },
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
      "Syllable counts can vary by accent, pronunciation, dialect, and poetic usage. This tool follows standard English pronunciation; counts can shift with accent, dialect, and poetic usage.",
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
      "Open any synonym to read its full definition, pronunciation, and examples.",
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
      "Open any antonym to read its full definition, pronunciation, and examples.",
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
];

export const hubs = [
  {
    href: "/word-games/",
    icon: "games",
    title: "Word Games Hub",
    h1: "Word Game Tools — Solve Letters, Anagrams, and Patterns",
    metaTitle: "Word Game Helper — Unscramble Letters, Anagrams, and Patterns | Word Helper",
    metaDescription:
      "Comprehensive word game tools for unscrambling letters, solving exact and partial anagrams, finding words by pattern, and checking letter counts. Works for Scrabble, Wordle, crosswords, and any letter-based game. Works for Scrabble, Wordle, crosswords, and any letter-based game.",
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
        a: "Word Explorer pages bring together pronunciation, syllable breakdowns, word families, synonyms, and example sentences from openly licensed dictionary sources, standardized into one clean format. The tools then add interactive capabilities a static dictionary cannot: live letter unscrambling, rhyme suggestion, syllable counting, and pattern-based word search.",
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
      "Word Helper makes English spelling patterns accessible by grouping words that share starting or ending letters. Prefix Finder and Suffix Finder draw from a comprehensive 327,000-word English database to show what words follow each pattern — useful for spelling study, word game clues, vocabulary exploration, and classroom practice.",
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
    body: [
      {
        heading: "Start with letter counts",
        text: "A candidate word is only valid when every letter can be supplied by your input. This is why duplicate letters matter: one t cannot make a word with two t's.",
      },
      {
        heading: "Use patterns after the first pass",
        text: "If a board gives you a starting letter, ending letter, or contained letter, apply that filter after the broad search.",
      },
      {
        heading: "Try Word Helper",
        text: "Use the Word Unscramble tool for broad words-from-letters results, then scan by length.",
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
    body: [
      {
        heading: "What makes an anagram exact?",
        text: "An exact anagram uses every single letter from the input exactly once — no letter is left over and no letter is used twice. The word 'listen' is a perfect example: rearranging its six letters gives 'silent', 'enlist', 'tinsel', and 'inlets' — all six-letter words using L, I, S, T, E, N in a different order. If you change 'listen' to 'listens' (adding an S), the exact anagrams change entirely. Even one extra letter makes the previous results invalid in exact mode.",
      },
      {
        heading: "What makes an anagram partial?",
        text: "A partial anagram uses some of the available letters, not all of them. If you enter 'dormitory', partial mode will find 'dirty', 'dorm', 'trod', 'drip', and many other shorter words hidden inside the longer set of letters. These words use a subset of the letters in 'dormitory' but do not need to use every one. Partial mode is essentially the same as broad word unscrambling — it finds all words buildable from the input letters rather than requiring full usage.",
      },
      {
        heading: "When to use exact mode",
        text: "Use exact mode when a clue, puzzle, or game expects every letter to be rearranged into another valid word or phrase. Cryptic crossword clues often work this way: 'Rearrange STONE to find a musical sound' leads you to 'TONES' as the exact anagram. Exact mode is also useful for name anagrams, phrase puzzles, and word games where the whole-word constraint is part of the challenge.",
      },
      {
        heading: "When to use partial mode",
        text: "Use partial mode when you have a long phrase or word and want to find the playable or useful words hidden inside it. If a word game gives you a seven-letter rack, partial mode shows all valid 3-, 4-, 5-, 6-, and 7-letter words you could play from those letters. Partial mode is also helpful when exact mode returns no results — if the input cannot be rearranged into one complete valid word, partial mode will still show smaller words that are valid.",
      },
      {
        heading: "How Word Helper handles spaces and punctuation",
        text: "Word Helper's Anagram Solver removes spaces and punctuation before comparing letters. This means you can paste a short phrase and the tool will treat all the letters together. 'A gentleman' becomes AGENTLEMAN and the solver looks for anagrams or sub-words from all ten letters. This is how classic phrase anagrams work: 'Election results' rearranges into 'Lies — let's recount'. The tool strips punctuation and spaces, then applies the mode you chose.",
      },
      {
        heading: "Comparing exact and partial: a worked example",
        text: "Take the word 'stone'. In exact mode, the Anagram Solver finds 'tones', 'notes', 'onset', and 'seton' — four-letter or five-letter words using S, T, O, N, E exactly once. In partial mode, you also get 'tone', 'note', 'nose', 'tons', 'ones', 'net', 'ten', 'set', and dozens more — any valid word that can be built from some of those five letters. Exact gives you a focused list of precise rearrangements; partial gives you a broad inventory of buildable words.",
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
    body: [
      {
        heading: "What makes a rhyme perfect?",
        text: "A perfect rhyme — also called an exact rhyme or true rhyme — shares an identical ending sound from the stressed vowel onwards. 'Light' and 'night' both end with the sound /aɪt/. 'Dream' and 'stream' both end with /iːm/. The beginning sounds of the words (the onset) are different, but everything from the vowel to the end is the same. Perfect rhymes create a strong, satisfying sense of closure. They are the standard in nursery rhymes, traditional ballads, and song choruses where sonic resolution is intentional.",
      },
      {
        heading: "What makes a rhyme near?",
        text: "A near rhyme — also called a slant rhyme, half rhyme, or off rhyme — shares some ending sound without matching exactly. 'Love' and 'move' end with similar but not identical vowel sounds (/ʌv/ vs. /uːv/). 'Hope' and 'stop' share an ending consonant but the vowels differ. 'Worm' and 'form' sound related but do not technically rhyme. Near rhymes create a sense of sonic connection without the finality of a perfect match. This slightly unresolved feeling is often exactly what a lyric needs — it keeps the listener engaged rather than settling everything too neatly.",
      },
      {
        heading: "Why near rhymes dominate modern lyrics",
        text: "English has a limited number of perfect rhymes for many common words. 'Orange', 'purple', 'silver', and 'month' have no common perfect rhymes at all. Forcing a perfect rhyme often means choosing a word that sounds right but breaks the meaning or natural flow of the line. Near rhymes solve this: a word that feels phonetically close is often more natural and expressive than the nearest perfect rhyme that fits the sound but not the sense. Many of the most celebrated song lyrics — from Bob Dylan to Kendrick Lamar — use near rhymes throughout.",
      },
      {
        heading: "Similar endings versus actual rhymes",
        text: "A third category — similar endings or eye rhymes — involves words that look like they should rhyme based on spelling but do not sound alike in speech. 'Love' and 'prove' end in -ove but are pronounced differently. 'Word' and 'sword' end in -ord but sound different. Eye rhymes appear in older English poetry written before spelling was standardised, and occasionally in modern verse as a deliberate visual or ironic choice. Word Helper's Rhyme Finder includes similar ending suggestions as a brainstorming aid, but these should always be verified by reading aloud.",
      },
      {
        heading: "How to choose: a practical framework",
        text: "Start by finding your target word's perfect rhymes — these are the gold standard and should be tried first if they fit the meaning. If no perfect rhyme fits the line without distorting the meaning or sounding forced, explore near rhymes for options that feel natural when spoken. When you have a candidate, read the full line aloud: if it sounds connected and the meaning holds, the rhyme works regardless of whether it is perfect or near. The goal of rhyme is to serve the writing, not to demonstrate technical correctness.",
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
    body: [
      {
        heading: "Why accent and dialect change the count",
        text: "English is spoken across dozens of distinct accent groups, and many of them pronounce the same word differently. In some American accents, 'caramel' is two syllables (CAR-ml); in others it is three (CAR-a-mel). In Received Pronunciation British English, 'schedule' is three syllables (SHED-yool); in General American it is also three (SKED-jool), but the vowels differ. 'Poem' is two syllables in most accents (POH-em) but can compress to one in fast casual speech. These differences are features of accent, not errors — and they mean that any estimate of syllable count is accent-dependent.",
      },
      {
        heading: "How speech speed and connected speech affect counts",
        text: "At normal conversational speed, English speakers routinely compress syllables through a process called elision. 'Every' collapses from three syllables to two in natural speech (EV-ry). 'Temperature' often becomes three syllables (TEMP-ra-ture) even though it has four in careful speech (TEMP-er-a-ture). 'Comfortable' is four syllables carefully pronounced (COM-fort-a-ble) but often two or three in relaxed speech. A syllable counter working from letter patterns cannot model this kind of natural speech compression — it counts the full, careful pronunciation. This means counts may be slightly higher than what a native speaker would produce in natural conversation.",
      },
      {
        heading: "How poetry bends syllable counts",
        text: "Poets have long used two techniques that change syllable counts from their standard spoken form. Elision in poetry deliberately removes a syllable for metrical purposes — 'over' becomes 'o'er', 'ever' becomes 'e'er'. Expansion stretches a word to add a syllable for rhythm — 'power' becomes 'pow-er' (two syllables) when a line needs an extra beat. Both techniques were common in classical English verse and appear in Shakespeare, Milton, and Keats. When using a syllable counter for poetry, treat the result as a starting point for the line — the poem's meter often requires deliberate adjustment.",
      },
      {
        heading: "Words where counts commonly vary",
        text: "Several English words are frequently counted differently depending on accent, context, or speaker: 'interest' (2 or 3 syllables), 'different' (2 or 3), 'chocolate' (2 or 3), 'business' (2 or 3), 'family' (2 or 3), 'evening' (2 or 3), 'prisoner' (2 or 3), 'suffering' (2 or 3), and 'realise/realize' (3 or 4). For poetry, each of these may be used as either count depending on the meter the poet is writing in. The Word Helper Syllable Counter will produce one estimate for each word; for variable words like these, checking both counts in the context of your line is the safest approach.",
      },
      {
        heading: "How to use the Syllable Counter effectively",
        text: "Use the Syllable Counter as a fast first estimate for any word or sentence. Paste your full line or stanza to see the total beat count. The word-by-word breakdown shows where beats are distributed across the line — this is especially useful for identifying which word is making a line feel too long or too heavy. For any word where the count seems off, say the word aloud at normal speech speed, count your chin drops (each drop is one syllable), and use that as your working count. The tool gives you the standard count to work from; your ear settles the accent and meter nuances.",
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
    body: [
      {
        heading: "Prefixes show beginnings",
        text: "Starting patterns such as pre-, un-, re-, and mis- can connect words into families.",
      },
      {
        heading: "Suffixes show endings",
        text: "Endings such as -ing, -less, -tion, and -able can signal tense, noun forms, or adjective forms.",
      },
      {
        heading: "Spelling is not always meaning",
        text: "A letter pattern may look like a prefix or suffix without acting as one, so Word Helper labels its matching as letter-based.",
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
    body: [
      {
        heading: "Step 1 — Enter all available letters first",
        text: "The first move in any word game session on Word Helper is to enter all the letters you have into the Word Unscramble tool and run a broad search with no filters. This gives you the complete set of valid words that can be built from your rack or tile set. Scan the results grouped by word length — longer words usually score higher, so review the longest group first. This full picture is your starting inventory before any board constraints are applied.",
      },
      {
        heading: "Step 2 — Add board constraints as filters",
        text: "After the broad search, apply filters that reflect what the game board tells you. If the board has a fixed starting letter, use the starts-with filter. If you know the word must end with a specific letter, use ends-with. If a letter must appear somewhere in the middle, use contains. If the game specifies a word length, use the minimum and maximum length filters to remove words that do not fit. Each filter reduces the result set to a focused list of candidates that match both your letters and the board's requirements.",
      },
      {
        heading: "Step 3 — Use wildcards for blank tiles",
        text: "Most word games include blank tiles or wild tiles that can represent any letter. In Word Helper, enter ? or * in the position of an unknown or blank tile. The tool treats the wildcard as a flexible letter that can fill missing gaps in otherwise valid words. For example, entering t?me returns 'time', 'tame', 'tome', and other words where the wildcard fills the second position. This makes blank tile strategy much easier because you can see every word the blank could complete.",
      },
      {
        heading: "Step 4 — Switch to Anagram Solver for clue-based puzzles",
        text: "Some word games and all cryptic crossword anagram clues expect every letter to be rearranged into one complete valid word. For these, use the Anagram Solver in exact mode. Exact mode only returns words that use every letter exactly once — it is stricter than Word Unscramble and correct for this type of clue. If exact mode returns nothing, switch to partial mode to see smaller words hidden in the letters, or return to Word Unscramble with the full set of letters.",
      },
      {
        heading: "Step 5 — Verify results against the game's dictionary",
        text: "Word Helper uses the public-domain ENABLE word list, which is a large, comprehensive English word source. However, different games use different official dictionaries: Scrabble uses TWL or Collins SOWPODS; Wordle uses a specific curated list; crossword games use their own databases. A word that appears in Word Helper results may not be accepted in every game. Always confirm a final answer in the game before playing — treat Word Helper results as a shortlist of candidates to check, not a guaranteed approved list.",
      },
      {
        heading: "Prefix and suffix tools for partial-information clues",
        text: "When a clue or board position gives you the first letters of a word without the rest, use the Prefix Finder. Enter the known starting letters and browse all words beginning with that pattern. Similarly, when you know the ending of a word, use the Suffix Finder. Both tools support length filters so you can narrow to words of the exact size required. For games where you gradually reveal letters — like Wordle — these tools help you generate plausible candidates from the letters you have confirmed.",
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
    body: [
      {
        heading: "Find rhyme options first",
        text: "Start with a target word, then compare perfect rhymes, near rhymes, and similar endings.",
      },
      {
        heading: "Check the line rhythm",
        text: "A good rhyme can still break a line if it adds too many syllables.",
      },
      {
        heading: "Choose meaning over matching",
        text: "The strongest rhyme is the one that fits the line's meaning, voice, and rhythm.",
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
    title: "About Word Helper",
    h1: "About Word Helper",
    metaTitle: "About Word Helper — English Word Tools & Vocabulary Reference",
    metaDescription:
      "Learn about Word Helper: the word tools, Word Explorer dictionary pages, Learn English guides, Word Lists, Practice quizzes, and how content is created and reviewed.",
    bodyHtml: [
      `<h2>What Word Helper is</h2>
      <p>Word Helper is an English word toolkit and vocabulary reference built for every kind of word task — solving scrambled letters, finding rhymes, counting syllables, exploring word meanings, building vocabulary, and learning language patterns. Every section connects to the same word database and quality standard.</p>`,
      `<h2>Who runs Word Helper</h2>
      <p>Word Helper is an independent project focused on making English words easier to look up, understand, and use. It is run independently and is not affiliated with, or endorsed by, any dictionary publisher, word-game company, or advertiser.</p>
      <p>The site does not employ a large editorial staff or claim academic credentials it does not have. Instead, it is honest about its method: word data is compiled from openly licensed dictionary sources, standardized into one consistent format, screened for quality, and structured for clarity — with a strict gate that decides which pages are complete enough to publish. Full sourcing and license attribution is documented in the <a href="/editorial-policy/">Editorial Policy</a>. Questions and corrections are welcome at <a href="mailto:hello@wordhelper.online">hello@wordhelper.online</a>.</p>`,
      `<h2>Word Lab — nine interactive Word Experiences</h2>
      <p>Word Lab gives you nine focused tools for specific word tasks. Each one has a clear input, honest results, and a plain explanation of what the tool can and cannot do.</p>
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
      </ul>`,
      `<h2>Word Explorer — dictionary-grade word pages</h2>
      <p>Word Explorer is Word Helper's dictionary section. Each published word page includes a definition, pronunciation guide, syllable breakdown, part of speech, synonyms, antonyms, word family, and example sentences. This data is compiled from openly licensed sources — the <a href="https://www.datamuse.com/api/" rel="nofollow noopener" target="_blank">Datamuse API</a> (which builds on Wiktionary) and the <a href="https://dictionaryapi.dev/" rel="nofollow noopener" target="_blank">Free Dictionary API</a> — then standardized, screened, and structured to a consistent format. See the <a href="/editorial-policy/">Editorial Policy</a> for full sourcing and attribution.</p>
      <p>The search index and word tools draw on a database of more than 327,000 English words. A word earns a full, indexed page only when it passes Word Helper's quality gate — a complete definition, pronunciation, syllables, examples, and synonyms — and the published set grows continuously. Only these complete pages are listed and indexed.</p>`,
      `<h2>Learn English, Word Lists, and Practice</h2>
      <p><a href="/learn-english/">Learn English</a> provides plain-language vocabulary guides covering topics like building vocabulary, understanding word roots, how syllables work, how rhyme works, spelling patterns, and memory techniques.</p>
      <p><a href="/word-lists/">Word Lists</a> are hand-curated collections of words organised by theme — common English words, positive vocabulary, academic words, words for writers, strong action verbs, and descriptive adjectives. Every word in a list includes its meaning and an example sentence.</p>
      <p><a href="/practice/">Practice</a> contains vocabulary quizzes built from Word Explorer definitions. You see a definition and choose the correct word from four options. Each quiz is a quick, self-paced vocabulary check with instant feedback.</p>`,
      `<h2>Who Word Helper is for</h2>
      <p>Word Helper is built for word-game players who need valid words from scrambled letters, writers who want rhyme options or rhythm checks, students and teachers looking for vocabulary and spelling patterns, English learners building their word knowledge, and anyone who wants a focused word answer with a clear, authoritative answer.</p>`,
      `<h2>How to read Word Helper results</h2>
      <p>Word Helper is descriptive: it reflects how English is actually used rather than enforcing a single game dictionary, classroom rule, or style guide. Syllable counts follow standard English pronunciation and may differ by accent, dialect, and speech speed. Rhyme results combine pronunciation and spelling patterns. Each page explains how its results are produced so you can apply them confidently in your own context.</p>`,
      `<h2>Reporting errors and contacting us</h2>
      <p>The site is maintained and reviewed by Word Helper. If you notice an error, a confusing result, a missing word, or any content concern, <a href="/contact/">contact Word Helper at hello@wordhelper.online</a>. Content corrections and tool accuracy issues are reviewed and fixed as quickly as possible.</p>`,
    ],
  },
  {
    href: "/contact/",
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
      <p>If you have a question about how a specific tool works, the <a href="/guides/">Word Helper Guides</a> cover how to get the best results from each tool. If you are looking for information about how content is created or reviewed, the <a href="/editorial-policy/">Editorial Policy</a> explains our standards. If you have a question about advertising, see the <a href="/affiliate-disclosure/">Affiliate Disclosure</a>.</p>`,
    ],
  },
  {
    href: "/privacy-policy/",
    title: "Privacy Policy",
    h1: "Privacy Policy",
    metaTitle: "Privacy Policy - Word Helper",
    metaDescription:
      "Read the Word Helper Privacy Policy, including notes about tool inputs, cookies, analytics, advertising, and contact requests.",
    body: [
      "Word Helper is the English word toolkit available at wordhelper.online. This Privacy Policy explains how this website handles information in a practical, plain-language way.",
      "Tool inputs are processed in your browser. The interactive word tools run entirely in your browser and do not send your input text to a server. Do not enter private, sensitive, regulated, or confidential text if you do not want it handled by a public website interface.",
      "Word Helper uses local browser storage (localStorage) to remember your color theme preference, recently used tools, and recent tool inputs. This data stays on your device and is not transmitted to any server.",
      "Word Helper may use advertising services, including Google AdSense, to display advertisements. Google AdSense may use cookies and similar technologies to serve ads based on your prior visits to this website and other sites. Google's use of advertising cookies enables it and its partners to serve ads based on your visit to this site and other sites on the internet. You may opt out of personalized advertising by visiting Google's Ads Settings at https://adssettings.google.com.",
      "Word Helper may use web analytics services to understand how the site is used. Analytics tools may set cookies or use similar tracking technologies to collect anonymous usage data such as page views, device type, and general location.",
      "If you contact Word Helper at hello@wordhelper.online, your email address and message are used to respond to your request and improve the website. We do not sell or share contact information with third parties.",
      "Third-party ad servers or ad networks may use technologies such as cookies, JavaScript, or web beacons to measure ad effectiveness and personalize ad content. Word Helper has no access to or control over cookies used by third-party advertisers.",
      "Your choices and regional rights. If you are in the EEA, the UK, or California, you have rights over your personal data, including access, correction, deletion, and the right to opt out of personalized advertising. You can manage Google personalized advertising at https://adssettings.google.com and control or clear cookies through your browser settings. Because Word Helper requires no account and processes tool inputs in your browser, the site does not build a personal profile of you.",
      "Who is responsible for your data. Word Helper is operated independently. For any privacy question or data request, contact hello@wordhelper.online and we will respond as quickly as we can.",
      "If you have questions about this policy, contact us at hello@wordhelper.online.",
    ],
  },
  {
    href: "/terms/",
    title: "Terms and Conditions",
    h1: "Terms and Conditions",
    metaTitle: "Terms and Conditions — Word Helper",
    metaDescription:
      "Read the Word Helper Terms and Conditions covering use of the word tools, Word Explorer pages, learning guides, word lists, and practice quizzes on wordhelper.online.",
    bodyHtml: [
      `<h2>Acceptance of terms</h2>
      <p>These Terms and Conditions govern your use of Word Helper at wordhelper.online. By using any part of this website — including the Word Lab tools, Word Explorer dictionary pages, Learn English guides, Word Lists, or Practice quizzes — you agree to these terms. If you do not agree, do not use the website.</p>`,
      `<h2>What Word Helper provides</h2>
      <p>Word Helper provides a comprehensive suite of word tools for writing support, vocabulary learning, word game play, spelling pattern discovery, and creative word exploration. The tools include Word Unscramble, Anagram Solver, Rhyme Finder, Syllable Counter, Prefix Finder, and Suffix Finder. The site also includes dictionary-quality word pages, curated word lists, guided learning articles, and vocabulary quizzes.</p>
      <p>All tools, word pages, guides, lists, and quizzes are openly accessible and do not require registration. The site may display advertising served by third-party providers including Google AdSense.</p>`,
      `<h2>Accuracy and limitations of results</h2>
      <p>Tool results reflect standard English usage and the Word Helper word database. Acceptance can differ across specific game dictionaries, pronunciation standards, accents, dialects, regional usage, and classroom or editorial rules. Word Helper does not warrant that a given result will be accepted in any specific game, contest, publication, classroom, or professional context.</p>
      <p>Syllable counts follow standard English pronunciation and may differ across regional accents and dialects. Rhyme suggestions span perfect rhymes, near rhymes, and similar endings, and are best confirmed by reading aloud. Unscramble and anagram results draw on the public-domain ENABLE word list, which may differ from a specific game's official word list. These notes are documented on each relevant page.</p>`,
      `<h2>Permitted use</h2>
      <p>You may use Word Helper for personal, educational, creative, and non-commercial purposes. You may share links to Word Helper pages. You may use tool results and word content for your own learning, writing, and word game play.</p>
      <p>You may not copy, republish, redistribute, scrape, or reproduce Word Helper's definitions, examples, guides, or other editorial content for any commercial purpose without written permission. You may not attempt to reverse engineer, scrape at scale, overload, or interfere with the operation of this website.</p>`,
      `<h2>No professional advice</h2>
      <p>Word Helper is an educational word-tools platform. Nothing on this site constitutes legal, medical, financial, linguistic authority, or other professional advice. Do not rely on Word Helper results for professional, academic, publishing, legal, or medical purposes without independent verification.</p>`,
      `<h2>Third-party services</h2>
      <p>Word Helper may use advertising services, including Google AdSense, and may use web analytics services to understand how the site is used. These services are governed by their own terms and privacy policies. Word Helper has no responsibility for the practices of third-party services.</p>`,
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
      <p>Word Helper is an educational platform intended to support learning, creativity, and word exploration. All tools, word pages, guides, and practice sessions are provided for educational purposes. Word Helper is not a legal, medical, financial, or professional authority on language.</p>`,
      `<h2>Word meanings vary by context</h2>
      <p>English word meanings are not fixed. The same word may carry different meanings in different contexts, fields, time periods, or regions. Definitions on Word Helper reflect common general meanings and are provided for learning purposes. They do not cover every technical, legal, medical, or domain-specific use of a word. For specialized meanings in professional contexts, consult authoritative sources in the relevant field.</p>`,
      `<h2>How definitions and examples are produced</h2>
      <p>Definitions, pronunciations, syllable counts, and related words on Word Helper are compiled from openly licensed dictionary sources — such as Wiktionary (via the Datamuse API) and the Free Dictionary API — and standardized into a consistent format. Example sentences are drawn from these sources where available, and are otherwise generated and then automatically screened for clarity. Because this process is largely automated, occasional errors or awkward phrasings can occur; please <a href="/contact/">report anything that looks wrong</a> and we will review and correct it. Sourcing and license attribution is documented in the <a href="/editorial-policy/">Editorial Policy</a>.</p>`,
      `<h2>Pronunciation and syllable counts vary by accent</h2>
      <p>Pronunciation guides and syllable counts on Word Helper follow standard English pronunciation. Spoken English varies by accent, dialect, region, and speech speed, so a syllable count common in one accent may differ in another. Pronunciation is provided to guide learners; confirm it aloud in the context where it matters. Pronunciation is shown as a guide to help learners, not as the sole correct form. Always check pronunciation aloud in the context where it matters.</p>`,
      `<h2>Word tool results depend on source word lists</h2>
      <p>Word Unscramble, Anagram Solver, Prefix Finder, and Suffix Finder results come from the public-domain ENABLE word list. A word that appears in results is valid in this list but may not be accepted by every game dictionary, classroom rule, or publication style guide. Word Helper does not guarantee that any result will be accepted in a specific game, class, or editorial context.</p>`,
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
      `<h2>How word content is created</h2>
      <p>Word Helper compiles its word data from open, openly licensed language sources and standardizes it into one consistent format. Definitions, parts of speech, pronunciations, syllable counts, synonyms, antonyms, and related words are drawn from the <a href="https://www.datamuse.com/api/" rel="nofollow noopener" target="_blank">Datamuse API</a> (which builds on Wiktionary and other open datasets) and the <a href="https://dictionaryapi.dev/" rel="nofollow noopener" target="_blank">Free Dictionary API</a>. Example sentences use real dictionary citations where available, and are otherwise generated and then automatically screened for clarity and accuracy before publication.</p>
      <p>Word Helper's own editorial work is the <strong>selection, standardization, screening, and structuring</strong> of this data — choosing which words and senses to surface, formatting each entry to a consistent template, filtering out low-quality or malformed results, and applying a strict quality gate (below) that decides which pages are complete enough to publish and index. We do not claim to have independently authored every definition; we curate and quality-control openly licensed reference data and present it clearly.</p>`,
      `<h2>How data sources are handled</h2>
      <p>Word Helper uses the public-domain ENABLE word list as its dictionary backbone. This list covers valid English words and is used solely as a word inventory — its presence does not imply any editorial quality claim about individual words. Tool results (unscramble, anagram, prefix, suffix) are drawn from this list with letter-frequency logic. Rhyme and syllable tools use pattern-matching logic. All source usage is documented and legally verified before deployment.</p>`,
      `<h2>How corrections are reviewed</h2>
      <p>Content corrections can be submitted by email to hello@wordhelper.online. Reports of factual errors, definition inaccuracies, broken tool results, or misleading content are treated as high priority. Corrections are reviewed, verified, and applied to the source files. Updated pages are rebuilt and redeployed as quickly as possible. We do not wait for a scheduled update cycle to fix confirmed errors.</p>`,
      `<h2>Sources, licensing, and attribution</h2>
      <p>Word Helper builds on openly licensed reference data and credits its sources:</p>
      <ul>
        <li><strong>Headword inventory:</strong> the public-domain <strong>ENABLE</strong> word list (used for the 327,000-word search index and the word-game tools).</li>
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
      "Read the Word Helper Cookie Policy, including local storage, advertising cookies, and analytics.",
    body: [
      "Word Helper uses local browser storage (localStorage) to remember your color theme preference (light or dark mode), recently used tools, and recent tool inputs. These values are stored only on your device and are not shared with any third party.",
      "Word Helper displays advertisements served by Google AdSense. Google AdSense uses cookies to serve ads and may use browsing history across websites to personalize ad content. These are third-party advertising cookies set by Google and its advertising partners, not by Word Helper directly.",
      "Google's advertising cookies may collect information such as which pages you visit, how long you spend on pages, and the type of device you use. This data helps Google serve relevant ads and measure ad performance.",
      "Word Helper may use web analytics tools that set first-party or third-party cookies to collect anonymous data about site usage, including page views, session duration, and general geographic region.",
      "You can control, disable, or delete cookies through your browser settings. Clearing localStorage will reset your theme preference, recent tools list, and recent inputs. Disabling third-party cookies will affect ad personalization but will not affect the core word-tool functionality of this site.",
      "To opt out of Google personalized advertising, visit https://adssettings.google.com. For more information about Google's data practices, see the Google Privacy Policy at https://policies.google.com/privacy.",
      "If you have questions about this policy, contact us at hello@wordhelper.online.",
    ],
  },
  {
    href: "/affiliate-disclosure/",
    title: "Affiliate Disclosure",
    h1: "Affiliate Disclosure",
    metaTitle: "Affiliate Disclosure — Word Helper",
    metaDescription:
      "Read the Word Helper affiliate disclosure: how advertising works on this site, how any affiliate relationships would be disclosed, and how the platform is supported.",
    bodyHtml: [
      `<h2>About Word Helper's independence</h2>
      <p>Word Helper is a comprehensive English dictionary and word-tools platform, built and maintained by Word Helper for word-game players, writers, students, teachers, and English learners. All tool pages, dictionary pages, learning guides, word lists, and quizzes are created independently with no influence from advertisers, sponsors, or external commercial partners.</p>`,
      `<h2>How Word Helper is supported</h2>
      <p>Word Helper displays advertising through Google AdSense and similar advertising networks. These advertisements are served automatically by Google and its advertising partners based on your browsing context. Revenue from advertising helps cover the costs of hosting, development, and maintaining the content on this site.</p>
      <p>Advertisements on Word Helper are clearly separated from editorial content. The placement of an advertisement near a word page, tool page, or guide does not represent an endorsement by Word Helper of any product or service advertised.</p>`,
      `<h2>Affiliate links</h2>
      <p>At this time, Word Helper does not use affiliate links as a core part of the site experience. If affiliate links, sponsored recommendations, sponsored word lists, or paid placements are added in the future, each instance will be clearly labeled with a disclosure such as "affiliate link", "sponsored", or "advertisement" placed near the relevant link or content.</p>
      <p>Any future affiliate relationships will be subject to these conditions: they will not influence which words, tools, guides, or educational content appear on the site; they will not affect the accuracy or completeness of tool results; and they will not be used in a way that misleads users about the nature of the relationship.</p>`,
      `<h2>Editorial independence</h2>
      <p>All editorial decisions on Word Helper — which words to include, how definitions are written, which guides are published, and how tools work — are made based on educational usefulness and quality standards. Advertising revenue, affiliate compensation, and commercial relationships do not influence these decisions.</p>
      <p>Word Helper's Editorial Policy explains in detail how content is created, reviewed, and corrected. If you believe any content on this site has been commercially influenced in a way that is not disclosed, please contact us at <a href="mailto:hello@wordhelper.online">hello@wordhelper.online</a>.</p>`,
      `<h2>Questions about commercial relationships</h2>
      <p>If you have questions about how Word Helper is supported, what advertising is shown, or any commercial relationship that may affect this site, contact us at <a href="mailto:hello@wordhelper.online">hello@wordhelper.online</a>. We are committed to being transparent about how the platform is supported and sustained.</p>`,
    ],
  },
];
