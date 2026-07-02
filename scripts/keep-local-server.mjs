import { spawn, execFileSync } from "node:child_process";
import { existsSync, openSync, closeSync } from "node:fs";
import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.resolve(fileURLToPath(new URL("..", import.meta.url)));
const devServerScript = path.join(projectRoot, "scripts", "dev-server.mjs");
const defaultPort = 3006;
const port = Number(process.env.PORT || defaultPort);
const checkEveryMs = Number(process.env.WORD_HELPER_KEEPER_INTERVAL_MS || 5000);
const healthTimeoutMs = Number(process.env.WORD_HELPER_HEALTH_TIMEOUT_MS || 8000);
const logPath = process.env.WORD_HELPER_KEEPER_LOG || `/tmp/word-helper-${port}.log`;
const healthUrl = `http://127.0.0.1:${port}/`;
const startedAt = new Date().toISOString();

let server = null;
let lastState = "";

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function log(message) {
  console.log(`[${new Date().toISOString()}] ${message}`);
}

function setState(state) {
  if (state === lastState) return;
  lastState = state;
  log(state);
}

function projectReady() {
  return existsSync(devServerScript)
    && existsSync(path.join(projectRoot, "dist", "index.html"));
}

function checkHealth() {
  return new Promise((resolve) => {
    let settled = false;
    const finish = (healthy) => {
      if (settled) return;
      settled = true;
      resolve(healthy);
    };

    const request = http.get(healthUrl, { timeout: healthTimeoutMs }, (response) => {
      finish(response.statusCode === 200);
      response.resume();
    });

    request.on("timeout", () => {
      request.destroy();
      finish(false);
    });
    request.on("error", () => finish(false));
  });
}

function commandForPid(pid) {
  try {
    return execFileSync("/bin/ps", ["-p", String(pid), "-o", "command="], {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();
  } catch {
    return "";
  }
}

function killStaleWordHelperListeners() {
  killKnownProjectDevServers();

  let output = "";
  try {
    output = execFileSync("/usr/sbin/lsof", ["-nP", `-tiTCP:${port}`, "-sTCP:LISTEN"], {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    });
  } catch {
    return;
  }

  output
    .split(/\s+/)
    .filter(Boolean)
    .map(Number)
    .filter((pid) => Number.isInteger(pid) && pid > 0 && pid !== process.pid)
    .forEach((pid) => {
      const command = commandForPid(pid);
      if (!command.includes("scripts/dev-server.mjs")) return;
      try {
        process.kill(pid, "SIGTERM");
        log(`Stopped stale Word Helper listener on port ${port} (pid ${pid}).`);
      } catch {}
    });
}

function killKnownProjectDevServers() {
  let output = "";
  try {
    output = execFileSync("/bin/ps", ["-axo", "pid=,command="], {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    });
  } catch {
    return;
  }

  output
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .forEach((line) => {
      const match = line.match(/^(\d+)\s+(.+)$/);
      if (!match) return;
      const pid = Number(match[1]);
      const command = match[2];
      if (!Number.isInteger(pid) || pid <= 0 || pid === process.pid) return;
      const isThisProjectServer =
        command.includes(devServerScript)
        || command.includes(`scripts/dev-server.mjs --port ${port}`);
      if (!isThisProjectServer) return;
      try {
        process.kill(pid, "SIGTERM");
        log(`Stopped stale Word Helper dev server (pid ${pid}).`);
      } catch {}
    });
}

function stopServer(reason) {
  if (!server || server.killed) return;
  log(`Stopping local server: ${reason}.`);
  try {
    server.kill("SIGTERM");
  } catch {}
  server = null;
}

function startServer() {
  if (server && !server.killed) return;

  killStaleWordHelperListeners();

  let logFd;
  try {
    logFd = openSync(logPath, "a");
  } catch {
    logFd = "ignore";
  }

  server = spawn(process.execPath, [devServerScript, "--port", String(port), "--strict-port"], {
    cwd: projectRoot,
    // DEV_AUTOBUILD=0: an unattended keeper-spawned dev server must NEVER kick
    // off its own build — an unsupervised staging build can race a production
    // build/deploy and corrupt dist mid-upload.
    env: { ...process.env, PORT: String(port), STRICT_PORT: "1", DEV_AUTOBUILD: "0" },
    stdio: ["ignore", logFd, logFd],
  });

  const pid = server.pid;
  log(`Started Word Helper local server on ${healthUrl} (pid ${pid}).`);

  server.on("exit", (code, signal) => {
    if (typeof logFd === "number") closeSync(logFd);
    log(`Local server exited with code ${code ?? "none"} and signal ${signal ?? "none"}.`);
    server = null;
  });
}

async function main() {
  log(`Word Helper keep-alive started at ${startedAt}.`);
  log(`Project path: ${projectRoot}`);
  let failedChecks = 0;

  process.on("SIGINT", () => {
    stopServer("keeper received SIGINT");
    process.exit(0);
  });
  process.on("SIGTERM", () => {
    stopServer("keeper received SIGTERM");
    process.exit(0);
  });

  while (true) {
    if (!projectReady()) {
      setState("Waiting for SSD/project files to be available.");
      stopServer("SSD/project files are unavailable");
      await sleep(checkEveryMs);
      continue;
    }

    const healthy = await checkHealth();
    if (healthy) {
      failedChecks = 0;
      setState(`Word Helper is live at ${healthUrl}`);
      await sleep(checkEveryMs);
      continue;
    }

    failedChecks += 1;
    if (server && !server.killed && failedChecks < 3) {
      setState(`Word Helper missed health check ${failedChecks}/3; keeping the current server running.`);
      await sleep(checkEveryMs);
      continue;
    }

    failedChecks = 0;
    setState(`Word Helper is not responding on ${healthUrl}; starting it.`);
    stopServer("health check failed");
    await sleep(500);
    startServer();
    await sleep(checkEveryMs);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
