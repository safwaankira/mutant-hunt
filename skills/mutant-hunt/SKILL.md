---
name: mutant-hunt
description: Measure and improve how many real bugs a Kane CLI test suite catches. Use when the user asks "are my tests any good", "would my e2e tests catch this", wants mutation testing for browser tests, or wants the Kane suite hardened before a release.
---

# Mutant Hunt

Mutant Hunt plants realistic bugs in the app's source, runs the project's Kane CLI
tests (`*_test.md`) against each one in a real browser, and sends every bug Kane
misses back to you to write a new Kane test, until Kane catches it.

## Run it

From the folder with `mutant-hunt.config.json`:

```bash
npx mutant-hunt doctor                 # Kane installed + signed in, agent CLI present
npx mutant-hunt run --agent            # NDJSON, one event per line
```

Exit codes: `0` every non-equivalent bug caught, `1` some bugs still uncaught, `2` could not run.

## Read the stream

- `mh_baseline` - each existing test on the real app. All must pass; if one fails, stop and fix it first.
- `mh_mutant` - one planted bug: `status` is `killed` (with `killed_by` and Kane's `evidence`) or `survived`.
- `mh_loop` - the closed loop for a survivor: `agent_wrote_test`, `kane_on_real_app`, `kane_on_bug`.
- `mh_score` - `before` and `after` kill scores.
- `mh_done` - final line: `before`, `after`, `added` tests, Kane `credits`, the `report` path, and `uncaught` bugs with their diffs.

## After a run

Tell the user the score jump in one line (for example "Kane now catches 9/10 planted bugs, up from 4/10"),
list the new tests by file name, and open `mutant-hunt-report/index.html`.

For any `uncaught` bug left in `mh_done`, you can close it yourself: read its diff, write one more
`kane/<name>_test.md` whose final step verifies the exact value the bug breaks, then run
`kane-cli testmd run kane/<name>_test.md --agent` on the real app (must pass) and rerun
`npx mutant-hunt run --agent` to confirm Kane now catches it. Never edit the app source to make a test pass.
