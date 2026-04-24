(function () {
  const fallbackWords = [
    "act","cat","listen","silent","enlist","inlets","tinsel","stone","notes","tones","onset",
    "light","bright","flight","night","right","time","climb","rhyme","chime","prime",
    "day","play","stay","way","say",
  ];

  const WORDS = Array.from(
    new Set(
      (window.WORD_HELPER_WORDS || fallbackWords)
        .map((word) => String(word).toLowerCase())
        .filter((word) => /^[a-z]{2,14}$/.test(word)),
    ),
  ).sort((a, b) => a.length - b.length || a.localeCompare(b));

  const WORD_ENTRIES = WORDS.map((word) => ({
    word,
    freq: frequency(word),
  }));

  const knownRhymes = {
    light: {
      perfect: ["bright", "flight", "night", "right", "sight", "slight", "might", "tight", "fight"],
      near: ["like", "line", "life", "white", "write", "wide", "wild"],
      similar: ["alight", "delight", "highlight", "midnight", "sunlight", "twilight"],
    },
    time: {
      perfect: ["climb", "rhyme", "chime", "prime", "grime", "lime", "mime"],
      near: ["line", "mine", "shine", "fine", "vine", "pine"],
      similar: ["lifetime", "daytime", "meantime", "sometime", "pastime"],
    },
    day: {
      perfect: ["play", "stay", "way", "say", "may", "gray", "ray", "pay", "lay", "bay"],
      near: ["name", "made", "late", "rain", "came", "same"],
      similar: ["today", "someday", "weekday", "birthday", "holiday"],
    },
    night: {
      perfect: ["bright", "flight", "light", "right", "sight", "slight", "might", "tight", "fight"],
      near: ["nice", "nine", "wide", "write", "life"],
      similar: ["midnight", "tonight", "moonlight", "starlight", "nightfall"],
    },
    love: {
      perfect: ["above", "dove", "shove", "glove"],
      near: ["live", "give", "move", "prove", "groove"],
      similar: ["beloved", "lovely", "loving", "lover", "dove"],
    },
    moon: {
      perfect: ["soon", "tune", "June", "noon", "spoon", "boon", "dune", "loon", "prune"],
      near: ["tone", "bone", "zone", "phone", "known", "shown"],
      similar: ["moonlight", "moonrise", "honeymoon", "afternoon", "cartoon"],
    },
    rain: {
      perfect: ["train", "plain", "brain", "main", "chain", "gain", "pain", "lane", "plane", "crane"],
      near: ["name", "same", "came", "game", "frame", "flame"],
      similar: ["rainfall", "raindrop", "raincoat", "refrain", "domain"],
    },
    heart: {
      perfect: ["start", "art", "part", "smart", "chart", "dart", "cart", "apart"],
      near: ["hard", "harm", "star", "far", "bar"],
      similar: ["heartfelt", "heartbeat", "sweetheart", "depart", "impart"],
    },
    dream: {
      perfect: ["team", "stream", "beam", "cream", "seem", "theme", "scheme", "gleam", "steam"],
      near: ["green", "clean", "lean", "mean", "keen"],
      similar: ["daydream", "dreamlike", "mainstream", "extreme", "esteem"],
    },
    face: {
      perfect: ["space", "grace", "place", "race", "trace", "base", "case", "chase", "pace", "lace"],
      near: ["late", "fate", "great", "gate", "rate"],
      similar: ["surface", "embrace", "replace", "birthplace", "displace"],
    },
    name: {
      perfect: ["game", "same", "fame", "came", "frame", "tame", "blame", "flame", "shame", "claim"],
      near: ["rain", "pain", "main", "chain", "plain"],
      similar: ["nickname", "surname", "rename", "filename", "became"],
    },
    home: {
      perfect: ["foam", "roam", "dome", "gnome", "chrome"],
      near: ["stone", "tone", "bone", "alone", "phone"],
      similar: ["hometown", "homeland", "homemade", "overcome", "welcome"],
    },
    fire: {
      perfect: ["hire", "wire", "tire", "desire", "entire", "inspire", "prior", "higher"],
      near: ["fine", "find", "mine", "pine", "vine"],
      similar: ["campfire", "wildfire", "fireside", "expire", "require"],
    },
    free: {
      perfect: ["see", "tree", "three", "key", "tea", "me", "we", "he", "she", "flee", "knee"],
      near: ["feel", "real", "deal", "heal", "meal"],
      similar: ["freedom", "freely", "carefree", "degree", "agree"],
    },
    blue: {
      perfect: ["true", "flew", "grew", "new", "few", "clue", "glue", "view", "crew", "drew"],
      near: ["bloom", "room", "moon", "soon", "tune"],
      similar: ["bluebird", "bluebell", "pursue", "issue", "statue"],
    },
    run: {
      perfect: ["sun", "fun", "done", "won", "gun", "son", "ton", "one", "none", "bun"],
      near: ["come", "some", "from", "drum", "hum"],
      similar: ["running", "runner", "outrun", "begun", "everyone"],
    },
    make: {
      perfect: ["take", "lake", "sake", "wake", "shake", "break", "bake", "fake", "rake", "cake"],
      near: ["pain", "rain", "gain", "name", "same"],
      similar: ["remake", "mistake", "heartbreak", "handshake", "intake"],
    },
    dark: {
      perfect: ["park", "mark", "spark", "bark", "stark", "lark", "shark", "ark", "hark"],
      near: ["heart", "art", "start", "hard", "far"],
      similar: ["darkness", "darken", "landmark", "remark", "embark"],
    },
    mind: {
      perfect: ["find", "kind", "blind", "behind", "remind", "bind", "signed", "lined", "wind"],
      near: ["mine", "time", "fine", "vine", "pine"],
      similar: ["mindset", "remind", "mankind", "behind", "unwind"],
    },
    hope: {
      perfect: ["rope", "cope", "slope", "dope", "grope", "scope", "mope"],
      near: ["home", "phone", "tone", "stone", "alone"],
      similar: ["hopeful", "hopeless", "envelope", "telescope", "horoscope"],
    },
    life: {
      perfect: ["wife", "knife", "strife", "rife"],
      near: ["light", "line", "like", "lime", "live"],
      similar: ["lifetime", "lifestyle", "wildlife", "nightlife", "midlife"],
    },
    world: {
      perfect: ["hurled", "curled", "unfurled", "swirled"],
      near: ["word", "work", "worth", "warm", "ward"],
      similar: ["worldwide", "underworld", "otherworld"],
    },
    gold: {
      perfect: ["bold", "cold", "hold", "old", "sold", "told", "rolled", "fold", "mold"],
      near: ["goal", "soul", "roll", "whole", "role"],
      similar: ["golden", "behold", "household", "stronghold", "withhold"],
    },
    road: {
      perfect: ["code", "mode", "node", "rode", "showed", "load", "toad", "abode"],
      near: ["role", "soul", "hole", "whole", "coal"],
      similar: ["crossroad", "railroad", "download", "episode", "overload"],
    },
  };

  const syllableExceptions = {
    beautiful: 3,
    education: 4,
    family: 3,
    every: 2,
    business: 2,
    poem: 2,
    poetry: 3,
    rhythm: 2,
    fire: 2,
    hour: 1,
    our: 1,
    orange: 2,
    area: 3,
    idea: 3,
    real: 1,
    feel: 1,
    deal: 1,
    heal: 1,
    meal: 1,
    steal: 1,
    wheel: 1,
    people: 2,
    even: 2,
    event: 2,
    ever: 2,
    over: 2,
    under: 2,
    water: 2,
    other: 2,
    enter: 2,
    inner: 2,
    later: 2,
    power: 2,
    tower: 2,
    flower: 2,
    shower: 2,
    lower: 2,
    cover: 2,
    hover: 2,
    lover: 2,
    mover: 2,
    river: 2,
    liver: 2,
    giver: 2,
    silver: 2,
    gather: 2,
    rather: 2,
    father: 2,
    mother: 2,
    brother: 2,
    whether: 2,
    another: 3,
  };

  const toolMeta = {
    "word-unscramble": { title: "Word Unscramble", href: "/tools/word-unscramble/", intro: "Find words from scrambled letters." },
    "anagram-solver": { title: "Anagram Solver", href: "/tools/anagram-solver/", intro: "Solve exact and partial anagrams." },
    "rhyme-finder": { title: "Rhyme Finder", href: "/tools/rhyme-finder/", intro: "Find perfect and near rhymes." },
    "syllable-counter": { title: "Syllable Counter", href: "/tools/syllable-counter/", intro: "Count syllables word by word." },
    "prefix-finder": { title: "Prefix Finder", href: "/tools/prefix-finder/", intro: "Find words starting with a pattern." },
    "suffix-finder": { title: "Suffix Finder", href: "/tools/suffix-finder/", intro: "Find words ending with a pattern." },
  };

  function initTheme() {
    const stored = localStorage.getItem("word-helper-theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    if (!document.documentElement.dataset.theme) {
      document.documentElement.dataset.theme = stored || (prefersDark ? "dark" : "light");
    }
    document.querySelectorAll(".theme-toggle").forEach((button) => {
      button.addEventListener("click", () => {
        const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
        document.documentElement.dataset.theme = next;
        localStorage.setItem("word-helper-theme", next);
      });
    });
  }

  function initNav() {
    const toggle = document.querySelector(".nav-toggle");
    const nav = document.querySelector("#site-nav");
    if (!toggle || !nav) return;
    toggle.addEventListener("click", () => {
      const open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(open));
    });
  }

  function trackToolUsage(toolId) {
    try {
      const recent = JSON.parse(localStorage.getItem("wh-recent-tools") || "[]");
      const updated = [toolId, ...recent.filter((id) => id !== toolId)].slice(0, 6);
      localStorage.setItem("wh-recent-tools", JSON.stringify(updated));
    } catch (_) {}
  }

  function saveRecentInput(toolId, input) {
    if (!input || input.length > 80) return;
    try {
      const inputs = JSON.parse(localStorage.getItem("wh-recent-inputs") || "{}");
      inputs[toolId] = input;
      localStorage.setItem("wh-recent-inputs", JSON.stringify(inputs));
    } catch (_) {}
  }

  function getRecentInput(toolId) {
    try {
      const inputs = JSON.parse(localStorage.getItem("wh-recent-inputs") || "{}");
      return inputs[toolId] || "";
    } catch (_) {
      return "";
    }
  }

  function initRecentTools() {
    const section = document.getElementById("recent-tools-section");
    const list = document.getElementById("recent-tools-list");
    if (!section || !list) return;
    try {
      const recent = JSON.parse(localStorage.getItem("wh-recent-tools") || "[]");
      if (!recent.length) return;
      const html = recent
        .slice(0, 3)
        .map((id) => {
          const meta = toolMeta[id];
          if (!meta) return "";
          return `<a class="resource-card" href="${meta.href}"><strong>${meta.title}</strong><span>${meta.intro}</span><small class="recent-tool-badge">Recently used</small></a>`;
        })
        .join("");
      if (html) {
        list.innerHTML = html;
        section.hidden = false;
      }
    } catch (_) {}
  }

  function lettersOnly(value) {
    return String(value || "").toLowerCase().replace(/[^a-z]/g, "");
  }

  function frequency(value) {
    const counts = new Array(26).fill(0);
    for (const char of value) {
      const code = char.charCodeAt(0) - 97;
      if (code >= 0 && code < 26) counts[code] += 1;
    }
    return counts;
  }

  function sameFrequency(a, b) {
    for (let index = 0; index < 26; index += 1) {
      if (a[index] !== b[index]) return false;
    }
    return true;
  }

  function canBuild(entry, inputFreq, wildcardCount) {
    let missing = 0;
    for (let index = 0; index < 26; index += 1) {
      if (entry.freq[index] > inputFreq[index]) {
        missing += entry.freq[index] - inputFreq[index];
        if (missing > wildcardCount) return false;
      }
    }
    return true;
  }

  function groupByLength(words, descending = true) {
    const groups = new Map();
    for (const word of words) {
      const key = word.length;
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push(word);
    }
    return Array.from(groups.entries())
      .sort((a, b) => (descending ? b[0] - a[0] : a[0] - b[0]))
      .map(([length, list]) => ({
        title: `${length}-letter words`,
        words: list.sort((a, b) => a.localeCompare(b)),
      }));
  }

  async function copyText(text) {
    if (!text) return false;
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      return false;
    }
  }

  function setCopyButton(button, enabled, text) {
    if (!button) return;
    button.disabled = !enabled;
    button.dataset.copyText = text || "";
  }

  function renderMessage(shell, message, kind = "empty") {
    const messageBox = shell.querySelector(".tool-message");
    const results = shell.querySelector(".results");
    const copyAll = shell.querySelector(".copy-all");
    const hint = shell.querySelector(".bookmark-hint");
    if (!messageBox || !results) return;
    messageBox.textContent = message;
    messageBox.className = `tool-message ${kind}`;
    messageBox.hidden = false;
    results.innerHTML = "";
    if (hint) hint.hidden = true;
    setCopyButton(copyAll, false, "");
  }

  function buildCopyText(toolTitle, inputLabel, groups) {
    const header = `Word Helper — ${toolTitle}\n${inputLabel}\n`;
    const body = groups
      .map((group) => `\n${group.title}:\n${group.words.join("\n")}`)
      .join("\n");
    return header + body;
  }

  function renderWordGroups(shell, groups, meta, copyLabel) {
    const messageBox = shell.querySelector(".tool-message");
    const results = shell.querySelector(".results");
    const copyAll = shell.querySelector(".copy-all");
    const hint = shell.querySelector(".bookmark-hint");
    const allWords = groups.flatMap((group) => group.words);
    messageBox.hidden = true;
    results.innerHTML = `${meta ? `<p class="result-meta">${escapeHtml(meta)}</p>` : ""}
      ${groups
        .map(
          (group) => `<section class="result-group">
            <h3>${escapeHtml(group.title)} <small>${group.words.length} result${group.words.length === 1 ? "" : "s"}</small></h3>
            <div class="chip-list">
              ${group.words.map((word) => wordChip(word)).join("")}
            </div>
          </section>`,
        )
        .join("")}`;
    const copyText = copyLabel
      ? buildCopyText(copyLabel.title, copyLabel.input, groups)
      : allWords.join(", ");
    setCopyButton(copyAll, allWords.length > 0, copyText);
    if (hint && allWords.length > 0) hint.hidden = false;
  }

  function wordChip(word) {
    return `<span class="word-chip">${escapeHtml(word)}<button type="button" data-copy-one="${escapeHtml(
      word,
    )}" aria-label="Copy ${escapeHtml(word)}">Copy</button></span>`;
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function getNumber(form, name, fallback) {
    const value = Number(form.elements[name]?.value || "");
    return Number.isFinite(value) && value > 0 ? value : fallback;
  }

  function prefillFromUrl(tool, form) {
    try {
      const q = new URLSearchParams(location.search).get("q");
      if (!q) return;
      const fieldMap = {
        "word-unscramble": "letters",
        "anagram-solver": "phrase",
        "rhyme-finder": "word",
        "syllable-counter": "text",
        "prefix-finder": "prefix",
        "suffix-finder": "suffix",
      };
      const field = fieldMap[tool];
      if (field && form.elements[field]) {
        form.elements[field].value = decodeURIComponent(q);
      }
    } catch (_) {}
  }

  function addRecentInputButton(tool, form, exampleRow) {
    const fieldMap = {
      "word-unscramble": "letters",
      "anagram-solver": "phrase",
      "rhyme-finder": "word",
      "syllable-counter": "text",
      "prefix-finder": "prefix",
      "suffix-finder": "suffix",
    };
    const field = fieldMap[tool];
    if (!field) return;
    const last = getRecentInput(tool);
    if (!last) return;
    const currentVal = form.elements[field]?.value || "";
    if (currentVal === last) return;
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "example-button recent-input-btn";
    btn.title = `Repeat your last search: ${last}`;
    btn.setAttribute("aria-label", `Repeat last search: ${last}`);
    const truncated = last.length > 20 ? last.slice(0, 20) + "…" : last;
    btn.innerHTML = `<svg class="icon" aria-hidden="true" viewBox="0 0 24 24" fill="none"><path d="M1 4v6h6M23 20v-6h-6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4-4.64 4.36A9 9 0 0 1 3.51 15" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg> Last: ${escapeHtml(truncated)}`;
    btn.addEventListener("click", () => {
      if (form.elements[field]) form.elements[field].value = last;
      form.requestSubmit();
    });
    exampleRow.appendChild(btn);
  }

  function initTool(shell) {
    const tool = shell.dataset.tool;
    const form = shell.querySelector(".tool-form");
    const clear = shell.querySelector(".clear-tool");
    const copyAll = shell.querySelector(".copy-all");
    const examples = shell.querySelectorAll("[data-example]");
    const exampleRow = shell.querySelector(".example-row");
    let liveTimer = 0;

    prefillFromUrl(tool, form);
    addRecentInputButton(tool, form, exampleRow);

    function runCurrent() {
      if (tool === "word-unscramble") runUnscramble(shell, form);
      if (tool === "anagram-solver") runAnagram(shell, form);
      if (tool === "rhyme-finder") runRhyme(shell, form);
      if (tool === "syllable-counter") runSyllable(shell, form);
      if (tool === "prefix-finder") runPrefix(shell, form);
      if (tool === "suffix-finder") runSuffix(shell, form);
    }

    examples.forEach((button) => {
      button.addEventListener("click", () => {
        fillExample(tool, form, button.dataset.example || "");
        form.requestSubmit();
      });
    });

    clear.addEventListener("click", () => {
      form.reset();
      const defaults = {
        "word-unscramble": "Enter scrambled letters like \"tca\" or \"listen\" to find words you can build from those exact letters.",
        "anagram-solver": "Enter letters or a short phrase, then choose exact mode or partial mode.",
        "rhyme-finder": "Enter a word like \"light\", \"time\", or \"day\" to find rhyme ideas.",
        "syllable-counter": "Paste a word, sentence, or paragraph to see syllable totals and a word-by-word breakdown.",
        "prefix-finder": "Type a prefix like \"pre\", \"un\", or \"re\" to find words that begin with that exact pattern.",
        "suffix-finder": "Type a suffix like \"ing\", \"less\", or \"tion\" to find words ending with that exact pattern.",
      };
      renderMessage(shell, defaults[tool], "empty");
    });

    copyAll.addEventListener("click", async () => {
      const ok = await copyText(copyAll.dataset.copyText || "");
      copyAll.textContent = ok ? "Copied" : "Copy failed";
      window.setTimeout(() => {
        copyAll.innerHTML = `<svg class="icon" aria-hidden="true" viewBox="0 0 24 24" fill="none"><rect x="8" y="8" width="11" height="11" rx="2" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><path d="M5 15V7a2 2 0 0 1 2-2h8" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg> ${tool === "syllable-counter" ? "Copy Analysis" : "Copy Words"}`;
      }, 1300);
    });

    shell.addEventListener("click", async (event) => {
      const target = event.target.closest("[data-copy-one]");
      if (!target) return;
      const word = target.dataset.copyOne || "";
      const ok = await copyText(word);
      target.textContent = ok ? "Copied" : "Copy";
      window.setTimeout(() => {
        target.textContent = "Copy";
      }, 1100);
    });

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      runCurrent();
    });

    form.addEventListener("input", () => {
      window.clearTimeout(liveTimer);
      liveTimer = window.setTimeout(runCurrent, 240);
    });

    if (new URLSearchParams(location.search).get("q")) {
      runCurrent();
    }
  }

  function fillExample(tool, form, value) {
    const field =
      tool === "word-unscramble"
        ? "letters"
        : tool === "anagram-solver"
          ? "phrase"
          : tool === "rhyme-finder"
            ? "word"
            : tool === "syllable-counter"
              ? "text"
              : tool === "prefix-finder"
                ? "prefix"
                : "suffix";
    form.elements[field].value = value;
  }

  function runUnscramble(shell, form) {
    const raw = form.elements.letters.value.trim().toLowerCase();
    if (!raw) {
      renderMessage(shell, "Please enter at least two letters.", "error");
      return;
    }
    if (!/^[a-z?*]+$/.test(raw)) {
      renderMessage(shell, "Only letters and ? or * wildcards are supported here.", "error");
      return;
    }
    if (raw.length > 14) {
      renderMessage(shell, "This input is too long. Try a shorter word or phrase.", "error");
      return;
    }
    const letters = raw.replace(/[?*]/g, "");
    const wildcards = raw.length - letters.length;
    if (letters.length + wildcards < 2) {
      renderMessage(shell, "Please enter at least two letters.", "error");
      return;
    }
    const starts = lettersOnly(form.elements.starts.value);
    const ends = lettersOnly(form.elements.ends.value);
    const contains = lettersOnly(form.elements.contains.value);
    const min = getNumber(form, "min", 2);
    const max = getNumber(form, "max", raw.length);
    const inputFreq = frequency(letters);
    const results = WORD_ENTRIES.filter((entry) => {
      const word = entry.word;
      if (word.length < min || word.length > max) return false;
      if (starts && !word.startsWith(starts)) return false;
      if (ends && !word.endsWith(ends)) return false;
      if (contains && !word.includes(contains)) return false;
      return canBuild(entry, inputFreq, wildcards);
    }).map((entry) => entry.word);
    if (!results.length) {
      renderMessage(
        shell,
        "No matching words found. Try removing a filter, lowering the minimum length, or using a wildcard for an unknown letter.",
        "empty",
      );
      return;
    }
    const filters = [
      starts && `starts with ${starts}`,
      ends && `ends with ${ends}`,
      contains && `contains ${contains}`,
      `length ${min}–${max}`,
      wildcards ? `${wildcards} wildcard${wildcards === 1 ? "" : "s"}` : "",
    ].filter(Boolean);
    const meta = `${results.length} buildable word${results.length === 1 ? "" : "s"}${filters.length ? `, ${filters.join(", ")}` : ""}.`;
    trackToolUsage("word-unscramble");
    saveRecentInput("word-unscramble", raw);
    renderWordGroups(shell, groupByLength(results, true), meta, {
      title: "Word Unscramble",
      input: `Input: ${raw}`,
    });
  }

  function runAnagram(shell, form) {
    const raw = form.elements.phrase.value.trim();
    const clean = lettersOnly(raw);
    const mode = form.elements.mode.value;
    if (!clean) {
      renderMessage(shell, "Please enter at least two letters.", "error");
      return;
    }
    if (clean.length < 2) {
      renderMessage(shell, "Please enter at least two letters.", "error");
      return;
    }
    if (clean.length > 16) {
      renderMessage(shell, "This input is too long. Try a shorter word or phrase.", "error");
      return;
    }
    const inputFreq = frequency(clean);
    const results = WORD_ENTRIES.filter((entry) => {
      if (mode === "exact") {
        return entry.word.length === clean.length && entry.word !== clean && sameFrequency(entry.freq, inputFreq);
      }
      return entry.word.length < clean.length && entry.word.length >= 2 && canBuild(entry, inputFreq, 0);
    }).map((entry) => entry.word);
    if (!results.length) {
      renderMessage(shell, "No anagrams found. Try partial mode, remove punctuation, or use fewer letters.", "empty");
      return;
    }
    const groups =
      mode === "exact"
        ? [{ title: "Exact anagrams using every letter", words: results.sort((a, b) => a.localeCompare(b)) }]
        : groupByLength(results, true);
    const meta = `${results.length} anagram${results.length === 1 ? "" : "s"} found. Mode: ${
      mode === "exact" ? "Use every letter exactly once" : "Find smaller words inside these letters"
    }. Spaces and punctuation were ignored.`;
    trackToolUsage("anagram-solver");
    saveRecentInput("anagram-solver", raw);
    renderWordGroups(shell, groups, meta, {
      title: "Anagram Solver",
      input: `Input: ${raw}  |  Mode: ${mode === "exact" ? "Exact" : "Partial"}`,
    });
  }

  function runRhyme(shell, form) {
    const word = lettersOnly(form.elements.word.value.trim());
    if (!word) {
      renderMessage(shell, "Please enter a word to rhyme.", "error");
      return;
    }
    if (word.length < 2) {
      renderMessage(shell, "Please enter at least two letters.", "error");
      return;
    }
    if (word.length > 24) {
      renderMessage(shell, "This input is too long. Try a shorter word or phrase.", "error");
      return;
    }
    const groups = getRhymeGroups(word);
    const total = groups.flatMap((group) => group.words).length;
    if (!total) {
      renderMessage(shell, "No strong rhymes found. Try a shorter word, check the spelling, or search for a similar ending sound.", "empty");
      return;
    }
    const meta = `${total} rhyme idea${total === 1 ? "" : "s"} found. Curated matches appear first; spelling-based fallback fills the rest.`;
    trackToolUsage("rhyme-finder");
    saveRecentInput("rhyme-finder", word);
    renderWordGroups(shell, groups, meta, {
      title: "Rhyme Finder",
      input: `Word: ${word}`,
    });
  }

  function getRhymeGroups(word) {
    if (knownRhymes[word]) {
      return [
        { title: "Perfect Rhymes", words: knownRhymes[word].perfect.filter(inWordsOrKnown) },
        { title: "Near Rhymes", words: knownRhymes[word].near.filter(inWordsOrKnown) },
        { title: "Similar Endings", words: knownRhymes[word].similar.filter(inWordsOrKnown) },
      ].filter((group) => group.words.length);
    }
    const key = rhymeKey(word);
    const last3 = word.slice(-3);
    const last2 = word.slice(-2);
    const perfect = WORDS.filter((candidate) => candidate !== word && rhymeKey(candidate) === key).slice(0, 40);
    const near = WORDS.filter((candidate) => candidate !== word && !perfect.includes(candidate) && candidate.endsWith(last2)).slice(0, 40);
    const similar = WORDS.filter((candidate) => candidate !== word && !perfect.includes(candidate) && !near.includes(candidate) && candidate.endsWith(last3)).slice(0, 40);
    return [
      { title: "Perfect Rhymes", words: perfect },
      { title: "Near Rhymes", words: near },
      { title: "Similar Endings", words: similar },
    ].filter((group) => group.words.length);
  }

  function inWordsOrKnown(word) {
    return WORDS.includes(word) || /^[a-z]+$/.test(word);
  }

  function rhymeKey(word) {
    const vowels = "aeiouy";
    for (let i = word.length - 1; i >= 0; i -= 1) {
      if (vowels.includes(word[i])) {
        return word.slice(i);
      }
    }
    return word.slice(-2);
  }

  function runSyllable(shell, form) {
    const text = form.elements.text.value.trim();
    if (!text) {
      renderMessage(shell, "Add readable words so Word Helper can estimate syllables.", "empty");
      return;
    }
    if (text.length > 5000) {
      renderMessage(shell, "This input is too long. Try a shorter word or phrase.", "error");
      return;
    }
    const words = text.match(/[A-Za-z]+(?:'[A-Za-z]+)?/g) || [];
    if (!words.length) {
      renderMessage(shell, "Add readable words so Word Helper can estimate syllables.", "empty");
      return;
    }
    const breakdown = words.map((word) => ({
      word,
      count: countSyllables(word),
    }));
    const total = breakdown.reduce((sum, item) => sum + item.count, 0);
    const sentenceMatches = text.match(/[^.!?]*[.!?]+/g) || [];
    const sentenceCount = sentenceMatches.length > 0 ? sentenceMatches.length : 1;
    const average = Math.round((total / words.length) * 10) / 10;
    const messageBox = shell.querySelector(".tool-message");
    const results = shell.querySelector(".results");
    const copyAll = shell.querySelector(".copy-all");
    const hint = shell.querySelector(".bookmark-hint");
    messageBox.hidden = true;
    results.innerHTML = `<div class="summary-grid">
        ${summaryCard("Total Syllables", total)}
        ${summaryCard("Words", words.length)}
        ${summaryCard("Sentences", sentenceCount)}
        ${summaryCard("Avg Syllables / Word", average)}
      </div>
      <section class="result-group">
        <h3>Word-by-word breakdown <small>${breakdown.length} word${breakdown.length === 1 ? "" : "s"}</small></h3>
        <table class="syllable-table">
          <thead><tr><th>Word</th><th>Syllables</th></tr></thead>
          <tbody>${breakdown
            .map((item) => `<tr><td>${escapeHtml(item.word)}</td><td>${item.count}</td></tr>`)
            .join("")}</tbody>
        </table>
      </section>
      <p class="result-meta">Syllable counts can vary by accent, pronunciation, dialect, and poetic usage. This tool gives a practical estimate, not a guaranteed pronunciation authority.</p>`;
    const copyTextValue = `Word Helper — Syllable Counter\nInput: ${text.slice(0, 60)}${text.length > 60 ? "…" : ""}\n\nTotal Syllables: ${total}\nWords: ${words.length}\nSentences: ${sentenceCount}\nAvg Syllables Per Word: ${average}\n\nWord-by-word:\n${breakdown
      .map((item) => `${item.word}: ${item.count}`)
      .join("\n")}`;
    setCopyButton(copyAll, true, copyTextValue);
    if (hint) hint.hidden = false;
    trackToolUsage("syllable-counter");
    saveRecentInput("syllable-counter", text.slice(0, 80));
  }

  function summaryCard(label, value) {
    return `<div class="summary-card"><span>${escapeHtml(String(label))}</span><strong>${escapeHtml(String(value))}</strong></div>`;
  }

  function countSyllables(rawWord) {
    const word = rawWord.toLowerCase().replace(/[^a-z]/g, "");
    if (!word) return 0;
    if (syllableExceptions[word] !== undefined) return syllableExceptions[word];
    if (word.length <= 3) return 1;
    let cleaned = word;
    if (cleaned.endsWith("e") && !/(le|ye)$/.test(cleaned)) cleaned = cleaned.slice(0, -1);
    const groups = cleaned.match(/[aeiouy]+/g);
    let count = groups ? groups.length : 1;
    if (/(?:ia|io|eo|ii)/.test(cleaned)) count += 1;
    if (cleaned.endsWith("le") && cleaned.length > 2 && !"aeiouy".includes(cleaned[cleaned.length - 3])) count += 1;
    return Math.max(1, count);
  }

  function runPrefix(shell, form) {
    const prefix = lettersOnly(form.elements.prefix.value.trim());
    if (!prefix) {
      renderMessage(shell, "Please enter a prefix or starting pattern.", "error");
      return;
    }
    if (prefix.length > 12) {
      renderMessage(shell, "This input is too long. Try a shorter word or phrase.", "error");
      return;
    }
    const min = getNumber(form, "min", Math.max(2, prefix.length));
    const max = getNumber(form, "max", 14);
    const results = WORDS.filter((word) => word.startsWith(prefix) && word.length >= min && word.length <= max);
    if (!results.length) {
      renderMessage(shell, "No words found with that prefix. Try a shorter prefix such as \"pre\" instead of a full word beginning.", "empty");
      return;
    }
    const meta = `${results.length} word${results.length === 1 ? "" : "s"} starting with "${prefix}". Matching is letter-based.`;
    trackToolUsage("prefix-finder");
    saveRecentInput("prefix-finder", prefix);
    renderWordGroups(shell, groupByLength(results, false), meta, {
      title: "Prefix Finder",
      input: `Prefix: ${prefix}`,
    });
  }

  function runSuffix(shell, form) {
    const suffix = lettersOnly(form.elements.suffix.value.trim());
    if (!suffix) {
      renderMessage(shell, "Please enter a suffix or ending pattern.", "error");
      return;
    }
    if (suffix.length > 12) {
      renderMessage(shell, "This input is too long. Try a shorter word or phrase.", "error");
      return;
    }
    const min = getNumber(form, "min", Math.max(2, suffix.length));
    const max = getNumber(form, "max", 14);
    const results = WORDS.filter((word) => word.endsWith(suffix) && word.length >= min && word.length <= max);
    if (!results.length) {
      renderMessage(shell, "No words found with that suffix. Try removing extra letters or searching a shorter ending like \"ing\" instead of \"playing\".", "empty");
      return;
    }
    const meta = `${results.length} word${results.length === 1 ? "" : "s"} ending with "${suffix}". Matching is letter-based.`;
    trackToolUsage("suffix-finder");
    saveRecentInput("suffix-finder", suffix);
    renderWordGroups(shell, groupByLength(results, false), meta, {
      title: "Suffix Finder",
      input: `Suffix: ${suffix}`,
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    initTheme();
    initNav();
    initRecentTools();
    document.querySelectorAll("[data-tool]").forEach(initTool);
  });
})();
