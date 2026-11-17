import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { findSites, renderPrompt, extractOptions, isInvalidSubstitution } from "../src/sites.js";
import { parseKaneStream } from "../src/kane.js";
import { renderReport } from "../src/report.js";

const here = path.dirname(fileURLToPath(import.meta.url));
const FIX = path.join(here, "fixtures");

test("finds LLMorpheus-style sites and renders a placeholder prompt", () => {
  const code = fs.readFileSync(path.join(FIX, "app/cart.js"), "utf8");
  const sites = findSites("cart.js", code);
  const kinds = sites.map((s) => `${s.feature}:${s.orig}`);
  assert.ok(kinds.includes("if:item.qty > 0"));
  assert.ok(kinds.includes("for-of:items"));
  assert.ok(kinds.includes("ternary:n === 1"));
  const p = renderPrompt(sites.find((s) => s.orig === "item.qty > 0"), code);
  assert.match(p, /if \(<PLACEHOLDER>\)/);
  assert.match(p, /which was:\n```\nitem\.qty > 0\n```/);
});

test("extracts options and filters invalid ones", () => {
  const c = "Option 1: The PLACEHOLDER can be replaced with:\n```\nitem.qty >= 0\n```\nThis would result in different behavior because zero-qty items count.\n\nOption 2: The PLACEHOLDER can be replaced with:\n```\nawait x\n```\nbecause no.\nDONE.";
  const opts = extractOptions(c);
  assert.equal(opts.length, 2);
  assert.equal(opts[0].replacement, "item.qty >= 0");
  assert.equal(opts[0].why, "zero-qty items count");
  assert.ok(isInvalidSubstitution({ orig: "a", component: "test" }, "await x"));
  assert.ok(!isInvalidSubstitution({ orig: "a", component: "test" }, "item.qty >= 0"));
});

test("parses a real Kane NDJSON stream", () => {
  const s = [
    '{"type":"stream_start","cli_version":"0.10.5"}',
    "Running on: Desktop · Chrome",
    '{"step":3,"status":"failed","remark":"assert: the counter shows 2 items left"}',
    '{"type":"run_end","status":"failed","one_liner":"counter showed 3 items left","credits_consumed":2.25}',
    '{"type":"test_md_done","overall_status":"failed","duration_s":12}',
  ].join("\n");
  const r = parseKaneStream(s);
  assert.equal(r.status, "failed");
  assert.equal(r.failedAt, "assert: the counter shows 2 items left");
  assert.equal(r.credits, 2.25);
});

test("full hunt: kills, closes the loop with a new test, scores before/after", async () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "mh-"));
  fs.cpSync(path.join(FIX, "app"), path.join(root, "app"), { recursive: true });
  fs.cpSync(path.join(FIX, "kane"), path.join(root, "kane"), { recursive: true });
  process.env.MH_FAKE_APP_DIR = path.join(root, ".mutant-hunt", "app");
  const { hunt } = await import("../src/hunt.js");
  // fake agent: plants a string-literal bug; writes a test pinned to the original line
  let n = 0;
  const model = {
    name: "fake-agent",
    async complete(system, prompt) {
      if (system.includes("mutation testing")) return `Option 1: The PLACEHOLDER can be replaced with:\n\`\`\`\n"MUTATED_${++n}"\n\`\`\`\nThis would result in different behavior because it is a constant.\nDONE.`;
      const orig = prompt.match(/^- (.*)$/m)[1];
      return `---\nmode: testing\n---\n# Guard\n## Check\nOpen the app and verify it.\n<!-- expect-source: ${orig} -->\n`;
    },
  };
  const fakeBin = path.join(FIX, "fake-kane.js");
  const events = [];
  const cfg = { root, app: "app", tests: "kane", port: 4199, maxMutants: 3, mutate: ["cart.js"], rounds: 1 };
  // run the fake Kane as a real child process, exactly like kane-cli
  const { spawnSync } = await import("node:child_process");
  const r = await hunt(cfg, {
    model, emit: (e) => events.push(e),
    runKane: async (file, opts) => {
      const res = spawnSync(process.execPath, [fakeBin, "testmd", "run", file], { encoding: "utf8", env: process.env });
      const p = parseKaneStream(res.stdout);
      return { ...p, verdict: res.status === 0 ? "passed" : "failed", exitCode: res.status };
    },
  });
  assert.equal(r.mutants.length, 3);
  assert.equal(r.before.killed, 1, "seed test catches the qty bug");
  assert.equal(r.after.killed, 3, "agent-written tests catch the rest");
  assert.equal(r.after.score, 100);
  assert.ok(r.added.length >= 1);
  assert.ok(events.some((e) => e.type === "mh_loop" && e.step === "kane_on_bug" && e.verdict === "failed"));
  assert.ok(fs.readFileSync(path.join(root, "app/cart.js"), "utf8").includes("item.qty > 0"), "original app untouched");
  const html = renderReport(r);
  assert.match(html, /33% <\/span>|33%/);
  assert.match(html, /100%/);
});

test("reads Kane's diagnosis and screenshot from an evidence pack", async () => {
  const { readEvidence, packEntry } = await import("../src/kane.js");
  const e = readEvidence(path.join(FIX, "kill.evidence"));
  assert.equal(e.runKind, "replay");
  assert.equal(e.title, "Counter shows wrong number");
  assert.equal(e.rootCause, "The footer counts completed todos as left.");
  assert.equal(e.screenshotEntry, "tests/guard/steps/9-1-3/screenshot.jpg");
  assert.ok(packEntry(e.pack, e.screenshotEntry, { binary: true }).length > 0);
});
