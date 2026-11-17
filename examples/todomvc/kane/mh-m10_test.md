---
mode: testing
max_steps: 30
url: http://localhost:4173/
---

# Editing a todo and pressing Enter saves the new text

## Add a todo
Open http://localhost:4173/. Add a todo "Buy milk". Verify exactly one todo is listed and it is "Buy milk", and the footer counter reads exactly "1 item left".

## Rename the todo by editing it
Double-click the text "Buy milk" to edit it. Clear the edit field, type "Buy bread", and press Enter. Verify the edit field is no longer shown and exactly one todo is listed, with the text "Buy bread".

## Check the list after the edit
Without clicking anything, look at the todo list on the current page. Verify the only todo is "Buy bread", no todo with the text "Buy milk" is visible anywhere in the list, and the footer counter reads exactly "1 item left".
