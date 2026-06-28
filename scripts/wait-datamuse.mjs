// Poll Datamuse until the CloudFront/WAF 403 block clears (HTTP 200), then exit.
// Exits 0 when unblocked, 1 if still blocked after the max window. Lets the agent
// be notified the moment enrichment can resume, without tight polling.
const MAX_TRIES = Number(process.argv[2] || 90);   // ~90 min at 60s cadence
const INTERVAL_MS = 60_000;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

for (let i = 1; i <= MAX_TRIES; i++) {
  let status = 0;
  try {
    const res = await fetch("https://api.datamuse.com/words?sp=face&md=dpsrf&max=1", {
      signal: AbortSignal.timeout(8000),
    });
    status = res.status;
    if (res.status === 200) {
      const j = await res.json();
      if (Array.isArray(j) && j[0] && j[0].word === "face") {
        console.log(`UNBLOCKED after ${i} check(s): HTTP 200, sample ok.`);
        process.exit(0);
      }
    }
  } catch (e) {
    status = `ERR ${e.name}`;
  }
  console.log(`[${new Date().toISOString()}] try ${i}/${MAX_TRIES}: HTTP ${status} — still blocked`);
  if (i < MAX_TRIES) await sleep(INTERVAL_MS);
}
console.log("STILL BLOCKED after max window — likely a daily-quota block; needs a longer wait.");
process.exit(1);
