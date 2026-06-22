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
    "word-unscramble": { title: "Word Unscramble", href: "/tools/word-unscramble/", intro: "Find words from scrambled letters.", keywords: ["unscramble", "letters", "scrabble", "word game", "build"] },
    "anagram-solver": { title: "Anagram Solver", href: "/tools/anagram-solver/", intro: "Solve exact and partial anagrams.", keywords: ["anagram", "rearrange", "phrase", "letters"] },
    "rhyme-finder": { title: "Rhyme Finder", href: "/tools/rhyme-finder/", intro: "Find perfect and near rhymes.", keywords: ["rhyme", "rhyming", "poem", "lyrics", "sound"] },
    "syllable-counter": { title: "Syllable Counter", href: "/tools/syllable-counter/", intro: "Count syllables word by word.", keywords: ["syllable", "rhythm", "meter", "poem", "count"] },
    "prefix-finder": { title: "Prefix Finder", href: "/tools/prefix-finder/", intro: "Find words starting with a pattern.", keywords: ["prefix", "starts", "beginning", "start"] },
    "suffix-finder": { title: "Suffix Finder", href: "/tools/suffix-finder/", intro: "Find words ending with a pattern.", keywords: ["suffix", "ends", "ending", "tion", "ing"] },
  };

  function initTheme() {
    const root = document.documentElement;
    // Deterministic default: light unless the user explicitly chose dark.
    // The inline <head> script already set data-theme (no flash); mirror it here.
    if (root.dataset.theme !== "dark" && root.dataset.theme !== "light") {
      let stored = null;
      try { stored = localStorage.getItem("word-helper-theme"); } catch (_) {}
      root.dataset.theme = stored === "dark" ? "dark" : "light";
    }

    const metaTheme = document.querySelector('meta[name="theme-color"][data-dynamic]');
    const toggles = Array.from(document.querySelectorAll(".theme-toggle"));

    function sync(theme) {
      const dark = theme === "dark";
      if (metaTheme) metaTheme.setAttribute("content", dark ? "#0d1320" : "#ffffff");
      toggles.forEach((btn) => {
        btn.setAttribute("aria-pressed", dark ? "true" : "false");
        const label = dark ? "Switch to light theme" : "Switch to dark theme";
        btn.setAttribute("aria-label", label);
        btn.title = label;
        const moon = btn.querySelector("[data-icon-moon]");
        const sun = btn.querySelector("[data-icon-sun]");
        if (moon) moon.hidden = dark;
        if (sun) sun.hidden = !dark;
      });
    }

    sync(root.dataset.theme);

    toggles.forEach((button) => {
      button.addEventListener("click", () => {
        const next = root.dataset.theme === "dark" ? "light" : "dark";
        root.dataset.theme = next;
        try { localStorage.setItem("word-helper-theme", next); } catch (_) {}
        sync(next);
      });
    });
  }

  function initNav() {
    const header = document.querySelector("[data-header]");

    // Sticky-header shadow on scroll
    if (header) {
      const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 4);
      onScroll();
      window.addEventListener("scroll", onScroll, { passive: true });
    }

    // Mobile slide-down panel
    const toggle = document.querySelector(".nav-toggle");
    const panel = document.querySelector("#mobile-nav");
    function closeMobile() {
      if (!toggle || !panel) return;
      panel.hidden = true;
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Open menu");
    }
    if (toggle && panel) {
      toggle.addEventListener("click", () => {
        const open = panel.hidden;
        panel.hidden = !open;
        toggle.setAttribute("aria-expanded", String(open));
        toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      });
      panel.addEventListener("click", (event) => { if (event.target.closest("a")) closeMobile(); });
    }

    // Desktop dropdown menus — hover is handled in CSS; this adds click + keyboard.
    const triggers = Array.from(document.querySelectorAll(".nav-trigger"));
    function closeMenus(except) {
      triggers.forEach((t) => {
        const item = t.closest(".nav-item");
        if (item && item !== except) {
          item.classList.remove("is-open");
          t.setAttribute("aria-expanded", "false");
        }
      });
    }
    triggers.forEach((trigger) => {
      const item = trigger.closest(".nav-item");
      trigger.addEventListener("click", (event) => {
        event.preventDefault();
        const willOpen = !item.classList.contains("is-open");
        closeMenus(item);
        item.classList.toggle("is-open", willOpen);
        trigger.setAttribute("aria-expanded", String(willOpen));
        if (willOpen) {
          const first = item.querySelector('.nav-menu a, .nav-menu [role="menuitem"]');
          if (first) setTimeout(() => first.focus(), 0);
        }
      });
    });
    document.addEventListener("click", (event) => {
      if (!event.target.closest(".nav-item.has-menu")) closeMenus(null);
    });

    // Keyboard: Escape closes menus + mobile panel; "/" focuses the header search.
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") { closeMenus(null); closeMobile(); }
      if (event.key === "/") {
        const active = document.activeElement || {};
        const typing = active.tagName === "INPUT" || active.tagName === "TEXTAREA" || active.isContentEditable;
        if (!typing) {
          const el = document.getElementById("header-q");
          if (el) { event.preventDefault(); el.focus(); }
        }
      }
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

  function getFavorites() {
    try {
      return JSON.parse(localStorage.getItem("wh-favorites") || "[]");
    } catch (_) {
      return [];
    }
  }

  function setFavorites(list) {
    try {
      localStorage.setItem("wh-favorites", JSON.stringify(list));
    } catch (_) {}
  }

  function initFavoriteButton() {
    const btn = document.querySelector(".favorite-tool-btn");
    if (!btn) return;
    const toolId = btn.dataset.toolId;
    if (!toolId) return;

    function refreshBtn() {
      const favs = getFavorites();
      const saved = favs.includes(toolId);
      btn.setAttribute("aria-pressed", String(saved));
      btn.title = saved ? "Remove from saved tools" : "Save this tool";
      btn.querySelector(".fav-label").textContent = saved ? "Saved" : "Save tool";
      btn.querySelector(".fav-icon-add").hidden = saved;
      btn.querySelector(".fav-icon-saved").hidden = !saved;
    }

    refreshBtn();
    btn.addEventListener("click", () => {
      const favs = getFavorites();
      const idx = favs.indexOf(toolId);
      if (idx >= 0) {
        favs.splice(idx, 1);
      } else {
        favs.unshift(toolId);
      }
      setFavorites(favs.slice(0, 6));
      refreshBtn();
    });
  }

  function initRecentTools() {
    const section = document.getElementById("recent-tools-section");
    const list = document.getElementById("recent-tools-list");
    if (!section || !list) return;
    try {
      const favs = getFavorites();
      const recent = JSON.parse(localStorage.getItem("wh-recent-tools") || "[]");

      const favCards = favs
        .slice(0, 3)
        .map((id) => {
          const meta = toolMeta[id];
          if (!meta) return "";
          return `<a class="resource-card" href="${meta.href}"><strong>${meta.title}</strong><span>${meta.intro}</span><small class="recent-tool-badge saved-badge">Saved</small></a>`;
        })
        .filter(Boolean);

      const recentCards = recent
        .filter((id) => !favs.includes(id))
        .slice(0, 3 - favCards.length)
        .map((id) => {
          const meta = toolMeta[id];
          if (!meta) return "";
          return `<a class="resource-card" href="${meta.href}"><strong>${meta.title}</strong><span>${meta.intro}</span><small class="recent-tool-badge">Recently used</small></a>`;
        })
        .filter(Boolean);

      const html = [...favCards, ...recentCards].join("");
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

  function groupBySort(words, sort = "length-desc") {
    if (sort === "length-asc") return groupByLength(words, false);
    if (sort === "alpha") {
      const sorted = [...words].sort((a, b) => a.localeCompare(b));
      const groups = new Map();
      for (const word of sorted) {
        const key = word[0].toUpperCase();
        if (!groups.has(key)) groups.set(key, []);
        groups.get(key).push(word);
      }
      return Array.from(groups.entries()).map(([letter, list]) => ({
        title: `${letter} words`,
        words: list,
      }));
    }
    return groupByLength(words, true);
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
    const quickJump = shell.querySelector(".quick-jump");
    if (!messageBox || !results) return;
    messageBox.textContent = message;
    messageBox.className = `tool-message ${kind}`;
    messageBox.hidden = false;
    results.innerHTML = "";
    if (hint) hint.hidden = true;
    if (quickJump) quickJump.hidden = true;
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
    const quickJump = shell.querySelector(".quick-jump");
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
    if (quickJump && allWords.length > 0) quickJump.hidden = false;
  }

  function wordChip(word) {
    return `<span class="word-chip"><span class="word-chip-main"><strong>${escapeHtml(word)}</strong><small>${word.length} letters</small></span><button type="button" data-copy-one="${escapeHtml(
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
    const sort = form.elements.sort?.value || "length-desc";
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
    renderWordGroups(shell, groupBySort(results, sort), meta, {
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
      const perfect = knownRhymes[word].perfect.filter(inWordsOrKnown);
      const near = knownRhymes[word].near.filter(inWordsOrKnown);
      const similar = knownRhymes[word].similar.filter(inWordsOrKnown);
      const multi = similar.filter((candidate) => candidate.length > word.length + 2);
      const slant = similar.filter((candidate) => !multi.includes(candidate));
      return [
        { title: "Perfect Rhymes", words: perfect },
        { title: "Near Rhymes", words: near },
        { title: "Slant Rhymes and Similar Endings", words: slant },
        { title: "Multi-syllable Rhyme Ideas", words: multi },
      ].filter((group) => group.words.length);
    }
    const key = rhymeKey(word);
    const last3 = word.slice(-3);
    const last2 = word.slice(-2);
    const perfect = WORDS.filter((candidate) => candidate !== word && rhymeKey(candidate) === key).slice(0, 40);
    const near = WORDS.filter((candidate) => candidate !== word && !perfect.includes(candidate) && candidate.endsWith(last2)).slice(0, 40);
    const similar = WORDS.filter((candidate) => candidate !== word && !perfect.includes(candidate) && !near.includes(candidate) && candidate.endsWith(last3)).slice(0, 40);
    const multi = WORDS.filter((candidate) => candidate !== word && !perfect.includes(candidate) && !near.includes(candidate) && !similar.includes(candidate) && candidate.length > word.length + 2 && candidate.endsWith(last3)).slice(0, 30);
    return [
      { title: "Perfect Rhymes", words: perfect },
      { title: "Near Rhymes", words: near },
      { title: "Slant Rhymes and Similar Endings", words: similar },
      { title: "Multi-syllable Rhyme Ideas", words: multi },
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
      division: estimateSyllableDivision(word),
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
          <thead><tr><th>Word</th><th>Division</th><th>Syllables</th></tr></thead>
          <tbody>${breakdown
            .map((item) => `<tr><td>${escapeHtml(item.word)}</td><td>${escapeHtml(item.division)}</td><td>${item.count}</td></tr>`)
            .join("")}</tbody>
        </table>
      </section>
      <p class="result-meta">Syllable counts can vary by accent, pronunciation, dialect, and poetic usage. This tool gives a practical estimate, not a guaranteed pronunciation authority.</p>`;
    const copyTextValue = `Word Helper — Syllable Counter\nInput: ${text.slice(0, 60)}${text.length > 60 ? "…" : ""}\n\nTotal Syllables: ${total}\nWords: ${words.length}\nSentences: ${sentenceCount}\nAvg Syllables Per Word: ${average}\n\nWord-by-word:\n${breakdown
      .map((item) => `${item.word}: ${item.division} (${item.count})`)
      .join("\n")}`;
    setCopyButton(copyAll, true, copyTextValue);
    if (hint) hint.hidden = false;
    const quickJumpSyl = shell.querySelector(".quick-jump");
    if (quickJumpSyl) quickJumpSyl.hidden = false;
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

  function estimateSyllableDivision(rawWord) {
    const original = String(rawWord || "");
    const word = original.toLowerCase().replace(/[^a-z]/g, "");
    if (!word) return original;
    const count = countSyllables(word);
    if (count <= 1 || word.length <= count + 1) return original;
    const vowels = "aeiouy";
    const parts = [];
    let current = "";
    let vowelSeen = false;
    for (let index = 0; index < word.length; index += 1) {
      const char = word[index];
      const next = word[index + 1] || "";
      const nextNext = word[index + 2] || "";
      current += char;
      if (vowels.includes(char)) vowelSeen = true;
      if (
        vowelSeen &&
        next &&
        !vowels.includes(next) &&
        vowels.includes(nextNext) &&
        parts.length < count - 1 &&
        current.length > 1
      ) {
        parts.push(current);
        current = "";
        vowelSeen = false;
      }
    }
    if (current) parts.push(current);
    return parts.length > 1 ? parts.join("-") : original;
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
    const sort = form.elements.sort?.value || "alpha";
    const results = WORDS.filter((word) => word.startsWith(prefix) && word.length >= min && word.length <= max);
    if (!results.length) {
      renderMessage(shell, "No words found with that prefix. Try a shorter prefix such as \"pre\" instead of a full word beginning.", "empty");
      return;
    }
    const meta = `${results.length} word${results.length === 1 ? "" : "s"} starting with "${prefix}". Matching is letter-based.`;
    trackToolUsage("prefix-finder");
    saveRecentInput("prefix-finder", prefix);
    renderWordGroups(shell, groupBySort(results, sort), meta, {
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
    const sort = form.elements.sort?.value || "alpha";
    const results = WORDS.filter((word) => word.endsWith(suffix) && word.length >= min && word.length <= max);
    if (!results.length) {
      renderMessage(shell, "No words found with that suffix. Try removing extra letters or searching a shorter ending like \"ing\" instead of \"playing\".", "empty");
      return;
    }
    const meta = `${results.length} word${results.length === 1 ? "" : "s"} ending with "${suffix}". Matching is letter-based.`;
    trackToolUsage("suffix-finder");
    saveRecentInput("suffix-finder", suffix);
    renderWordGroups(shell, groupBySort(results, sort), meta, {
      title: "Suffix Finder",
      input: `Suffix: ${suffix}`,
    });
  }

  function initHeroModes() {
    const box = document.querySelector(".hero-command-box[data-multimode='true']");
    if (!box) return;
    const modes = Array.from(box.querySelectorAll(".hero-mode"));
    const input = box.querySelector("input[name='q']");
    const submitLabel = box.querySelector("[data-submit-label]");
    const hint = box.querySelector("[data-mode-hint]");
    if (!modes.length || !input) return;

    function activate(mode, focusInput) {
      modes.forEach((m) => {
        const on = m === mode;
        m.classList.toggle("is-active", on);
        m.setAttribute("aria-selected", on ? "true" : "false");
        m.tabIndex = on ? 0 : -1;
      });
      const ph = mode.getAttribute("data-placeholder");
      if (ph) input.setAttribute("placeholder", ph);
      if (submitLabel) submitLabel.textContent = mode.getAttribute("data-submit") || "Go";
      if (hint) hint.innerHTML = mode.getAttribute("data-hint") || "";
      if (focusInput) input.focus();
    }

    modes.forEach((mode, i) => {
      mode.addEventListener("click", () => activate(mode, true));
      mode.addEventListener("keydown", (event) => {
        let next = -1;
        if (event.key === "ArrowRight" || event.key === "ArrowDown") next = (i + 1) % modes.length;
        else if (event.key === "ArrowLeft" || event.key === "ArrowUp") next = (i - 1 + modes.length) % modes.length;
        else if (event.key === "Home") next = 0;
        else if (event.key === "End") next = modes.length - 1;
        if (next >= 0) {
          event.preventDefault();
          modes[next].focus();
          activate(modes[next], false);
        }
      });
    });

    // Keyboard-first: focus the input on load for pointer/desktop users only
    // (avoid forcing the on-screen keyboard up on touch devices).
    try {
      if (!window.matchMedia || !window.matchMedia("(pointer: coarse)").matches) {
        input.focus({ preventScroll: true });
      }
    } catch (_) {}
  }

  // Lazy-load the heavy dictionary + search index only when a search box is
  // actually used (they are NOT injected on most pages — see build layout()).
  let searchDataPromise = null;
  function ensureSearchData() {
    if (window.WORD_HELPER_SEARCH_INDEX && window.WORD_HELPER_WORDS) return Promise.resolve();
    if (!searchDataPromise) {
      searchDataPromise = Promise.all(
        ["/assets/word-data.js", "/assets/search-data.js"].map((src) => new Promise((resolve) => {
          if (document.querySelector('script[data-lazy="' + src + '"]')) return resolve();
          const s = document.createElement("script");
          s.src = src; s.async = true; s.dataset.lazy = src;
          s.onload = resolve; s.onerror = resolve;
          document.head.appendChild(s);
        })),
      );
    }
    return searchDataPromise;
  }

  function initGlobalSearch() {
    const forms = document.querySelectorAll(".global-search");
    if (!forms.length) return;
    let searchIndex = Array.isArray(window.WORD_HELPER_SEARCH_INDEX) ? window.WORD_HELPER_SEARCH_INDEX : [];
    let wordPages = Array.isArray(window.WORD_HELPER_WORDS) ? window.WORD_HELPER_WORDS : [];
    let wordSet = new Set(wordPages.map((w) => String(w).toLowerCase()));
    function refreshData() {
      if (Array.isArray(window.WORD_HELPER_SEARCH_INDEX)) searchIndex = window.WORD_HELPER_SEARCH_INDEX;
      if (Array.isArray(window.WORD_HELPER_WORDS)) {
        wordPages = window.WORD_HELPER_WORDS;
        wordSet = new Set(wordPages.map((w) => String(w).toLowerCase()));
      }
    }
    const tools = Object.values(toolMeta);
    const toolKeywords = {
      unscramble: "/tools/word-unscramble/",
      "word game": "/word-games/",
      game: "/word-games/",
      anagram: "/tools/anagram-solver/",
      rhyme: "/tools/rhyme-finder/",
      rhymes: "/tools/rhyme-finder/",
      syllable: "/tools/syllable-counter/",
      syllables: "/tools/syllable-counter/",
      prefix: "/tools/prefix-finder/",
      "starts with": "/tools/prefix-finder/",
      suffix: "/tools/suffix-finder/",
      "ends with": "/tools/suffix-finder/",
    };

    function routeForQuery(raw) {
      const q = String(raw || "").trim().toLowerCase();
      if (!q) return "";
      if (wordSet.has(q)) return "/word/" + encodeURIComponent(q) + "/";
      for (const [key, href] of Object.entries(toolKeywords)) {
        if (q.includes(key)) {
          const cleaned = q
            .replace(key, "")
            .replace(/\b(with|for|words|word|letters|letter|in|ending|starting)\b/g, "")
            .trim();
          return cleaned && href.startsWith("/tools/") ? href + "?q=" + encodeURIComponent(cleaned) : href;
        }
      }
      return "/search/?q=" + encodeURIComponent(raw.trim());
    }

    function scoreItem(item, q, parts) {
      const title = String(item.title || "").toLowerCase();
      const text = item.searchText || `${item.title || ""} ${item.description || ""}`.toLowerCase();
      let score = 0;
      if (title === q) score += 80;
      if (title.startsWith(q)) score += 45;
      if (title.includes(q)) score += 25;
      if (text.includes(q)) score += 15;
      for (const part of parts) {
        if (title.includes(part)) score += 8;
        if (text.includes(part)) score += 3;
      }
      return score;
    }

    function searchItems(raw) {
      const q = String(raw || "").trim().toLowerCase();
      if (!q) return [];
      const parts = q.split(/\s+/).filter((part) => part.length > 1);
      const contentMatches = searchIndex
        .map((item) => ({ ...item, score: scoreItem(item, q, parts) }))
        .filter((item) => item.score > 0)
        .sort((a, b) => b.score - a.score || a.title.localeCompare(b.title))
        .slice(0, 10)
        .map((item) => ({ kind: item.type || "Page", title: item.title, intro: item.description, href: item.href }));
      const wordMatches = wordPages
        .filter((word) => {
          const lower = String(word).toLowerCase();
          return lower.startsWith(q) || (q.length > 2 && lower.includes(q));
        })
        .slice(0, 8)
        .map((word) => ({
          kind: "Word",
          title: word,
          intro: "Open definition, examples, synonyms, syllables, and word tools.",
          href: "/word/" + encodeURIComponent(String(word).toLowerCase()) + "/",
        }));
      return [...contentMatches, ...wordMatches].slice(0, 12);
    }

    function hideSuggestions(form) {
      const suggestions = form.querySelector(".search-suggestions");
      if (!suggestions) return;
      suggestions.hidden = true;
      suggestions.innerHTML = "";
    }

    function suggestionRow(item) {
      return `<a href="${escapeHtml(item.href)}" class="suggestion-row">
        <span>${escapeHtml(item.kind)}</span>
        <strong>${escapeHtml(item.title)}</strong>
        <small>${escapeHtml(item.intro)}</small>
      </a>`;
    }

    function renderSuggestions(form) {
      const input = form.querySelector("input[name='q']");
      const suggestions = form.querySelector(".search-suggestions");
      if (!suggestions || !input) return;
      const q = input.value.trim();
      if (!q) {
        hideSuggestions(form);
        return;
      }
      const fallback = {
        kind: "Search",
        title: `Search for "${q}"`,
        intro: "Open a full search results page.",
        href: "/search/?q=" + encodeURIComponent(q),
      };
      const toolMatches = tools
        .filter((tool) => {
          const haystack = [tool.title, tool.intro, ...(tool.keywords || [])].join(" ").toLowerCase();
          return haystack.includes(q.toLowerCase());
        })
        .slice(0, 3)
        .map((tool) => ({ kind: "Tool", title: tool.title, intro: tool.intro, href: tool.href }));
      const html = [...toolMatches, ...searchItems(q), fallback].slice(0, 7).map(suggestionRow).join("");
      suggestions.innerHTML = html;
      suggestions.hidden = !html;
    }

    function renderSearchResults() {
      const resultsEl = document.getElementById("search-results");
      const summaryEl = document.getElementById("search-results-summary");
      const pageInput = document.querySelector(".search-page-form input[name='q']");
      if (!resultsEl || !summaryEl || !pageInput) return;
      const q = new URLSearchParams(location.search).get("q") || pageInput.value || "";
      pageInput.value = q;
      const matches = searchItems(q);
      if (!q.trim()) return;
      if (!matches.length) {
        summaryEl.textContent = `No direct matches for "${q}". Try a shorter word, a tool name, or a pattern like "ending ing".`;
        resultsEl.innerHTML = `<div class="empty-state"><h3>No results found</h3><p>Try removing extra words, searching a shorter prefix or suffix, or opening the Word Unscramble tool for letter inputs.</p><a class="button secondary" href="/tools/word-unscramble/?q=${encodeURIComponent(q)}">Try Word Unscramble</a></div>`;
        return;
      }
      summaryEl.textContent = `${matches.length} result${matches.length === 1 ? "" : "s"} for "${q}".`;
      resultsEl.innerHTML = matches
        .map((item) => `<a class="search-result-card" href="${escapeHtml(item.href)}">
          <span>${escapeHtml(item.kind)}</span>
          <strong>${escapeHtml(item.title)}</strong>
          <small>${escapeHtml(item.intro)}</small>
        </a>`)
        .join("");
    }

    forms.forEach((form) => {
      const input = form.querySelector("input[name='q']");
      if (!input) return;
      input.addEventListener("focus", () => {
        ensureSearchData().then(() => { refreshData(); renderSuggestions(form); });
      });
      input.addEventListener("input", () => {
        ensureSearchData().then(() => { refreshData(); renderSuggestions(form); });
      });
      form.addEventListener("submit", (event) => {
        event.preventDefault();
        const raw = input.value || "";
        if (!raw.trim()) return;
        if (form.classList.contains("search-page-form")) {
          history.replaceState(null, "", "/search/?q=" + encodeURIComponent(raw.trim()));
          hideSuggestions(form);
          renderSearchResults();
          return;
        }
        // Multi-mode hero command box: route by the selected mode.
        const activeMode = form.querySelector(".hero-mode.is-active");
        if (activeMode) {
          const route = activeMode.getAttribute("data-route");
          const param = activeMode.getAttribute("data-param");
          const value = raw.trim();
          if (param === "path") {
            window.location.href = route + encodeURIComponent(value.toLowerCase().replace(/\s+/g, "-")) + "/";
          } else {
            window.location.href = route + "?" + param + "=" + encodeURIComponent(value);
          }
          return;
        }
        window.location.href = routeForQuery(raw);
      });
    });

    document.addEventListener("click", (event) => {
      forms.forEach((form) => {
        if (!form.contains(event.target)) hideSuggestions(form);
      });
    });
    document.addEventListener("keydown", (event) => {
      const tag = document.activeElement?.tagName;
      const isTyping = tag === "INPUT" || tag === "TEXTAREA" || document.activeElement?.isContentEditable;
      if (event.key === "/" && !isTyping) {
        event.preventDefault();
        const firstInput = forms[0]?.querySelector("input[name='q']");
        if (firstInput) firstInput.focus();
      }
      if (event.key === "Escape") forms.forEach(hideSuggestions);
    });

    renderSearchResults();
  }

  // ── Vocabulary Quiz ──────────────────────────────────────────────
  function initVocabQuiz() {
    const shell = document.getElementById("quiz-shell");
    if (!shell) return;

    let words;
    try {
      words = JSON.parse(shell.dataset.words || "[]");
    } catch (_) {
      return;
    }
    if (!words.length) return;

    const shuffled = [...words].sort(() => Math.random() - 0.5);
    let current = 0;
    let score = 0;
    let answered = false;
    const history = [];

    const elQNum = document.getElementById("quiz-q-num");
    const elTotal = document.getElementById("quiz-total");
    const elScore = document.getElementById("quiz-score");
    const elDef = document.getElementById("quiz-def");
    const elPos = document.getElementById("quiz-pos");
    const elChoices = document.getElementById("quiz-choices");
    const elFeedback = document.getElementById("quiz-feedback");
    const elNav = document.getElementById("quiz-nav");
    const elNextBtn = document.getElementById("quiz-next");
    const elCard = document.getElementById("quiz-card");
    const elComplete = document.getElementById("quiz-complete");
    const elFinalScore = document.getElementById("quiz-final-score");
    const elReview = document.getElementById("quiz-review");

    function getDistractors(correct, all) {
      const pool = all.filter((w) => w.word !== correct.word);
      const picked = [];
      while (picked.length < 3 && pool.length) {
        const idx = Math.floor(Math.random() * pool.length);
        picked.push(pool.splice(idx, 1)[0]);
      }
      return picked;
    }

    function showQuestion() {
      answered = false;
      const q = shuffled[current];
      elQNum.textContent = "Question " + (current + 1);
      elTotal.textContent = shuffled.length;
      elDef.textContent = q.def || "\u2014";
      elPos.textContent = q.pos ? "(" + q.pos + ")" : "";

      const choices = [q, ...getDistractors(q, shuffled)].sort(() => Math.random() - 0.5);
      elChoices.innerHTML = "";
      choices.forEach(function(choice) {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.textContent = choice.word;
        btn.addEventListener("click", function() { handleAnswer(btn, choice.word, q.word); });
        elChoices.appendChild(btn);
      });

      elFeedback.hidden = true;
      elFeedback.className = "quiz-feedback";
      elNav.hidden = true;
    }

    function handleAnswer(btn, chosen, correct) {
      if (answered) return;
      answered = true;
      const isCorrect = chosen === correct;
      if (isCorrect) score++;
      elScore.textContent = score;

      elChoices.querySelectorAll("button").forEach(function(b) {
        b.disabled = true;
        if (b.textContent === correct) b.classList.add("correct");
        else if (b === btn && !isCorrect) b.classList.add("incorrect");
      });

      elFeedback.hidden = false;
      elFeedback.className = "quiz-feedback " + (isCorrect ? "correct" : "incorrect");
      elFeedback.textContent = isCorrect
        ? "Correct!"
        : "The answer was \u201c" + correct + "\u201d.";

      history.push({ word: correct, isCorrect: isCorrect });
      elNav.hidden = false;
    }

    function showComplete() {
      elCard.hidden = true;
      elNav.hidden = true;
      elFeedback.hidden = true;
      elComplete.hidden = false;
      elFinalScore.textContent = score + " / " + shuffled.length;

      elReview.innerHTML = history
        .map(function(h) {
          return '<div class="quiz-review-item"><span class="quiz-review-mark">' +
            (h.isCorrect ? "\u2713" : "\u2717") +
            '</span><span>' + h.word + '</span></div>';
        })
        .join("");
    }

    elNextBtn.addEventListener("click", function() {
      current++;
      if (current >= shuffled.length) {
        showComplete();
      } else {
        showQuestion();
      }
    });

    document.getElementById("quiz-restart").addEventListener("click", function() {
      current = 0;
      score = 0;
      history.length = 0;
      answered = false;
      elScore.textContent = 0;
      elComplete.hidden = true;
      elCard.hidden = false;
      elFeedback.hidden = true;
      elNav.hidden = true;
      const reshuffled = [...words].sort(() => Math.random() - 0.5);
      shuffled.length = 0;
      reshuffled.forEach(function(w) { shuffled.push(w); });
      showQuestion();
    });

    showQuestion();
  }

  // ── Word Explorer Letter Filter ──────────────────────────────────
  function initWordFilter() {
    const input = document.getElementById("word-filter");
    const grid = document.getElementById("word-explorer-grid");
    const countEl = document.getElementById("word-filter-count");
    const emptyEl = document.getElementById("word-filter-empty");
    if (!input || !grid) return;

    const cards = Array.from(grid.querySelectorAll(".word-card"));
    const total = cards.length;

    input.addEventListener("input", function() {
      const q = input.value.trim().toLowerCase();
      let visible = 0;
      const visibleCards = [];
      cards.forEach(function(card) {
        const word = (card.dataset.word || "").toLowerCase();
        const show = !q || word.includes(q);
        card.hidden = !show;
        if (show) {
          visible++;
          visibleCards.push(card);
        }
      });
      countEl.textContent = visible.toLocaleString() + " word" + (visible !== 1 ? "s" : "");
      if (emptyEl) emptyEl.hidden = visible > 0;
      grid.dispatchEvent(new CustomEvent("wordfilter:updated", {
        detail: { cards: visibleCards.slice(0, 80) },
      }));
    });
  }

  function initWordListFilter() {
    const input = document.querySelector(".word-list-filter");
    if (!input) return;
    const rows = Array.from(document.querySelectorAll("[data-word-list-row]"));
    const counter = document.querySelector(".word-list-count");
    input.addEventListener("input", () => {
      const q = input.value.trim().toLowerCase();
      let shown = 0;
      rows.forEach((row) => {
        const text = row.dataset.filterText || row.textContent.toLowerCase();
        const visible = !q || text.includes(q);
        row.hidden = !visible;
        if (visible) shown += 1;
      });
      if (counter) counter.textContent = `${shown} word${shown === 1 ? "" : "s"} shown`;
    });
  }

  // ── Dictionary lookup for generated word pages ─────────────────────
  function uniqueStrings(items) {
    return Array.from(
      new Set(
        items
          .filter((item) => typeof item === "string")
          .map((item) => item.trim())
          .filter(Boolean),
      ),
    );
  }

  function lookupCandidates(word) {
    const candidates = [word];
    const add = (candidate) => {
      if (candidate && candidate.length > 1 && /^[a-z]+$/.test(candidate)) candidates.push(candidate);
    };
    if (word.endsWith("ies")) add(word.slice(0, -3) + "y");
    if (word.endsWith("es")) {
      add(word.slice(0, -2));
      add(word.slice(0, -1));
    }
    if (word.endsWith("s")) add(word.slice(0, -1));
    if (word.endsWith("ing")) {
      const base = word.slice(0, -3);
      add(base);
      add(base + "e");
      if (/(.)\1$/.test(base)) add(base.slice(0, -1));
    }
    if (word.endsWith("ed")) {
      const base = word.slice(0, -2);
      add(base);
      add(base + "e");
      if (/(.)\1$/.test(base)) add(base.slice(0, -1));
    }
    return uniqueStrings(candidates);
  }

  function posClass(pos) {
    const clean = String(pos || "word").toLowerCase().replace(/[^a-z]/g, "").slice(0, 4) || "word";
    return "pos-badge pos-" + clean;
  }

  function normalizeDictionaryEntry(requestedWord, lookupWord, data) {
    if (!Array.isArray(data)) return null;
    const entry = data.find((item) => Array.isArray(item.meanings) && item.meanings.length);
    if (!entry) return null;

    const meanings = entry.meanings || [];
    const primaryMeaning = meanings.find((meaning) => meaning.definitions?.[0]?.definition) || meanings[0];
    const primaryDefinition = primaryMeaning?.definitions?.find((item) => item.definition);
    if (!primaryDefinition?.definition) return null;

    const definitions = meanings.flatMap((meaning) =>
      (meaning.definitions || []).map((definition) => ({ ...definition, partOfSpeech: meaning.partOfSpeech })),
    );
    const examples = uniqueStrings(definitions.map((definition) => definition.example)).slice(0, 3);
    const synonyms = uniqueStrings(
      meanings.flatMap((meaning) => [
        ...(meaning.synonyms || []),
        ...(meaning.definitions || []).flatMap((definition) => definition.synonyms || []),
      ]),
    ).slice(0, 12);
    const antonyms = uniqueStrings(
      meanings.flatMap((meaning) => [
        ...(meaning.antonyms || []),
        ...(meaning.definitions || []).flatMap((definition) => definition.antonyms || []),
      ]),
    ).slice(0, 12);

    const pronunciation =
      entry.phonetic ||
      (entry.phonetics || []).find((phonetic) => phonetic.text)?.text ||
      "";
    const definition = primaryDefinition.definition;
    return {
      requestedWord,
      lookupWord,
      partOfSpeech: primaryMeaning.partOfSpeech || primaryDefinition.partOfSpeech || "word",
      pronunciation,
      definition,
      shortDef: definition.length > 150 ? definition.slice(0, 147) + "..." : definition,
      examples,
      synonyms,
      antonyms,
    };
  }

  async function fetchJsonWithTimeout(url, timeoutMs) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const response = await fetch(url, { signal: controller.signal });
      if (!response.ok) return null;
      return await response.json();
    } catch (_) {
      return null;
    } finally {
      clearTimeout(timeout);
    }
  }

  async function fetchDictionaryEntry(word, options = {}) {
    const cacheKey = "word-helper-dictionary:" + word;
    try {
      const cached = localStorage.getItem(cacheKey);
      if (cached) return JSON.parse(cached);
    } catch (_) {}

    const baseCandidates = options.directOnly ? [word] : lookupCandidates(word);
    const maxCandidates = Number(options.maxCandidates) || baseCandidates.length;
    const candidates = baseCandidates.slice(0, Math.max(1, maxCandidates));
    const timeoutMs = options.timeoutMs || 8000;
    for (const candidate of candidates) {
      const data = await fetchJsonWithTimeout(
        "https://api.dictionaryapi.dev/api/v2/entries/en/" + encodeURIComponent(candidate),
        timeoutMs,
      );
      const normalized = normalizeDictionaryEntry(word, candidate, data);
      if (normalized) {
        try { localStorage.setItem(cacheKey, JSON.stringify(normalized)); } catch (_) {}
        return normalized;
      }
    }
    return null;
  }

  function renderDictionaryPills(container, words, emptyText) {
    if (!container) return;
    container.innerHTML = words.length
      ? words.map((word) => `<span class="word-pill">${escapeHtml(word)}</span>`).join("")
      : `<span class="dictionary-empty">${escapeHtml(emptyText)}</span>`;
  }

  function renderDictionaryExamples(container, examples) {
    if (!container) return;
    container.innerHTML = examples.length
      ? examples.map((example, index) => `<li><span class="ex-num">${index + 1}</span><p>${escapeHtml(example)}</p></li>`).join("")
      : '<li class="dictionary-empty">No example sentences are listed for this word yet.</li>';
  }

  function resolveWordFromLocation() {
    try {
      var params = new URLSearchParams(location.search);
      var q = (params.get("w") || params.get("q") || "").trim();
      if (q) return q.toLowerCase();
      var m = location.pathname.match(/\/word\/([^/]+)\/?$/);
      if (m) return decodeURIComponent(m[1]).toLowerCase();
    } catch (_) {}
    return "";
  }

  function initDictionaryLookup() {
    const shell = document.querySelector("[data-dictionary-lookup='true']");
    if (!shell) return;

    let word = shell.dataset.dictionaryWord;

    // Catch-all template: derive the word from the URL and fill page chrome.
    if (!word && shell.dataset.dictionaryFromPath) {
      word = resolveWordFromLocation();
      if (word) {
        const label = word.charAt(0).toUpperCase() + word.slice(1);
        document.title = label + " — Definition, Syllables & Word Tools | Word Helper";
        const titleEl = document.querySelector("[data-word-title]");
        if (titleEl) titleEl.textContent = word;
        const crumb = document.querySelector("[data-word-crumb]");
        if (crumb) crumb.textContent = label;
        const sylCount = countSyllables(word);
        const breakEl = document.querySelector("[data-word-syllable-break]");
        if (breakEl) breakEl.textContent = estimateSyllableDivision(word);
        const countEl = document.querySelector("[data-word-syllable-count]");
        if (countEl) countEl.textContent = sylCount + (sylCount === 1 ? " syllable" : " syllables");
        document.querySelectorAll("[data-tool-link]").forEach((a) => {
          const base = a.getAttribute("data-tool-link");
          a.setAttribute("href", base + "?q=" + encodeURIComponent(word));
        });
      }
    }

    if (!word) {
      const s = shell.querySelector("[data-word-lookup-status]");
      if (s) s.textContent = "Type a word in the search box above to look it up.";
      return;
    }

    const status = shell.querySelector("[data-word-lookup-status]");
    const pos = document.querySelector("[data-word-pos]");
    const factPos = document.querySelectorAll("[data-word-fact-pos]");
    const pronunciation = document.querySelector("[data-word-pronunciation]");
    const shortDef = document.querySelector("[data-word-short-def]");
    const definition = shell.querySelector("[data-word-definition]");
    const examples = shell.querySelector("[data-word-examples]");
    const synonyms = shell.querySelector("[data-word-synonyms]");
    const antonyms = shell.querySelector("[data-word-antonyms]");

    fetchDictionaryEntry(word).then((entry) => {
      if (!entry) {
        if (status) status.textContent = "No public dictionary entry was found for this word yet.";
        renderDictionaryExamples(examples, []);
        renderDictionaryPills(synonyms, [], "No synonyms are listed yet.");
        renderDictionaryPills(antonyms, [], "No antonyms are listed yet.");
        return;
      }

      if (pos) {
        pos.textContent = entry.partOfSpeech;
        pos.className = posClass(entry.partOfSpeech);
      }
      factPos.forEach((item) => {
        item.textContent = entry.partOfSpeech;
      });
      if (pronunciation && entry.pronunciation) {
        pronunciation.textContent = entry.pronunciation;
        pronunciation.hidden = false;
      }
      if (shortDef) shortDef.textContent = entry.shortDef;
      if (definition) definition.innerHTML = `<p>${escapeHtml(entry.definition)}</p>`;
      renderDictionaryExamples(examples, entry.examples);
      renderDictionaryPills(synonyms, entry.synonyms, "No synonyms are listed yet.");
      renderDictionaryPills(antonyms, entry.antonyms, "No antonyms are listed yet.");

      if (status) {
        status.textContent = entry.lookupWord === word
          ? "Dictionary details loaded."
          : `Dictionary details loaded from the base word "${entry.lookupWord}".`;
      }
    });
  }

  function updateCardPos(card, partOfSpeech) {
    const badge = card.querySelector("[data-card-pos]");
    if (!badge) return;
    const value = partOfSpeech || "unknown";
    badge.textContent = value;
    badge.className = posClass(value);
    card.dataset.cardPosReady = "true";
  }

  function initCardPartOfSpeechLookup() {
    const cards = Array.from(document.querySelectorAll("[data-card-pos-lookup='true']"));
    if (!cards.length) return;

    const queue = [];
    let active = 0;
    const maxActive = 8;

    function enqueue(card, priority = false) {
      if (card.dataset.cardPosReady === "true") return;
      if (card.dataset.cardPosQueued === "true") {
        if (priority) {
          const index = queue.indexOf(card);
          if (index > 0) {
            queue.splice(index, 1);
            queue.unshift(card);
          }
        }
        return;
      }
      card.dataset.cardPosQueued = "true";
      if (priority) queue.unshift(card);
      else queue.push(card);
      pump();
    }

    function pump() {
      while (active < maxActive && queue.length) {
        const card = queue.shift();
        const word = card.dataset.cardWord;
        if (!word) {
          updateCardPos(card, "unknown");
          continue;
        }

        active++;
        fetchDictionaryEntry(word, { timeoutMs: 2500, maxCandidates: 6 })
          .then((entry) => {
            updateCardPos(card, entry?.partOfSpeech || "unknown");
          })
          .catch(() => {
            updateCardPos(card, "unknown");
          })
          .finally(() => {
            active--;
            pump();
          });
      }
    }

    if (!("IntersectionObserver" in window)) {
      cards.slice(0, 80).forEach(enqueue);
      return;
    }

    const grid = document.getElementById("word-explorer-grid");
    if (grid) {
      grid.addEventListener("wordfilter:updated", (event) => {
        const visibleCards = Array.isArray(event.detail?.cards) ? event.detail.cards : [];
        visibleCards.forEach((card) => {
          if (card.matches("[data-card-pos-lookup='true']")) enqueue(card, true);
        });
      });
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          observer.unobserve(entry.target);
          enqueue(entry.target);
        });
      },
      { rootMargin: "500px 0px" },
    );

    cards.forEach((card) => observer.observe(card));
  }

  function initBackToTop() {
    const button = document.querySelector(".back-to-top");
    if (!button) return;

    const update = () => {
      button.classList.toggle("visible", window.scrollY > 700);
    };

    button.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
    window.addEventListener("scroll", update, { passive: true });
    update();
  }

  // ── Word Family Quiz ─────────────────────────────────────────────
  function initWordFamilyQuiz() {
    const shell = document.getElementById("wf-shell");
    if (!shell) return;

    let allQuestions;
    try { allQuestions = JSON.parse(shell.dataset.questions || "[]"); } catch (_) { return; }
    if (!allQuestions.length) return;

    const SESSION_SIZE = 20;
    const allAnswers = allQuestions.map(function(q) { return q.answer; });

    let session = [];
    let current = 0;
    let score = 0;
    let answered = false;
    const history = [];

    const elQNum = document.getElementById("wf-q-num");
    const elTotal = document.getElementById("wf-total");
    const elScore = document.getElementById("wf-score");
    const elPrompt = document.getElementById("wf-prompt");
    const elChoices = document.getElementById("wf-choices");
    const elFeedback = document.getElementById("wf-feedback");
    const elNav = document.getElementById("wf-nav");
    const elNextBtn = document.getElementById("wf-next");
    const elCard = document.getElementById("wf-card");
    const elComplete = document.getElementById("wf-complete");
    const elFinalScore = document.getElementById("wf-final-score");
    const elReview = document.getElementById("wf-review");

    function buildSession() {
      return [...allQuestions].sort(function() { return Math.random() - 0.5; }).slice(0, Math.min(SESSION_SIZE, allQuestions.length));
    }

    function getDistractors(correct) {
      return [...allAnswers].filter(function(a) { return a !== correct; })
        .sort(function() { return Math.random() - 0.5; }).slice(0, 3);
    }

    function showQuestion() {
      answered = false;
      const q = session[current];
      elQNum.textContent = "Question " + (current + 1);
      elTotal.textContent = session.length;
      elPrompt.textContent = "What is the " + q.targetPos + " form of \u201c" + q.base + "\u201d?";

      const choices = [q.answer, ...getDistractors(q.answer)].sort(function() { return Math.random() - 0.5; });
      elChoices.innerHTML = "";
      choices.forEach(function(choice) {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.textContent = choice;
        btn.addEventListener("click", function() { handleAnswer(btn, choice, q.answer); });
        elChoices.appendChild(btn);
      });

      elFeedback.hidden = true;
      elFeedback.className = "quiz-feedback";
      elNav.hidden = true;
    }

    function handleAnswer(btn, chosen, correct) {
      if (answered) return;
      answered = true;
      const isCorrect = chosen === correct;
      if (isCorrect) score++;
      elScore.textContent = score;

      elChoices.querySelectorAll("button").forEach(function(b) {
        b.disabled = true;
        if (b.textContent === correct) b.classList.add("correct");
        else if (b === btn && !isCorrect) b.classList.add("incorrect");
      });

      elFeedback.hidden = false;
      elFeedback.className = "quiz-feedback " + (isCorrect ? "correct" : "incorrect");
      elFeedback.textContent = isCorrect ? "Correct!" : "The answer was \u201c" + correct + "\u201d.";
      history.push({ label: session[current].base + " \u2192 " + correct, isCorrect: isCorrect });
      elNav.hidden = false;
    }

    function showComplete() {
      elCard.hidden = true;
      elNav.hidden = true;
      elFeedback.hidden = true;
      elComplete.hidden = false;
      elFinalScore.textContent = score + " / " + session.length;
      elReview.innerHTML = history.map(function(h) {
        return '<div class="quiz-review-item"><span class="quiz-review-mark">' +
          (h.isCorrect ? "\u2713" : "\u2717") + "</span><span>" + h.label + "</span></div>";
      }).join("");
    }

    elNextBtn.addEventListener("click", function() {
      current++;
      if (current >= session.length) showComplete(); else showQuestion();
    });

    document.getElementById("wf-restart").addEventListener("click", function() {
      current = 0; score = 0; history.length = 0; answered = false;
      elScore.textContent = 0;
      elComplete.hidden = true; elCard.hidden = false;
      elFeedback.hidden = true; elNav.hidden = true;
      session = buildSession();
      showQuestion();
    });

    session = buildSession();
    showQuestion();
  }

  // ── Synonym Match ────────────────────────────────────────────────
  function initSynonymMatch() {
    const shell = document.getElementById("sm-shell");
    if (!shell) return;

    let allPairs;
    try { allPairs = JSON.parse(shell.dataset.pairs || "[]"); } catch (_) { return; }
    if (allPairs.length < 2) return;

    const ROUND_SIZE = Math.min(8, allPairs.length);
    let round = 1;
    let matched = 0;
    let selectedWord = null;
    let selectedWordEl = null;
    let roundPairs = [];

    const elRound = document.getElementById("sm-round");
    const elMatched = document.getElementById("sm-matched");
    const elWords = document.getElementById("sm-words");
    const elSynonyms = document.getElementById("sm-synonyms");
    const elGame = document.getElementById("sm-game");
    const elComplete = document.getElementById("sm-complete");

    function startRound() {
      matched = 0; selectedWord = null; selectedWordEl = null;
      elMatched.textContent = "0";
      elRound.textContent = round;
      elComplete.hidden = true;
      elGame.hidden = false;

      roundPairs = [...allPairs].sort(function() { return Math.random() - 0.5; }).slice(0, ROUND_SIZE);
      const shuffledSyns = [...roundPairs].sort(function() { return Math.random() - 0.5; });

      elWords.innerHTML = "";
      roundPairs.forEach(function(pair) {
        const el = document.createElement("button");
        el.type = "button"; el.className = "match-item";
        el.textContent = pair.word; el.dataset.word = pair.word;
        el.addEventListener("click", function() { handleWordClick(el, pair.word); });
        elWords.appendChild(el);
      });

      elSynonyms.innerHTML = "";
      shuffledSyns.forEach(function(pair) {
        const el = document.createElement("button");
        el.type = "button"; el.className = "match-item";
        el.textContent = pair.synonym; el.dataset.forWord = pair.word;
        el.addEventListener("click", function() { handleSynonymClick(el, pair.word); });
        elSynonyms.appendChild(el);
      });
    }

    function handleWordClick(el, word) {
      if (el.classList.contains("matched") || el.disabled) return;
      if (selectedWordEl) selectedWordEl.classList.remove("selected");
      selectedWord = word; selectedWordEl = el;
      el.classList.add("selected");
    }

    function handleSynonymClick(el, word) {
      if (!selectedWord || el.classList.contains("matched") || el.disabled) return;
      if (word === selectedWord) {
        el.classList.add("matched"); el.disabled = true;
        elWords.querySelectorAll(".match-item").forEach(function(b) {
          if (b.dataset.word === selectedWord) { b.classList.remove("selected"); b.classList.add("matched"); b.disabled = true; }
        });
        matched++; elMatched.textContent = matched;
        selectedWord = null; selectedWordEl = null;
        if (matched >= ROUND_SIZE) {
          setTimeout(function() { elGame.hidden = true; elComplete.hidden = false; }, 500);
        }
      } else {
        el.classList.add("wrong");
        if (selectedWordEl) selectedWordEl.classList.add("wrong");
        setTimeout(function() {
          el.classList.remove("wrong");
          if (selectedWordEl) selectedWordEl.classList.remove("wrong");
        }, 600);
      }
    }

    document.getElementById("sm-next-round").addEventListener("click", function() {
      round++;
      startRound();
    });

    startRound();
  }

  document.addEventListener("DOMContentLoaded", () => {
    initTheme();
    initNav();
    initRecentTools();
    initFavoriteButton();
    initHeroModes();
    initGlobalSearch();
    initWordFilter();
    initWordListFilter();
    initVocabQuiz();
    initWordFamilyQuiz();
    initSynonymMatch();
    initDictionaryLookup();
    initCardPartOfSpeechLookup();
    initBackToTop();
    document.querySelectorAll("[data-tool]").forEach(initTool);
  });
})();
