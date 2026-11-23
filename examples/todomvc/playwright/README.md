# Kane's tests, exported as Playwright code

Each file is `kane-cli testmd export <test> --language javascript` for one of the six
Kane tests Claude wrote (from the recordings in `kane/output-*`, no new browser run).
They use TestMu's `@testmuai/playwright-bindings` on top of Playwright 1.57.

```bash
npm i && npx playwright install chromium
./verify.sh   # each test on the real app, then on the bug it was written for
```

**Result without TestMu credentials (23 Nov 2026, headless Chromium):**

| Test | Real app | Its bug | Works offline? |
|---|---|---|---|
| mh-m01 | PASS | FAIL (M01) | yes |
| mh-m07 | PASS | FAIL (M07) | yes |
| mh-m02 | FAIL | FAIL | no |
| mh-m04-heal | FAIL | FAIL | no |
| mh-m08 | FAIL | FAIL | no |
| mh-m10 | FAIL | FAIL | no |

2 of 6 exports catch their bug as plain local code. The other 4 contain steps that ask
TestMu's vision model (`visionQuery`, `getVisionCoordinates`). Without `LT_USERNAME` and
`LT_ACCESS_KEY` in `.env` (smart mode), those steps return `null`, so the test fails on the
real app too. With credentials they should behave like the Kane runs; we have not checked that.
