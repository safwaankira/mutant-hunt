# LLMorpheus

`src/sites.js` and `templates/` are adapted from LLMorpheus by GitHub Next and
Northeastern University (MIT, see `LICENSE` in this folder), commit eb910ed45b524737bffd45af3fbae03d212ae1ab:
https://github.com/neu-se/llmorpheus

Taken: the idea of prompting an LLM with the source file and a `<PLACEHOLDER>`
at one site, the site kinds (if / switch / loops / calls), the prompt template
and system prompt, the "Option N" answer format, and the invalid-substitution filters.
Not taken: StrykerJS, the unit-test runner, the benchmark harness.
New in Mutant Hunt: Kane CLI as the test runner in a real browser, the
agent-in-the-loop that writes Kane tests for surviving bugs, and the report.
