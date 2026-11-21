---
mode: testing
max_steps: 30
url: http://localhost:4173/
---

# Deleting an active todo leaves the other todos' completed state alone

## Add three todos and complete one
Open http://localhost:4173/. Add a todo "Buy milk", then add a todo "Walk the dog", then add a todo "Pay rent". Tick the checkbox next to "Buy milk". Verify the footer counter reads exactly "2 items left" and "Buy milk" is shown as completed (struck through).

## Delete an active todo
Hover over the "Walk the dog" row and click its delete (×) button on the right. Verify exactly two todos are listed, "Buy milk" and "Pay rent", the footer counter reads exactly "1 item left", and "Buy milk" is still shown as completed (struck through) with its checkbox ticked.

## Check the Completed filter
Click the "Completed" filter. Verify exactly one todo is listed, it is "Buy milk", its checkbox is ticked, and the footer counter reads exactly "1 item left".
