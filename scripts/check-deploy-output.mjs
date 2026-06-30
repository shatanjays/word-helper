import { readdir, readFile, stat } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const distDir = path.join(root, "dist");
// Match HOST_CANONICAL default in build.mjs so sitemap URL checks stay in sync.
const siteUrl = (process.env.HOST_CANONICAL || "https://wordhelper-online.pages.dev").replace(/\/+$/, "");
const maxSitemapUrls = 50000;
const maxDeployFiles = Number(process.env.WORD_HELPER_MAX_DEPLOY_FILES || 20000);
const maxDeployBytes = Number(process.env.WORD_HELPER_MAX_DEPLOY_BYTES || 750 * 1024 * 1024);

const requiredFiles = [
  "index.html",
  "404/index.html",
  "404.html",
  "sitemap.xml",
  "robots.txt",
  "_headers",
  "_redirects",
  "favicon.svg",
  "og-image.svg",
  "apple-touch-icon.svg",
  "assets/site.css",
  "assets/site.js",
  "assets/word-data.js",
  "assets/search-data.js",
];

const requiredRoutes = [
  "/",
  "/word-lab/",
  "/word-explorer/",
  "/learn-english/",
  "/word-lists/",
  "/practice/",
  "/tools/word-unscramble/",
  "/tools/anagram-solver/",
  "/tools/rhyme-finder/",
  "/tools/syllable-counter/",
  "/about/",
  "/contact/",
  "/privacy-policy/",
  "/terms/",
  "/404/",
];

const issues = [];

function fail(message) {
  issues.push(message);
}

function routeFile(routePath) {
  const clean = routePath === "/" ? "" : routePath.replace(/^\/|\/$/g, "");
  return path.join(distDir, clean, "index.html");
}

async function walk(dir) {
  let fileCount = 0;
  let byteCount = 0;
  const entries = await readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      const child = await walk(full);
      fileCount += child.fileCount;
      byteCount += child.byteCount;
    } else if (entry.isFile()) {
      const fileStat = await stat(full);
      fileCount += 1;
      byteCount += fileStat.size;
    }
  }

  return { fileCount, byteCount };
}

if (!existsSync(distDir)) {
  fail("dist directory is missing; run npm run build first.");
} else {
  for (const file of requiredFiles) {
    if (!existsSync(path.join(distDir, file))) fail(`dist/${file} missing`);
  }

  for (const route of requiredRoutes) {
    if (!existsSync(routeFile(route))) fail(`route ${route} missing index.html`);
  }

  const sitemapPath = path.join(distDir, "sitemap.xml");
  const robotsPath = path.join(distDir, "robots.txt");
  const headersPath = path.join(distDir, "_headers");
  const redirectsPath = path.join(distDir, "_redirects");

  const sitemap = existsSync(sitemapPath) ? await readFile(sitemapPath, "utf8") : "";
  const robots = existsSync(robotsPath) ? await readFile(robotsPath, "utf8") : "";
  const headers = existsSync(headersPath) ? await readFile(headersPath, "utf8") : "";
  const redirects = existsSync(redirectsPath) ? await readFile(redirectsPath, "utf8") : "";

  // sitemap.xml is a sitemap INDEX (chunked sub-sitemaps). Resolve it to the real
  // page URLs across all sub-sitemaps, and validate the sub-sitemap files exist.
  const topLocs = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1]);
  if (!topLocs.length) fail("sitemap.xml has no URLs.");
  const isIndex = sitemap.includes("<sitemapindex");
  let urls = [];
  if (isIndex) {
    for (const loc of topLocs) {
      const fname = path.basename(new URL(loc).pathname);
      const subPath = path.join(distDir, fname);
      if (!existsSync(subPath)) {
        fail(`sitemap index references a missing sub-sitemap file: ${fname}`);
        continue;
      }
      const subXml = await readFile(subPath, "utf8");
      const subUrls = [...subXml.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1]);
      if (subUrls.length > maxSitemapUrls) {
        fail(`${fname} has ${subUrls.length} URLs; split before exceeding ${maxSitemapUrls}.`);
      }
      urls.push(...subUrls);
    }
  } else {
    urls = topLocs;
    if (urls.length > maxSitemapUrls) {
      fail(`sitemap.xml has ${urls.length} URLs; split sitemaps before exceeding ${maxSitemapUrls}.`);
    }
  }
  if (!urls.length) fail("resolved sitemap has no page URLs.");
  if (urls.some((url) => !url.startsWith(`${siteUrl}/`))) {
    fail("sitemap contains a non-production URL.");
  }
  if (urls.some((url) => url.includes("/404/"))) {
    fail("sitemap should not include the 404 page.");
  }

  // Validate that sitemapped page routes resolve. In SHARD_PAGES production mode the
  // ~64k /word/ pages are served from gzipped shards by functions/word/[[slug]].js
  // (no static file), so a missing /word/ file is expected — only flag non-/word/
  // routes, which must exist as static index.html files.
  const missingSitemapFiles = [];
  for (const url of urls) {
    const pathname = new URL(url).pathname;
    if (pathname.startsWith("/word/")) continue;
    if (!existsSync(routeFile(pathname))) missingSitemapFiles.push(pathname);
    if (missingSitemapFiles.length >= 10) break;
  }
  if (missingSitemapFiles.length) {
    fail(`sitemap routes missing files: ${missingSitemapFiles.join(", ")}`);
  }
  // In shard mode, confirm the shard infrastructure that serves /word/ pages exists.
  const wordUrls = urls.filter((u) => new URL(u).pathname.startsWith("/word/"));
  if (wordUrls.length && !existsSync(path.join(distDir, "_routes.json"))) {
    fail("sitemap lists /word/ pages but dist/_routes.json (shard routing) is missing.");
  }

  if (!robots.includes(`Sitemap: ${siteUrl}/sitemap_index.xml`) && !robots.includes(`Sitemap: ${siteUrl}/sitemap.xml`)) {
    fail("robots.txt does not point to the production sitemap (expected sitemap_index.xml or sitemap.xml).");
  }
  if (!headers.includes("X-Content-Type-Options: nosniff")) {
    fail("_headers is missing baseline security headers.");
  }
  if (!headers.includes("/assets/*") || !headers.includes("immutable")) {
    fail("_headers is missing long-lived asset caching.");
  }
  // Cloudflare Pages serves dist/404.html natively for unmatched routes, so a
  // "/* /404.html 404" rule in _redirects is optional. Just require the file.
  void redirects;
  if (!existsSync(path.join(distDir, "404.html"))) {
    fail("dist/404.html (custom 404 page) is missing.");
  }

  const { fileCount, byteCount } = await walk(distDir);
  if (fileCount > maxDeployFiles) {
    fail(`dist has ${fileCount} files; deploy sanity limit is ${maxDeployFiles}.`);
  }
  if (byteCount > maxDeployBytes) {
    fail(`dist is ${(byteCount / 1024 / 1024).toFixed(1)} MB; deploy sanity limit is ${(maxDeployBytes / 1024 / 1024).toFixed(0)} MB.`);
  }

  if (!issues.length) {
    console.log(`Deploy output check passed: ${urls.length} sitemap URLs, ${fileCount} files, ${(byteCount / 1024 / 1024).toFixed(1)} MB.`);
  }
}

if (issues.length) {
  console.error(issues.join("\n"));
  process.exitCode = 1;
}
