import { test, expect } from "@playwright/test";

test("redirects root to /en and renders the hero heading", async ({ page }) => {
  await page.goto("/");
  await page.waitForURL(/\/en(\/|$)/);
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
});

test("switches language to French", async ({ page }) => {
  await page.goto("/en");
  await page.getByRole("button", { name: "fr", exact: true }).click();
  await page.waitForURL(/\/fr(\/|$)/);
});
