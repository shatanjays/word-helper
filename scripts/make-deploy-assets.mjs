// Builds deploy-assets/ — the small set of shared, non-HTML "chrome" files
// (CSS/JS/favicon/sitemaps/robots/og-image/llms.txt) copied out of dist/ with
// their paths preserved. These ship as Workers Static Assets (served directly by
// the edge). HTML pages are intentionally excluded — they live in R2 and are
// served by scripts/worker.js. _headers/_redirects are excluded too (the Worker
// sets headers and handles 404s itself).
import { readdir, mkdir, copyFile, rm, stat } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const distDir = path.join(root, "dist");
const outDir = path.join(root, "deploy-assets");

const EXCLUDE_NAMES = new Set(["_headers", "_redirects"]);

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(full);
    else yield full;
  }
}

async function main() {
  await rm(outDir, { recursive: true, force: true });
  let copied = 0;
  let bytes = 0;
  for await (const file of walk(distDir)) {
    const rel = path.relative(distDir, file);
    const base = path.basename(file);
    if (rel.endsWith(".html")) continue;
    if (EXCLUDE_NAMES.has(base)) continue;
    const dest = path.join(outDir, rel);
    await mkdir(path.dirname(dest), { recursive: true });
    await copyFile(file, dest);
    bytes += (await stat(file)).size;
    copied++;
  }
  console.log(
    `deploy-assets: copied ${copied} chrome files (${(bytes / 1024 / 1024).toFixed(1)} MB) to deploy-assets/`,
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
