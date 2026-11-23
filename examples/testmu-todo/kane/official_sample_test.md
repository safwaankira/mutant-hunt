---
mode: testing
max_steps: 20
url: http://localhost:4174/
---

# TestMu AI's official Selenium sample, ported to Kane

Same steps and the same single check as python-selenium-sample/lambdatest.py and
nodejs-selenium-sample/index.js: tick li1 and li2, add "LambdaTest", check the heading.

## Tick two tasks and add one
Open http://localhost:4174/. Tick the checkbox named "li1", then tick the checkbox named "li2". Type "LambdaTest" into the text field with id "sampletodotext" and click the "Add" button. Verify the "TestMu AI To-Do" heading is displayed.
