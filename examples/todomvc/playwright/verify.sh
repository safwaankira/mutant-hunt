#!/usr/bin/env bash
# Run each exported Playwright test on the real app and on the bug it was written to catch.
# A good test: PASS on clean, FAIL on its bug. Needs: npm i && npx playwright install chromium.
# Without LT_USERNAME/LT_ACCESS_KEY (TestMu smart mode), steps that use visionQuery return null.
set -u
cd "$(dirname "$0")"
B=../mutant-hunt-report/builds
run() {
  (cd "$B/$1" && python3 -m http.server 4173 >/dev/null 2>&1) & srv=$!
  sleep 1
  TESTMU_HEADLESS=true node "$2" > /tmp/mh-pw.log 2>&1
  r=$(grep -oE "TEST (PASS|FAIL)" /tmp/mh-pw.log | head -1)
  kill $srv 2>/dev/null; wait $srv 2>/dev/null
  echo "${r:-ERROR}"
}
for pair in mh-m01:M01 mh-m02:M02 mh-m04-heal:M04 mh-m07:M07 mh-m08:M08 mh-m10:M10; do
  t=${pair%%:*}; bug=${pair##*:}
  echo "$t.test.js  real app: $(run clean $t.test.js)   bug $bug: $(run $bug $t.test.js)"
done
