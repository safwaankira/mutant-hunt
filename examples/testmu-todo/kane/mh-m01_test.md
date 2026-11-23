---
mode: testing
max_steps: 20
url: http://localhost:4174/
---

# Fresh list starts with every task open

A new visitor should see all five starting tasks unchecked, none struck through, and a full remaining count.

## Check the starting state
Open http://localhost:4174/. Verify the counter reads exactly "You have 5 of 5 tasks remaining." and that the checkbox named "li1" next to "Complete initial setup" is unchecked and its text is not struck through.

## Complete the first task
Tick the checkbox named "li1". Verify the counter now reads exactly "You have 4 of 5 tasks remaining." and that "Complete initial setup" is now shown struck through.
