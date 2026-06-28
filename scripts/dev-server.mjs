import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { existsSync } from "node:fs";
import { spawnSync } from "node:child_process";
import path from "node:path";

const root = process.cwd();
const distDir = path.join(root, "dist");
const defaultPort = 3007;
const hasPortArg = process.argv.includes("--port");
const strictPort = process.argv.includes("--strict-port") || process.env.STRICT_PORT === "1";
const requestedPort = Number(
  hasPortArg
    ? process.argv[process.argv.indexOf("--port") + 1]
    : process.env.PORT || defaultPort,
);

if (!existsSync(path.join(distDir, "index.html"))) {
  const result = spawnSync(process.execPath, ["scripts/build.mjs"], {
    cwd: root,
    stdio: "inherit",
  });
  if (result.status !== 0) {
    process.exit(result.status || 1);
  }
}

const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".svg": "image/svg+xml; charset=utf-8",
};

function candidatePaths(urlPath) {
  const clean = decodeURIComponent(urlPath.split("?")[0]);
  const normalized = clean === "/" ? "/index.html" : clean;
  const file = path.join(distDir, normalized);
  return [
    file,
    path.join(file, "index.html"),
    path.join(distDir, "404", "index.html"),
  ];
}

async function respond(request, response) {
  try {
    for (const filePath of candidatePaths(request.url || "/")) {
      try {
        const fileStat = await stat(filePath);
        if (!fileStat.isFile()) continue;
        const body = await readFile(filePath);
        const ext = path.extname(filePath);
        response.writeHead(filePath.includes(`${path.sep}404${path.sep}`) ? 404 : 200, {
          "Content-Type": types[ext] || "application/octet-stream",
          "Cache-Control": "no-store",
        });
        response.end(body);
        return;
      } catch {
        // Try the next route candidate.
      }
    }
    response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Not found");
  } catch (error) {
    response.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
    response.end(`Server error: ${error.message}`);
  }
}

function listenOn(port) {
  const server = createServer(respond);
  server.on("error", (error) => {
    if (error.code === "EADDRINUSE" && !strictPort) {
      listenOn(port + 1);
      return;
    }
    if (error.code === "EADDRINUSE") {
      console.error(`Port ${port} is already in use. Stop that process or choose another port.`);
      process.exitCode = 1;
      return;
    }
    console.error(error);
    process.exitCode = 1;
  });
  server.listen(port, () => {
    console.log(`Word Helper local server: http://localhost:${port}`);
  });
}

listenOn(Number.isFinite(requestedPort) ? requestedPort : defaultPort);
