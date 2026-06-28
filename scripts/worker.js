// ─────────────────────────────────────────────────────────────────────────────
// Word Helper edge Worker — serves the static site from R2.
//
// Cloudflare's free plan caps Pages/Workers *static assets* at 20,000 files, but
// the full site is ~64.7k HTML pages (2.4 GB). So:
//   • The ~19 shared chrome files (CSS/JS/favicon/sitemaps/robots) ship as Workers
//     Static Assets (served directly by the edge — they never invoke this Worker).
//   • Every HTML page lives in an R2 bucket (R2 free tier: 10 GB / 10M reads-mo).
//     This Worker resolves clean URLs to R2 keys, edge-caches the result, sets the
//     security + cache headers, and serves the branded 404 on a miss.
//
// Requests that match a static asset are handled by the edge before this code runs,
// so the free Worker request budget (100k/day) is spent only on real page views.
// ─────────────────────────────────────────────────────────────────────────────

const SECURITY_HEADERS = {
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
  "Strict-Transport-Security": "max-age=63072000",
  "Content-Security-Policy":
    "default-src 'self'; " +
    "script-src 'self' 'unsafe-inline' https://pagead2.googlesyndication.com https://*.googlesyndication.com https://googleads.g.doubleclick.net https://www.googletagmanager.com https://www.google-analytics.com; " +
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
    "font-src 'self' https://fonts.gstatic.com; " +
    "img-src 'self' data: https:; " +
    "connect-src 'self' https://api.dictionaryapi.dev https://*.google-analytics.com https://*.googlesyndication.com; " +
    "frame-src https://*.googlesyndication.com https://*.doubleclick.net; " +
    "base-uri 'self'; form-action 'self'",
};

const CONTENT_TYPES = {
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

const lastSegment = (p) => p.slice(p.lastIndexOf("/") + 1);
const hasExtension = (p) => lastSegment(p).includes(".");

// Map a URL pathname to an R2 object key. Clean dir URLs resolve to index.html.
function keyForPath(pathname) {
  let p = pathname;
  try {
    p = decodeURIComponent(pathname);
  } catch {
    /* keep raw on malformed escapes */
  }
  if (p === "/" || p === "") return "index.html";
  p = p.replace(/^\/+/, "");
  if (p.endsWith("/")) return p + "index.html";
  if (!hasExtension(p)) return p + "/index.html";
  return p;
}

function contentTypeFor(key, fallback) {
  const ext = key.slice(key.lastIndexOf(".") + 1).toLowerCase();
  return CONTENT_TYPES[ext] || fallback || "application/octet-stream";
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    if (request.method !== "GET" && request.method !== "HEAD") {
      return new Response("Method Not Allowed", {
        status: 405,
        headers: { Allow: "GET, HEAD" },
      });
    }

    // Canonicalise clean directory URLs to a trailing slash (301), matching the
    // <link rel="canonical"> emitted in every page.
    if (
      url.pathname !== "/" &&
      !url.pathname.endsWith("/") &&
      !hasExtension(url.pathname)
    ) {
      url.pathname += "/";
      return Response.redirect(url.toString(), 301);
    }

    const cache = caches.default;
    const cacheKey = new Request(url.toString(), { method: "GET" });
    const hit = await cache.match(cacheKey);
    if (hit) {
      return request.method === "HEAD"
        ? new Response(null, { status: hit.status, headers: hit.headers })
        : hit;
    }

    const key = keyForPath(url.pathname);
    let obj = await env.BUCKET.get(key);
    let status = 200;
    let servedKey = key;

    if (obj === null) {
      obj = await env.BUCKET.get("404.html");
      status = 404;
      servedKey = "404.html";
    }
    if (obj === null) {
      return new Response("Not Found", { status: 404 });
    }

    const headers = new Headers();
    headers.set("Content-Type", contentTypeFor(servedKey, obj.httpMetadata?.contentType));
    if (obj.httpEtag) headers.set("ETag", obj.httpEtag);
    const isHtml = servedKey.endsWith(".html");
    headers.set(
      "Cache-Control",
      isHtml ? "public, max-age=300, s-maxage=3600" : "public, max-age=86400",
    );
    for (const [k, v] of Object.entries(SECURITY_HEADERS)) headers.set(k, v);

    const response = new Response(obj.body, { status, headers });

    // Edge-cache successful responses so repeat hits skip the R2 read.
    if (status === 200) ctx.waitUntil(cache.put(cacheKey, response.clone()));

    return request.method === "HEAD"
      ? new Response(null, { status, headers })
      : response;
  },
};
