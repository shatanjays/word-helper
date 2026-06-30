// Pages Function: serves /word/<slug>/ from the gzipped shards built by
// scripts/build.mjs (SHARD_PAGES mode). Returns the pre-rendered HTML
// byte-for-byte — same markup, same SEO as a static page — without shipping 64k
// individual files (which would exceed the free Pages 20k-file cap).
//
// Only /word/* reaches this Function (see dist/_routes.json). Shards, chrome, and
// all other pages are served as free, unlimited static requests. Rendered pages
// are edge-cached so repeat hits skip the shard read entirely.
import { SHARD_COUNT, slugFromPath, shardOf } from "../../src/shard-util.mjs";

const SECURITY_HEADERS = {
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
  "Strict-Transport-Security": "max-age=63072000",
  // Keep in sync with the static _headers CSP emitted by scripts/build.mjs
  // (deployHeaders). No AdSense/Analytics origins are whitelisted while ads are
  // not active; word pages call the Free Dictionary and Datamuse APIs at runtime,
  // so both are allowed in connect-src. When AdSense is activated, re-add the
  // ad/analytics origins HERE and in build.mjs together — see docs/adsense-readiness.md.
  "Content-Security-Policy":
    "default-src 'self'; " +
    "script-src 'self' 'unsafe-inline'; " +
    "style-src 'self' 'unsafe-inline'; " +
    "font-src 'self'; " +
    "img-src 'self' data: https:; " +
    "connect-src 'self' https://api.dictionaryapi.dev https://api.datamuse.com; " +
    "base-uri 'self'; form-action 'self'",
};

async function gunzipToString(gzBytes) {
  const stream = new Response(gzBytes).body.pipeThrough(new DecompressionStream("gzip"));
  return await new Response(stream).text();
}

function base64ToBytes(b64) {
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes;
}

async function serve404(env, url) {
  const res = await env.ASSETS.fetch(new URL("/404.html", url.origin));
  const body = res.ok ? await res.text() : "Not Found";
  return new Response(body, {
    status: 404,
    headers: { "Content-Type": "text/html; charset=utf-8", ...SECURITY_HEADERS },
  });
}

// A word with no published page: serve the client-side live-lookup template
// (noindex, excluded from the sitemap) so real words still resolve via the public
// dictionary API instead of dead-ending on a 404, and garbage renders a graceful
// "not found" state with tool suggestions. Keeps normal word exploration usable.
async function serveLookup(env, url) {
  const res = await env.ASSETS.fetch(new URL("/word-lookup/", url.origin));
  if (!res.ok) return serve404(env, url);
  const body = await res.text();
  return new Response(body, {
    status: 200,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "public, max-age=0, must-revalidate",
      ...SECURITY_HEADERS,
    },
  });
}

export async function onRequest(context) {
  const { request, env } = context;
  if (request.method !== "GET" && request.method !== "HEAD") {
    return new Response("Method Not Allowed", { status: 405, headers: { Allow: "GET, HEAD" } });
  }

  const url = new URL(request.url);

  // Canonicalise to a trailing slash (matches every page's <link rel="canonical">).
  if (/^\/word\/[^/]+$/.test(url.pathname)) {
    url.pathname += "/";
    return Response.redirect(url.toString(), 301);
  }

  const slug = slugFromPath(url.pathname);
  if (!slug) return serve404(env, url);

  // No caches.default here. The shard is a STATIC asset fetched via env.ASSETS,
  // which is edge-cached AND content-versioned per deployment — so a redeploy is
  // reflected immediately with zero stale-HTML risk (the previous Cache-API layer
  // survived redeploys and served stale pages). Decompressing one shard entry is a
  // sub-millisecond operation; a light browser cache (below) covers repeat views.
  const shardId = shardOf(slug, SHARD_COUNT);
  const shardRes = await env.ASSETS.fetch(new URL(`/_shards/${shardId}.json`, url.origin));
  if (!shardRes.ok) return serveLookup(env, url);

  let shard;
  try {
    shard = await shardRes.json();
  } catch {
    return serveLookup(env, url);
  }

  const packed = shard[slug];
  if (!packed) return serveLookup(env, url);

  const html = await gunzipToString(base64ToBytes(packed));
  const headers = {
    "Content-Type": "text/html; charset=utf-8",
    "Cache-Control": "public, max-age=300",
    ...SECURITY_HEADERS,
  };
  return request.method === "HEAD"
    ? new Response(null, { status: 200, headers })
    : new Response(html, { status: 200, headers });
}
