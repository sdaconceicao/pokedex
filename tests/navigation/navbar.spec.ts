import { test, expect } from "@playwright/test";

test.describe("Navbar", () => {
  test("should navigate to grass type and load Bulbasaur details", async ({
    page,
  }) => {
    // Navigate to the home page
    await page.goto("/");

    // Wait for the page to load
    await page.waitForLoadState("networkidle");

    // Look for the grass type in the navbar section
    const grassTypeLink = page.getByRole("link", { name: /grass/i });
    await expect(grassTypeLink).toBeVisible();

    // Click on the grass type
    await grassTypeLink.click();

    // Wait for the grass type page to load
    await page.waitForLoadState("networkidle");

    // Verify we're on a page with grass type Pokemon
    await expect(
      page.getByRole("heading", { level: 2 }).filter({ hasText: /grass/i })
    ).toBeVisible();

    // Look for Bulbasaur in the results
    const bulbasaurLink = page.getByRole("link", { name: /bulbasaur/i });
    await expect(bulbasaurLink).toBeVisible();

    // Click on Bulbasaur
    await bulbasaurLink.click();

    // Wait for the Pokemon detail page to load
    await page.waitForLoadState("networkidle");

    // Verify we're on Bulbasaur's detail page
    await expect(
      page.getByRole("heading", { level: 1 }).filter({ hasText: /bulbasaur/i })
    ).toBeVisible();

    // Verify the page shows Pokemon details - look for the stats section
    await expect(
      page.getByRole("heading", { level: 2 }).filter({ hasText: /Base Stats/i })
    ).toBeVisible();

    // Also verify we can see the abilities section
    await expect(
      page.getByRole("heading", { level: 2 }).filter({ hasText: /Abilities/i })
    ).toBeVisible();
  });
});
