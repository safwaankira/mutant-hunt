import testmu, { resolveVar, setVar } from '@testmuai/playwright-bindings';
import { expect } from '@playwright/test';

testmu.configure({
  "build": "7303c270-79f7-444f-ab66-9a482653b99f",
  "name": "Edit Todo Item Text",
  "tcId": "TC-14",
  "network": (process.env.NETWORK ?? "false").toLowerCase() === "true",
  "autoHealVersion": "AH2",
  "defaultActionTimeoutMs": 10000,
  "defaultNavigationTimeoutMs": 60000,
  "kaneRunV4": true
});

testmu.test("Edit Todo Item Text", async (page) => {
  let element_0, element_1;
  await testmu.step("Navigate to http://localhost:4173/", { instructionId: "a0fde963-bc73-4110-9a32-6b054f52813a" }, async () => {
    await page.goto("http://localhost:4173/");
  });
  
  await testmu.step("Waiting for the queued plan to be processed", { instructionId: "cc1b637d-bad7-4d8b-b070-3fa1f13e0597" }, async () => {
    await page.waitForTimeout(1000);
  });
  
  await testmu.step("Type \"Buy milk\" into \"What needs to be done?\"", { instructionId: "54715b4f-dcfe-4230-84ed-eb7ff673752b" }, async () => {
    element_0 = page.locator("internal:role=textbox[name=\"What needs to be done?\"i]");
    await testmu.fill(element_0, "Buy milk");
  });
  
  await testmu.step("Submitting the new todo by pressing Enter", { instructionId: "b40ba34d-a1b7-4ceb-9ca8-4d55176ff08a" }, async () => {
    await page.keyboard.press("Enter");
  });
  
  await testmu.step("Counting the todo entries in the list", async () => {
    await page.waitForLoadState("domcontentloaded", { timeout: 5000 });
    setVar("todo_count_check", await testmu.textualAnalyzer(page, { wrappedJs: "(els) => {\n  const __m = {9: 0};\n  const el = (i) => els[__m[i]];\n  const __v = (el(9).querySelectorAll(':scope > li').length);\n  return (typeof __v === 'boolean' ? String(__v) : __v);\n}", locators: ["internal:role=list >> internal:has-text=\"Buy milk\"i"], query: "the number of todo entries in the todo list", expectedValue: "1", needsUnitConversion: false, operator: "equals", transforms: [], condition: "Exactly one todo is listed." }));
  });
  
  await testmu.step("Reading the listed todo text", async () => {
    await page.waitForLoadState("domcontentloaded", { timeout: 5000 });
    setVar("listed_todo_check", await testmu.textualAnalyzer(page, { wrappedJs: "(els) => {\n  const __m = {12: 0};\n  const el = (i) => els[__m[i]];\n  const __v = (el(12).textContent);\n  return (typeof __v === 'boolean' ? String(__v) : __v);\n}", locators: ["internal:text=\"Buy milk\"i"], query: "the text of the listed todo label", expectedValue: "Buy milk", needsUnitConversion: false, operator: "equals", transforms: ["strip"], condition: "The listed todo is \"Buy milk\"." }));
  });
  
  await testmu.step("Reading the todo footer counter", async () => {
    await page.waitForLoadState("domcontentloaded", { timeout: 5000 });
    setVar("footer_counter_check", await testmu.textualAnalyzer(page, { wrappedJs: "(els) => {\n  const __m = {13: 0};\n  const el = (i) => els[__m[i]];\n  const __v = (el(13).querySelector('.todo-count')?.textContent ?? null);\n  return (typeof __v === 'boolean' ? String(__v) : __v);\n}", locators: ["internal:text=\"item left All Active Completed\"i"], query: "the item counter text in the todo footer", expectedValue: "1 item left", needsUnitConversion: false, operator: "equals", transforms: ["strip"], condition: "The footer counter reads exactly \"1 item left\"." }));
  });
  
  await testmu.step("Assertion check", { instructionId: "b99b96e9-fe45-40b8-bcc0-df45aa06486b" }, async () => {
    await testmu.verifyAssertion(page, "Assertion check", {"operator": ["equals"], "assertion_operands": [], "left_operand": null, "right_operand": null, "operands": [], "sub_results": [{"description": "Exactly one todo is listed.", "passed": true, "operator": "equals", "transforms": [], "json_path": null, "expected": "1", "extracted_value": "{{todo_count_check}}", "store_key": "todo_count_check", "variable_refs": {"{{todo_count_check}}": "1"}}, {"description": "The listed todo is \"Buy milk\".", "passed": true, "operator": "equals", "transforms": ["strip"], "json_path": null, "expected": "Buy milk", "extracted_value": "{{listed_todo_check}}", "store_key": "listed_todo_check", "variable_refs": {"{{listed_todo_check}}": "Buy milk"}}, {"description": "The footer counter reads exactly \"1 item left\".", "passed": true, "operator": "equals", "transforms": ["strip"], "json_path": null, "expected": "1 item left", "extracted_value": "{{footer_counter_check}}", "store_key": "footer_counter_check", "variable_refs": {"{{footer_counter_check}}": "1 item left"}}], "sub_checks": [{"description": "Exactly one todo is listed.", "store_key": "todo_count_check", "expected_value": "1", "extracted_value": "{{todo_count_check}}", "operator": "equals", "transforms": []}, {"description": "The listed todo is \"Buy milk\".", "store_key": "listed_todo_check", "expected_value": "Buy milk", "extracted_value": "{{listed_todo_check}}", "operator": "equals", "transforms": ["strip"]}, {"description": "The footer counter reads exactly \"1 item left\".", "store_key": "footer_counter_check", "expected_value": "1 item left", "extracted_value": "{{footer_counter_check}}", "operator": "equals", "transforms": ["strip"]}], "composite_operator": "and", "claim": "exactly one todo is listed and it is \"Buy milk\", and the footer counter reads exactly \"1 item left\"."});
  });
  
  await testmu.step("PRIMARY: Double-click the text \"Buy milk\" to edit it; role=text; text=\"Buy milk\" | HINTS: container=single todo list item below the main input", { instructionId: "3c24875c-7c92-4067-800c-94c8e40b9eec" }, async () => {
    const _c_1 = await testmu.getVisionCoordinates(page, "PRIMARY: Double-click the text \"Buy milk\" to edit it; role=text; text=\"Buy milk\" | HINTS: container=single todo list item below the main input", "click", 789, 224);
    await page.mouse.dblclick(_c_1.x, _c_1.y);
  });
  
  await testmu.step("Waiting for the queued plan to start", { instructionId: "231ae2a2-b89a-47b5-a8be-2ccb33db2d7f" }, async () => {
    await page.waitForTimeout(1000);
  });
  
  await testmu.step("Type \"Buy bread\" into \"textbox\"", { instructionId: "c10e2d07-2267-4157-88ba-158d2b3b2a8b" }, async () => {
    element_1 = page.locator("internal:role=main >> internal:role=textbox");
    await testmu.fill(element_1, "Buy bread");
  });
  
  await testmu.step("Press Enter", { instructionId: "183f85f7-7cf1-4898-8199-4a9065383912" }, async () => {
    await page.keyboard.press("Enter");
  });
  
  await testmu.step("Waiting for the edited todo to settle", { instructionId: "cd24c0fb-db41-492d-acef-1cbceb72bacc" }, async () => {
    await page.waitForTimeout(200);
  });
  
  await testmu.step("Checking whether the edit field is present", async () => {
    await page.waitForLoadState("domcontentloaded", { timeout: 5000 });
    setVar("edit_field_shown", await testmu.textualAnalyzer(page, { wrappedJs: "(els) => {\n  const __m = {9: 0};\n  const el = (i) => els[__m[i]];\n  const __v = (el(9).querySelector('input.edit') !== null);\n  return (typeof __v === 'boolean' ? String(__v) : __v);\n}", locators: ["internal:role=list >> internal:has-text=\"Buy bread\"i"], query: "whether an edit field is present in the todo list", expectedValue: "false", needsUnitConversion: false, operator: "equals", transforms: [], condition: "the edit field is no longer shown" }));
  });
  
  await testmu.step("Reading the todo count from the todo list", async () => {
    await page.waitForLoadState("domcontentloaded", { timeout: 5000 });
    setVar("todo_count_check", await testmu.textualAnalyzer(page, { wrappedJs: "(els) => {\n  const __m = {9: 0};\n  const el = (i) => els[__m[i]];\n  const __v = (el(9).querySelectorAll('[role=\"listitem\"], li').length);\n  return (typeof __v === 'boolean' ? String(__v) : __v);\n}", locators: ["internal:role=list >> internal:has-text=\"Buy bread\"i"], query: "the number of todo items in the todo list", expectedValue: "1", needsUnitConversion: false, operator: "equals", transforms: [], condition: "exactly one todo is listed" }));
  });
  
  await testmu.step("Reading the listed todo text", async () => {
    await page.waitForLoadState("domcontentloaded", { timeout: 5000 });
    setVar("todo_text_check", await testmu.textualAnalyzer(page, { wrappedJs: "(els) => {\n  const __m = {12: 0};\n  const el = (i) => els[__m[i]];\n  const __v = (el(12).textContent);\n  return (typeof __v === 'boolean' ? String(__v) : __v);\n}", locators: ["internal:text=\"Buy bread\"i"], query: "the text of the listed todo item", expectedValue: "Buy bread", needsUnitConversion: false, operator: "equals", transforms: ["strip"], condition: "the listed todo text is \"Buy bread\"" }));
  });
  
  await testmu.step("Assertion check", { instructionId: "206c3983-0e9c-4de3-b6fd-608ce3b42706" }, async () => {
    await testmu.verifyAssertion(page, "Assertion check", {"operator": ["equals"], "assertion_operands": [], "left_operand": null, "right_operand": null, "operands": [], "sub_results": [{"description": "the edit field is no longer shown", "passed": true, "operator": "equals", "transforms": [], "json_path": null, "expected": "false", "extracted_value": "{{edit_field_shown}}", "store_key": "edit_field_shown", "variable_refs": {"{{edit_field_shown}}": "false"}}, {"description": "exactly one todo is listed", "passed": true, "operator": "equals", "transforms": [], "json_path": null, "expected": "1", "extracted_value": "{{todo_count_check}}", "store_key": "todo_count_check", "variable_refs": {"{{todo_count_check}}": "1"}}, {"description": "the listed todo text is \"Buy bread\"", "passed": true, "operator": "equals", "transforms": ["strip"], "json_path": null, "expected": "Buy bread", "extracted_value": "{{todo_text_check}}", "store_key": "todo_text_check", "variable_refs": {"{{todo_text_check}}": "Buy bread"}}], "sub_checks": [{"description": "the edit field is no longer shown", "store_key": "edit_field_shown", "expected_value": "false", "extracted_value": "{{edit_field_shown}}", "operator": "equals", "transforms": []}, {"description": "exactly one todo is listed", "store_key": "todo_count_check", "expected_value": "1", "extracted_value": "{{todo_count_check}}", "operator": "equals", "transforms": []}, {"description": "the listed todo text is \"Buy bread\"", "store_key": "todo_text_check", "expected_value": "Buy bread", "extracted_value": "{{todo_text_check}}", "operator": "equals", "transforms": ["strip"]}], "composite_operator": "and", "claim": "the edit field is no longer shown and exactly one todo is listed, with the text \"Buy bread\""});
  });
  
  await testmu.step("Reading the todo label from the list", async () => {
    await page.waitForLoadState("domcontentloaded", { timeout: 5000 });
    setVar("buy_bread_only_todo_check", await testmu.textualAnalyzer(page, { wrappedJs: "(els) => {\n  const __m = {10: 0};\n  const el = (i) => els[__m[i]];\n  const __v = (el(10).querySelector('label')?.textContent ?? null);\n  return (typeof __v === 'boolean' ? String(__v) : __v);\n}", locators: ["internal:role=listitem >> internal:has-text=\"Buy bread\"i"], query: "the todo label text in the todo list item", expectedValue: "Buy bread", needsUnitConversion: false, operator: "equals", transforms: ["strip"], condition: "The only todo is \"Buy bread\"." }));
  });
  
  await testmu.step("whether a todo with the text \"Buy milk\" is visible anywhere in the todo list", { instructionId: "990522b5-3ef4-46d2-936f-0b4cc87ebe20" }, async () => {
    setVar("buy_milk_todo_visible_check", await testmu.visionQuery(page, "whether a todo with the text \"Buy milk\" is visible anywhere in the todo list", ""));
  });
  
  await testmu.step("Reading the item counter from the footer", async () => {
    await page.waitForLoadState("domcontentloaded", { timeout: 5000 });
    setVar("footer_counter_check", await testmu.textualAnalyzer(page, { wrappedJs: "(els) => {\n  const __m = {14: 0};\n  const el = (i) => els[__m[i]];\n  const __v = ((el(14).querySelector('strong')?.textContent ?? null) === null ? null : `${el(14).querySelector('strong').textContent} item left`);\n  return (typeof __v === 'boolean' ? String(__v) : __v);\n}", locators: ["internal:text=\"item left All Active Completed\"i"], query: "the item counter text in the todo footer", expectedValue: "1 item left", needsUnitConversion: false, operator: "equals", transforms: ["strip"], condition: "The footer counter reads exactly \"1 item left\"." }));
  });
  
  await testmu.step("Assertion check", { instructionId: "399a6488-74b1-4ea4-80e4-e51a2c7e5fb4" }, async () => {
    await testmu.verifyAssertion(page, "Assertion check", {"operator": ["equals"], "assertion_operands": [], "left_operand": null, "right_operand": null, "operands": [], "sub_results": [{"description": "The only todo is \"Buy bread\".", "passed": true, "operator": "equals", "transforms": ["strip"], "json_path": null, "expected": "Buy bread", "extracted_value": "{{buy_bread_only_todo_check}}", "store_key": "buy_bread_only_todo_check", "variable_refs": {"{{buy_bread_only_todo_check}}": "Buy bread"}}, {"description": "No todo with the text \"Buy milk\" is visible anywhere in the list.", "passed": true, "operator": "equals", "transforms": [], "json_path": null, "expected": "false", "extracted_value": "{{buy_milk_todo_visible_check}}", "store_key": "buy_milk_todo_visible_check", "variable_refs": {"{{buy_milk_todo_visible_check}}": "false"}}, {"description": "The footer counter reads exactly \"1 item left\".", "passed": true, "operator": "equals", "transforms": ["strip"], "json_path": null, "expected": "1 item left", "extracted_value": "{{footer_counter_check}}", "store_key": "footer_counter_check", "variable_refs": {"{{footer_counter_check}}": "1 item left"}}], "sub_checks": [{"description": "The only todo is \"Buy bread\".", "store_key": "buy_bread_only_todo_check", "expected_value": "Buy bread", "extracted_value": "{{buy_bread_only_todo_check}}", "operator": "equals", "transforms": ["strip"]}, {"description": "No todo with the text \"Buy milk\" is visible anywhere in the list.", "store_key": "buy_milk_todo_visible_check", "expected_value": "false", "extracted_value": "{{buy_milk_todo_visible_check}}", "operator": "equals", "transforms": []}, {"description": "The footer counter reads exactly \"1 item left\".", "store_key": "footer_counter_check", "expected_value": "1 item left", "extracted_value": "{{footer_counter_check}}", "operator": "equals", "transforms": ["strip"]}], "composite_operator": "and", "claim": "the only todo is \"Buy bread\", no todo with the text \"Buy milk\" is visible anywhere in the list, and the footer counter reads exactly \"1 item left\""});
  });
});

testmu.run();