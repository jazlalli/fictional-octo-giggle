import { test, expect } from "@playwright/test";

test("can visit page", async ({ page }) => {
  await page.goto("/");

  await expect(page).toHaveTitle(/Apron - Users/);
  await expect(page.getByRole("heading", { name: "Users" })).toBeVisible();
  await expect(page.getByRole("button", { name: /Add user/ })).toBeVisible();
  await expect(page.getByRole("table")).toBeVisible();
});

test("can open 'Add user' dialog", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("button", { name: /Add user/ }).click();

  await expect(page.getByRole("dialog", { name: "Add user" })).toBeVisible();

  await expect(page.getByLabel("Gender")).toBeVisible();
  await expect(page.getByLabel("First name")).toBeVisible();
  await expect(page.getByLabel("Last name")).toBeVisible();
  await expect(page.getByLabel("Age")).toBeVisible();

  await expect(page.getByRole("button", { name: /Save user/ })).toBeVisible();
  await expect(page.getByRole("button", { name: /Cancel/ })).toBeVisible();
});

test("can successfully add a user", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("button", { name: /Add user/ }).click();

  // fill the form with valid details
  await page.getByRole("combobox", { name: "Gender" }).click();
  await page.getByRole("option", { name: "Female" }).click();

  await page.getByLabel("First name").fill("Pretend");
  await page.getByLabel("Last name").fill("Playwright");
  await page.getByLabel("Age").fill("66");

  await page.getByRole("button", { name: /Save user/ }).click();

  await expect(
    page.getByRole("dialog", { name: "Add user" }),
  ).not.toBeVisible();

  const table = await page.locator("table > tbody");
  const rowCount = await table.locator("tr").count();
  expect(rowCount).toEqual(4);

  const latestRow = await table
    .locator("tr")
    .last()
    .locator(":scope")
    .allInnerTexts();

  latestRow.forEach((rowText) => {
    rowText = rowText.replace(/\s+/g, " ");

    expect(rowText).toEqual(expect.stringContaining("Female"));
    expect(rowText).toEqual(expect.stringContaining("Pretend Playwright"));
    expect(rowText).toEqual(expect.stringContaining("66"));
  });
});
