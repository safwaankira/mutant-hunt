---
mode: testing
max_steps: 20
url: http://localhost:4174/
---

# The text box empties after a task is added

Once a task has been added, the text field should be cleared so the next task can be typed fresh.

## Check the starting state
Open http://localhost:4174/. Verify the counter reads exactly "You have 5 of 5 tasks remaining." and that the text field with id "sampletodotext" is empty.

## Add a task
Type "Buy milk" into the text field with id "sampletodotext" and click the "Add" button. Verify the list now shows exactly six tasks, the last task is named "Buy milk", the counter reads exactly "You have 6 of 6 tasks remaining.", and the text field with id "sampletodotext" is now empty and no longer contains "Buy milk".
