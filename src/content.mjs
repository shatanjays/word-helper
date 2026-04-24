export const site = {
  name: "Word Helper",
  url: "https://wordhelper.online",
  email: "hello@wordhelper.online",
  description:
    "Word Helper is a free word tools platform for unscrambling letters, solving anagrams, finding rhymes, counting syllables, and finding prefixes or suffixes.",
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
  { href: "/", label: "Home" },
  { href: "/tools/", label: "Tools" },
  { href: "/about/", label: "About" },
  { href: "/contact/", label: "Contact" },
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
  { href: "/editorial-policy/", label: "Editorial Policy" },
  { href: "/cookie-policy/", label: "Cookie Policy" },
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
      "A syllable counter estimates how many spoken beats appear in a word or sentence. Word Helper gives a practical breakdown, but pronunciation, accent, and poetic usage can change the final count.",
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
      "For poetry, treat the result as a drafting aid and make final choices by sound.",
    ],
    faqs: [
      {
        q: "How do I count syllables in a word?",
        a: "A practical estimate starts by counting spoken vowel beats, then adjusting for silent letters and common pronunciation patterns.",
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
      "Syllable counts can vary by accent, pronunciation, dialect, and poetic usage. This tool gives a practical estimate, not a guaranteed pronunciation authority.",
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
];

export const hubs = [
  {
    href: "/tools/",
    icon: "tools",
    title: "Free Word Tools",
    h1: "Free Word Tools",
    metaTitle: "Free Word Tools - Word Helper Tool Hub",
    metaDescription:
      "Explore Word Helper tools for scrambled letters, anagrams, rhymes, syllables, prefixes, suffixes, writing, and word games.",
    answer:
      "Word Helper gives you focused tools for letters, sounds, syllables, and word patterns. You can unscramble letters, solve anagrams, find rhymes, count syllables, and search words by prefix or suffix.",
    sections: [
      {
        heading: "Choose the tool that matches the job",
        text: "Use the letter tools when you have scrambled tiles or an anagram clue. Use rhyme and syllable tools when you are shaping a poem, lyric, caption, or speech. Use prefix and suffix tools when you need spelling patterns or vocabulary families.",
      },
      {
        heading: "Why the tools are separate",
        text: "A word unscrambler, anagram solver, rhyme finder, syllable counter, prefix finder, and suffix finder answer different questions. Keeping them separate makes the result area clearer and avoids generic output.",
      },
    ],
    links: toolNav,
    faqs: [
      {
        q: "What can I do with Word Helper?",
        a: "You can find words from scrambled letters, solve exact or partial anagrams, find rhyme ideas, estimate syllables, and search words by starting or ending patterns.",
      },
      {
        q: "Are these tools only for word games?",
        a: "No. They also help writers, students, poets, lyricists, teachers, and vocabulary learners.",
      },
      {
        q: "Do the tools use fake results?",
        a: "No. Word results come from a local word list and tool-specific matching logic.",
      },
    ],
  },
  {
    href: "/word-games/",
    icon: "games",
    title: "Word Games Hub",
    h1: "Word Games Hub",
    metaTitle: "Word Game Helper - Words From Letters and Pattern Tools",
    metaDescription:
      "Use Word Helper for scrambled letters, anagrams, duplicate letters, word length strategies, and pattern-based word game searches.",
    answer:
      "Word Helper supports word-game play by turning letters and patterns into scannable word lists. You can search by available letters, exact anagrams, starting letters, ending letters, and word length.",
    sections: [
      {
        heading: "Finding words from letters",
        text: "Start with Word Unscramble when you have a rack of letters. It checks letter counts so a word only appears when it can be built from your letters.",
      },
      {
        heading: "Using filters in word games",
        text: "Starts-with, ends-with, contains, and length filters help when a board or clue gives you fixed positions.",
      },
      {
        heading: "Duplicate letters and word length strategies",
        text: "Duplicate letters can change what is playable. If you only have one t, words needing two t's should not appear unless a wildcard is available.",
      },
    ],
    links: [
      "/tools/word-unscramble/",
      "/tools/anagram-solver/",
      "/tools/prefix-finder/",
      "/tools/suffix-finder/",
    ],
    faqs: [
      {
        q: "Which tool should I use for scrambled game letters?",
        a: "Use Word Unscramble for broad words-from-letters results, then add pattern filters if the game board gives you fixed letters.",
      },
      {
        q: "When should I use the Anagram Solver?",
        a: "Use it when a clue expects every letter to be rearranged into another valid word.",
      },
      {
        q: "Can prefix and suffix tools help games?",
        a: "Yes. They help when you know the start or end of the word but not the full answer.",
      },
    ],
  },
  {
    href: "/writing-tools/",
    icon: "writing",
    title: "Writing Tools Hub",
    h1: "Writing Tools for Better Word Choice",
    metaTitle: "Writing Tools - Rhymes, Syllables, and Word Pattern Helpers",
    metaDescription:
      "Free writing tools for rhyme ideas, syllable rhythm, captions, vocabulary variation, and word-choice support.",
    answer:
      "Word Helper gives writers quick support for rhyme ideas, sentence rhythm, captions, vocabulary variation, and word patterns without burying the writing task under clutter.",
    sections: [
      {
        heading: "Rhyme ideas for creative drafts",
        text: "The Rhyme Finder groups perfect rhymes, near rhymes, and similar endings so you can choose words by meaning as well as sound.",
      },
      {
        heading: "Sentence rhythm and spoken writing",
        text: "The Syllable Counter helps compare the spoken beats in poems, speeches, captions, and classroom writing.",
      },
      {
        heading: "Vocabulary variation",
        text: "Prefix and suffix tools help writers notice word families, spelling shifts, and related forms.",
      },
    ],
    links: [
      "/tools/rhyme-finder/",
      "/tools/syllable-counter/",
      "/tools/prefix-finder/",
      "/tools/suffix-finder/",
    ],
    faqs: [
      {
        q: "Can Word Helper help with captions?",
        a: "Yes. Rhyme and syllable tools can help short lines feel cleaner and easier to say.",
      },
      {
        q: "Can the tools replace editing?",
        a: "No. They are quick drafting aids. Final word choice should still fit the meaning and audience.",
      },
      {
        q: "Which writing tool should I start with?",
        a: "Use Rhyme Finder for sound, Syllable Counter for rhythm, and prefix or suffix tools for word patterns.",
      },
    ],
  },
  {
    href: "/rhyming-words/",
    icon: "rhyme",
    title: "Rhyming Words and Rhythm",
    h1: "Rhyming Words and Rhythm",
    metaTitle: "Rhyming Words - Rhyme and Syllable Tools for Writers",
    metaDescription:
      "Find rhyming words, compare near rhymes, understand similar endings, and check syllable rhythm for poems and lyrics.",
    answer:
      "Word Helper helps with rhyme and rhythm by pairing rhyme ideas with syllable estimates. That makes it easier to test both the ending sound and the beat of a line.",
    sections: [
      {
        heading: "Perfect rhymes, near rhymes, and similar endings",
        text: "Perfect rhymes are closer sound matches. Near rhymes give more flexible choices. Similar endings are useful for brainstorming but should be checked aloud.",
      },
      {
        heading: "Syllable rhythm",
        text: "Syllable counts help you compare the beat of poem lines, lyric drafts, and speeches.",
      },
      {
        heading: "Song and lyric use cases",
        text: "Near rhymes often make lyrics sound more natural because they leave space for meaning, tone, and phrasing.",
      },
    ],
    links: ["/tools/rhyme-finder/", "/tools/syllable-counter/"],
    faqs: [
      {
        q: "Should I choose a perfect rhyme every time?",
        a: "No. A near rhyme that fits the sentence can be stronger than a forced perfect rhyme.",
      },
      {
        q: "Why should I count syllables with rhymes?",
        a: "A rhyme may sound right but still make a line too long or too short. Syllable counts help catch that early.",
      },
      {
        q: "Do spelling endings always rhyme?",
        a: "No. English spelling is not a pronunciation guarantee, so similar endings should be read aloud.",
      },
    ],
  },
  {
    href: "/vocabulary/",
    icon: "vocabulary",
    title: "Vocabulary Learning Hub",
    h1: "Vocabulary Learning Hub",
    metaTitle: "Vocabulary Tools - Prefixes, Suffixes, and Word Families",
    metaDescription:
      "Build vocabulary with prefix families, suffix families, spelling patterns, word building, and classroom-friendly word discovery.",
    answer:
      "Word Helper supports vocabulary learning by showing word families, starting patterns, ending patterns, and words that can be built from letters.",
    sections: [
      {
        heading: "Prefix and suffix families",
        text: "Prefixes and suffixes help learners see how words are built. The tools match letters exactly while explaining when meaning may differ.",
      },
      {
        heading: "Word building",
        text: "Unscramble and anagram tools help students notice how the same letters can form different valid words.",
      },
      {
        heading: "Classroom use",
        text: "Teachers can use pattern lists for spelling practice, vocabulary warmups, and quick examples.",
      },
    ],
    links: [
      "/tools/prefix-finder/",
      "/tools/suffix-finder/",
      "/tools/word-unscramble/",
      "/tools/anagram-solver/",
    ],
    faqs: [
      {
        q: "Can prefixes and suffixes build vocabulary?",
        a: "Yes. They help learners connect spelling, meaning, and word formation across related words.",
      },
      {
        q: "Are all prefix matches meaningful prefixes?",
        a: "No. This site matches letters exactly, so it explains the difference between spelling patterns and meaning units.",
      },
      {
        q: "Can students use Word Helper for practice?",
        a: "Yes. The tools are useful for classroom examples, spelling practice, and vocabulary exploration.",
      },
    ],
  },
  {
    href: "/spelling-patterns/",
    icon: "patterns",
    title: "Spelling Patterns Hub",
    h1: "Spelling Patterns Hub",
    metaTitle: "Spelling Pattern Tools - Words Starting With and Ending With",
    metaDescription:
      "Explore words by starting letters, ending letters, common prefixes, common suffixes, and pattern-based word discovery.",
    answer:
      "Word Helper makes spelling patterns easier to inspect by grouping words that start or end with the same letters.",
    sections: [
      {
        heading: "Words starting with",
        text: "Use the Prefix Finder when you know the beginning of a word or want to study a common starting pattern.",
      },
      {
        heading: "Words ending with",
        text: "Use the Suffix Finder when you know the ending of a word or want to compare spelling endings like -ing, -tion, -less, and -able.",
      },
      {
        heading: "Pattern-based discovery",
        text: "Pattern lists are useful for spelling practice, word games, and vocabulary study because they turn a vague clue into a smaller list.",
      },
    ],
    links: ["/tools/prefix-finder/", "/tools/suffix-finder/"],
    faqs: [
      {
        q: "What is a spelling pattern?",
        a: "A spelling pattern is a repeated letter arrangement, such as words that start with re- or end with -tion.",
      },
      {
        q: "Can a spelling pattern differ from a grammar suffix?",
        a: "Yes. A word can share ending letters without using those letters as a grammatical suffix.",
      },
      {
        q: "Which tools are best for spelling patterns?",
        a: "Use Prefix Finder for starting letters and Suffix Finder for ending letters.",
      },
    ],
  },
  {
    href: "/guides/",
    icon: "guides",
    title: "Word Helper Guides",
    h1: "Word Helper Guides",
    metaTitle: "Word Helper Guides - Practical Word Tool Tutorials",
    metaDescription:
      "Read practical guides for unscrambling letters, anagrams, rhymes, syllables, prefixes, suffixes, word games, and poetry.",
    answer:
      "Word Helper guides explain how to use word tools in real situations, from game letters and anagram clues to rhyme choices and syllable rhythm.",
    sections: [
      {
        heading: "Short guides for real tasks",
        text: "Each guide answers a practical question, gives examples, and points to the related Word Helper tools.",
      },
      {
        heading: "No filler approach",
        text: "The guides are written to support the tools and users, not to pad pages with repeated search phrases.",
      },
    ],
    links: [],
    faqs: [
      {
        q: "Are the guides tool tutorials?",
        a: "Yes. They explain how to choose a tool, read results, and handle limitations.",
      },
      {
        q: "Do the guides replace the tools?",
        a: "No. They help you understand when and how to use each tool.",
      },
      {
        q: "Will more guides be added?",
        a: "Yes, but only when a guide can answer a real question with useful examples.",
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
    title: "Exact Anagram vs Partial Anagram",
    h1: "Exact Anagram vs Partial Anagram: What Is the Difference?",
    metaTitle: "Exact Anagram vs Partial Anagram - What Is the Difference?",
    metaDescription:
      "Understand exact and partial anagram modes with examples, limitations, and links to the Anagram Solver.",
    answer:
      "An exact anagram uses every letter once. A partial anagram uses some of the letters to make smaller valid words.",
    body: [
      {
        heading: "Exact anagrams",
        text: "In exact mode, listen can become silent, enlist, or tinsel because every letter is used exactly once.",
      },
      {
        heading: "Partial anagrams",
        text: "Partial mode is useful when a longer phrase contains smaller playable or useful words.",
      },
      {
        heading: "When to switch modes",
        text: "If exact mode finds nothing, partial mode can still reveal smaller words that fit a game or clue.",
      },
    ],
    links: ["/tools/anagram-solver/", "/tools/word-unscramble/"],
    faqs: [
      {
        q: "Does punctuation count in anagrams?",
        a: "Word Helper removes punctuation before comparing letters.",
      },
      {
        q: "Can a partial anagram use all letters?",
        a: "It can, but it does not require every letter the way exact mode does.",
      },
    ],
  },
  {
    href: "/guides/perfect-rhymes-vs-near-rhymes/",
    title: "Perfect Rhymes vs Near Rhymes",
    h1: "Perfect Rhymes vs Near Rhymes: How Writers Choose Better Rhymes",
    metaTitle: "Perfect Rhymes vs Near Rhymes - Choosing Better Rhymes",
    metaDescription:
      "Learn how perfect rhymes, near rhymes, and similar endings work for poems, lyrics, captions, and creative writing.",
    answer:
      "Perfect rhymes match closely in sound, while near rhymes share enough sound to feel connected without matching exactly.",
    body: [
      {
        heading: "Perfect rhymes",
        text: "Perfect rhymes are useful when a line needs a clear sound match, such as light and night.",
      },
      {
        heading: "Near rhymes",
        text: "Near rhymes can make lyrics and captions feel less forced because they offer more natural word choices.",
      },
      {
        heading: "Similar endings",
        text: "Similar spelling endings are helpful for brainstorming, but they should be checked aloud.",
      },
    ],
    links: ["/tools/rhyme-finder/", "/tools/syllable-counter/", "/rhyming-words/"],
    faqs: [
      {
        q: "Are near rhymes wrong?",
        a: "No. They are common in songs, rap lines, and modern poetry.",
      },
      {
        q: "Should I trust spelling alone?",
        a: "No. Read the line aloud because spelling and pronunciation often differ.",
      },
    ],
  },
  {
    href: "/guides/why-syllable-counts-can-vary/",
    title: "Why Syllable Counts Can Vary by Accent",
    h1: "Why Syllable Counts Can Vary by Accent",
    metaTitle: "Why Syllable Counts Can Vary by Accent",
    metaDescription:
      "Learn why syllable counts can differ by accent, dialect, speech rhythm, and poetic usage.",
    answer:
      "Syllable counts can vary because people pronounce words differently across accents, dialects, speech speeds, and poetic contexts.",
    body: [
      {
        heading: "Pronunciation changes the count",
        text: "Some speakers compress vowel sounds while others pronounce them separately.",
      },
      {
        heading: "Poetry can bend ordinary speech",
        text: "Poets may stretch or compress words to fit meter, so a practical estimate is only a starting point.",
      },
      {
        heading: "Use estimates carefully",
        text: "A syllable counter is useful for drafting, but final rhythm should be tested aloud.",
      },
    ],
    links: ["/tools/syllable-counter/", "/tools/rhyme-finder/", "/rhyming-words/"],
    faqs: [
      {
        q: "Is there always one correct syllable count?",
        a: "Not always. Pronunciation can change the count.",
      },
      {
        q: "Can Word Helper estimate paragraphs?",
        a: "Yes. It can estimate words, sentences, total syllables, and average syllables per word.",
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
    h1: "How to Use Word Helper for Word Games",
    metaTitle: "How to Use Word Helper for Word Games",
    metaDescription:
      "Use Word Helper for scrambled letters, anagrams, starts-with clues, ends-with clues, and word length strategies.",
    answer:
      "For word games, start with the letters you have, then narrow results with length, starts-with, ends-with, and contains filters.",
    body: [
      {
        heading: "Start broad",
        text: "Run the available letters first so you can see the full set of buildable words.",
      },
      {
        heading: "Add board clues",
        text: "Use pattern filters when the board gives you fixed letters or a required word length.",
      },
      {
        heading: "Check the game dictionary",
        text: "Different games accept different word lists, so confirm a final answer in the game before playing.",
      },
    ],
    links: ["/tools/word-unscramble/", "/tools/anagram-solver/", "/word-games/"],
    faqs: [
      {
        q: "Which tool is fastest for game letters?",
        a: "Word Unscramble is the best starting point for available letters.",
      },
      {
        q: "Can I search known endings?",
        a: "Yes. Use the Suffix Finder or the ends-with filter.",
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
    metaTitle: "About Word Helper - Free Word Tools for Writing, Learning, and Games",
    metaDescription:
      "Learn about Word Helper, a free word tools platform for word games, writing, vocabulary, rhymes, syllables, prefixes, and suffixes.",
    body: [
      "Word Helper is a free educational word-tools website available at https://wordhelper.online. It is built for moments when you have letters, sounds, or word patterns in your head and need clean results quickly — without ads cluttering the interface or vague results that waste your time.",
      "The site provides six focused tools: Word Unscramble, Anagram Solver, Rhyme Finder, Syllable Counter, Prefix Finder, and Suffix Finder. Each tool has its own logic, result layout, and honest explanation of how it works and where it has limits.",
      "Word Helper is useful for word-game players who need to find valid words from scrambled letter racks, writers who want rhyme options or rhythm checks for poems and lyrics, students and teachers looking for vocabulary and spelling patterns, and anyone who wants a quick word answer without a cluttered or deceptive tool.",
      "The tools use letter-frequency matching for unscramble and anagram results, spelling-based and curated matching for rhymes, vowel-group estimation for syllable counts, and exact starts-with or ends-with matching for prefix and suffix searches. Every result area includes a plain explanation of the method and its limitations.",
      "Word Helper does not claim that every result is the final authority for every game dictionary, accent, classroom rule, or style guide. Syllable counts can vary by accent. Rhyme quality depends on how a word is pronounced. The site labels these limits clearly so users can apply their own judgment.",
      "The site is maintained as an independent educational resource. Tool accuracy, page content, and user experience are reviewed and improved based on real feedback. If you notice an error, a missing word, a confusing result, or a content issue, contact Word Helper at hello@wordhelper.online.",
      "Word Helper is funded in part by advertising through Google AdSense. Ad placements are chosen to support the site without interfering with tool use or result areas.",
    ],
  },
  {
    href: "/contact/",
    title: "Contact Word Helper",
    h1: "Contact Word Helper",
    metaTitle: "Contact Word Helper",
    metaDescription:
      "Contact Word Helper for questions, corrections, feedback, or website-related requests.",
    body: [
      "For questions, corrections, feedback, or website-related requests, contact Word Helper at hello@wordhelper.online.",
      "Please include the page URL and a short description if you are reporting a tool result, spelling issue, accessibility concern, or content correction.",
      "Word Helper is maintained as an educational word-tools website. We review feedback to improve tool accuracy, page clarity, and the overall user experience.",
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
      "Word Helper is available at https://wordhelper.online. This Privacy Policy explains how this website handles information in a practical, plain-language way.",
      "Tool inputs are processed in your browser. The interactive word tools run entirely in your browser and do not send your input text to a server. Do not enter private, sensitive, regulated, or confidential text if you do not want it handled by a public website interface.",
      "Word Helper uses local browser storage (localStorage) to remember your color theme preference, recently used tools, and recent tool inputs. This data stays on your device and is not transmitted to any server.",
      "Word Helper uses Google AdSense to display advertisements. Google AdSense may use cookies and similar technologies to serve ads based on your prior visits to this website and other sites. Google's use of advertising cookies enables it and its partners to serve ads based on your visit to this site and other sites on the internet. You may opt out of personalized advertising by visiting Google's Ads Settings at https://adssettings.google.com.",
      "Word Helper may use web analytics services to understand how the site is used. Analytics tools may set cookies or use similar tracking technologies to collect anonymous usage data such as page views, device type, and general location.",
      "If you contact Word Helper at hello@wordhelper.online, your email address and message are used to respond to your request and improve the website. We do not sell or share contact information with third parties.",
      "Third-party ad servers or ad networks may use technologies such as cookies, JavaScript, or web beacons to measure ad effectiveness and personalize ad content. Word Helper has no access to or control over cookies used by third-party advertisers.",
      "If you have questions about this policy, contact us at hello@wordhelper.online.",
    ],
  },
  {
    href: "/terms/",
    title: "Terms and Conditions",
    h1: "Terms and Conditions",
    metaTitle: "Terms and Conditions - Word Helper",
    metaDescription:
      "Read the Word Helper Terms and Conditions for use of free educational word tools on wordhelper.online.",
    body: [
      "These Terms and Conditions apply to Word Helper at https://wordhelper.online.",
      "Word Helper provides free educational word tools for writing, learning, solving, and creative word exploration. You are responsible for how you use the results.",
      "Tool results are provided for convenience and may vary by dictionary, word game, pronunciation, accent, dialect, or classroom rule.",
      "Do not misuse this website, attempt to interfere with its operation, or rely on it for legal, medical, financial, or other professional advice.",
      "If you have questions about these terms, contact us at hello@wordhelper.online.",
    ],
  },
  {
    href: "/disclaimer/",
    title: "Disclaimer",
    h1: "Disclaimer",
    metaTitle: "Disclaimer - Word Helper",
    metaDescription:
      "Read the Word Helper disclaimer about word lists, syllable estimates, rhyme suggestions, and educational use.",
    body: [
      "Word Helper provides educational word tools and practical estimates. It is not a guaranteed authority for every dictionary, word game, school assignment, pronunciation, accent, or writing context.",
      "Unscramble, anagram, prefix, and suffix results depend on the available word list. Rhyme results may include spelling-based fallback suggestions. Syllable counts can vary by accent, dialect, and poetic usage.",
      "Use Word Helper as a helpful drafting and discovery aid, then apply your own judgment or the rule set required by your game, class, editor, or publication.",
      "If you have questions about this disclaimer, contact us at hello@wordhelper.online.",
    ],
  },
  {
    href: "/editorial-policy/",
    title: "Editorial Policy",
    h1: "Editorial Policy",
    metaTitle: "Editorial Policy - Word Helper",
    metaDescription:
      "Learn how Word Helper writes, reviews, and maintains educational word-tool content.",
    body: [
      "Word Helper content is written to support real word tasks: finding words from letters, comparing rhymes, counting syllables, studying spelling patterns, and learning vocabulary.",
      "Pages should be specific, useful, and honest about tool limits. We avoid fake reviews, fake ratings, exaggerated authority claims, and filler written only for search engines.",
      "Visible FAQ content should match any FAQ schema. Tool explanations should reflect the actual logic used by the page.",
      "Corrections and feedback can be sent to hello@wordhelper.online.",
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
];
