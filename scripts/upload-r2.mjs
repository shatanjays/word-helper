// Bulk-uploads dist/ to the R2 bucket using R2's S3-compatible API.
// Self-contained (no rclone/brew needed). Reads S3 creds from a gitignored
// .r2creds file:
//
//   R2_ACCESS_KEY_ID=...
//   R2_SECRET_ACCESS_KEY=...
//   # R2_ACCOUNT_ID optional (defaults below)
//
// Create the token in the Cloudflare dashboard: R2 > Manage R2 API Tokens >
// Create API token (Object Read & Write).
//
// Usage:
//   node scripts/upload-r2.mjs                # upload all of dist/
//   node scripts/upload-r2.mjs --resume       # skip keys already in the bucket
//   node scripts/upload-r2.mjs --bucket name  # override bucket (default wordhelper-site)
import { readFile, readdir } from "node:fs/promises";
import { readFileSync } from "node:fs";
import path from "node:path";
import {
  S3Client,
  PutObjectCommand,
  ListObjectsV2Command,
} from "@aws-sdk/client-s3";

const root = process.cwd();
const distDir = path.join(root, "dist");

const args = process.argv.slice(2);
const RESUME = args.includes("--resume");
const bucketIdx = args.indexOf("--bucket");
const BUCKET = bucketIdx !== -1 ? args[bucketIdx + 1] : "wordhelper-site";
const CONCURRENCY = 48;

const TYPES = {
  html: "text/html; charset=utf-8",
  css: "text/css; charset=utf-8",
  js: "text/javascript; charset=utf-8",
  mjs: "text/javascript; charset=utf-8",
  xml: "application/xml; charset=utf-8",
  txt: "text/plain; charset=utf-8",
  svg: "image/svg+xml",
  json: "application/json; charset=utf-8",
  webmanifest: "application/manifest+json",
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  webp: "image/webp",
  ico: "image/x-icon",
  woff2: "font/woff2",
};
const ctype = (key) =>
  TYPES[key.slice(key.lastIndexOf(".") + 1).toLowerCase()] ||
  "application/octet-stream";

function parseCreds() {
  let raw;
  try {
    raw = readFileSync(path.join(root, ".r2creds"), "utf8");
  } catch {
    console.error("ERROR: .r2creds not found at repo root.");
    console.error("Create it with:\n  R2_ACCESS_KEY_ID=...\n  R2_SECRET_ACCESS_KEY=...");
    process.exit(1);
  }
  const env = {};
  for (const line of raw.split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.+?)\s*$/);
    if (m) env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
  return env;
}

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(full);
    else yield full;
  }
}

async function listExisting(s3) {
  const keys = new Set();
  let token;
  do {
    const res = await s3.send(
      new ListObjectsV2Command({ Bucket: BUCKET, ContinuationToken: token }),
    );
    for (const o of res.Contents || []) keys.add(o.Key);
    token = res.IsTruncated ? res.NextContinuationToken : undefined;
  } while (token);
  return keys;
}

async function main() {
  const creds = parseCreds();
  const accountId = creds.R2_ACCOUNT_ID || "781ee6623d910360994067aca91ed506";
  if (!creds.R2_ACCESS_KEY_ID || !creds.R2_SECRET_ACCESS_KEY) {
    console.error("ERROR: .r2creds missing R2_ACCESS_KEY_ID / R2_SECRET_ACCESS_KEY");
    process.exit(1);
  }
  const s3 = new S3Client({
    region: "auto",
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: creds.R2_ACCESS_KEY_ID,
      secretAccessKey: creds.R2_SECRET_ACCESS_KEY,
    },
  });

  let skip = new Set();
  if (RESUME) {
    process.stdout.write("Listing existing objects for --resume… ");
    skip = await listExisting(s3);
    console.log(`${skip.size} already present.`);
  }

  // Collect files
  const files = [];
  for await (const f of walk(distDir)) files.push(f);
  const total = files.length;
  console.log(`Uploading ${total} files from dist/ -> R2:${BUCKET} (concurrency ${CONCURRENCY})`);

  let done = 0;
  let uploaded = 0;
  let skipped = 0;
  let failed = 0;
  let idx = 0;

  async function putOne(file) {
    const key = path.relative(distDir, file).split(path.sep).join("/");
    if (RESUME && skip.has(key)) {
      skipped++;
      return;
    }
    const body = await readFile(file);
    for (let attempt = 0; attempt < 4; attempt++) {
      try {
        await s3.send(
          new PutObjectCommand({
            Bucket: BUCKET,
            Key: key,
            Body: body,
            ContentType: ctype(key),
          }),
        );
        uploaded++;
        return;
      } catch (e) {
        if (attempt === 3) {
          failed++;
          console.error(`FAILED ${key}: ${e.name || e.message}`);
          return;
        }
        await new Promise((r) => setTimeout(r, 500 * (attempt + 1)));
      }
    }
  }

  async function worker() {
    while (idx < files.length) {
      const my = idx++;
      await putOne(files[my]);
      done++;
      if (done % 2000 === 0 || done === total) {
        console.log(`  ${done}/${total}  (uploaded ${uploaded}, skipped ${skipped}, failed ${failed})`);
      }
    }
  }

  await Promise.all(Array.from({ length: CONCURRENCY }, worker));
  console.log(`\nComplete: uploaded ${uploaded}, skipped ${skipped}, failed ${failed} of ${total}.`);
  if (failed > 0) {
    console.error("Some uploads failed — re-run with --resume to retry the missing ones.");
    process.exit(1);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
