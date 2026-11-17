// Finds the places in a JS/TS file where a bug can be planted, and renders the
// LLM prompt for each one.
//
// Adapted from LLMorpheus (MIT, Copyright (c) 2024 GitHub, Inc):
//   src/generator/PromptSpecGenerator.ts and src/generator/MutantGenerator.ts
//   https://github.com/neu-se/llmorpheus  (see vendor/llmorpheus/)
// Changes: plain JS, character offsets from Babel instead of line/column
// bookkeeping, for-loop headers reduced to the test, and a site budget so a
// browser-level run stays affordable.

import { parse } from "@babel/parser";
import _traverse from "@babel/traverse";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const traverse = _traverse.default ?? _traverse;
const here = path.dirname(fileURLToPath(import.meta.url));
const TEMPLATE = fs.readFileSync(path.join(here, "../templates/template-full.hb"), "utf8");
export const SYSTEM_PROMPT =
  fs.readFileSync(path.join(here, "../templates/SystemPrompt-MutationTestingExpert.txt"), "utf8") +
  " Prefer bugs a user would notice in the browser (wrong counts, wrong filtering, items not saved, wrong text), not crashes in dead code.";

export function parseCode(code) {
  return parse(code, { sourceType: "module", plugins: ["typescript", "jsx"] });
}

/** Every mutation site in one file: {file, feature, component, start, end, orig, line}. */
export function findSites(file, code) {
  const ast = parseCode(code);
  const sites = [];
  const add = (feature, component, node) => {
    if (!node || node.start == null) return;
    const orig = code.slice(node.start, node.end);
    if (!orig.trim() || orig.includes("\n")) return; // single-line fragments only (LLMorpheus default)
    sites.push({ file, feature, component, start: node.start, end: node.end, orig, line: node.loc.start.line });
  };
  traverse(ast, {
    IfStatement(p) { add("if", "test", p.node.test); },
    SwitchStatement(p) { add("switch", "discriminant", p.node.discriminant); },
    WhileStatement(p) { add("while", "test", p.node.test); },
    DoWhileStatement(p) { add("do-while", "test", p.node.test); },
    ForStatement(p) { add("for", "test", p.node.test); },
    ForInStatement(p) { add("for-in", "right", p.node.right); },
    ForOfStatement(p) { add("for-of", "right", p.node.right); },
    ConditionalExpression(p) { add("ternary", "test", p.node.test); },
    CallExpression(p) {
      const { callee, arguments: args } = p.node;
      if (p.node.loc.end.line !== p.node.loc.start.line) return;
      const calleeText = code.slice(callee.start, callee.end);
      if (calleeText === "require" || calleeText === "super" || calleeText === "import") return;
      add("call", "callee", callee);
      args.forEach((a, i) => add("call", "arg" + i, a));
    },
  });
  // de-duplicate identical ranges (a call inside an if test, etc.)
  const seen = new Set();
  return sites.filter((s) => {
    const k = `${s.start}:${s.end}`;
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
}

/** LLMorpheus prompt for a site: the file with the fragment replaced by <PLACEHOLDER>. */
export function renderPrompt(site, code) {
  let withPlaceholder = code.slice(0, site.start) + "<PLACEHOLDER>" + code.slice(site.end);
  withPlaceholder = withPlaceholder.replace(/\(\s*<PLACEHOLDER>\s*\)/g, "(<PLACEHOLDER>)");
  const lines = withPlaceholder.split("\n");
  if (lines.length > 200) {
    const at = lines.findIndex((l) => l.includes("<PLACEHOLDER>"));
    withPlaceholder = lines.slice(Math.max(0, at - 100), at + 100).join("\n");
  }
  return TEMPLATE.replace("{{{code}}}", () => withPlaceholder).replace("{{{orig}}}", () => site.orig);
}

/** Pull "Option N" substitutions and their one-line reasons out of a completion. */
export function extractOptions(completion) {
  const out = [];
  const re = /```[a-zA-Z]*\n([\s\S]*?)\n?```([^`]*?)(?=Option \d|DONE|$)/g;
  let m;
  while ((m = re.exec(completion))) {
    const replacement = m[1].trim();
    const why = (m[2].match(/because ([^\n]*)/)?.[1] ?? "").replace(/\.$/, "").trim();
    if (replacement) out.push({ replacement, why });
  }
  return out;
}

// Filters from LLMorpheus MutantGenerator.isInvalidSubstitution, trimmed to the cases that apply here.
function hasUnbalancedParens(s) {
  let depth = 0;
  for (const c of s) {
    if (c === "(") depth++;
    if (c === ")" && --depth < 0) return true;
  }
  return depth !== 0;
}
export function isInvalidSubstitution(site, sub) {
  const banned = ["yield", "delete", "process", "require", "setImmediate", "setTimeout", "await", "async", "//", "import("];
  return (
    sub === site.orig ||
    sub.includes("\n") ||
    hasUnbalancedParens(sub) ||
    banned.some((b) => sub.includes(b)) ||
    (site.component === "callee" && sub.includes("(")) ||
    (sub.startsWith("/") && sub.endsWith("/") && !(site.orig.startsWith("/") && site.orig.endsWith("/")))
  );
}

export function applySubstitution(code, site, sub) {
  return code.slice(0, site.start) + sub + code.slice(site.end);
}

/** True when the mutated file still parses. */
export function isSyntacticallyValid(code) {
  try {
    parseCode(code);
    return true;
  } catch {
    return false;
  }
}

/**
 * Pick a spread of sites: round-robin across files, then by feature, so a small
 * budget still covers the whole app instead of the first 10 calls in one file.
 */
export function pickSites(sitesByFile, budget, seed = 7) {
  const rng = mulberry32(seed);
  const queues = Object.values(sitesByFile).map((sites) => {
    const preferred = sites.filter((s) => s.feature !== "call" || s.component !== "callee");
    return shuffle([...preferred], rng);
  });
  const picked = [];
  while (picked.length < budget && queues.some((q) => q.length)) {
    for (const q of queues) {
      if (q.length && picked.length < budget) picked.push(q.shift());
    }
  }
  return picked;
}

function mulberry32(a) {
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function shuffle(arr, rng) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
