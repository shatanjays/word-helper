import { mkdir, readFile, readdir, rm, writeFile, copyFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { gzipSync } from "node:zlib";
import path from "node:path";
import { SHARD_COUNT, slugFromPath, shardOf } from "../src/shard-util.mjs";
import {
  guides,
  hubNav,
  hubs,
  legalNav,
  legalPages,
  mainNav,
  site,
  founder,
  toolNav,
  tools,
} from "../src/content.mjs";
import { words, wordExplorerHubData } from "../src/words.mjs";
import { lessons, learnHubData } from "../src/learn.mjs";
import { wordLists, wordListsHubData } from "../src/word-lists.mjs";
import { sanitizeRelations } from "../src/relation-filter.mjs";
import {
  isCompleteWordEntry,
  wordCompletenessScore,
  wordMicroMeta,
} from "../src/word-quality.mjs";
import {
  wordRecommendationScore,
  wordDifficulty,
  wordUsageLabel,
  isWordGameWord,
  wordClassTags,
  RECOMMENDATION_THRESHOLD,
} from "../src/word-recommendation.mjs";

const root = process.cwd();
const distDir = path.join(root, "dist");
const assetsDir = path.join(distDir, "assets");
const assetVersion = String(Date.now());

// ── Canonicalization & indexing env (migration-safe) ─────────────────────
// Single source of truth for the canonical host and the deploy environment.
//
// CURRENT PRODUCTION URL: https://wordhelper-online.pages.dev
// FUTURE BRANDED DOMAIN:  https://wordhelper.online  (not yet attached)
//
// How to build for each target:
//   Pages.dev (current):  SITE_ENV=production node scripts/build.mjs
//   Live domain (future): SITE_ENV=production HOST_CANONICAL=https://wordhelper.online node scripts/build.mjs
//
// After the custom domain is confirmed live, update the default below and
// the package.json build:prod script. See docs/custom-domain-readiness.md.
//
// Cloudflare Pages auto-detection: CF_PAGES=1 on the main branch triggers production.
const HOST_CANONICAL = (process.env.HOST_CANONICAL || "https://wordhelper-online.pages.dev").replace(/\/+$/, "");
const CF_PAGES_BRANCH = process.env.CF_PAGES_BRANCH || "";
const IS_CF_PAGES_PROD = process.env.CF_PAGES === "1" && CF_PAGES_BRANCH === "main";
const SITE_ENV = (process.env.SITE_ENV || (IS_CF_PAGES_PROD ? "production" : "staging")).toLowerCase();
const IS_PRODUCTION = SITE_ENV === "production";
// DEPLOY_SLIM=1 omits the noindex /word/ thin pages from disk so the bundle fits
// the Cloudflare Pages/Workers 100k-file cap (paid plan). Those pages are noindex,
// unlinked, and absent from the sitemap, so a direct hit serves the branded 404
// (see deployRedirects: "/* /404.html 404" is a true fallback that never shadows a
// real static asset). Public pages, sitemap, search index, and internal links are
// all unaffected. Omit the flag for a full build (used to validate every page).
const DEPLOY_SLIM = process.env.DEPLOY_SLIM === "1";
// SHARD_PAGES=1 is the production hosting mode for the free Cloudflare plan
// (20k-file cap). Instead of 64k individual /word/<slug>/index.html files, each
// PUBLIC word's pre-rendered HTML is gzipped and packed into SHARD_COUNT JSON
// shards under dist/_shards/. A Pages Function (functions/word/[[slug]].js)
// serves /word/<slug>/ by decompressing the matching entry — byte-identical HTML,
// identical SEO. Non-public (noindex) word pages are not shipped (they 404, as
// they are unlinked and excluded from the sitemap). See src/shard-util.mjs.
const SHARD_PAGES = process.env.SHARD_PAGES === "1";
// All canonical / og / sitemap / robots URLs derive from this one constant.
site.url = HOST_CANONICAL;
// SINGLE SOURCE OF TRUTH for the tool count — derived from the actual tools array.
// Every "N word tools" claim across the site interpolates ${TOOL_COUNT}; never
// hardcode a different number anywhere.
const TOOL_COUNT = tools.length;
// SINGLE SOURCE OF TRUTH for quiz / Word Explorer word count.
// The vocabulary quiz, word family quiz, and synonym match all use the same
// words array. Every quiz-count claim must use QUIZ_WORD_COUNT — never a
// hardcoded number. If words are added or removed, the count updates everywhere.
const QUIZ_WORD_COUNT = words.length;
// In-browser tool-dictionary size (SSOT) — set in the main flow once buildWordData
// runs, BEFORE any page rendering. This is the list the client tools actually
// match against at runtime (published pages + the most frequent raw-list words),
// NOT the full 327k build-time source inventory. toolDictLabel() renders a
// conservative rounded-down "94k+"-style label.
let TOOL_DICT_COUNT = 0;
const toolDictLabel = () => `${Math.floor((TOOL_DICT_COUNT || 90000) / 1000)}k+`;
// Real build/edit date — drives lastReviewed/dateModified trust signals (no fabricated dates).
const buildDateISO = new Date().toISOString().slice(0, 10);
// Content baseline date for Article datePublished — aligned with the Organization
// foundingDate ("2025"). Individual guides/lists may override with a real
// `datePublished` field; this is the honest "published since launch" fallback.
const SITE_CONTENT_START = "2025-01-01";
// Reusable publisher node for Article schema (Google Article rich results expect a
// publisher with a logo ImageObject).
const ARTICLE_PUBLISHER = () => ({
  "@type": "Organization",
  name: site.name,
  url: `${site.url}/`,
  logo: { "@type": "ImageObject", url: `${site.url}/og-image.png`, width: 1200, height: 630 },
});
// SERP hygiene: Google truncates titles past ~60 chars and meta descriptions past
// ~158. Word-page metaTitle/metaDescription are baked into the 64k enriched entries,
// so normalize them at render time (front-loaded keywords kept; never cut mid-word).
function clampTitle(title, label) {
  if (!title) return title;
  if (title.length <= 60) return title;
  const short = `${label} — meaning, examples & synonyms | Word Helper`;
  if (short.length <= 60) return short;
  const minimal = `${label} | Word Helper`;
  return minimal.length <= 60 ? minimal : minimal.slice(0, 57).trimEnd() + "…";
}
function clampMeta(desc) {
  const d = (desc || "").trim();
  if (d.length <= 158) return d;
  const cut = d.slice(0, 158);
  const lastSpace = cut.lastIndexOf(" ");
  return (lastSpace > 120 ? cut.slice(0, lastSpace) : cut).replace(/[\s,;:.\u2013\u2014-]+$/, "") + "…";
}
const letterBrowseTargets = {
  a: 5000,
  b: 5000,
  c: 5000,
  d: 5000,
  e: 5000,
  f: 5000,
  g: 5000,
  h: 5000,
  i: 5000,
  j: 5000,
  k: 5000,
  l: 5000,
  m: 5000,
  n: 5000,
  o: 5000,
  p: 5000,
  q: 5000,
  r: 5000,
  s: 5000,
  t: 5000,
  u: 5000,
  v: 5000,
  w: 5000,
  x: 5000,
  y: 5000,
  z: 5000,
};
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

// Words that have a real static page (populated in main() before any render).
const publishedWordSet = new Set();

// Link to a word: the real static page if it exists, otherwise the single
// noindexed client-side lookup template (so browse/synonym links never 404).
// NOTE: we deliberately do NOT use a "/word/* 200" rewrite — on Cloudflare Pages
// a splat rewrite overrides existing static pages, which would clobber the 2,215
// real word pages. Query-param routing to the lookup template avoids that.
function wordHref(word = "") {
  const slug = String(word).toLowerCase().trim().replace(/\s+/g, "-");
  if (publishedWordSet.has(slug)) return `/word/${encodeURIComponent(slug)}/`;
  return `/word-lookup/?w=${encodeURIComponent(slug)}`;
}

// A synonym/antonym chip: links only when the word has a real published page
// (keeps internal links clean — no ?w= parameter URLs anywhere in the crawl).
function wordPill(word = "") {
  const label = String(word);
  const slug = label.toLowerCase().trim().replace(/\s+/g, "-");
  return publishedWordSet.has(slug)
    ? `<a class="word-pill" href="/word/${encodeURIComponent(slug)}/">${escapeHtml(label)}</a>`
    : `<span class="word-pill word-pill-flat">${escapeHtml(label)}</span>`;
}

function icon(name, className = "icon") {
  const attrs = `class="${className}" aria-hidden="true" viewBox="0 0 24 24" fill="none"`;
  const common = `stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"`;
  const icons = {
    logo: `<svg ${attrs}><rect x="4" y="4" width="16" height="16" rx="4" ${common}/><path d="M8 8.5h2l2 7 2-7h2" ${common}/><path d="M7.5 15.5h9" ${common}/></svg>`,
    info: `<svg ${attrs}><circle cx="12" cy="12" r="9" ${common}/><path d="M12 11v5M12 8h.01" ${common}/></svg>`,
    globe: `<svg ${attrs}><circle cx="12" cy="12" r="9" ${common}/><path d="M3 12h18M12 3c2.6 2.7 2.6 15.3 0 18M12 3c-2.6 2.7-2.6 15.3 0 18" ${common}/></svg>`,
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
    wordexplorer: `<svg ${attrs}><circle cx="12" cy="12" r="8" ${common}/><path d="M12 4v16M4 12h16M8 6.4C9.3 8 10.6 10 12 12c1.4-2 2.7-4 4-5.6M8 17.6c1.3-1.6 2.6-3.6 4-5.6 1.4 2 2.7 4 4 5.6" ${common}/></svg>`,
    learn: `<svg ${attrs}><path d="M2 12l10-8 10 8M5 10v9a1 1 0 0 0 1 1h4v-5h4v5h4a1 1 0 0 0 1-1v-9" ${common}/></svg>`,
    wordlists: `<svg ${attrs}><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" ${common}/></svg>`,
    practice: `<svg ${attrs}><path d="M9 12l2 2 4-4" ${common}/><path d="M5 7h14a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2z" ${common}/></svg>`,
    wordlab: `<svg ${attrs}><path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2V9M9 21H5a2 2 0 0 1-2-2V9m0 0h18" ${common}/></svg>`,
    az: `<svg ${attrs}><path d="M4 8h4v4H4zM14 8h4v4h-4zM4 16h16M8 12l4 4 4-4" ${common}/></svg>`,
    copy: `<svg ${attrs}><rect x="8" y="8" width="11" height="11" rx="2" ${common}/><path d="M5 15V7a2 2 0 0 1 2-2h8" ${common}/></svg>`,
    clear: `<svg ${attrs}><path d="M6 6l12 12M18 6 6 18" ${common}/></svg>`,
    example: `<svg ${attrs}><path d="M12 5v14M5 12h14" ${common}/></svg>`,
    theme: `<svg ${attrs}><path d="M12 3a7 7 0 1 0 7 7 5 5 0 0 1-7-7z" ${common}/></svg>`,
    sun: `<svg ${attrs}><circle cx="12" cy="12" r="4" ${common}/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.4 1.4M17.6 17.6L19 19M19 5l-1.4 1.4M6.4 17.6L5 19" ${common}/></svg>`,
    legal: `<svg ${attrs}><path d="M7 4h7l3 3v13H7z" ${common}/><path d="M14 4v4h4M9 12h6M9 16h6" ${common}/></svg>`,
    result: `<svg ${attrs}><path d="M5 7h14M5 12h14M5 17h9" ${common}/></svg>`,
    spark: `<svg ${attrs}><path d="M12 3l1.7 5.1L19 10l-5.3 1.9L12 17l-1.7-5.1L5 10l5.3-1.9z" ${common}/><path d="M19 16l.8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8zM5 16l.8 2.2L8 19l-2.2.8L5 22l-.8-2.2L2 19l2.2-.8z" ${common}/></svg>`,
    arrow: `<svg ${attrs}><path d="M5 12h14M13 6l6 6-6 6" ${common}/></svg>`,
    chevron: `<svg ${attrs}><path d="M6 9l6 6 6-6" ${common}/></svg>`,
    check: `<svg ${attrs}><path d="M20 6L9 17l-5-5" ${common}/></svg>`,
    layers: `<svg ${attrs}><path d="M12 3l8 4-8 4-8-4z" ${common}/><path d="M4 12l8 4 8-4M4 17l8 4 8-4" ${common}/></svg>`,
    pulse: `<svg ${attrs}><path d="M4 12h3l2-6 4 12 2-6h5" ${common}/></svg>`,
  };
  return icons[name] ?? icons.tools;
}

function linkLabel(href) {
  if (toolByHref.has(href)) return toolByHref.get(href).title;
  if (pageByHref.has(href)) return pageByHref.get(href).title;
  const letter = href.match(/^\/word-explorer\/([a-z])\/$/i);
  if (letter) return `Browse ${letter[1].toUpperCase()} words`;
  const SECTION = {
    "/word-explorer/": "Word Explorer",
    "/word-lists/": "Word Lists",
    "/learn-english/": "Learn English",
    "/words/": "Browse A–Z",
    "/word-lab/": "Word Lab",
    "/practice/": "Practice",
    "/guides/": "Guides",
  };
  if (SECTION[href]) return SECTION[href];
  const seg = href.replace(/\/+$/, "").split("/").filter(Boolean).pop() || "Word Helper";
  return seg.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function breadcrumbItems(page) {
  const items = [{ href: "/", label: "Home" }];
  if (page.href.startsWith("/tools/") && page.href !== "/tools/") {
    items.push({ href: "/word-lab/", label: "Tools" });
  } else if (page.href.startsWith("/guides/") && page.href !== "/guides/") {
    items.push({ href: "/guides/", label: "Guides" });
  } else if (page.href.startsWith("/word/")) {
    items.push({ href: "/word-explorer/", label: "Word Explorer" });
  } else if (page.href.startsWith("/learn-english/") && page.href !== "/learn-english/") {
    items.push({ href: "/learn-english/", label: "Learn English" });
  } else if (page.href.startsWith("/word-lists/") && page.href !== "/word-lists/") {
    items.push({ href: "/word-lists/", label: "Word Lists" });
  } else if (page.href.startsWith("/practice/") && page.href !== "/practice/") {
    items.push({ href: "/practice/", label: "Practice" });
  } else if (page.href.startsWith("/words/") && page.href !== "/words/") {
    items.push({ href: "/words/", label: "Browse A–Z" });
  } else if (page.href.startsWith("/word-explorer/") && page.href !== "/word-explorer/") {
    items.push({ href: "/word-explorer/", label: "Word Explorer" });
  } else if (page.href.startsWith("/word-lab/") && page.href !== "/word-lab/") {
    items.push({ href: "/word-lab/", label: "Word Lab" });
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

function activeMainItem(pageHref = "/", itemHref = "/") {
  if (itemHref === "/") return pageHref === "/";
  if (itemHref === "/word-lab/" && pageHref.startsWith("/tools/")) return true;
  if (itemHref === "/word-explorer/" && pageHref.startsWith("/word/")) return true;
  return pageHref === itemHref || pageHref.startsWith(itemHref);
}

const TOOL_NAV_DESC = {
  "word-unscramble": "Make words from your letters",
  "anagram-solver": "Exact & partial anagrams",
  "rhyme-finder": "Perfect, near & slant rhymes",
  "syllable-counter": "Count beats in any text",
  "prefix-finder": "Words that start with…",
  "suffix-finder": "Words that end with…",
  "word-finder": "Words containing your letters",
  "synonym-finder": "Similar words, better choices",
  "antonym-finder": "Opposites & contrasts",
  "word-counter": "Words, characters & read time",
  "random-word-generator": "Fresh words for prompts & games",
};

function header(page = {}) {
  const currentHref = page.href || "/";
  const inGroup = (prefixes) => prefixes.some((p) => currentHref === p || currentHref.startsWith(p));
  const toolsActive = inGroup(["/tools/", "/word-lab/"]);
  const exploreActive = inGroup(["/word-explorer/", "/words/", "/word-lists/", "/word-games/", "/rhyming-words/", "/word/", "/word-lookup/"]);
  const learnActive = inGroup(["/guides/", "/learn-english/", "/vocabulary/", "/spelling-patterns/", "/writing-tools/", "/practice/"]);
  const aboutActive = inGroup(["/about/"]);

  const exploreLinks = [
    ["/word-explorer/", "Word Explorer", "In-depth word pages with meanings"],
    ["/words/", "Browse A–Z", "Recommended complete words by letter"],
    ["/word-lists/", "Word Lists", "Curated vocabulary collections"],
    ["/word-games/", "Word Games", "Helpers for every word game"],
    ["/rhyming-words/", "Rhyming Words", "Rhymes, near-rhymes & endings"],
  ];
  const learnLinks = [
    ["/learn-english/", "Learn English", "Vocabulary and word-skill guides"],
    ["/guides/", "Guides", "How the tools and words work"],
    ["/vocabulary/", "Vocabulary", "Build and retain new words"],
    ["/spelling-patterns/", "Spelling Patterns", "Common rules and patterns"],
    ["/writing-tools/", "Writing Tools", "Rhyme, rhythm & word choice"],
    ["/practice/", "Practice", "Quizzes to test yourself"],
  ];
  const menuLinks = (items) => items
    .map(([href, title, desc]) => `<a class="nav-menu-link" href="${href}" role="menuitem"><strong>${escapeHtml(title)}</strong><small>${escapeHtml(desc)}</small></a>`)
    .join("");
  const toolMega = tools
    .map((t) => `<a class="nav-mega-card" href="${t.href}" role="menuitem">
          <span class="nav-mega-icon">${icon(t.icon)}</span>
          <span class="nav-mega-text"><strong>${escapeHtml(t.title)}</strong><small>${escapeHtml(TOOL_NAV_DESC[t.id] || "")}</small></span>
        </a>`)
    .join("");

  const dropdown = (label, active, hasMenu, inner) => `<li class="nav-item${hasMenu ? " has-menu" : ""}">
        <button type="button" class="nav-link nav-trigger${active ? " is-current" : ""}" aria-expanded="false" aria-haspopup="true">${label} <span class="nav-caret">${icon("chevron")}</span></button>
        ${inner}
      </li>`;

  return `<header class="site-header" data-header>
  <a class="skip-link" href="#main">Skip to content</a>
  <div class="header-inner">
    <a class="brand" href="/" aria-label="Word Helper home">
      <span class="brand-mark">${icon("logo")}</span>
      <span class="brand-text"><strong>Word Helper</strong><small>The word workspace</small></span>
    </a>

    <nav class="site-nav" aria-label="Primary">
      <ul class="nav-list">
        ${dropdown("Tools", toolsActive, true, `<div class="nav-menu nav-mega" role="menu" aria-label="Word tools">
          <div class="nav-mega-grid">${toolMega}</div>
          <a class="nav-menu-foot" href="/word-lab/" role="menuitem">See all word tools <span>${icon("arrow")}</span></a>
        </div>`)}
        ${dropdown("Explore", exploreActive, true, `<div class="nav-menu" role="menu" aria-label="Explore">${menuLinks(exploreLinks)}</div>`)}
        ${dropdown("Learn", learnActive, true, `<div class="nav-menu" role="menu" aria-label="Learn">${menuLinks(learnLinks)}</div>`)}
        <li class="nav-item"><a class="nav-link${aboutActive ? " is-current" : ""}" href="/about/">About</a></li>
      </ul>
    </nav>

    <div class="header-actions">
      <form class="header-search" action="/search/" role="search" aria-label="Site search">
        <span class="header-search-icon">${icon("search")}</span>
        <label class="sr-only" for="header-q">Search Word Helper</label>
        <input id="header-q" name="q" type="search" autocomplete="off" placeholder="Search words…">
        <kbd class="header-search-kbd" aria-hidden="true">/</kbd>
        <button type="submit" class="sr-only">Search</button>
      </form>
      <button class="nav-toggle" type="button" aria-controls="mobile-nav" aria-expanded="false" aria-label="Open menu">
        <span class="sr-only">Menu</span><span></span><span></span><span></span>
      </button>
    </div>
  </div>

  <div class="mobile-nav" id="mobile-nav" hidden>
    <div class="mobile-nav-inner">
      <form class="header-search header-search-mobile" action="/search/" role="search" aria-label="Site search">
        <span class="header-search-icon">${icon("search")}</span>
        <label class="sr-only" for="m-q">Search Word Helper</label>
        <input id="m-q" name="q" type="search" autocomplete="off" placeholder="Search words or tools…">
        <button type="submit" class="button primary">Go</button>
      </form>
      <details class="mobile-group"${toolsActive ? " open" : ""}>
        <summary>Tools <span class="nav-caret">${icon("chevron")}</span></summary>
        <div class="mobile-group-links">${tools.map((t) => `<a href="${t.href}">${escapeHtml(t.title)}</a>`).join("")}<a class="mobile-group-all" href="/word-lab/">All word tools</a></div>
      </details>
      <details class="mobile-group"${exploreActive ? " open" : ""}>
        <summary>Explore <span class="nav-caret">${icon("chevron")}</span></summary>
        <div class="mobile-group-links">${exploreLinks.map(([h, t]) => `<a href="${h}">${escapeHtml(t)}</a>`).join("")}</div>
      </details>
      <details class="mobile-group"${learnActive ? " open" : ""}>
        <summary>Learn <span class="nav-caret">${icon("chevron")}</span></summary>
        <div class="mobile-group-links">${learnLinks.map(([h, t]) => `<a href="${h}">${escapeHtml(t)}</a>`).join("")}</div>
      </details>
      <a class="mobile-nav-link${aboutActive ? " is-current" : ""}" href="/about/">About</a>
    </div>
  </div>
</header>`;
}

function footer() {
  return `<footer class="site-footer">
  <div class="footer-inner">
    <div class="footer-brand-col">
      <a class="footer-brand" href="/">${icon("logo")}<span>Word Helper</span></a>
      <p class="footer-tagline">A fast word workspace — ${TOOL_COUNT} word tools, searchable word pages, word lists, and vocabulary practice for finding, exploring, and using words.</p>
      <a class="footer-email" href="mailto:${site.email}">${site.email}</a>
    </div>
    <nav class="footer-nav" aria-label="Word tools">
      <p class="footer-nav-title">Tools</p>
      <a href="/tools/word-unscramble/">Word Unscramble</a>
      <a href="/tools/anagram-solver/">Anagram Solver</a>
      <a href="/tools/rhyme-finder/">Rhyme Finder</a>
      <a href="/tools/syllable-counter/">Syllable Counter</a>
      <a href="/tools/prefix-finder/">Prefix Finder</a>
      <a href="/tools/suffix-finder/">Suffix Finder</a>
      <a class="footer-nav-more" href="/word-lab/">All tools</a>
    </nav>
    <nav class="footer-nav" aria-label="Content hubs">
      <p class="footer-nav-title">Hubs</p>
      <a href="/word-games/">Word Games</a>
      <a href="/writing-tools/">Writing Tools</a>
      <a href="/rhyming-words/">Rhyming Words</a>
      <a href="/vocabulary/">Vocabulary</a>
      <a href="/spelling-patterns/">Spelling Patterns</a>
      <a href="/guides/">Guides</a>
    </nav>
    <nav class="footer-nav" aria-label="Explore content">
      <p class="footer-nav-title">Explore</p>
      <a href="/word-explorer/">Word Explorer</a>
      <a href="/words/">Browse A–Z</a>
      <a href="/word-lists/">Word Lists</a>
      <a href="/learn-english/">Learn English</a>
      <a href="/practice/">Practice Quizzes</a>
      <a href="/search/">Search</a>
    </nav>
    <nav class="footer-nav" aria-label="Company and policies">
      <p class="footer-nav-title">Trust &amp; policies</p>
      <a href="/about/">About</a>
      <a href="/creator/">Creator: Jay Sudha</a>
      <a href="/editorial-team/">Editorial Team</a>
      <a href="/contact/">Contact</a>
      <a href="/corrections/">Corrections</a>
      <a href="/site-updates/">Site Updates</a>
      <a href="/editorial-policy/">Editorial Policy</a>
      <a href="/privacy-policy/">Privacy Policy</a>
      <a href="/terms/">Terms</a>
      <a href="/disclaimer/">Disclaimer</a>
      <a href="/cookie-policy/">Cookie Policy</a>
      <a href="/affiliate-disclosure/">Advertising Disclosure</a>
    </nav>
  </div>
  <div class="footer-bottom">
    <div class="footer-bottom-inner">
      <p>© ${new Date().getFullYear()} Word Helper — an independent word-tools project, created and maintained by <a href="/creator/">Jay Sudha</a>. Educational reference only — not an official dictionary.</p>
      <p class="footer-bottom-note">Built from open lexical data, cited word sources, quality checks, and practical word tools · <a href="/editorial-policy/">How we work &amp; sources</a> · <a href="/cookie-policy/">Cookie &amp; privacy info</a></p>
    </div>
  </div>
</footer>`;
}

function baseSchemas() {
  return [
    {
      "@type": "Organization",
      "@id": `${site.url}/#organization`,
      name: site.name,
      url: `${site.url}/`,
      logo: {
        "@type": "ImageObject",
        url: `${site.url}/og-image.png`,
        width: 1200,
        height: 630,
      },
      image: `${site.url}/og-image.png`,
      email: site.email,
      foundingDate: "2025",
      description:
        "Word Helper is a fast word workspace with " + TOOL_COUNT + " word tools, searchable word pages, curated word lists, and vocabulary practice — for finding, exploring, learning, and using words. Maintained by Word Helper.",
      publishingPrinciples: `${site.url}/editorial-policy/`,
      founder: {
        "@type": "Person",
        "@id": `${site.url}/creator/#person`,
        name: founder.name,
        alternateName: founder.fullName,
        url: `${site.url}/creator/`,
        sameAs: [founder.url],
      },
      knowsAbout: [
        "English vocabulary",
        "word games",
        "anagrams",
        "rhymes",
        "syllables",
        "spelling patterns",
        "etymology",
        "word definitions",
      ],
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "customer support",
        email: site.email,
        url: `${site.url}/contact/`,
        availableLanguage: "English",
      },
    },
    {
      "@type": "WebSite",
      name: site.name,
      url: `${site.url}/`,
      description: site.description,
      potentialAction: {
        "@type": "SearchAction",
        target: `${site.url}/search/?q={search_term_string}`,
        "query-input": "required name=search_term_string",
      },
    },
  ];
}

function head(page, extraSchemas = [], noindex = false) {
  const url = absolute(page.href);
  const title = page.metaTitle ?? page.title;
  const desc = page.metaDescription ?? site.description;
  const ogImage = `${site.url}/og-image.png`;
  const isWordPage = page.href?.startsWith("/word/");
  return `<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="color-scheme" content="light">
  <title>${escapeHtml(title)}</title>
  <meta name="description" content="${escapeHtml(desc)}">
  ${(() => {
    // Staging: block indexing site-wide. Production: per-page gate (thin pages noindex,follow).
    const r = !IS_PRODUCTION ? "noindex, nofollow" : (noindex ? "noindex, follow" : "");
    return r ? `<meta name="robots" content="${r}">` : "";
  })()}
  <link rel="canonical" href="${url}">
  ${page.relPrev ? `<link rel="prev" href="${page.relPrev}">` : ""}
  ${page.relNext ? `<link rel="next" href="${page.relNext}">` : ""}
  <link rel="icon" href="/favicon.svg" type="image/svg+xml">
  <link rel="apple-touch-icon" href="/apple-touch-icon.svg">
  <link rel="preload" href="/assets/fonts/inter.woff2" as="font" type="font/woff2" crossorigin>
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
  <meta name="theme-color" content="#faf8f3">
  ${isWordPage ? '<link rel="preconnect" href="https://api.dictionaryapi.dev">' : ""}
  <link rel="stylesheet" href="/assets/site.css?v=${assetVersion}">
  ${schemaScript([...baseSchemas(), ...extraSchemas])}
</head>`;
}

function layout(page, body, schemas = [], noindex = false) {
  return `<!doctype html>
<html lang="en">
${head(page, schemas, noindex)}
<body>
${header(page)}
<main id="main">
${body}
${pageNextRail(page)}
</main>
${footer()}
<button class="back-to-top" type="button" aria-label="Back to top" title="Back to top">${icon("arrow")}</button>
${(() => {
  // WS5 — JS diet: the dictionary + search index (~270 KB) load eagerly only on
  // pages that need them at render time (interactive tools, lookup, search results).
  // Everywhere else the header/hero search lazy-loads them on first focus (site.js).
  const href = page.href || "/";
  const heavyData = href.startsWith("/tools/") || href === "/search/" || href === "/word-lookup/";
  return heavyData
    ? `<script src="/assets/word-data.js?v=${assetVersion}" defer></script>\n<script src="/assets/search-data.js?v=${assetVersion}" defer></script>\n`
    : "";
})()}<script src="/assets/site.js?v=${assetVersion}" defer></script>
</body>
</html>`;
}

function answerBlock(text) {
  return `<section class="answer-block"><div>${icon("result")}</div><p>${escapeHtml(text)}</p></section>`;
}

// Ads are not active. Until they are, emit NOTHING — no empty, "Advertisement"-
// labelled placeholder ships in the DOM (AdSense reviewers and assistive tech
// should never see an announced ad region with no ad). When AdSense is approved,
// set ADS_ENABLED=1: this then emits the reserved, CLS-safe slot, ready to hold
// the AdSense <ins> + data-ad-active (CSS reserves min-height, so no layout shift).
// See docs/adsense-readiness.md for the activation + placement checklist.
const ADS_ENABLED = process.env.ADS_ENABLED === "1";
function adSlot(id, label = "Advertisement") {
  if (!ADS_ENABLED) return "";
  return `<aside class="ad-slot" data-ad-slot="${escapeHtml(id)}" aria-label="${escapeHtml(label)}"></aside>`;
}

function cardLink(href, text = "") {
  const tool = toolByHref.get(href);
  const page = pageByHref.get(href);
  const item = tool ?? page;
  const itemIcon = tool?.icon ?? page?.icon ?? "tools";
  const label = item?.title ?? linkLabel(href);
  const description =
    tool?.intro ??
    page?.answer ??
    text ??
    "Open this Word Helper resource.";
  return `<a class="resource-card" href="${href}" aria-label="Open ${escapeHtml(label)}">
    <span class="card-icon">${icon(itemIcon)}</span>
    <strong>${escapeHtml(label)}</strong>
    <span>${escapeHtml(description)}</span>
    <span class="resource-card-action">Open ${icon("arrow")}</span>
  </a>`;
}

function toolCard(tool) {
  const example = tool.examples?.[0];
  return `<a class="resource-card tool-card-premium" href="${tool.href}" aria-label="Open ${escapeHtml(tool.title)}">
    <span class="card-icon">${icon(tool.icon)}</span>
    <strong>${escapeHtml(tool.title)}</strong>
    <span>${escapeHtml(tool.intro)}</span>
    ${example ? `<small class="example-query">Example: ${escapeHtml(example.label)}</small>` : ""}
    <span class="resource-card-action">${escapeHtml(tool.buttonLabel)} ${icon("arrow")}</span>
  </a>`;
}

function pageNextItems(page = {}) {
  const href = page.href || "/";
  if (href === "/" || href === "/404/") return [];

  const items = [];
  const add = (item) => {
    if (!item?.href || item.href === href || items.some((existing) => existing.href === item.href)) return;
    items.push(item);
  };

  if (href.startsWith("/word/")) {
    const letter = (page.title || "").trim().charAt(0).toLowerCase();
    if (/^[a-z]$/.test(letter)) {
      add({
        href: `/word-explorer/${letter}/`,
        icon: "az",
        label: `More ${letter.toUpperCase()} words`,
        text: "Browse nearby word cards.",
      });
    }
  } else if (href.startsWith("/tools/")) {
    add({ href: "/word-lab/", icon: "wordlab", label: "All tools", text: "Switch to another word tool." });
  } else if (href.startsWith("/learn-english/")) {
    add({ href: "/word-lists/", icon: "wordlists", label: "Word lists", text: "Study themed vocabulary collections." });
  } else if (href.startsWith("/word-lists/")) {
    add({ href: "/learn-english/", icon: "learn", label: "Learn guides", text: "Build the skill behind the words." });
  } else if (href.startsWith("/practice/")) {
    add({ href: "/word-explorer/", icon: "wordexplorer", label: "Review words", text: "Open definitions before the next quiz." });
  } else if (href.startsWith("/word-explorer/")) {
    add({ href: "/practice/", icon: "practice", label: "Practice words", text: "Turn browsing into recall." });
  }

  add({ href: "/#word-command", icon: "search", label: "Search anything", text: "Find a word, tool, list, or guide." });
  add({ href: "/word-lab/", icon: "wordlab", label: "Tools", text: "Solve letters, rhymes, syllables, prefixes, and suffixes." });
  add({ href: "/word-explorer/", icon: "wordexplorer", label: "Word Explorer", text: "Browse definitions, examples, synonyms, and antonyms." });
  add({ href: "/practice/", icon: "practice", label: "Practice", text: "Quiz yourself with Word Helper data." });

  return items.slice(0, 4);
}

function pageNextRail(page = {}) {
  const items = pageNextItems(page);
  if (!items.length) return "";

  return `<section class="page-next" aria-labelledby="page-next-title">
    <div class="page-next-inner">
      <div>
        <p class="eyebrow">Next steps</p>
        <h2 id="page-next-title">Keep going</h2>
      </div>
      <nav class="page-next-links" aria-label="Recommended next pages">
        ${items
          .map(
            (item) => `<a class="page-next-link" href="${item.href}">
          <span>${icon(item.icon)}</span>
          <strong>${escapeHtml(item.label)}</strong>
          <small>${escapeHtml(item.text)}</small>
        </a>`,
          )
          .join("")}
      </nav>
    </div>
  </section>`;
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

function slugify(value = "") {
  return String(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

// Indefinite article for a following word/POS label (vowel-initial → "an").
function indefinite(word = "") {
  return /^[aeiou]/i.test(String(word).trim()) ? "an" : "a";
}
// Grammatical POS phrase: "a noun" / "an adjective" / "an English word".
// Uses the first part of a compound label ("noun, verb" → "a noun").
function posPhrase(pos = "") {
  if (!pos || pos === "word") return "an English word";
  const first = String(pos).split(/[,/]/)[0].trim() || "word";
  return `${indefinite(first)} ${first}`;
}

function reviewedMeta(label = "Quality-checked") {
  return `<div class="article-meta">
    <span>${icon("check")} ${escapeHtml(label)}</span>
    <span>Updated ${new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
    <span>Maintained by Word Helper</span>
  </div>`;
}

// Brand-level editorial byline — real, accountable, no invented individual names.
function editorialByline() {
  // Derive the displayed date from buildDateISO so the visible date and the
  // machine-readable <time datetime> never diverge.
  const shown = new Date(buildDateISO + "T00:00:00Z").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });
  return `<div class="article-meta editorial-byline">
    <span>${icon("check")} Compiled &amp; quality-checked by <a href="/editorial-policy/">Word Helper</a></span>
    <span>Last updated <time datetime="${buildDateISO}">${shown}</time></span>
  </div>`;
}

function tableOfContents(sections = []) {
  if (sections.length < 2) return "";
  return `<nav class="toc-card" aria-label="Table of contents">
    <strong>On this page</strong>
    ${sections.map((section) => `<a href="#${slugify(section.heading)}">${escapeHtml(section.heading)}</a>`).join("")}
  </nav>`;
}

function renderSearchPage() {
  const page = {
    href: "/search/",
    title: "Search Word Helper",
    metaTitle: "Search Word Helper - Find Tools, Word Lists, Guides, and Words",
    metaDescription:
      "Search Word Helper for word tools, word game helpers, rhyming pages, vocabulary guides, spelling patterns, word lists, and word pages.",
  };
  const suggestions = [
    "Unscramble letters",
    "Words ending in ing",
    "Rhymes with love",
    "5 letter words",
    "Count syllables",
    "Words starting with pre",
  ];
  const body = `<section class="page-hero search-page-hero">
    ${breadcrumb(page)}
    <p class="eyebrow">Site search</p>
    <h1>Search Word Helper</h1>
    <p class="hero-lede">Find word tools, rhyming resources, vocabulary guides, spelling patterns, word lists, and in-depth word pages across Word Helper.</p>
    <form class="global-search command-search search-page-form" aria-label="Search Word Helper">
      <div class="global-search-inner">
        <span class="search-icon">${icon("search")}</span>
        <label class="sr-only" for="search-page-q">Search Word Helper</label>
        <input id="search-page-q" name="q" type="search" autocomplete="off" spellcheck="false" placeholder="Try: rhymes with love, suffix ing, syllables, or beautiful">
        <button type="submit" class="button primary">Search</button>
      </div>
      <div class="search-suggestions" hidden></div>
    </form>
    <div class="suggested-searches" aria-label="Suggested searches">
      ${suggestions.map((item) => `<a href="/search/?q=${encodeURIComponent(item)}">${escapeHtml(item)}</a>`).join("")}
    </div>
  </section>
  <section class="section search-results-section" aria-labelledby="search-results-title">
    <div class="section-heading">
      <p class="eyebrow">Results</p>
      <h2 id="search-results-title">Search results</h2>
      <p id="search-results-summary">Enter a word, tool name, topic, prefix, suffix, rhyme query, or guide topic above.</p>
    </div>
    <div id="search-results" class="search-result-grid">
      <div class="empty-state">
        <span class="card-icon">${icon("search")}</span>
        <h3>Start with a word or task</h3>
        <p>Try "anagram", "rhymes with time", "words ending ing", "prefix pre", or the word you want to explore.</p>
      </div>
    </div>
  </section>
  <section class="section">
    <div class="section-heading">
      <p class="eyebrow">Browse by category</p>
      <h2>What you can find on Word Helper</h2>
    </div>
    <div class="card-grid">
      <a class="resource-card" href="/word-lab/"><span class="card-icon">${icon("wordlab")}</span><strong>Word Lab — ${TOOL_COUNT} Tools</strong><span>Unscramble, anagrams, rhymes, syllables, prefixes, suffixes, plus word, synonym &amp; antonym finders, a word counter, and a random word generator.</span></a>
      <a class="resource-card" href="/word-explorer/"><span class="card-icon">${icon("wordexplorer")}</span><strong>Word Explorer — Word Pages</strong><span>Browse A–Z word pages with definitions, pronunciation, synonyms, examples, and word families.</span></a>
      <a class="resource-card" href="/word-lists/"><span class="card-icon">${icon("wordlists")}</span><strong>Word Lists</strong><span>Curated vocabulary collections for common words, positive language, academic English, and more.</span></a>
      <a class="resource-card" href="/learn-english/"><span class="card-icon">${icon("learn")}</span><strong>Learn English Guides</strong><span>Plain-language guides on vocabulary, word roots, syllables, spelling patterns, and memory techniques.</span></a>
      <a class="resource-card" href="/guides/"><span class="card-icon">${icon("guides")}</span><strong>Tool Guides</strong><span>How to use Word Helper tools for word games, poetry, lyrics, and vocabulary learning.</span></a>
      <a class="resource-card" href="/practice/"><span class="card-icon">${icon("practice")}</span><strong>Practice Quizzes</strong><span>Vocabulary quiz, word family quiz, and synonym match — built from Word Explorer data.</span></a>
    </div>
  </section>`;
  const searchFaqs = [
    {
      q: "What can I search for on Word Helper?",
      a: "You can search for word tool pages (unscramble, anagram, rhyme, syllable, prefix, suffix), word explorer pages for specific words, learning guides, word lists by theme, and the practice quizzes. Type a word, a tool name, a topic, or a query like 'rhymes with love' or 'words ending in tion'.",
    },
    {
      q: "How do I find rhymes for a word on Word Helper?",
      a: "Go to the Rhyme Finder tool and enter your word. You can also type 'rhymes with [word]' into this search to surface the Rhyme Finder and the rhyme guides.",
    },
    {
      q: "How do I unscramble letters on Word Helper?",
      a: "Use the Word Unscramble tool. Enter your letters, optionally add filters like starts-with or word length, and the tool returns all valid words that can be built from those exact letters.",
    },
    {
      q: "Where can I find word meanings and definitions?",
      a: "Visit Word Explorer and browse by letter, or search for a specific word on this page. Word pages include a definition, pronunciation or syllables, synonyms, antonyms, related words, and examples — with word family, etymology, and rhymes shown where that data is available.",
    },
  ];

  const schemas = [
    {
      "@type": "SearchResultsPage",
      name: page.title,
      url: absolute(page.href),
      description: page.metaDescription,
    },
    breadcrumbSchema(page),
    faqSchema(searchFaqs),
  ];
  // Internal site-search UI is reachable + crawlable but not a destination page:
  // noindex,follow keeps it out of the index and the sitemap (search/filter pages
  // should never be submitted for indexing).
  return { href: page.href, html: layout(page, body + faqList(searchFaqs), schemas, true), noindex: true };
}

function compactNumber(value = 0) {
  if (value >= 1000000) return `${Math.round(value / 1000000)}m`;
  if (value >= 1000) return `${Math.round(value / 1000)}k`;
  return String(value);
}

function formatCount(value = 0) {
  return Number(value).toLocaleString("en-US");
}

function renderHome(homeWords = words) {
  const page = {
    href: "/",
    title: "Word Helper — Word Tools, Definitions, Synonyms, Rhymes & Vocabulary Help",
    metaTitle: "Word Helper — Word Tools, Definitions, Synonyms, Rhymes & Vocabulary Help",
    metaDescription: "Find definitions, synonyms, antonyms, examples, rhymes, anagrams, and syllables, browse word lists, and practise vocabulary with " + TOOL_COUNT + " fast word tools on Word Helper.",
  };
  const wordPageTotal = homeWords.length;
  const azLinks = "abcdefghijklmnopqrstuvwxyz".split("").map((letter) =>
    `<a class="home-az-link" href="/words/${letter}/" aria-label="Words starting with ${letter.toUpperCase()}">
        <strong>${letter.toUpperCase()}</strong>
      </a>`
  ).join("");
  const quickLinks = [
    {
      href: "/words/",
      icon: "az",
      label: "Browse A-Z",
      detail: "Recommended words by letter",
    },
    {
      href: "/tools/word-unscramble/",
      icon: "unscramble",
      label: "Unscramble",
      detail: "letters to words",
    },
    {
      href: "/word-explorer/",
      icon: "wordexplorer",
      label: "Meanings",
      detail: "definition pages",
    },
    {
      href: "/practice/",
      icon: "practice",
      label: "Practice",
      detail: "quiz your vocabulary",
    },
  ];
  const faqs = [
    {
      q: "What is Word Helper?",
      a: "Word Helper is a fast word workspace for finding, exploring, learning, and using words. It includes Word Lab (" + TOOL_COUNT + " interactive word tools), Word Explorer (in-depth word pages with definitions, examples, synonyms, and related words), Learn English guides, curated Word Lists, and Practice quizzes.",
    },
    {
      q: "What is Word Explorer?",
      a: "Word Explorer is Word Helper's word-page workspace. It opens useful word profiles with meanings, pronunciation, syllables, examples, synonyms, antonyms, rhymes, and related word paths. Pages may include definitions, examples, pronunciation, syllables, synonyms, antonyms, rhymes, related words, and source notes depending on available data — compiled from open lexical sources (Wiktionary via the Datamuse API, plus the Free Dictionary API), then standardized and quality-screened. See the Editorial Policy for full sourcing.",
    },
    {
      q: "How many words does Word Helper cover?",
      a: `Word Helper's word tools — the unscramble, anagram, and finder tools — match against an in-browser dictionary of ${TOOL_DICT_COUNT.toLocaleString()} English words, drawn from a 327,000-entry open source inventory. In-depth word pages are published only when they pass the quality gate (a complete definition, pronunciation, examples, synonyms, and word family); the published set is currently ${formatCount(wordPageTotal)} pages and grows regularly. The on-site search covers these published pages plus the tools, guides, and word lists.`,
    },
    {
      q: "Which Word Lab tool should I use for scrambled letters?",
      a: "Use Word Unscramble when you want all valid words that can be built from the letters you have. Use Anagram Solver for exact or partial anagrams.",
    },
    {
      q: "Can Word Helper help writers?",
      a: "Yes. Writers can use Word Lists for vivid adjectives and strong verbs, Word Explorer for precise word meanings, Rhyme Finder for end rhymes, Syllable Counter for rhythm and meter, and the Learn English guides for writing strategies.",
    },
    {
      q: "How do I get started with Word Helper?",
      a: "Search any word to open its full definition page, or choose a tool from the navigation. The word tools, word pages, guides, word lists, and practice quizzes all work directly in your browser with no setup needed.",
    },
  ];
  // Word of the Day — rotates by day of year
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
  const wotd = words[dayOfYear % words.length];
  const showcaseTargets = ["abundant", "achieve", "admire", "aware", "azure", "aloha", "account", "absorb", "ancient", "abandon"];
  const featuredWords = showcaseTargets
    .map(target => homeWords.find(w => w.word === target))
    .filter(w => w && w.word !== wotd.word)
    .slice(0, 6);

  const body = `<div class="home">
  <div class="home-hero-band">
  <section class="hero hero-search" id="word-command">
    <div class="hero-copy">
      <p class="eyebrow hero-eyebrow">${icon("globe")} A complete word workspace</p>
      <h1>Find the right word, faster.</h1>
      <p class="hero-lede">Unscramble letters, explore meanings, discover rhymes, browse word lists, practise vocabulary, and use simple word tools from one clean workspace.</p>
      <form class="global-search command-search hero-command-box" data-multimode="true" data-word-pages='${JSON.stringify(words.map((w) => w.word))}' aria-label="Search a word or run a word tool">
        <div class="hero-search-field">
          <div class="global-search-inner">
            <span class="search-icon">${icon("search")}</span>
            <label class="sr-only" for="global-q">Search a word or enter input for the selected tool</label>
            <input id="global-q" name="q" type="search" autocomplete="off" spellcheck="false" placeholder="Search a word — e.g. resilient, ephemeral, candid">
            <button type="submit" class="button primary" data-submit-label>Look up</button>
          </div>
          <div class="search-suggestions" id="search-suggestions" hidden></div>
        </div>
        <div class="hero-modes" role="tablist" aria-label="Choose what to do with your input">
          <button type="button" class="hero-mode is-active" role="tab" aria-selected="true" data-mode="define" data-route="/word/" data-param="path" data-submit="Look up" data-placeholder="Search a word — e.g. resilient, ephemeral, candid" data-hint="Definition, pronunciation, synonyms, etymology &amp; syllables for any English word.">Define</button>
          <button type="button" class="hero-mode" role="tab" aria-selected="false" tabindex="-1" data-mode="unscramble" data-route="/tools/word-unscramble/" data-param="q" data-submit="Unscramble" data-placeholder="Enter your letters — e.g. tarpels" data-hint="Find every valid word you can build from the letters you have.">Unscramble</button>
          <button type="button" class="hero-mode" role="tab" aria-selected="false" tabindex="-1" data-mode="anagram" data-route="/tools/anagram-solver/" data-param="q" data-submit="Solve" data-placeholder="Enter letters or a word — e.g. listen" data-hint="Find exact anagrams and smaller words hidden inside your letters.">Anagram</button>
          <button type="button" class="hero-mode" role="tab" aria-selected="false" tabindex="-1" data-mode="rhyme" data-route="/tools/rhyme-finder/" data-param="q" data-submit="Find rhymes" data-placeholder="Enter a word to rhyme — e.g. light" data-hint="Perfect rhymes, near rhymes, and similar-ending words.">Rhymes</button>
          <button type="button" class="hero-mode" role="tab" aria-selected="false" tabindex="-1" data-mode="syllables" data-route="/tools/syllable-counter/" data-param="q" data-submit="Count" data-placeholder="Enter a word, line, or paragraph" data-hint="Count syllables with a word-by-word breakdown based on standard English pronunciation; regional accents may differ.">Syllables</button>
          <button type="button" class="hero-mode" role="tab" aria-selected="false" tabindex="-1" data-mode="prefix" data-route="/tools/prefix-finder/" data-param="q" data-submit="Find" data-placeholder="Enter starting letters — e.g. pre" data-hint="Find words that begin with the exact letters you type.">Prefix</button>
          <button type="button" class="hero-mode" role="tab" aria-selected="false" tabindex="-1" data-mode="suffix" data-route="/tools/suffix-finder/" data-param="q" data-submit="Find" data-placeholder="Enter ending letters — e.g. ing" data-hint="Find words that end with the exact letters you type.">Suffix</button>
        </div>
        <p class="search-hint" data-mode-hint>Definition, pronunciation, synonyms, etymology &amp; syllables for any English word.</p>
      </form>
      <ul class="hero-trust-row">
        <li>${icon("check")} <span>${formatCount(wordPageTotal)} word pages</span></li>
        <li>${icon("check")} <span>${toolDictLabel()}-word tool dictionary</span></li>
        <li>${icon("check")} <span>${TOOL_COUNT} word tools &amp; quizzes</span></li>
        <li>${icon("check")} <span>Open sources, cited</span></li>
        <li>${icon("check")} <span>Built by <a href="/creator/">Jay Sudha</a></span></li>
      </ul>
    </div>
  </section>
  </div>
  <section class="section home-tools-section">
    <div class="section-heading">
      <p class="eyebrow">Word tools</p>
      <h2>${TOOL_COUNT} focused tools for everyday word problems</h2>
      <p>Each tool keeps quick tasks fast — clear inputs, real-time filters, worked examples, and honest notes on how results vary across word-game dictionaries, accents, and classroom rules.</p>
    </div>
    <div class="card-grid tool-card-grid">
      ${tools.map((tool) => toolCard(tool)).join("")}
    </div>
  </section>
  <section class="section wotd-section" aria-labelledby="wotd-heading">
    <div class="section-heading">
      <p class="eyebrow">${icon("spark")} Word of the Day</p>
      <h2 id="wotd-heading">Today's word to learn</h2>
    </div>
    <div class="wotd-layout">
      <div class="wotd-card">
        <div class="wotd-header">
          <span class="wotd-label">Word of the Day</span>
          <span class="pos-badge pos-${posClassOf(wotd.partOfSpeech)}">${escapeHtml(wotd.partOfSpeech)}</span>
        </div>
        <a class="wotd-word" href="${wotd.href}">${escapeHtml(wotd.word)}</a>
        <div class="wotd-phonetics">
          <span class="pronunciation">${escapeHtml(wotd.pronunciation)}</span>
          <span class="syllable-break">${escapeHtml(wotd.syllableBreak)}</span>
        </div>
        <p class="wotd-def">${escapeHtml(wotd.shortDef)}</p>
        ${wotd.etymology ? `<div class="wotd-etymology"><span class="wotd-etym-label">Origin</span><p>${escapeHtml(wotd.etymology.slice(0, 140))}${wotd.etymology.length > 140 ? "…" : ""}</p></div>` : ""}
        <div class="wotd-synonyms">
          <span class="wotd-syn-label">Synonyms</span>
          <div class="wotd-syn-pills">
            ${(wotd.synonyms || []).slice(0, 4).map(s => wordPill(s)).join("")}
          </div>
        </div>
        <a class="button primary wotd-cta" href="${wotd.href}">See full entry ${icon("arrow")}</a>
      </div>
      <div class="wotd-quick-explore">
        <a class="wotd-explore-link" href="/word-explorer/a/">${icon("az")}<div><strong>A–Z Explorer</strong><small>${formatCount(wordPageTotal)} word pages</small></div></a>
        <a class="wotd-explore-link" href="/practice/vocabulary-quiz/">${icon("practice")}<div><strong>Vocabulary Quiz</strong><small>Test your knowledge</small></div></a>
        <a class="wotd-explore-link" href="/word-lists/">${icon("wordlists")}<div><strong>Word Lists</strong><small>Curated collections</small></div></a>
      </div>
    </div>
  </section>
  <section class="section home-paths-section" aria-labelledby="paths-heading">
    <div class="section-heading">
      <p class="eyebrow">${icon("spark")} Find your starting point</p>
      <h2 id="paths-heading">Word Helper for every word task</h2>
    </div>
    <div class="intent-grid">
      <a class="intent-card" href="/tools/word-unscramble/">
        <span>${icon("unscramble")}</span>
        <strong>Word game players</strong>
        <small>Unscramble letters, solve anagrams, find words by prefix or suffix, and build game vocabulary.</small>
      </a>
      <a class="intent-card" href="/tools/rhyme-finder/">
        <span>${icon("rhyme")}</span>
        <strong>Writers</strong>
        <small>Find rhymes, count syllables, pick better synonyms, and explore word lists for stronger writing.</small>
      </a>
      <a class="intent-card" href="/word-explorer/">
        <span>${icon("wordexplorer")}</span>
        <strong>English learners</strong>
        <small>Look up full word meanings, study vocabulary lists, take practice quizzes, and read learning guides.</small>
      </a>
      <a class="intent-card" href="/word-lists/academic-words/">
        <span>${icon("learn")}</span>
        <strong>Students &amp; teachers</strong>
        <small>Academic vocabulary, study word lists, pronunciation guides, and vocabulary quizzes for classroom use.</small>
      </a>
    </div>
  </section>
  <div id="recent-tools-section" class="section recent-section" hidden aria-live="polite">
    <div class="section-heading">
      <p class="eyebrow">Remembered from your last visit</p>
      <h2 id="recent-tools-heading">Recently used</h2>
    </div>
    <div id="recent-tools-list" class="card-grid"></div>
  </div>
  <section class="section home-az-section">
    <div class="section-heading">
      <p class="eyebrow">Browse words A&ndash;Z</p>
      <h2>Explore words A to Z</h2>
      <p>Every letter opens word pages with part of speech, definition, example sentences, synonyms, and antonyms.</p>
    </div>
    <div class="home-az-grid" aria-label="Browse words by starting letter">${azLinks}</div>
  </section>
  <section class="section">
    <div class="section-heading">
      <p class="eyebrow">Word Explorer</p>
      <h2>Word pages built for discovery</h2>
      <p>Word Explorer opens useful word profiles with meanings, pronunciation, syllables, examples, synonyms, antonyms, rhymes, and related word paths. Word pages may include these sections depending on the data available for each word.</p>
    </div>
    <div class="word-explorer-grid home-word-grid">
      ${featuredWords.map((w) => renderWordCard(w)).join("")}
    </div>
    <div class="section-actions">
      <a class="button secondary" href="/word-explorer/">Browse all word pages ${icon("arrow")}</a>
    </div>
  </section>
  <section class="section">
    <div class="section-heading">
      <p class="eyebrow">Word Lists</p>
      <h2>Curated vocabulary collections</h2>
      <p>Hand-curated word lists covering common words, positive vocabulary, academic language, writing tools, and more — each with meanings and examples.</p>
    </div>
    <div class="lesson-grid">
      ${wordLists.slice(0, 4).map((l) => `<a class="resource-card lesson-card" href="${l.href}">
        <strong class="lesson-card-title">${escapeHtml(l.title)}</strong>
        <span class="lesson-card-intro">${escapeHtml(l.intro)}</span>
      </a>`).join("")}
    </div>
    <div class="section-actions">
      <a class="button secondary" href="/word-lists/">Browse all word lists ${icon("arrow")}</a>
    </div>
  </section>
  <section class="section">
    <div class="section-heading">
      <p class="eyebrow">Learn English</p>
      <h2>Vocabulary guides for every level</h2>
      <p>Plain-English guides on vocabulary strategies, word roots, syllables, spelling patterns, and memory techniques.</p>
    </div>
    <div class="lesson-grid">
      ${lessons.slice(0, 4).map((l) => `<a class="resource-card lesson-card" href="${l.href}">
        <strong class="lesson-card-title">${escapeHtml(l.title)}</strong>
        <span class="lesson-card-intro">${escapeHtml(l.intro)}</span>
      </a>`).join("")}
    </div>
    <div class="section-actions">
      <a class="button secondary" href="/learn-english/">Browse all guides ${icon("arrow")}</a>
    </div>
  </section>
  <section class="section">
    <div class="section-heading">
      <p class="eyebrow">Practice</p>
      <h2>Test your word knowledge</h2>
      <p>Vocabulary quizzes powered by Word Explorer data. See a definition, pick the right word. Fast, calm, and mobile-friendly.</p>
    </div>
    <div class="card-grid">
      <a class="resource-card" href="/practice/vocabulary-quiz/">
        <span class="card-icon">${icon("practice")}</span>
        <strong>Vocabulary Quiz</strong>
        <span>See a definition, pick the right word. Four choices, instant feedback, covers ${QUIZ_WORD_COUNT} curated Word Explorer words.</span>
      </a>
      <a class="resource-card" href="/practice/word-family-quiz/">
        <span class="card-icon">${icon("wordexplorer")}</span>
        <strong>Word Family Quiz</strong>
        <span>Given a root word, choose the correct related form — tests whether you grasp how word families work.</span>
      </a>
      <a class="resource-card" href="/practice/synonym-match/">
        <span class="card-icon">${icon("rhyme")}</span>
        <strong>Synonym Matching</strong>
        <span>Match a word to its closest synonym. Builds vocabulary breadth and helps with nuance between near-synonyms.</span>
      </a>
    </div>
  </section>
  ${adSlot("home-mid")}
  <section class="section home-trust-section">
    <div class="editorial-standards-card">
      <div class="editorial-standards-head">
        <span class="card-icon">${icon("check")}</span>
        <div>
          <p class="eyebrow">Why trust Word Helper</p>
          <h2>Useful, honest, and quality-gated</h2>
        </div>
      </div>
      <dl class="home-stat-strip">
        <div class="home-stat" title="${TOOL_DICT_COUNT.toLocaleString()}-word in-browser dictionary powering the unscramble, anagram, and finder tools — drawn from a 327,000-entry open source inventory"><dt>${toolDictLabel()}</dt><dd>words in the tool dictionary</dd></div>
        <div class="home-stat" title="${formatCount(wordPageTotal)} words that passed the quality gate with a full page: definition, pronunciation, examples, and synonyms"><dt>${formatCount(wordPageTotal)}</dt><dd>full word pages</dd></div>
        <div class="home-stat"><dt>${TOOL_COUNT}</dt><dd>focused word tools</dd></div>
        <div class="home-stat"><dt>${lessons.length}</dt><dd>vocabulary guides</dd></div>
      </dl>
      <div class="editorial-standards-grid">
        <div><strong>Open word sources</strong><p>Definitions, pronunciations, and related words are compiled from open, openly-licensed lexical data — Wiktionary (via the Datamuse API) and the Free Dictionary API — plus the public-domain ENABLE word list. Every source is credited in the editorial policy.</p></div>
        <div><strong>Quality-gated word pages</strong><p>A word earns a full, indexable page only when it has enough useful detail — a definition, examples, pronunciation or syllables, synonyms, and related or word-family data. Thin entries are kept out of search.</p></div>
        <div><strong>Correction-first editorial process</strong><p>Spotted something wrong? Every page links to a correction path. Reported issues are reviewed and fixed, and pages are expanded and updated over time.</p></div>
        <div><strong>Runs in your browser</strong><p>Most word tools process your letters and text locally in your browser — your input is not uploaded to a Word Helper server. No account or sign-up is needed. See the <a href="/privacy-policy/">privacy policy</a> for the few tools that look words up via an open API.</p></div>
      </div>
      <a class="button secondary" href="/editorial-policy/">Read the editorial policy ${icon("arrow")}</a>
    </div>
  </section>
  ${faqList(faqs)}
</div>`;
  // Organization + WebSite (with SearchAction) come from baseSchemas() once, in head().
  // Homepage adds only the page-specific WebPage + FAQPage (no duplicate Org/WebSite,
  // no self-referential sameAs).
  const schemas = [
    {
      "@type": "WebPage",
      name: page.title,
      url: absolute(page.href),
      description: page.metaDescription,
      dateModified: buildDateISO,
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
      <label>Sort results <select name="sort"><option value="length-desc">Longest first</option><option value="length-asc">Shortest first</option><option value="alpha">A to Z</option></select></label>
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
      <label>Sort results <select name="sort"><option value="alpha">A to Z</option><option value="length-asc">Shortest first</option><option value="length-desc">Longest first</option></select></label>
    </div>`;
  }
  if (tool.id === "word-finder") {
    return `<label>Letters the word must contain <input name="contains" autocomplete="off" placeholder="Example: ae" inputmode="text"></label>
    <div class="filter-grid">
      <label>Starts with <input name="starts" autocomplete="off" placeholder="s"></label>
      <label>Ends with <input name="ends" autocomplete="off" placeholder="t"></label>
      <label>Minimum length <input name="min" type="number" min="2" max="20" placeholder="2"></label>
      <label>Maximum length <input name="max" type="number" min="2" max="20" placeholder="20"></label>
      <label>Sort results <select name="sort"><option value="length-desc">Longest first</option><option value="length-asc">Shortest first</option><option value="alpha">A to Z</option></select></label>
    </div>`;
  }
  if (tool.id === "synonym-finder" || tool.id === "antonym-finder") {
    return `<label>Word <input name="word" autocomplete="off" placeholder="Example: ${tool.id === "antonym-finder" ? "open" : "happy"}" inputmode="text"></label>`;
  }
  if (tool.id === "word-counter") {
    return `<label>Text to count <textarea name="text" rows="7" placeholder="Paste or type your text here"></textarea></label>`;
  }
  if (tool.id === "random-word-generator") {
    return `<label>How many words <input name="count" type="number" min="1" max="50" value="10" inputmode="numeric"></label>
    <div class="filter-grid">
      <label>Starts with <input name="starts" autocomplete="off" placeholder="any"></label>
      <label>Minimum length <input name="min" type="number" min="2" max="20" placeholder="2"></label>
      <label>Maximum length <input name="max" type="number" min="2" max="20" placeholder="20"></label>
    </div>`;
  }
  return `<label>Suffix or ending letters <input name="suffix" autocomplete="off" placeholder="Example: ing" inputmode="text"></label>
    <div class="filter-grid">
      <label>Minimum length <input name="min" type="number" min="2" max="14" placeholder="2"></label>
      <label>Maximum length <input name="max" type="number" min="2" max="14" placeholder="14"></label>
      <label>Sort results <select name="sort"><option value="alpha">A to Z</option><option value="length-asc">Shortest first</option><option value="length-desc">Longest first</option></select></label>
    </div>`;
}

function toolReferencePanel(tool) {
  const notes = {
    "word-unscramble": [
      ["Wildcards", "? or * can stand in for one unknown letter."],
      ["Filters", "Starts with, ends with, contains, and length filters help match board clues."],
      ["Result grouping", "Results are grouped by word length so long playable words are easy to scan."],
    ],
    "anagram-solver": [
      ["Exact anagram", "Uses every letter once, such as listen becoming silent."],
      ["Partial anagram", "Finds smaller valid words inside the same letters."],
      ["Phrase handling", "Spaces and punctuation are ignored before matching."],
    ],
    "rhyme-finder": [
      ["Perfect rhymes", "Closest available ending-sound matches."],
      ["Near and slant rhymes", "Useful when a perfect rhyme sounds forced."],
      ["Multi-syllable ideas", "Longer rhyme candidates can help lyrics, poetry, and captions."],
    ],
    "syllable-counter": [
      ["Count", "Shows total syllables plus a word-by-word breakdown."],
      ["Division", "Adds a pronunciation-style division to help with rhythm drafting."],
      ["Variation", "Accent, dialect, and poetic usage can change the final count."],
    ],
    "prefix-finder": [
      ["Common meanings", "pre- often means before, re- often means again, un- often means not, and mis- often means wrongly."],
      ["Letter matching", "The tool matches starting letters exactly; not every match is a meaning-based prefix."],
      ["Best use", "Good for vocabulary families, spelling patterns, and word-game starts-with clues."],
    ],
    "suffix-finder": [
      ["Common functions", "-ing often marks action, -less means without, -tion forms nouns, and -able can mean capable of."],
      ["Letter matching", "The tool matches ending letters exactly; not every match is a grammar suffix."],
      ["Best use", "Good for spelling endings, vocabulary families, and word-game ends-with clues."],
    ],
  };
  const rows = notes[tool.id] || [];
  if (!rows.length) return "";
  return `<section class="section tool-reference-grid" aria-labelledby="${tool.id}-reference-title">
    <div class="section-heading">
      <p class="eyebrow">Reference</p>
      <h2 id="${tool.id}-reference-title">What to know before you use it</h2>
    </div>
    <div class="mini-card-grid">
      ${rows.map(([label, text]) => `<article class="mini-card"><strong>${escapeHtml(label)}</strong><p>${escapeHtml(text)}</p></article>`).join("")}
    </div>
  </section>`;
}

function workedExamples(tool) {
  if (!tool.examples?.length) return "";
  return `<section class="section">
    <div class="section-heading">
      <p class="eyebrow">Examples</p>
      <h2>Worked examples</h2>
      <p>Use these sample inputs to understand the result style before you search your own word or letters.</p>
    </div>
    <div class="mini-card-grid">
      ${tool.examples
        .map(
          (example) => `<article class="mini-card example-card">
            <span class="example-query">${escapeHtml(example.label)}</span>
            <p>${escapeHtml(example.note)}</p>
            <a href="${tool.href}?q=${encodeURIComponent(example.value)}">Try this example</a>
          </article>`,
        )
        .join("")}
    </div>
  </section>`;
}

// Honest, trademark-safe source + compatibility line shown above tool results.
function toolSourceNote(tool) {
  const wordListTools = ["word-unscramble", "anagram-solver", "prefix-finder", "suffix-finder", "word-finder", "random-word-generator"];
  const gameTools = ["word-unscramble", "anagram-solver"];
  let source;
  if (tool.id === "word-counter") {
    source = "Counts run entirely in your browser — your text is never sent to a server. Word, sentence, and reading-time figures are estimates based on spacing, punctuation, and an average reading pace.";
  } else if (wordListTools.includes(tool.id)) {
    source = `Runs in your browser — your input is not sent to any server. Results are matched against a ${toolDictLabel()} word English dictionary drawn from the public-domain ENABLE word list, a supplementary word list, and Word Helper's published word pages.`;
  } else if (tool.id === "synonym-finder" || tool.id === "antonym-finder") {
    source = "The word you type is sent to the Datamuse API (api.datamuse.com), an open language dataset, to retrieve results. Synonyms and antonyms are suggestions and may vary by sense and context.";
  } else if (tool.id === "rhyme-finder") {
    source = "Runs in your browser — your input is not sent to any server. Rhymes come from a curated rhyme set plus a spelling-and-sound pattern match, covering perfect rhymes first, then near rhymes and shared word endings.";
  } else {
    source = "Runs in your browser — your input is not sent to any server. Syllable counts follow standard English pronunciation; regional accents and dialects may divide some words differently.";
  }
  const trademark = gameTools.includes(tool.id)
    ? ` <span class="tool-source-tm">These helpers are for practice, study, and solo play — follow the rules of any game or competition you take part in. Scrabble&reg; and Words With Friends&reg; are trademarks of their respective owners. Word Helper is a separate reference and is not affiliated with or endorsed by them.</span>`
    : "";
  return `<p class="tool-source-note">${icon("info")} <span>${source}${trademark}</span></p>`;
}

// WS9 — permanent, crawl-visible sample OUTPUT (works with JS disabled), separate
// from the live results area. Hand-verified, accurate grouped results per tool.
const TOOL_STATIC_EXAMPLES = {
  "word-unscramble": { input: "tca", groups: [["3 letters", "act, cat"], ["2 letters", "at"]] },
  "anagram-solver": { input: "listen", groups: [["Exact anagrams", "silent, enlist, inlets, tinsel"], ["Hidden words", "line, lent, list, nest, tile, isle"]] },
  "rhyme-finder": { input: "light", groups: [["Perfect rhymes", "bright, night, sight, might, flight"], ["Near rhymes", "like, line, life, white, write"], ["Multi-syllable", "delight, highlight, midnight, sunlight, twilight"]] },
  "syllable-counter": { input: "beautiful → beau·ti·ful (3)", groups: [["1 syllable", "cat · dog · house"], ["2 syllables", "wa·ter · gar·den"], ["3 syllables", "beau·ti·ful · in·ter·net"]] },
  "prefix-finder": { input: "pre", groups: [["Words starting with pre", "predict, prepare, present, prevent, preview, prefix"]] },
  "suffix-finder": { input: "ing", groups: [["Words ending with ing", "running, singing, building, morning, evening, reading"]] },
  "word-finder": { input: "ae", groups: [["Containing a and e (7 letters)", "average, awesome, blaster"], ["Containing a and e (4 letters)", "able, area, gaze, lake, name"]] },
  "synonym-finder": { input: "happy", groups: [["Synonyms for happy", "glad, joyful, cheerful, content, pleased, delighted, merry"]] },
  "antonym-finder": { input: "happy", groups: [["Antonyms for happy", "sad, unhappy, miserable, sorrowful, depressed"]] },
  "word-counter": { input: "Clear writing takes practice. Count every word here.", groups: [["Counts", "8 words · 52 characters · 2 sentences · ~2 sec read"]] },
  "random-word-generator": { input: "10 words", groups: [["A sample set", "lantern, brisk, meadow, quartz, ponder, vivid, thicket, glance, ember, ripple"]] },
};

function toolStaticExample(tool) {
  const ex = TOOL_STATIC_EXAMPLES[tool.id];
  if (!ex) return "";
  return `<section class="section tool-example-static" aria-labelledby="${tool.id}-example-title">
    <div class="section-heading">
      <p class="eyebrow">Example output</p>
      <h2 id="${tool.id}-example-title">What the results look like</h2>
      <p>A sample result for <code>${escapeHtml(ex.input)}</code>, grouped the way the tool groups them — so you know the format before running your own.</p>
    </div>
    <div class="static-example-card">
      ${ex.groups.map(([label, list]) => `<div class="static-example-group">
        <span class="static-example-label">${escapeHtml(label)}</span>
        <p class="static-example-words">${escapeHtml(list)}</p>
      </div>`).join("")}
    </div>
  </section>`;
}

function renderTool(tool) {
  const page = tool;
  const body = `<section class="page-hero tool-hero">
    ${breadcrumb(page)}
    <p class="eyebrow">${escapeHtml(tool.primaryKeyword)}</p>
    <h1>${escapeHtml(tool.h1)}</h1>
    <p>${escapeHtml(tool.intro)}</p>
    ${editorialByline()}
  </section>
  <section class="tool-shell" data-tool="${tool.id}" data-tool-title="${escapeHtml(tool.title)}" aria-labelledby="${tool.id}-form-title">
    <div class="tool-panel">
      <div class="tool-panel-heading">
        <span class="card-icon">${icon(tool.icon)}</span>
        <div>
          <h2 id="${tool.id}-form-title">${escapeHtml(tool.title)}</h2>
          <p>${escapeHtml(tool.emptyState)}</p>
        </div>
      </div>
      <div class="tool-capability-strip" aria-label="Tool capabilities">
        <span>${icon("pulse")} Live results</span>
        <span>${icon("copy")} Copy ready</span>
        ${tool.id === "word-counter"
          ? `<span>${icon("layers")} Nothing uploaded</span>`
          : `<span>${icon("layers")} Recent inputs stay on-device</span>`}
      </div>
      <form class="tool-form" novalidate>
        ${toolFields(tool)}
        <div class="tool-actions">
          <button class="button primary" type="submit">${escapeHtml(tool.buttonLabel)}</button>
          <button class="button secondary clear-tool" type="button">${tool.id === "syllable-counter" || tool.id === "word-counter" ? "Clear Text" : tool.id === "word-unscramble" ? "Clear Letters" : tool.id === "anagram-solver" ? "Clear Input" : tool.id === "rhyme-finder" || tool.id === "synonym-finder" || tool.id === "antonym-finder" ? "Clear Word" : tool.id === "prefix-finder" ? "Clear Prefix" : tool.id === "suffix-finder" ? "Clear Suffix" : "Clear"}</button>
        </div>
      </form>
      <div class="tool-meta-row">
        <button type="button" class="favorite-tool-btn" data-tool-id="${tool.id}" aria-pressed="false" title="Save this tool">
          <svg class="icon fav-icon-add" aria-hidden="true" viewBox="0 0 24 24" fill="none"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
          <svg class="icon fav-icon-saved" aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" hidden><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
          <span class="fav-label">Save tool</span>
        </button>
      </div>
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
      ${toolSourceNote(tool)}
      <div class="result-heading">
        <div>
          <p class="eyebrow">Results</p>
          <h2>${escapeHtml(tool.resultHeading)}</h2>
        </div>
        <button type="button" class="copy-all" disabled>${icon("copy")} ${tool.id === "syllable-counter" ? "Copy Analysis" : tool.id === "word-counter" ? "Copy Summary" : "Copy Words"}</button>
      </div>
      <div class="tool-message empty">${escapeHtml(tool.emptyState)}</div>
      <div class="results"></div>
      <p class="bookmark-hint" hidden>Use this often? Press <kbd>Cmd+D</kbd> on Mac or <kbd>Ctrl+D</kbd> on Windows to bookmark this tool.</p>
      <div class="quick-jump" hidden>
        <p>Try next</p>
        <div class="quick-jump-links">
          ${tool.related.map((href) => {
            const t = toolByHref.get(href);
            if (!t) return "";
            return `<a href="${href}">${escapeHtml(t.title)} &rarr;</a>`;
          }).join("")}
        </div>
      </div>
    </section>
  </section>
  ${answerBlock(tool.answer)}
  ${toolStaticExample(tool)}
  ${adSlot("tool-mid")}
  ${toolReferencePanel(tool)}
  ${workedExamples(tool)}
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
      <h2>When this tool is useful</h2>
    </div>
    <ul class="check-list">${tool.tips.map((tip) => `<li>${escapeHtml(tip)}</li>`).join("")}</ul>
  </section>
  <section class="section">
    <div class="section-heading">
      <p class="eyebrow">Word Lab</p>
      <h2>Related Word Experiences</h2>
    </div>
    <div class="card-grid related-grid">${tool.related.map((href) => cardLink(href)).join("")}</div>
  </section>
  <section class="section note-section">
    <h2>Accuracy and scope</h2>
    <p>${escapeHtml(tool.disclaimer)}</p>
  </section>
  ${faqList(tool.faqs)}`;
  const schemas = [
    {
      "@type": "WebPage",
      name: tool.title,
      url: absolute(tool.href),
      description: tool.metaDescription,
      dateModified: buildDateISO,
      lastReviewed: buildDateISO,
      reviewedBy: { "@type": "Organization", name: site.name, url: `${site.url}/editorial-policy/` },
    },
    {
      "@type": "SoftwareApplication",
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
  const toolLinks = page.links?.filter((href) => href.startsWith("/tools/")) ?? [];
  const otherLinks = page.links?.filter((href) => !href.startsWith("/tools/")) ?? [];

  const toolLinksHtml = toolLinks.length
    ? `<div class="section">
        <div class="section-heading">
          <p class="eyebrow">Word Lab tools</p>
          <h2>Interactive tools for this category</h2>
        </div>
        <div class="card-grid tool-card-grid">${toolLinks.map((href) => cardLink(href)).join("")}</div>
      </div>`
    : "";
  const otherLinksHtml = (otherLinks.length || guideCards)
    ? `<div class="section">
        <div class="section-heading">
          <p class="eyebrow">Guides and resources</p>
          <h2>Deeper reading</h2>
        </div>
        ${otherLinks.length ? `<div class="card-grid">${otherLinks.map((href) => cardLink(href)).join("")}</div>` : ""}
        ${guideCards}
      </div>`
    : "";

  const sectionsHtml = page.sections.map((section, i) => `
  <section class="section${i % 2 === 1 ? " section-alt" : ""}">
    <div class="split">
      <div>
        <p class="eyebrow">${escapeHtml(["Overview", "How it works", "Best practice", "Pro tip", "Key detail"][i % 5])}</p>
        <h2>${escapeHtml(section.heading)}</h2>
      </div>
      <div class="text-stack"><p>${escapeHtml(section.text)}</p></div>
    </div>
  </section>`).join("");

  const body = `<section class="page-hero">
    ${breadcrumb(page)}
    <p class="eyebrow">Word Helper</p>
    <h1>${escapeHtml(page.h1)}</h1>
    ${answerBlock(page.answer)}
  </section>
  ${toolLinksHtml}
  ${sectionsHtml}
  ${otherLinksHtml}
  ${faqList(page.faqs)}`;
  const schemas = [
    {
      "@type": "CollectionPage",
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
    ${reviewedMeta("Guide reviewed")}
    ${answerBlock(page.answer)}
    ${tableOfContents(page.body)}
    <div class="article-body">
      ${page.body
        .map((section, index) => `<section id="${slugify(section.heading)}">
          <h2>${escapeHtml(section.heading)}</h2>
          ${index === 0 ? `<div class="quick-answer-card"><strong>Quick answer</strong><p>${escapeHtml(page.answer)}</p></div>` : ""}
          <p>${escapeHtml(section.text)}</p>
        </section>`)
        .join("")}
    </div>
    <section class="section compact">
      <div class="section-heading">
        <p class="eyebrow">Word Lab</p>
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
      datePublished: SITE_CONTENT_START,
      dateModified: new Date().toISOString().split("T")[0],
      author: {
        "@type": "Organization",
        name: site.name,
        url: `${site.url}/`,
      },
      publisher: ARTICLE_PUBLISHER(),
    },
    breadcrumbSchema(page),
    faqSchema(page.faqs),
  ];
  return { href: page.href, html: layout(page, body, schemas) };
}

function renderLegal(page) {
  const bodyContent = page.bodyHtml
    ? page.bodyHtml.join("")
    : page.body.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("");
  const body = `<section class="page-hero legal-hero">
    ${breadcrumb(page)}
    <p class="eyebrow">Word Helper trust</p>
    <h1>${escapeHtml(page.h1)}</h1>
    ${reviewedMeta(page.reviewedLabel || "Policy reviewed")}
  </section>
  <section class="legal-content">
    ${bodyContent}
  </section>
  ${page.faqs ? faqList(page.faqs) : ""}`;
  // Use the most accurate WebPage subtype when a page declares one (AboutPage for
  // /about/, ContactPage for /contact/, ProfilePage for /editorial-team/). A
  // ProfilePage references the publisher Organization as its mainEntity — honest,
  // since the accountable entity is the brand, not an invented individual.
  const primarySchema = {
    "@type": page.schemaType || "WebPage",
    name: page.title,
    url: absolute(page.href),
    description: page.metaDescription,
    dateModified: buildDateISO,
  };
  const extraSchemas = [];
  if (page.mainEntityPerson) {
    // /creator/ — the ProfilePage is ABOUT the real named person Jay Sudha.
    const personSchema = {
      "@type": "Person",
      "@id": `${site.url}/creator/#person`,
      name: founder.name,
      alternateName: founder.fullName,
      url: absolute(page.href),
      sameAs: [founder.url],
      jobTitle: founder.role,
      worksFor: { "@id": `${site.url}/#organization` },
    };
    primarySchema.mainEntity = { "@id": personSchema["@id"] };
    extraSchemas.push(personSchema);
  } else if (page.schemaType === "ProfilePage" || page.schemaType === "AboutPage") {
    primarySchema.mainEntity = { "@id": `${site.url}/#organization` };
  }
  const schemas = [primarySchema, ...extraSchemas, breadcrumbSchema(page), faqSchema(page.faqs)];
  return { href: page.href, html: layout(page, body, schemas) };
}

// Map any part-of-speech string to one of the CSS-styled badge classes. The
// stylesheet styles pos-noun/verb/adje/adve/word/unkn; anything else (preposition,
// pronoun, conjunction, interjection, determiner, …) falls back to the styled
// pos-unkn so a badge never renders unstyled.
function posClassOf(pos = "") {
  const p = String(pos).toLowerCase();
  if (p.includes("noun")) return "noun";
  if (p.includes("verb")) return "verb";
  if (p.includes("adjective")) return "adje";
  if (p.includes("adverb")) return "adve";
  if (p === "word" || p === "") return "word";
  return "unkn";
}
function posBadge(pos) {
  return `<span class="pos-badge pos-${posClassOf(pos)}">${escapeHtml(pos)}</span>`;
}

function renderWordCard(w, extraAttrs = "") {
  const word = w.word || "";
  const href = w.href || `/word/${encodeURIComponent(word)}/`;
  const partOfSpeech = w.partOfSpeech || "word";
  const needsCardLookup = Boolean(w.needsDictionaryLookup || partOfSpeech === "word");
  const displayPos = needsCardLookup && partOfSpeech === "word" ? "checking" : partOfSpeech;
  const posClass = posClassOf(partOfSpeech);
  const syllables = Number(w.syllables) || estimateSyllables(word);
  const label = titleCase(word);
  const shortDef =
    w.shortDef ||
    `${label} is an English word. Open the page for definition, examples, synonyms, and antonyms.`;
  const lookupAttrs = needsCardLookup && /^[a-z]+$/.test(word)
    ? `data-card-pos-lookup="true" data-card-word="${escapeHtml(word)}"`
    : "";
  const attrs = [extraAttrs, lookupAttrs].filter(Boolean).join(" ");

  return `<a class="resource-card word-card" href="${href}"${attrs ? ` ${attrs}` : ""}>
        <div class="word-card-top">
          <span class="pos-badge pos-${posClass}" data-card-pos>${escapeHtml(displayPos)}</span>
          <span class="word-card-syllables">${syllables} syl.</span>
        </div>
        <strong class="word-card-word">${escapeHtml(word)}</strong>
        <span class="word-card-def">${escapeHtml(shortDef)}</span>
        <span class="word-card-details" aria-label="This word page includes">
          <span>Definition</span>
          <span>Examples</span>
          <span>Synonyms</span>
          <span>Antonyms</span>
        </span>
      </a>`;
}

function renderBrowseCard(w) {
  const word = w.word || "";
  // Browse stubs have no static page → wordHref routes them to the lookup template.
  const href = wordHref(word);
  const syllables = Number(w.syllables) || estimateSyllables(word);
  const pos = w.partOfSpeech && w.partOfSpeech !== "word" ? w.partOfSpeech.slice(0, 3) : "";
  return `<a class="word-card browse-card" href="${href}" data-word="${escapeHtml(word)}"><strong>${escapeHtml(word)}</strong><span>${pos ? `<em>${escapeHtml(pos)}</em>` : ""}<small>${syllables}syl</small></span></a>`;
}

function renderWordFactPanel(wordData) {
  const word = wordData.word || "";
  const lowerWord = word.toLowerCase();
  const firstLetter = /^[a-z]/.test(lowerWord) ? lowerWord.charAt(0) : "a";
  const firstLetterLabel = firstLetter.toUpperCase();
  const syllables = Number(wordData.syllables) || estimateSyllables(lowerWord || word);
  const partOfSpeech = wordData.partOfSpeech || "word";
  const wordLength = word.replace(/[^a-z]/gi, "").length || word.length;
  const factId = `word-facts-${lowerWord.replace(/[^a-z0-9-]/g, "") || "entry"}`;

  return `<section class="word-section word-facts-section" aria-labelledby="${factId}">
      <h2 class="word-section-title" id="${factId}">Word facts</h2>
      <div class="word-fact-grid">
        <div class="word-fact">
          <span>Part of speech</span>
          <strong data-word-fact-pos>${escapeHtml(partOfSpeech)}</strong>
        </div>
        <div class="word-fact">
          <span>Syllables</span>
          <strong>${syllables}</strong>
        </div>
        <div class="word-fact">
          <span>Letters</span>
          <strong>${wordLength}</strong>
        </div>
        <div class="word-fact">
          <span>Starts with</span>
          <strong><a href="/word-explorer/${firstLetter}/">${firstLetterLabel}</a></strong>
        </div>
        <div class="word-fact">
          <span>Level</span>
          <strong>${escapeHtml(wordDifficulty(wordData))}</strong>
        </div>
        <div class="word-fact">
          <span>Usage</span>
          <strong>${escapeHtml(wordUsageLabel(wordData))}</strong>
        </div>
      </div>
      <div class="word-action-row" aria-label="Word tools for ${escapeHtml(word)}">
        <a class="button secondary" href="/word-explorer/${firstLetter}/">Browse ${firstLetterLabel} words</a>
        <a class="button secondary" href="/tools/rhyme-finder/">Find rhymes</a>
        <a class="button secondary" href="/tools/syllable-counter/">Check syllables</a>
      </div>
    </section>`;
}

// ── Index-eligibility gate (single source of truth) ──────────────────────
// A word page is index-worthy (sitemap + indexable + publicly listed + linked)
// only when it clears the strict completeness bar defined ONCE in
// src/word-quality.mjs and shared with scripts/audit-words.mjs. A page is
// "complete" only when every REQUIRED field is present (word, definition,
// part of speech, >=1 example, syllables, pronunciation, SEO title + meta) and
// its 0-100 completeness score is >=80. Everything below stays noindex,follow,
// is excluded from the sitemap, and is never listed or linked publicly until
// enriched — protecting against thin/scaled content.
function isPublishable(w) {
  // Indexed ⟺ listed ⟺ linked ⟺ sitemapped: a page is public only when it is
  // COMPLETE and RECOMMENDED. Curated entries are premium hand-written pages and
  // are always public once complete.
  if (!isCompleteWordEntry(w)) return false;
  return w._curated === true || wordRecommendationScore(w) >= RECOMMENDATION_THRESHOLD;
}

function renderWordPage(wordData) {
  const page = {
    href: wordData.href,
    title: wordData.word.charAt(0).toUpperCase() + wordData.word.slice(1),
    metaTitle: wordData.metaTitle,
    metaDescription: wordData.metaDescription,
  };

  const synonymPills = wordData.synonyms
    .map((w) => wordPill(w))
    .join("");

  const antonymPills = wordData.antonyms
    .map((w) => wordPill(w))
    .join("");

  const wordFamilyItems = wordData.wordFamily
    .map(
      (item) => `<div class="word-family-item">
        <span class="pos-mini">${escapeHtml(item.pos)}</span>
        <strong>${escapeHtml(item.word)}</strong>
      </div>`,
    )
    .join("");

  const exampleItems = wordData.examples
    .map((ex) => `<li><p>${escapeHtml(ex)}</p></li>`)
    .join("");

  const relatedToolLinks = wordData.relatedTools
    .map((href) => cardLink(href))
    .join("");

  const commonMistakeBlock = wordData.commonMistake
    ? `<div class="word-callout mistake-note">
        <span class="callout-label">Common mistake</span>
        <p>${escapeHtml(wordData.commonMistake)}</p>
      </div>`
    : "";

  const body = `<section class="page-hero word-hero">
    ${breadcrumb(page)}
    <div class="word-hero-inner">
      <div class="word-identity">
        ${posBadge(wordData.partOfSpeech)}
        <h1 class="word-title">${escapeHtml(wordData.word)}</h1>
        <div class="word-phonetics">
          <span class="pronunciation">/${escapeHtml(wordData.pronunciation)}/</span>
          <span class="syllable-break">${escapeHtml(wordData.syllableBreak)}</span>
          <span class="syllable-count">${wordData.syllables} syllable${wordData.syllables !== 1 ? "s" : ""}</span>
        </div>
      </div>
      <p class="word-short-def">${escapeHtml(wordData.shortDef)}</p>
    </div>
    ${editorialByline()}
  </section>
  <div class="word-body">
    ${renderWordFactPanel(wordData)}
    <section class="word-section">
      <h2 class="word-section-title">Definition</h2>
      <div class="definition-block">
        <p>${escapeHtml(wordData.definition)}</p>
        ${wordData.usageNote ? `<p class="usage-note"><strong>Usage:</strong> ${escapeHtml(wordData.usageNote)}</p>` : ""}
      </div>
      ${commonMistakeBlock}
    </section>
    <section class="word-section">
      <h2 class="word-section-title">Example sentences</h2>
      <ol class="example-list">
        ${exampleItems}
      </ol>
    </section>
    <section class="word-section">
      <div class="synonym-antonym-grid">
        <div>
          <h2 class="word-section-title">Synonyms</h2>
          <div class="word-pill-cloud">${synonymPills}</div>
        </div>
        <div>
          <h2 class="word-section-title">Antonyms</h2>
          <div class="word-pill-cloud">${antonymPills}</div>
        </div>
      </div>
    </section>
    <section class="word-section">
      <h2 class="word-section-title">Word family</h2>
      <div class="word-family-grid">${wordFamilyItems}</div>
    </section>
    <section class="word-section callout-pair">
      <div class="word-callout etymology-callout">
        <span class="callout-label">Word origin</span>
        <p>${escapeHtml(wordData.etymology)}</p>
      </div>
      <div class="word-callout memory-callout">
        <span class="callout-label">Memory tip</span>
        <p>${escapeHtml(wordData.memoryTip)}</p>
      </div>
    </section>
    ${adSlot("word-mid")}
    <section class="word-section">
      <h2 class="word-section-title">Explore this word in Word Lab</h2>
      <div class="card-grid related-grid">${relatedToolLinks}</div>
    </section>
    ${faqList(wordData.faqs)}
  </div>`;

  const schemas = [
    {
      "@type": "DefinedTerm",
      name: wordData.word,
      url: absolute(wordData.href),
      description: wordData.shortDef,
      inDefinedTermSet: {
        "@type": "DefinedTermSet",
        name: "Word Helper Word Explorer",
        url: `${site.url}/word-explorer/`,
      },
    },
    {
      "@type": "WebPage",
      name: page.metaTitle,
      url: absolute(wordData.href),
      description: wordData.metaDescription,
      dateModified: buildDateISO,
      lastReviewed: buildDateISO,
      reviewedBy: { "@type": "Organization", name: site.name, url: `${site.url}/editorial-policy/` },
    },
    breadcrumbSchema(page),
    faqSchema(wordData.faqs),
  ];

  const noindex = !isPublishable(wordData);
  return { href: wordData.href, html: layout(page, body, schemas, noindex), noindex };
}

// Stable per-word hash so generated FAQ phrasing varies deterministically across
// the corpus (the same word always renders the same wording build-to-build, but
// neighbouring words differ — reduces the duplicate-content footprint of templated
// answers across tens of thousands of pages).
function wordHash(word = "") {
  let h = 0;
  for (let i = 0; i < word.length; i++) h = (h * 31 + word.charCodeAt(i)) >>> 0;
  return h;
}
function pickVariant(word, variants) {
  return variants[wordHash(word) % variants.length];
}

// ── Light Word Page (enriched words — substantive content, AdSense-safe) ─
function renderLightWordPage(w) {
  const initialPos = w.partOfSpeech || "word";
  const label = w.word.charAt(0).toUpperCase() + w.word.slice(1);
  const syllCount = w.syllables || estimateSyllables(w.word);
  const syllBreak = w.syllableBreak || estimateSyllableBreak(w.word);
  const firstLetter = w.word[0].toUpperCase();
  const wordLen = w.word.length;
  const needsLookup = Boolean(w.needsDictionaryLookup);
  const initialDefinition =
    w.definition || w.shortDef ||
    `${label} is a valid English word. Use the Word Lab tools below to find rhymes, count syllables, check anagrams, and explore words that start with the same letters.`;
  // Hero summary appears only when there is a SHORT def that differs from the full
  // definition shown in the Definition section below — never print the same text twice.
  const heroSummary =
    w.shortDef && w.shortDef.trim() && w.shortDef.trim() !== initialDefinition.trim()
      ? w.shortDef.trim()
      : "";
  // When the hero already shows the short definition and the full definition simply
  // repeats it as its opening sentence, strip that leading duplicate from the
  // Definition block so the page never reads as a copy-paste of the same sentence.
  let definitionForBlock = initialDefinition;
  if (heroSummary && definitionForBlock.toLowerCase().startsWith(heroSummary.toLowerCase())) {
    const rest = definitionForBlock.slice(heroSummary.length).replace(/^[\s.;:,—-]+/, "").trim();
    if (rest.length > 25) definitionForBlock = rest.charAt(0).toUpperCase() + rest.slice(1);
  }

  // Plain-English gloss ("In simple terms"). EXTRACTED verbatim from the sourced
  // definition — never rewritten or invented. Picks the first non-taxonomic
  // sentence (skipping openers like "A mammal of the family Felidae.") and strips
  // parentheticals (Latin binomials etc.). Only shown when the definition has
  // multiple sentences (single-sentence definitions are already the simple form)
  // and the pick is a sane length. When the pick is the opening sentence, it is
  // removed from the definition block below so the page never repeats itself.
  let simpleGloss = "";
  let definitionRest = definitionForBlock;
  if (!needsLookup && w.definition) {
    // Protect common abbreviations so the sentence splitter never breaks on
    // "e.g." / "i.e." / "etc." mid-sentence (restored after splitting).
    const protectedText = definitionForBlock.replace(/\b(e\.g\.|i\.e\.|etc\.|cf\.|vs\.|viz\.)/gi, (m) => m.replace(/\./g, "\u0001"));
    const sentences = protectedText
      .split(/(?<=[.!?])\s+/)
      .map((s) => s.replace(/\u0001/g, ".").trim())
      .filter(Boolean);
    if (sentences.length >= 2) {
      const technical = /\b(?:family|genus|order|species|phylum|subfamily|superfamily|tribe|clade)\s+[A-Z][a-z]+/;
      let idx = sentences.findIndex((s) => !technical.test(s.replace(/\s*\([^)]*\)/g, "")));
      if (idx === -1) idx = 0;
      const candidate = sentences[idx].replace(/\s*\([^)]*\)/g, "").replace(/\s{2,}/g, " ").trim();
      const unbalanced = (candidate.match(/\(/g) || []).length !== (candidate.match(/\)/g) || []).length;
      // The hero teaser is often the first sentence truncated with "…" — the gloss
      // must never repeat what the hero already shows. Normalize BOTH sides the
      // same way (ellipsis + parentheticals stripped, whitespace collapsed) and
      // compare prefixes in both directions.
      const heroCmp = (heroSummary || "")
        .replace(/[…]+\s*$/, "")
        .replace(/\.{3}\s*$/, "")
        .replace(/\s*\([^)]*\)/g, "")
        .replace(/\s{2,}/g, " ")
        .trim()
        .toLowerCase();
      const candCmp = candidate.toLowerCase();
      const echoesHero =
        heroCmp.length >= 20 &&
        (candCmp.startsWith(heroCmp.slice(0, 60)) || heroCmp.startsWith(candCmp.slice(0, 60)));
      if (
        !unbalanced &&
        !echoesHero &&
        /[.!?]$/.test(candidate) &&
        candidate.length >= 20 &&
        candidate.length <= 200 &&
        (!heroSummary || candidate.toLowerCase() !== heroSummary.trim().toLowerCase())
      ) {
        simpleGloss = candidate;
        if (idx === 0) definitionRest = sentences.slice(1).join(" ");
      }
    }
  }

  const page = {
    href: w.href,
    title: label,
    metaTitle: clampTitle(w.metaTitle || `${label} — Definition, Syllables, and Word Tools | Word Helper`, label),
    metaDescription: clampMeta(w.metaDescription || `What does ${w.word} mean? ${(w.shortDef || w.definition || "").slice(0, 120)} Explore syllables, synonyms, and word tools for ${w.word}.`),
  };

  // Synonyms / antonyms
  // Sanitize the open-data relations (drops crude/off-sense noise, multi-word
  // junk like "keep down", self-echoes, and contradictions; caps + de-dupes).
  const cleanRelations = sanitizeRelations(w.word, {
    synonyms: w.synonyms,
    antonyms: w.antonyms,
    related: w.related,
  });
  const synonymList = cleanRelations.synonyms;
  const antonymList = cleanRelations.antonyms;
  const synonymPills = synonymList
    .map((s) => wordPill(s))
    .join("");
  const antonymPills = antonymList
    .map((s) => wordPill(s))
    .join("");

  // Examples
  const exampleItems = (w.examples || [])
    .map((ex) => `<li><p>${escapeHtml(ex)}</p></li>`)
    .join("");

  // Generated word-specific FAQs — valuable SEO content, genuinely useful
  const posLabel = posPhrase(initialPos);
  const syllableAnswer = syllCount === 1
    ? pickVariant(w.word, [
        `${label} has 1 syllable. It is pronounced as a single beat: ${syllBreak}.`,
        `${label} is a one-syllable word, said in a single beat: ${syllBreak}.`,
        `There is 1 syllable in ${w.word} — it is spoken as one beat: ${syllBreak}.`,
      ])
    : pickVariant(w.word, [
        `${label} has ${syllCount} syllables: ${syllBreak}. The word is broken into ${syllCount} spoken beats.`,
        `There are ${syllCount} syllables in ${w.word}, divided as ${syllBreak} when spoken.`,
        `${label} breaks into ${syllCount} syllables — ${syllBreak} — when you say it aloud.`,
      ]);
  const posSenseNote = initialPos.includes("noun") ? "As a noun, it names a thing, idea, or concept." : initialPos.includes("verb") ? "As a verb, it describes an action or state." : initialPos.includes("adjective") ? "As an adjective, it describes or modifies a noun." : initialPos.includes("adverb") ? "As an adverb, it modifies a verb, adjective, or other adverb." : "";
  const posAnswer = initialPos === "word"
    ? `${label} is an English word listed in the Word Helper word list. Its part of speech can shift with the way it is used in a sentence.`
    : pickVariant(w.word, [
        `${label} is used as ${posPhrase(initialPos)}. ${posSenseNote}`,
        `In a sentence, ${w.word} functions as ${posPhrase(initialPos)}. ${posSenseNote}`,
        `${label} works as ${posPhrase(initialPos)}. ${posSenseNote}`,
      ]);
  const synonymAnswer = synonymList.length > 0
    ? pickVariant(w.word, [
        `Words with similar meanings to ${w.word} include ${synonymList.slice(0, 4).join(", ")}. The best synonym depends on the exact context you are writing or reading in.`,
        `Close in meaning to ${w.word} are ${synonymList.slice(0, 4).join(", ")} — choose the one whose tone fits your sentence.`,
        `You can often swap ${w.word} for ${synonymList.slice(0, 4).join(", ")}, though each carries a slightly different shade of meaning.`,
      ])
    : `Close synonyms for ${w.word} depend on the sense you need. Use Word Explorer to browse related words, or the Prefix Finder to surface words built on the same root.`;

  // Data-driven FAQ: only include questions a real, grounded answer exists for —
  // no filler "how many letters" / "same starting letter" boilerplate. Each entry
  // doubles as an AEO answer block and feeds the FAQ schema.
  const genFaqs = [];
  const primaryMeaning = (w.shortDef || w.definition || "").trim();
  if (primaryMeaning) {
    genFaqs.push({
      q: `What does ${w.word} mean?`,
      a: `${primaryMeaning}${/[.!?]$/.test(primaryMeaning) ? "" : "."}${initialPos !== "word" ? ` It is ${posLabel}.` : ""}`,
    });
  }
  genFaqs.push({ q: `How many syllables does ${w.word} have?`, a: syllableAnswer });
  if (initialPos !== "word") {
    genFaqs.push({ q: `What part of speech is ${w.word}?`, a: posAnswer });
  }
  if (synonymList.length > 0) {
    genFaqs.push({ q: `What are synonyms for ${w.word}?`, a: synonymAnswer });
  }
  if ((w.examples || []).length > 0) {
    genFaqs.push({
      q: `How do you use ${w.word} in a sentence?`,
      a: `Example: "${w.examples[0]}"`,
    });
  }

  const lookupAttrs = needsLookup
    ? ` data-dictionary-lookup="true" data-dictionary-word="${escapeHtml(w.word)}"`
    : "";
  const posClass = posClassOf(initialPos);

  // Difficulty / usage / relations (rendered only when grounded data exists).
  const levelLabel = wordDifficulty(w);
  const usageLabel = wordUsageLabel(w);
  const relatedList = cleanRelations.related;
  const rhymeList = (w.rhymes || []).filter(Boolean);
  const formsList = (w.wordFamily || []).filter((f) => f && (f.word || typeof f === "string"));
  const relatedPills = relatedList.map((r) => wordPill(r)).join("");
  const rhymePills = rhymeList.map((r) => wordPill(r)).join("");
  const formsPills = formsList
    .map((f) => (typeof f === "string" ? wordPill(f) : `${wordPill(f.word)}${f.pos ? `<span class="word-form-pos">${escapeHtml(f.pos)}</span>` : ""}`))
    .join("");

  const body = `<section class="page-hero word-hero">
    ${breadcrumb(page)}
    <div class="word-hero-inner">
      <div class="word-identity">
        <div class="word-badge-row">
          <span class="pos-badge pos-${posClass}" data-word-pos>${escapeHtml(initialPos)}</span>
          <span class="word-level-chip level-${levelLabel}">${escapeHtml(levelLabel)} · ${escapeHtml(usageLabel)}</span>
        </div>
        <h1 class="word-title">${escapeHtml(w.word)}</h1>
        <div class="word-phonetics">
          ${w.pronunciation ? `<span class="pronunciation" data-word-pronunciation>${escapeHtml(w.pronunciation)}</span>` : `<span class="pronunciation" data-word-pronunciation hidden></span>`}
          <span class="syllable-break">${escapeHtml(syllBreak)}</span>
          <span class="syllable-count">${syllCount} syllable${syllCount !== 1 ? "s" : ""}</span>
        </div>
      </div>
      ${(heroSummary || needsLookup) ? `<p class="word-short-def" data-word-short-def>${escapeHtml(heroSummary)}</p>` : ""}
    </div>
    ${isPublishable(w) ? editorialByline() : ""}
  </section>
  <div class="word-body"${lookupAttrs}>
    ${needsLookup ? '<p class="dictionary-status" data-word-lookup-status>Loading word details…</p>' : ""}
    ${renderWordFactPanel(w)}

    <section class="word-section">
      <h2 class="word-section-title">Definition of ${escapeHtml(label)}</h2>
      ${simpleGloss ? `<p class="simple-gloss"><span class="simple-gloss-label">In simple terms</span>${escapeHtml(simpleGloss)}</p>` : ""}
      <div class="definition-block" data-word-definition>
        <p>${escapeHtml(definitionRest || definitionForBlock)}</p>
      </div>
    </section>

    ${exampleItems ? `<section class="word-section" data-word-examples-section>
      <h2 class="word-section-title">Example sentences</h2>
      <ol class="example-list" data-word-examples>${exampleItems}</ol>
    </section>` : `<section class="word-section" data-word-examples-section>
      <h2 class="word-section-title">How to use ${escapeHtml(label)}</h2>
      <p class="word-usage-note" data-word-examples>
        ${label} is ${posLabel}. When using it in writing, make sure the meaning fits the context of your sentence.
        ${synonymList.length > 0 ? `Related words with similar meanings include ${escapeHtml(synonymList.slice(0, 3).join(", "))} — each with slight differences in tone or formality.` : ""}
        Reading the word aloud after placing it in a sentence is a reliable check for natural usage.
      </p>
    </section>`}

    ${(synonymPills || antonymPills || needsLookup) ? `<section class="word-section" data-word-relations-section>
      <div class="synonym-antonym-grid">
        ${(synonymPills || needsLookup) ? `<div>
          <h2 class="word-section-title">Synonyms for ${escapeHtml(label)}</h2>
          <div class="word-pill-cloud" data-word-synonyms>${synonymPills}</div>
        </div>` : ""}
        ${(antonymPills || needsLookup) ? `<div>
          <h2 class="word-section-title">Antonyms for ${escapeHtml(label)}</h2>
          <div class="word-pill-cloud" data-word-antonyms>${antonymPills}</div>
        </div>` : ""}
      </div>
    </section>` : ""}

    ${formsList.length ? `<section class="word-section" data-word-forms-section>
      <h2 class="word-section-title">Word forms of ${escapeHtml(label)}</h2>
      <div class="word-pill-cloud word-forms-cloud">${formsPills}</div>
    </section>` : ""}

    ${relatedList.length ? `<section class="word-section" data-word-related-section>
      <h2 class="word-section-title">Related words</h2>
      <p>Words closely connected to ${escapeHtml(label)} in meaning or use:</p>
      <div class="word-pill-cloud" data-word-related>${relatedPills}</div>
    </section>` : ""}

    ${w.etymology ? `<section class="word-section" data-word-etymology-section>
      <h2 class="word-section-title">Origin of ${escapeHtml(label)}</h2>
      <p class="word-etymology">${escapeHtml(w.etymology)}</p>
    </section>` : ""}

    ${rhymeList.length ? `<section class="word-section" data-word-rhymes-section>
      <h2 class="word-section-title">Words that rhyme with ${escapeHtml(label)}</h2>
      <div class="word-pill-cloud" data-word-rhymes>${rhymePills}</div>
      <p class="word-rhyme-cta"><a class="button secondary" href="/tools/rhyme-finder/?q=${encodeURIComponent(w.word)}">Find more rhymes for ${escapeHtml(w.word)}</a></p>
    </section>` : ""}

    ${adSlot("word-mid")}
    <section class="word-section word-tools-section">
      <h2 class="word-section-title">Try ${escapeHtml(label)} in the word tools</h2>
      <div class="word-action-row">
        <a class="button secondary" href="/tools/rhyme-finder/?q=${encodeURIComponent(w.word)}">Rhymes for ${escapeHtml(w.word)}</a>
        <a class="button secondary" href="/tools/syllable-counter/?q=${encodeURIComponent(w.word)}">Count syllables</a>
        <a class="button secondary" href="/tools/word-unscramble/?q=${encodeURIComponent(w.word)}">Unscramble letters</a>
        <a class="button secondary" href="/tools/anagram-solver/?q=${encodeURIComponent(w.word)}">Find anagrams</a>
      </div>
    </section>

    <section class="word-section">
      <h2 class="word-section-title">Browse words near ${escapeHtml(label)}</h2>
      <p>Explore more words that start with the letter ${firstLetter} in Word Explorer, or use the A-Z browser to discover other vocabulary starting from any letter.</p>
      <div class="card-grid related-grid">
        ${cardLink(`/word-explorer/${w.word[0]}/`, `Browse complete word pages starting with ${w.word[0].toUpperCase()}.`)}
        ${cardLink("/word-explorer/", "Open in-depth word profiles from A to Z.")}
        ${cardLink("/word-lists/", "Curated vocabulary collections for writing and study.")}
        ${cardLink("/learn-english/", "Plain-English guides for vocabulary and usage.")}
      </div>
    </section>

    <aside class="word-source-note" aria-label="About this word page">
      ${icon("info")} <strong>About this page:</strong> word data is compiled from openly licensed sources
      — the <a href="https://www.datamuse.com/api/" rel="nofollow noopener" target="_blank">Datamuse API</a> (building on Wiktionary, CC BY-SA 3.0)
      and the <a href="https://dictionaryapi.dev/" rel="nofollow noopener" target="_blank">Free Dictionary API</a>
      — then standardized and quality-checked by Word Helper. Example sentences may include AI-assisted generations that have been automatically screened for accuracy.
      Last generated: <time datetime="${buildDateISO}">${new Date(buildDateISO + "T00:00:00Z").toLocaleDateString("en-US", { month: "short", year: "numeric", timeZone: "UTC" })}</time>.
      Maintained by Word Helper; site created by <a href="/creator/">Jay Sudha</a>.
      <a href="/corrections/">Report an error</a> · <a href="/editorial-policy/">How this works</a>
    </aside>
  </div>
  ${faqList(genFaqs)}`;

  const indexable = isPublishable(w);
  const schemas = [
    {
      "@type": "DefinedTerm",
      name: w.word,
      url: absolute(w.href),
      description: (w.shortDef || w.definition || "").slice(0, 250),
      inDefinedTermSet: {
        "@type": "DefinedTermSet",
        name: "Word Helper — Word Explorer",
        url: `${site.url}/word-explorer/`,
      },
    },
    {
      "@type": "WebPage",
      name: page.metaTitle,
      url: absolute(w.href),
      description: page.metaDescription,
      dateModified: buildDateISO,
      // No reviewedBy/author schema on auto-compiled pages — the data is sourced
      // from open dictionaries and quality-gated, not human-authored per entry, so
      // claiming editorial review here would be a false E-E-A-T signal.
    },
    breadcrumbSchema(page),
    faqSchema(genFaqs),
  ];

  // Index gate: pages below the quality bar are noindex,follow and excluded from the sitemap.
  const noindex = !indexable;
  return { href: w.href, html: layout(page, body, schemas, noindex), noindex };
}

// ── Catch-all word lookup template ───────────────────────────────────────
// Served (via _redirects rewrite "/word/* /word-lookup/ 200") for any word that
// has no static page — i.e. the ~107k A–Z browse words. One noindexed template
// resolves them all via live public-dictionary lookup, so browse links never
// 404 and no thin static pages are generated. Client reads the slug from the URL.
function renderWordLookup() {
  const page = {
    href: "/word-lookup/",
    title: "Word Lookup",
    metaTitle: "Word Lookup — Definitions, Syllables & Word Tools | Word Helper",
    metaDescription:
      "Look up any English word for its definition, part of speech, pronunciation, syllables, synonyms, and antonyms, with quick links to Word Helper's word tools.",
  };

  const body = `<section class="page-hero word-hero">
    <nav class="breadcrumb" aria-label="Breadcrumb"><a href="/">Home</a><span>/</span><a href="/word-explorer/">Word Explorer</a><span>/</span><span aria-current="page" data-word-crumb>Word</span></nav>
    <div class="word-hero-inner">
      <div class="word-identity">
        <span class="pos-badge pos-word" data-word-pos>word</span>
        <h1 class="word-title" data-word-title>Word lookup</h1>
        <div class="word-phonetics">
          <span class="pronunciation" data-word-pronunciation hidden></span>
          <span class="syllable-break" data-word-syllable-break></span>
          <span class="syllable-count" data-word-syllable-count></span>
        </div>
      </div>
      <p class="word-short-def" data-word-short-def>Loading word details…</p>
    </div>
  </section>
  <div class="word-body" data-dictionary-lookup="true" data-dictionary-from-path="true">
    <p class="dictionary-status" data-word-lookup-status>Loading word details…</p>

    <section class="word-section">
      <h2 class="word-section-title">Definition</h2>
      <div class="definition-block" data-word-definition><p>Looking up this word…</p></div>
    </section>

    <section class="word-section" data-word-examples-section>
      <h2 class="word-section-title">Example sentences</h2>
      <ol class="example-list" data-word-examples></ol>
    </section>

    <section class="word-section" data-word-relations-section>
      <div class="synonym-antonym-grid">
        <div>
          <h2 class="word-section-title">Synonyms</h2>
          <div class="word-pill-cloud" data-word-synonyms></div>
        </div>
        <div>
          <h2 class="word-section-title">Antonyms</h2>
          <div class="word-pill-cloud" data-word-antonyms></div>
        </div>
      </div>
    </section>

    <section class="word-section word-tools-section">
      <h2 class="word-section-title">Explore this word in Word Lab</h2>
      <div class="word-action-row" data-word-tool-links>
        <a class="button secondary" href="/tools/rhyme-finder/" data-tool-link="/tools/rhyme-finder/">Find rhymes</a>
        <a class="button secondary" href="/tools/syllable-counter/" data-tool-link="/tools/syllable-counter/">Count syllables</a>
        <a class="button secondary" href="/tools/word-unscramble/" data-tool-link="/tools/word-unscramble/">Unscramble letters</a>
        <a class="button secondary" href="/tools/anagram-solver/" data-tool-link="/tools/anagram-solver/">Solve anagrams</a>
      </div>
    </section>

    <section class="word-section">
      <div class="card-grid related-grid">
        ${cardLink("/word-explorer/")}
        ${cardLink("/word-lab/")}
        ${cardLink("/word-lists/")}
      </div>
    </section>
  </div>`;

  const schemas = [breadcrumbSchema(page)];
  // Dynamic, client-rendered content — always noindex, excluded from sitemap.
  return { href: "/word-lookup/", html: layout(page, body, schemas, true), noindex: true };
}

function renderWordExplorerIndex(allWords = words) {
  const hub = wordExplorerHubData;
  const page = {
    href: hub.href,
    title: hub.title,
    metaTitle: hub.metaTitle,
    metaDescription: hub.metaDescription,
  };

  const wordCards = words.map((w) => renderWordCard(w)).join("");

  // Use allWords so every letter with browse content shows as an active link
  const allLetterSet = new Set(allWords.map((w) => w.word[0]));
  const azLinks = "abcdefghijklmnopqrstuvwxyz".split("").map((l) => {
    return allLetterSet.has(l)
      ? `<a class="az-link" href="/word-explorer/${l}/">${l.toUpperCase()}</a>`
      : `<span class="az-link az-link-empty">${l.toUpperCase()}</span>`;
  }).join("");

  const body = `<section class="page-hero">
    ${breadcrumb(page)}
    <p class="eyebrow">The word workspace</p>
    <h1>${escapeHtml(hub.h1)}</h1>
    <p class="hero-lede">${escapeHtml(hub.intro)}</p>
    ${answerBlock(hub.answer)}
  </section>
  <section class="section">
    <div class="section-heading">
      <p class="eyebrow">What it does</p>
      <h2>What Word Explorer helps you do</h2>
      <p>Start from any word and follow the path that helps — a meaning, a sound-alike, a similar word, or a tool that turns letters into answers.</p>
    </div>
    <ul class="check-list">
      <li><strong>Understand a word</strong> — clear meanings and parts of speech.</li>
      <li><strong>See examples</strong> — words used in real sentences.</li>
      <li><strong>Find synonyms &amp; antonyms</strong> — similar and opposite words.</li>
      <li><strong>Discover rhymes</strong> — sound-alike words for writing and word games.</li>
      <li><strong>Follow related word paths</strong> — jump from one word to connected words.</li>
      <li><strong>Jump into useful tools</strong> — unscramble, anagrams, prefixes, suffixes, and more.</li>
      <li><strong>Browse connected word lists</strong> — curated sets for learning and writing.</li>
    </ul>
  </section>
  <section class="section">
    <div class="section-heading">
      <p class="eyebrow">Browse A–Z</p>
      <h2>Browse word pages by letter</h2>
      <p>Pick a letter to browse complete word profiles starting with it — each with meaning, examples, synonyms, and related words.</p>
    </div>
    <nav class="az-nav" aria-label="Browse words by letter">${azLinks}</nav>
  </section>
  <section class="section">
    <div class="section-heading">
      <p class="eyebrow">Word profiles</p>
      <h2>What a word profile may include</h2>
      <p>Word profiles vary by the data available for each word. A word profile <strong>may include</strong> a definition, examples, pronunciation, syllables, part of speech, synonyms, antonyms, rhymes, related words, and source notes — not every page shows every section.</p>
    </div>
    <div class="word-explorer-grid">${wordCards}</div>
  </section>
  <section class="section split">
    <div>
      <p class="eyebrow">How it stays useful</p>
      <h2>How WordHelper keeps pages useful</h2>
    </div>
    <div class="text-stack">
      <p>Definitions, pronunciation, syllables, synonyms, and related data may come from open lexical sources and APIs — the <a href="https://www.datamuse.com/api/" rel="nofollow noopener" target="_blank">Datamuse API</a> (which builds on Wiktionary), the <a href="https://dictionaryapi.dev/" rel="nofollow noopener" target="_blank">Free Dictionary API</a>, and the public-domain ENABLE word list. WordHelper adds structure, quality checks, internal linking, tools, and correction paths to make the data more useful.</p>
      <p>Only pages that pass a quality gate — a complete definition, pronunciation, syllables, examples, and synonyms — are listed and indexed; thinner pages stay <code>noindex</code> until the data improves. Pages are updated as sources improve, and every word profile carries a <a href="/corrections/">report a correction</a> link. Full sourcing and license attribution is on the <a href="/editorial-policy/">Editorial Policy</a> page.</p>
    </div>
  </section>
  <section class="section">
    <div class="section-heading">
      <p class="eyebrow">Explore next</p>
      <h2>Move from a word to the next useful step</h2>
    </div>
    <div class="card-grid">
      ${cardLink("/tools/word-finder/", "Find words that contain specific letters, by length or pattern.")}
      ${cardLink("/tools/word-unscramble/", "Turn a jumble of letters into valid words.")}
      ${cardLink("/tools/anagram-solver/", "Find exact and partial anagrams of your letters.")}
      ${cardLink("/tools/rhyme-finder/", "Perfect and near rhymes for any word.")}
      ${cardLink("/words/", "Browse complete word profiles A to Z.")}
      ${cardLink("/word-lists/", "Curated vocabulary collections for writing and study.")}
      ${cardLink("/practice/vocabulary-quiz/", "Practise recalling the words you discover.")}
    </div>
  </section>`;

  const schemas = [
    {
      "@type": "CollectionPage",
      name: hub.metaTitle,
      url: absolute(hub.href),
      description: hub.metaDescription,
    },
    breadcrumbSchema(page),
  ];

  return { href: hub.href, html: layout(page, body, schemas) };
}

function renderLearnHub() {
  const hub = learnHubData;
  const page = {
    href: hub.href,
    title: hub.title,
    metaTitle: hub.metaTitle,
    metaDescription: hub.metaDescription,
  };

  const lessonCards = lessons
    .map(
      (l) => `<a class="resource-card lesson-card" href="${l.href}">
        <strong class="lesson-card-title">${escapeHtml(l.title)}</strong>
        <span class="lesson-card-intro">${escapeHtml(l.intro)}</span>
      </a>`,
    )
    .join("");

  const body = `<section class="page-hero">
    ${breadcrumb(page)}
    <p class="eyebrow">Learn English</p>
    <h1>${escapeHtml(hub.h1)}</h1>
    <p class="hero-lede">${escapeHtml(hub.intro)}</p>
    ${answerBlock(hub.answer)}
  </section>
  <section class="section">
    <div class="section-heading">
      <p class="eyebrow">Guides</p>
      <h2>English vocabulary and word skills</h2>
      <p>Each guide covers one skill in plain English — no jargon, no filler. Read one when you need it.</p>
    </div>
    <div class="lesson-grid">${lessonCards}</div>
  </section>
  <section class="section split">
    <div>
      <p class="eyebrow">Plain English guides</p>
      <h2>Learn at any level</h2>
    </div>
    <div class="text-stack">
      <p>Every guide in the Learn English section is written for learners at any level — from beginners looking for vocabulary strategies to confident writers who want to understand how rhyme and spelling patterns work.</p>
      <p>Guides cover practical skills: how to build a vocabulary that sticks, how to decode unfamiliar words from context, how syllables affect pronunciation, and how word families multiply what you know.</p>
      <p>Use the guides alongside Word Helper's ${TOOL_COUNT} word tools and the Word Explorer for a complete English vocabulary practice.</p>
    </div>
  </section>`;

  const schemas = [
    {
      "@type": "CollectionPage",
      name: hub.metaTitle,
      url: absolute(hub.href),
      description: hub.metaDescription,
    },
    breadcrumbSchema(page),
  ];

  return { href: hub.href, html: layout(page, body, schemas) };
}

function renderLesson(lesson) {
  const page = {
    href: lesson.href,
    title: lesson.title,
    metaTitle: lesson.metaTitle,
    metaDescription: lesson.metaDescription,
  };

  const sectionHtml = lesson.sections
    .map((s) => {
      const paragraphs = s.body.split("\n\n").map((p) => {
        const trimmed = p.trim();
        if (!trimmed) return "";
        if (trimmed.startsWith("•") || trimmed.match(/^[\*\-] /m)) {
          const lines = trimmed.split("\n").map((line) => {
            const clean = line.replace(/^[•\*\-]\s*/, "");
            const bolded = clean.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
            return `<li>${escapeHtml(bolded).replace(/&lt;strong&gt;/g, "<strong>").replace(/&lt;\/strong&gt;/g, "</strong>")}</li>`;
          });
          return `<ul>${lines.join("")}</ul>`;
        }
        const bolded = trimmed.replace(/\*\*(.*?)\*\*/g, (_, m) => `<strong>${escapeHtml(m)}</strong>`);
        return `<p>${escapeHtml(trimmed).replace(/\*\*(.*?)\*\*/g, (_, m) => `<strong>${escapeHtml(m)}</strong>`)}</p>`;
      });
      return `<section id="${slugify(s.heading)}"><h2>${escapeHtml(s.heading)}</h2>${paragraphs.join("")}</section>`;
    })
    .join("");

  const relatedLessonLinks = (lesson.relatedLessons || []).map((href) => {
    const found = lessons.find((l) => l.href === href);
    return found
      ? `<a class="resource-card" href="${found.href}"><strong>${escapeHtml(found.title)}</strong><span>${escapeHtml(found.intro)}</span></a>`
      : "";
  }).join("");

  const body = `<article class="article-page">
    ${breadcrumb(page)}
    <p class="eyebrow">Learn English</p>
    <h1>${escapeHtml(lesson.h1)}</h1>
    ${reviewedMeta("Learning guide reviewed")}
    ${answerBlock(lesson.answer)}
    ${tableOfContents(lesson.sections)}
    <div class="article-body">
      ${sectionHtml}
    </div>
    <section class="section compact">
      <div class="section-heading">
        <p class="eyebrow">Related Word Experiences</p>
        <h2>Try these next</h2>
      </div>
      <div class="card-grid">${lesson.relatedTools.map((href) => cardLink(href)).join("")}</div>
    </section>
    ${relatedLessonLinks ? `<section class="section compact">
      <div class="section-heading">
        <p class="eyebrow">More guides</p>
        <h2>Continue learning</h2>
      </div>
      <div class="lesson-grid">${relatedLessonLinks}</div>
    </section>` : ""}
    ${faqList(lesson.faqs)}
  </article>`;

  const schemas = [
    {
      "@type": "Article",
      headline: lesson.h1,
      name: lesson.title,
      url: absolute(lesson.href),
      description: lesson.metaDescription,
      datePublished: SITE_CONTENT_START,
      dateModified: new Date().toISOString().split("T")[0],
      author: {
        "@type": "Organization",
        name: site.name,
        url: `${site.url}/`,
      },
      publisher: ARTICLE_PUBLISHER(),
    },
    breadcrumbSchema(page),
    faqSchema(lesson.faqs),
  ];

  return { href: lesson.href, html: layout(page, body, schemas) };
}

// ── Word Lab Hub ──────────────────────────────────────────────────
function renderWordLab() {
  const page = {
    href: "/word-lab/",
    title: "Word Lab — " + TOOL_COUNT + " Interactive Word Tools",
    metaTitle: "Word Lab — Interactive Word Tools | Word Helper",
    metaDescription:
      "Word Lab is Word Helper's collection of " + TOOL_COUNT + " interactive word tools: Word Unscramble, Anagram Solver, Rhyme Finder, Syllable Counter, Prefix Finder, Suffix Finder, Word Finder, Synonym Finder, Antonym Finder, Word Counter, and Random Word Generator.",
  };

  const body = `<section class="page-hero">
    ${breadcrumb(page)}
    <p class="eyebrow">Word Helper tools</p>
    <h1>Tools</h1>
    <p class="hero-lede">${TOOL_COUNT} focused word tools for letters, anagrams, rhymes, syllables, prefixes, suffixes, synonyms, antonyms, counting, and random words. Each tool has clear inputs, honest results, and a plain explanation of what it can and cannot do.</p>
    ${answerBlock("Word Lab has " + TOOL_COUNT + " word tools for specific tasks. Word Unscramble finds all valid words from a set of letters. Anagram Solver finds exact and partial anagrams. Rhyme Finder returns rhyme ideas. Syllable Counter breaks any text into syllable counts. Prefix and Suffix Finders show words by starting or ending letters. Word Finder searches by contained letters, the Synonym and Antonym Finders surface similar and opposite words, the Word Counter measures text, and the Random Word Generator produces words on demand.")}
  </section>
  <section class="section">
    <div class="section-heading">
      <p class="eyebrow">All Word Experiences</p>
      <h2>Choose your word task</h2>
    </div>
    <div class="card-grid">
      ${tools.map((tool) => toolCard(tool)).join("")}
    </div>
  </section>
  <section class="section split">
    <div>
      <p class="eyebrow">What powers Word Lab</p>
      <h2>What the tools are built on</h2>
    </div>
    <div class="text-stack">
      <p>Every Word Lab tool uses the same validated in-browser dictionary of ${TOOL_DICT_COUNT.toLocaleString()} English words, drawn from the public-domain ENABLE word list, a supplementary word list, and Word Helper's published word pages.</p>
      <p>Letter frequency matching ensures results are accurate: a word only appears if all its letters can be built from the letters you entered. Duplicates are handled correctly — two copies of a letter require two copies in the input.</p>
      <p>Rhyme and syllable tools use pattern-matching logic, with clear notes on where accent and dialect variation can affect results.</p>
    </div>
  </section>
  <section class="section">
    <div class="section-heading">
      <p class="eyebrow">Keep exploring</p>
      <h2>More from Word Helper</h2>
    </div>
    <div class="card-grid">
      <a class="resource-card" href="/word-explorer/">
        <span class="card-icon">${icon("wordexplorer")}</span>
        <strong>Word Explorer</strong>
        <span>In-depth word pages with meanings, pronunciation, synonyms, and examples covering all 26 letters.</span>
      </a>
      <a class="resource-card" href="/word-lists/">
        <span class="card-icon">${icon("wordlists")}</span>
        <strong>Word Lists</strong>
        <span>Hand-curated word collections for common words, positive vocabulary, academic English, and writing.</span>
      </a>
      <a class="resource-card" href="/practice/">
        <span class="card-icon">${icon("practice")}</span>
        <strong>Practice</strong>
        <span>Vocabulary quizzes powered by Word Explorer definitions, with instant feedback.</span>
      </a>
    </div>
  </section>`;

  const schemas = [
    {
      "@type": "CollectionPage",
      name: page.metaTitle,
      url: absolute(page.href),
      description: page.metaDescription,
    },
    breadcrumbSchema(page),
  ];

  return { href: page.href, html: layout(page, body, schemas) };
}

// ── Word Lists Hub ────────────────────────────────────────────────
function renderWordListsHub() {
  const hub = wordListsHubData;
  const page = {
    href: hub.href,
    title: hub.title,
    metaTitle: hub.metaTitle,
    metaDescription: hub.metaDescription,
  };

  const listCards = wordLists
    .map(
      (l) => `<a class="resource-card lesson-card" href="${l.href}">
        <div class="wl-card-meta">
          <span class="wl-badge">${escapeHtml(l.category)}</span>
          <span class="wl-count">${l.wordCount} words</span>
        </div>
        <strong class="lesson-card-title">${escapeHtml(l.title)}</strong>
        <span class="lesson-card-intro">${escapeHtml(l.intro)}</span>
      </a>`,
    )
    .join("");

  const body = `<section class="page-hero">
    ${breadcrumb(page)}
    <p class="eyebrow">Word Helper</p>
    <h1>${escapeHtml(hub.h1)}</h1>
    <p class="hero-lede">${escapeHtml(hub.intro)}</p>
    ${answerBlock(hub.answer)}
  </section>
  <section class="section">
    <div class="section-heading">
      <p class="eyebrow">All lists</p>
      <h2>Browse by category</h2>
      <p>Each list includes the word, its part of speech, a plain-English meaning, and an example sentence. Where a full word page exists, each entry links to it.</p>
    </div>
    <div class="lesson-grid">${listCards}</div>
  </section>
  <section class="section split">
    <div>
      <p class="eyebrow">How word lists help</p>
      <h2>Vocabulary by theme, not by accident</h2>
    </div>
    <div class="text-stack">
      <p>Learning words in thematic groups is more effective than learning random words in sequence. When words share a context — positive feelings, academic writing, strong verbs — each new word reinforces the others and sits in a mental framework that makes recall easier.</p>
      <p>Word Helper's word lists are hand-curated, not generated automatically. Every word is chosen because it genuinely belongs on the list, and each entry includes a plain-English meaning and an example sentence.</p>
      <p>Use word lists alongside Word Explorer, Learn English guides, and Practice quizzes for a complete vocabulary learning experience.</p>
    </div>
  </section>`;

  const schemas = [
    {
      "@type": "CollectionPage",
      name: hub.metaTitle,
      url: absolute(hub.href),
      description: hub.metaDescription,
    },
    breadcrumbSchema(page),
  ];

  return { href: hub.href, html: layout(page, body, schemas) };
}

// ── Individual Word List Page ─────────────────────────────────────
function renderWordList(list) {
  const page = {
    href: list.href,
    title: list.title,
    metaTitle: list.metaTitle,
    metaDescription: list.metaDescription,
  };

  const rows = list.words
    .map(
      (entry) => {
        // Only link when a real published page exists (publishedWordSet is the
        // single source of truth). Avoids broken /word/ links to words that were
        // never enriched, and avoids ?w= lookup URLs in the crawl.
        const slug = String(entry.word).toLowerCase().trim().replace(/\s+/g, "-");
        const linkable = publishedWordSet.has(slug);
        return `<tr data-word-list-row data-filter-text="${escapeHtml(`${entry.word} ${entry.partOfSpeech} ${entry.meaning} ${entry.example}`.toLowerCase())}">
        <td>${linkable
          ? `<a href="/word/${encodeURIComponent(slug)}/" class="wl-word-link">${escapeHtml(entry.word)}</a>`
          : `<span>${escapeHtml(entry.word)}</span>`}</td>
        <td><span class="pos-mini">${escapeHtml(entry.partOfSpeech)}</span></td>
        <td>${escapeHtml(entry.meaning)}</td>
        <td class="wl-example">${escapeHtml(entry.example)}</td>
      </tr>`;
      },
    )
    .join("");

  const body = `<article class="article-page">
    ${breadcrumb(page)}
    <p class="eyebrow">Word List · ${escapeHtml(list.category)}</p>
    <h1>${escapeHtml(list.h1)}</h1>
    ${answerBlock(list.answer)}
    ${reviewedMeta("Curated word list")}
    <div class="wl-meta-row">
      <span class="wl-badge">${escapeHtml(list.category)}</span>
      <span class="wl-difficulty">${escapeHtml(list.difficulty)}</span>
      <span class="wl-count">${list.wordCount} words</span>
    </div>
    ${list.audience ? `<p class="wl-audience"><strong>Who it&rsquo;s for:</strong> ${escapeHtml(list.audience)}</p>` : ""}
    ${Array.isArray(list.useCases) && list.useCases.length ? `<section class="wl-usecases">
      <h2>When this list helps</h2>
      <ul>${list.useCases.map((u) => `<li>${escapeHtml(u)}</li>`).join("")}</ul>
    </section>` : ""}
    <div class="word-list-toolbar">
      <label>Filter this list <input class="word-list-filter" type="search" autocomplete="off" placeholder="Search within ${escapeHtml(list.title)}"></label>
      <p class="word-list-count" aria-live="polite">${list.wordCount} words shown</p>
    </div>
    <div class="wl-table-wrap">
      <table class="wl-table">
        <thead>
          <tr>
            <th>Word</th>
            <th>Part of speech</th>
            <th>Meaning</th>
            <th>Example</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
    </div>
    ${list.tip ? `<p class="wl-tip">${icon("spark")} <span><strong>Writing tip:</strong> ${escapeHtml(list.tip)}</span></p>` : ""}
    <section class="source-note">
      <h2>Source &amp; usage note</h2>
      <p>These word list entries are curated for learning and writing. Where a full Word Explorer page exists, the word links to deeper information. Word-game acceptance can vary by dictionary, region, and rule set.</p>
    </section>
    <section class="section compact">
      <div class="section-heading">
        <p class="eyebrow">More word lists</p>
        <h2>Browse other lists</h2>
      </div>
      <div class="lesson-grid">
        ${wordLists.filter((l) => l.id !== list.id).slice(0, 3).map((l) =>
          `<a class="resource-card lesson-card" href="${l.href}">
            <strong class="lesson-card-title">${escapeHtml(l.title)}</strong>
            <span class="lesson-card-intro">${escapeHtml(l.intro)}</span>
          </a>`).join("")}
      </div>
    </section>
    <section class="section compact">
      <div class="section-heading">
        <p class="eyebrow">Word Lab</p>
        <h2>Explore words further</h2>
      </div>
      <div class="card-grid">
        <a class="resource-card" href="/word-explorer/">
          <span class="card-icon">${icon("wordexplorer")}</span>
          <strong>Word Explorer</strong>
          <span>Get full definition, pronunciation, synonyms, and word family for ${words.length} curated words across all 26 letters.</span>
        </a>
        <a class="resource-card" href="/practice/vocabulary-quiz/">
          <span class="card-icon">${icon("practice")}</span>
          <strong>Vocabulary Quiz</strong>
          <span>Test your knowledge of Word Explorer words with a multiple-choice quiz.</span>
        </a>
      </div>
    </section>
    ${faqList([
      {
        q: `How should I use ${list.title}?`,
        a: "Scan the list for words that fit your purpose, then use the filter box to narrow by meaning, part of speech, or spelling pattern.",
      },
      {
        q: "Are these words accepted in every word game?",
        a: "No. Word game acceptance depends on the specific game dictionary and rule set.",
      },
      {
        q: "Can I copy words from the list?",
        a: "Yes. You can select and copy words directly from the table for study notes, lesson plans, or drafting.",
      },
    ])}
  </article>`;

  const schemas = [
    {
      "@type": "Article",
      headline: list.h1,
      name: list.title,
      url: absolute(list.href),
      description: list.metaDescription,
      datePublished: SITE_CONTENT_START,
      dateModified: new Date().toISOString().split("T")[0],
      author: { "@type": "Organization", name: site.name, url: `${site.url}/` },
      publisher: ARTICLE_PUBLISHER(),
    },
    {
      "@type": "ItemList",
      name: list.title,
      description: list.metaDescription,
      numberOfItems: list.words.length,
      itemListElement: list.words.slice(0, 100).map((entry, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: entry.word,
        ...(entry.wordPageHref ? { url: absolute(entry.wordPageHref) } : {}),
      })),
    },
    breadcrumbSchema(page),
    faqSchema([
      {
        q: `How should I use ${list.title}?`,
        a: "Scan the list for words that fit your purpose, then use the filter box to narrow by meaning, part of speech, or spelling pattern.",
      },
      {
        q: "Are these words accepted in every word game?",
        a: "No. Word game acceptance depends on the specific game dictionary and rule set.",
      },
      {
        q: "Can I copy words from the list?",
        a: "Yes. You can select and copy words directly from the table for study notes, lesson plans, or drafting.",
      },
    ]),
  ];

  return { href: list.href, html: layout(page, body, schemas) };
}

// ── Practice Hub ──────────────────────────────────────────────────
function renderPracticeHub() {
  const page = {
    href: "/practice/",
    title: "Practice — Word Quizzes and Vocabulary Tests",
    metaTitle: "Practice English Vocabulary — Quizzes and Word Tests | Word Helper",
    metaDescription:
      "Practice English vocabulary with Word Helper quizzes: a vocabulary quiz, word family quiz, and synonym match covering the full set of Word Explorer entries, with instant feedback.",
  };

  const practiceHubFaqs = [
    {
      q: "What vocabulary quizzes does Word Helper offer?",
      a: `Word Helper offers three quizzes: a Vocabulary Quiz (match a definition to the correct word), a Word Family Quiz (pick the right noun, verb, adjective, or adverb form of a word), and Synonym Match (pair each word with its closest synonym). All three draw from Word Helper's ${words.length} Word Explorer words.`,
    },
    {
      q: "Do I need an account to use the practice quizzes?",
      a: "All three quizzes run in your browser with instant feedback after every answer. There is no leaderboard or time limit — work through questions at your own pace.",
    },
    {
      q: "Which quiz should I start with?",
      a: "Start with the Vocabulary Quiz if you want to test how many Word Explorer definitions you know. Try the Word Family Quiz if you want to improve your grammar accuracy — it tests whether you know how words shift between noun, verb, adjective, and adverb forms. Use Synonym Match to build vocabulary range and explore how closely related words differ.",
    },
    {
      q: "How do the quizzes connect to Word Explorer?",
      a: "All quiz content is drawn directly from Word Explorer. Every word you see in a quiz has a Word Explorer page with its definition, pronunciation or syllables, synonyms, related words, and examples (and more where available). If you miss a question, visit the word's page to study it before the next session.",
    },
  ];

  const body = `<section class="page-hero">
    ${breadcrumb(page)}
    <p class="eyebrow">Word Helper</p>
    <h1>Practice English Vocabulary</h1>
    <p class="hero-lede">Three interactive quizzes built from Word Explorer data — test your knowledge of definitions, word families, and synonyms, with instant feedback at your own pace.</p>
    ${answerBlock(`Word Helper offers three types of vocabulary practice: a definition quiz, a word family quiz, and a synonym matching game. All questions are drawn from the same ${words.length} words in Word Explorer so every quiz reinforces what you read in Word Explorer. Use the quizzes as a spaced-review check after studying word pages, or as a quick vocabulary warmup.`)}
  </section>
  <section class="section">
    <div class="section-heading">
      <p class="eyebrow">Choose a quiz</p>
      <h2>Three ways to practise English vocabulary</h2>
    </div>
    <div class="card-grid">
      <a class="resource-card" href="/practice/vocabulary-quiz/">
        <span class="card-icon">${icon("practice")}</span>
        <strong>Vocabulary Quiz</strong>
        <span>Read a definition. Pick the right word from four options. Instant feedback after every question. Covers all ${words.length} Word Explorer words.</span>
      </a>
      <a class="resource-card" href="/practice/word-family-quiz/">
        <span class="card-icon">${icon("wordexplorer")}</span>
        <strong>Word Family Quiz</strong>
        <span>Find the noun, verb, adjective, or adverb form of a base word. Tests grammar accuracy and vocabulary range. 20 questions per session.</span>
      </a>
      <a class="resource-card" href="/practice/synonym-match/">
        <span class="card-icon">${icon("learn")}</span>
        <strong>Synonym Match</strong>
        <span>Match each word to its closest synonym. Click a word, then click its match. Eight pairs per round, unlimited rounds.</span>
      </a>
    </div>
  </section>
  <section class="section split">
    <div>
      <p class="eyebrow">How to get the most from practice</p>
      <h2>Read first, then test</h2>
    </div>
    <div class="text-stack">
      <p>The most effective vocabulary practice follows a simple pattern: read the word page in Word Explorer first — definition, examples, synonyms, and word family — then take a quiz to test whether that reading turned into real recall. This active-recall step is more durable than passive re-reading.</p>
      <p>All three quizzes use the same ${words.length} Word Explorer words. Questions are shuffled each session so you face a different order every time. After a session, review any words you missed in Word Explorer before quizzing again. This spaced review approach builds longer-lasting vocabulary than a single study session.</p>
      <p>Use the quizzes as a quick vocabulary check or as focused daily practice. They run entirely in your browser with instant feedback after each answer.</p>
    </div>
  </section>
  ${faqList(practiceHubFaqs)}`;

  const schemas = [
    {
      "@type": "CollectionPage",
      name: page.metaTitle,
      url: absolute(page.href),
      description: page.metaDescription,
    },
    breadcrumbSchema(page),
  ];

  return { href: page.href, html: layout(page, body, schemas) };
}

// ── Vocabulary Quiz Page ──────────────────────────────────────────
function renderVocabQuiz() {
  const page = {
    href: "/practice/vocabulary-quiz/",
    title: "Vocabulary Quiz — Match Definitions to Words",
    metaTitle: "Vocabulary Quiz — Match Definitions to Words | Word Helper",
    metaDescription:
      "Test your vocabulary: read a definition and pick the correct word from four choices, drawn from Word Explorer, with instant feedback.",
  };

  const quizWords = words.map((w) => ({
    word: w.word,
    def: w.shortDef,
    pos: w.partOfSpeech,
    synonyms: w.synonyms ? w.synonyms.slice(0, 3) : [],
  }));

  // Sample questions for pre-rendered SEO content (first 4 words)
  const sampleQs = words.slice(0, 4).map((w) => ({
    def: w.shortDef,
    answer: w.word,
    pos: w.partOfSpeech,
  }));

  const quizFaqs = [
    {
      q: "What does this vocabulary quiz test?",
      a: "The vocabulary quiz shows you a short definition and asks you to pick the correct word from four choices. All definitions are drawn from Word Helper's Word Explorer, which covers complete word pages with definitions, pronunciation, synonyms, and examples.",
    },
    {
      q: "How many questions are in the vocabulary quiz?",
      a: `The quiz covers all ${words.length} Word Explorer words. Questions are shuffled each session so the order changes. You can restart as many times as you like to improve your score.`,
    },
    {
      q: "Does the quiz give feedback on wrong answers?",
      a: "Yes. After each question you see whether your answer was correct, which word was right if you missed it, and the definition again for review. This immediate feedback can help reinforce memory more than simply rereading definitions.",
    },
    {
      q: "Do I need to create an account?",
      a: "The vocabulary quiz runs entirely in your browser. Your answers are not stored on a server — it is a quick, self-contained vocabulary check.",
    },
    {
      q: "How can I use this quiz to learn vocabulary effectively?",
      a: "Use the quiz as a spaced review tool. Read a word's full page in Word Explorer first, then take the quiz to test recall. Return to missed words and re-read their definitions before quizzing again. Testing yourself before reviewing (often called active recall) can help many learners practise more actively than only re-reading a list.",
    },
  ];

  const body = `<section class="page-hero">
    ${breadcrumb(page)}
    <p class="eyebrow">Practice</p>
    <h1>Vocabulary Quiz</h1>
    <p class="hero-lede">Read each definition. Pick the correct word from four choices. Instant feedback after every answer. All ${words.length} Word Explorer words, shuffled every session.</p>
    ${answerBlock("The vocabulary quiz tests whether you can match a short definition to the correct English word. Questions are drawn from Word Helper's Word Explorer — the same definitions, pronunciations, and word families you can study on each word page. It is a quick way to practise recalling words actively, rather than only recognising them on a page.")}
  </section>
  <section class="section">
    <div id="quiz-shell" class="quiz-shell" data-words='${JSON.stringify(quizWords).replace(/'/g, "&#039;")}'>
      <div id="quiz-status" class="quiz-status" aria-live="polite">
        <span id="quiz-q-num">Question 1</span> of <span id="quiz-total">${quizWords.length}</span>
        <span class="quiz-score-label">Score: <span id="quiz-score">0</span></span>
      </div>
      <div id="quiz-card" class="quiz-card">
        <div id="quiz-def" class="quiz-definition"></div>
        <div id="quiz-pos" class="quiz-pos"></div>
        <div id="quiz-choices" class="quiz-choices" role="group" aria-label="Answer choices"></div>
        <div id="quiz-feedback" class="quiz-feedback" role="status" aria-live="polite" hidden></div>
        <div id="quiz-nav" class="quiz-nav" hidden>
          <button id="quiz-next" class="button primary">Next question</button>
        </div>
      </div>
      <div id="quiz-complete" class="quiz-complete" hidden>
        <h2>Quiz complete!</h2>
        <p id="quiz-final-score"></p>
        <div id="quiz-review" class="quiz-review"></div>
        <button id="quiz-restart" class="button primary">Restart quiz</button>
        <a class="button secondary" href="/word-explorer/">Explore words</a>
      </div>
    </div>
  </section>
  <section class="section split">
    <div>
      <p class="eyebrow">Sample questions</p>
      <h2>What the quiz looks like</h2>
    </div>
    <div class="text-stack">
      ${sampleQs.map((q) => `<article>
        <h3>Definition: "${escapeHtml(q.def)}"</h3>
        <p>Part of speech: ${escapeHtml(q.pos)} &mdash; Answer: <strong>${escapeHtml(q.answer)}</strong></p>
      </article>`).join("")}
    </div>
  </section>
  <section class="section split">
    <div>
      <p class="eyebrow">Why it works</p>
      <h2>Practise recall, not just re-reading</h2>
    </div>
    <div class="text-stack">
      <p>Vocabulary quizzes can help many learners practise recall more actively than rereading a list. Use the quiz as one part of a regular review habit, alongside reading and writing — recalling a word before checking the answer makes you retrieve it from memory.</p>
      <p>Use this quiz as the second step after reading a word's full page in Word Explorer. Read the definition, examples, and synonyms first. Then test yourself here. Return to any words you missed and re-read them before quizzing again.</p>
      <p>Short practice sessions can be useful for reviewing words, but results vary by learner and study method. Spacing a few short sessions across several days tends to suit many learners better than one long session.</p>
    </div>
  </section>
  ${faqList(quizFaqs)}
  <section class="section compact">
    <div class="section-heading">
      <p class="eyebrow">Keep learning</p>
      <h2>More practice and word resources</h2>
    </div>
    <div class="card-grid">
      <a class="resource-card" href="/practice/word-family-quiz/">
        <span class="card-icon">${icon("wordexplorer")}</span>
        <strong>Word Family Quiz</strong>
        <span>Given a base word, pick the noun, verb, adjective, or adverb form. Tests grammar knowledge.</span>
      </a>
      <a class="resource-card" href="/practice/synonym-match/">
        <span class="card-icon">${icon("learn")}</span>
        <strong>Synonym Match</strong>
        <span>Match each word to its closest synonym. Eight pairs per round.</span>
      </a>
      <a class="resource-card" href="/word-explorer/">
        <span class="card-icon">${icon("wordexplorer")}</span>
        <strong>Word Explorer</strong>
        <span>Read full word pages with definitions, synonyms, word families, and examples — then quiz yourself here.</span>
      </a>
    </div>
  </section>`;

  const schemas = [
    { "@type": "WebPage", name: page.metaTitle, url: absolute(page.href), description: page.metaDescription, dateModified: new Date().toISOString().split("T")[0] },
    breadcrumbSchema(page),
    faqSchema(quizFaqs),
  ];

  return { href: page.href, html: layout(page, body, schemas) };
}

// ── Word Family Quiz ───────────────────────────────────────────────
function renderWordFamilyQuiz() {
  const page = {
    href: "/practice/word-family-quiz/",
    title: "Word Family Quiz — Nouns, Verbs, Adjectives and Adverbs",
    metaTitle: "Word Family Quiz — Nouns, Verbs, Adjectives and Adverbs | Word Helper",
    metaDescription:
      "Practice English word families: given a base word, choose the correct noun, verb, adjective, or adverb form, with instant feedback.",
  };

  const questions = [];
  for (const w of words) {
    if (!w.wordFamily || !w.wordFamily.length) continue;
    for (const member of w.wordFamily) {
      questions.push({ base: w.word, targetPos: member.pos, answer: member.word });
    }
  }

  // Sample word families for static content
  const sampleFamilies = words.filter((w) => w.wordFamily && w.wordFamily.length >= 3).slice(0, 4);

  const wfFaqs = [
    {
      q: "What is a word family quiz?",
      a: "A word family quiz tests your ability to recognise how a word changes form across different parts of speech. You are given a base word and asked to supply the noun, verb, adjective, or adverb form. For example, given 'beautiful' and asked for the adverb form, the answer is 'beautifully'.",
    },
    {
      q: "Why do word families matter for learning English?",
      a: "Knowing a word's full family dramatically multiplies your vocabulary. If you learn one base word, you immediately gain access to its noun, verb, adjective, and adverb forms — often four or five words at once. This is more efficient than learning isolated, unrelated words.",
    },
    {
      q: "How many questions does the word family quiz include?",
      a: `The quiz draws from ${questions.length} word family pairs across all ${words.length} Word Explorer words. Each session uses 20 randomly selected questions so the content varies each time.`,
    },
    {
      q: "What are examples of English word families?",
      a: "Examples include: beautiful → beautifully (adverb), beauty (noun), beautify (verb). Create → creation (noun), creative (adjective), creatively (adverb). Challenge → challenging (adjective), challenged (verb past tense). Knowing these patterns helps you read and write more accurately.",
    },
  ];

  const body = `<section class="page-hero">
    ${breadcrumb(page)}
    <p class="eyebrow">Practice</p>
    <h1>Word Family Quiz</h1>
    <p class="hero-lede">Given a base word, choose the correct noun, verb, adjective, or adverb form. Tests your knowledge of how English words change across parts of speech.</p>
    ${answerBlock("A word family quiz builds grammar accuracy and vocabulary range at the same time. English words change form depending on their grammatical role — the verb create becomes the noun creation, the adjective creative, and the adverb creatively. Recognising these patterns is one of the fastest ways to expand active vocabulary.")}
  </section>
  <section class="section">
    <div id="wf-shell" class="quiz-shell" data-questions='${JSON.stringify(questions).replace(/'/g, "&#039;")}'>
      <div id="wf-status" class="quiz-status" aria-live="polite">
        <span id="wf-q-num">Question 1</span> of <span id="wf-total">20</span>
        <span class="quiz-score-label">Score: <span id="wf-score">0</span></span>
      </div>
      <div id="wf-card" class="quiz-card">
        <div id="wf-prompt" class="quiz-definition"></div>
        <div id="wf-pos" class="quiz-pos"></div>
        <div id="wf-choices" class="quiz-choices" role="group" aria-label="Answer choices"></div>
        <div id="wf-feedback" class="quiz-feedback" role="status" aria-live="polite" hidden></div>
        <div id="wf-nav" class="quiz-nav" hidden>
          <button id="wf-next" class="button primary">Next question</button>
        </div>
      </div>
      <div id="wf-complete" class="quiz-complete" hidden>
        <h2>Quiz complete!</h2>
        <p id="wf-final-score"></p>
        <div id="wf-review" class="quiz-review"></div>
        <button id="wf-restart" class="button primary">Play again</button>
        <a class="button secondary" href="/practice/synonym-match/">Try Synonym Match</a>
      </div>
    </div>
  </section>
  <section class="section split">
    <div>
      <p class="eyebrow">Example families</p>
      <h2>Word families you will practise</h2>
    </div>
    <div class="feature-list">
      ${sampleFamilies.map((w) => `<article>
        <h3>${escapeHtml(w.word.charAt(0).toUpperCase() + w.word.slice(1))} word family</h3>
        <p>${escapeHtml(w.word)} (${escapeHtml(w.partOfSpeech)}) → ${w.wordFamily.slice(0, 4).map((m) => `${escapeHtml(m.word)} (${escapeHtml(m.pos)})`).join(", ")}</p>
      </article>`).join("")}
    </div>
  </section>
  ${faqList(wfFaqs)}
  <section class="section compact">
    <div class="section-heading">
      <p class="eyebrow">More practice</p>
      <h2>Keep building vocabulary</h2>
    </div>
    <div class="card-grid">
      <a class="resource-card" href="/practice/vocabulary-quiz/">
        <span class="card-icon">${icon("practice")}</span>
        <strong>Vocabulary Quiz</strong>
        <span>Read a definition, pick the correct word from four choices.</span>
      </a>
      <a class="resource-card" href="/practice/synonym-match/">
        <span class="card-icon">${icon("learn")}</span>
        <strong>Synonym Match</strong>
        <span>Match each word to its closest synonym. Eight pairs per round.</span>
      </a>
      <a class="resource-card" href="/learn-english/understanding-word-families/">
        <span class="card-icon">${icon("learn")}</span>
        <strong>Word Families Guide</strong>
        <span>Read the full guide to understanding how word families work in English.</span>
      </a>
    </div>
  </section>`;

  const schemas = [
    { "@type": "WebPage", name: page.metaTitle, url: absolute(page.href), description: page.metaDescription, dateModified: new Date().toISOString().split("T")[0] },
    breadcrumbSchema(page),
    faqSchema(wfFaqs),
  ];

  return { href: page.href, html: layout(page, body, schemas) };
}

// ── Synonym Match ──────────────────────────────────────────────────
function renderSynonymMatch() {
  const page = {
    href: "/practice/synonym-match/",
    title: "Synonym Match — Match Words to Their Synonyms",
    metaTitle: "Synonym Match — Vocabulary Game for English Learners | Word Helper",
    metaDescription:
      "Match each word to its closest synonym: click a word, then click its match. Eight pairs per round, unlimited rounds, with instant feedback.",
  };

  const pairs = words
    .filter((w) => w.synonyms && w.synonyms.length)
    .map((w) => ({ word: w.word, synonym: w.synonyms[0] }));

  const smFaqs = [
    {
      q: "How does the Synonym Match game work?",
      a: "Click a word on the left side, then click its closest synonym on the right side. A correct match removes both words from the board. An incorrect match shows a brief error state so you can try again. Match all eight pairs to complete the round and advance to the next.",
    },
    {
      q: "Why is matching synonyms useful for learning vocabulary?",
      a: "Synonyms show you how meaning can be expressed with different words of different tone, formality, or specificity. Matching practice trains you to see vocabulary as a range of choices rather than one fixed word per meaning — which makes both reading comprehension and writing more flexible.",
    },
    {
      q: "What words are used in the synonym match game?",
      a: `All pairs come from Word Helper's Word Explorer. Each word has a full page with definition, pronunciation, examples, and word family. After playing, visit the Word Explorer to study any pairs you found difficult.`,
    },
    {
      q: "How many rounds can I play?",
      a: "There are unlimited rounds. Each round uses a new set of eight word-synonym pairs drawn from the full pool. The pool is large enough to keep rounds varied across many sessions.",
    },
  ];

  // Sample pairs for static content
  const samplePairs = words.filter((w) => w.synonyms && w.synonyms.length).slice(0, 6);

  const body = `<section class="page-hero">
    ${breadcrumb(page)}
    <p class="eyebrow">Practice</p>
    <h1>Synonym Match</h1>
    <p class="hero-lede">Click a word on the left, then click its synonym on the right. Match all eight pairs to advance to the next round, with unlimited rounds to practise.</p>
    ${answerBlock("Synonym matching is an effective vocabulary technique because it forces you to compare words by meaning rather than memorise definitions in isolation. Seeing that 'beautiful' pairs with 'lovely' — and understanding the slight difference in tone — is more durable learning than reading each definition separately.")}
  </section>
  <section class="section">
    <div id="sm-shell" class="quiz-shell match-shell" data-pairs='${JSON.stringify(pairs).replace(/'/g, "&#039;")}'>
      <div id="sm-status" class="quiz-status" aria-live="polite">
        <span>Round <span id="sm-round">1</span></span>
        <span class="quiz-score-label">Matched: <span id="sm-matched">0</span> / 8</span>
      </div>
      <div id="sm-game" class="match-game">
        <div class="match-columns">
          <div id="sm-words" class="match-col"></div>
          <div id="sm-synonyms" class="match-col"></div>
        </div>
        <div id="sm-feedback" class="quiz-feedback" role="status" aria-live="polite" hidden></div>
      </div>
      <div id="sm-complete" class="quiz-complete" hidden>
        <h2>Round complete!</h2>
        <p>All 8 pairs matched. Ready for the next round?</p>
        <button id="sm-next-round" class="button primary">Next round</button>
        <a class="button secondary" href="/practice/word-family-quiz/">Try Word Family Quiz</a>
      </div>
    </div>
  </section>
  <section class="section split">
    <div>
      <p class="eyebrow">Sample pairs</p>
      <h2>Words and synonyms you will see</h2>
    </div>
    <div class="feature-list">
      ${samplePairs.map((w) => `<article>
        <h3>${escapeHtml(w.word.charAt(0).toUpperCase() + w.word.slice(1))}</h3>
        <p>Synonyms include: ${escapeHtml(w.synonyms.slice(0, 4).join(", "))}. ${w.shortDef ? escapeHtml(w.shortDef.slice(0, 80)) + "…" : ""}</p>
      </article>`).join("")}
    </div>
  </section>
  ${faqList(smFaqs)}
  <section class="section compact">
    <div class="section-heading">
      <p class="eyebrow">More practice</p>
      <h2>Other vocabulary quizzes</h2>
    </div>
    <div class="card-grid">
      <a class="resource-card" href="/practice/vocabulary-quiz/">
        <span class="card-icon">${icon("practice")}</span>
        <strong>Vocabulary Quiz</strong>
        <span>Read a definition, pick the correct word from four choices.</span>
      </a>
      <a class="resource-card" href="/practice/word-family-quiz/">
        <span class="card-icon">${icon("wordexplorer")}</span>
        <strong>Word Family Quiz</strong>
        <span>Choose the noun, verb, adjective, or adverb form of a base word.</span>
      </a>
      <a class="resource-card" href="/word-lists/">
        <span class="card-icon">${icon("wordlists")}</span>
        <strong>Word Lists</strong>
        <span>Study curated word groups with meanings and examples before quizzing.</span>
      </a>
    </div>
  </section>`;

  const schemas = [
    { "@type": "WebPage", name: page.metaTitle, url: absolute(page.href), description: page.metaDescription, dateModified: new Date().toISOString().split("T")[0] },
    breadcrumbSchema(page),
    faqSchema(smFaqs),
  ];

  return { href: page.href, html: layout(page, body, schemas) };
}

// ── Word Explorer A-Z Letter Page ─────────────────────────────────
const EXPLORER_PER_PAGE = 250;

// Returns an ARRAY of routes (paginated). The explorer lists only words that have
// a real static /word/ page — never ?w= lookup stubs — with crawlable rel prev/next.
function renderWordExplorerLetter(letter, letterWords, allLetterSet) {
  const published = [...letterWords]
    .filter((w) => isCompleteWordEntry(w))
    .sort((a, b) => a.word.localeCompare(b.word));

  const letterSet = allLetterSet || new Set(words.map((w) => w.word[0]));
  const azLinks = "abcdefghijklmnopqrstuvwxyz".split("").map((l) => {
    return letterSet.has(l)
      ? `<a class="az-link${l === letter ? " az-link-active" : ""}" href="/word-explorer/${l}/">${l.toUpperCase()}</a>`
      : `<span class="az-link az-link-empty">${l.toUpperCase()}</span>`;
  }).join("");

  const total = published.length;
  const totalPages = Math.max(1, Math.ceil(total / EXPLORER_PER_PAGE));
  const L = letter.toUpperCase();
  const pageHref = (n) => (n <= 1 ? `/word-explorer/${letter}/` : `/word-explorer/${letter}/${n}/`);

  const routes = [];
  for (let n = 1; n <= totalPages; n++) {
    const slice = published.slice((n - 1) * EXPLORER_PER_PAGE, n * EXPLORER_PER_PAGE);
    const pageLabel = totalPages > 1 ? ` (page ${n} of ${totalPages})` : "";
    const page = {
      href: pageHref(n),
      title: `All Words Starting with ${L}${pageLabel} — A–Z Index`,
      metaTitle: `All Words Starting with ${L}${pageLabel} — A–Z Index | Word Helper`,
      metaDescription: n === 1
        ? `The full alphabetical index of ${L} word pages on Word Helper — every published entry with definition, pronunciation, syllables, synonyms, and examples.`
        : `Page ${n} of ${totalPages} of the alphabetical ${L} word index on Word Helper — each entry with definition, pronunciation, syllables, and examples.`,
      relPrev: n > 1 ? absolute(pageHref(n - 1)) : null,
      relNext: n < totalPages ? absolute(pageHref(n + 1)) : null,
    };

    const cards = slice.map((w) => renderWordCard(w, `data-word="${escapeHtml(w.word)}"`)).join("");
    const pager = totalPages > 1 ? renderExplorerPager(letter, n, totalPages, pageHref) : "";
    const rangeNote = total > 0
      ? `Showing ${((n - 1) * EXPLORER_PER_PAGE + 1).toLocaleString()}–${Math.min(n * EXPLORER_PER_PAGE, total).toLocaleString()} of ${total.toLocaleString()} word pages.`
      : `Word pages starting with ${L} are being added — meanwhile, search any ${L} word from the box above.`;

    const body = `<section class="page-hero">
    ${breadcrumb(page)}
    <p class="eyebrow">Word Explorer</p>
    <h1>All Words Starting with "${L}"</h1>
    <p class="hero-lede">The full A–Z index of "${L}" word pages — each with definition, pronunciation, syllables, synonyms, and examples. Prefer a shorter, curated view? See <a href="/words/${letter}/">common ${L} words</a>.</p>
  </section>
  <section class="section">
    <nav class="az-nav" aria-label="Browse by letter">${azLinks}</nav>
  </section>
  <section class="section">
    <div class="section-heading">
      <p class="eyebrow">Letter ${L}</p>
      <h2>Word pages — ${L}</h2>
      <p>${rangeNote}</p>
    </div>
    ${total > 0 ? `<div class="word-filter-bar">
      <input id="word-filter" class="word-filter-input" type="search" placeholder="Filter words on this page…" aria-label="Filter words">
      <span id="word-filter-count" class="word-filter-count">${slice.length.toLocaleString()} words</span>
    </div>
    <div id="word-explorer-grid" class="word-explorer-grid">${cards}</div>
    <p id="word-filter-empty" class="word-filter-empty" hidden>No words match your search.</p>` : ""}
    ${pager}
  </section>`;

    const schemas = [
      { "@type": "CollectionPage", name: page.metaTitle, url: absolute(page.href), description: page.metaDescription },
      breadcrumbSchema(page),
    ];
    // A letter with no complete pages yet is a thin empty-state — keep it
    // reachable (no 404) but noindex so it never enters the index or sitemap.
    const noindex = total === 0;
    routes.push({ href: page.href, html: layout(page, body, schemas, noindex), noindex });
  }
  return routes;
}

function renderExplorerPager(letter, current, totalPages, pageHref) {
  const L = letter.toUpperCase();
  const link = (n, label, cls = "") =>
    `<a class="explorer-pager-link${cls}" href="${pageHref(n)}"${n === current ? ' aria-current="page"' : ""}>${label}</a>`;
  const parts = [];
  parts.push(current > 1 ? link(current - 1, "‹ Prev", " explorer-pager-edge") : `<span class="explorer-pager-link is-disabled">‹ Prev</span>`);
  // windowed page numbers
  const windowed = new Set([1, totalPages, current, current - 1, current + 1, current - 2, current + 2]);
  let last = 0;
  for (let n = 1; n <= totalPages; n++) {
    if (!windowed.has(n)) continue;
    if (n - last > 1) parts.push(`<span class="explorer-pager-gap">…</span>`);
    parts.push(link(n, String(n), n === current ? " is-active" : ""));
    last = n;
  }
  parts.push(current < totalPages ? link(current + 1, "Next ›", " explorer-pager-edge") : `<span class="explorer-pager-link is-disabled">Next ›</span>`);
  return `<nav class="explorer-pager" aria-label="Word pages for ${L}, pagination">${parts.join("")}</nav>`;
}

// ── Full A-Z Browse: load all words.txt grouped by letter ────────────────────
async function loadAllWordsByLetter() {
  const projectWordList = path.join(root, "src/data/words.txt");
  if (!existsSync(projectWordList)) return {};
  const lines = (await readFile(projectWordList, "utf8"))
    .split(/\r?\n/)
    .map((w) => w.trim().toLowerCase())
    .filter((w) => /^[a-z]{2,}$/.test(w));
  const byLetter = {};
  for (const word of lines) {
    const l = word[0];
    if (!byLetter[l]) byLetter[l] = [];
    byLetter[l].push(word);
  }
  for (const l of Object.keys(byLetter)) {
    byLetter[l] = [...new Set(byLetter[l])].sort((a, b) => a.localeCompare(b));
  }
  return byLetter;
}

// Hub page for /words/ — A-Z letter index
function renderWordsBrowseIndex(completeLetterSet = null, completeCount = 0) {
  const page = {
    href: "/words/",
    title: "Browse Words A to Z | Word Helper",
    metaTitle: "Browse English Words A to Z | Word Helper",
    metaDescription: "Browse English words A to Z in the Word Helper workspace. Every listed word opens a complete page with a definition, examples, synonyms, and related words — or jump to the word tools to search by pattern.",
  };
  const azLinks = "abcdefghijklmnopqrstuvwxyz".split("").map((l) => {
    const hasWords = !completeLetterSet || completeLetterSet.has(l);
    return hasWords
      ? `<a class="az-link" href="/words/${l}/">${l.toUpperCase()}</a>`
      : `<span class="az-link az-link-empty">${l.toUpperCase()}</span>`;
  }).join("");
  const countLine = completeCount > 0
    ? `${completeCount.toLocaleString()} complete word page${completeCount === 1 ? "" : "s"} and growing`
    : "Browsable letter by letter";
  const body = `<section class="page-hero">
    ${breadcrumb(page)}
    <p class="eyebrow">Word Browse</p>
    <h1>Browse English Words A to Z</h1>
    <p class="hero-lede">${countLine}. Every word on these pages opens a complete entry — definition, pronunciation, syllables, synonyms, and examples. New words are added as they reach that standard. Click any letter to start.</p>
  </section>
  <section class="section">
    <div class="section-heading">
      <p class="eyebrow">Choose a letter</p>
      <h2>Browse by starting letter</h2>
    </div>
    <nav class="az-nav" aria-label="Browse words by starting letter">${azLinks}</nav>
  </section>
  <section class="section">
    <div class="section-heading">
      <p class="eyebrow">How to browse smarter</p>
      <h2>Get more from A&ndash;Z browsing</h2>
    </div>
    <div class="text-stack">
      <p>A&ndash;Z browsing is the fastest way to scan vocabulary when you know the starting letter &mdash; for spelling checks, word-game ideas, or rediscovering options you forgot. Each letter page lists complete word pages, sorted by usefulness.</p>
      <p><strong>Why some letters have fewer words:</strong> English simply has more common words starting with letters like S, C, and P than with X, Z, or Q, so those letters show shorter lists. That reflects the language itself, not a gap in coverage.</p>
      <p><strong>Browsing not enough? Search by shape instead:</strong></p>
      <ul>
        <li><a href="/tools/word-finder/">Word Finder</a> &mdash; find words that contain specific letters, by length or pattern.</li>
        <li><a href="/tools/word-unscramble/">Word Unscramble</a> &mdash; turn a jumble of letters into valid words.</li>
        <li><a href="/word-explorer/">Word Explorer</a> &mdash; open in-depth word pages with meanings and related words.</li>
        <li><a href="/word-lists/">Word Lists</a> &mdash; curated, themed sets for writing and study.</li>
        <li><a href="/practice/vocabulary-quiz/">Vocabulary Quiz</a> &mdash; practise the words you discover.</li>
      </ul>
    </div>
  </section>
  <section class="section">
    <div class="section-heading">
      <p class="eyebrow">Word tools</p>
      <h2>Use any word with these tools</h2>
    </div>
    <div class="card-grid">
      <a class="resource-card" href="/tools/word-unscramble/"><strong>Word Unscramble</strong><span>Find valid words from a set of letters.</span></a>
      <a class="resource-card" href="/tools/anagram-solver/"><strong>Anagram Solver</strong><span>Find words using the same letters.</span></a>
      <a class="resource-card" href="/tools/rhyme-finder/"><strong>Rhyme Finder</strong><span>Perfect and near rhymes for any word.</span></a>
      <a class="resource-card" href="/tools/syllable-counter/"><strong>Syllable Counter</strong><span>Count syllables in any word or phrase.</span></a>
      <a class="resource-card" href="/tools/prefix-finder/"><strong>Prefix Explorer</strong><span>All words with a given prefix.</span></a>
      <a class="resource-card" href="/tools/suffix-finder/"><strong>Suffix Explorer</strong><span>All words with a given suffix.</span></a>
    </div>
  </section>`;
  const schemas = [
    { "@type": "CollectionPage", name: page.metaTitle, url: absolute(page.href), description: page.metaDescription },
    breadcrumbSchema(page),
  ];
  return { href: page.href, html: layout(page, body, schemas) };
}

// Letter browse pages: /words/[letter]/ — recommended complete words for a letter.
// 250/page keeps mobile light (compact cards, no heavy JS) while staying crawlable.
const BROWSE_PER_PAGE = 250;
const LETTER_TARGET = 5000;

// Card classification helpers (drive filter chips + micro-meta, all server-rendered).
function browsePosKey(w) {
  const pos = String(w.partOfSpeech || "").split(",")[0].trim().toLowerCase();
  return ["noun", "verb", "adjective", "adverb"].includes(pos) ? pos : "other";
}
function browseLenKey(w) {
  const n = String(w.word).length;
  return n <= 4 ? "short" : n <= 8 ? "medium" : "long";
}
function browseSylKey(w) {
  const s = Number(w.syllables) || 0;
  return s >= 4 ? "4plus" : String(s || 1);
}
// Honest micro-meta: "noun · 3 syllables" (no quality badge — all are complete).
function browseCardMeta(w) {
  const pos = browsePosKey(w) === "other"
    ? String(w.partOfSpeech || "").replace(/\s*,\s*/g, " / ")
    : String(w.partOfSpeech || "").replace(/\s*,\s*/g, " / ");
  const syl = Number(w.syllables) || 0;
  const parts = [];
  if (pos) parts.push(pos);
  if (syl > 0) parts.push(`${syl} syllable${syl === 1 ? "" : "s"}`);
  return parts.join(" · ");
}

function browseCard(w) {
  const diff = wordDifficulty(w);
  const tags = wordClassTags(w).join(" ");
  const meta = browseCardMeta(w);
  const chip = diff === "common"
    ? `<span class="browse-tag tag-common">common</span>`
    : diff === "advanced"
      ? `<span class="browse-tag tag-advanced">advanced</span>`
      : "";
  return `<a class="word-card browse-card" href="${w.href}" data-word="${escapeHtml(w.word)}" data-pos="${browsePosKey(w)}" data-len="${browseLenKey(w)}" data-syl="${browseSylKey(w)}" data-class="${escapeHtml(tags)}"><strong>${escapeHtml(w.word)}</strong>${meta ? `<span class="browse-card-meta">${escapeHtml(meta)}</span>` : ""}${chip}</a>`;
}

// A compact themed pill row (Popular / Common / Advanced / Word-game) — adds
// useful internal links without duplicating the full grid's weight.
function browsePillRow(items) {
  return items
    .map((w) => `<a class="browse-pill" href="${w.href}">${escapeHtml(w.word)}</a>`)
    .join("");
}

function browseFilters(L) {
  const group = (filter, label, opts) =>
    `<div class="filter-group" role="group" aria-label="${label}" data-filter="${filter}">
      <span class="filter-label">${label}</span>
      ${opts.map((o, i) => `<button type="button" class="filter-chip${i === 0 ? " is-active" : ""}" data-val="${o.v}">${o.t}</button>`).join("")}
    </div>`;
  return `<div class="browse-filters" data-browse-filters>
    ${group("pos", "Part of speech", [{ v: "all", t: "All types" }, { v: "noun", t: "Nouns" }, { v: "verb", t: "Verbs" }, { v: "adjective", t: "Adjectives" }, { v: "adverb", t: "Adverbs" }])}
    ${group("class", "Level", [{ v: "all", t: "All levels" }, { v: "common", t: "Common" }, { v: "advanced", t: "Advanced" }, { v: "wordgame", t: "Word-game" }])}
    ${group("len", "Word length", [{ v: "all", t: "Any length" }, { v: "short", t: "Short (≤4)" }, { v: "medium", t: "Medium (5–8)" }, { v: "long", t: "Long (9+)" }])}
    ${group("syl", "Syllables", [{ v: "all", t: "Any syllables" }, { v: "1", t: "1" }, { v: "2", t: "2" }, { v: "3", t: "3" }, { v: "4plus", t: "4+" }])}
  </div>`;
}

// Factual context notes for letters with linguistically fewer words.
// These are honest descriptions — not apologies or filler.
const LETTER_NOTES = {
  j: "J words entered English mainly through French and Latin, then Hebrew (judge, jewel, job). Every valid English J word is listed here.",
  k: "K words in English often share a sound with C. Many K words came from Old Norse, Greek, and German. This is the complete English K word list.",
  q: "Almost every Q word in English is followed by \"u\". Beyond qu- words, valid standalone Q words include qi, qanat, and qoph. This is the complete list.",
  v: "V words entered English from Latin, French, and Germanic languages. This is the complete English V word list.",
  w: "W words come largely from Old English and German roots. This is the complete English W word list.",
  x: "X is the rarest starting letter in English. Most X words are scientific or Greek-origin terms (xeno-, xylo-, xanth-). This page contains every English word starting with X.",
  y: "Y can act as a vowel or consonant in English, making it versatile but less common at the start of words. This is the complete English Y word list.",
  z: "Z words often come from Yiddish, Hebrew, Italian, or Greek. This is the complete English Z word list.",
};

function renderWordsBrowseLetter(letter, letterWords, allLetterSet) {
  const L = letter.toUpperCase();
  // Recommendation-sorted: the most useful words appear first (and on page 1),
  // not a random alphabetical dump. Ties broken alphabetically for stability.
  const entries = [...letterWords].sort(
    (a, b) => wordRecommendationScore(b) - wordRecommendationScore(a) || a.word.localeCompare(b.word),
  );
  const total = entries.length;
  const pageHref = (n) => n <= 1 ? `/words/${letter}/` : `/words/${letter}/${n}/`;

  const azLinks = "abcdefghijklmnopqrstuvwxyz".split("").map((l) => {
    const active = l === letter;
    const hasWords = !allLetterSet || allLetterSet.has(l);
    return hasWords
      ? `<a class="az-link${active ? " az-link-active" : ""}" href="/words/${l}/">${l.toUpperCase()}</a>`
      : `<span class="az-link az-link-empty">${l.toUpperCase()}</span>`;
  }).join("");

  const toolsSection = `<section class="section">
    <div class="section-heading">
      <p class="eyebrow">Word tools</p>
      <h2>Explore any "${L}" word further</h2>
      <p>Paste any word into a tool to find rhymes, count syllables, solve anagrams, or explore prefixes and suffixes.</p>
    </div>
    <div class="card-grid">
      <a class="resource-card" href="/tools/word-unscramble/"><strong>Word Unscramble</strong><span>Find all words from a set of letters.</span></a>
      <a class="resource-card" href="/tools/anagram-solver/"><strong>Anagram Solver</strong><span>Rearrange letters to find new words.</span></a>
      <a class="resource-card" href="/tools/rhyme-finder/"><strong>Rhyme Finder</strong><span>Find perfect and near rhymes.</span></a>
      <a class="resource-card" href="/tools/syllable-counter/"><strong>Syllable Counter</strong><span>Count syllables in any word.</span></a>
      <a class="resource-card" href="/tools/prefix-finder/"><strong>Prefix Explorer</strong><span>Words by prefix pattern.</span></a>
      <a class="resource-card" href="/tools/suffix-finder/"><strong>Suffix Explorer</strong><span>Words by suffix pattern.</span></a>
    </div>
  </section>`;

  // No complete word pages for this letter yet — keep the route reachable so the
  // A-Z nav never 404s, but noindex the thin empty-state.
  if (total === 0) {
    const page = {
      href: pageHref(1),
      title: `Common Words That Start With ${L} | Word Helper`,
      metaTitle: `Common Words That Start With ${L} | Word Helper`,
      metaDescription: `Common word pages starting with ${L} are being added to Word Helper. Browse another letter or search any word.`,
    };
    const body = `<section class="page-hero">
    ${breadcrumb(page)}
    <p class="eyebrow">Browse A–Z</p>
    <h1>Common Words That Start With "${L}"</h1>
    <p class="hero-lede">Complete word pages starting with "${L}" are being added. Browse another letter below, or open the <a href="/word-explorer/">Word Explorer</a>.</p>
  </section>
  <section class="section">
    <nav class="az-nav" aria-label="Browse words by letter">${azLinks}</nav>
  </section>
  ${toolsSection}`;
    const schemas = [
      { "@type": "CollectionPage", name: page.metaTitle, url: absolute(page.href), description: page.metaDescription },
      breadcrumbSchema(page),
    ];
    return [{ href: page.href, html: layout(page, body, schemas, true), noindex: true }];
  }

  const totalPages = Math.max(1, Math.ceil(total / BROWSE_PER_PAGE));
  const routes = [];
  for (let n = 1; n <= totalPages; n++) {
    const slice = entries.slice((n - 1) * BROWSE_PER_PAGE, n * BROWSE_PER_PAGE);
    const pageLabel = totalPages > 1 ? ` — Page ${n} of ${totalPages}` : "";
    const page = {
      href: pageHref(n),
      title: `Common Words That Start With ${L}${pageLabel} | Word Helper`,
      metaTitle: `Common Words That Start With ${L}${pageLabel} | Word Helper`,
      metaDescription: n === 1
        ? `${total.toLocaleString()} common and useful words starting with ${L}, ranked by everyday usefulness — each opens a full page with definition, syllables, synonyms, and examples.`
        : `Page ${n} of ${totalPages} — common, usefulness-ranked words starting with ${L} on Word Helper.`,
      relPrev: n > 1 ? absolute(pageHref(n - 1)) : null,
      relNext: n < totalPages ? absolute(pageHref(n + 1)) : null,
    };

    // Compact, premium cards — word + honest micro-meta ("noun · 3 syllables") +
    // a common/advanced chip. Filterable via server-rendered data-* attributes.
    const cards = slice.map(browseCard).join("");

    const rangeStart = ((n - 1) * BROWSE_PER_PAGE + 1).toLocaleString();
    const rangeEnd = Math.min(n * BROWSE_PER_PAGE, total).toLocaleString();
    // Honest count — every listed word is complete AND recommended.
    const countNote = totalPages > 1
      ? `Showing ${rangeStart}–${rangeEnd} of ${total.toLocaleString()} recommended "${L}" words`
      : `${total.toLocaleString()} recommended "${L}" word${total === 1 ? "" : "s"}`;

    // Themed sections (page 1 only) — Popular / Common / Advanced / Word-game.
    let sectionsHtml = "";
    if (n === 1 && total >= 24) {
      const common = entries.filter((w) => wordDifficulty(w) === "common");
      const advanced = entries.filter((w) => wordDifficulty(w) === "advanced");
      const game = entries
        .filter((w) => isWordGameWord(w) && String(w.word).length <= 7)
        .slice(0, 16);
      const sec = (eyebrow, title, items, blurb) =>
        items.length >= 6
          ? `<section class="section browse-section">
      <div class="section-heading"><p class="eyebrow">${eyebrow}</p><h2>${title}</h2><p>${blurb}</p></div>
      <div class="browse-pill-row">${browsePillRow(items.slice(0, 16))}</div>
    </section>`
          : "";
      sectionsHtml = [
        sec("Popular", `Most useful ${L} words`, entries.slice(0, 16), `The highest-value words starting with ${L} — common, well-defined, and frequently looked up.`),
        sec("Everyday", `Common ${L} words`, common, `Everyday ${L} vocabulary for reading, writing, and conversation.`),
        sec("Vocabulary", `Advanced ${L} vocabulary`, advanced, `Stronger ${L} words for exams, essays, and precise writing.`),
        sec("Word games", `Word-game ${L} words`, game, `Short, high-value ${L} words for Scrabble, anagrams, and puzzles.`),
      ].join("");
    }

    const noteLine = n === 1 && LETTER_NOTES[letter] ? ` ${LETTER_NOTES[letter]}` : "";
    const intro = n === 1
      ? `<p class="hero-lede">${total.toLocaleString()} recommended word${total === 1 ? "" : "s"} that start with "${L}", sorted by usefulness. Every card opens a complete entry — definition, pronunciation, syllables, synonyms, and examples.${noteLine} Want every published "${L}" word? See the <a href="/word-explorer/${letter}/">full ${L} index</a>.</p>`
      : `<p class="hero-lede">Page ${n} of ${totalPages} — recommended "${L}" words ${rangeStart} to ${rangeEnd}, each opening a complete entry.</p>`;

    const pager = totalPages > 1 ? renderWordsBrowsePager(letter, n, totalPages, pageHref) : "";

    const body = `<section class="page-hero">
    ${breadcrumb(page)}
    <p class="eyebrow">Browse A–Z</p>
    <h1>Common Words That Start With "${L}"</h1>
    ${intro}
  </section>
  <section class="section">
    <nav class="az-nav" aria-label="Browse words by letter">${azLinks}</nav>
  </section>
  ${sectionsHtml}
  <section class="section">
    <div class="section-heading"><p class="eyebrow">All ${L} words</p><h2>Browse every recommended "${L}" word</h2></div>
    <div class="word-filter-bar">
      <input id="word-filter" class="word-filter-input" type="search" placeholder="Search ${L} words on this page…" aria-label="Search ${L} words">
      <span id="word-filter-count" class="word-filter-count" data-total="${slice.length}" data-count-suffix=' of ${total.toLocaleString()} recommended "${L}" words'>${countNote}</span>
    </div>
    ${browseFilters(L)}
    <div id="word-explorer-grid" class="word-explorer-grid browse-mode" data-browse-grid>${cards}</div>
    <p id="word-filter-empty" class="word-filter-empty" hidden>No words on this page match your filters.</p>
    ${pager}
  </section>
  ${toolsSection}`;

    const schemas = [
      { "@type": "CollectionPage", name: page.metaTitle, url: absolute(page.href), description: page.metaDescription },
      breadcrumbSchema(page),
    ];
    routes.push({ href: page.href, html: layout(page, body, schemas) });
  }
  return routes;
}

function renderWordsBrowsePager(letter, current, totalPages, pageHref) {
  const L = letter.toUpperCase();
  const link = (n, label, cls = "") =>
    `<a class="explorer-pager-link${cls}" href="${pageHref(n)}"${n === current ? ' aria-current="page"' : ""}>${label}</a>`;
  const parts = [];
  parts.push(current > 1 ? link(current - 1, "‹ Prev", " explorer-pager-edge") : `<span class="explorer-pager-link is-disabled">‹ Prev</span>`);
  const windowed = new Set([1, totalPages, current, current - 1, current + 1, current - 2, current + 2]);
  let last = 0;
  for (let n = 1; n <= totalPages; n++) {
    if (!windowed.has(n)) continue;
    if (n - last > 1) parts.push(`<span class="explorer-pager-gap">…</span>`);
    parts.push(link(n, String(n), n === current ? " is-active" : ""));
    last = n;
  }
  parts.push(current < totalPages ? link(current + 1, "Next ›", " explorer-pager-edge") : `<span class="explorer-pager-link is-disabled">Next ›</span>`);
  return `<nav class="explorer-pager" aria-label="${L} words, page ${current} of ${totalPages}">${parts.join("")}</nav>`;
}

function renderNotFound() {
  const page = {
    href: "/404/",
    title: "Page Not Found — Word Helper",
    metaTitle: "Page Not Found — Word Helper",
    metaDescription: "The page you were looking for was not found. Browse Word Helper tools, word explorer, learning guides, and word lists.",
  };
  const body = `<section class="page-hero centered">
    <p class="eyebrow">404 — Page not found</p>
    <h1>We could not find that page.</h1>
    <p>The page may have moved, the URL may be typed incorrectly, or the content may no longer exist. Use the links below to find what you are looking for.</p>
    <div class="hero-actions" style="justify-content:center;margin-top:24px;">
      <a class="button primary" href="/word-lab/">Open Word Lab</a>
      <a class="button secondary" href="/word-explorer/">Word Explorer</a>
      <a class="button secondary" href="/">Home</a>
    </div>
  </section>
  <section class="section">
    <div class="section-heading">
      <p class="eyebrow">Try these instead</p>
      <h2>Popular starting points</h2>
    </div>
    <div class="card-grid">
      <a class="resource-card" href="/tools/word-unscramble/">
        <span class="card-icon">${icon("unscramble")}</span>
        <strong>Word Unscramble</strong>
        <span>Find all valid words that can be built from a set of letters.</span>
      </a>
      <a class="resource-card" href="/tools/rhyme-finder/">
        <span class="card-icon">${icon("rhyme")}</span>
        <strong>Rhyme Finder</strong>
        <span>Find perfect rhymes and near rhymes for any word.</span>
      </a>
      <a class="resource-card" href="/tools/syllable-counter/">
        <span class="card-icon">${icon("syllable")}</span>
        <strong>Syllable Counter</strong>
        <span>Count syllables in any word, sentence, or paragraph.</span>
      </a>
      <a class="resource-card" href="/word-explorer/">
        <span class="card-icon">${icon("wordexplorer")}</span>
        <strong>Word Explorer</strong>
        <span>Browse word pages with definitions, examples, synonyms, and related words.</span>
      </a>
      <a class="resource-card" href="/word-lists/">
        <span class="card-icon">${icon("wordlists")}</span>
        <strong>Word Lists</strong>
        <span>Curated vocabulary collections for common words, positive language, and more.</span>
      </a>
      <a class="resource-card" href="/guides/">
        <span class="card-icon">${icon("guides")}</span>
        <strong>Guides</strong>
        <span>Practical guides for word tools, poetry, word games, and vocabulary.</span>
      </a>
    </div>
  </section>`;
  return { href: "/404/", html: layout(page, body, [], true) };
}

const WORD_EXCLUDE = new Set([
  "er", "ing", "ly", "ed", "est", "ness", "ment", "tion", "sion", "ful", "ible",
  "pre", "un", "re", "mis", "tac", "ble", "ness", "ry",
]);

function titleCase(word) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

function estimateSyllables(word) {
  const cleaned = word.toLowerCase().replace(/(?:es?|ed)$/, "").replace(/e$/, "");
  const groups = cleaned.match(/[aeiouy]+/g);
  return Math.max(1, groups ? groups.length : 1);
}

function estimateSyllableBreak(word) {
  const count = estimateSyllables(word);
  if (count === 1) return word;
  const chunkSize = Math.ceil(word.length / count);
  const parts = [];
  for (let i = 0; i < word.length; i += chunkSize) {
    parts.push(word.slice(i, i + chunkSize));
  }
  return parts.join("·");
}

async function buildLetterBrowseWords(existingWords = words) {
  const projectWordList = path.join(root, "src/data/words.txt");
  if (!existsSync(projectWordList)) return [];

  const sourceWords = (await readFile(projectWordList, "utf8"))
    .split(/\r?\n/)
    .map((word) => word.trim().toLowerCase())
    .filter((word) => /^[a-z]{2,}$/.test(word));

  const existingByHref = new Set(existingWords.map((word) => word.href));
  const generated = [];

  for (const [letter, targetCount] of Object.entries(letterBrowseTargets)) {
    const existingLetterCount = existingWords.filter((word) => word.word.startsWith(letter)).length;
    const remaining = Math.max(0, targetCount - existingLetterCount);
    if (!remaining) continue;

    const candidates = sourceWords
      .filter((word) => word.startsWith(letter))
      .filter((word) => !WORD_EXCLUDE.has(word))
      .filter((word) => !existingByHref.has(`/word/${word}/`))
      .slice(0, remaining);

    for (const word of candidates) {
      const label = titleCase(word);
      const syllables = estimateSyllables(word);
      generated.push({
        word,
        href: `/word/${word}/`,
        partOfSpeech: "word",
        syllables,
        syllableBreak: estimateSyllableBreak(word),
        pronunciation: "",
        shortDef: `${label} is an English word that starts with ${letter.toUpperCase()}.`,
        definition: `${label} is included in Word Helper's public-domain English word list. Use the Word Lab tools below to explore anagrams, rhymes, syllables, and letter patterns for this word.`,
        examples: [],
        synonyms: [],
        antonyms: [],
        needsDictionaryLookup: true,
        metaTitle: `${label} — Word Meaning & Tools | Word Helper`,
        metaDescription: `Explore ${word}, an English word starting with ${letter.toUpperCase()}, with Word Helper tools for anagrams, rhymes, syllables, and word patterns.`,
      });
    }
  }

  return generated;
}

async function buildWordData(priorityWords = []) {
  const seedPath = path.join(root, "src/data/seed-words.txt");
  const seedWords = (await readFile(seedPath, "utf8"))
    .split(/\s+/)
    .map((word) => word.trim().toLowerCase())
    .filter(Boolean);
  const projectWordList = path.join(root, "src/data/words.txt");
  const sources = existsSync(projectWordList)
    ? [projectWordList]
    : ["/usr/share/dict/words", "/usr/dict/words"];
  const words = new Set(seedWords);
  for (const source of sources) {
    if (!existsSync(source)) continue;
    const text = await readFile(source, "utf8");
    for (const raw of text.split(/\r?\n/)) {
      const word = raw.trim().toLowerCase();
      if (!/^[a-z]{2,14}$/.test(word)) continue;
      if (WORD_EXCLUDE.has(word)) continue;
      if (word.length > 12 && !/(tion|ness|ment|less|able|ible|ing|ful)$/.test(word)) continue;
      words.add(word);
    }
    break;
  }
  // Rank the raw list by real-world frequency (Norvig count_1w list) so the
  // 30k extra dictionary slots go to the words users actually type — and, at,
  // which, evening — not to whatever sorts first alphabetically. Unranked words
  // fall back behind all ranked ones, shortest first (short words matter most
  // for the unscramble/anagram tools).
  const freqRank = new Map();
  const freqListPath = path.join(root, "data/freq/count_1w.txt");
  if (existsSync(freqListPath)) {
    const lines = (await readFile(freqListPath, "utf8")).split(/\r?\n/);
    for (let i = 0; i < lines.length; i++) {
      const w = lines[i].split(/\s+/)[0];
      if (w && !freqRank.has(w)) freqRank.set(w, i);
    }
  }
  const UNRANKED = Number.MAX_SAFE_INTEGER;
  const list = Array.from(words)
    .filter((word) => !/(.)\1\1\1/.test(word))
    .sort((a, b) => {
      const ra = freqRank.get(a) ?? UNRANKED;
      const rb = freqRank.get(b) ?? UNRANKED;
      if (ra !== rb) return ra - rb;
      return a.length - b.length || a.localeCompare(b);
    });
  const prioritized = [];
  const seen = new Set();
  // Complete word pages surface first in search suggestions.
  for (const raw of priorityWords) {
    const word = String(raw).toLowerCase().trim();
    if (/^[a-z]{2,}$/.test(word) && !seen.has(word)) {
      prioritized.push(word);
      seen.add(word);
    }
  }
  for (const word of seedWords) {
    if (!seen.has(word)) {
      prioritized.push(word);
      seen.add(word);
    }
  }
  // Cap counts only the words ADDED from the raw list (a prior bug compared
  // against the total, which was already past the cap — so common everyday
  // words like "and" and "at" never made it into the tool dictionary).
  let added = 0;
  for (const word of list) {
    if (seen.has(word)) continue;
    prioritized.push(word);
    seen.add(word);
    added += 1;
    if (added >= 30000) break;
  }
  return prioritized;
}

function buildSearchIndex() {
  const contentItems = [
    ...tools.map((tool) => ({
      type: "Tool",
      title: tool.title,
      href: tool.href,
      description: tool.intro,
      keywords: [tool.primaryKeyword, tool.keywords, tool.answer].filter(Boolean).join(" "),
    })),
    ...hubs.map((hub) => ({
      type: hub.href === "/guides/" ? "Guide Hub" : "Hub",
      title: hub.title,
      href: hub.href,
      description: hub.answer,
      keywords: hub.sections?.map((section) => `${section.heading} ${section.text}`).join(" ") || "",
    })),
    ...guides.map((guide) => ({
      type: "Guide",
      title: guide.title,
      href: guide.href,
      description: guide.answer,
      keywords: guide.body?.map((section) => `${section.heading} ${section.text}`).join(" ") || "",
    })),
    ...lessons.map((lesson) => ({
      type: "Guide",
      title: lesson.title,
      href: lesson.href,
      description: lesson.intro || lesson.answer,
      keywords: [lesson.primaryKeyword, lesson.keywords, lesson.answer].filter(Boolean).join(" "),
    })),
    ...wordLists.map((list) => ({
      type: "Word List",
      title: list.title,
      href: list.href,
      description: list.intro || list.answer,
      keywords: [list.category, list.difficulty, list.words?.map((entry) => entry.word).slice(0, 20).join(" ")].filter(Boolean).join(" "),
    })),
    {
      type: "Word pages",
      title: "Word Explorer",
      href: "/word-explorer/",
      description: "Browse word pages with definitions, examples, synonyms, antonyms, syllables, and related words.",
      keywords: "word meaning definition synonyms antonyms pronunciation examples",
    },
    {
      type: "Practice",
      title: "Practice",
      href: "/practice/",
      description: "Vocabulary quizzes and word practice built from Word Helper word pages.",
      keywords: "quiz practice vocabulary synonym match word family",
    },
    ...legalPages.map((page) => ({
      type: "Policy",
      title: page.title,
      href: page.href,
      description: page.metaDescription,
      keywords: page.h1,
    })),
  ];

  return contentItems.map((item) => ({
    ...item,
    searchText: `${item.title} ${item.description} ${item.keywords}`.toLowerCase(),
  }));
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
    .filter((route) => route.href !== "/404/" && !route.noindex)
    .map(
      (route) => `<url>
  <loc>${absolute(route.href)}</loc>
  <lastmod>${now}</lastmod>
  <changefreq>${route.href.includes("/guides/") ? "monthly" : "weekly"}</changefreq>
  <priority>${
    route.href === "/" ? "1.0"
    : ["/word-explorer/", "/learn-english/", "/word-lists/", "/practice/", "/word-lab/"].includes(route.href) ? "0.9"
    : route.href.startsWith("/tools/") || route.href.startsWith("/word/") || route.href.startsWith("/learn-english/") || route.href.startsWith("/word-lists/") || route.href.startsWith("/practice/") || route.href.startsWith("/word-explorer/") ? "0.8"
    : "0.7"
  }</priority>
</url>`,
    )
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries}
</urlset>`;
}

// WS7 — chunked sub-sitemap (a plain urlset for one type) + the sitemap index.
function sitemapUrlset(list) {
  const now = new Date().toISOString();
  const entries = list
    .map((route) => `<url><loc>${absolute(route.href)}</loc><lastmod>${now}</lastmod></url>`)
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries}
</urlset>`;
}

function sitemapIndexXml(files) {
  const now = new Date().toISOString();
  const entries = files
    .map((f) => `<sitemap><loc>${site.url}/${f}</loc><lastmod>${now}</lastmod></sitemap>`)
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries}
</sitemapindex>`;
}

function favicon() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="16" fill="#2b50c9"/>
  <path d="M18 18h8l6 24 6-24h8" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M16 44h32" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round"/>
</svg>`;
}

function ogImage() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630">
  <rect width="1200" height="630" fill="#212121"/>
  <rect x="60" y="200" width="84" height="84" rx="18" fill="#2b50c9"/>
  <path d="M76 226h16l12 40 12-40h16" fill="none" stroke="#fff" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M73 266h50" fill="none" stroke="#fff" stroke-width="8" stroke-linecap="round"/>
  <text x="168" y="256" font-family="Arial,sans-serif" font-size="56" font-weight="700" fill="#ECECEC">Word Helper</text>
  <text x="60" y="348" font-family="Arial,sans-serif" font-size="28" fill="#A3A3A3">English Word Intelligence Platform</text>
  <rect x="60" y="400" width="180" height="44" rx="8" fill="#2b50c9"/>
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
  <rect width="180" height="180" rx="38" fill="#2b50c9"/>
  <path d="M46 52h26l22 76 22-76h26" fill="none" stroke="#fff" stroke-width="14" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M40 132h100" fill="none" stroke="#fff" stroke-width="14" stroke-linecap="round"/>
</svg>`;
}

// WS8 — llms.txt: a concise, host-aware description for AI crawlers.
function llmsTxt() {
  const toolLines = tools.map((t) => `- [${t.title}](${site.url}${t.href}): ${t.intro}`).join("\n");
  return `# Word Helper

> ${site.name} — a fast word workspace for finding, exploring, learning, and
> using words. A word tools platform with ${TOOL_COUNT} interactive tools, searchable word
> games and writing, curated vocabulary guides, and practice quizzes. Maintained
> by Word Helper.

## Primary sections
- [Word Explorer](${site.url}/word-explorer/): in-depth word pages with definition, pronunciation or syllables, synonyms, antonyms, related words, and examples (word family, etymology, and rhymes where available).
- [Word Lab (tools)](${site.url}/word-lab/): interactive word tools.
- [Learn English](${site.url}/learn-english/): vocabulary and language guides.
- [Word Lists](${site.url}/word-lists/): curated, themed vocabulary collections.
- [Practice](${site.url}/practice/): vocabulary quizzes.

## Tools
${toolLines}

## Editorial standards
Definitions and word data are compiled from openly licensed sources (Wiktionary via
the Datamuse API, and the Free Dictionary API), then standardized, quality-screened,
and structured to a consistent format. Example sentences are real where available and
otherwise generated by AI and automatically screened for accuracy before publication.
Word-game acceptance, pronunciation, and syllable counts can vary by dictionary,
accent, and dialect; the relevant pages state these limits. Sources and license
attribution: ${site.url}/editorial-policy/. Corrections: ${site.email}.

Word Helper uses no advertising or analytics services (June 2026). See Cookie Policy
and Privacy Policy for current data handling details. These will be updated before any
advertising or analytics are activated.

## Contact
- Email: ${site.email}
- About: ${site.url}/about/
- Editorial policy: ${site.url}/editorial-policy/
- Site updates: ${site.url}/site-updates/
`;
}

function deployHeaders(htmlSegments = []) {
  // Cloudflare Pages CONCATENATES same-named headers across overlapping rules
  // (verified live). So Cache-Control is set on DISJOINT path sets only:
  //  - HTML routes (/, /<segment>/*) → must-revalidate
  //  - /assets/* and the root icons → immutable
  // The /* block carries ONLY non-cache headers, so it never doubles Cache-Control.
  const securityBlock = `/*
  X-Content-Type-Options: nosniff
  X-Frame-Options: DENY
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=()
  ${IS_PRODUCTION ? "Content-Security-Policy" : "Content-Security-Policy-Report-Only"}: default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; font-src 'self'; img-src 'self' data: https:; connect-src 'self' https://api.dictionaryapi.dev https://api.datamuse.com; base-uri 'self'; form-action 'self'${IS_PRODUCTION ? "\n  Strict-Transport-Security: max-age=63072000" : "\n  X-Robots-Tag: noindex, nofollow"}`;
  // NOTE: When Google AdSense is activated, expand the CSP to include:
  //   script-src: add https://pagead2.googlesyndication.com https://*.googlesyndication.com https://googleads.g.doubleclick.net https://www.googletagmanager.com https://www.google-analytics.com
  //   connect-src: add https://*.google-analytics.com https://*.googlesyndication.com
  //   frame-src: add https://*.googlesyndication.com https://*.doubleclick.net
  // See docs/adsense-readiness.md for the full AdSense launch checklist.

  const htmlCacheBlocks = ["/", ...htmlSegments.map((s) => `/${s}/*`)]
    .map((p) => `${p}\n  Cache-Control: public, max-age=0, must-revalidate`)
    .join("\n\n");

  const immutableBlocks = ["/assets/*", "/favicon.svg", "/apple-touch-icon.svg", "/og-image.png"]
    .map((p) => `${p}\n  Cache-Control: public, max-age=31536000, immutable`)
    .join("\n\n");

  return `${securityBlock}\n\n${htmlCacheBlocks}\n\n${immutableBlocks}\n`;
}

function deployRedirects() {
  // No custom redirects. Cloudflare Pages automatically serves /404.html (with a
  // 404 status) for any path that matches neither a static asset nor a Function,
  // so the old "/* /404.html 404" rule is unnecessary — and invalid anyway (Pages
  // _redirects only accepts 200/301/302/303/307/308 status codes). /word/* misses
  // are handled by functions/word/[[slug]].js, which serves the branded 404.
  // (A *.pages.dev → apex 301 can't be expressed here — it needs a dashboard
  // Redirect Rule once the custom domain is attached.)
  //
  // /tools and /tools/ are not pages (individual tools live at /tools/<id>/);
  // send the bare hub path to the canonical Word Lab hub. Exact paths only — no
  // splat — so /tools/<id>/ tool pages are never affected.
  return `/tools /word-lab/ 301
/tools/ /word-lab/ 301
`;
}

async function main() {
  await rm(distDir, { recursive: true, force: true });
  await mkdir(assetsDir, { recursive: true });

  // ── Load enriched word data ────────────────────────────────────────────────
  // Per-letter files src/data/enriched/{letter}-words.json (built by
  // scripts/enrich-letter.mjs) are the canonical source. The legacy single file
  // a-words-enriched.json is used only for letters that have no per-letter file
  // yet, so older data is never silently dropped.
  const curatedHrefs = new Set(words.map((w) => w.href));
  const enrichedByHref = new Map();
  const lettersWithFile = new Set();
  const enrichedDir = path.join(root, "src/data/enriched");
  if (existsSync(enrichedDir)) {
    const files = (await readdir(enrichedDir)).filter((f) => /^[a-z]-words\.json$/.test(f));
    for (const f of files.sort()) {
      lettersWithFile.add(f[0]);
      try {
        const arr = JSON.parse(await readFile(path.join(enrichedDir, f), "utf8"));
        for (const w of arr) {
          if (!w || !w.word || !w.href || curatedHrefs.has(w.href)) continue;
          enrichedByHref.set(w.href, w);
        }
      } catch (_) {}
    }
  }
  const legacyPath = path.join(root, "src/data/a-words-enriched.json");
  if (existsSync(legacyPath)) {
    try {
      const arr = JSON.parse(await readFile(legacyPath, "utf8"));
      for (const w of arr) {
        if (!w || !w.word || !w.href || curatedHrefs.has(w.href)) continue;
        if (lettersWithFile.has(String(w.word)[0].toLowerCase())) continue; // superseded
        if (!enrichedByHref.has(w.href)) enrichedByHref.set(w.href, w);
      }
    } catch (_) {}
  }

  // Attach corpus frequency so curated + older entries score correctly.
  const freqPath = path.join(root, "src/data/word-frequency.json");
  let freqMap = {};
  if (existsSync(freqPath)) { try { freqMap = JSON.parse(await readFile(freqPath, "utf8")); } catch (_) {} }
  const withMeta = (w, curated) => {
    const out = { ...w, _curated: curated };
    if (out.frequency == null) {
      const f = freqMap[String(w.word).toLowerCase()];
      if (f != null) out.frequency = f;
    }
    return out;
  };
  const curatedPages = words.map((w) => withMeta(w, true));
  const enrichedWords = [...enrichedByHref.values()].map((w) => withMeta(w, false));
  console.log(`Loaded ${enrichedWords.length} enriched words${lettersWithFile.size ? ` from per-letter files [${[...lettersWithFile].sort().join("")}]` : ""}.`);

  const publishedWordPages = [...curatedPages, ...enrichedWords];
  // ── Public gate: COMPLETE (completeness >= 80) AND RECOMMENDED (>= 50). ──────
  // Both must pass for a word to be listed, internally linked, indexed, and
  // sitemapped. Curated entries are hand-written premium pages — always public
  // when complete. Everything below the bar keeps a noindex,follow /word/ page
  // (so URLs never 404) but appears nowhere public.
  const completeWordPages = publishedWordPages
    .filter(isPublishable)
    .sort((a, b) => wordRecommendationScore(b) - wordRecommendationScore(a) || a.word.localeCompare(b.word));
  const completePct = publishedWordPages.length
    ? Math.round((completeWordPages.length / publishedWordPages.length) * 100)
    : 0;
  // publishedWordSet drives wordHref()/wordPill() linking — recommended-only, so
  // synonym chips and internal links never point at a thin or low-value page.
  for (const w of completeWordPages) publishedWordSet.add(String(w.word).toLowerCase());
  console.log(`Public gate (complete + recommended): ${completeWordPages.length} of ${publishedWordPages.length} entries public (${completePct}%).`);

  // Build the in-browser tool dictionary BEFORE rendering so templates can cite
  // its real size (SSOT) — the tools match against THIS list at runtime, not the
  // full 327k build-time source inventory.
  const wordData = await buildWordData(completeWordPages.map((w) => w.word));
  TOOL_DICT_COUNT = wordData.length;
  console.log(`Tool dictionary: ${TOOL_DICT_COUNT.toLocaleString()} words shipped to the browser.`);

  // Complete words grouped by first letter — feeds both A-Z listings (reco-sorted).
  const completeByLetter = {};
  for (const w of completeWordPages) {
    const l = w.word[0];
    (completeByLetter[l] ||= []).push(w);
  }
  const completeLetterSet = new Set(Object.keys(completeByLetter));

  const routes = [];
  let slimSkipped = 0;
  // SHARD_PAGES accumulator: shardId -> { slug: base64(gzip(html)) }.
  const shards = SHARD_PAGES ? new Map() : null;
  let shardedCount = 0;
  let shardSkipped = 0;
  function addToShard(href, html) {
    const slug = slugFromPath(href);
    if (!slug) return false;
    const id = shardOf(slug, SHARD_COUNT);
    let bucket = shards.get(id);
    if (!bucket) {
      bucket = {};
      shards.set(id, bucket);
    }
    bucket[slug] = gzipSync(Buffer.from(html, "utf8"), { level: 9 }).toString("base64");
    return true;
  }
  async function emit(route) {
    routes.push({ href: route.href, noindex: route.noindex === true });
    // SHARD_PAGES (production free-tier hosting): /word/ detail pages are not
    // written as files. Public ones go into gzipped shards (served by the Pages
    // Function); noindex ones are dropped (unlinked + not in sitemap -> 404).
    if (SHARD_PAGES && route.href.startsWith("/word/")) {
      if (route.noindex === true) {
        shardSkipped++;
      } else if (addToShard(route.href, route.html)) {
        shardedCount++;
      } else {
        await writeRoute(route); // /word/ index page or unparseable slug — keep as file
      }
      return;
    }
    // Slim deploy: skip writing the noindex /word/ thin pages to disk (kept in the
    // routes list for accounting; they are already excluded from the sitemap).
    if (DEPLOY_SLIM && route.noindex === true && route.href.startsWith("/word/")) {
      slimSkipped++;
      return;
    }
    await writeRoute(route);
  }

  // The explorer + browse list ONLY complete static /word/ pages. A page is
  // emitted for every letter (empty-state + noindex where none yet) so the A–Z
  // navigation never 404s; az-nav greys letters with no complete pages.
  const allLetters = "abcdefghijklmnopqrstuvwxyz".split("");
  await emit(renderHome(completeWordPages));
  await emit(renderSearchPage());
  await emit(renderWordLab());
  await emit(renderWordExplorerIndex(completeWordPages));
  for (const l of allLetters) {
    const letterRoutes = renderWordExplorerLetter(
      l,
      completeByLetter[l] || [],
      completeLetterSet,
    );
    for (const route of letterRoutes) await emit(route);
  }

  // ── A-Z browse (/words/[letter]/): COMPLETE words only — every listed word
  // opens a full page. The 327k raw word list still powers the tools and search
  // index (buildWordData / buildSearchIndex); it is simply no longer surfaced as
  // thin, un-enriched browse entries.
  await emit(renderWordsBrowseIndex(completeLetterSet, completeWordPages.length));
  for (const l of allLetters) {
    for (const route of renderWordsBrowseLetter(l, completeByLetter[l] || [], completeLetterSet)) {
      await emit(route);
    }
  }

  for (const word of curatedPages) await emit(renderWordPage(word));
  for (const word of enrichedWords) await emit(renderLightWordPage(word));
  await emit(renderWordLookup());
  await emit(renderLearnHub());
  for (const lesson of lessons) await emit(renderLesson(lesson));
  await emit(renderWordListsHub());
  for (const wordList of wordLists) await emit(renderWordList(wordList));
  await emit(renderPracticeHub());
  await emit(renderVocabQuiz());
  await emit(renderWordFamilyQuiz());
  await emit(renderSynonymMatch());
  for (const hub of hubs) await emit(renderHub(hub));
  for (const tool of tools) await emit(renderTool(tool));
  for (const guide of guides) await emit(renderGuide(guide));
  for (const page of legalPages) await emit(renderLegal(page));
  await emit(renderNotFound());
  await copyFile(path.join(distDir, "404", "index.html"), path.join(distDir, "404.html"));

  // ── SHARD_PAGES: write the gzipped word-page shards + scope Functions to /word/*
  if (SHARD_PAGES) {
    const shardsDir = path.join(distDir, "_shards");
    await mkdir(shardsDir, { recursive: true });
    let shardBytes = 0;
    for (const [id, bucket] of shards) {
      const json = JSON.stringify(bucket);
      shardBytes += Buffer.byteLength(json);
      await writeFile(path.join(shardsDir, `${id}.json`), json);
    }
    // Only /word/* invokes the Function; every other path (shards, static pages,
    // chrome) is served as a free, unlimited static request.
    await writeFile(
      path.join(distDir, "_routes.json"),
      JSON.stringify({ version: 1, include: ["/word/*"], exclude: [] }),
    );
    console.log(
      `Sharded ${shardedCount} public word pages into ${shards.size} files ` +
        `(${(shardBytes / 1024 / 1024).toFixed(1)} MB gzipped+base64); ` +
        `skipped ${shardSkipped} noindex word pages.`,
    );
  }

  // Minify CSS/JS with esbuild (cuts parse time + raw size; Brotli still applies on
  // the wire). Falls back to copying if esbuild is unavailable.
  try {
    const { transform } = await import("esbuild");
    const cssSrc = await readFile(path.join(root, "src/assets/site.css"), "utf8");
    const jsSrc = await readFile(path.join(root, "src/assets/site.js"), "utf8");
    await writeFile(path.join(assetsDir, "site.css"), (await transform(cssSrc, { loader: "css", minify: true })).code);
    await writeFile(path.join(assetsDir, "site.js"), (await transform(jsSrc, { loader: "js", minify: true })).code);
  } catch (e) {
    console.warn("esbuild minify unavailable — copying unminified assets:", e.message);
    await copyFile(path.join(root, "src/assets/site.css"), path.join(assetsDir, "site.css"));
    await copyFile(path.join(root, "src/assets/site.js"), path.join(assetsDir, "site.js"));
  }
  // Self-hosted Inter (variable, latin) — referenced by @font-face in site.css.
  await mkdir(path.join(assetsDir, "fonts"), { recursive: true });
  await copyFile(path.join(root, "src/assets/fonts/inter.woff2"), path.join(assetsDir, "fonts", "inter.woff2"));
  // wordData was computed before rendering (see the completeWordPages block) so
  // templates could cite the real TOOL_DICT_COUNT.
  await writeFile(
    path.join(assetsDir, "word-data.js"),
    `window.WORD_HELPER_WORDS=${JSON.stringify(wordData)};\n`,
  );
  await writeFile(
    path.join(assetsDir, "search-data.js"),
    `window.WORD_HELPER_SEARCH_INDEX=${JSON.stringify(buildSearchIndex())};\n`,
  );
  // ── Sitemaps (WS7): chunked sub-sitemaps by type + a sitemap index ──
  const indexable = routes.filter((r) => r.href !== "/404/" && !r.noindex);
  const chunkDefs = [
    { name: "sitemap-words.xml", match: (h) => h.startsWith("/word/") },
    { name: "sitemap-words-browse.xml", match: (h) => h.startsWith("/words/") },
    { name: "sitemap-tools.xml", match: (h) => h.startsWith("/tools/") || h === "/word-lab/" },
    { name: "sitemap-guides.xml", match: (h) => h.startsWith("/learn-english/") || h.startsWith("/guides/") },
    { name: "sitemap-pages.xml", match: () => true },
  ];
  const claimed = new Set();
  const chunkFiles = [];
  // Google/Bing hard-cap a single sitemap at 50,000 URLs. Split any oversized
  // bucket (e.g. /word/ = 64k) into numbered files so every URL is discoverable.
  const MAX_PER_SITEMAP = 45000;
  for (const def of chunkDefs) {
    const list = indexable.filter((r) => !claimed.has(r.href) && def.match(r.href));
    list.forEach((r) => claimed.add(r.href));
    if (!list.length) continue;
    if (list.length <= MAX_PER_SITEMAP) {
      await writeFile(path.join(distDir, def.name), sitemapUrlset(list));
      chunkFiles.push(def.name);
    } else {
      const base = def.name.replace(/\.xml$/, "");
      for (let i = 0, part = 1; i < list.length; i += MAX_PER_SITEMAP, part++) {
        const fname = `${base}-${part}.xml`;
        await writeFile(path.join(distDir, fname), sitemapUrlset(list.slice(i, i + MAX_PER_SITEMAP)));
        chunkFiles.push(fname);
      }
    }
  }
  // sitemap_index.xml is the canonical sitemap (robots.txt points here). sitemap.xml
  // is an alias of the index (small, valid) — never a single 64k-URL urlset, which
  // would exceed the 50k limit.
  const sitemapIndexContent = sitemapIndexXml(chunkFiles);
  await writeFile(path.join(distDir, "sitemap_index.xml"), sitemapIndexContent);
  await writeFile(path.join(distDir, "sitemap.xml"), sitemapIndexContent);

  // ── robots.txt (WS1): staging blocks all crawl; production allows + points at the index ──
  await writeFile(
    path.join(distDir, "robots.txt"),
    IS_PRODUCTION
      ? `User-agent: *\nAllow: /\n\n# AdSense crawler — explicitly allowed (required for ad relevance once ads are live)\nUser-agent: Mediapartners-Google\nAllow: /\n\nSitemap: ${site.url}/sitemap_index.xml\n`
      : `User-agent: *\nDisallow: /\n`,
  );

  // ── llms.txt (WS8) ──
  await writeFile(path.join(distDir, "llms.txt"), llmsTxt());

  await writeFile(path.join(distDir, "favicon.svg"), favicon());
  // Raster OG image (1200x630 PNG) — committed asset, copied verbatim so it works
  // on every build host (it is pre-rendered; no SVG->PNG step needed at build time).
  await copyFile(path.join(root, "src/assets/og-image.png"), path.join(distDir, "og-image.png"));
  await copyFile(path.join(root, "src/assets/og-image.svg"), path.join(distDir, "og-image.svg"));
  await writeFile(path.join(distDir, "apple-touch-icon.svg"), appleTouchIcon());

  // ── _headers (WS2): cache rules on disjoint path sets (no concatenation) ──
  const htmlSegments = [...new Set(routes.map((r) => r.href.split("/")[1]).filter(Boolean))]
    .filter((s) => s !== "assets");
  await writeFile(path.join(distDir, "_headers"), deployHeaders(htmlSegments));
  await writeFile(path.join(distDir, "_redirects"), deployRedirects());
  const filesWritten = routes.length - slimSkipped;
  console.log(`Built ${routes.length} pages (${SITE_ENV}, host ${site.url}) with ${wordData.length} words.`);
  if (DEPLOY_SLIM) {
    console.log(`Slim deploy: wrote ${filesWritten} page files; skipped ${slimSkipped} noindex /word/ thin pages (served as branded 404 on direct hit).`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
