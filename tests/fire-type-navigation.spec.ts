import { test, expect } from "@playwright/test";

test.describe("Fire Type Navigation", () => {
  test("should navigate to fire type and load Charmander details", async ({
    page,
  }) => {
    // Navigate to the home page
    await page.goto("/");

    // Wait for the page to load
    await page.waitForLoadState("networkidle");

    // Debug: Log the page content to see what's actually there
    console.log("Page title:", await page.title());
    console.log("Page URL:", page.url());

    // Look for the fire type in the navbar section - it should be in the Types section
    const fireTypeLink = page.locator('a[href*="type=fire"]').first();
    await expect(fireTypeLink).toBeVisible();

    // Click on the fire type
    await fireTypeLink.click();

    // Wait for the fire type page to load
    await page.waitForLoadState("networkidle");

    // Verify we're on a page with fire type Pokemon - look for the heading
    await expect(page.locator("h2").filter({ hasText: /fire/i })).toBeVisible();

    // Look for Charmander in the results - it should be a link to the detail page
    const charmanderLink = page.locator('a[href*="pokemon/4"]').first();
    await expect(charmanderLink).toBeVisible();

    // Click on Charmander
    await charmanderLink.click();

    // Wait for the Pokemon detail page to load
    await page.waitForLoadState("networkidle");

    // Verify we're on Charmander's detail page - look for the name in h1
    await expect(
      page.locator("h1").filter({ hasText: /charmander/i })
    ).toBeVisible();

    // Verify the page shows Pokemon details - look for the stats section
    await expect(
      page.locator("h2").filter({ hasText: /Base Stats/i })
    ).toBeVisible();

    // Also verify we can see the abilities section
    await expect(
      page.locator("h2").filter({ hasText: /Abilities/i })
    ).toBeVisible();
  });
});
