import testmu, { resolveVar, setVar } from '@testmuai/playwright-bindings';
import { expect } from '@playwright/test';

testmu.configure({
  "build": "bb561a42-71d8-46e5-9fb7-028d43122a9d",
  "name": "Manage and Clear Completed Todo Items",
  "tcId": "TC-13",
  "network": (process.env.NETWORK ?? "false").toLowerCase() === "true",
  "autoHealVersion": "AH2",
  "defaultActionTimeoutMs": 10000,
  "defaultNavigationTimeoutMs": 60000,
  "kaneRunV4": true
});

testmu.test("Manage and Clear Completed Todo Items", async (page) => {
  let element_0, element_1, element_2, element_3;
  await testmu.step("Navigate to http://localhost:4173/", { instructionId: "43c26ec7-1c33-42fe-bb1d-a588dfef0917" }, async () => {
    await page.goto("http://localhost:4173/");
  });
  
  await testmu.step("Waiting for the next step in the queued plan", { instructionId: "778cb659-45e6-44e2-bb02-65c51b779ebf" }, async () => {
    await page.waitForTimeout(1000);
  });
  
  await testmu.step("Type \"Buy milk\" into \"What needs to be done?\"", { instructionId: "2e62bbdc-a015-423b-a610-212500e3a565" }, async () => {
    element_0 = page.locator("internal:role=textbox[name=\"What needs to be done?\"i]");
    await testmu.fill(element_0, "Buy milk");
  });
  
  await testmu.step("Submitting the todo entries", { instructionId: "a42aced3-3bd6-4f1d-96dc-d36718923b68" }, async () => {
    await page.keyboard.press("Enter");
  });
  
  await testmu.step("Typing Walk the dog into the todo field", { instructionId: "92af9cd2-95d2-4108-b159-eca29a2ce4e4" }, async () => {
    element_1 = page.locator("internal:role=textbox[name=\"What needs to be done?\"i]");
    await testmu.fill(element_1, "Walk the dog");
  });
  
  await testmu.step("Submitting the todo entry to add the new tasks", { instructionId: "4f9fda76-3602-47c6-b537-804177367dbf" }, async () => {
    await page.keyboard.press("Enter");
  });
  
  await testmu.step("Clicking the Buy milk checkbox", { instructionId: "db148864-cdbc-4a9a-853e-7906e6676f8e" }, async () => {
    element_2 = page.locator("internal:role=listitem >> internal:has-text=\"Buy milk\"i >> internal:role=checkbox");
    await element_2.click();
  });
  
  await testmu.step("Reading the todo counter from the footer", async () => {
    await page.waitForLoadState("domcontentloaded", { timeout: 5000 });
    setVar("footer_counter_check", await testmu.textualAnalyzer(page, { wrappedJs: "(els) => {\n  const __m = {17: 0};\n  const el = (i) => els[__m[i]];\n  const __v = (el(17).querySelector('.todo-count')?.textContent?.replace(/\\s+/g, ' ').trim() ?? null);\n  return (typeof __v === 'boolean' ? String(__v) : __v);\n}", locators: ["internal:text=\"1 item left All Active\"i"], query: "the todo item counter text in the application footer", expectedValue: "1 item left", needsUnitConversion: false, operator: "equals", transforms: ["strip"], condition: "the footer counter reads exactly \"1 item left\"" }));
  });
  
  await testmu.step("Checking whether the Clear completed button is present in the footer", async () => {
    await page.waitForLoadState("domcontentloaded", { timeout: 5000 });
    setVar("clear_completed_button_visible", await testmu.textualAnalyzer(page, { wrappedJs: "(els) => {\n  const __m = {26: 0};\n  const el = (i) => els[__m[i]];\n  const __v = (el(26).textContent.trim() === 'Clear completed' && el(26).getClientRects().length > 0 && getComputedStyle(el(26)).visibility !== 'hidden');\n  return (typeof __v === 'boolean' ? String(__v) : __v);\n}", locators: ["internal:role=button[name=\"Clear completed\"i]"], query: "whether the button with the text Clear completed in the application footer is present", expectedValue: "true", needsUnitConversion: false, operator: "equals", transforms: [], condition: "a button with the text \"Clear completed\" is visible in the footer" }));
  });
  
  await testmu.step("Assertion check", { instructionId: "18a4a656-f3c0-45c0-814f-68281867aa09" }, async () => {
    await testmu.verifyAssertion(page, "Assertion check", {"operator": ["equals"], "assertion_operands": [], "left_operand": null, "right_operand": null, "operands": [], "sub_results": [{"description": "the footer counter reads exactly \"1 item left\"", "passed": true, "operator": "equals", "transforms": ["strip"], "json_path": null, "expected": "1 item left", "extracted_value": "{{footer_counter_check}}", "store_key": "footer_counter_check", "variable_refs": {"{{footer_counter_check}}": "1 item left"}}, {"description": "a button with the text \"Clear completed\" is visible in the footer", "passed": true, "operator": "equals", "transforms": [], "json_path": null, "expected": "true", "extracted_value": "{{clear_completed_button_visible}}", "store_key": "clear_completed_button_visible", "variable_refs": {"{{clear_completed_button_visible}}": "true"}}], "sub_checks": [{"description": "the footer counter reads exactly \"1 item left\"", "store_key": "footer_counter_check", "expected_value": "1 item left", "extracted_value": "{{footer_counter_check}}", "operator": "equals", "transforms": ["strip"]}, {"description": "a button with the text \"Clear completed\" is visible in the footer", "store_key": "clear_completed_button_visible", "expected_value": "true", "extracted_value": "{{clear_completed_button_visible}}", "operator": "equals", "transforms": []}], "composite_operator": "and", "claim": "the footer counter reads exactly \"1 item left\" and a button with the text \"Clear completed\" is visible in the footer"});
  });
  
  await testmu.step("Clicking Clear completed button in the footer", { instructionId: "d89cfc2e-2fcf-4cc5-881d-9a8ac6cd7fc7" }, async () => {
    element_3 = page.locator("internal:role=button[name=\"Clear completed\"i]");
    await element_3.click();
  });
  
  await testmu.step("Checking the todo list contents", async () => {
    await page.waitForLoadState("domcontentloaded", { timeout: 5000 });
    setVar("todo_list_check", await testmu.textualAnalyzer(page, { wrappedJs: "(els) => {\n  const __m = {9: 0};\n  const el = (i) => els[__m[i]];\n  const __v = (el(9) ? (Array.from(el(9).children).length === 1 && Array.from(el(9).children)[0].innerText.trim() === 'Walk the dog') : false);\n  return (typeof __v === 'boolean' ? String(__v) : __v);\n}", locators: ["internal:role=list >> internal:has-text=\"Walk the dog\"i"], query: "whether the todo list contains exactly one todo item labeled Walk the dog", expectedValue: "true", needsUnitConversion: false, operator: "equals", transforms: [], condition: "Exactly one todo is listed and it is \"Walk the dog\"." }));
  });
  
  await testmu.step("whether a row labeled Buy milk is visible in the todo list", { instructionId: "0c8256e9-c91a-4fc1-ba94-516886cbd045" }, async () => {
    setVar("buy_milk_row_visible", await testmu.visionQuery(page, "whether a row labeled Buy milk is visible in the todo list", ""));
  });
  
  await testmu.step("The footer counter reads exactly \"1 item left\".", { instructionId: "2e06f2f8-1de3-4e35-b797-c4656f96e99e" }, async () => {
    setVar("footer_counter_check", await testmu.visionQuery(page, "The footer counter reads exactly \"1 item left\".", ""));
  });
  
  await testmu.step("Assertion check", { instructionId: "55be2e99-ba6b-4c8a-bd77-d3171ef3d1b1" }, async () => {
    await testmu.verifyAssertion(page, "Assertion check", {"operator": ["equals"], "assertion_operands": [], "left_operand": null, "right_operand": null, "operands": [], "sub_results": [{"description": "Exactly one todo is listed and it is \"Walk the dog\".", "passed": true, "operator": "equals", "transforms": [], "json_path": null, "expected": "true", "extracted_value": "{{todo_list_check}}", "store_key": "todo_list_check", "variable_refs": {"{{todo_list_check}}": "true"}}, {"description": "No row with the text \"Buy milk\" is visible.", "passed": true, "operator": "equals", "transforms": [], "json_path": null, "expected": "false", "extracted_value": "{{buy_milk_row_visible}}", "store_key": "buy_milk_row_visible", "variable_refs": {"{{buy_milk_row_visible}}": "false"}}, {"description": "The footer counter reads exactly \"1 item left\".", "passed": true, "operator": "equals", "transforms": ["strip"], "json_path": null, "expected": "1 item left", "extracted_value": "{{footer_counter_check}}", "store_key": "footer_counter_check", "variable_refs": {"{{footer_counter_check}}": "1 item left"}}], "sub_checks": [{"description": "Exactly one todo is listed and it is \"Walk the dog\".", "store_key": "todo_list_check", "expected_value": "true", "extracted_value": "{{todo_list_check}}", "operator": "equals", "transforms": []}, {"description": "No row with the text \"Buy milk\" is visible.", "store_key": "buy_milk_row_visible", "expected_value": "false", "extracted_value": "{{buy_milk_row_visible}}", "operator": "equals", "transforms": []}, {"description": "The footer counter reads exactly \"1 item left\".", "store_key": "footer_counter_check", "expected_value": "1 item left", "extracted_value": "{{footer_counter_check}}", "operator": "equals", "transforms": ["strip"]}], "composite_operator": "and", "claim": "Exactly one todo is listed and it is \"Walk the dog\", no row with the text \"Buy milk\" is visible, and the footer counter reads exactly \"1 item left\"."});
  });
});

testmu.run();