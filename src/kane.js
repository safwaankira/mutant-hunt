// Runs one Kane CLI test file against whatever the dev server is serving and
// turns its NDJSON stream into a verdict.
//
// Mutant runs use --no-adaptive-heal: with healing on, Kane would re-author a
// step that broke and could "heal" its way around the very bug we planted.
// With it off, a replay that no longer matches the app is a failure, so a
// mutant counts as killed only on Kane's evidence.

import { spawn } from "node:child_process";
import path from "node:path";

export const KANE_BIN = process.env.MH_KANE_BIN || "kane-cli";

export function parseKaneStream(stdout) {
  const events = [];
  for (const line of stdout.split("\n")) {
    const t = line.trim();
    if (!t.startsWith("{")) continue;
    try { events.push(JSON.parse(t)); } catch { /* progress text */ }
  }
  const done = events.findLast((e) => e.type === "test_md_done");
  const runEnds = events.filter((e) => e.type === "run_end");
  const failedStep = events.findLast((e) => e.status === "failed" && e.remark);
  const credits = runEnds.reduce((n, e) => n + (Number(e.credits_consumed) || 0), 0);
  const lastEnd = runEnds.at(-1);
  return {
    events,
    status: done?.overall_status ?? lastEnd?.status ?? null,
    oneLiner: lastEnd?.one_liner ?? "",
    summary: lastEnd?.summary ?? "",
    failedAt: failedStep?.remark ?? null,
    reason: lastEnd?.reason ?? done?.reason ?? "",
    shareUrl: done?.share_url ?? lastEnd?.test_url ?? null,
    credits,
    durationS: done?.duration_s ?? lastEnd?.duration ?? null,
  };
}

/**
 * @returns {Promise<{verdict: "passed"|"failed"|"error", exitCode:number, ...}>}
 *   passed  = the app behaved as the test expects
 *   failed  = Kane saw the app break the test (a kill, when the app is a mutant)
 *   error   = nothing ran (sign-in, Chrome, parse error) - never counted as a kill
 */
export function runKaneTest(testFile, { url, heal = false, timeoutS = 240, headless = true, cwd } = {}) {
  const args = ["testmd", "run", path.resolve(testFile), "--agent", "--timeout", String(timeoutS), "--on-lock-conflict", "readonly"];
  if (headless) args.push("--headless");
  if (!heal) args.push("--no-adaptive-heal");
  if (url) args.push("--url", url);
  return new Promise((resolve) => {
    const child = spawn(KANE_BIN, args, { cwd: cwd ?? path.dirname(path.resolve(testFile)), env: { ...process.env, KANE_CLI_USER_AGENT: "mutant-hunt" } });
    let out = "", err = "";
    child.stdout.on("data", (d) => (out += d));
    child.stderr.on("data", (d) => (err += d));
    child.on("error", (e) => resolve({ verdict: "error", exitCode: -1, error: `could not start ${KANE_BIN}: ${e.message}`, credits: 0 }));
    child.on("close", (exitCode) => {
      const parsed = parseKaneStream(out);
      let verdict;
      if (exitCode === 0 && parsed.status !== "failed") verdict = "passed";
      else if (exitCode === 1 || parsed.status === "failed") verdict = "failed";
      else verdict = "error"; // 2 = didn't start, 3 = timeout/cancelled
      if (exitCode === 3) verdict = "failed"; // a saved test reports timeouts as failures (Kane docs)
      resolve({ ...parsed, verdict, exitCode, stderr: err.trim().slice(-600), test: path.basename(testFile) });
    });
  });
}
