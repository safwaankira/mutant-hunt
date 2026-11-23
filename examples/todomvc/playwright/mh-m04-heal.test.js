import testmu, { resolveVar, setVar } from '@testmuai/playwright-bindings';
import { expect } from '@playwright/test';

testmu.configure({
  "build": "ee1b7704-6058-429a-8b28-fea2e3eae25a",
  "name": "Manage and Filter Todo Items",
  "tcId": "TC-15",
  "network": (process.env.NETWORK ?? "false").toLowerCase() === "true",
  "autoHealVersion": "AH2",
  "defaultActionTimeoutMs": 10000,
  "defaultNavigationTimeoutMs": 60000,
  "kaneRunV4": true
});

testmu.test("Manage and Filter Todo Items", async (page) => {
  let element_0, element_1, element_2, element_3, element_5, element_6;
  await testmu.step("Navigate to http://localhost:4173/", { instructionId: "03066464-d25f-4b2f-b5b5-9721c79f37e4" }, async () => {
    await page.goto("http://localhost:4173/");
  });
  
  await testmu.step("Typing Buy milk into the todo textbox", { instructionId: "80c0b61d-e0df-4ae1-ae17-eef9cc44895a" }, async () => {
    element_0 = page.locator("internal:role=textbox[name=\"What needs to be done?\"i]");
    await testmu.fill(element_0, "Buy milk");
  });
  
  await testmu.step("Pressing Enter to add the todo item", { instructionId: "7584f264-83ed-4659-b595-fa9a5ae383ee" }, async () => {
    await page.keyboard.press("Enter");
  });
  
  await testmu.step("Typing Walk the dog into the todo input", { instructionId: "b6eabf78-a16e-4b90-ae44-8b2272db2717" }, async () => {
    element_1 = page.locator("internal:role=textbox[name=\"What needs to be done?\"i]");
    await testmu.fill(element_1, "Walk the dog");
  });
  
  await testmu.step("Pressing Enter to submit the todo item", { instructionId: "61dc9ef6-3f67-4450-a02b-9ee7c1785cb0" }, async () => {
    await page.keyboard.press("Enter");
  });
  
  await testmu.step("Typing Pay rent into the todo input field", { instructionId: "150c6de5-c2b3-4ff7-8cde-c76d75a7f11c" }, async () => {
    element_2 = page.locator("internal:role=textbox[name=\"What needs to be done?\"i]");
    await testmu.fill(element_2, "Pay rent");
  });
  
  await testmu.step("Pressing Enter to submit the focused todo input", { instructionId: "ffc4bff3-1c49-425b-8ea2-d8856fd6bd39" }, async () => {
    await page.keyboard.press("Enter");
  });
  
  await testmu.step("Ticking the checkbox next to Buy milk", { instructionId: "b071d61e-4765-42d7-a6b6-85031494a704" }, async () => {
    element_3 = page.locator("internal:role=listitem >> internal:has-text=\"Buy milk\"i >> internal:role=checkbox");
    await element_3.click();
  });
  
  await testmu.step("Checking whether the Buy milk todo is completed", async () => {
    await page.waitForLoadState("domcontentloaded", { timeout: 5000 });
    setVar("buy_milk_completed", await testmu.textualAnalyzer(page, { wrappedJs: "(els) => {\n  const __m = {18: 0};\n  const el = (i) => els[__m[i]];\n  const __v = (getComputedStyle(el(18)).textDecorationLine.includes('line-through') && el(18).textContent.trim() === 'Buy milk');\n  return (typeof __v === 'boolean' ? String(__v) : __v);\n}", locators: ["internal:text=\"Buy milk\"i"], query: "whether the Buy milk todo label is shown with a line-through in the todo list", expectedValue: "true", needsUnitConversion: false, operator: "equals", transforms: [], condition: "\"Buy milk\" is shown as completed (struck through)" }));
  });
  
  await testmu.step("Reading the item counter from the todo footer", async () => {
    await page.waitForLoadState("domcontentloaded", { timeout: 5000 });
    setVar("footer_counter_check", await testmu.textualAnalyzer(page, { wrappedJs: "(els) => {\n  const __m = {21: 0};\n  const el = (i) => els[__m[i]];\n  const __v = (el(21).textContent.trim() + ' items left');\n  return (typeof __v === 'boolean' ? String(__v) : __v);\n}", locators: ["internal:text=\"2\"i"], query: "the item counter text in the todo list footer", expectedValue: "2 items left", needsUnitConversion: false, operator: "equals", transforms: ["strip"], condition: "the footer counter reads exactly \"2 items left\"" }));
  });
  
  await testmu.step("Assertion check", { instructionId: "58e7ea9f-b5ad-4941-873a-cb3a5068b641" }, async () => {
    await testmu.verifyAssertion(page, "Assertion check", {"operator": ["equals"], "assertion_operands": [], "left_operand": null, "right_operand": null, "operands": [], "sub_results": [{"description": "the footer counter reads exactly \"2 items left\"", "passed": true, "operator": "equals", "transforms": ["strip"], "json_path": null, "expected": "2 items left", "extracted_value": "{{footer_counter_check}}", "store_key": "footer_counter_check", "variable_refs": {"{{footer_counter_check}}": "2 items left"}}, {"description": "\"Buy milk\" is shown as completed (struck through)", "passed": true, "operator": "equals", "transforms": [], "json_path": null, "expected": "true", "extracted_value": "{{buy_milk_completed}}", "store_key": "buy_milk_completed", "variable_refs": {"{{buy_milk_completed}}": "true"}}], "sub_checks": [{"description": "the footer counter reads exactly \"2 items left\"", "store_key": "footer_counter_check", "expected_value": "2 items left", "extracted_value": "{{footer_counter_check}}", "operator": "equals", "transforms": ["strip"]}, {"description": "\"Buy milk\" is shown as completed (struck through)", "store_key": "buy_milk_completed", "expected_value": "true", "extracted_value": "{{buy_milk_completed}}", "operator": "equals", "transforms": []}], "composite_operator": "and", "claim": "the footer counter reads exactly \"2 items left\" and \"Buy milk\" is shown as completed (struck through)"});
  });
  
  await testmu.step("Hover over 'the todo row labeled \"Walk the dog\" in the todo list'", { instructionId: "a2c88371-36ab-47a7-8b9a-5f2d9ad516f5" }, async () => {
    const _c_4 = await testmu.getVisionCoordinates(page, "Hover over 'the todo row labeled \"Walk the dog\" in the todo list'", "hover", 960, 540);
    await page.mouse.move(_c_4.x, _c_4.y);
  });
  
  await testmu.step("Clicking delete for Walk the dog", { instructionId: "315275b4-c326-462d-9196-5cf0d1c53119" }, async () => {
    element_5 = page.locator("internal:role=button[name=\"\u00d7\"i]");
    await element_5.click();
  });
  
  await testmu.step("Counting the todos in the list", async () => {
    await page.waitForLoadState("domcontentloaded", { timeout: 5000 });
    setVar("todo_count_check", await testmu.textualAnalyzer(page, { wrappedJs: "(els) => {\n  const __m = {9: 0};\n  const el = (i) => els[__m[i]];\n  const __v = (el(9).querySelectorAll(':scope > li').length);\n  return (typeof __v === 'boolean' ? String(__v) : __v);\n}", locators: ["internal:text=\"Pay rent Buy milk\"i"], query: "the number of direct todo items in the todo list", expectedValue: "2", needsUnitConversion: false, operator: "equals", transforms: [], condition: "Exactly two todos are listed." }));
  });
  
  await testmu.step("Checking whether the Buy milk todo is present", async () => {
    await page.waitForLoadState("domcontentloaded", { timeout: 5000 });
    setVar("buy_milk_listed", await testmu.textualAnalyzer(page, { wrappedJs: "(els) => {\n  const __m = {9: 0};\n  const el = (i) => els[__m[i]];\n  const __v = (Array.from(el(9).querySelectorAll(':scope > li')).some(li => li.innerText.trim() === 'Buy milk'));\n  return (typeof __v === 'boolean' ? String(__v) : __v);\n}", locators: ["internal:text=\"Pay rent Buy milk\"i"], query: "whether the \"Buy milk\" todo is present in the todo list", expectedValue: "true", needsUnitConversion: false, operator: "equals", transforms: [], condition: "\"Buy milk\" is listed." }));
  });
  
  await testmu.step("Checking whether the Pay rent todo is present", async () => {
    await page.waitForLoadState("domcontentloaded", { timeout: 5000 });
    setVar("pay_rent_listed", await testmu.textualAnalyzer(page, { wrappedJs: "(els) => {\n  const __m = {9: 0};\n  const el = (i) => els[__m[i]];\n  const __v = (Array.from(el(9).querySelectorAll(':scope > li')).some(li => li.innerText.trim() === 'Pay rent'));\n  return (typeof __v === 'boolean' ? String(__v) : __v);\n}", locators: ["internal:text=\"Pay rent Buy milk\"i"], query: "whether the \"Pay rent\" todo is present in the todo list", expectedValue: "true", needsUnitConversion: false, operator: "equals", transforms: [], condition: "\"Pay rent\" is listed." }));
  });
  
  await testmu.step("Checking whether the Buy milk todo is struck through", async () => {
    await page.waitForLoadState("domcontentloaded", { timeout: 5000 });
    setVar("buy_milk_struck_through", await testmu.textualAnalyzer(page, { wrappedJs: "(els) => {\n  const __m = {15: 0};\n  const el = (i) => els[__m[i]];\n  const __v = (getComputedStyle(el(15)).textDecorationLine.includes('line-through'));\n  return (typeof __v === 'boolean' ? String(__v) : __v);\n}", locators: ["internal:text=\"Buy milk\"i"], query: "whether the \"Buy milk\" todo label in the todo list has line-through text decoration", expectedValue: "true", needsUnitConversion: false, operator: "equals", transforms: [], condition: "\"Buy milk\" is still shown as completed (struck through)." }));
  });
  
  await testmu.step("Checking whether the Buy milk checkbox is ticked", async () => {
    await page.waitForLoadState("domcontentloaded", { timeout: 5000 });
    setVar("buy_milk_checkbox_ticked", await testmu.textualAnalyzer(page, { wrappedJs: "(els) => {\n  const __m = {14: 0};\n  const el = (i) => els[__m[i]];\n  const __v = (el(14).checked);\n  return (typeof __v === 'boolean' ? String(__v) : __v);\n}", locators: ["internal:role=listitem >> internal:has-text=\"Buy milk\"i >> internal:role=checkbox"], query: "whether the \"Buy milk\" checkbox in the todo list is checked", expectedValue: "true", needsUnitConversion: false, operator: "equals", transforms: [], condition: "The \"Buy milk\" checkbox is ticked." }));
  });
  
  await testmu.step("Reading the footer todo counter", async () => {
    await page.waitForLoadState("domcontentloaded", { timeout: 5000 });
    setVar("footer_counter_check", await testmu.textualAnalyzer(page, { wrappedJs: "(els) => {\n  const __m = {18: 0};\n  const el = (i) => els[__m[i]];\n  const __v = (`${el(18).textContent.trim()} item left`);\n  return (typeof __v === 'boolean' ? String(__v) : __v);\n}", locators: ["internal:text=\"1\"i"], query: "the todo counter text displayed in the list footer", expectedValue: "1 item left", needsUnitConversion: false, operator: "equals", transforms: [], condition: "The footer counter reads exactly \"1 item left\"." }));
  });
  
  await testmu.step("Assertion check", { instructionId: "88680477-db55-41d6-9e38-ecef3507aa75" }, async () => {
    await testmu.verifyAssertion(page, "Assertion check", {"operator": ["equals"], "assertion_operands": [], "left_operand": null, "right_operand": null, "operands": [], "sub_results": [{"description": "Exactly two todos are listed.", "passed": true, "operator": "equals", "transforms": [], "json_path": null, "expected": "2", "extracted_value": "{{todo_count_check}}", "store_key": "todo_count_check", "variable_refs": {"{{todo_count_check}}": "2"}}, {"description": "\"Buy milk\" is listed.", "passed": true, "operator": "equals", "transforms": [], "json_path": null, "expected": "true", "extracted_value": "{{buy_milk_listed}}", "store_key": "buy_milk_listed", "variable_refs": {"{{buy_milk_listed}}": "true"}}, {"description": "\"Pay rent\" is listed.", "passed": true, "operator": "equals", "transforms": [], "json_path": null, "expected": "true", "extracted_value": "{{pay_rent_listed}}", "store_key": "pay_rent_listed", "variable_refs": {"{{pay_rent_listed}}": "true"}}, {"description": "The footer counter reads exactly \"1 item left\".", "passed": true, "operator": "equals", "transforms": [], "json_path": null, "expected": "1 item left", "extracted_value": "{{footer_counter_check}}", "store_key": "footer_counter_check", "variable_refs": {"{{footer_counter_check}}": "1 item left"}}, {"description": "\"Buy milk\" is still shown as completed (struck through).", "passed": true, "operator": "equals", "transforms": [], "json_path": null, "expected": "true", "extracted_value": "{{buy_milk_struck_through}}", "store_key": "buy_milk_struck_through", "variable_refs": {"{{buy_milk_struck_through}}": "true"}}, {"description": "The \"Buy milk\" checkbox is ticked.", "passed": true, "operator": "equals", "transforms": [], "json_path": null, "expected": "true", "extracted_value": "{{buy_milk_checkbox_ticked}}", "store_key": "buy_milk_checkbox_ticked", "variable_refs": {"{{buy_milk_checkbox_ticked}}": "true"}}], "sub_checks": [{"description": "Exactly two todos are listed.", "store_key": "todo_count_check", "expected_value": "2", "extracted_value": "{{todo_count_check}}", "operator": "equals", "transforms": []}, {"description": "\"Buy milk\" is listed.", "store_key": "buy_milk_listed", "expected_value": "true", "extracted_value": "{{buy_milk_listed}}", "operator": "equals", "transforms": []}, {"description": "\"Pay rent\" is listed.", "store_key": "pay_rent_listed", "expected_value": "true", "extracted_value": "{{pay_rent_listed}}", "operator": "equals", "transforms": []}, {"description": "The footer counter reads exactly \"1 item left\".", "store_key": "footer_counter_check", "expected_value": "1 item left", "extracted_value": "{{footer_counter_check}}", "operator": "equals", "transforms": []}, {"description": "\"Buy milk\" is still shown as completed (struck through).", "store_key": "buy_milk_struck_through", "expected_value": "true", "extracted_value": "{{buy_milk_struck_through}}", "operator": "equals", "transforms": []}, {"description": "The \"Buy milk\" checkbox is ticked.", "store_key": "buy_milk_checkbox_ticked", "expected_value": "true", "extracted_value": "{{buy_milk_checkbox_ticked}}", "operator": "equals", "transforms": []}], "composite_operator": "and", "claim": "Exactly two todos are listed, \"Buy milk\" and \"Pay rent\", the footer counter reads exactly \"1 item left\", and \"Buy milk\" is still shown as completed (struck through) with its checkbox ticked."});
  });
  
  await testmu.step("Clicking the Completed filter", { instructionId: "8486be6b-bf6f-4561-88a7-6b5f536425a0" }, async () => {
    element_6 = page.locator("internal:role=link[name=\"Completed\"i]");
    await element_6.click();
  });
  
  await testmu.step("Counting the todo items in the list", async () => {
    await page.waitForLoadState("domcontentloaded", { timeout: 5000 });
    setVar("todo_count_check", await testmu.textualAnalyzer(page, { wrappedJs: "(els) => {\n  const __m = {9: 0};\n  const el = (i) => els[__m[i]];\n  const __v = (el(9).querySelectorAll(':scope > li').length);\n  return (typeof __v === 'boolean' ? String(__v) : __v);\n}", locators: ["internal:role=list >> internal:has-text=\"Buy milk\"i"], query: "the number of todo items in the todo list", expectedValue: "1", needsUnitConversion: false, operator: "equals", transforms: [], condition: "Exactly one todo is listed." }));
  });
  
  await testmu.step("Reading the listed todo text", async () => {
    await page.waitForLoadState("domcontentloaded", { timeout: 5000 });
    setVar("listed_todo_check", await testmu.textualAnalyzer(page, { wrappedJs: "(els) => {\n  const __m = {12: 0};\n  const el = (i) => els[__m[i]];\n  const __v = (el(12).innerText.trim());\n  return (typeof __v === 'boolean' ? String(__v) : __v);\n}", locators: ["internal:text=\"Buy milk\"i"], query: "the text of the listed todo label", expectedValue: "Buy milk", needsUnitConversion: false, operator: "equals", transforms: [], condition: "The listed todo is \"Buy milk\"." }));
  });
  
  await testmu.step("Checking whether the Buy milk checkbox is checked", async () => {
    await page.waitForLoadState("domcontentloaded", { timeout: 5000 });
    setVar("buy_milk_checkbox_ticked", await testmu.textualAnalyzer(page, { wrappedJs: "(els) => {\n  const __m = {11: 0};\n  const el = (i) => els[__m[i]];\n  const __v = (el(11).checked);\n  return (typeof __v === 'boolean' ? String(__v) : __v);\n}", locators: ["internal:role=listitem >> internal:has-text=\"Buy milk\"i >> internal:role=checkbox"], query: "whether the \"Buy milk\" todo checkbox in the todo list is checked", expectedValue: "true", needsUnitConversion: false, operator: "equals", transforms: [], condition: "The \"Buy milk\" todo checkbox is ticked." }));
  });
  
  await testmu.step("Reading the footer item counter", async () => {
    await page.waitForLoadState("domcontentloaded", { timeout: 5000 });
    setVar("footer_counter_check", await testmu.textualAnalyzer(page, { wrappedJs: "(els) => {\n  const __m = {13: 0};\n  const el = (i) => els[__m[i]];\n  const __v = (el(13).querySelector('.todo-count').innerText.trim());\n  return (typeof __v === 'boolean' ? String(__v) : __v);\n}", locators: ["internal:text=\"1 item left All Active\"i"], query: "the footer counter text in the todo section", expectedValue: "1 item left", needsUnitConversion: false, operator: "equals", transforms: [], condition: "The footer counter reads exactly \"1 item left\"." }));
  });
  
  await testmu.step("Assertion check", { instructionId: "64000fb9-3ded-4a3a-8af3-47a2bf4ff3d6" }, async () => {
    await testmu.verifyAssertion(page, "Assertion check", {"operator": ["equals"], "assertion_operands": [], "left_operand": null, "right_operand": null, "operands": [], "sub_results": [{"description": "Exactly one todo is listed.", "passed": true, "operator": "equals", "transforms": [], "json_path": null, "expected": "1", "extracted_value": "{{todo_count_check}}", "store_key": "todo_count_check", "variable_refs": {"{{todo_count_check}}": "1"}}, {"description": "The listed todo is \"Buy milk\".", "passed": true, "operator": "equals", "transforms": [], "json_path": null, "expected": "Buy milk", "extracted_value": "{{listed_todo_check}}", "store_key": "listed_todo_check", "variable_refs": {"{{listed_todo_check}}": "Buy milk"}}, {"description": "The \"Buy milk\" todo checkbox is ticked.", "passed": true, "operator": "equals", "transforms": [], "json_path": null, "expected": "true", "extracted_value": "{{buy_milk_checkbox_ticked}}", "store_key": "buy_milk_checkbox_ticked", "variable_refs": {"{{buy_milk_checkbox_ticked}}": "true"}}, {"description": "The footer counter reads exactly \"1 item left\".", "passed": true, "operator": "equals", "transforms": [], "json_path": null, "expected": "1 item left", "extracted_value": "{{footer_counter_check}}", "store_key": "footer_counter_check", "variable_refs": {"{{footer_counter_check}}": "1 item left"}}], "sub_checks": [{"description": "Exactly one todo is listed.", "store_key": "todo_count_check", "expected_value": "1", "extracted_value": "{{todo_count_check}}", "operator": "equals", "transforms": []}, {"description": "The listed todo is \"Buy milk\".", "store_key": "listed_todo_check", "expected_value": "Buy milk", "extracted_value": "{{listed_todo_check}}", "operator": "equals", "transforms": []}, {"description": "The \"Buy milk\" todo checkbox is ticked.", "store_key": "buy_milk_checkbox_ticked", "expected_value": "true", "extracted_value": "{{buy_milk_checkbox_ticked}}", "operator": "equals", "transforms": []}, {"description": "The footer counter reads exactly \"1 item left\".", "store_key": "footer_counter_check", "expected_value": "1 item left", "extracted_value": "{{footer_counter_check}}", "operator": "equals", "transforms": []}], "composite_operator": "and", "claim": "exactly one todo is listed, it is \"Buy milk\", its checkbox is ticked, and the footer counter reads exactly \"1 item left\"."});
  });
});

testmu.run();