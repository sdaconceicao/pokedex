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

    // Look for Bulbasaur in the results - use a more specific approach
    // Find the first link that contains "bulbasaur" text
    const bulbasaurLink = page
      .getByRole("link")
      .filter({ hasText: /^bulbasaur$/i })
      .first();
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

  test("should navigate to gigantamax special type and verify nav highlighting with empty search", async ({
    page,
  }) => {
    // Navigate to the home page
    await page.goto("/");

    // Wait for the page to load
    await page.waitForLoadState("networkidle");

    // Verify search bar is empty initially
    const searchInput = page.getByPlaceholder("Search Pokemon...");
    await expect(searchInput).toHaveValue("");

    // Look for the Gigantamax link in the Special section of the navbar
    const gigantamaxLink = page.getByRole("link", { name: /gigantamax/i });
    await expect(gigantamaxLink).toBeVisible();

    // Click on the Gigantamax link
    await gigantamaxLink.click();

    // Wait for the page to load
    await page.waitForLoadState("networkidle");

    // Verify the URL contains the special=gmax parameter
    await expect(page).toHaveURL(/\?special=gmax/);

    // Verify the Gigantamax link is highlighted (has active class)
    await expect(gigantamaxLink).toHaveClass(/active/);

    // Verify the search bar is still empty after navigation
    await expect(searchInput).toHaveValue("");

    // Verify the page heading shows Gigantamax Pokemon
    await expect(
      page.getByRole("heading", { level: 2 }).filter({ hasText: /gigantamax/i })
    ).toBeVisible();
  });
});
