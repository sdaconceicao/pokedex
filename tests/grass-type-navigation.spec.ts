import { test, expect } from "@playwright/test";

test.describe("Grass Type Navigation", () => {
  test("should navigate to grass type and load Bulbasaur details", async ({
    page,
  }) => {
    // Navigate to the home page
    await page.goto("/");

    // Wait for the page to load
    await page.waitForLoadState("networkidle");

    // Debug: Log the page content to see what's actually there
    console.log("Page title:", await page.title());
    console.log("Page URL:", page.url());

    // Look for the grass type in the navbar section - it should be in the Types section
    const grassTypeLink = page.locator('a[href*="type=grass"]').first();
    await expect(grassTypeLink).toBeVisible();

    // Click on the grass type
    await grassTypeLink.click();

    // Wait for the grass type page to load
    await page.waitForLoadState("networkidle");

    // Verify we're on a page with grass type Pokemon - look for the heading
    await expect(
      page.locator("h2").filter({ hasText: /grass/i })
    ).toBeVisible();

    // Look for Bulbasaur in the results - it should be a link to the detail page
    const bulbasaurLink = page.locator('a[href*="pokemon/1"]').first();
    await expect(bulbasaurLink).toBeVisible();

    // Click on Bulbasaur
    await bulbasaurLink.click();

    // Wait for the Pokemon detail page to load
    await page.waitForLoadState("networkidle");

    // Verify we're on Bulbasaur's detail page - look for the name in h1
    await expect(
      page.locator("h1").filter({ hasText: /bulbasaur/i })
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
