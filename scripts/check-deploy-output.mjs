import { readdir, readFile, stat } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const distDir = path.join(root, "dist");
const siteUrl = "https://wordhelper.online";
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

  const urls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1]);
  if (!urls.length) fail("sitemap.xml has no URLs.");
  if (urls.length > maxSitemapUrls) {
    fail(`sitemap.xml has ${urls.length} URLs; split sitemaps before exceeding ${maxSitemapUrls}.`);
  }
  if (urls.some((url) => !url.startsWith(`${siteUrl}/`))) {
    fail("sitemap.xml contains a non-production URL.");
  }
  if (urls.some((url) => url.includes("/404/"))) {
    fail("sitemap.xml should not include the 404 page.");
  }

  const missingSitemapFiles = [];
  for (const url of urls) {
    const pathname = new URL(url).pathname;
    if (!existsSync(routeFile(pathname))) missingSitemapFiles.push(pathname);
    if (missingSitemapFiles.length >= 10) break;
  }
  if (missingSitemapFiles.length) {
    fail(`sitemap routes missing files: ${missingSitemapFiles.join(", ")}`);
  }

  if (!robots.includes(`Sitemap: ${siteUrl}/sitemap.xml`)) {
    fail("robots.txt does not point to the production sitemap.");
  }
  if (!headers.includes("X-Content-Type-Options: nosniff")) {
    fail("_headers is missing baseline security headers.");
  }
  if (!headers.includes("/assets/*") || !headers.includes("immutable")) {
    fail("_headers is missing long-lived asset caching.");
  }
  if (!redirects.includes("/* /404.html 404")) {
    fail("_redirects is missing the static custom 404 fallback.");
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
