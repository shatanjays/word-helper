// ── Priority word enrichment (config-driven premium layer) ──────────────────
// Honest, human-authored editorial notes for high-value / high-intent words.
// Consumed by scripts/build.mjs -> priorityEnrichmentBlock(). Only fields that
// are present render; empty strings / empty arrays are omitted gracefully, so a
// word page never shows an empty premium section. To upgrade another word later,
// add an entry keyed by the lowercase word; do not invent meanings.

export const priorityWords = {
  "abundant": {
    "word": "abundant",
    "plainMeaning": "Present in very large amounts; more than enough.",
    "whenToUse": "Reach for 'abundant' when you want to stress that something exists in generous, plentiful supply — often nature, resources, or opportunities. It fits descriptive, slightly formal writing better than casual speech.",
    "commonContext": "Common in nature writing, science and economics, and descriptions of resources or supply (e.g. 'abundant rainfall', 'abundant evidence').",
    "synonymsByTone": [
      {
        "word": "plentiful",
        "note": "very close, slightly plainer and warmer — everyday word for 'plenty available'"
      },
      {
        "word": "ample",
        "note": "softer — means 'enough and a bit more', not overflowing"
      },
      {
        "word": "copious",
        "note": "more formal and bookish, often stresses sheer quantity produced ('copious notes')"
      },
      {
        "word": "profuse",
        "note": "leans toward excess or pouring out freely ('profuse apologies', 'profuse bleeding')"
      },
      {
        "word": "bountiful",
        "note": "literary and positive — carries a sense of generous, welcome plenty"
      }
    ],
    "antonymsByTone": [
      {
        "word": "scarce",
        "note": "stronger opposite — not just low but hard to find"
      },
      {
        "word": "sparse",
        "note": "thinly spread out rather than simply little"
      },
      {
        "word": "meager",
        "note": "emphasizes disappointingly small, inadequate amount"
      }
    ],
    "commonConfusion": "Don't confuse 'abundant' with 'redundant'; they look similar but 'redundant' means unnecessary or repeated, not plentiful.",
    "beginnerExample": "There was abundant food at the party, so no one went hungry.",
    "writingExample": "The valley's abundant rainfall keeps its forests green long after neighboring regions have dried out.",
    "advancedExample": "Evidence for the theory is now so abundant that skeptics have been reduced to quibbling over details.",
    "memoryTip": "'Abundant' shares its root with 'abound' — think of water that 'abounds', overflowing everywhere."
  },
  "active": {
    "word": "active",
    "plainMeaning": "Doing things, moving, or working rather than being still, idle, or switched off.",
    "whenToUse": "Use 'active' to describe someone or something that is busy, energetic, or currently in operation. It suits fitness and lifestyle, status labels ('active account'), and descriptions of ongoing processes.",
    "commonContext": "Common in health and fitness, software status labels, business ('active users'), and descriptions of ongoing activity.",
    "synonymsByTone": [
      {
        "word": "energetic",
        "note": "emphasizes high energy and vigor, more than simply being in motion"
      },
      {
        "word": "busy",
        "note": "focuses on having a lot to do, not necessarily physical movement"
      },
      {
        "word": "lively",
        "note": "adds spirit and liveliness, often about mood or atmosphere"
      },
      {
        "word": "engaged",
        "note": "stresses being involved and attentive rather than physically active"
      },
      {
        "word": "operational",
        "note": "formal and technical; means currently working or in service, said of systems"
      }
    ],
    "antonymsByTone": [
      {
        "word": "inactive",
        "note": "the neutral direct opposite; not currently doing or working"
      },
      {
        "word": "passive",
        "note": "stresses being acted upon or holding back rather than taking action"
      },
      {
        "word": "idle",
        "note": "not in use at the moment, often temporarily, with no fault implied"
      },
      {
        "word": "dormant",
        "note": "inactive for now but capable of becoming active again later"
      }
    ],
    "commonConfusion": "In grammar, 'active' voice (the subject does the action) is the opposite of 'passive' voice (the subject receives it); mixing up the two is a common writing point.",
    "beginnerExample": "My grandfather is still very active and walks every morning.",
    "writingExample": "The app counts anyone who logged in this month as an active user, which flatters the numbers.",
    "advancedExample": "The volcano is not extinct but merely dormant, and geologists warn it could turn active with little notice.",
    "memoryTip": "'Active' contains 'act' — if it's acting or in action, it's active."
  },
  "better": {
    "word": "better",
    "plainMeaning": "More good, more suitable, or of higher quality than something else; also, recovered or recovering in health.",
    "whenToUse": "Use 'better' to compare two things when one is superior, or to say someone has improved in health. It's the comparative of 'good' and 'well', so it always implies a comparison, even an unstated one.",
    "commonContext": "Comparisons and recommendations ('a better option', 'even better'), health updates ('feeling better'), and advice ('you'd better leave now').",
    "synonymsByTone": [
      {
        "word": "superior",
        "note": "more formal and emphatic — clearly higher in quality or rank"
      },
      {
        "word": "improved",
        "note": "stresses change from a previous state rather than a head-to-head comparison"
      },
      {
        "word": "preferable",
        "note": "frames it as the more desirable choice, a matter of preference"
      },
      {
        "word": "finer",
        "note": "slightly literary — better in quality or refinement"
      }
    ],
    "antonymsByTone": [
      {
        "word": "worse",
        "note": "direct opposite — lower in quality or more unfavourable"
      },
      {
        "word": "inferior",
        "note": "more formal — clearly lower in quality or value"
      },
      {
        "word": "worse off",
        "note": "for situations — in a more disadvantaged position"
      }
    ],
    "commonConfusion": "'Better' is already comparative, so avoid 'more better'; and note the idiom 'had better' (a strong suggestion), which isn't about quality at all.",
    "beginnerExample": "This chair is more comfortable, so it is better than the old one.",
    "writingExample": "After a week's rest she felt much better and returned to work on Monday.",
    "advancedExample": "The redesign is not merely different but genuinely better: faster to load, easier to read, and cheaper to maintain.",
    "memoryTip": "'Good, better, best' — 'better' is the middle step, always comparing two things."
  },
  "careful": {
    "word": "careful",
    "plainMeaning": "Taking pains to avoid mistakes, harm, or risk by paying close attention.",
    "whenToUse": "Use 'careful' when someone acts with caution and attention to detail, whether handling something fragile, making a decision, or doing precise work. It suits both warnings ('be careful') and praise for thorough, diligent effort.",
    "commonContext": "Safety warnings, instructions, and praise for thorough work ('a careful reader', 'careful analysis', 'be careful with that').",
    "synonymsByTone": [
      {
        "word": "cautious",
        "note": "leans toward avoiding risk and holding back, less about precision"
      },
      {
        "word": "meticulous",
        "note": "stronger — extremely careful about tiny details, almost fussy"
      },
      {
        "word": "thorough",
        "note": "stresses completeness, leaving nothing out, rather than avoiding danger"
      },
      {
        "word": "prudent",
        "note": "formal — careful and sensible in planning ahead, especially decisions"
      },
      {
        "word": "wary",
        "note": "careful because of suspicion or distrust, watchful for trouble"
      }
    ],
    "antonymsByTone": [
      {
        "word": "careless",
        "note": "direct opposite — not paying enough attention, making avoidable errors"
      },
      {
        "word": "reckless",
        "note": "stronger — dangerously ignoring risk"
      },
      {
        "word": "negligent",
        "note": "formal — careless in a way that breaches a duty, often with consequences"
      }
    ],
    "commonConfusion": "Don't confuse 'careful' (attentive, cautious) with 'carefree' (relaxed and without worries); they are near-opposites despite the shared root.",
    "beginnerExample": "Be careful when you cross the busy street.",
    "writingExample": "A careful edit caught three errors that the spell-checker had missed entirely.",
    "advancedExample": "His prose is careful to the point of caution, weighing each claim so scrupulously that it rarely dares to surprise.",
    "memoryTip": "'Careful' literally means 'full of care' — you take care so nothing goes wrong."
  },
  "choice": {
    "word": "choice",
    "plainMeaning": "The act of picking one option from two or more, or the thing you pick.",
    "whenToUse": "Use it for the general idea of selecting among options, or for the option itself. As an adjective ('choice cuts'), it means selected for high quality.",
    "commonContext": "Everywhere in everyday English — menus, decision-making, shopping, and phrases like 'make a choice' or 'freedom of choice'; the adjective sense is common in food and marketing copy.",
    "synonymsByTone": [
      {
        "word": "option",
        "note": "more neutral and countable — an option is one of the things you can choose, while a choice is the act or the selection itself"
      },
      {
        "word": "selection",
        "note": "more formal; emphasizes the range available ('a wide selection') or a curated set"
      },
      {
        "word": "pick",
        "note": "casual and personal — 'my pick' feels like a favorite or recommendation"
      },
      {
        "word": "alternative",
        "note": "implies a second option set against a first, often when the default is undesirable"
      },
      {
        "word": "preference",
        "note": "shifts focus to what you like best rather than the act of choosing"
      }
    ],
    "antonymsByTone": [
      {
        "word": "obligation",
        "note": "something you must do, leaving no room to choose"
      },
      {
        "word": "necessity",
        "note": "a forced course of action rather than a free selection"
      },
      {
        "word": "compulsion",
        "note": "stronger — an external or internal force that removes choice entirely"
      }
    ],
    "commonConfusion": "Do not confuse the noun 'choice' with the verb 'choose' or its past tense 'chose'. 'Choice' is the thing or act; 'choose/chose' is the doing.",
    "beginnerExample": "You have a choice: tea or coffee.",
    "writingExample": "Faced with two strong candidates, the committee found the final choice surprisingly hard to make.",
    "advancedExample": "In matters of conscience, the freedom to choose is meaningless unless every choice carries a real cost.",
    "memoryTip": "A 'choice' is the noun; you 'choose' (verb) to arrive at it — the extra 'i' marks the result of the action."
  },
  "clear": {
    "word": "clear",
    "plainMeaning": "Easy to see, understand, or perceive, with nothing blocking or confusing it.",
    "whenToUse": "Use 'clear' whenever something is easy to grasp or free of obstruction — it works for writing, glass, weather, skin, and reasoning alike. It's a plain, versatile word that fits almost any register.",
    "commonContext": "Everywhere — instructions, weather reports, explanations, design and writing advice ('keep it clear'), and descriptions of transparent or unobstructed things.",
    "synonymsByTone": [
      {
        "word": "plain",
        "note": "similar for 'easy to understand', but can also suggest simple or unadorned"
      },
      {
        "word": "obvious",
        "note": "stronger — leaves no room for doubt, sometimes almost too apparent"
      },
      {
        "word": "transparent",
        "note": "for physical see-through-ness, or figuratively for honesty and openness"
      },
      {
        "word": "lucid",
        "note": "more formal, praises writing or thinking that is clear and easy to follow"
      },
      {
        "word": "evident",
        "note": "formal — means clearly true from the available signs, more about proof than simplicity"
      }
    ],
    "antonymsByTone": [
      {
        "word": "vague",
        "note": "opposite of clear meaning — fuzzy and imprecise"
      },
      {
        "word": "murky",
        "note": "opposite of clear sight — cloudy, hard to see through, literally or figuratively"
      },
      {
        "word": "confusing",
        "note": "opposite of clear understanding — actively hard to follow"
      },
      {
        "word": "opaque",
        "note": "formal opposite — blocks light or blocks understanding entirely"
      }
    ],
    "commonConfusion": "Don't mix up the verb senses: to 'clear' a table (remove things) versus a 'clear' sky (cloudless); context decides the meaning.",
    "beginnerExample": "The teacher gave clear instructions, so we knew exactly what to do.",
    "writingExample": "Good technical writing favours short, clear sentences over clever ones.",
    "advancedExample": "Her argument was so clear that objections seemed to dissolve before anyone could raise them.",
    "memoryTip": "Think of clean glass: 'clear' lets both light and meaning pass through without distortion."
  },
  "common": {
    "word": "common",
    "plainMeaning": "Happening often or shared by many people or things.",
    "whenToUse": "Use it for things that occur frequently or that are shared across a group. Be aware it can also carry a mildly negative sense of 'ordinary' or 'lacking refinement' depending on context.",
    "commonContext": "Everyday speech and writing about frequency ('a common mistake'), shared traits ('common ground', 'common interests'), and in set phrases like 'common sense' and 'common knowledge'.",
    "synonymsByTone": [
      {
        "word": "frequent",
        "note": "focuses purely on how often something happens, without the 'shared' meaning"
      },
      {
        "word": "ordinary",
        "note": "emphasizes being unremarkable rather than widespread; can sound dismissive"
      },
      {
        "word": "widespread",
        "note": "stronger — stresses geographic or social reach, not just frequency"
      },
      {
        "word": "shared",
        "note": "captures only the 'held in common' sense, with a warmer, more positive tone"
      },
      {
        "word": "prevalent",
        "note": "more formal; suggests something is dominant or common in a particular time or place"
      }
    ],
    "antonymsByTone": [
      {
        "word": "rare",
        "note": "opposite of frequent — happening seldom"
      },
      {
        "word": "unique",
        "note": "opposite of shared — one of a kind, not held in common"
      },
      {
        "word": "uncommon",
        "note": "the plain, neutral opposite of both senses"
      },
      {
        "word": "exceptional",
        "note": "opposite in the 'ordinary' sense — standing out as unusually good"
      }
    ],
    "commonConfusion": "Do not confuse 'common' (frequent/shared) with 'mutual', which some writers wrongly use for it. 'Mutual' properly means reciprocated between two parties ('mutual respect'), not simply 'shared by many'.",
    "beginnerExample": "It's a common name — I know three people who have it.",
    "writingExample": "The two teams had little in common at first, but a shared deadline soon gave them common ground.",
    "advancedExample": "What passes for common sense in one generation is often the hard-won insight of the last.",
    "memoryTip": "Think 'common' as in 'held in common' — shared by the community; both words start the same way."
  },
  "compare": {
    "word": "compare",
    "plainMeaning": "To look at two or more things to see how they are alike or different.",
    "whenToUse": "Use it when weighing similarities and differences. Note the prepositions: 'compare to' likens things ('compared her to a rose'), while 'compare with' sets them side by side to examine both ('compare this year with last').",
    "commonContext": "Reviews, shopping and price checks, academic and analytical writing, and everyday phrases like 'compared to' and 'nothing compares'.",
    "synonymsByTone": [
      {
        "word": "contrast",
        "note": "the flip side — focuses only on differences, not similarities"
      },
      {
        "word": "liken",
        "note": "means to point out similarity ('liken it to'); narrower and more literary"
      },
      {
        "word": "weigh",
        "note": "implies judging options against each other to decide, not just observing"
      },
      {
        "word": "equate",
        "note": "stronger — treats two things as effectively equal, which compare does not require"
      },
      {
        "word": "measure against",
        "note": "phrasal and evaluative — checks one thing by the standard of another"
      }
    ],
    "antonymsByTone": [
      {
        "word": "contrast",
        "note": "sets differences apart rather than drawing them together (also a partial synonym, depending on emphasis)"
      }
    ],
    "commonConfusion": "'Compare to' vs 'compare with': use 'to' when asserting a likeness ('critics compared him to Dickens'), and 'with' when examining both sides for similarities and differences ('compare the two drafts with each other').",
    "beginnerExample": "Let's compare the two phones before we buy one.",
    "writingExample": "When you compare this quarter's figures with last year's, the growth is modest but steady.",
    "advancedExample": "To compare grief to a wound is comforting until you notice that some wounds are never meant to close.",
    "memoryTip": "Compare = 'com-' (together) + 'pair' — you bring a pair together to look at them."
  },
  "complete": {
    "word": "complete",
    "plainMeaning": "Having all its parts, or fully finished with nothing missing.",
    "whenToUse": "Use it to say something is whole and lacks nothing, or (as a verb) to finish something. As an intensifier ('a complete stranger'), it means total or absolute.",
    "commonContext": "Common in project work, forms and checklists, product descriptions ('the complete set'), and as an emphatic modifier in everyday speech.",
    "synonymsByTone": [
      {
        "word": "whole",
        "note": "stresses that no part is missing, but not necessarily that work is finished"
      },
      {
        "word": "entire",
        "note": "similar to whole; emphasizes the full extent with nothing left out"
      },
      {
        "word": "finished",
        "note": "focuses on the work being done, not on whether all parts are present"
      },
      {
        "word": "total",
        "note": "as an intensifier, blunter and more absolute ('total chaos' vs 'complete chaos')"
      },
      {
        "word": "comprehensive",
        "note": "more formal — implies covering every relevant point or area, not just being finished"
      }
    ],
    "antonymsByTone": [
      {
        "word": "incomplete",
        "note": "the direct opposite — missing parts or unfinished"
      },
      {
        "word": "partial",
        "note": "softer — some but not all is present or done"
      },
      {
        "word": "unfinished",
        "note": "focuses specifically on work still left to do"
      }
    ],
    "commonConfusion": "'Complete' means having every part; 'completed' is the past-tense verb (a task you have completed). Also, strictly speaking things are complete or not — 'more complete' is common but disliked by careful writers.",
    "beginnerExample": "The puzzle is complete — every piece is in place.",
    "writingExample": "Please make sure the application is complete before you submit it, as missing sections cannot be added later.",
    "advancedExample": "The manuscript felt complete not because nothing more could be said, but because nothing more needed to be.",
    "memoryTip": "Complete = 'com-' (together) + 'plete' (filled) — everything filled in together."
  },
  "complex": {
    "word": "complex",
    "plainMeaning": "Made of many connected parts, so it is hard to understand or deal with.",
    "whenToUse": "Use it when something has many interrelated parts, not just when it is hard. It differs from 'complicated', which stresses tangled difficulty; 'complex' is more neutral about intricacy.",
    "commonContext": "Technical, scientific, and analytical writing; discussions of systems, problems, and relationships; and as a noun for a building group ('sports complex') or a psychological pattern ('inferiority complex').",
    "synonymsByTone": [
      {
        "word": "complicated",
        "note": "emphasizes difficulty and tangle; 'complex' can be intricate yet orderly, 'complicated' rarely is"
      },
      {
        "word": "intricate",
        "note": "highlights fine, delicate detail — often with a note of admiration"
      },
      {
        "word": "elaborate",
        "note": "suggests something built up with many worked-out details, often deliberately"
      },
      {
        "word": "convoluted",
        "note": "negative — twisted and needlessly hard to follow"
      },
      {
        "word": "multifaceted",
        "note": "neutral-to-positive; stresses having many sides or aspects worth exploring"
      }
    ],
    "antonymsByTone": [
      {
        "word": "simple",
        "note": "the plain opposite — few parts, easy to grasp"
      },
      {
        "word": "straightforward",
        "note": "emphasizes ease of understanding with no hidden difficulty"
      },
      {
        "word": "basic",
        "note": "stresses being stripped to fundamentals, sometimes implying too little"
      }
    ],
    "commonConfusion": "'Complex' vs 'complicated': a system can be complex (many interacting parts) without being complicated (confusing or badly tangled). Reserve 'complicated' for difficulty, 'complex' for structure.",
    "beginnerExample": "The instructions were too complex for me to follow.",
    "writingExample": "Climate is a complex system in which small changes can ripple outward in unexpected ways.",
    "advancedExample": "Her feelings toward her hometown were complex — part longing, part relief at having left.",
    "memoryTip": "Complex = 'com-' (together) + 'plex' (woven) — many strands woven together."
  },
  "correct": {
    "word": "correct",
    "plainMeaning": "Free from mistakes; in agreement with what is true or proper.",
    "whenToUse": "Use 'correct' when something matches the right answer, fact, or standard. It suits tests, instructions, formal replies, and situations where accuracy matters more than praise.",
    "commonContext": "Common in exams, technical writing, forms, and formal or polite confirmation ('that is correct').",
    "synonymsByTone": [
      {
        "word": "accurate",
        "note": "stresses precision and closeness to the exact truth, common with data and measurements"
      },
      {
        "word": "right",
        "note": "more casual and broader; can also mean morally right or suitable, not just error-free"
      },
      {
        "word": "true",
        "note": "about agreement with fact or reality, not about following a rule or answer key"
      },
      {
        "word": "proper",
        "note": "emphasizes conforming to accepted rules or etiquette rather than being factually right"
      },
      {
        "word": "exact",
        "note": "stronger — precise to the last detail, with no approximation"
      }
    ],
    "antonymsByTone": [
      {
        "word": "wrong",
        "note": "the everyday opposite; plain and direct"
      },
      {
        "word": "incorrect",
        "note": "more formal and neutral, common in tests and instructions"
      },
      {
        "word": "inaccurate",
        "note": "focuses on lack of precision rather than being flatly false"
      },
      {
        "word": "mistaken",
        "note": "applies to people holding a wrong belief, softening the judgment"
      }
    ],
    "commonConfusion": "As a verb, 'correct' means to fix an error ('please correct the spelling'); do not confuse it with 'collect' (to gather), which looks similar but is unrelated.",
    "beginnerExample": "Only one of the four answers is correct.",
    "writingExample": "Her figures were correct, but the conclusion she drew from them was not.",
    "advancedExample": "It is technically correct to call the treaty binding, though in practice no one enforces it.",
    "memoryTip": "'Correct' shares its root with 'rectify' (to set right) — both are about making things right."
  },
  "deep": {
    "word": "deep",
    "plainMeaning": "Extending far down from the top or surface, or (of feelings and ideas) intense and hard to reach.",
    "whenToUse": "Use 'deep' for physical distance downward or inward, and figuratively for strong emotions, serious thought, or rich color and sound. It works in everyday and literary contexts alike.",
    "commonContext": "Common in describing water and holes, emotions, discussions, colors, voices, and sleep.",
    "synonymsByTone": [
      {
        "word": "profound",
        "note": "formal and figurative only — used for ideas or feelings, never a literal hole"
      },
      {
        "word": "bottomless",
        "note": "stronger and often exaggerated — so deep it seems to have no bottom"
      },
      {
        "word": "intense",
        "note": "for feelings — stresses strength rather than depth"
      },
      {
        "word": "cavernous",
        "note": "vivid — deep and hollow like a large cave, often about space"
      },
      {
        "word": "low",
        "note": "for sound or pitch — a deep voice is a low one, but 'low' loses the richness"
      }
    ],
    "antonymsByTone": [
      {
        "word": "shallow",
        "note": "the direct opposite — not far down, or lacking depth of thought or feeling"
      },
      {
        "word": "superficial",
        "note": "figurative and often critical — staying only on the surface"
      }
    ],
    "commonConfusion": "'Deep' and 'deeply' differ by role: use 'deep' as an adjective (a deep well) or after verbs of motion (dig deep), and 'deeply' as an adverb of degree (deeply moved), not 'deep moved'.",
    "beginnerExample": "The pool is too deep for the children.",
    "writingExample": "She felt a deep sense of relief when the results finally came through.",
    "advancedExample": "His silence was not empty but deep, the kind that holds more than any answer could.",
    "memoryTip": "'Deep' points down or inward — a deep hole goes far below, and a deep feeling goes far inside."
  },
  "fast": {
    "word": "fast",
    "plainMeaning": "Moving or able to move at high speed; also, firmly fixed in place.",
    "whenToUse": "Use it for speed in most everyday contexts — it is plainer and more versatile than 'rapid' or 'swift'. Remember the second sense (firmly fixed) survives in phrases like 'hold fast' and 'fast asleep'.",
    "commonContext": "Everyday speech about speed, sports, traffic, and technology; set phrases ('fast food', 'fast asleep', 'hold fast'); and the unrelated verb/noun meaning to go without food.",
    "synonymsByTone": [
      {
        "word": "quick",
        "note": "stresses short duration or promptness more than sustained high speed"
      },
      {
        "word": "rapid",
        "note": "more formal; suits processes and rates ('rapid growth') better than casual speech"
      },
      {
        "word": "swift",
        "note": "literary and graceful — implies smooth, effortless speed"
      },
      {
        "word": "speedy",
        "note": "lighter and more informal, often about a quick result ('a speedy recovery')"
      },
      {
        "word": "brisk",
        "note": "means lively and energetic rather than truly fast ('a brisk walk')"
      }
    ],
    "antonymsByTone": [
      {
        "word": "slow",
        "note": "the plain, direct opposite for speed"
      },
      {
        "word": "sluggish",
        "note": "stronger and negative — slow in a heavy, lethargic way"
      },
      {
        "word": "loose",
        "note": "opposite of the 'firmly fixed' sense, as in 'come loose' vs 'hold fast'"
      }
    ],
    "commonConfusion": "'Fast' as an adverb needs no '-ly' ('run fast', not 'run fastly'). Also note the two clashing senses: 'fast' can mean speedy, yet 'hold fast' and 'stuck fast' mean firmly still.",
    "beginnerExample": "That car is very fast.",
    "writingExample": "The startup grew fast, but its foundations were held fast by a careful, patient team.",
    "advancedExample": "Rumour travels fast; the truth, held fast by facts, always seems to arrive a step behind.",
    "memoryTip": "The odd 'fixed' sense hides in 'fast asleep' — so deeply held in sleep you can't easily be moved."
  },
  "final": {
    "word": "final",
    "plainMeaning": "Coming last, after which nothing else follows, or settled so it can't be changed.",
    "whenToUse": "Use it for the last item in a sequence, or for a decision that is settled and not open to further change. It works in both plain speech and formal writing.",
    "commonContext": "Common in schedules, competitions, decisions, and documents (the final round, the final version, the decision is final).",
    "synonymsByTone": [
      {
        "word": "last",
        "note": "plainer and more neutral — just marks position at the end, without the sense of being settled or conclusive"
      },
      {
        "word": "concluding",
        "note": "more formal; emphasises the act of bringing something to a close rather than mere position"
      },
      {
        "word": "ultimate",
        "note": "loftier — suggests the furthest or highest point, often with weight or significance, not just the last one"
      },
      {
        "word": "definitive",
        "note": "stresses that it settles the matter authoritatively, not just that it comes last"
      },
      {
        "word": "closing",
        "note": "gentler, often used for the end part of an event or text (closing remarks) rather than an unchangeable decision"
      }
    ],
    "antonymsByTone": [
      {
        "word": "first",
        "note": "the opposite by position — the one at the start"
      },
      {
        "word": "initial",
        "note": "more formal opposite; the earliest stage, often implying more will follow"
      },
      {
        "word": "provisional",
        "note": "opposite in the 'settled' sense — temporary and open to change"
      }
    ],
    "commonConfusion": "Do not confuse 'finale' (the noun for a closing performance or section) with 'final' (usually the adjective, or the last game/exam). A concert has a finale; a tournament has a final.",
    "beginnerExample": "This is the final chapter of the book.",
    "writingExample": "After three rounds of edits, we agreed the final draft was ready to send.",
    "advancedExample": "The board's ruling was final, leaving no avenue for appeal.",
    "memoryTip": "Think 'the finish line' — final marks where things end."
  },
  "flexible": {
    "word": "flexible",
    "plainMeaning": "Able to bend or change easily to fit different needs or situations.",
    "whenToUse": "Use it for things that bend physically, or for people, plans, and rules that adapt easily. It carries a positive, accommodating tone.",
    "commonContext": "Common in job listings, product descriptions, and everyday talk about schedules, materials, and plans (flexible hours, flexible material, flexible approach).",
    "synonymsByTone": [
      {
        "word": "adaptable",
        "note": "focuses on adjusting well to new conditions; used more for people and systems than for physical bending"
      },
      {
        "word": "versatile",
        "note": "stresses having many uses or skills, not just the ability to bend or yield"
      },
      {
        "word": "pliable",
        "note": "more physical or literal about bending; applied to people it can hint at being easily influenced"
      },
      {
        "word": "accommodating",
        "note": "about a willing, obliging attitude toward others, rather than the capacity to change shape or plans"
      },
      {
        "word": "elastic",
        "note": "emphasises stretching and springing back; often used for rules, budgets, or materials"
      }
    ],
    "antonymsByTone": [
      {
        "word": "rigid",
        "note": "strong opposite — unwilling or unable to bend, often with a negative edge"
      },
      {
        "word": "inflexible",
        "note": "direct opposite; fixed and not open to change"
      },
      {
        "word": "firm",
        "note": "milder opposite — steady and unyielding, but can be neutral or even positive"
      },
      {
        "word": "stiff",
        "note": "opposite in the physical sense — hard to bend"
      }
    ],
    "commonConfusion": "",
    "beginnerExample": "My new job has flexible hours, so I can start early or late.",
    "writingExample": "A flexible schedule let the team shift deadlines without derailing the whole project.",
    "advancedExample": "The framework is deliberately flexible, bending to local needs rather than imposing a single rigid model.",
    "memoryTip": "'Flex' is in the word — think of flexing to bend and adapt."
  },
  "fresh": {
    "word": "fresh",
    "plainMeaning": "Newly made, recently obtained, or feeling clean and full of energy.",
    "whenToUse": "Use 'fresh' for food that hasn't spoiled, ideas or starts that are new, and air, feelings, or appearances that are clean and invigorating. It fits casual and descriptive writing well.",
    "commonContext": "Common in food and cooking, weather, product copy, and talk about new beginnings.",
    "synonymsByTone": [
      {
        "word": "new",
        "note": "broader and plainer — recently made or obtained, without the sense of clean or lively"
      },
      {
        "word": "crisp",
        "note": "sensory — fresh with a firm, sharp, clean quality (crisp air, crisp lettuce)"
      },
      {
        "word": "recent",
        "note": "purely about time — happening lately, with none of the vitality"
      },
      {
        "word": "novel",
        "note": "formal — new in an original, not-seen-before way, applied to ideas"
      },
      {
        "word": "invigorating",
        "note": "stronger for the 'refreshing' sense — actively giving energy"
      }
    ],
    "antonymsByTone": [
      {
        "word": "stale",
        "note": "opposite for food and ideas — old, dry, or no longer interesting"
      },
      {
        "word": "stagnant",
        "note": "for air or water — still and gone off from lack of movement"
      },
      {
        "word": "tired",
        "note": "figurative opposite — worn-out, overused, lacking freshness"
      }
    ],
    "commonConfusion": "In informal speech 'fresh' can also mean cheeky or disrespectful ('Don't get fresh with me'), which is unrelated to the 'new/clean' sense — context makes it clear.",
    "beginnerExample": "We bought fresh bread this morning.",
    "writingExample": "After a week off, she came back to the project with fresh eyes and a clearer plan.",
    "advancedExample": "The essay offered a fresh angle on a tired debate, reframing the whole question rather than answering it.",
    "memoryTip": "Fresh food, fresh air, fresh start — all share the sense of just-arrived and full of life."
  },
  "gentle": {
    "word": "gentle",
    "plainMeaning": "Mild, soft, and careful — not rough, harsh, or forceful.",
    "whenToUse": "Use it for a soft, kind, or mild manner of acting, touching, or speaking, and for things that are not harsh or intense. It carries warmth and care.",
    "commonContext": "Common in descriptions of people, care instructions, and product copy (a gentle person, gentle on skin, a gentle reminder).",
    "synonymsByTone": [
      {
        "word": "mild",
        "note": "cooler and more neutral; stresses low intensity rather than warmth or kindness"
      },
      {
        "word": "soft",
        "note": "more about texture or quietness; overlaps with gentle but lacks the sense of considerate manner"
      },
      {
        "word": "tender",
        "note": "warmer and more emotional — implies affection and deep care"
      },
      {
        "word": "soothing",
        "note": "focuses on the calming effect on someone, not just a mild manner"
      },
      {
        "word": "delicate",
        "note": "adds a sense of fragility or fineness; suggests careful handling is needed"
      }
    ],
    "antonymsByTone": [
      {
        "word": "harsh",
        "note": "strong opposite — rough, severe, and unkind"
      },
      {
        "word": "rough",
        "note": "opposite in touch or manner; forceful and not careful"
      },
      {
        "word": "forceful",
        "note": "opposite in energy — pushing hard rather than acting softly"
      },
      {
        "word": "severe",
        "note": "opposite in tone — strict and unsparing"
      }
    ],
    "commonConfusion": "Do not confuse 'gentle' (mild, soft) with 'genteel' (polite in an refined, upper-class way). A gentle voice is soft; a genteel manner is well-bred and mannered.",
    "beginnerExample": "She gave the puppy a gentle pat on the head.",
    "writingExample": "His gentle tone put the nervous new student at ease.",
    "advancedExample": "The essay offers a gentle critique — pointed enough to land, but never wounding.",
    "memoryTip": "A 'gentle' touch is what a gentle-man was meant to have: soft and considerate."
  },
  "growth": {
    "word": "growth",
    "plainMeaning": "The process of getting bigger, better, or more developed over time.",
    "whenToUse": "Use 'growth' when something increases in size, amount, or maturity, whether it's a plant, a business, a person, or an economy. It works in both everyday and professional settings.",
    "commonContext": "Common in business reports, economics, health, gardening, and personal-development writing.",
    "synonymsByTone": [
      {
        "word": "expansion",
        "note": "emphasizes spreading out or scaling up, often deliberate (a company expanding)"
      },
      {
        "word": "increase",
        "note": "plainer and more numeric — a rise in amount, without the sense of development"
      },
      {
        "word": "development",
        "note": "stresses becoming more advanced or mature, not just larger"
      },
      {
        "word": "rise",
        "note": "shorter and more immediate — an upward movement, often in figures or status"
      },
      {
        "word": "progress",
        "note": "focuses on moving toward a goal or improvement, not size"
      }
    ],
    "antonymsByTone": [
      {
        "word": "decline",
        "note": "a gradual worsening or shrinking — the natural opposite in business and health"
      },
      {
        "word": "shrinkage",
        "note": "plainer — a reduction in size or amount"
      },
      {
        "word": "contraction",
        "note": "formal, common in economics — the economy getting smaller"
      }
    ],
    "commonConfusion": "In medicine, 'a growth' can mean a lump or tumor, which is a very different sense from positive 'growth' — context makes the meaning clear.",
    "beginnerExample": "The plant showed a lot of growth over the summer.",
    "writingExample": "Steady revenue growth over five years gave the founders room to hire more staff.",
    "advancedExample": "Real growth, she argued, is rarely visible while it happens; it announces itself only in hindsight.",
    "memoryTip": "'Growth' comes from 'grow' — if something is growing, its growth is what you can measure."
  },
  "helpful": {
    "word": "helpful",
    "plainMeaning": "Giving useful help or making something easier to do or understand.",
    "whenToUse": "Use 'helpful' to describe people, information, or tools that provide real, practical assistance. It's warm and everyday, good for reviews, feedback, and thank-yous.",
    "commonContext": "Reviews, feedback, customer service, and everyday praise ('a helpful guide', 'very helpful staff', 'that's helpful, thanks').",
    "synonymsByTone": [
      {
        "word": "useful",
        "note": "focuses on practical value of a thing; less about kindness than 'helpful'"
      },
      {
        "word": "supportive",
        "note": "warmer and more personal — emotional backing, not just practical aid"
      },
      {
        "word": "beneficial",
        "note": "more formal — produces a good result or advantage, often long-term"
      },
      {
        "word": "handy",
        "note": "casual — conveniently useful, usually for objects or quick tips"
      },
      {
        "word": "obliging",
        "note": "emphasizes willingness to help others, eager to please"
      }
    ],
    "antonymsByTone": [
      {
        "word": "unhelpful",
        "note": "direct opposite — failing to give useful help"
      },
      {
        "word": "useless",
        "note": "stronger — of no value or use at all"
      },
      {
        "word": "obstructive",
        "note": "goes further — actively gets in the way rather than just not helping"
      }
    ],
    "commonConfusion": "",
    "beginnerExample": "The librarian was very helpful and found the book I needed.",
    "writingExample": "The manual's troubleshooting section proved surprisingly helpful when the printer jammed.",
    "advancedExample": "Feedback is only helpful when it is specific enough to act on; vague praise changes nothing.",
    "memoryTip": "'Helpful' is simply 'help' plus '-ful' — full of help, so it makes things easier."
  },
  "human": {
    "word": "human",
    "plainMeaning": "Belonging to or characteristic of people — including their feelings, flaws, and kindness.",
    "whenToUse": "Use it to refer to people as a group or species, or as an adjective for warm, relatable, imperfect qualities. As praise, it signals warmth and realness rather than cold perfection.",
    "commonContext": "Common in writing about people, technology, and behaviour (the human body, human error, a human touch, only human).",
    "synonymsByTone": [
      {
        "word": "humane",
        "note": "narrower — means compassionate and merciful, not simply 'relating to people'"
      },
      {
        "word": "humanlike",
        "note": "means resembling a human without being one; used for machines, animals, or figures"
      },
      {
        "word": "mortal",
        "note": "emphasises being subject to death and limits, with a more literary or solemn feel"
      },
      {
        "word": "relatable",
        "note": "captures the 'warm and approachable' sense of human, without the species meaning"
      },
      {
        "word": "personal",
        "note": "overlaps when 'human' means warm or individual, but stresses the individual rather than shared humanity"
      }
    ],
    "antonymsByTone": [
      {
        "word": "robotic",
        "note": "opposite of the warm sense — mechanical and without feeling"
      },
      {
        "word": "inhuman",
        "note": "strong opposite — cruel or utterly lacking normal human feeling"
      },
      {
        "word": "machine",
        "note": "opposite as a category — a device rather than a person"
      }
    ],
    "commonConfusion": "Do not confuse 'human' (relating to people) with 'humane' (kind and compassionate). A human decision is simply one made by a person; a humane decision is a merciful one.",
    "beginnerExample": "Making mistakes is human — everyone does it.",
    "writingExample": "The support line added a human touch that the automated chatbot could never match.",
    "advancedExample": "What makes the memoir resonate is not its polish but its human frailty — the doubts left visible on the page.",
    "memoryTip": "Remember 'to err is human' — the word carries both people and their flaws."
  },
  "idea": {
    "word": "idea",
    "plainMeaning": "A thought, plan, or mental picture that forms in your mind.",
    "whenToUse": "Use 'idea' for any thought you have, from a passing notion to a plan you want to act on. It fits nearly every register, from casual chat to formal writing.",
    "commonContext": "Extremely common everywhere: brainstorming, meetings, essays, casual conversation, and creative work.",
    "synonymsByTone": [
      {
        "word": "notion",
        "note": "lighter and vaguer — often a half-formed or fanciful idea"
      },
      {
        "word": "concept",
        "note": "more abstract and formal — an idea worked out enough to be defined"
      },
      {
        "word": "thought",
        "note": "broader — any mental activity, not necessarily a plan or proposal"
      },
      {
        "word": "plan",
        "note": "more concrete — an idea developed into steps for action"
      },
      {
        "word": "brainwave",
        "note": "informal and upbeat — a sudden clever idea"
      }
    ],
    "antonymsByTone": [],
    "commonConfusion": "Do not confuse 'idea' with 'ideal': an idea is a thought, while an ideal is a standard of perfection you aim for.",
    "beginnerExample": "I have a good idea for the party.",
    "writingExample": "The whole idea behind the redesign was to make the app easier for first-time users.",
    "advancedExample": "It was a beautiful idea in theory, but it collapsed the moment it met the real budget.",
    "memoryTip": "An idea is what pops into your head; add an 'l' and 'ideal' becomes the perfect version you wish for."
  },
  "insight": {
    "word": "insight",
    "plainMeaning": "A clear, deep understanding of something that isn't obvious on the surface.",
    "whenToUse": "Use it when you mean a genuine grasp of how or why something works, especially an understanding that goes beyond the obvious. It suits analysis, reflection, and thoughtful discussion.",
    "commonContext": "Common in business, research, psychology, and reviews (customer insights, keen insight, offers real insight into the topic).",
    "synonymsByTone": [
      {
        "word": "understanding",
        "note": "broader and plainer; can be basic, while insight implies a deeper or sharper grasp"
      },
      {
        "word": "perception",
        "note": "leans toward noticing and awareness; insight adds the sense of penetrating below the surface"
      },
      {
        "word": "discernment",
        "note": "more formal; stresses good judgement in telling things apart, not just seeing deeply"
      },
      {
        "word": "revelation",
        "note": "stronger and more sudden — a striking realisation, whereas insight can be quiet and gradual"
      },
      {
        "word": "acumen",
        "note": "focuses on sharp practical judgement (often in business), rather than a specific deep understanding"
      }
    ],
    "antonymsByTone": [
      {
        "word": "ignorance",
        "note": "opposite as a lack of knowledge or understanding altogether"
      },
      {
        "word": "blindness",
        "note": "figurative opposite — failing to see or grasp what is really there"
      },
      {
        "word": "obtuseness",
        "note": "more formal opposite — slowness to understand"
      }
    ],
    "commonConfusion": "Do not confuse 'insight' (deep understanding) with 'incite' (to stir someone to action). They sound similar but mean very different things.",
    "beginnerExample": "Her question gave me a new insight into the problem.",
    "writingExample": "The report's real value lies in its insight into why customers leave, not just how many.",
    "advancedExample": "The novel's quiet power comes from its insight into how grief reshapes ordinary routines.",
    "memoryTip": "Insight = seeing 'in' — looking inside something to understand it."
  },
  "intent": {
    "word": "intent",
    "plainMeaning": "What someone means or plans to do; the purpose behind an action.",
    "whenToUse": "Use the noun for the purpose or aim behind what someone does, especially in careful, legal, or reflective contexts. As an adjective ('intent on'), use it for being firmly focused or determined.",
    "commonContext": "Common in law, design, and thoughtful writing (criminal intent, the intent of the author, intent on winning).",
    "synonymsByTone": [
      {
        "word": "intention",
        "note": "nearly identical but softer and more everyday; 'intent' sounds more deliberate and formal, and is standard in legal use"
      },
      {
        "word": "purpose",
        "note": "emphasises the goal or reason for existing, often broader and more enduring than a single intent"
      },
      {
        "word": "aim",
        "note": "more concrete and target-focused; the specific thing you're trying to reach"
      },
      {
        "word": "resolve",
        "note": "as an adjective sense, stresses firm determination more than the plan itself"
      },
      {
        "word": "objective",
        "note": "cooler and more formal; a defined goal, usually measurable, rather than an inner purpose"
      }
    ],
    "antonymsByTone": [
      {
        "word": "accident",
        "note": "opposite of deliberate intent — something unplanned"
      },
      {
        "word": "chance",
        "note": "opposite in the sense of happening without design or purpose"
      }
    ],
    "commonConfusion": "Note the pair 'intent' and 'intention': they overlap heavily, but 'intent' is preferred in fixed and legal phrases ('with intent to defraud', 'to all intents and purposes'), while 'intention' fits looser everyday use.",
    "beginnerExample": "It was never my intent to hurt anyone.",
    "writingExample": "The court had to decide whether the driver acted with intent or by mistake.",
    "advancedExample": "She listened with the intent stillness of someone determined not to miss a single word.",
    "memoryTip": "'Intent' points at what you 'in-tend' — the plan you hold inside before you act."
  },
  "level": {
    "word": "level",
    "plainMeaning": "A position on a scale of amount, height, rank, or quality — or, as a verb, to make something flat and even.",
    "whenToUse": "Reach for 'level' when you need a neutral word for a point on a scale (a level of experience, noise, or difficulty) or to describe something flat and horizontal. It works in almost any register, from casual talk to technical writing.",
    "commonContext": "Very common in education (grade levels), gaming (level up), business (management levels), and everyday measurement (water level, stress level).",
    "synonymsByTone": [
      {
        "word": "stage",
        "note": "implies a step in a sequence or process, not just a fixed rank on a scale"
      },
      {
        "word": "tier",
        "note": "more structured and hierarchical — suggests clearly separated layers, often in pricing or membership"
      },
      {
        "word": "grade",
        "note": "emphasises quality or rank as measured or assigned, as with school grades or grades of steel"
      },
      {
        "word": "degree",
        "note": "more abstract — the extent or amount of something, as in 'a high degree of accuracy'"
      },
      {
        "word": "rank",
        "note": "narrower — position relative to others in an ordered list or hierarchy"
      }
    ],
    "antonymsByTone": [
      {
        "word": "uneven",
        "note": "opposite of the 'flat' sense — bumpy or not smooth"
      },
      {
        "word": "sloping",
        "note": "opposite of the horizontal sense — tilted rather than flat"
      }
    ],
    "commonConfusion": "As an adjective, 'level' (flat, even) is sometimes confused with 'even' — but 'even' can also mean 'equal' or 'divisible by two', while 'level' specifically points to a flat, horizontal surface.",
    "beginnerExample": "The water in the glass is at the same level as the line.",
    "writingExample": "By her final year, she had reached a level of fluency that let her follow rapid conversation without effort.",
    "advancedExample": "The negotiations finally moved onto a level playing field once both sides agreed to share their data.",
    "memoryTip": "Think of a carpenter's spirit 'level': the bubble sits centered only when the surface is flat and even — the core image behind the word."
  },
  "method": {
    "word": "method",
    "plainMeaning": "A planned, orderly way of doing something to reach a result.",
    "whenToUse": "Use 'method' when you want to stress a defined, repeatable procedure rather than a one-off action or a vague approach. It fits instructions, research, teaching, and any context where the how matters.",
    "commonContext": "Common in science and research (scientific method), teaching, cooking recipes, and how-to guides.",
    "synonymsByTone": [
      {
        "word": "technique",
        "note": "narrower and more skill-based — a specific way of executing one part of a task"
      },
      {
        "word": "approach",
        "note": "broader and looser — the general attitude or angle you take, not a fixed set of steps"
      },
      {
        "word": "procedure",
        "note": "more formal and rigid — an official, step-by-step sequence that must be followed"
      },
      {
        "word": "system",
        "note": "larger in scope — an organised whole of connected methods and parts"
      },
      {
        "word": "means",
        "note": "more abstract — the tool or route by which you achieve something, not the steps themselves"
      }
    ],
    "antonymsByTone": [
      {
        "word": "guesswork",
        "note": "the opposite of a planned method — acting without a clear procedure"
      },
      {
        "word": "improvisation",
        "note": "opposite in spirit — making it up as you go rather than following set steps"
      }
    ],
    "commonConfusion": "Do not confuse 'method' with 'methodology'. A method is the actual procedure you use; a methodology is the study or overarching framework of methods. In everyday writing, 'method' is usually the word you want.",
    "beginnerExample": "She showed me an easy method for remembering names.",
    "writingExample": "The team compared two methods for cleaning the data and chose the one that produced fewer errors.",
    "advancedExample": "His method, for all its apparent chaos, followed a strict internal logic that only became clear in the final chapter.",
    "memoryTip": "'Method' contains 'a path' idea — a set route from start to finish, not random wandering."
  },
  "modern": {
    "word": "modern",
    "plainMeaning": "Relating to the present time or recent times, or using the newest ideas and styles.",
    "whenToUse": "Use 'modern' to describe things belonging to the current era or built on up-to-date methods and design. It fits discussions of technology, design, history, and trends.",
    "commonContext": "Common in design and architecture, technology writing, history, and product descriptions.",
    "synonymsByTone": [
      {
        "word": "contemporary",
        "note": "more formal; stresses 'of the present moment,' often used in art and design"
      },
      {
        "word": "current",
        "note": "focuses on what exists right now, without the style or progress overtones"
      },
      {
        "word": "up-to-date",
        "note": "everyday phrasing; emphasizes having the latest information or features"
      },
      {
        "word": "cutting-edge",
        "note": "much stronger — at the very front of innovation, beyond merely recent"
      },
      {
        "word": "new",
        "note": "broader and plainer; about recency, not necessarily current style or methods"
      }
    ],
    "antonymsByTone": [
      {
        "word": "old-fashioned",
        "note": "everyday; suggests a style or method that feels out of date"
      },
      {
        "word": "traditional",
        "note": "neutral to positive; follows long-standing custom rather than being outdated"
      },
      {
        "word": "ancient",
        "note": "far in the past, often used loosely for anything very old"
      },
      {
        "word": "outdated",
        "note": "critical; no longer useful or in step with the present"
      }
    ],
    "commonConfusion": "'Modern' can clash with 'modernist,' which refers to a specific 20th-century movement in art and design, not simply anything recent; the two are related but not interchangeable.",
    "beginnerExample": "We moved into a modern apartment with lots of glass and light.",
    "writingExample": "The museum pairs ancient artifacts with modern displays that let visitors zoom in on every detail.",
    "advancedExample": "What we call modern medicine would have seemed like sorcery to physicians of only a few centuries ago.",
    "memoryTip": "'Modern' sits close to 'mode' (current fashion) — think of what is in style now."
  },
  "original": {
    "word": "original",
    "plainMeaning": "Being the first or earliest version of something, or being new and not copied from anyone else.",
    "whenToUse": "Use 'original' either to point back to the first version of something (the original plan, the original owner) or to praise fresh, non-copied creativity (an original idea). Let context tell readers which sense you mean.",
    "commonContext": "Common in art and design, product descriptions (original packaging), history (the original manuscript), and praise for creative work.",
    "synonymsByTone": [
      {
        "word": "novel",
        "note": "leans on newness only — stresses that something has not been seen before, without the 'first version' sense"
      },
      {
        "word": "authentic",
        "note": "stresses genuineness rather than being first — that it is real, not a fake or reproduction"
      },
      {
        "word": "innovative",
        "note": "stronger and forward-looking — implies not just new but improving on what came before"
      },
      {
        "word": "initial",
        "note": "covers only the 'first' sense — the earliest one in time, with no hint of creativity"
      },
      {
        "word": "pioneering",
        "note": "much stronger — being first to open up a whole new field or approach"
      }
    ],
    "antonymsByTone": [
      {
        "word": "copied",
        "note": "opposite of the creative sense — taken directly from another source"
      },
      {
        "word": "derivative",
        "note": "critical opposite — clearly based on someone else's work and lacking freshness"
      },
      {
        "word": "duplicate",
        "note": "opposite of the 'first' sense — an identical later copy"
      }
    ],
    "commonConfusion": "Watch the two senses: 'the original document' means the first, genuine one, while 'an original idea' means a creative, uncopied one. Readers can misread which you intend if the sentence is ambiguous.",
    "beginnerExample": "This is the original photo, before I edited it.",
    "writingExample": "The museum displays the original letters alongside modern copies visitors can handle.",
    "advancedExample": "Her thesis was praised less for its conclusions than for its genuinely original framing of a tired debate.",
    "memoryTip": "'Original' shares its root with 'origin' — the place something began, which anchors both the 'first' and the 'freshly created' senses."
  },
  "power": {
    "word": "power",
    "plainMeaning": "The ability to do something or to control people, events, or forces.",
    "whenToUse": "Use 'power' for physical energy, political or personal control, or the capacity to make things happen. It suits everything from casual talk to formal analysis, and appears in science, politics, and everyday speech.",
    "commonContext": "Common in politics, physics and engineering, business, sports, and everyday conversation about ability or electricity.",
    "synonymsByTone": [
      {
        "word": "strength",
        "note": "emphasizes physical or inner force, not control over others"
      },
      {
        "word": "authority",
        "note": "narrower — the recognized right to give orders, not raw force"
      },
      {
        "word": "control",
        "note": "focuses on directing or restraining, rather than the capacity behind it"
      },
      {
        "word": "energy",
        "note": "more physical or scientific — the fuel that does work, especially electricity"
      },
      {
        "word": "influence",
        "note": "softer — the ability to shape outcomes indirectly, without formal power"
      }
    ],
    "antonymsByTone": [
      {
        "word": "weakness",
        "note": "the plain opposite when 'power' means strength or capability"
      },
      {
        "word": "powerlessness",
        "note": "emphasizes having no control or ability to act"
      },
      {
        "word": "impotence",
        "note": "formal and stronger — a complete inability to influence or act"
      }
    ],
    "commonConfusion": "'Power' and 'authority' overlap but differ: authority is the legitimate right to act, while power is the actual ability, which someone can have without authority (or vice versa).",
    "beginnerExample": "The storm knocked out the power in our house.",
    "writingExample": "Real power in the company sat not with the CEO but with the small team that controlled the budget.",
    "advancedExample": "Power, unexercised, is only a rumor; it becomes real the moment someone chooses to act on it.",
    "memoryTip": "Think of 'power' as both the electricity in the wall and the pull of a president — both are the ability to make things happen."
  },
  "practical": {
    "word": "practical",
    "plainMeaning": "Useful and sensible in real situations, rather than only good in theory.",
    "whenToUse": "Use 'practical' to praise things that actually work in everyday use, or to describe a down-to-earth, results-focused person. It signals a contrast with the abstract, the theoretical, or the impractical.",
    "commonContext": "Common in advice, product reviews, education (practical skills), and descriptions of people's temperaments.",
    "synonymsByTone": [
      {
        "word": "pragmatic",
        "note": "more formal and strategic — focused on what works and what gets results, sometimes at the cost of ideals"
      },
      {
        "word": "sensible",
        "note": "warmer and more about sound judgment than usefulness in action"
      },
      {
        "word": "functional",
        "note": "narrower — works and does its job, but without the sense of being wisely chosen"
      },
      {
        "word": "hands-on",
        "note": "informal — stresses direct doing and experience rather than usefulness"
      },
      {
        "word": "feasible",
        "note": "different angle — able to be done in practice, about possibility rather than usefulness"
      }
    ],
    "antonymsByTone": [
      {
        "word": "theoretical",
        "note": "opposite in focus — concerned with ideas rather than real application"
      },
      {
        "word": "impractical",
        "note": "direct opposite — not workable or useful in real life"
      },
      {
        "word": "idealistic",
        "note": "softer opposite — guided by ideals rather than what actually works"
      }
    ],
    "commonConfusion": "Do not confuse 'practical' with 'practicable'. 'Practical' means useful and sensible; 'practicable' means simply able to be carried out. A plan can be practicable (doable) yet not practical (not worth the effort).",
    "beginnerExample": "A backpack is more practical than a suitcase for hiking.",
    "writingExample": "The workshop skips the theory and focuses on practical steps you can apply the next morning.",
    "advancedExample": "For all his grand visions, it was his practical instinct for what could actually be built that made the projects succeed.",
    "memoryTip": "Link 'practical' to 'practice' — it is about what works when you actually put it into practice, not just on paper."
  },
  "precise": {
    "word": "precise",
    "plainMeaning": "Exact and correct in every detail, with no vagueness.",
    "whenToUse": "Use 'precise' when you want to stress exactness — that a measurement, statement, or action is sharply defined and leaves no room for error. It fits technical, scientific, and careful everyday writing.",
    "commonContext": "Common in science, engineering, measurement, instructions, and descriptions of careful language or timing.",
    "synonymsByTone": [
      {
        "word": "exact",
        "note": "very close in meaning but plainer — 'precise' hints more at careful attention to fine detail"
      },
      {
        "word": "accurate",
        "note": "different focus — 'accurate' means matching the truth or target, while 'precise' means sharply defined and consistent"
      },
      {
        "word": "specific",
        "note": "about being detailed and particular rather than exact — narrowing things down, not measuring them"
      },
      {
        "word": "meticulous",
        "note": "describes a person's care and thoroughness rather than the exactness of a result"
      },
      {
        "word": "definite",
        "note": "weaker — clearly settled or fixed, but without the fine-grained exactness of 'precise'"
      }
    ],
    "antonymsByTone": [
      {
        "word": "vague",
        "note": "direct opposite — unclear and lacking sharp detail"
      },
      {
        "word": "approximate",
        "note": "milder opposite — roughly right but not exact"
      },
      {
        "word": "imprecise",
        "note": "plain opposite — not exact, loosely defined"
      }
    ],
    "commonConfusion": "'Precise' and 'accurate' are often used as if identical, but they differ: accurate means close to the true value, precise means consistently exact and finely detailed. A scale can be precise (same reading every time) yet inaccurate (consistently wrong).",
    "beginnerExample": "Please give me the precise time the train leaves.",
    "writingExample": "The recipe calls for precise measurements, so a kitchen scale works better than measuring cups.",
    "advancedExample": "Her prose is precise to the point of austerity: not a single word could be swapped without loss.",
    "memoryTip": "'Precise' cuts things down to an exact point — think of trimming away everything vague until only the exact detail remains."
  },
  "premium": {
    "word": "premium",
    "plainMeaning": "Of higher quality or value than the standard, and usually costing more.",
    "whenToUse": "Use 'premium' to signal a top tier of quality, service, or price above the ordinary version. It is especially common in marketing and pricing, so use it honestly to avoid sounding like empty hype.",
    "commonContext": "Common in product marketing, subscription tiers, pricing pages, and descriptions of upscale goods and services.",
    "synonymsByTone": [
      {
        "word": "high-end",
        "note": "similar but plainer; describes the top of a market range without the pricing overtone"
      },
      {
        "word": "luxury",
        "note": "stronger — implies indulgence and prestige, not just above-average quality"
      },
      {
        "word": "deluxe",
        "note": "marketing flavor; suggests extra features or comfort, sometimes lightly dated"
      },
      {
        "word": "superior",
        "note": "a direct quality comparison ('superior to') rather than a tier or price label"
      },
      {
        "word": "top-tier",
        "note": "casual and ranking-focused; stresses being at the highest level"
      }
    ],
    "antonymsByTone": [
      {
        "word": "basic",
        "note": "the neutral entry-level opposite, common in product tiers"
      },
      {
        "word": "standard",
        "note": "the ordinary default version, with no negative judgment"
      },
      {
        "word": "budget",
        "note": "emphasizes low price, sometimes hinting at lower quality"
      },
      {
        "word": "economy",
        "note": "focuses on cost-saving, common with travel and packaging"
      }
    ],
    "commonConfusion": "'Premium' as an adjective (high quality) is different from the noun 'premium' meaning a payment or surcharge, as in an insurance premium or paying 'a premium' for something.",
    "beginnerExample": "This is the premium version, so it costs a little more.",
    "writingExample": "The brand built its reputation on premium materials and quietly kept its prices high.",
    "advancedExample": "Investors were willing to pay a premium for shares in a company they believed dominated a premium market.",
    "memoryTip": "Link 'premium' to 'prime' — both start with 'pri-/pre-' and point to top quality."
  },
  "real": {
    "word": "real",
    "plainMeaning": "Actually existing or true, not fake, imagined, or copied.",
    "whenToUse": "Use 'real' to stress that something genuinely exists or is authentic rather than false or artificial. It works in casual speech, marketing, and factual statements about what is true.",
    "commonContext": "Common in everyday conversation, advertising ('real fruit'), and statements distinguishing fact from fiction.",
    "synonymsByTone": [
      {
        "word": "genuine",
        "note": "slightly more formal; stresses authenticity, often of feelings or materials (genuine leather, genuine concern)"
      },
      {
        "word": "actual",
        "note": "emphasizes factual existence over what was assumed or claimed, rather than fake-versus-real"
      },
      {
        "word": "authentic",
        "note": "stresses being true to an original or source, common with culture, art, and identity"
      },
      {
        "word": "true",
        "note": "focuses on correctness or fidelity to fact, not physical existence"
      },
      {
        "word": "legitimate",
        "note": "adds a sense of being valid, lawful, or properly recognized"
      }
    ],
    "antonymsByTone": [
      {
        "word": "fake",
        "note": "blunt and everyday — deliberately false or imitation"
      },
      {
        "word": "imaginary",
        "note": "exists only in the mind, with no deception implied"
      },
      {
        "word": "artificial",
        "note": "made by people to resemble something natural, not necessarily deceptive"
      },
      {
        "word": "fictional",
        "note": "invented for a story; neutral, not an accusation"
      }
    ],
    "commonConfusion": "'Real' (genuine/existing) is often confused with 'really' (an adverb meaning 'very' or 'actually'); write 'a real problem' but 'really difficult,' not 'a really problem.'",
    "beginnerExample": "Is this a real diamond or a fake one?",
    "writingExample": "Behind the polished slogans lay a real risk that few were willing to name.",
    "advancedExample": "What began as a rumor took on a life of its own until the panic it caused was entirely real.",
    "memoryTip": "'Real' relates to 'reality' — if it belongs to reality, it's real."
  },
  "reliable": {
    "word": "reliable",
    "plainMeaning": "Able to be trusted to work well or behave consistently over time.",
    "whenToUse": "Use 'reliable' to praise people, products, or sources you can count on again and again. It signals steady, dependable performance rather than a single impressive moment.",
    "commonContext": "Common in reviews, references and recommendations, journalism (reliable sources), and descriptions of people, cars, and equipment.",
    "synonymsByTone": [
      {
        "word": "dependable",
        "note": "very close, slightly warmer — often used of people you can lean on emotionally as well as practically"
      },
      {
        "word": "trustworthy",
        "note": "focuses on honesty and integrity, not just consistent performance"
      },
      {
        "word": "consistent",
        "note": "narrower — always the same, though 'consistent' does not by itself promise a good result"
      },
      {
        "word": "steady",
        "note": "more about calm, unchanging behaviour than about being counted on for a task"
      },
      {
        "word": "solid",
        "note": "informal — broadly good and dependable, but vaguer and more casual"
      }
    ],
    "antonymsByTone": [
      {
        "word": "unreliable",
        "note": "direct opposite — cannot be counted on"
      },
      {
        "word": "erratic",
        "note": "stronger opposite — unpredictable and inconsistent from one time to the next"
      },
      {
        "word": "flaky",
        "note": "informal opposite, usually of people — likely to let you down or cancel"
      }
    ],
    "commonConfusion": "Do not confuse 'reliable' with 'valid'. In research especially, reliable means giving consistent results each time, while valid means actually measuring what it claims to. Something can be reliable yet not valid.",
    "beginnerExample": "My old bike is slow, but it's very reliable.",
    "writingExample": "The report leans on reliable sources, each one cross-checked against independent records.",
    "advancedExample": "In a market flooded with hype, its reputation rested on something quieter and rarer: being reliable, year after year.",
    "memoryTip": "You can 'rely' on something 'reliable' — the verb sits right inside the word."
  },
  "result": {
    "word": "result",
    "plainMeaning": "The outcome or effect that comes from something that happened or was done.",
    "whenToUse": "Use it whenever you want to name what came out of an action, event, or process. It works in everyday speech, business, and science alike, and can be a noun (the result) or a verb (to result in/from).",
    "commonContext": "Common in reports, science and research writing, sports, exams, business updates, and everyday conversation.",
    "synonymsByTone": [
      {
        "word": "outcome",
        "note": "more neutral and final-sounding; emphasizes how something turned out rather than what caused it"
      },
      {
        "word": "consequence",
        "note": "stresses that it follows logically or causally, and often leans negative"
      },
      {
        "word": "effect",
        "note": "focuses on the direct impact one thing has on another; pairs with a cause"
      },
      {
        "word": "upshot",
        "note": "informal; signals the final point or bottom line of a longer story"
      },
      {
        "word": "fallout",
        "note": "informal and negative; the messy aftermath of something going wrong"
      }
    ],
    "antonymsByTone": [
      {
        "word": "cause",
        "note": "the thing that produces the result rather than the result itself"
      },
      {
        "word": "origin",
        "note": "the starting point, the opposite end of the chain from the outcome"
      }
    ],
    "commonConfusion": "Do not confuse 'result in' with 'result from': X results in Y means X causes Y, while X results from Y means X is caused by Y. They reverse the direction of cause and effect.",
    "beginnerExample": "She studied hard, and the result was a great grade.",
    "writingExample": "The merger was the direct result of months of quiet negotiation between the two firms.",
    "advancedExample": "Whatever the committee decides, the result will shape hiring policy for the next decade.",
    "memoryTip": "A result RESULTs from something before it — think of it as the end of a chain of cause and effect."
  },
  "safe": {
    "word": "safe",
    "plainMeaning": "Free from harm, danger, or risk.",
    "whenToUse": "Use 'safe' when you want to say something protects people from harm or carries little risk. It fits everyday speech, safety warnings, product claims, and reassurance alike.",
    "commonContext": "Common in safety instructions, product labels, health and travel advice, and everyday reassurance.",
    "synonymsByTone": [
      {
        "word": "secure",
        "note": "leans toward protection from threat or loss (locked, guarded) rather than freedom from physical danger"
      },
      {
        "word": "harmless",
        "note": "focuses on causing no damage, rather than being protected from it"
      },
      {
        "word": "protected",
        "note": "implies an active barrier or safeguard is in place, not just an absence of danger"
      },
      {
        "word": "risk-free",
        "note": "stronger and more absolute — claims zero risk, which is often an overstatement"
      },
      {
        "word": "sound",
        "note": "more formal; suggests something is in good, reliable condition (a sound structure, sound advice)"
      }
    ],
    "antonymsByTone": [
      {
        "word": "dangerous",
        "note": "the direct opposite — likely to cause harm"
      },
      {
        "word": "risky",
        "note": "milder; involves the chance of harm rather than certain harm"
      },
      {
        "word": "hazardous",
        "note": "more formal or technical, common in warnings and regulations"
      },
      {
        "word": "unsafe",
        "note": "plain negation, neutral in tone"
      }
    ],
    "commonConfusion": "Do not confuse 'safe' (an adjective: 'the water is safe') with 'save' (a verb: 'save the file'); they sound similar but differ by one letter and one is a describing word, the other an action.",
    "beginnerExample": "The children are safe at home.",
    "writingExample": "The bridge was declared safe only after engineers finished a full inspection.",
    "advancedExample": "In negotiations she played it safe, conceding small points to keep the larger deal secure.",
    "memoryTip": "Think 'safe = no harm can reach you,' like being inside a locked safe."
  },
  "serious": {
    "word": "serious",
    "plainMeaning": "Something important enough to be treated with care and concern, or a person who is thoughtful and not joking.",
    "whenToUse": "Use it when something demands real attention because it could have significant consequences, or to describe someone's earnest, no-nonsense manner. It also works informally to mean 'large in amount' (serious money).",
    "commonContext": "Common in news, health and safety contexts, personal descriptions, and casual emphasis ('serious talent').",
    "synonymsByTone": [
      {
        "word": "grave",
        "note": "more formal and heavier; suggests danger or a somber mood"
      },
      {
        "word": "severe",
        "note": "emphasizes intensity or harshness rather than importance"
      },
      {
        "word": "earnest",
        "note": "focuses on sincerity of manner, with none of the 'dangerous' meaning"
      },
      {
        "word": "solemn",
        "note": "adds a formal, ceremonial dignity, often quiet and reverent"
      },
      {
        "word": "significant",
        "note": "neutral and measured; stresses importance without implying worry"
      }
    ],
    "antonymsByTone": [
      {
        "word": "trivial",
        "note": "the opposite of important; too minor to worry about"
      },
      {
        "word": "lighthearted",
        "note": "opposite of the earnest manner; playful and easygoing"
      },
      {
        "word": "frivolous",
        "note": "carelessly unserious, often with a hint of disapproval"
      },
      {
        "word": "minor",
        "note": "small in scale or consequence, the mild opposite"
      }
    ],
    "commonConfusion": "Do not confuse 'serious' (grave, important) with 'seriously' as a casual intensifier; and note that 'a serious injury' means a bad one, while 'a serious student' means a diligent, earnest one.",
    "beginnerExample": "This is a serious problem, so we need to fix it now.",
    "writingExample": "Her serious expression told everyone the news was not good.",
    "advancedExample": "Beneath his playful tone lay a serious argument that few in the room were prepared to answer.",
    "memoryTip": "If you'd stop smiling to deal with it, it's probably serious."
  },
  "sharp": {
    "word": "sharp",
    "plainMeaning": "Having a fine edge or point that cuts, or (of the mind, senses, or changes) quick, clear, and intense.",
    "whenToUse": "Use 'sharp' for cutting edges, quick intelligence, clear focus, sudden changes, or a stylish, well-defined look. It ranges easily from everyday to figurative use.",
    "commonContext": "Common in cooking and tools, descriptions of intelligence, weather and pain, finance (a sharp rise), and fashion.",
    "synonymsByTone": [
      {
        "word": "keen",
        "note": "more figurative — a keen mind or keen eyesight; rarely used for a literal blade today"
      },
      {
        "word": "acute",
        "note": "formal — used for senses, angles, or intense pain rather than blades"
      },
      {
        "word": "pointed",
        "note": "narrower — having a point; figuratively, remarks that are direct and cutting"
      },
      {
        "word": "abrupt",
        "note": "for changes — sudden and jarring, without the sense of precision"
      },
      {
        "word": "crisp",
        "note": "for images or style — clean and well-defined, but softer than 'sharp'"
      }
    ],
    "antonymsByTone": [
      {
        "word": "dull",
        "note": "opposite for both blades and minds — not sharp, slow, or blunt"
      },
      {
        "word": "blunt",
        "note": "for edges — having no cutting point; figuratively, plain-spoken"
      },
      {
        "word": "gradual",
        "note": "opposite for changes — happening slowly rather than suddenly"
      }
    ],
    "commonConfusion": "In music, 'sharp' means a note raised or pitched too high, and 'flat' means too low — the opposite of 'flat' here is not 'dull'.",
    "beginnerExample": "Be careful, the knife is very sharp.",
    "writingExample": "There was a sharp drop in sales after the price increase.",
    "advancedExample": "Her questions were sharp without being unkind, cutting straight to the flaw in every argument.",
    "memoryTip": "A sharp knife cuts cleanly and a sharp mind thinks cleanly — both get straight to the point."
  },
  "smart": {
    "word": "smart",
    "plainMeaning": "Showing quick intelligence or good judgment; also, neat and stylish in appearance.",
    "whenToUse": "Use 'smart' in everyday speech for someone quick-thinking or for a clever decision. In British English it also commonly means well-dressed or tidy, and in tech it labels devices with built-in intelligence.",
    "commonContext": "Casual conversation, praise for decisions ('smart move'), technology ('smart phone', 'smart home'), and, especially in British English, describing sharp clothing or appearance.",
    "synonymsByTone": [
      {
        "word": "intelligent",
        "note": "more formal and measured — describes real mental ability rather than snappy cleverness"
      },
      {
        "word": "clever",
        "note": "close, but can hint at quick trickiness or ingenuity more than deep intelligence"
      },
      {
        "word": "sharp",
        "note": "informal — stresses quick, alert perception, catching things fast"
      },
      {
        "word": "shrewd",
        "note": "emphasizes practical, self-interested judgment, especially in business or dealings"
      },
      {
        "word": "bright",
        "note": "warmer and gentler, often used of children or promising learners"
      }
    ],
    "antonymsByTone": [
      {
        "word": "stupid",
        "note": "blunt, harsh opposite of the intelligence sense"
      },
      {
        "word": "foolish",
        "note": "opposite of a smart decision — shows poor judgment"
      },
      {
        "word": "dull",
        "note": "milder — slow-witted rather than actively stupid"
      },
      {
        "word": "scruffy",
        "note": "opposite of the 'well-dressed' sense — untidy in appearance"
      }
    ],
    "commonConfusion": "'Smart' can also mean to sting or hurt ('the cut smarts'); and in British vs. American English it splits between 'well-dressed' and simply 'intelligent', so watch the intended sense.",
    "beginnerExample": "She is a smart student who always finishes her homework early.",
    "writingExample": "Cutting the meeting to fifteen minutes was a smart move that saved the whole team hours each week.",
    "advancedExample": "It was a smart, almost cynical piece of positioning: to look principled while quietly protecting the bottom line.",
    "memoryTip": "Two everyday senses share the word: a 'smart' mind and a 'smart' outfit — both suggest sharp and put-together."
  },
  "smooth": {
    "word": "smooth",
    "plainMeaning": "Having an even surface with no bumps, or happening easily without trouble or interruption.",
    "whenToUse": "Use it for physical textures that feel even to the touch, for processes that go without a hitch, or figuratively for polished, effortless manner. Be aware the 'manner' sense can carry a hint of being too slick or insincere.",
    "commonContext": "Common in product descriptions, cooking and skincare, driving and travel, and describing how a process or transition went.",
    "synonymsByTone": [
      {
        "word": "even",
        "note": "plainer; stresses uniformity and flatness rather than the pleasant feel"
      },
      {
        "word": "sleek",
        "note": "adds a stylish, glossy, streamlined look"
      },
      {
        "word": "seamless",
        "note": "for processes; emphasizes no visible joins or interruptions at all"
      },
      {
        "word": "polished",
        "note": "suggests refinement achieved through effort or skill"
      },
      {
        "word": "glossy",
        "note": "focuses on a shiny reflective surface, not just an even one"
      }
    ],
    "antonymsByTone": [
      {
        "word": "rough",
        "note": "the direct opposite for texture; uneven and coarse"
      },
      {
        "word": "bumpy",
        "note": "opposite for rides or processes; jolting and uneven"
      },
      {
        "word": "jagged",
        "note": "sharply irregular, a stronger textural opposite"
      },
      {
        "word": "coarse",
        "note": "emphasizes a gritty, harsh feel"
      }
    ],
    "commonConfusion": "Do not confuse 'smooth' with 'smoothen'; in most everyday use 'smooth' itself is the verb ('smooth the surface'), and 'smoothen' sounds needlessly formal to many readers.",
    "beginnerExample": "The baby's skin felt soft and smooth.",
    "writingExample": "After weeks of planning, the office move went off smoothly, with no downtime at all.",
    "advancedExample": "He had a smooth answer for every objection, which was exactly what made the board uneasy.",
    "memoryTip": "Picture running your hand over glass — no snags, no bumps: that's smooth."
  },
  "source": {
    "word": "source",
    "plainMeaning": "The place, person, or thing that something comes from or originates in.",
    "whenToUse": "Use it to name where something starts or where information, materials, or supplies come from. In research and journalism it specifically means the origin of information; as a verb it means to obtain or find something.",
    "commonContext": "Common in journalism, research and citations, supply chains, nutrition ('a good source of iron'), and business procurement.",
    "synonymsByTone": [
      {
        "word": "origin",
        "note": "more abstract; the starting point or root, less about supply"
      },
      {
        "word": "root",
        "note": "emphasizes the deepest underlying cause"
      },
      {
        "word": "supplier",
        "note": "narrower; a source specifically of goods or services in business"
      },
      {
        "word": "wellspring",
        "note": "literary and positive; an abundant, ongoing source"
      },
      {
        "word": "provenance",
        "note": "formal; the documented origin and history of an object"
      }
    ],
    "antonymsByTone": [
      {
        "word": "outcome",
        "note": "what comes out at the end rather than where it began"
      },
      {
        "word": "endpoint",
        "note": "the destination, the opposite end from the source"
      }
    ],
    "commonConfusion": "Do not confuse 'source' with 'sauce'; they sound alike but 'source' is an origin, while 'sauce' is a liquid you put on food. In writing, also keep 'source' (origin) distinct from 'resource' (a supply you can draw on).",
    "beginnerExample": "The river's source is high up in the mountains.",
    "writingExample": "The reporter refused to name her source, citing a promise of confidentiality.",
    "advancedExample": "Tracing the rumour back to its source proved harder than anyone expected, since each person had heard it from someone else.",
    "memoryTip": "A river's source is where it starts — trace anything back far enough and you reach its source."
  },
  "stable": {
    "word": "stable",
    "plainMeaning": "Firmly fixed and unlikely to change, move, or fall; steady and dependable.",
    "whenToUse": "Use it when something stays steady over time, whether a structure, a situation, a mood, or a person's condition. It fits finance, health, engineering, and relationships; note it can also be a noun meaning a building for horses.",
    "commonContext": "Common in medicine ('the patient is stable'), finance and economics, engineering, software ('a stable release'), and describing moods or relationships.",
    "synonymsByTone": [
      {
        "word": "steady",
        "note": "emphasizes consistency and lack of wobble over time"
      },
      {
        "word": "secure",
        "note": "adds a sense of safety from threat or collapse"
      },
      {
        "word": "solid",
        "note": "more informal; suggests dependable strength"
      },
      {
        "word": "settled",
        "note": "implies things have calmed into a fixed state after change"
      },
      {
        "word": "balanced",
        "note": "stresses equilibrium between opposing forces"
      }
    ],
    "antonymsByTone": [
      {
        "word": "unstable",
        "note": "the direct opposite; liable to change or collapse"
      },
      {
        "word": "shaky",
        "note": "informal; suggests wobbling and low confidence"
      },
      {
        "word": "volatile",
        "note": "stronger; prone to sudden, unpredictable swings"
      },
      {
        "word": "precarious",
        "note": "emphasizes being dangerously close to falling"
      }
    ],
    "commonConfusion": "Do not confuse the adjective 'stable' (steady) with the noun 'stable' (a horse barn); they are spelled the same but unrelated in meaning.",
    "beginnerExample": "Make sure the ladder is stable before you climb it.",
    "writingExample": "After a turbulent year, the company's finances finally look stable.",
    "advancedExample": "The ceasefire is holding, but calling the region stable would be premature.",
    "memoryTip": "A stable table doesn't wobble — both stay put."
  },
  "verified": {
    "word": "verified",
    "plainMeaning": "Checked and confirmed to be true, accurate, or genuine.",
    "whenToUse": "Use it when something has been actively checked against evidence and found correct, or when an identity or account has been officially confirmed. It signals a completed check, not just a claim of truth.",
    "commonContext": "Common on social media and account badges, in fact-checking, security and login flows, and quality or identity confirmation.",
    "synonymsByTone": [
      {
        "word": "confirmed",
        "note": "close in meaning but broader; can mean simply agreed or made certain, without a formal check"
      },
      {
        "word": "validated",
        "note": "more technical; stresses meeting set criteria or standards"
      },
      {
        "word": "authenticated",
        "note": "focuses specifically on proving something is genuine, not fake"
      },
      {
        "word": "vetted",
        "note": "implies a thorough background check of a person or thing"
      },
      {
        "word": "corroborated",
        "note": "formal; supported by additional independent evidence"
      }
    ],
    "antonymsByTone": [
      {
        "word": "unverified",
        "note": "the direct opposite; not yet checked or confirmed"
      },
      {
        "word": "unconfirmed",
        "note": "milder; awaiting confirmation but not necessarily false"
      },
      {
        "word": "alleged",
        "note": "claimed but not proven, often used cautiously in reporting"
      }
    ],
    "commonConfusion": "Do not treat 'verified' as the same as 'true'; verified means someone checked it and it held up, whereas an unverified claim can still turn out to be true, just unchecked.",
    "beginnerExample": "The website verified my email before letting me log in.",
    "writingExample": "Only verified accounts were allowed to post during the event to cut down on impersonation.",
    "advancedExample": "The editors ran every figure past two independent sources, so each claim in the piece is verified rather than merely reported.",
    "memoryTip": "Verified shares its root with 'verify' and 'veritable' — all point back to what is true (Latin 'verus')."
  },
  "writer": {
    "word": "writer",
    "plainMeaning": "A person who writes, especially one who does it as a job or creative pursuit.",
    "whenToUse": "Use 'writer' as the broad, neutral term for anyone who produces written work, whether professionally or not. It fits contexts from casual mentions to job titles and covers fiction, journalism, copy, and more.",
    "commonContext": "Common in bios, job titles, publishing, journalism, and everyday conversation about books, blogs, and creative work.",
    "synonymsByTone": [
      {
        "word": "author",
        "note": "narrower and more formal — implies someone who has produced a published book or specific work, whereas a writer may write anything"
      },
      {
        "word": "novelist",
        "note": "specific — a writer of novels only, so it names the genre rather than the general activity"
      },
      {
        "word": "journalist",
        "note": "specific — a writer who reports news, so it signals the field, not just the act of writing"
      },
      {
        "word": "columnist",
        "note": "specific — a writer of a regular opinion or feature column in a publication"
      },
      {
        "word": "scribe",
        "note": "archaic or literary — historically one who copied documents; used today mainly for flavour or humour"
      }
    ],
    "antonymsByTone": [
      {
        "word": "reader",
        "note": "the counterpart on the receiving end — one who consumes writing rather than produces it"
      },
      {
        "word": "editor",
        "note": "not a true opposite, but a distinct role — one who revises and shapes another's writing rather than creating it"
      }
    ],
    "commonConfusion": "Do not confuse 'writer' with 'author'. Every author is a writer, but 'author' specifically implies someone credited with a published work; 'writer' is the wider term for anyone who writes.",
    "beginnerExample": "She is a writer who works for a magazine.",
    "writingExample": "As a freelance writer, he juggled deadlines for three different clients in a single week.",
    "advancedExample": "The best travel writers make you feel the dust of a road you will never walk, turning observation into something close to memory.",
    "memoryTip": "A writer is simply one who writes — the 'er' ending marks the doer, like teacher or baker."
  },
};
