#!/usr/bin/env node
// mutant-hunt: who tests your tests? Plant realistic bugs, let Kane CLI hunt
// them in a real browser, and have your coding agent close every gap.

import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { hunt } from "../src/hunt.js";
import { createModel } from "../src/model.js";
import { renderReport, renderSummary } from "../src/report.js";
import { KANE_BIN } from "../src/kane.js";

const HELP = `mutant-hunt - who tests your tests?

Usage:
  mutant-hunt run      [--config mutant-hunt.config.json] [--max-mutants N] [--rounds N]
                       [--agent-cli claude|codex|openai] [--model NAME] [--agent]
  mutant-hunt report   [--config ...]   re-render the HTML report from the last run
  mutant-hunt doctor                    check Kane CLI, sign-in, Chrome and the agent
  mutant-hunt init                      write a starter config and a first Kane test

--agent   NDJSON on stdout (one event per line, last one is {"type":"mh_done"}),
          for Claude Code, Codex or CI. Exit 0 = every non-equivalent bug caught,
          1 = some survived, 2 = could not run.`;

function args(argv) {
  const out = { _: [] };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith("--")) {
      const k = a.slice(2);
      const v = argv[i + 1] && !argv[i + 1].startsWith("--") ? argv[++i] : true;
      out[k] = v;
    } else out._.push(a);
  }
  return out;
}

function loadConfig(file) {
  const p = path.resolve(file);
  if (!fs.existsSync(p)) throw new Error(`No config at ${p}. Run "mutant-hunt init" first.`);
  const c = JSON.parse(fs.readFileSync(p, "utf8"));
  return {
    root: path.dirname(p), app: ".", tests: "kane", port: 4173, maxMutants: 10, agent: "claude", rounds: 2,
    ...c,
    mutate: [].concat(c.mutate ?? []),
  };
}

async function main() {
  const a = args(process.argv.slice(2));
  const cmd = a._[0] ?? "help";
  const agentMode = Boolean(a.agent);
  const emit = (e) => {
    if (agentMode) process.stdout.write(JSON.stringify({ ...e, ts: new Date().toISOString() }) + "\n");
    else if (e.type === "mh_baseline") console.log(`baseline  ${e.verdict.padEnd(7)} ${e.test}`);
    else if (e.type === "mh_mutants") console.log(`planted   ${e.count} bugs (from ${e.sites} possible sites)`);
    else if (e.type === "mh_mutant") console.log(`${e.status === "killed" ? "caught   " : e.status.padEnd(9)} ${e.id} ${e.file ?? ""}${e.line ? ":" + e.line : ""} ${e.killed_by ? "by " + e.killed_by : ""}${e.bonus ? " (bonus)" : ""}`);
    else if (e.type === "mh_score") console.log(`score     ${e.phase}: ${e.score}% (${e.killed} caught / ${e.killed + e.survived})`);
    else if (e.type === "mh_loop") console.log(`  loop    ${e.id} #${e.attempt} ${e.step}${e.verdict ? " -> " + e.verdict : ""}${e.note ? " (" + e.note + ")" : ""}`);
    else if (e.type === "mh_warning") console.error(`warning   ${e.message}`);
  };

  if (cmd === "help" || a.help) return console.log(HELP), 0;

  if (cmd === "doctor") {
    const check = (label, ok, hint) => console.log(`${ok ? "ok  " : "FAIL"} ${label}${ok ? "" : "  -> " + hint}`);
    const v = spawnSync(KANE_BIN, ["--version"], { encoding: "utf8" });
    check(`Kane CLI ${v.stdout?.trim() ?? ""}`, v.status === 0, "npm install -g @testmuai/kane-cli");
    const w = spawnSync(KANE_BIN, ["whoami"], { encoding: "utf8" });
    check("Kane CLI signed in", w.status === 0, "kane-cli login --oauth");
    const agent = a["agent-cli"] ?? "claude";
    const g = spawnSync(agent === "codex" ? "codex" : "claude", ["--version"], { encoding: "utf8" });
    check(`agent: ${agent}`, g.status === 0, agent === "codex" ? "npm i -g @openai/codex" : "npm i -g @anthropic-ai/claude-code");
    return 0;
  }

  if (cmd === "init") {
    const cfgPath = path.resolve(a.config ?? "mutant-hunt.config.json");
    if (!fs.existsSync(cfgPath)) {
      fs.writeFileSync(cfgPath, JSON.stringify({ app: "public", mutate: ["src/*.js"], tests: "kane", port: 4173, maxMutants: 10, describe: "my web app" }, null, 2) + "\n");
      console.log(`wrote ${cfgPath} - point "app" at your static build and "mutate" at its source files`);
    }
    fs.mkdirSync(path.resolve("kane"), { recursive: true });
    const t = path.resolve("kane/smoke_test.md");
    if (!fs.existsSync(t)) {
      fs.writeFileSync(t, `---\nmode: testing\nmax_steps: 30\nurl: http://localhost:4173/\n---\n\n# Smoke\n\n## Open the app\nOpen http://localhost:4173/ and verify the main heading is visible.\n`);
      console.log(`wrote ${t}`);
    }
    return 0;
  }

  const cfg = loadConfig(a.config ?? "mutant-hunt.config.json");
  const outDir = path.join(cfg.root, ".mutant-hunt");
  const reportJson = path.join(cfg.root, "mutant-hunt-report", "report.json");

  if (cmd === "report") {
    const r = JSON.parse(fs.readFileSync(reportJson, "utf8"));
    fs.writeFileSync(path.join(path.dirname(reportJson), "index.html"), renderReport(r));
    console.log(renderSummary(r));
    return 0;
  }

  if (cmd === "run") {
    if (a["max-mutants"]) cfg.maxMutants = Number(a["max-mutants"]);
    const model = createModel({ agent: a["agent-cli"] ?? cfg.agent, model: a.model ?? cfg.model, cacheDir: path.join(outDir, "cache") });
    const r = await hunt(cfg, { model, emit, rounds: Number(a.rounds ?? cfg.rounds) });
    fs.mkdirSync(path.dirname(reportJson), { recursive: true });
    fs.writeFileSync(reportJson, JSON.stringify(r, null, 2));
    fs.writeFileSync(path.join(path.dirname(reportJson), "index.html"), renderReport(r));
    if (agentMode) emit({ type: "mh_done", before: r.before, after: r.after, added: r.added, credits: r.credits, report: path.relative(process.cwd(), path.join(path.dirname(reportJson), "index.html")), uncaught: r.mutants.filter((m) => m.status === "survived").map((m) => ({ id: m.id, file: m.file, line: m.line, diff: m.diff })) });
    else console.log("\n" + renderSummary(r) + `\n\nreport: ${path.relative(process.cwd(), path.join(path.dirname(reportJson), "index.html"))}`);
    return r.after.survived ? 1 : 0;
  }

  console.error(HELP);
  return 2;
}

main().then((code) => process.exit(code ?? 0)).catch((e) => {
  if (process.argv.includes("--agent")) process.stdout.write(JSON.stringify({ type: "mh_done", error: e.message }) + "\n");
  else console.error(`mutant-hunt: ${e.message}`);
  process.exit(2);
});
