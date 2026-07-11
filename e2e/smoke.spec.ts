import { expect, test } from "@playwright/test";

test("landing page loads at the site root", async ({ page }) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", { name: /turn circular/i }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: /start workflow/i }).first(),
  ).toHaveAttribute("href", "/studio/");
});

// Runs against a placeholder Convex URL, so it verifies the app boots and shows
// its loading state. Full workflow parity is exercised against a real
// deployment (see AGENTS.md), not in this offline smoke check.
test("boots and reaches the catalog-loading state", async ({ page }) => {
  await page.goto("/studio/");

  await expect(page.getByText(/loading the material catalog/i)).toBeVisible();
});
