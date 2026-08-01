import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => {
    localStorage.setItem("scriptman_fighters_disclaimer_accepted", "true");
  });
  await page.reload();
  await expect(page.getByRole("button", { name: "START MATCH" })).toBeVisible();
});

test("start, pause, and reset match controls", async ({ page }) => {
  await page.getByRole("button", { name: "START MATCH" }).click();
  await expect(page.getByRole("button", { name: "PAUSE" })).toBeVisible();

  await page.getByRole("button", { name: "PAUSE" }).click();
  await expect(page.getByRole("button", { name: "RESUME" })).toBeVisible();

  await page.getByRole("button", { name: "RESET MATCH" }).click();
  await expect(page.getByRole("button", { name: "START MATCH" })).toBeVisible();
});

test("theme switcher updates data-theme without crashing", async ({ page }) => {
  const themeButton = page.locator("#theme-toggle-btn");
  await expect(themeButton).toBeVisible();

  const before = await page.evaluate(() =>
    document.documentElement.getAttribute("data-theme"),
  );

  await themeButton.click();

  const after = await page.evaluate(() =>
    document.documentElement.getAttribute("data-theme"),
  );

  expect(after).toBeTruthy();
  expect(after).not.toBe(before);
});
