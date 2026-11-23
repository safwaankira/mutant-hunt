import testmu, { resolveVar, setVar } from '@testmuai/playwright-bindings';
import { expect } from '@playwright/test';

testmu.configure({
  "build": "d5c2b2b1-bd04-4dd3-badb-be35bfb1e5d9",
  "name": "Manage and Verify Todo List Items",
  "tcId": "TC-10",
  "network": (process.env.NETWORK ?? "false").toLowerCase() === "true",
  "autoHealVersion": "AH2",
  "defaultActionTimeoutMs": 10000,
  "defaultNavigationTimeoutMs": 60000,
  "kaneRunV4": true
});

testmu.test("Manage and Verify Todo List Items", async (page) => {
  let element_0, element_1, element_2, element_4;
  await testmu.step("Navigate to http://localhost:4173/", { instructionId: "dc7162de-af00-466f-8ed3-dca85ddac332" }, async () => {
    await page.goto("http://localhost:4173/");
  });
  
  await testmu.step("Typing Buy milk into the todo input field", { instructionId: "0580f54c-eda2-4641-b68a-841efd40a666" }, async () => {
    element_0 = page.locator("internal:role=textbox[name=\"What needs to be done?\"i]");
    await testmu.fill(element_0, "Buy milk");
  });
  
  await testmu.step("Pressing Enter to submit the todo \"Buy milk\"", { instructionId: "5893efe2-8030-467f-a315-e3e0fe444ec3" }, async () => {
    await page.keyboard.press("Enter");
  });
  
  await testmu.step("Typing \"Walk the dog\" into the todo text box", { instructionId: "d0eaad39-9342-4ac0-a4f5-246a6e8684cc" }, async () => {
    element_1 = page.locator("internal:role=textbox[name=\"What needs to be done?\"i]");
    await testmu.fill(element_1, "Walk the dog");
  });
  
  await testmu.step("Pressing Enter to submit the todo", { instructionId: "3a86bfac-ac61-4410-99c9-f799d19db69a" }, async () => {
    await page.keyboard.press("Enter");
  });
  
  await testmu.step("Typing Pay rent into the todo input", { instructionId: "82199411-8e12-4c55-8dea-f89720f8ad89" }, async () => {
    element_2 = page.locator("internal:role=textbox[name=\"What needs to be done?\"i]");
    await testmu.fill(element_2, "Pay rent");
  });
  
  await testmu.step("Pressing Enter to submit the todo \"Pay rent\"", { instructionId: "8f6f58e1-8449-49d6-af35-fb3c6235838b" }, async () => {
    await page.keyboard.press("Enter");
  });
  
  await testmu.step("Counting the todos in the main list", async () => {
    await page.waitForLoadState("domcontentloaded", { timeout: 5000 });
    setVar("todo_list_count_check", await testmu.textualAnalyzer(page, { wrappedJs: "(els) => {\n  const __m = {5: 0};\n  const el = (i) => els[__m[i]];\n  const __v = (el(5).querySelectorAll('li').length);\n  return (typeof __v === 'boolean' ? String(__v) : __v);\n}", locators: ["internal:text=\"Mark all as complete Pay rent\"i"], query: "the number of todo list items in the main todo list", expectedValue: "3", needsUnitConversion: false, operator: "equals", transforms: [], condition: "Exactly three todos are listed." }));
  });
  
  await testmu.step("Checking whether the Buy milk todo is listed", async () => {
    await page.waitForLoadState("domcontentloaded", { timeout: 5000 });
    setVar("buy_milk_listed", await testmu.textualAnalyzer(page, { wrappedJs: "(els) => {\n  const __m = {18: 0};\n  const el = (i) => els[__m[i]];\n  const __v = (el(18).textContent.trim() === 'Buy milk');\n  return (typeof __v === 'boolean' ? String(__v) : __v);\n}", locators: ["internal:text=\"Buy milk\"i"], query: "whether the todo \"Buy milk\" is present in the todo list", expectedValue: "true", needsUnitConversion: false, operator: "equals", transforms: [], condition: "The todo \"Buy milk\" is listed." }));
  });
  
  await testmu.step("Checking whether the Walk the dog todo is listed", async () => {
    await page.waitForLoadState("domcontentloaded", { timeout: 5000 });
    setVar("walk_the_dog_listed", await testmu.textualAnalyzer(page, { wrappedJs: "(els) => {\n  const __m = {15: 0};\n  const el = (i) => els[__m[i]];\n  const __v = (el(15).textContent.trim() === 'Walk the dog');\n  return (typeof __v === 'boolean' ? String(__v) : __v);\n}", locators: ["internal:text=\"Walk the dog\"i"], query: "whether the todo \"Walk the dog\" is present in the todo list", expectedValue: "true", needsUnitConversion: false, operator: "equals", transforms: [], condition: "The todo \"Walk the dog\" is listed." }));
  });
  
  await testmu.step("Checking whether the Pay rent todo is listed", async () => {
    await page.waitForLoadState("domcontentloaded", { timeout: 5000 });
    setVar("pay_rent_listed", await testmu.textualAnalyzer(page, { wrappedJs: "(els) => {\n  const __m = {12: 0};\n  const el = (i) => els[__m[i]];\n  const __v = (el(12).textContent.trim() === 'Pay rent');\n  return (typeof __v === 'boolean' ? String(__v) : __v);\n}", locators: ["internal:text=\"Pay rent\"i"], query: "whether the todo \"Pay rent\" is present in the todo list", expectedValue: "true", needsUnitConversion: false, operator: "equals", transforms: [], condition: "The todo \"Pay rent\" is listed." }));
  });
  
  await testmu.step("Reading the item counter from the todo footer", async () => {
    await page.waitForLoadState("domcontentloaded", { timeout: 5000 });
    setVar("footer_counter_check", await testmu.textualAnalyzer(page, { wrappedJs: "(els) => {\n  const __m = {19: 0};\n  const el = (i) => els[__m[i]];\n  const __v = (el(19).querySelector('.todo-count').textContent.trim());\n  return (typeof __v === 'boolean' ? String(__v) : __v);\n}", locators: ["internal:text=\"3 items left All Active\"i"], query: "the item counter text in the todo list footer", expectedValue: "3 items left", needsUnitConversion: false, operator: "equals", transforms: ["strip"], condition: "The footer counter reads exactly \"3 items left\"." }));
  });
  
  await testmu.step("Assertion check", { instructionId: "3a69f63c-5edf-4e37-b84b-c54e42ea49d1" }, async () => {
    await testmu.verifyAssertion(page, "Assertion check", {"operator": ["equals"], "assertion_operands": [], "left_operand": null, "right_operand": null, "operands": [], "sub_results": [{"description": "Exactly three todos are listed.", "passed": true, "operator": "equals", "transforms": [], "json_path": null, "expected": "3", "extracted_value": "{{todo_list_count_check}}", "store_key": "todo_list_count_check", "variable_refs": {"{{todo_list_count_check}}": "3"}}, {"description": "The todo \"Buy milk\" is listed.", "passed": true, "operator": "equals", "transforms": [], "json_path": null, "expected": "true", "extracted_value": "{{buy_milk_listed}}", "store_key": "buy_milk_listed", "variable_refs": {"{{buy_milk_listed}}": "true"}}, {"description": "The todo \"Walk the dog\" is listed.", "passed": true, "operator": "equals", "transforms": [], "json_path": null, "expected": "true", "extracted_value": "{{walk_the_dog_listed}}", "store_key": "walk_the_dog_listed", "variable_refs": {"{{walk_the_dog_listed}}": "true"}}, {"description": "The todo \"Pay rent\" is listed.", "passed": true, "operator": "equals", "transforms": [], "json_path": null, "expected": "true", "extracted_value": "{{pay_rent_listed}}", "store_key": "pay_rent_listed", "variable_refs": {"{{pay_rent_listed}}": "true"}}, {"description": "The footer counter reads exactly \"3 items left\".", "passed": true, "operator": "equals", "transforms": ["strip"], "json_path": null, "expected": "3 items left", "extracted_value": "{{footer_counter_check}}", "store_key": "footer_counter_check", "variable_refs": {"{{footer_counter_check}}": "3 items left"}}], "sub_checks": [{"description": "Exactly three todos are listed.", "store_key": "todo_list_count_check", "expected_value": "3", "extracted_value": "{{todo_list_count_check}}", "operator": "equals", "transforms": []}, {"description": "The todo \"Buy milk\" is listed.", "store_key": "buy_milk_listed", "expected_value": "true", "extracted_value": "{{buy_milk_listed}}", "operator": "equals", "transforms": []}, {"description": "The todo \"Walk the dog\" is listed.", "store_key": "walk_the_dog_listed", "expected_value": "true", "extracted_value": "{{walk_the_dog_listed}}", "operator": "equals", "transforms": []}, {"description": "The todo \"Pay rent\" is listed.", "store_key": "pay_rent_listed", "expected_value": "true", "extracted_value": "{{pay_rent_listed}}", "operator": "equals", "transforms": []}, {"description": "The footer counter reads exactly \"3 items left\".", "store_key": "footer_counter_check", "expected_value": "3 items left", "extracted_value": "{{footer_counter_check}}", "operator": "equals", "transforms": ["strip"]}], "composite_operator": "and", "claim": "Exactly three todos are listed: \"Buy milk\", \"Walk the dog\" and \"Pay rent\", and the footer counter reads exactly \"3 items left\"."});
  });
  
  await testmu.step("Hover over 'the \"Buy milk\" todo row in the main todo list'", { instructionId: "63ccbefa-20ab-405f-a7b8-911838964c45" }, async () => {
    const _c_3 = await testmu.getVisionCoordinates(page, "Hover over 'the \"Buy milk\" todo row in the main todo list'", "hover", 960, 540);
    await page.mouse.move(_c_3.x, _c_3.y);
  });
  
  await testmu.step("Clicking the delete \u00d7 button on the right side of the Buy milk todo", { instructionId: "343adf06-7ab6-4424-8ec0-ed6095868420" }, async () => {
    element_4 = page.locator("internal:role=button[name=\"\u00d7\"i]");
    await element_4.click();
  });
  
  await testmu.step("Reading the footer item counter", async () => {
    await page.waitForLoadState("domcontentloaded", { timeout: 5000 });
    setVar("footer_counter_text_check", await testmu.textualAnalyzer(page, { wrappedJs: "(els) => {\n  const __m = {16: 0};\n  const el = (i) => els[__m[i]];\n  const __v = (el(16).querySelector('.todo-count')?.textContent.trim() ?? null);\n  return (typeof __v === 'boolean' ? String(__v) : __v);\n}", locators: ["internal:text=\"2 items left All Active\"i"], query: "the item counter text in the footer", expectedValue: "2 items left", needsUnitConversion: false, operator: "equals", transforms: ["strip"], condition: "the footer counter reads exactly \"2 items left\"" }));
  });
  
  await testmu.step("Assertion check", { instructionId: "2076493f-3aca-4dbc-94ce-40f6f7753899" }, async () => {
    await testmu.verifyAssertion(page, "Assertion check", {"operator": ["equals"], "assertion_operands": [], "left_operand": null, "right_operand": null, "operands": [], "sub_results": [{"description": "the footer counter reads exactly \"2 items left\"", "passed": true, "operator": "equals", "transforms": ["strip"], "json_path": null, "expected": "2 items left", "extracted_value": "{{footer_counter_text_check}}", "store_key": "footer_counter_text_check", "variable_refs": {"{{footer_counter_text_check}}": "2 items left"}}], "sub_checks": [{"description": "the footer counter reads exactly \"2 items left\"", "store_key": "footer_counter_text_check", "expected_value": "2 items left", "extracted_value": "{{footer_counter_text_check}}", "operator": "equals", "transforms": ["strip"]}], "composite_operator": "and", "claim": "the footer counter reads exactly \"2 items left\""});
  });
  
  await testmu.step("Counting the todo rows in the list", async () => {
    await page.waitForLoadState("domcontentloaded", { timeout: 5000 });
    setVar("todo_row_count_check", await testmu.textualAnalyzer(page, { wrappedJs: "(els) => {\n  const __m = {5: 0};\n  const el = (i) => els[__m[i]];\n  const __v = (el(5).querySelectorAll('li').length);\n  return (typeof __v === 'boolean' ? String(__v) : __v);\n}", locators: ["internal:text=\"Mark all as complete Pay rent\"i"], query: "the number of todo rows in the main todo list", expectedValue: "2", needsUnitConversion: false, operator: "equals", transforms: [], condition: "there are exactly two todo rows" }));
  });
  
  await testmu.step("Reading the todo row texts from the list", async () => {
    await page.waitForLoadState("domcontentloaded", { timeout: 5000 });
    setVar("todo_row_texts_check", await testmu.textualAnalyzer(page, { wrappedJs: "(els) => {\n  const __m = {5: 0};\n  const el = (i) => els[__m[i]];\n  const __v = (Array.from(el(5).querySelectorAll('li label')).map(x=>x.textContent.trim()).join('|'));\n  return (typeof __v === 'boolean' ? String(__v) : __v);\n}", locators: ["internal:text=\"Mark all as complete Pay rent\"i"], query: "the text of each todo row in the main todo list", expectedValue: "Pay rent|Walk the dog", needsUnitConversion: false, operator: "equals", transforms: [], condition: "the todo rows are \"Walk the dog\" and \"Pay rent\"" }));
  });
  
  await testmu.step("Checking whether the Buy milk todo row is present", async () => {
    await page.waitForLoadState("domcontentloaded", { timeout: 5000 });
    setVar("buy_milk_row_visible_check", await testmu.textualAnalyzer(page, { wrappedJs: "(els) => {\n  const __m = {5: 0};\n  const el = (i) => els[__m[i]];\n  const __v = (Array.from(el(5).querySelectorAll('li')).some(x=>x.textContent.trim()==='Buy milk'&&!!(x.offsetWidth||x.offsetHeight||x.getClientRects().length)));\n  return (typeof __v === 'boolean' ? String(__v) : __v);\n}", locators: ["internal:text=\"Mark all as complete Pay rent\"i"], query: "whether a todo row with the text \"Buy milk\" visible anywhere in the list is present", expectedValue: "false", needsUnitConversion: false, operator: "equals", transforms: [], condition: "no row with the text \"Buy milk\" is visible anywhere in the list" }));
  });
  
  await testmu.step("Assertion check", { instructionId: "3e8a479b-43d7-4c6e-b5c2-e64d4e3ce52b" }, async () => {
    await testmu.verifyAssertion(page, "Assertion check", {"operator": ["equals"], "assertion_operands": [], "left_operand": null, "right_operand": null, "operands": [], "sub_results": [{"description": "there are exactly two todo rows", "passed": true, "operator": "equals", "transforms": [], "json_path": null, "expected": "2", "extracted_value": "{{todo_row_count_check}}", "store_key": "todo_row_count_check", "variable_refs": {"{{todo_row_count_check}}": "2"}}, {"description": "the todo rows are \"Walk the dog\" and \"Pay rent\"", "passed": true, "operator": "equals", "transforms": [], "json_path": null, "expected": "Pay rent|Walk the dog", "extracted_value": "{{todo_row_texts_check}}", "store_key": "todo_row_texts_check", "variable_refs": {"{{todo_row_texts_check}}": "Pay rent|Walk the dog"}}, {"description": "no row with the text \"Buy milk\" is visible anywhere in the list", "passed": true, "operator": "equals", "transforms": [], "json_path": null, "expected": "false", "extracted_value": "{{buy_milk_row_visible_check}}", "store_key": "buy_milk_row_visible_check", "variable_refs": {"{{buy_milk_row_visible_check}}": "false"}}], "sub_checks": [{"description": "there are exactly two todo rows", "store_key": "todo_row_count_check", "expected_value": "2", "extracted_value": "{{todo_row_count_check}}", "operator": "equals", "transforms": []}, {"description": "the todo rows are \"Walk the dog\" and \"Pay rent\"", "store_key": "todo_row_texts_check", "expected_value": "Pay rent|Walk the dog", "extracted_value": "{{todo_row_texts_check}}", "operator": "equals", "transforms": []}, {"description": "no row with the text \"Buy milk\" is visible anywhere in the list", "store_key": "buy_milk_row_visible_check", "expected_value": "false", "extracted_value": "{{buy_milk_row_visible_check}}", "operator": "equals", "transforms": []}], "composite_operator": "and", "claim": "there are exactly two todo rows, they are \"Walk the dog\" and \"Pay rent\", and no row with the text \"Buy milk\" is visible anywhere in the list"});
  });
});

testmu.run();