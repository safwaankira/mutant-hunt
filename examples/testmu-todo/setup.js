#!/usr/bin/env node
// Fetches TestMu AI's sample to-do app (github.com/LambdaTest/sample-todo-app) into ./app
// and moves its inline <script> into app/app.js so Mutant Hunt can plant bugs in it.
// The app is fetched at run time, not committed here: its repo has no licence file.
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const here = path.dirname(new URL(import.meta.url).pathname);
const app = path.join(here, "app");
const COMMIT = process.env.SAMPLE_TODO_COMMIT || "main";

if (!fs.existsSync(path.join(app, "index.html"))) {
  execFileSync("git", ["clone", "-q", "https://github.com/LambdaTest/sample-todo-app", app], { stdio: "inherit" });
  if (COMMIT !== "main") execFileSync("git", ["-C", app, "checkout", "-q", COMMIT], { stdio: "inherit" });
}
const htmlPath = path.join(app, "index.html");
let html = fs.readFileSync(htmlPath, "utf8");
const re = /<script type="text\/javascript">([\s\S]*?)<\/script>/;
const m = html.match(re);
if (m) {
  fs.writeFileSync(path.join(app, "app.js"), m[1].replace(/^\n/, "").replace(/\s+$/, "\n"));
  html = html.replace(re, '<script src="app.js"></script>');
  fs.writeFileSync(htmlPath, html);
}
const sha = execFileSync("git", ["-C", app, "rev-parse", "--short", "HEAD"]).toString().trim();
console.log(`sample-todo-app @ ${sha} ready in ${app} (logic in app/app.js)`);
