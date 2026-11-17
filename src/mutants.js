// Plants bugs: asks the agent for buggy replacements at a spread of sites and
// keeps the ones that still parse and are not duplicates. Mirrors LLMorpheus's
// MutantGenerator pipeline (prompt -> 3 options -> filter -> dedupe).

import fs from "node:fs";
import path from "node:path";
import {
  findSites, renderPrompt, extractOptions, isInvalidSubstitution,
  applySubstitution, isSyntacticallyValid, pickSites, SYSTEM_PROMPT,
} from "./sites.js";

export async function generateMutants({ appDir, files, model, maxMutants, optionsPerSite = 1, concurrency = 4, log = () => {} }) {
  const sources = {};
  const sitesByFile = {};
  for (const rel of files) {
    const code = fs.readFileSync(path.join(appDir, rel), "utf8");
    sources[rel] = code;
    sitesByFile[rel] = findSites(rel, code);
  }
  const total = Object.values(sitesByFile).reduce((n, s) => n + s.length, 0);
  // ask for ~1.5x the budget: some completions are invalid or duplicates
  const sites = pickSites(sitesByFile, Math.ceil(maxMutants * 1.5));
  log({ type: "mh_sites", files: files.length, sites: total, sampled: sites.length });

  const mutants = [];
  const failures = [];
  let next = 0;
  const worker = async () => {
    while (next < sites.length && mutants.length < maxMutants) {
      const site = sites[next++];
      const code = sources[site.file];
      let text;
      try {
        text = await model.complete(SYSTEM_PROMPT, renderPrompt(site, code));
      } catch (e) {
        failures.push(e.message);
        log({ type: "mh_warning", message: `agent failed on ${site.file}:${site.line}: ${e.message}` });
        // the agent is down (not signed in, no network): stop instead of burning through every site
        if (failures.length >= 3 && !mutants.length) next = sites.length;
        continue;
      }
      let kept = 0;
      for (const opt of extractOptions(text)) {
        if (kept >= optionsPerSite || mutants.length >= maxMutants) break;
        if (isInvalidSubstitution(site, opt.replacement)) continue;
        const mutated = applySubstitution(code, site, opt.replacement);
        if (!isSyntacticallyValid(mutated)) continue;
        if (mutants.some((m) => m.file === site.file && m.start === site.start && m.replacement === opt.replacement)) continue;
        mutants.push({
          file: site.file, line: site.line, start: site.start, end: site.end, feature: site.feature,
          orig: site.orig, replacement: opt.replacement, why: opt.why,
        });
        kept++;
      }
    }
  };
  await Promise.all(Array.from({ length: concurrency }, worker));
  if (!mutants.length && failures.length) {
    throw new Error(`The agent (${model.name}) could not plant any bugs: ${failures.at(-1)}. Check it works on its own, e.g. echo hi | claude -p`);
  }
  // stable ids in file/line order, so reports and caches line up between runs
  mutants.sort((a, b) => a.file.localeCompare(b.file) || a.start - b.start);
  mutants.forEach((m, i) => (m.id = `M${String(i + 1).padStart(2, "0")}`));
  return { mutants, sources, totalSites: total };
}

export function mutatedSource(sources, m) {
  return applySubstitution(sources[m.file], m, m.replacement);
}

/** A unified-diff style one-hunk view used in prompts and the report. */
export function mutantDiff(sources, m) {
  const lines = sources[m.file].split("\n");
  const before = lines[m.line - 1];
  const after = mutatedSource(sources, m).split("\n")[m.line - 1];
  return `--- ${m.file}:${m.line}\n- ${before.trim()}\n+ ${after.trim()}`;
}
