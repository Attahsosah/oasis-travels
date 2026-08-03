import { test, expect } from "@playwright/test";

test("booking wizard advances past the destination step", async ({ page }) => {
  await page.goto("/en/booking");
  await expect(
    page.getByRole("heading", { name: /plan your journey/i }),
  ).toBeVisible();

  // Continue is disabled until a destination is chosen.
  await page.getByRole("button", { name: /santorini/i }).click();
  await page.getByRole("button", { name: /continue/i }).click();

  await expect(page).toHaveURL(/step=2/);
});

test("wishlist save toggles to the saved state", async ({ page }) => {
  await page.goto("/en/destinations/santorini");
  // The button's accessible name comes from its aria-label.
  await page.getByRole("button", { name: /add to wishlist/i }).click();
  await expect(
    page.getByRole("button", { name: /remove from wishlist/i }),
  ).toBeVisible();
});
