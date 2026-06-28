// Shared between the build (scripts/build.mjs) and the edge renderer
// (functions/word/[[slug]].js) so shard keys and shard ids NEVER drift.
//
// Word detail pages are not shipped as 64k individual files (that exceeds the
// Cloudflare Pages free 20k-file cap). Instead each public word's pre-rendered,
// gzipped HTML is stored in one of SHARD_COUNT JSON shards, keyed by slug, and a
// Pages Function serves /word/<slug>/ by decompressing the matching entry. The
// returned HTML is byte-identical to the build output — same SEO, same markup.

export const SHARD_COUNT = 2048;

// Extract the canonical slug from a /word/<slug>/ pathname (or href). Returns
// null for anything that isn't a word detail path. Matches wordHref() in
// build.mjs: slug = lowercase, spaces->hyphens (already encoded in the URL).
export function slugFromPath(pathname) {
  const m = String(pathname).match(/^\/word\/([^/]+)\/?$/);
  if (!m) return null;
  let slug;
  try {
    slug = decodeURIComponent(m[1]);
  } catch {
    slug = m[1];
  }
  return slug.toLowerCase();
}

// Deterministic FNV-1a (32-bit) → shard index. Pure, identical in Node and the
// Workers runtime (uses Math.imul; no platform-specific behaviour).
export function shardOf(slug, count = SHARD_COUNT) {
  let h = 0x811c9dc5;
  for (let i = 0; i < slug.length; i++) {
    h ^= slug.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h % count;
}
