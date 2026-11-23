import testmu, { resolveVar, setVar } from '@testmuai/playwright-bindings';
import { expect } from '@playwright/test';

testmu.configure({
  "build": "ecca23f0-f063-49c6-ad0b-1a85ea08bf8c",
  "name": "Manage and Verify Todo List Items",
  "tcId": "TC-12",
  "network": (process.env.NETWORK ?? "false").toLowerCase() === "true",
  "autoHealVersion": "AH2",
  "defaultActionTimeoutMs": 10000,
  "defaultNavigationTimeoutMs": 60000,
  "kaneRunV4": true
});

testmu.test("Manage and Verify Todo List Items", async (page) => {
  let element_0, element_1, element_3, element_2;
  await testmu.step("Navigate to http://localhost:4173/", { instructionId: "121f0d2a-a5df-4bf8-9cf1-c7d9e0259daf" }, async () => {
    await page.goto("http://localhost:4173/");
  });
  
  await testmu.step("Waiting for queued plan to run", { instructionId: "8d575cb1-a6bb-4070-915e-38eb2d8fcb30" }, async () => {
    await page.waitForTimeout(1000);
  });
  
  await testmu.step("Type \"Buy milk\" into \"What needs to be done?\"", { instructionId: "1a583024-9b85-4acc-9723-1f73384b79d3" }, async () => {
    element_0 = page.locator("internal:role=textbox[name=\"What needs to be done?\"i]");
    await testmu.fill(element_0, "Buy milk");
  });
  
  await testmu.step("Pressing Enter to submit the todo Buy milk", { instructionId: "087e0503-5602-4a8f-a7b0-f7856b238edf" }, async () => {
    await page.keyboard.press("Enter");
  });
  
  await testmu.step("Typing Walk the dog into the todo textbox", { instructionId: "d4947447-c245-49cb-8e4d-24c96aad63b0" }, async () => {
    element_1 = page.locator("internal:role=textbox[name=\"What needs to be done?\"i]");
    await testmu.fill(element_1, "Walk the dog");
  });
  
  await testmu.step("Pressing Enter to submit the todo \"Walk the dog\"", { instructionId: "1ba0bc34-c081-473c-a876-bc6367e2d430" }, async () => {
    await page.keyboard.press("Enter");
  });
  
  await testmu.step("Ticking the Buy milk checkbox", { instructionId: "56175176-9cae-4725-9f10-a833ac80dfa4" }, async () => {
    element_3 = page.locator("internal:role=listitem >> internal:has-text=\"Buy milk\"i >> internal:role=checkbox");
    await element_3.click();
  });
  
  await testmu.step("Reading the todo counter from the application footer", async () => {
    await page.waitForLoadState("domcontentloaded", { timeout: 5000 });
    setVar("footer_counter_check", await testmu.textualAnalyzer(page, { wrappedJs: "(els) => {\n  const __m = {17: 0};\n  const el = (i) => els[__m[i]];\n  const __v = (el(17).querySelector('.todo-count')?.innerText ?? null);\n  return (typeof __v === 'boolean' ? String(__v) : __v);\n}", locators: ["internal:text=\"1 item left All Active\"i"], query: "the todo item counter text in the application footer", expectedValue: "1 item left", needsUnitConversion: false, operator: "equals", transforms: ["strip"], condition: "the footer counter reads exactly \"1 item left\"" }));
  });
  
  await testmu.step("Assertion check", { instructionId: "939df56d-8c84-442e-bf5c-dce9eb89f328" }, async () => {
    await testmu.verifyAssertion(page, "Assertion check", {"operator": ["equals"], "assertion_operands": [], "left_operand": null, "right_operand": null, "operands": [], "sub_results": [{"description": "the footer counter reads exactly \"1 item left\"", "passed": true, "operator": "equals", "transforms": ["strip"], "json_path": null, "expected": "1 item left", "extracted_value": "{{footer_counter_check}}", "store_key": "footer_counter_check", "variable_refs": {"{{footer_counter_check}}": "1 item left"}}], "sub_checks": [{"description": "the footer counter reads exactly \"1 item left\"", "store_key": "footer_counter_check", "expected_value": "1 item left", "extracted_value": "{{footer_counter_check}}", "operator": "equals", "transforms": ["strip"]}], "composite_operator": "and", "claim": "the footer counter reads exactly \"1 item left\""});
  });
  
  await testmu.step("Waiting for the plan input to load", { instructionId: "406f4404-c3a5-4b05-81b2-d317e69bbbb8" }, async () => {
    await page.waitForTimeout(1000);
  });
  
  await testmu.step("Type \"Pay rent\" into \"What needs to be done?\"", { instructionId: "8590b719-f766-4771-888f-a223d02af290" }, async () => {
    element_2 = page.locator("internal:role=textbox[name=\"What needs to be done?\"i]");
    await testmu.fill(element_2, "Pay rent");
  });
  
  await testmu.step("Pressing Enter to add the todo item", { instructionId: "fb0173dc-53cd-4fbb-963e-3b4b4bbff731" }, async () => {
    await page.keyboard.press("Enter");
  });
  
  await testmu.step("Checking the listed todo items", async () => {
    await page.waitForLoadState("domcontentloaded", { timeout: 5000 });
    setVar("todo_list_check", await testmu.textualAnalyzer(page, { wrappedJs: "(els) => {\n  const __m = {5: 0};\n  const el = (i) => els[__m[i]];\n  const __v = (Array.from(el(5).querySelectorAll('li')).map(x => x.innerText.trim()).sort().join('|') === ['Buy milk','Pay rent','Walk the dog'].sort().join('|') && el(5).querySelectorAll('li').length === 3);\n  return (typeof __v === 'boolean' ? String(__v) : __v);\n}", locators: ["internal:text=\"Mark all as complete Pay rent\"i"], query: "whether the main todo list contains exactly the three todo items Buy milk, Walk the dog, and Pay rent", expectedValue: "true", needsUnitConversion: false, operator: "equals", transforms: [], condition: "Exactly three todos are listed: \"Buy milk\", \"Walk the dog\" and \"Pay rent\"." }));
  });
  
  await testmu.step("Reading the todo footer counter", async () => {
    await page.waitForLoadState("domcontentloaded", { timeout: 5000 });
    setVar("footer_counter_check", await testmu.textualAnalyzer(page, { wrappedJs: "(els) => {\n  const __m = {19: 0};\n  const el = (i) => els[__m[i]];\n  const __v = (el(19).innerText.split('\\n')[0].trim());\n  return (typeof __v === 'boolean' ? String(__v) : __v);\n}", locators: ["internal:text=\"2 items left All Active\"i"], query: "the item counter text in the todo list footer", expectedValue: "2 items left", needsUnitConversion: false, operator: "equals", transforms: ["strip"], condition: "The footer counter reads exactly \"2 items left\"." }));
  });
  
  await testmu.step("Assertion check", { instructionId: "cdab7ab6-516d-4a34-9f58-a7aa6fae03d6" }, async () => {
    await testmu.verifyAssertion(page, "Assertion check", {"operator": ["equals"], "assertion_operands": [], "left_operand": null, "right_operand": null, "operands": [], "sub_results": [{"description": "Exactly three todos are listed: \"Buy milk\", \"Walk the dog\" and \"Pay rent\".", "passed": true, "operator": "equals", "transforms": [], "json_path": null, "expected": "true", "extracted_value": "{{todo_list_check}}", "store_key": "todo_list_check", "variable_refs": {"{{todo_list_check}}": "true"}}, {"description": "The footer counter reads exactly \"2 items left\".", "passed": true, "operator": "equals", "transforms": ["strip"], "json_path": null, "expected": "2 items left", "extracted_value": "{{footer_counter_check}}", "store_key": "footer_counter_check", "variable_refs": {"{{footer_counter_check}}": "2 items left"}}], "sub_checks": [{"description": "Exactly three todos are listed: \"Buy milk\", \"Walk the dog\" and \"Pay rent\".", "store_key": "todo_list_check", "expected_value": "true", "extracted_value": "{{todo_list_check}}", "operator": "equals", "transforms": []}, {"description": "The footer counter reads exactly \"2 items left\".", "store_key": "footer_counter_check", "expected_value": "2 items left", "extracted_value": "{{footer_counter_check}}", "operator": "equals", "transforms": ["strip"]}], "composite_operator": "and", "claim": "Verify exactly three todos are listed: \"Buy milk\", \"Walk the dog\" and \"Pay rent\", and the footer counter reads exactly \"2 items left\"."});
  });
  
  await testmu.step("Checking whether the Buy milk todo text is struck through", async () => {
    await page.waitForLoadState("domcontentloaded", { timeout: 5000 });
    setVar("buy_milk_struck_through", await testmu.textualAnalyzer(page, { wrappedJs: "(els) => {\n  const __m = {18: 0};\n  const el = (i) => els[__m[i]];\n  const __v = (getComputedStyle(el(18)).textDecorationLine.includes('line-through'));\n  return (typeof __v === 'boolean' ? String(__v) : __v);\n}", locators: ["internal:text=\"Buy milk\"i"], query: "whether the \"Buy milk\" todo text in the todo list is struck through", expectedValue: "true", needsUnitConversion: false, operator: "equals", transforms: [], condition: "The \"Buy milk\" todo text is struck through." }));
  });
  
  await testmu.step("Checking whether the Walk the dog todo text is struck through", async () => {
    await page.waitForLoadState("domcontentloaded", { timeout: 5000 });
    setVar("walk_the_dog_struck_through", await testmu.textualAnalyzer(page, { wrappedJs: "(els) => {\n  const __m = {15: 0};\n  const el = (i) => els[__m[i]];\n  const __v = (getComputedStyle(el(15)).textDecorationLine.includes('line-through'));\n  return (typeof __v === 'boolean' ? String(__v) : __v);\n}", locators: ["internal:text=\"Walk the dog\"i"], query: "whether the \"Walk the dog\" todo text in the todo list is struck through", expectedValue: "false", needsUnitConversion: false, operator: "equals", transforms: [], condition: "The \"Walk the dog\" todo text has no strike-through." }));
  });
  
  await testmu.step("Checking whether the Pay rent todo text is struck through", async () => {
    await page.waitForLoadState("domcontentloaded", { timeout: 5000 });
    setVar("pay_rent_struck_through", await testmu.textualAnalyzer(page, { wrappedJs: "(els) => {\n  const __m = {12: 0};\n  const el = (i) => els[__m[i]];\n  const __v = (getComputedStyle(el(12)).textDecorationLine.includes('line-through'));\n  return (typeof __v === 'boolean' ? String(__v) : __v);\n}", locators: ["internal:text=\"Pay rent\"i"], query: "whether the \"Pay rent\" todo text in the todo list is struck through", expectedValue: "false", needsUnitConversion: false, operator: "equals", transforms: [], condition: "The \"Pay rent\" todo text has no strike-through." }));
  });
  
  await testmu.step("Assertion check", { instructionId: "667660ac-fe7a-4004-8424-b2dba7a0cdb7" }, async () => {
    await testmu.verifyAssertion(page, "Assertion check", {"operator": ["equals"], "assertion_operands": [], "left_operand": null, "right_operand": null, "operands": [], "sub_results": [{"description": "The \"Buy milk\" todo text is struck through.", "passed": true, "operator": "equals", "transforms": [], "json_path": null, "expected": "true", "extracted_value": "{{buy_milk_struck_through}}", "store_key": "buy_milk_struck_through", "variable_refs": {"{{buy_milk_struck_through}}": "true"}}, {"description": "The \"Walk the dog\" todo text has no strike-through.", "passed": true, "operator": "equals", "transforms": [], "json_path": null, "expected": "false", "extracted_value": "{{walk_the_dog_struck_through}}", "store_key": "walk_the_dog_struck_through", "variable_refs": {"{{walk_the_dog_struck_through}}": "false"}}, {"description": "The \"Pay rent\" todo text has no strike-through.", "passed": true, "operator": "equals", "transforms": [], "json_path": null, "expected": "false", "extracted_value": "{{pay_rent_struck_through}}", "store_key": "pay_rent_struck_through", "variable_refs": {"{{pay_rent_struck_through}}": "false"}}], "sub_checks": [{"description": "The \"Buy milk\" todo text is struck through.", "store_key": "buy_milk_struck_through", "expected_value": "true", "extracted_value": "{{buy_milk_struck_through}}", "operator": "equals", "transforms": []}, {"description": "The \"Walk the dog\" todo text has no strike-through.", "store_key": "walk_the_dog_struck_through", "expected_value": "false", "extracted_value": "{{walk_the_dog_struck_through}}", "operator": "equals", "transforms": []}, {"description": "The \"Pay rent\" todo text has no strike-through.", "store_key": "pay_rent_struck_through", "expected_value": "false", "extracted_value": "{{pay_rent_struck_through}}", "operator": "equals", "transforms": []}], "composite_operator": "and", "claim": "\"Buy milk\" is the only todo whose text is struck through, and \"Walk the dog\" and \"Pay rent\" are shown as normal text with no strike-through."});
  });
});

testmu.run();