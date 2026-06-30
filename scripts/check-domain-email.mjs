import { readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const files = [];
const badDomainPatterns = [
  ["example", ".com"].join(""),
  ["your", "domain", ".com"].join(""),
  ["vercel", ".app"].join(""),
  ["netlify", ".app"].join(""),
  ["TO", "DO", " domain"].join(""),
  ["test", " domain"].join(""),
  ["fake", " domain"].join(""),
  ["127", ".0.0.1"].join(""),
];
const badEmailPatterns = [
  ["example", "@", "example", ".com"].join(""),
  ["support", "@", "example", ".com"].join(""),
  ["contact", "@", "your", "domain", ".com"].join(""),
  ["hello", "@", "example", ".com"].join(""),
];
const localOnlyTooling = new Set([
  "scripts/check-domain-email.mjs",
  "scripts/dev-server.mjs",
  "scripts/keep-local-server.mjs",
]);

// Build-input caches and local tooling state legitimately contain sample/placeholder
// hosts (Free Dictionary API sample sentences, wrangler/dev state). They are never
// deployed, so exclude them — only scan deployable source + output.
const skipDirNames = ["node_modules", ".git", ".claude", ".wrangler"];
const skipRelPrefixes = ["data/cache", "data/freq", "data/reports", "data/enriched"];

async function walk(dir) {
  const { readdir } = await import("node:fs/promises");
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    if (skipDirNames.includes(entry.name)) continue;
    const full = path.join(dir, entry.name);
    const rel = path.relative(root, full).split(path.sep).join("/");
    if (skipRelPrefixes.some((p) => rel === p || rel.startsWith(p + "/"))) continue;
    if (entry.isDirectory()) {
      await walk(full);
    } else {
      files.push(full);
    }
  }
}

await walk(root);

const issues = [];
for (const file of files) {
  const text = await readFile(file, "utf8").catch(() => "");
  const rel = path.relative(root, file);
  for (const pattern of [...badDomainPatterns, ...badEmailPatterns]) {
    if (localOnlyTooling.has(rel) && pattern === "127.0.0.1") continue;
    if (text.includes(pattern)) issues.push(`${rel}: ${pattern}`);
  }
  if (
    text.includes("localhost") &&
    !rel.startsWith("scripts/") &&
    rel !== "README.md"
  ) {
    issues.push(`${rel}: localhost`);
  }
}

if (!existsSync(path.join(root, "dist", "sitemap.xml"))) {
  issues.push("dist/sitemap.xml missing");
}

if (issues.length) {
  console.error(issues.join("\n"));
  process.exitCode = 1;
} else {
  console.log("Domain and email audit passed.");
}
