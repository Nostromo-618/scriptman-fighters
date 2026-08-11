import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => {
    localStorage.removeItem("sfighters-disclaimer-accepted");
    localStorage.removeItem("scriptman_fighters_disclaimer_accepted");
  });
  await page.reload();
});

test("accept disclaimer unlocks the game dashboard", async ({ page }) => {
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Disclaimer & Terms of Use" })).toBeVisible();

  await page.getByRole("button", { name: "Accept & Continue" }).click();

  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(page.getByRole("button", { name: "START MATCH" })).toBeVisible();
  await expect(page.locator("canvas.game-canvas")).toBeVisible();
});

test("decline disclaimer shows farewell screen", async ({ page }) => {
  await page.getByRole("button", { name: "Decline" }).click();

  await expect(page.getByRole("heading", { name: "Farewell" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Return to Disclaimer" })).toBeVisible();
});
