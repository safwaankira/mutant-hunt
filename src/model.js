// The coding agent Mutant Hunt talks to. The same agent plants the bugs and
// later writes the Kane tests that catch them, so no extra API key is needed
// when Claude Code or Codex is already signed in.
//
// Every completion is cached on disk by prompt hash (the idea of LLMorpheus's
// CachingModel), so a re-run, a CI run or a judge replaying the demo gets the
// same mutants for free.

import { spawn } from "node:child_process";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

export function createModel({ agent = "claude", model, cacheDir, timeoutMs = 240_000, replay = false }) {
  const call = {
    claude: (system, prompt) =>
      run("claude", ["-p", "--output-format", "text", ...(model ? ["--model", model] : []), "--append-system-prompt", system], prompt, timeoutMs),
    codex: (system, prompt) =>
      run("codex", ["exec", "--skip-git-repo-check", ...(model ? ["-m", model] : []), "-"], `${system}\n\n${prompt}`, timeoutMs),
    openai: (system, prompt) => openaiCompatible(system, prompt, model),
    none: () => {
      throw new Error("No agent configured (agent: none). Set agent to claude, codex or openai.");
    },
  }[agent];
  if (!call) throw new Error(`Unknown agent "${agent}". Use claude, codex, openai or none.`);

  return {
    name: agent + (model ? `:${model}` : "") + (replay ? " (replay)" : ""),
    async complete(system, prompt, { cache = true } = {}) {
      const key = crypto.createHash("sha256").update(`${agent}|${model}|${system}|${prompt}`).digest("hex").slice(0, 24);
      const file = cacheDir && path.join(cacheDir, `${key}.txt`);
      if ((cache || replay) && file && fs.existsSync(file)) return fs.readFileSync(file, "utf8");
      if (replay) throw new Error("replay: no saved agent answer for this prompt (run without --replay to ask the agent)");
      const text = await call(system, prompt);
      if (file) {
        fs.mkdirSync(cacheDir, { recursive: true });
        fs.writeFileSync(file, text);
      }
      return text;
    },
  };
}

function run(cmd, args, input, timeoutMs) {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, { stdio: ["pipe", "pipe", "pipe"] });
    let out = "", err = "";
    const timer = setTimeout(() => { child.kill("SIGTERM"); reject(new Error(`${cmd} timed out after ${timeoutMs / 1000}s`)); }, timeoutMs);
    child.stdout.on("data", (d) => (out += d));
    child.stderr.on("data", (d) => (err += d));
    child.on("error", (e) => { clearTimeout(timer); reject(new Error(`could not start ${cmd}: ${e.message}`)); });
    child.on("close", (code) => {
      clearTimeout(timer);
      if (code === 0) resolve(out.trim());
      else reject(new Error(`${cmd} exited ${code}: ${(err.trim() || out.trim()).slice(-300)}`));
    });
    child.stdin.end(input);
  });
}

async function openaiCompatible(system, prompt, model) {
  const endpoint = process.env.MH_LLM_ENDPOINT;
  const key = process.env.MH_LLM_API_KEY;
  if (!endpoint || !key) throw new Error("agent openai needs MH_LLM_ENDPOINT and MH_LLM_API_KEY");
  const res = await fetch(endpoint, {
    method: "POST",
    headers: { "content-type": "application/json", authorization: `Bearer ${key}` },
    body: JSON.stringify({
      model: model || process.env.MH_LLM_MODEL,
      messages: [{ role: "system", content: system }, { role: "user", content: prompt }],
      temperature: 0,
    }),
  });
  if (!res.ok) throw new Error(`LLM endpoint ${res.status}: ${(await res.text()).slice(0, 300)}`);
  const json = await res.json();
  return json.choices?.[0]?.message?.content ?? "";
}
