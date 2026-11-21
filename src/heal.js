// Does Kane's adaptive healing hide real bugs?
//
// Mutant Hunt replays with --no-adaptive-heal so a kill is hard evidence. Kane's
// default, and what most CI setups run, is healing ON: when a recorded step no
// longer matches the page, Kane re-authors it. This replays every bug Kane caught
// with healing ON and records which ones it would have healed its way around.
//
// Healing can write a new recording, so each test's recording folder is
// snapshotted before the run and put back after it: the suite is left exactly
// as it was.

import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { runKaneTest as realRunKaneTest } from "./kane.js";
import { serveStatic, startCommand, copyDir } from "./serve.js";
import { applySubstitution } from "./sites.js";
import { closeOne, killKind } from "./hunt.js";
import { mutantDiff } from "./mutants.js";

export async function healCheck(cfg, report, { runKane = realRunKaneTest, emit = () => {} } = {}) {
  const root = cfg.root;
  const appDir = path.resolve(root, cfg.app);
  const testsDir = path.resolve(root, cfg.tests);
  const work = path.resolve(root, ".mutant-hunt", "app");
  copyDir(appDir, work);
  const sources = Object.fromEntries(cfg.mutate.map((f) => [f, fs.readFileSync(path.join(appDir, f), "utf8")]));
  const restore = () => { for (const f of Object.keys(sources)) fs.writeFileSync(path.join(work, f), sources[f]); };
  const server = cfg.start ? await startCommand(cfg.start, work, cfg.port, `http://localhost:${cfg.port}/`) : await serveStatic(work, cfg.port);
  const url = cfg.url ?? server.url;
  const results = [];
  let credits = 0;
  try {
    for (const m of report.mutants.filter((x) => x.status === "killed" && x.killedBy)) {
      const testFile = path.join(testsDir, m.killedBy);
      if (!fs.existsSync(testFile)) { results.push({ id: m.id, test: m.killedBy, verdict: "skipped", note: "test file not found" }); continue; }
      restore();
      fs.writeFileSync(path.join(work, m.file), applySubstitution(sources[m.file], m, m.replacement));
      const stem = m.killedBy.replace(/_test\.md$/, "");
      const rec = path.join(testsDir, `output-${stem}`);
      const snap = fs.mkdtempSync(path.join(os.tmpdir(), "mh-heal-"));
      if (fs.existsSync(rec)) fs.cpSync(rec, path.join(snap, "rec"), { recursive: true });
      let r;
      try {
        r = await runKane(testFile, { url, heal: true });
      } finally {
        fs.rmSync(rec, { recursive: true, force: true });
        if (fs.existsSync(path.join(snap, "rec"))) fs.cpSync(path.join(snap, "rec"), rec, { recursive: true });
        fs.rmSync(snap, { recursive: true, force: true });
      }
      credits += r.credits || 0;
      const row = {
        id: m.id, test: m.killedBy, verdict: r.verdict,
        masked: r.verdict === "passed",
        kane: r.evidence?.title ? [r.evidence.title, r.evidence.rootCause].filter(Boolean).join(" - ") : r.oneLiner || "",
      };
      results.push(row);
      emit({ type: "mh_heal", ...row });
    }
  } finally {
    restore();
    await server.close();
  }
  const checked = results.filter((x) => x.verdict === "passed" || x.verdict === "failed");
  return {
    finishedAt: new Date().toISOString(),
    checked: checked.length,
    masked: checked.filter((x) => x.masked).length,
    stillCaught: checked.filter((x) => !x.masked).length,
    credits: Math.round(credits * 10) / 10,
    results,
  };
}

/** One clickable copy of the app per planted bug, plus a clean copy, for the report. */
export function writeBuilds(cfg, report, reportDir) {
  const appDir = path.resolve(cfg.root, cfg.app);
  const out = path.join(reportDir, "builds");
  fs.rmSync(out, { recursive: true, force: true });
  copyDir(appDir, path.join(out, "clean"));
  for (const m of report.mutants) {
    const dir = path.join(out, m.id);
    copyDir(appDir, dir);
    const src = fs.readFileSync(path.join(appDir, m.file), "utf8");
    fs.writeFileSync(path.join(dir, m.file), applySubstitution(src, m, m.replacement));
    m.build = `builds/${m.id}/`;
  }
  report.cleanBuild = "builds/clean/";
}

/**
 * The closed loop for healing: every bug that healing hid goes back to the agent,
 * which writes a test whose failing check is a final verify. Kane must show it
 * passes on the real app and fails on the bug WITH healing on.
 */
export async function closeHealed(cfg, report, { model, runKane = realRunKaneTest, emit = () => {}, attempts = 3 } = {}) {
  const hidden = (report.healCheck?.results ?? []).filter((x) => x.masked).map((x) => report.mutants.find((m) => m.id === x.id)).filter(Boolean);
  if (!hidden.length) return [];
  const root = cfg.root;
  const appDir = path.resolve(root, cfg.app);
  const testsDir = path.resolve(root, cfg.tests);
  const work = path.resolve(root, ".mutant-hunt", "app");
  copyDir(appDir, work);
  const sources = Object.fromEntries(cfg.mutate.map((f) => [f, fs.readFileSync(path.join(appDir, f), "utf8")]));
  const restore = () => { for (const f of Object.keys(sources)) fs.writeFileSync(path.join(work, f), sources[f]); };
  const plant = (m) => { restore(); fs.writeFileSync(path.join(work, m.file), applySubstitution(sources[m.file], m, m.replacement)); };
  const server = cfg.start ? await startCommand(cfg.start, work, cfg.port, `http://localhost:${cfg.port}/`) : await serveStatic(work, cfg.port);
  const url = cfg.url ?? server.url;
  const listTests = () => fs.readdirSync(testsDir).filter((f) => f.endsWith("_test.md")).sort().map((f) => path.join(testsDir, f));
  let credits = 0;
  const kane = async (file, opts = {}) => { const r = await runKane(file, { url, ...opts }); credits += r.credits || 0; return r; };
  const closed = [];
  try {
    for (const m of hidden) {
      const proof = {};
      const res = await closeOne(m, {
        cfg, url, sources, testsDir, model, kane, plant, restore, attempts, emit, listTests, bugHeal: true,
        recordKill: (_m, test, r) => Object.assign(proof, { test, kane: r.evidence?.title ? [r.evidence.title, r.evidence.rootCause].filter(Boolean).join(" - ") : r.oneLiner, message: r.evidence?.message ?? null }),
      });
      closed.push({ id: m.id, closed: Boolean(res), attempts: res?.attempts ?? attempts, ...proof });
      emit({ type: "mh_heal_close", id: m.id, closed: Boolean(res), test: proof.test ?? null, kane: proof.kane ?? null });
    }
  } finally {
    restore();
    await server.close();
  }
  report.healCheck.closed = closed;
  report.healCheck.closeCredits = Math.round(credits * 10) / 10;
  return closed;
}

export { killKind, mutantDiff };
