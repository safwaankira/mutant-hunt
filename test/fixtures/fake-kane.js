#!/usr/bin/env node
// Stand-in for kane-cli in unit tests. A test "passes" when every
// <!-- expect-source: ... --> marker in it appears in the served app's JS.
import fs from "node:fs";
import path from "node:path";
const args = process.argv.slice(2);
const file = args[2];
const appDir = process.env.MH_FAKE_APP_DIR;
const src = fs.readdirSync(appDir).filter((f) => f.endsWith(".js")).map((f) => fs.readFileSync(path.join(appDir, f), "utf8")).join("\n");
const text = fs.readFileSync(file, "utf8");
const expects = [...text.matchAll(/<!-- expect-source: (.*?) -->/g)].map((m) => m[1]);
const missing = expects.find((e) => !src.includes(e));
const status = missing ? "failed" : "passed";
const out = (o) => console.log(JSON.stringify(o));
out({ type: "stream_start", surface: "testmd" });
out({ step: 1, status: missing ? "failed" : "done", remark: missing ? `assert: page shows ${missing}` : "assert ok" });
out({ type: "run_end", status, one_liner: missing ? `expected ${missing} but the page differed` : "all checks passed", credits_consumed: 1.5 });
out({ type: "test_md_done", overall_status: status, duration_s: 1 });
process.exit(missing ? 1 : 0);
