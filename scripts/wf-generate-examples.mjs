export const meta = {
  name: 'generate-grounded-examples',
  description: 'Generate grounded dictionary example sentences for words missing one',
  phases: [
    { title: 'Generate', detail: 'one agent per slice; each reads its words from the shared input file and writes a batch JSON' },
  ],
};

// args: { inputFile: "<abs path to JSON array of {word,pos,def}>",
//         outDir: "<abs path>", total: <count>, batchSize?: 70, prefix?: "b" }
// args may arrive as a parsed object OR a JSON string — handle both.
let A = args;
if (typeof A === 'string') { try { A = JSON.parse(A); } catch { A = {}; } }
A = A || {};
const inputFile = A.inputFile;
const outDir = A.outDir;
const total = A.total || 0;
const BATCH = A.batchSize || 70;
const PREFIX = A.prefix || "b";

if (!inputFile || !outDir || !total) {
  log('ERROR: args.inputFile, args.outDir and args.total are required');
  return { error: 'bad-args', argsType: typeof args };
}

const nBatches = Math.ceil(total / BATCH);
log(`Generating grounded examples for ${total} words in ${nBatches} slices of ${BATCH}`);
phase('Generate');

const slices = [];
for (let i = 0; i < nBatches; i++) slices.push({ idx: i, start: i * BATCH, end: Math.min(total, (i + 1) * BATCH) });

const results = await parallel(
  slices.map((s) => () =>
    agent(
      [
        'You are a careful English dictionary editor writing example sentences.',
        `Step 1: Use the Read tool to read the JSON array file at: ${inputFile}`,
        `Step 2: Take ONLY the array elements from index ${s.start} up to (but not including) ${s.end}.`,
        '        Each element is {"word","pos","def"}.',
        'Step 3: For EACH of those words write exactly TWO natural example sentences that:',
        '   • use the EXACT word form (or a normal inflection of it),',
        '   • clearly fit the given part of speech and definition (the sense matters),',
        '   • are self-contained, everyday, and easy to understand,',
        '   • contain NO URLs, NO years/dates, NO cited authors, NO obscure proper nouns,',
        '   • start with a capital letter and end with . ! or ?.',
        '   Do NOT invent or change definitions — only demonstrate the given sense.',
        `Step 4: Use the Write tool to save ONE minified JSON object mapping word -> [sentence1, sentence2]`,
        `        (shape: {"word":["S1.","S2."], ...}) to this EXACT absolute path:`,
        `          ${outDir}/batch-${PREFIX}-${s.idx}.json`,
        '        Write valid JSON only — no markdown, no prose in the file.',
        `Step 5: Reply with exactly: ok ${s.idx}`,
      ].join('\n'),
      { label: `gen:${PREFIX}-${s.idx} (${s.end - s.start}w)`, phase: 'Generate', agentType: 'general-purpose' },
    ).then((r) => (r && String(r).toLowerCase().includes('ok') ? 1 : 0)).catch(() => 0),
  ),
);

const written = results.filter(Boolean).length;
log(`Slices reported done: ${written}/${nBatches}`);
return { batches: nBatches, written, total };
