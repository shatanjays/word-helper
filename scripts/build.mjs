import { mkdir, readFile, rm, writeFile, copyFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import {
  guides,
  hubNav,
  hubs,
  legalNav,
  legalPages,
  mainNav,
  site,
  toolNav,
  tools,
} from "../src/content.mjs";

const root = process.cwd();
const distDir = path.join(root, "dist");
const assetsDir = path.join(distDir, "assets");
const assetVersion = String(Date.now());
const toolByHref = new Map(tools.map((tool) => [tool.href, tool]));
const pageByHref = new Map([
  ...hubs.map((page) => [page.href, page]),
  ...legalPages.map((page) => [page.href, page]),
  ...guides.map((page) => [page.href, page]),
]);

function escapeHtml(value = "") {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function absolute(href = "/") {
  const clean = href.startsWith("/") ? href : `/${href}`;
  return `${site.url}${clean}`;
}

function icon(name, className = "icon") {
  const attrs = `class="${className}" aria-hidden="true" viewBox="0 0 24 24" fill="none"`;
  const common = `stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"`;
  const icons = {
    logo: `<svg ${attrs}><rect x="4" y="4" width="16" height="16" rx="4" ${common}/><path d="M8 8.5h2l2 7 2-7h2" ${common}/><path d="M7.5 15.5h9" ${common}/></svg>`,
    tools: `<svg ${attrs}><path d="M5 5h6v6H5zM13 5h6v6h-6zM5 13h6v6H5zM13 13h6v6h-6z" ${common}/></svg>`,
    unscramble: `<svg ${attrs}><path d="M5 7h5v5H5zM14 5h5v5h-5zM9 15h5v5H9z" ${common}/><path d="M10 9h4M12 12v3" ${common}/></svg>`,
    anagram: `<svg ${attrs}><path d="M7 7h10M7 17h10M8 7l-3 3 3 3M16 17l3-3-3-3" ${common}/></svg>`,
    rhyme: `<svg ${attrs}><path d="M6 5h8a4 4 0 0 1 0 8H9v6H6z" ${common}/><path d="M14 13l4 6" ${common}/></svg>`,
    syllable: `<svg ${attrs}><path d="M4 12h3l2-6 4 12 2-6h5" ${common}/></svg>`,
    prefix: `<svg ${attrs}><path d="M5 6h14M5 12h10M5 18h6" ${common}/><path d="M5 6v12" ${common}/></svg>`,
    suffix: `<svg ${attrs}><path d="M5 6h14M9 12h10M13 18h6" ${common}/><path d="M19 6v12" ${common}/></svg>`,
    games: `<svg ${attrs}><rect x="4" y="7" width="16" height="11" rx="3" ${common}/><path d="M8 12h4M10 10v4M16 11h.01M18 14h.01" ${common}/></svg>`,
    writing: `<svg ${attrs}><path d="M4 20h5l10-10a3 3 0 0 0-5-5L4 15z" ${common}/><path d="M13 6l5 5" ${common}/></svg>`,
    vocabulary: `<svg ${attrs}><path d="M5 5h10a4 4 0 0 1 0 8H8v6H5z" ${common}/><path d="M9 9h5" ${common}/></svg>`,
    patterns: `<svg ${attrs}><path d="M6 6h12M6 12h12M6 18h12" ${common}/><path d="M9 4v4M15 10v4M12 16v4" ${common}/></svg>`,
    guides: `<svg ${attrs}><path d="M6 4h10a2 2 0 0 1 2 2v14H8a2 2 0 0 1-2-2z" ${common}/><path d="M8 4v14a2 2 0 0 0 2 2" ${common}/><path d="M10 8h5M10 12h5" ${common}/></svg>`,
    search: `<svg ${attrs}><circle cx="10.5" cy="10.5" r="5.5" ${common}/><path d="M15 15l4 4" ${common}/></svg>`,
    copy: `<svg ${attrs}><rect x="8" y="8" width="11" height="11" rx="2" ${common}/><path d="M5 15V7a2 2 0 0 1 2-2h8" ${common}/></svg>`,
    clear: `<svg ${attrs}><path d="M6 6l12 12M18 6 6 18" ${common}/></svg>`,
    example: `<svg ${attrs}><path d="M12 5v14M5 12h14" ${common}/></svg>`,
    theme: `<svg ${attrs}><path d="M12 3a7 7 0 1 0 7 7 5 5 0 0 1-7-7z" ${common}/></svg>`,
    legal: `<svg ${attrs}><path d="M7 4h7l3 3v13H7z" ${common}/><path d="M14 4v4h4M9 12h6M9 16h6" ${common}/></svg>`,
    result: `<svg ${attrs}><path d="M5 7h14M5 12h14M5 17h9" ${common}/></svg>`,
  };
  return icons[name] ?? icons.tools;
}

function linkLabel(href) {
  if (toolByHref.has(href)) return toolByHref.get(href).title;
  if (pageByHref.has(href)) return pageByHref.get(href).title;
  return href.replace(/\//g, " ").trim();
}

function breadcrumbItems(page) {
  const items = [{ href: "/", label: "Home" }];
  if (page.href.startsWith("/tools/") && page.href !== "/tools/") {
    items.push({ href: "/tools/", label: "Tools" });
  } else if (page.href.startsWith("/guides/") && page.href !== "/guides/") {
    items.push({ href: "/guides/", label: "Guides" });
  }
  items.push({ href: page.href, label: page.title });
  return items;
}

function breadcrumb(page) {
  const items = breadcrumbItems(page);
  return `<nav class="breadcrumb" aria-label="Breadcrumb">${items
    .map((item, index) =>
      index === items.length - 1
        ? `<span aria-current="page">${escapeHtml(item.label)}</span>`
        : `<a href="${item.href}">${escapeHtml(item.label)}</a>`,
    )
    .join("<span>/</span>")}</nav>`;
}

function breadcrumbSchema(page) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbItems(page).map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      item: absolute(item.href),
    })),
  };
}

function faqSchema(faqs = []) {
  if (!faqs.length) return null;
  return {
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.a,
      },
    })),
  };
}

function schemaScript(items) {
  const graph = items.filter(Boolean).map((item) => ({
    "@context": "https://schema.org",
    ...item,
  }));
  return graph
    .map(
      (item) =>
        `<script type="application/ld+json">${JSON.stringify(item).replace(
          /</g,
          "\\u003c",
        )}</script>`,
    )
    .join("\n");
}

function header() {
  return `<header class="site-header">
  <a class="skip-link" href="#main">Skip to content</a>
  <div class="header-inner">
    <a class="brand" href="/" aria-label="Word Helper home">
      <span class="brand-mark">${icon("logo")}</span>
      <span><strong>Word Helper</strong><small>Free word tools</small></span>
    </a>
    <button class="nav-toggle" type="button" aria-controls="site-nav" aria-expanded="false">
      <span class="sr-only">Toggle navigation</span>
      <span></span><span></span><span></span>
    </button>
    <nav id="site-nav" class="site-nav" aria-label="Primary navigation">
      ${mainNav
        .map((item) => `<a href="${item.href}">${escapeHtml(item.label)}</a>`)
        .join("")}
    </nav>
    <button class="theme-toggle" type="button" aria-label="Switch color theme" title="Switch color theme">${icon(
      "theme",
    )}</button>
  </div>
</header>`;
}

function footer() {
  return `<footer class="site-footer">
  <div class="footer-grid">
    <section>
      <a class="footer-brand" href="/">${icon("logo")}<span>Word Helper</span></a>
      <p>Word Helper provides free educational word tools for writing, learning, solving, and creative word exploration.</p>
      <p class="footer-contact">Contact: <a href="mailto:${site.email}">${site.email}</a></p>
    </section>
    <nav aria-label="Footer tool links">
      <h2>Tools</h2>
      ${tools.map((tool) => `<a href="${tool.href}">${escapeHtml(tool.title)}</a>`).join("")}
    </nav>
    <nav aria-label="Footer topic links">
      <h2>Topics</h2>
      ${hubNav.map((item) => `<a href="${item.href}">${escapeHtml(item.label)}</a>`).join("")}
    </nav>
    <nav aria-label="Footer trust links">
      <h2>Trust</h2>
      <a href="/about/">About</a>
      <a href="/contact/">Contact</a>
      ${legalNav.map((item) => `<a href="${item.href}">${escapeHtml(item.label)}</a>`).join("")}
    </nav>
  </div>
</footer>`;
}

function head(page, extraSchemas = [], noindex = false) {
  const url = absolute(page.href);
  const title = page.metaTitle ?? page.title;
  const desc = page.metaDescription ?? site.description;
  const ogImage = `${site.url}/og-image.svg`;
  return `<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <script>try{var t=localStorage.getItem('word-helper-theme');if(t)document.documentElement.dataset.theme=t;else if(matchMedia('(prefers-color-scheme:dark)').matches)document.documentElement.dataset.theme='dark';}catch(e){}</script>
  <title>${escapeHtml(title)}</title>
  <meta name="description" content="${escapeHtml(desc)}">
  ${noindex ? '<meta name="robots" content="noindex, nofollow">' : ""}
  <link rel="canonical" href="${url}">
  <link rel="icon" href="/favicon.svg" type="image/svg+xml">
  <link rel="apple-touch-icon" href="/apple-touch-icon.svg">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="${site.name}">
  <meta property="og:title" content="${escapeHtml(title)}">
  <meta property="og:description" content="${escapeHtml(desc)}">
  <meta property="og:url" content="${url}">
  <meta property="og:image" content="${ogImage}">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:url" content="${url}">
  <meta name="twitter:title" content="${escapeHtml(title)}">
  <meta name="twitter:description" content="${escapeHtml(desc)}">
  <meta name="twitter:image" content="${ogImage}">
  <meta name="theme-color" content="#212121" media="(prefers-color-scheme: dark)">
  <meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)">
  <link rel="stylesheet" href="/assets/site.css?v=${assetVersion}">
  ${schemaScript(extraSchemas)}
</head>`;
}

function layout(page, body, schemas = [], noindex = false) {
  return `<!doctype html>
<html lang="en">
${head(page, schemas, noindex)}
<body>
${header()}
<main id="main">
${body}
</main>
${footer()}
<script src="/assets/word-data.js?v=${assetVersion}"></script>
<script src="/assets/site.js?v=${assetVersion}" defer></script>
</body>
</html>`;
}

function adSlot(extra = "") {
  return `<aside class="ad-slot ${extra}" aria-label="Advertisement"><span>Advertisement</span></aside>`;
}

function answerBlock(text) {
  return `<section class="answer-block"><div>${icon("result")}</div><p>${escapeHtml(text)}</p></section>`;
}

function cardLink(href, text = "") {
  const tool = toolByHref.get(href);
  const page = pageByHref.get(href);
  const item = tool ?? page;
  const itemIcon = tool?.icon ?? page?.icon ?? "tools";
  const description =
    tool?.intro ??
    page?.answer ??
    text ??
    "Open this Word Helper resource.";
  return `<a class="resource-card" href="${href}">
    <span class="card-icon">${icon(itemIcon)}</span>
    <strong>${escapeHtml(item?.title ?? linkLabel(href))}</strong>
    <span>${escapeHtml(description)}</span>
  </a>`;
}

function faqList(faqs = []) {
  if (!faqs.length) return "";
  return `<section class="section faq-section">
    <div class="section-heading">
      <p class="eyebrow">FAQ</p>
      <h2>Questions people ask</h2>
    </div>
    <div class="faq-list">
      ${faqs
        .map(
          (faq) => `<details>
            <summary>${escapeHtml(faq.q)}</summary>
            <p>${escapeHtml(faq.a)}</p>
          </details>`,
        )
        .join("")}
    </div>
  </section>`;
}

function renderHome() {
  const page = {
    href: "/",
    title: "Word Helper",
    metaTitle: "Word Helper - Free Word Tools for Letters, Rhymes, and Syllables",
    metaDescription: site.description,
  };
  const faqs = [
    {
      q: "What is Word Helper?",
      a: "Word Helper is a free word tools platform for unscrambling letters, solving anagrams, finding rhymes, counting syllables, and exploring prefix or suffix word patterns.",
    },
    {
      q: "Which tool should I use for scrambled letters?",
      a: "Use Word Unscramble when you want all valid words that can be built from the letters you have.",
    },
    {
      q: "Can Word Helper help writers?",
      a: "Yes. Writers can use the Rhyme Finder, Syllable Counter, Prefix Finder, and Suffix Finder for poems, lyrics, captions, speeches, and vocabulary choices.",
    },
    {
      q: "Are the tools exact?",
      a: "Letter tools use exact letter-frequency logic. Rhyme and syllable tools are practical aids and include honest limits where pronunciation can vary.",
    },
  ];
  const body = `<div id="recent-tools-section" class="section" hidden aria-live="polite">
    <div class="section-heading">
      <p class="eyebrow">Remembered from your last visit</p>
      <h2 id="recent-tools-heading">Recently used</h2>
    </div>
    <div id="recent-tools-list" class="card-grid"></div>
  </div>
  <section class="hero">
    <div class="hero-copy">
      <p class="eyebrow">Free word tools</p>
      <h1>Word Helper</h1>
      <p class="hero-lede">Type scrambled letters, a rhyme word, a sentence, a prefix, or a suffix and Word Helper turns word work into clear, usable results.</p>
      ${answerBlock(site.description)}
      <div class="hero-actions">
        <a class="button primary" href="/tools/word-unscramble/">Unscramble Letters</a>
        <a class="button secondary" href="/tools/">Browse Tools</a>
      </div>
    </div>
    <section class="quick-launcher" aria-labelledby="quick-launcher-title">
      <div class="launcher-top">
        <span class="card-icon">${icon("search")}</span>
        <div>
          <h2 id="quick-launcher-title">Quick tool launcher</h2>
          <p>Choose the job you need right now.</p>
        </div>
      </div>
      <div class="launcher-list">
        ${tools
          .map(
            (tool) => `<a href="${tool.href}">
              ${icon(tool.icon)}
              <span><strong>${tool.title}</strong><small>${tool.intro}</small></span>
            </a>`,
          )
          .join("")}
      </div>
    </section>
  </section>
  ${adSlot("after-hero")}
  <section class="section">
    <div class="section-heading">
      <p class="eyebrow">Featured tools</p>
      <h2>Built for letters, sounds, and word patterns</h2>
      <p>Each tool has its own result layout, examples, copy actions, and honest limitations.</p>
    </div>
    <div class="card-grid">
      ${tools.map((tool) => cardLink(tool.href)).join("")}
    </div>
  </section>
  <section class="section split">
    <div>
      <p class="eyebrow">Why use Word Helper</p>
      <h2>Fast answers without a noisy tool page</h2>
      <p>Word Helper is for the small word problems that interrupt writing, studying, and game play: scrambled letters, anagrams, rhymes, syllables, prefixes, suffixes, spelling patterns, and vocabulary checks.</p>
    </div>
    <div class="feature-list">
      <article><h3>For word games</h3><p>Find words from letters, scan by length, and narrow results with pattern filters.</p></article>
      <article><h3>For writing</h3><p>Compare rhyme ideas, count syllables, and choose words that fit the line.</p></article>
      <article><h3>For learning</h3><p>Study prefix and suffix families, spelling endings, and vocabulary patterns.</p></article>
    </div>
  </section>
  <section class="section">
    <div class="section-heading">
      <p class="eyebrow">How the tools work</p>
      <h2>Clear logic, visible limits</h2>
    </div>
    <div class="steps">
      <article><span>1</span><h3>Enter a word task</h3><p>Use letters, a phrase, a rhyme word, a text sample, a prefix, or a suffix.</p></article>
      <article><span>2</span><h3>Apply the right matching logic</h3><p>Letter tools use frequency checks. Pattern tools use exact starts-with or ends-with matching.</p></article>
      <article><span>3</span><h3>Read grouped results</h3><p>Results are grouped by length, anagram mode, rhyme quality, or syllable breakdown depending on the tool.</p></article>
    </div>
  </section>
  <section class="section split">
    <div>
      <p class="eyebrow">Popular use cases</p>
      <h2>Useful for games, writing, poetry, and class</h2>
      <p>Use Word Helper for word games, creative writing, poetry, captions, vocabulary practice, spelling lessons, classroom writing, pronunciation rhythm, and quick word discovery.</p>
    </div>
    <div class="pill-cloud" aria-label="Popular Word Helper use cases">
      ${[
        "scrambled letters",
        "anagrams",
        "rhymes",
        "syllables",
        "prefixes",
        "suffixes",
        "word games",
        "writing",
        "poetry",
        "vocabulary",
        "spelling",
        "learning",
      ]
        .map((item) => `<span>${item}</span>`)
        .join("")}
    </div>
  </section>
  <section class="section">
    <div class="section-heading">
      <p class="eyebrow">Word learning guide</p>
      <h2>Learn the pattern behind the result</h2>
      <p>Tools are faster when they also teach you what changed. Word Helper explains duplicate-letter handling, exact vs partial anagrams, rhyme quality, syllable estimates, and letter-based prefix or suffix matching.</p>
    </div>
    <div class="card-grid">
      ${guides.slice(0, 4).map((guide) => cardLink(guide.href, guide.answer)).join("")}
    </div>
  </section>
  ${faqList(faqs)}`;
  const schemas = [
    {
      "@type": "WebSite",
      name: site.name,
      url: `${site.url}/`,
      description: site.description,
    },
    {
      "@type": "Organization",
      name: site.name,
      url: `${site.url}/`,
      logo: {
        "@type": "ImageObject",
        url: `${site.url}/favicon.svg`,
      },
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "customer support",
        email: site.email,
      },
    },
    {
      "@type": "WebPage",
      name: page.title,
      url: absolute(page.href),
      description: page.metaDescription,
    },
    faqSchema(faqs),
  ];
  return { href: "/", html: layout(page, body, schemas) };
}

function toolFields(tool) {
  if (tool.id === "word-unscramble") {
    return `<label>Letters <input name="letters" autocomplete="off" placeholder="Example: listen or tca" inputmode="text"></label>
    <div class="filter-grid">
      <label>Starts with <input name="starts" autocomplete="off" placeholder="s"></label>
      <label>Ends with <input name="ends" autocomplete="off" placeholder="t"></label>
      <label>Contains <input name="contains" autocomplete="off" placeholder="i"></label>
      <label>Minimum length <input name="min" type="number" min="2" max="14" placeholder="2"></label>
      <label>Maximum length <input name="max" type="number" min="2" max="14" placeholder="14"></label>
    </div>`;
  }
  if (tool.id === "anagram-solver") {
    return `<label>Letters or short phrase <input name="phrase" autocomplete="off" placeholder="Example: listen or stone" inputmode="text"></label>
    <fieldset class="mode-options">
      <legend>Anagram mode</legend>
      <label><input type="radio" name="mode" value="exact" checked> Use every letter exactly once</label>
      <label><input type="radio" name="mode" value="partial"> Find smaller words inside these letters</label>
    </fieldset>`;
  }
  if (tool.id === "rhyme-finder") {
    return `<label>Word to rhyme <input name="word" autocomplete="off" placeholder="Example: light" inputmode="text"></label>`;
  }
  if (tool.id === "syllable-counter") {
    return `<label>Text to count <textarea name="text" rows="6" placeholder="Paste a word, sentence, or paragraph"></textarea></label>`;
  }
  if (tool.id === "prefix-finder") {
    return `<label>Prefix or starting letters <input name="prefix" autocomplete="off" placeholder="Example: pre" inputmode="text"></label>
    <div class="filter-grid">
      <label>Minimum length <input name="min" type="number" min="2" max="14" placeholder="2"></label>
      <label>Maximum length <input name="max" type="number" min="2" max="14" placeholder="14"></label>
    </div>`;
  }
  return `<label>Suffix or ending letters <input name="suffix" autocomplete="off" placeholder="Example: ing" inputmode="text"></label>
    <div class="filter-grid">
      <label>Minimum length <input name="min" type="number" min="2" max="14" placeholder="2"></label>
      <label>Maximum length <input name="max" type="number" min="2" max="14" placeholder="14"></label>
    </div>`;
}

function renderTool(tool) {
  const page = tool;
  const body = `<section class="page-hero tool-hero">
    ${breadcrumb(page)}
    <p class="eyebrow">${escapeHtml(tool.primaryKeyword)}</p>
    <h1>${escapeHtml(tool.h1)}</h1>
    <p>${escapeHtml(tool.intro)}</p>
    ${answerBlock(tool.answer)}
  </section>
  <section class="tool-shell" data-tool="${tool.id}" aria-labelledby="${tool.id}-form-title">
    <div class="tool-panel">
      <div class="tool-panel-heading">
        <span class="card-icon">${icon(tool.icon)}</span>
        <div>
          <h2 id="${tool.id}-form-title">${escapeHtml(tool.title)}</h2>
          <p>${escapeHtml(tool.emptyState)}</p>
        </div>
      </div>
      <form class="tool-form" novalidate>
        ${toolFields(tool)}
        <div class="tool-actions">
          <button class="button primary" type="submit">${escapeHtml(tool.buttonLabel)}</button>
          <button class="button secondary clear-tool" type="button">${tool.id === "syllable-counter" ? "Clear Text" : tool.id === "word-unscramble" ? "Clear Letters" : tool.id === "anagram-solver" ? "Clear Input" : tool.id === "rhyme-finder" ? "Clear Word" : tool.id === "prefix-finder" ? "Clear Prefix" : "Clear Suffix"}</button>
        </div>
      </form>
      <div class="example-row" aria-label="Try examples">
        ${tool.examples
          .map(
            (example) =>
              `<button type="button" class="example-button" data-example="${escapeHtml(
                example.value,
              )}" title="${escapeHtml(example.note)}">${icon("example")} Try ${escapeHtml(
                example.label,
              )}</button>`,
          )
          .join("")}
      </div>
    </div>
    <section class="result-panel" aria-live="polite">
      <div class="result-heading">
        <div>
          <p class="eyebrow">Results</p>
          <h2>${escapeHtml(tool.resultHeading)}</h2>
        </div>
        <button type="button" class="copy-all" disabled>${icon("copy")} ${tool.id === "syllable-counter" ? "Copy Analysis" : "Copy Words"}</button>
      </div>
      <div class="tool-message empty">${escapeHtml(tool.emptyState)}</div>
      <div class="results"></div>
      <p class="bookmark-hint" hidden>Use this often? Press <kbd>Cmd+D</kbd> on Mac or <kbd>Ctrl+D</kbd> on Windows to bookmark this tool.</p>
    </section>
  </section>
  ${adSlot("after-tool")}
  <section class="section split">
    <div>
      <p class="eyebrow">How it works</p>
      <h2>How Word Helper calculates results</h2>
    </div>
    <div class="text-stack">${tool.how.map((item) => `<p>${escapeHtml(item)}</p>`).join("")}</div>
  </section>
  <section class="section split">
    <div>
      <p class="eyebrow">Tips</p>
      <h2>Practical ways to use this tool</h2>
    </div>
    <ul class="check-list">${tool.tips.map((tip) => `<li>${escapeHtml(tip)}</li>`).join("")}</ul>
  </section>
  <section class="section">
    <div class="section-heading">
      <p class="eyebrow">Related tools</p>
      <h2>What to try next</h2>
    </div>
    <div class="card-grid related-grid">${tool.related.map((href) => cardLink(href)).join("")}</div>
  </section>
  <section class="section note-section">
    <h2>Honest limitation</h2>
    <p>${escapeHtml(tool.disclaimer)}</p>
  </section>
  ${faqList(tool.faqs)}`;
  const schemas = [
    {
      "@type": "WebPage",
      name: tool.title,
      url: absolute(tool.href),
      description: tool.metaDescription,
    },
    {
      "@type": "WebApplication",
      name: tool.title,
      url: absolute(tool.href),
      applicationCategory: "EducationalApplication",
      operatingSystem: "Any",
      description: tool.metaDescription,
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
    },
    breadcrumbSchema(page),
    faqSchema(tool.faqs),
  ];
  return { href: tool.href, html: layout(page, body, schemas) };
}

function renderHub(page) {
  const guideCards =
    page.href === "/guides/"
      ? `<div class="card-grid">${guides.map((guide) => cardLink(guide.href, guide.answer)).join("")}</div>`
      : "";
  const links = page.links?.length
    ? `<div class="card-grid">${page.links.map((href) => cardLink(href)).join("")}</div>`
    : "";
  const body = `<section class="page-hero">
    ${breadcrumb(page)}
    <p class="eyebrow">Word Helper topic hub</p>
    <h1>${escapeHtml(page.h1)}</h1>
    ${answerBlock(page.answer)}
  </section>
  <section class="section">
    <div class="section-heading">
      <p class="eyebrow">Start here</p>
      <h2>Helpful links</h2>
    </div>
    ${links}
    ${guideCards}
  </section>
  <section class="section split">
    <div>
      <p class="eyebrow">Guide</p>
      <h2>How this section helps</h2>
    </div>
    <div class="text-stack">
      ${page.sections.map((section) => `<article><h3>${escapeHtml(section.heading)}</h3><p>${escapeHtml(section.text)}</p></article>`).join("")}
    </div>
  </section>
  ${adSlot("mid-content")}
  ${faqList(page.faqs)}`;
  const schemas = [
    {
      "@type": page.href === "/tools/" ? "CollectionPage" : "WebPage",
      name: page.title,
      url: absolute(page.href),
      description: page.metaDescription,
    },
    breadcrumbSchema(page),
    faqSchema(page.faqs),
  ];
  return { href: page.href, html: layout(page, body, schemas) };
}

function renderGuide(page) {
  const body = `<article class="article-page">
    ${breadcrumb(page)}
    <p class="eyebrow">Word Helper guide</p>
    <h1>${escapeHtml(page.h1)}</h1>
    ${answerBlock(page.answer)}
    <div class="article-body">
      ${page.body
        .map((section) => `<section><h2>${escapeHtml(section.heading)}</h2><p>${escapeHtml(section.text)}</p></section>`)
        .join("")}
    </div>
    <section class="section compact">
      <div class="section-heading">
        <p class="eyebrow">Related tools</p>
        <h2>Try this next</h2>
      </div>
      <div class="card-grid">${page.links.map((href) => cardLink(href)).join("")}</div>
    </section>
    ${faqList(page.faqs)}
  </article>`;
  const schemas = [
    {
      "@type": "Article",
      headline: page.h1,
      name: page.title,
      url: absolute(page.href),
      description: page.metaDescription,
      datePublished: "2024-01-01",
      dateModified: new Date().toISOString().split("T")[0],
      author: {
        "@type": "Organization",
        name: site.name,
        url: `${site.url}/`,
      },
      publisher: {
        "@type": "Organization",
        name: site.name,
        url: `${site.url}/`,
      },
    },
    breadcrumbSchema(page),
    faqSchema(page.faqs),
  ];
  return { href: page.href, html: layout(page, body, schemas) };
}

function renderLegal(page) {
  const body = `<section class="page-hero legal-hero">
    ${breadcrumb(page)}
    <p class="eyebrow">Word Helper trust</p>
    <h1>${escapeHtml(page.h1)}</h1>
  </section>
  <section class="legal-content">
    ${page.body.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("")}
  </section>`;
  const schemas = [
    {
      "@type": "WebPage",
      name: page.title,
      url: absolute(page.href),
      description: page.metaDescription,
    },
    breadcrumbSchema(page),
  ];
  return { href: page.href, html: layout(page, body, schemas) };
}

function renderNotFound() {
  const page = {
    href: "/404/",
    title: "Page Not Found",
    metaTitle: "Page Not Found - Word Helper",
    metaDescription: "The requested Word Helper page was not found.",
  };
  const body = `<section class="page-hero centered">
    <p class="eyebrow">404</p>
    <h1>This page is not available</h1>
    <p>The page may have moved, or the URL may be typed incorrectly.</p>
    <a class="button primary" href="/tools/">Browse Word Helper tools</a>
  </section>`;
  return { href: "/404/", html: layout(page, body, [], true) };
}

const WORD_EXCLUDE = new Set([
  "er", "ing", "ly", "ed", "est", "ness", "ment", "tion", "sion", "ful", "ible",
  "pre", "un", "re", "mis", "tac", "ble", "ness", "ry",
]);

async function buildWordData() {
  const seedPath = path.join(root, "src/data/seed-words.txt");
  const seedWords = (await readFile(seedPath, "utf8"))
    .split(/\s+/)
    .map((word) => word.trim().toLowerCase())
    .filter(Boolean);
  const sources = ["/usr/share/dict/words", "/usr/dict/words"];
  const words = new Set(seedWords);
  for (const source of sources) {
    if (!existsSync(source)) continue;
    const text = await readFile(source, "utf8");
    for (const raw of text.split(/\r?\n/)) {
      const word = raw.trim();
      if (!/^[a-z]{2,14}$/.test(word)) continue;
      if (WORD_EXCLUDE.has(word)) continue;
      if (word.length > 12 && !/(tion|ness|ment|less|able|ible|ing|ful)$/.test(word)) continue;
      words.add(word);
    }
    break;
  }
  const list = Array.from(words)
    .filter((word) => !/(.)\1\1\1/.test(word))
    .sort((a, b) => a.length - b.length || a.localeCompare(b));
  const prioritized = [];
  const seen = new Set();
  for (const word of seedWords) {
    if (!seen.has(word)) {
      prioritized.push(word);
      seen.add(word);
    }
  }
  for (const word of list) {
    if (seen.has(word)) continue;
    prioritized.push(word);
    seen.add(word);
    if (prioritized.length >= 30000) break;
  }
  return prioritized;
}

async function writeRoute(route) {
  const clean = route.href === "/" ? "" : route.href.replace(/^\/|\/$/g, "");
  const dir = clean ? path.join(distDir, clean) : distDir;
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, "index.html"), route.html);
}

function sitemap(routes) {
  const now = new Date().toISOString();
  const entries = routes
    .filter((route) => route.href !== "/404/")
    .map(
      (route) => `<url>
  <loc>${absolute(route.href)}</loc>
  <lastmod>${now}</lastmod>
  <changefreq>${route.href.includes("/guides/") ? "monthly" : "weekly"}</changefreq>
  <priority>${route.href === "/" ? "1.0" : route.href === "/tools/" ? "0.9" : route.href.startsWith("/tools/") ? "0.8" : "0.7"}</priority>
</url>`,
    )
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries}
</urlset>`;
}

function favicon() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="16" fill="#10A37F"/>
  <path d="M18 18h8l6 24 6-24h8" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M16 44h32" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round"/>
</svg>`;
}

function ogImage() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630">
  <rect width="1200" height="630" fill="#212121"/>
  <rect x="60" y="200" width="84" height="84" rx="18" fill="#10A37F"/>
  <path d="M76 226h16l12 40 12-40h16" fill="none" stroke="#fff" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M73 266h50" fill="none" stroke="#fff" stroke-width="8" stroke-linecap="round"/>
  <text x="168" y="256" font-family="Arial,sans-serif" font-size="56" font-weight="700" fill="#ECECEC">Word Helper</text>
  <text x="60" y="348" font-family="Arial,sans-serif" font-size="28" fill="#A3A3A3">Free word tools for letters, rhymes, and syllables</text>
  <rect x="60" y="400" width="180" height="44" rx="8" fill="#10A37F"/>
  <text x="150" y="428" font-family="Arial,sans-serif" font-size="16" font-weight="700" fill="#fff" text-anchor="middle">Word Unscramble</text>
  <rect x="256" y="400" width="160" height="44" rx="8" fill="#2F2F2F" stroke="#3F3F3F" stroke-width="1"/>
  <text x="336" y="428" font-family="Arial,sans-serif" font-size="16" font-weight="700" fill="#CFCFCF" text-anchor="middle">Anagram Solver</text>
  <rect x="432" y="400" width="150" height="44" rx="8" fill="#2F2F2F" stroke="#3F3F3F" stroke-width="1"/>
  <text x="507" y="428" font-family="Arial,sans-serif" font-size="16" font-weight="700" fill="#CFCFCF" text-anchor="middle">Rhyme Finder</text>
  <rect x="598" y="400" width="170" height="44" rx="8" fill="#2F2F2F" stroke="#3F3F3F" stroke-width="1"/>
  <text x="683" y="428" font-family="Arial,sans-serif" font-size="16" font-weight="700" fill="#CFCFCF" text-anchor="middle">Syllable Counter</text>
  <text x="60" y="556" font-family="Arial,sans-serif" font-size="22" fill="#525252">wordhelper.online</text>
</svg>`;
}

function appleTouchIcon() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 180" width="180" height="180">
  <rect width="180" height="180" rx="38" fill="#10A37F"/>
  <path d="M46 52h26l22 76 22-76h26" fill="none" stroke="#fff" stroke-width="14" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M40 132h100" fill="none" stroke="#fff" stroke-width="14" stroke-linecap="round"/>
</svg>`;
}

async function main() {
  await rm(distDir, { recursive: true, force: true });
  await mkdir(assetsDir, { recursive: true });

  const routes = [
    renderHome(),
    ...hubs.map(renderHub),
    ...tools.map(renderTool),
    ...guides.map(renderGuide),
    ...legalPages.map(renderLegal),
    renderNotFound(),
  ];

  for (const route of routes) {
    await writeRoute(route);
  }

  await copyFile(path.join(root, "src/assets/site.css"), path.join(assetsDir, "site.css"));
  await copyFile(path.join(root, "src/assets/site.js"), path.join(assetsDir, "site.js"));
  const wordData = await buildWordData();
  await writeFile(
    path.join(assetsDir, "word-data.js"),
    `window.WORD_HELPER_WORDS=${JSON.stringify(wordData)};\n`,
  );
  await writeFile(path.join(distDir, "sitemap.xml"), sitemap(routes));
  await writeFile(
    path.join(distDir, "robots.txt"),
    `User-agent: *\nAllow: /\n\nSitemap: ${site.url}/sitemap.xml\n`,
  );
  await writeFile(path.join(distDir, "favicon.svg"), favicon());
  await writeFile(path.join(distDir, "og-image.svg"), ogImage());
  await writeFile(path.join(distDir, "apple-touch-icon.svg"), appleTouchIcon());
  console.log(`Built ${routes.length} pages with ${wordData.length} words.`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
