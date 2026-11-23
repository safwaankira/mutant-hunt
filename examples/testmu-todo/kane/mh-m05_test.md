---
mode: testing
max_steps: 20
url: http://localhost:4174/
---

# A one-character task can be added to the list

A new task whose name is a single character is still a real task. It should be added to the list and counted like any other task.

## Check the starting state
Open http://localhost:4174/. Verify the counter reads exactly "You have 5 of 5 tasks remaining." and that the list shows exactly five tasks.

## Add a one-character task
Type "A" into the text field with id "sampletodotext" and click the "Add" button. Verify the list now shows exactly six tasks, the last task in the list is named "A" and is unchecked, and the counter reads exactly "You have 6 of 6 tasks remaining."

## Add a one-digit task
Type "5" into the text field with id "sampletodotext" and click the "Add" button. Verify the list now shows exactly seven tasks, the last two tasks are "A" followed by "5", and the counter reads exactly "You have 7 of 7 tasks remaining."
