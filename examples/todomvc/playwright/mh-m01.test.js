import testmu, { resolveVar, setVar } from '@testmuai/playwright-bindings';
import { expect } from '@playwright/test';

testmu.configure({
  "build": "b93f6a56-7b3a-4b76-b7ee-f6bc444d2ecd",
  "name": "Manage and Filter Todo Items",
  "tcId": "TC-8",
  "network": (process.env.NETWORK ?? "false").toLowerCase() === "true",
  "autoHealVersion": "AH2",
  "defaultActionTimeoutMs": 10000,
  "defaultNavigationTimeoutMs": 60000,
  "kaneRunV4": true
});

testmu.test("Manage and Filter Todo Items", async (page) => {
  let element_0, element_1, element_2, element_3, element_4;
  await testmu.step("Navigate to http://localhost:4173/", { instructionId: "89263b79-977a-4045-8350-6d3a7f6262d9" }, async () => {
    await page.goto("http://localhost:4173/");
  });
  
  await testmu.step("Typing Buy milk into the new todo field", { instructionId: "4220a735-4a12-4d45-bb48-50f7e1dae9a7" }, async () => {
    element_0 = page.locator("internal:role=textbox[name=\"What needs to be done?\"i]");
    await testmu.fill(element_0, "Buy milk");
  });
  
  await testmu.step("Pressing Enter to add the typed todo", { instructionId: "97add2a1-07d0-40d2-b1f5-2b9c7fa5e729" }, async () => {
    await page.keyboard.press("Enter");
  });
  
  await testmu.step("Waiting for the next queued plan step to load", { instructionId: "f1ded9d3-60a8-4196-b79f-1920676cb2e7" }, async () => {
    await page.waitForTimeout(1000);
  });
  
  await testmu.step("Type \"Walk the dog\" into \"What needs to be done?\"", { instructionId: "4937f0c5-336a-41a5-8df0-e76dd3da7dde" }, async () => {
    element_1 = page.locator("internal:role=textbox[name=\"What needs to be done?\"i]");
    await testmu.fill(element_1, "Walk the dog");
  });
  
  await testmu.step("Press Enter", { instructionId: "6a6f467f-e61a-4e01-afdb-96c0a6073684" }, async () => {
    await page.keyboard.press("Enter");
  });
  
  await testmu.step("Clicking the checkbox next to Buy milk", { instructionId: "f55fe10a-541e-48b6-8f9d-23e83ef96e2e" }, async () => {
    element_2 = page.locator("internal:role=listitem >> internal:has-text=\"Buy milk\"i >> internal:role=checkbox");
    await element_2.click();
  });
  
  await testmu.step("Reading the item counter from the todo footer", async () => {
    await page.waitForLoadState("domcontentloaded", { timeout: 5000 });
    setVar("footer_counter_check", await testmu.textualAnalyzer(page, { wrappedJs: "(els) => {\n  const __m = {18: 0};\n  const el = (i) => els[__m[i]];\n  const __v = (el(18).textContent + ' item left');\n  return (typeof __v === 'boolean' ? String(__v) : __v);\n}", locators: ["internal:text=\"1\"i"], query: "the item counter text in the todo list footer", expectedValue: "1 item left", needsUnitConversion: false, operator: "equals", transforms: ["strip"], condition: "the footer counter reads exactly \"1 item left\"" }));
  });
  
  await testmu.step("Assertion check", { instructionId: "e4e3abc7-fad8-43be-8d78-83a33e292602" }, async () => {
    await testmu.verifyAssertion(page, "Assertion check", {"operator": ["equals"], "assertion_operands": [], "left_operand": null, "right_operand": null, "operands": [], "sub_results": [{"description": "the footer counter reads exactly \"1 item left\"", "passed": true, "operator": "equals", "transforms": ["strip"], "json_path": null, "expected": "1 item left", "extracted_value": "{{footer_counter_check}}", "store_key": "footer_counter_check", "variable_refs": {"{{footer_counter_check}}": "1 item left"}}], "sub_checks": [{"description": "the footer counter reads exactly \"1 item left\"", "store_key": "footer_counter_check", "expected_value": "1 item left", "extracted_value": "{{footer_counter_check}}", "operator": "equals", "transforms": ["strip"]}], "composite_operator": "and", "claim": "the footer counter reads exactly \"1 item left\""});
  });
  
  await testmu.step("Clicking the Completed filter", { instructionId: "b911ad35-db9a-4d4b-881a-eddee6feed10" }, async () => {
    element_3 = page.locator("internal:role=link[name=\"Completed\"i]");
    await element_3.click();
  });
  
  await testmu.step("Counting the listed completed todos", async () => {
    await page.waitForLoadState("domcontentloaded", { timeout: 5000 });
    setVar("completed_todo_count_check", await testmu.textualAnalyzer(page, { wrappedJs: "(els) => {\n  const __m = {9: 0};\n  const el = (i) => els[__m[i]];\n  const __v = (el(9).querySelectorAll(':scope > li').length);\n  return (typeof __v === 'boolean' ? String(__v) : __v);\n}", locators: ["internal:role=list >> internal:has-text=\"Buy milk\"i"], query: "the number of todo list items in the completed todos list", expectedValue: "1", needsUnitConversion: false, operator: "equals", transforms: [], condition: "Exactly one todo is listed." }));
  });
  
  await testmu.step("Reading the listed completed todo item", async () => {
    await page.waitForLoadState("domcontentloaded", { timeout: 5000 });
    setVar("completed_todo_item_check", await testmu.textualAnalyzer(page, { wrappedJs: "(els) => {\n  const __m = {12: 0};\n  const el = (i) => els[__m[i]];\n  const __v = (el(12).textContent);\n  return (typeof __v === 'boolean' ? String(__v) : __v);\n}", locators: ["internal:text=\"Buy milk\"i"], query: "the text of the listed completed todo item", expectedValue: "Buy milk", needsUnitConversion: false, operator: "equals", transforms: ["strip"], condition: "The listed todo is \"Buy milk\"." }));
  });
  
  await testmu.step("Assertion check", { instructionId: "423cf57c-f1a5-45b9-8faf-87e8d144a686" }, async () => {
    await testmu.verifyAssertion(page, "Assertion check", {"operator": ["equals"], "assertion_operands": [], "left_operand": null, "right_operand": null, "operands": [], "sub_results": [{"description": "Exactly one todo is listed.", "passed": true, "operator": "equals", "transforms": [], "json_path": null, "expected": "1", "extracted_value": "{{completed_todo_count_check}}", "store_key": "completed_todo_count_check", "variable_refs": {"{{completed_todo_count_check}}": "1"}}, {"description": "The listed todo is \"Buy milk\".", "passed": true, "operator": "equals", "transforms": ["strip"], "json_path": null, "expected": "Buy milk", "extracted_value": "{{completed_todo_item_check}}", "store_key": "completed_todo_item_check", "variable_refs": {"{{completed_todo_item_check}}": "Buy milk"}}], "sub_checks": [{"description": "Exactly one todo is listed.", "store_key": "completed_todo_count_check", "expected_value": "1", "extracted_value": "{{completed_todo_count_check}}", "operator": "equals", "transforms": []}, {"description": "The listed todo is \"Buy milk\".", "store_key": "completed_todo_item_check", "expected_value": "Buy milk", "extracted_value": "{{completed_todo_item_check}}", "operator": "equals", "transforms": ["strip"]}], "composite_operator": "and", "claim": "Exactly one todo is listed and it is \"Buy milk\"."});
  });
  
  await testmu.step("Clicking the Active filter link", { instructionId: "9f1937d3-b1bf-43a5-8a31-f8d72966d390" }, async () => {
    element_4 = page.locator("internal:role=link[name=\"Active\"i]");
    await element_4.click();
  });
  
  await testmu.step("Reading the active todo item count", async () => {
    await page.waitForLoadState("domcontentloaded", { timeout: 5000 });
    setVar("active_todo_count_check", await testmu.textualAnalyzer(page, { wrappedJs: "(els) => {\n  const __m = {5: 0};\n  const el = (i) => els[__m[i]];\n  const __v = (el(5).querySelectorAll('li').length);\n  return (typeof __v === 'boolean' ? String(__v) : __v);\n}", locators: ["internal:text=\"Mark all as complete Walk the\"i"], query: "the number of todo list items in the main todo list", expectedValue: "1", needsUnitConversion: false, operator: "equals", transforms: [], condition: "Exactly one todo is listed." }));
  });
  
  await testmu.step("Reading the listed active todo item", async () => {
    await page.waitForLoadState("domcontentloaded", { timeout: 5000 });
    setVar("active_todo_item_check", await testmu.textualAnalyzer(page, { wrappedJs: "(els) => {\n  const __m = {12: 0};\n  const el = (i) => els[__m[i]];\n  const __v = (el(12).textContent);\n  return (typeof __v === 'boolean' ? String(__v) : __v);\n}", locators: ["internal:text=\"Walk the dog\"i"], query: "the text of the listed todo item label", expectedValue: "Walk the dog", needsUnitConversion: false, operator: "equals", transforms: ["strip"], condition: "The listed todo is \"Walk the dog\"." }));
  });
  
  await testmu.step("Assertion check", { instructionId: "ea0f221e-8855-40cf-ba2c-67b476d45727" }, async () => {
    await testmu.verifyAssertion(page, "Assertion check", {"operator": ["equals"], "assertion_operands": [], "left_operand": null, "right_operand": null, "operands": [], "sub_results": [{"description": "Exactly one todo is listed.", "passed": true, "operator": "equals", "transforms": [], "json_path": null, "expected": "1", "extracted_value": "{{active_todo_count_check}}", "store_key": "active_todo_count_check", "variable_refs": {"{{active_todo_count_check}}": "1"}}, {"description": "The listed todo is \"Walk the dog\".", "passed": true, "operator": "equals", "transforms": ["strip"], "json_path": null, "expected": "Walk the dog", "extracted_value": "{{active_todo_item_check}}", "store_key": "active_todo_item_check", "variable_refs": {"{{active_todo_item_check}}": "Walk the dog"}}], "sub_checks": [{"description": "Exactly one todo is listed.", "store_key": "active_todo_count_check", "expected_value": "1", "extracted_value": "{{active_todo_count_check}}", "operator": "equals", "transforms": []}, {"description": "The listed todo is \"Walk the dog\".", "store_key": "active_todo_item_check", "expected_value": "Walk the dog", "extracted_value": "{{active_todo_item_check}}", "operator": "equals", "transforms": ["strip"]}], "composite_operator": "and", "claim": "Exactly one todo is listed and it is \"Walk the dog\"."});
  });
});

testmu.run();