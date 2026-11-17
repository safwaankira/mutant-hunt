// The hunt: baseline -> plant bugs -> Kane hunts each one -> every bug that
// survives goes back to the agent, which writes a new Kane test -> Kane proves
// the test passes on the real app and fails on the bug -> repeat.

import fs from "node:fs";
import path from "node:path";
import { runKaneTest as realRunKaneTest, packEntry } from "./kane.js";
import { serveStatic, startCommand, copyDir } from "./serve.js";
import { generateMutants, mutatedSource, mutantDiff } from "./mutants.js";

const WRITER_SYSTEM = `You write end-to-end tests for Kane CLI (TestMu AI). A Kane test is a Markdown file:
YAML frontmatter, a "# Title", then one "## Step" heading per step whose body is a plain-English objective.
Rules for steps:
- Start the first step by opening the start URL you are given.
- Use intent-level actions with literal data ("Add a todo named \\"Buy milk\\"").
- End every step with a verify that is a look at the current page, never an extra click.
- Assert exact visible values (counts, text, which items are shown) - that is what catches bugs.
- Keep it short: 2-5 steps. Never mention mutants, bugs, source code or file names in the test.
Reply with ONLY the test file content, no fences, no commentary.
If the planted change cannot change anything a user can see or do in the browser, reply with exactly: EQUIVALENT: <one-line reason>`;

/** Kane's own words for a run: its failure title and root cause when it has them. */
function kaneSays(r) {
  const e = r.evidence;
  if (e?.title || e?.rootCause) return [e.title, e.rootCause].filter(Boolean).join(" - ");
  return r.oneLiner || r.summary || "";
}

function keepScreenshot(r, reportDir, name) {
  const e = r.evidence;
  if (!e?.screenshotEntry || !reportDir) return null;
  const buf = packEntry(e.pack, e.screenshotEntry, { binary: true });
  if (!buf) return null;
  fs.mkdirSync(path.join(reportDir, "shots"), { recursive: true });
  const rel = `shots/${name}.jpg`;
  fs.writeFileSync(path.join(reportDir, rel), buf);
  return rel;
}

export async function hunt(cfg, { model, runKane = realRunKaneTest, emit = () => {}, rounds = 2, attempts = 3 } = {}) {
  const root = cfg.root;
  const appDir = path.resolve(root, cfg.app);
  const testsDir = path.resolve(root, cfg.tests);
  const work = path.resolve(root, ".mutant-hunt", "app");
  const reportDir = path.resolve(root, cfg.reportDir ?? "mutant-hunt-report");
  fs.mkdirSync(testsDir, { recursive: true });
  copyDir(appDir, work);

  const server = cfg.start
    ? await startCommand(cfg.start, work, cfg.port, `http://localhost:${cfg.port}/`)
    : await serveStatic(work, cfg.port);
  const url = cfg.url ?? server.url;
  const ledger = { credits: 0, kaneRuns: 0 };
  const kane = async (file, opts = {}) => {
    const r = await runKane(file, { url, ...opts });
    ledger.credits += r.credits || 0;
    ledger.kaneRuns++;
    return r;
  };
  const listTests = () => fs.readdirSync(testsDir).filter((f) => f.endsWith("_test.md")).sort().map((f) => path.join(testsDir, f));

  try {
    // 1. Baseline: the suite must pass on the real app, or every "kill" is noise.
    const baseline = [];
    for (const t of listTests()) {
      const r = await kane(t, { heal: true }); // first run authors the recording
      baseline.push({ test: path.basename(t), verdict: r.verdict, oneLiner: r.oneLiner });
      emit({ type: "mh_baseline", test: path.basename(t), verdict: r.verdict, one_liner: r.oneLiner });
      if (r.verdict !== "passed") {
        throw new Error(`Baseline failed: ${path.basename(t)} does not pass on the real app (${r.verdict}: ${kaneSays(r) || r.stderr || r.error}). Fix the test or the app first.`);
      }
    }
    if (!baseline.length) throw new Error(`No *_test.md files in ${cfg.tests}. Write at least one Kane test first (mutant-hunt init makes one).`);

    // 2. Plant bugs.
    const { mutants, sources, totalSites } = await generateMutants({
      appDir: work, files: cfg.mutate, model, maxMutants: cfg.maxMutants, log: emit,
    });
    emit({ type: "mh_mutants", count: mutants.length, sites: totalSites });

    const restore = () => { for (const f of Object.keys(sources)) fs.writeFileSync(path.join(work, f), sources[f]); };
    const plant = (m) => { restore(); fs.writeFileSync(path.join(work, m.file), mutatedSource(sources, m)); };

    // 3. Kane hunts each bug with the current suite (stop at the first kill: cheaper).
    const huntOne = async (m, tests) => {
      plant(m);
      m.runs = m.runs ?? [];
      for (const t of tests) {
        const r = await kane(t, { heal: false });
        m.runs.push({ test: path.basename(t), verdict: r.verdict, kane: kaneSays(r) });
        if (r.verdict === "failed") {
          recordKill(m, path.basename(t), r);
          return;
        }
        if (r.verdict === "error") { m.status = "error"; m.evidence = r.stderr || r.error; return; }
      }
      m.status = "survived";
    };

    const recordKill = (m, test, r) => {
      Object.assign(m, {
        status: "killed", killedBy: test, evidence: kaneSays(r),
        kane: r.evidence ? { title: r.evidence.title, rootCause: r.evidence.rootCause, category: r.evidence.category, confidence: r.evidence.confidence, message: r.evidence.message } : null,
        screenshot: keepScreenshot(r, reportDir, m.id),
      });
    };

    for (const m of mutants) {
      await huntOne(m, listTests());
      m.round0 = m.status;
      emit({ type: "mh_mutant", id: m.id, file: m.file, line: m.line, status: m.status, killed_by: m.killedBy ?? null, kane: m.evidence ?? null });
    }
    const before = score(mutants);
    emit({ type: "mh_score", phase: "before", ...before });

    // 4. Closed loop: survivors go back to the agent with Kane's evidence.
    const added = [];
    for (let round = 1; round <= rounds; round++) {
      const survivors = mutants.filter((m) => m.status === "survived");
      if (!survivors.length) break;
      for (const m of survivors) {
        if (m.status !== "survived") continue; // killed by a test added earlier this round
        const result = await closeOne(m, { cfg, url, sources, testsDir, model, kane, plant, restore, attempts, emit, listTests, recordKill });
        if (result?.testFile) {
          added.push({ test: path.basename(result.testFile), forMutant: m.id, attempts: result.attempts });
          // a new test often catches other survivors too: replays are cheap, so check them all
          for (const other of mutants.filter((x) => x.status === "survived" && x !== m)) {
            plant(other);
            const r = await kane(result.testFile, { heal: false });
            other.runs.push({ test: path.basename(result.testFile), verdict: r.verdict, kane: kaneSays(r) });
            if (r.verdict === "failed") {
              recordKill(other, path.basename(result.testFile), r);
              other.closedInRound = round;
              emit({ type: "mh_mutant", id: other.id, status: "killed", killed_by: other.killedBy, kane: other.evidence, bonus: true });
            }
          }
        }
      }
    }
    restore();
    const after = score(mutants);
    emit({ type: "mh_score", phase: "after", ...after });

    return {
      app: cfg.name ?? cfg.app, url, agent: model.name, finishedAt: new Date().toISOString(),
      baseline, mutants: mutants.map((m) => ({ ...m, diff: mutantDiff(sources, m) })),
      before, after, added, credits: Math.round(ledger.credits * 10) / 10, kaneRuns: ledger.kaneRuns,
    };
  } finally {
    await server.close();
  }
}

async function closeOne(m, { cfg, url, sources, testsDir, model, kane, plant, restore, attempts, emit, listTests, recordKill }) {
  const existing = listTests().map((t) => `### ${path.basename(t)}\n${fs.readFileSync(t, "utf8")}`).join("\n\n");
  const kaneSaw = (m.runs ?? []).map((r) => `- ${r.test}: passed on the changed app${r.kane ? ` (${r.kane})` : ""}`).join("\n");
  const fileName = `mh-${m.id.toLowerCase()}_test.md`;
  const testFile = path.join(testsDir, fileName);
  let feedback = "";
  for (let attempt = 1; attempt <= attempts; attempt++) {
    const prompt = `App under test: ${cfg.describe ?? "a web app"}
Start URL: ${url}

A small change was planted in the app's code:
${mutantDiff(sources, m)}
(why it changes behaviour: ${m.why || "n/a"})

Every existing Kane test still PASSES with this change in place, so the suite misses it. Kane's reports:
${kaneSaw}

Existing tests (do not repeat them; find the user-visible behaviour they never check):
${existing}
${feedback}
Write ONE new Kane test that passes on the original app and fails with this change.`;
    let text;
    try {
      text = (await model.complete(WRITER_SYSTEM, prompt, { cache: attempt === 1 })).trim();
    } catch (e) {
      emit({ type: "mh_warning", message: `agent failed writing a test for ${m.id}: ${e.message}` });
      return null;
    }
    if (/^EQUIVALENT:/i.test(text)) {
      Object.assign(m, { status: "equivalent", evidence: text.replace(/^EQUIVALENT:\s*/i, "") });
      emit({ type: "mh_loop", id: m.id, attempt, step: "equivalent", note: m.evidence });
      return null;
    }
    text = text.replace(/^```[a-z]*\n?|\n?```$/g, "").trim() + "\n";
    if (!text.startsWith("---")) text = `---\nmode: testing\nmax_steps: 30\nurl: ${url}\n---\n\n` + text;
    fs.writeFileSync(testFile, text);
    emit({ type: "mh_loop", id: m.id, attempt, step: "agent_wrote_test", test: fileName });

    // must pass on the real app (this run authors its recording)
    restore();
    const onReal = await kane(testFile, { heal: true });
    emit({ type: "mh_loop", id: m.id, attempt, step: "kane_on_real_app", verdict: onReal.verdict, kane: kaneSays(onReal) });
    if (onReal.verdict !== "passed") {
      feedback = `\nYour previous attempt:\n${text}\nKane ran it on the ORIGINAL app and it did not pass (${onReal.verdict}). Kane's report: ${kaneSays(onReal) || "no details"}${onReal.evidence?.suggestedFix ? `. Kane suggests: ${onReal.evidence.suggestedFix}` : ""}\nThe app is correct here, so the test is wrong: fix it so it passes on the original app.\n`;
      wipeRecording(testFile);
      continue;
    }
    // must fail on the bug (replay, healing off)
    plant(m);
    const onBug = await kane(testFile, { heal: false });
    emit({ type: "mh_loop", id: m.id, attempt, step: "kane_on_bug", verdict: onBug.verdict, kane: kaneSays(onBug) });
    m.runs.push({ test: fileName, verdict: onBug.verdict, kane: kaneSays(onBug) });
    if (onBug.verdict === "failed") {
      recordKill(m, fileName, onBug);
      Object.assign(m, { closedByLoop: true, loopAttempts: attempt });
      return { testFile, attempts: attempt };
    }
    feedback = `\nYour previous attempt:\n${text}\nKane ran it with the change in place and it still PASSED${kaneSays(onBug) ? ` (${kaneSays(onBug)})` : ""}, so its checks never touch what the change breaks.\nMake the final verify check the exact value or item that the change breaks.\n`;
    wipeRecording(testFile);
  }
  fs.rmSync(testFile, { force: true });
  wipeRecording(testFile);
  return null;
}

function wipeRecording(testFile) {
  const stem = path.basename(testFile).replace(/_test\.md$/, "");
  fs.rmSync(path.join(path.dirname(testFile), `output-${stem}`), { recursive: true, force: true });
}

export function score(mutants) {
  const counted = mutants.filter((m) => m.status === "killed" || m.status === "survived");
  const killed = counted.filter((m) => m.status === "killed").length;
  return {
    killed, survived: counted.length - killed,
    equivalent: mutants.filter((m) => m.status === "equivalent").length,
    errors: mutants.filter((m) => m.status === "error").length,
    score: counted.length ? Math.round((killed / counted.length) * 100) : 0,
  };
}
