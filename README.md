# Mutant Hunt

**Who tests your tests?** Mutant Hunt plants realistic bugs in your app, lets
[Kane CLI](https://www.testmuai.com/kane-cli/) hunt them in a real browser, and hands
every bug Kane misses back to your coding agent, which writes the Kane test that
catches it.

**▶ 3-minute demo: https://youtu.be/qCsWrZpO9sg** · **Live report: https://safwaankira.github.io/mutant-hunt/examples/todomvc/mutant-hunt-report/**

![Mutant Hunt report: Kane caught 10% of planted bugs before, 100% after](docs/report.png)

**Real run, TodoMVC, two starter Kane tests:** Claude Code planted 10 bugs. Kane caught **1**.
Every missed bug went back to Claude with Kane's report, Claude wrote 5 new Kane tests (two needed a
second try after Kane said "still passes"), and Kane then caught **all 9 real bugs**, each with its own
diagnosis, e.g. *"Todo edit field remains visible after saving: after Enter saves the changed todo, the page
does not leave editing mode"* (96% confident) for a flipped `iscanceled` check. The 10th change was
judged harmless, with the reason in the report. 51 Kane runs, 361 credits.
Full report: [`examples/todomvc/mutant-hunt-report`](examples/todomvc/mutant-hunt-report/index.html).

```bash
npm i -g @testmuai/kane-cli && kane-cli login --oauth
git clone https://github.com/safwaankira/mutant-hunt && cd mutant-hunt && npm i
cd examples/todomvc && node ../../bin/mutant-hunt.js run
```

## Why

Green end-to-end tests feel safe. They often aren't: a suite can click through every
screen and never check the number in the corner. Code coverage can't show that gap.
Mutation testing can (break the app on purpose and see whether a test notices), but until
now it only worked with unit tests. Mutant Hunt brings it to browser tests, and
then goes a step further: it fixes the gaps it finds.

## How it works

```
 your app ──► agent plants a bug ──► Kane runs your *_test.md in Chrome
                                        │
                     caught? ◄──────────┤
                        │               └─► missed ──► agent gets the diff + Kane's report
                        ▼                                │
                  kill score                             ▼
                                         agent writes a new Kane test
                                                         │
                         Kane: passes on the real app? ──┤──► no: Kane's failure goes back to the agent
                         Kane: fails on the bug?      ───┘──► no: "still passed" goes back to the agent
                                                         │
                                                  yes ──► caught, test kept
```

1. **Baseline.** Every Kane test must pass on the real app. Kane records each test the first time.
2. **Plant bugs.** The agent (Claude Code, Codex, or any OpenAI-compatible model) gets one source
   file at a time with one spot blanked out, and suggests a realistic wrong version: an
   off-by-one, the wrong filter, a flipped condition. Mutant Hunt keeps the ones that still parse.
3. **Hunt.** Each bug is served in turn and Kane replays your tests against it with
   **adaptive healing off** (`--no-adaptive-heal`). Healing would re-author a broken step and could
   work around the very bug we planted; with it off, a kill is Kane's evidence that the app broke.
4. **Close the loop.** Each bug Kane missed goes back to the agent with the diff and Kane's report.
   The agent writes a plain-English `*_test.md`. Kane must show it **passes on the real app** and
   **fails on the bug**. If either check fails, Kane's verdict and root cause go back to the agent for
   another try (up to 3). A new test is also replayed against the other bugs that are still uncaught.
5. **Report.** A kill score before and after, every bug with its diff, which test caught it, and
   **Kane's own diagnosis**: the failure title, root cause and screenshot that Kane's investigator seals
   into each run's evidence pack. `mutant-hunt-report/index.html` and `report.json`.

## Use it on your app

```bash
npx mutant-hunt init      # writes mutant-hunt.config.json and kane/smoke_test.md
npx mutant-hunt doctor    # Kane installed + signed in, agent CLI present
npx mutant-hunt run       # or: run --agent for NDJSON
```

```json
{
  "describe": "what the app does, in one line, for the agent",
  "app": "public",
  "mutate": ["js/*.js"],
  "tests": "kane",
  "port": 4173,
  "maxMutants": 10,
  "agent": "claude"
}
```

`app` is served as static files; for an app with its own dev server add `"start": "npm run dev"`
(it gets `PORT`). `agent` is `claude`, `codex` or `openai` (`MH_LLM_ENDPOINT`, `MH_LLM_API_KEY`,
`MH_LLM_MODEL`). Every agent answer is cached in `.mutant-hunt/cache`, so a rerun plants the same bugs for free.

**From Claude Code:** copy `skills/mutant-hunt` into `~/.claude/skills/` and ask
"how good are my Kane tests?". Claude runs `mutant-hunt run --agent`, reads the NDJSON stream
(`mh_baseline`, `mh_mutant`, `mh_loop`, `mh_score`, `mh_done`) and reports the score. Exit code
`0` means every bug was caught, so it also works as a CI gate.

## For judges

| Criterion | Where to look |
|---|---|
| Ships | `examples/todomvc`: a real app, real Kane runs, three commands above. Recorded run: `examples/todomvc/mutant-hunt-report/` |
| Verified | Each caught bug in the report has Kane's diagnosis (title, root cause, confidence) and its screenshot of the broken page, read from Kane's evidence pack (`readEvidence()` in `src/kane.js`). Healing is off for every bug run |
| Closed loop | `src/hunt.js` `closeOne()`: Kane's verdicts and root causes go into the agent's next prompt; the loop ends only when Kane proves pass-on-real and fail-on-bug. In the recorded run, M02 and M07 each took a second attempt after Kane's feedback |
| Craft | `npx`-style CLI, `doctor`, `--agent` NDJSON + exit codes, Claude Code skill, prompt cache, `npm test` (fake Kane + fake agent, runs offline) |

**What was reused, honestly.** The bug-planting prompts and site finder are adapted from
[LLMorpheus](https://github.com/neu-se/llmorpheus) (MIT, GitHub Next), see
`vendor/llmorpheus/NOTICE.md`. The demo app is [TodoMVC](https://github.com/tastejs/todomvc)'s
ES6 example (MIT), changed only to load without a bundler. Everything else (the Kane runner, the
hunt, the agent loop, the report, the skill) was written for the KaneCLI Online Hackathon, starting
from this repo's first commit.

## Licence

MIT. LLMorpheus and TodoMVC keep their own MIT notices.
