---
mode: testing
max_steps: 30
url: http://localhost:4173/
---

# Clear completed appears and works when a single todo is completed

## Add two todos and complete one
Open http://localhost:4173/. Add a todo "Buy milk", then add a todo "Walk the dog". Tick the checkbox next to "Buy milk". Verify the footer counter reads exactly "1 item left" and a button with the text "Clear completed" is visible in the footer.

## Clear the single completed todo
Click the "Clear completed" button in the footer. Verify exactly one todo is listed and it is "Walk the dog", no row with the text "Buy milk" is visible, and the footer counter reads exactly "1 item left".
