import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => {
    localStorage.setItem("scriptman_fighters_disclaimer_accepted", "true");
  });
  await page.reload();
  await expect(page.getByRole("button", { name: /Open Script Editor/i })).toBeVisible();
});

test("open script editor, edit, and save", async ({ page }) => {
  await page.getByRole("button", { name: /Open Script Editor/i }).click();

  const modal = page.locator(".sf-modal-scope--script-editor");
  await expect(page.getByText("Custom Fighter Script Editor")).toBeVisible();
  await expect(modal).toBeVisible();

  const editor = modal.locator(".vd-code-editor").first();
  await expect(editor).toBeVisible();

  await editor.locator("textarea").fill(`function decide(self, opponent) {
  return { left: false, right: true, up: false, down: false, action1: false, action2: false, action3: false };
}`);

  await page.getByRole("button", { name: "Save & Close" }).click();

  await expect(page.getByText("Custom Fighter Script Editor")).toHaveCount(0);
  await expect(page.getByRole("button", { name: /Open Script Editor/i })).toBeVisible();
});
