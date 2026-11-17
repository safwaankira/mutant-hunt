// One self-contained HTML page per hunt: the score jump first, then every bug
// with its diff, who caught it and what Kane saw.

const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);

export function renderReport(r) {
  const rows = r.mutants.map((m) => {
    const tag = m.status === "killed" ? (m.closedByLoop || m.closedInRound ? "caught by new test" : "caught") : m.status;
    const cls = m.status === "killed" ? (m.closedByLoop || m.closedInRound ? "new" : "kill") : m.status;
    const diff = esc(m.diff).replace(/^(- .*)$/m, '<span class="del">$1</span>').replace(/^(\+ .*)$/m, '<span class="add">$1</span>');
    return `<article class="m ${cls}">
  <header><b>${esc(m.id)}</b><span class="where">${esc(m.file)}:${m.line}</span><span class="pill ${cls}">${esc(tag)}</span></header>
  <pre>${diff}</pre>
  ${m.why ? `<p class="why">Planted because ${esc(m.why)}.</p>` : ""}
  ${m.killedBy ? `<p class="by">Caught by <code>${esc(m.killedBy)}</code>${m.loopAttempts ? ` &middot; agent attempt ${m.loopAttempts}` : ""}</p>` : ""}
  ${m.kane?.title || m.kane?.rootCause ? `<div class="kane">${m.screenshot ? `<a class="shot" href="${esc(m.screenshot)}" title="Kane's screenshot at the failing step (click for full size)"><img src="${esc(m.screenshot)}" alt="Kane's screenshot of the broken app at the failing step"></a>` : ""}<div><span class="kl">Kane's diagnosis${m.kane.confidence ? ` &middot; ${Math.round(m.kane.confidence * 100)}% confident` : ""}</span><b>${esc(m.kane.title ?? "")}</b><p>${esc(m.kane.rootCause ?? "")}</p></div></div>` : m.evidence ? `<p class="ev">Kane: ${esc(m.evidence)}</p>` : ""}
</article>`;
  }).join("\n");
  const added = r.added.map((a) => `<li><code>${esc(a.test)}</code> written for ${esc(a.forMutant)} (${a.attempts} attempt${a.attempts > 1 ? "s" : ""})</li>`).join("");
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Mutant Hunt: ${r.before.score}% → ${r.after.score}%</title>
<style>
:root{--bg:#0d0f0c;--ink:#e8eadf;--dim:#8d927f;--line:#262a22;--kill:#9be15d;--new:#ffd23f;--surv:#ff5d5d;--card:#14171200}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--ink);font:15px/1.5 ui-monospace,"JetBrains Mono",Menlo,monospace}
main{max-width:980px;margin:0 auto;padding:40px 20px 80px}
.kicker{color:var(--dim);letter-spacing:.12em;text-transform:uppercase;font-size:12px}
h1{font:700 clamp(44px,9vw,96px)/1 ui-monospace,Menlo,monospace;margin:10px 0 6px;letter-spacing:-.04em}
h1 .from{color:var(--surv)}h1 .to{color:var(--kill)}h1 .arrow{color:var(--dim);font-weight:400}
.sub{color:var(--dim);margin:0 0 28px;max-width:60ch}
.stats{display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:1px;background:var(--line);border:1px solid var(--line);margin-bottom:32px}
.stats div{background:var(--bg);padding:14px 16px}.stats b{display:block;font-size:26px}.stats span{color:var(--dim);font-size:12px}
.bar{display:flex;height:10px;margin:0 0 32px;border:1px solid var(--line)}.bar i{display:block}
h2{font-size:13px;color:var(--dim);text-transform:uppercase;letter-spacing:.12em;margin:36px 0 12px}
.m{border:1px solid var(--line);border-left:4px solid var(--dim);padding:12px 16px;margin:0 0 10px}
.m.kill{border-left-color:var(--kill)}.m.new{border-left-color:var(--new)}.m.survived{border-left-color:var(--surv)}
.m header{display:flex;gap:12px;align-items:center;flex-wrap:wrap}.where{color:var(--dim)}
.pill{margin-left:auto;font-size:12px;padding:2px 8px;border:1px solid currentColor}
.pill.kill{color:var(--kill)}.pill.new{color:var(--new)}.pill.survived{color:var(--surv)}.pill.equivalent,.pill.error{color:var(--dim)}
pre{margin:10px 0 6px;white-space:pre-wrap;color:var(--dim)}.del{color:var(--surv)}.add{color:var(--kill)}
.why,.by,.ev{margin:4px 0;color:var(--dim)}.ev{color:var(--ink)}code{color:var(--new)}
ul{padding-left:18px;color:var(--dim)}
.kane{display:grid;grid-template-columns:200px 1fr;gap:14px;margin-top:10px;padding:10px;background:#11140f;border:1px solid var(--line)}
.shot{display:block;position:relative;height:150px;overflow:hidden;border:1px solid var(--line);background:#f5f5f5}
.shot img{position:absolute;width:${r.zoom ?? 420}%;left:50%;top:-6%;transform:translateX(-50%)}.kane b{display:block;color:var(--ink);margin:2px 0 4px}.kane p{margin:0;color:var(--dim)}
.kl{font-size:11px;letter-spacing:.1em;text-transform:uppercase;color:var(--new)}
@media(max-width:640px){.kane{grid-template-columns:1fr}}footer{margin-top:48px;color:var(--dim);font-size:12px}
</style></head><body><main>
<div class="kicker">Mutant Hunt &middot; verified with Kane CLI</div>
<h1><span class="from">${r.before.score}%</span> <span class="arrow">→</span> <span class="to">${r.after.score}%</span></h1>
<p class="sub">We planted ${r.mutants.length} realistic bugs in <b>${esc(r.app)}</b>. Kane CLI hunted them in a real browser. The ones it missed went back to the agent (${esc(r.agent)}), which wrote new Kane tests until Kane caught them.</p>
<div class="bar">${bar(r)}</div>
<div class="stats">
<div><b>${r.after.killed}</b><span>bugs caught</span></div>
<div><b>${r.after.survived}</b><span>still uncaught</span></div>
<div><b>${r.added.length}</b><span>tests the agent added</span></div>
<div><b>${r.kaneRuns}</b><span>Kane runs</span></div>
<div><b>${r.credits}</b><span>Kane credits</span></div>
</div>
<h2>Every planted bug</h2>
${rows}
<h2>Tests the agent added</h2>
<ul>${added || "<li>None needed.</li>"}</ul>
<footer>Mutants from an LLMorpheus-style prompt (MIT, GitHub Next). Kane runs replay with adaptive healing off, so a kill is Kane's evidence, not a heal. ${esc(r.finishedAt)}</footer>
</main></body></html>`;
}

function bar(r) {
  const total = r.mutants.length || 1;
  const kill = r.mutants.filter((m) => m.status === "killed" && !m.closedByLoop && !m.closedInRound).length;
  const fresh = r.mutants.filter((m) => m.status === "killed" && (m.closedByLoop || m.closedInRound)).length;
  const surv = r.mutants.filter((m) => m.status === "survived").length;
  const other = total - kill - fresh - surv;
  const seg = (n, c) => (n ? `<i style="width:${(n / total) * 100}%;background:${c}"></i>` : "");
  return seg(kill, "var(--kill)") + seg(fresh, "var(--new)") + seg(surv, "var(--surv)") + seg(other, "var(--line)");
}

export function renderSummary(r) {
  const lines = [
    `Mutant Hunt: ${r.before.score}% -> ${r.after.score}% of planted bugs caught by Kane`,
    `  ${r.mutants.length} bugs planted, ${r.after.killed} caught, ${r.after.survived} uncaught, ${r.after.equivalent} harmless`,
    `  ${r.added.length} Kane tests added by ${r.agent}; ${r.kaneRuns} Kane runs, ${r.credits} credits`,
  ];
  for (const m of r.mutants.filter((x) => x.status === "survived")) lines.push(`  uncaught ${m.id} ${m.file}:${m.line}  ${m.orig}  ->  ${m.replacement}`);
  return lines.join("\n");
}
