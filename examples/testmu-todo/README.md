# TestMu AI's own sample to-do app

[LambdaTest/sample-todo-app](https://github.com/LambdaTest/sample-todo-app) is the app TestMu AI's
official Selenium samples test (`python-selenium-sample/lambdatest.py`,
`nodejs-selenium-sample/index.js`, `java-testng-selenium`). Those samples tick `li1` and `li2`, add a
task, and check one thing: that the heading is displayed.

`kane/official_sample_test.md` is that sample, ported to Kane step for step, with the same single check.
Mutant Hunt asks: which bugs in the app would that test miss?

```bash
node setup.js                      # clones the app into ./app, moves its inline script to app/app.js
node ../../bin/mutant-hunt.js run  # needs Kane CLI signed in and Claude Code
```

The app is fetched at run time, not committed here, because its repo has no licence file.
`"sites": "extended"` in the config also plants bugs in assigned, stored and returned values,
since this app keeps most of its logic there (6 sites by default, 17 extended).

Upstream: the checks behind these catches are proposed to TestMu's Python sample in
[LambdaTest/python-selenium-sample#25](https://github.com/LambdaTest/python-selenium-sample/pull/25).
