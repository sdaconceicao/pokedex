import { test, expect } from "@playwright/test";

test.describe("Navbar", () => {
  test("should navigate to grass type and load Bulbasaur details", async ({
    page,
  }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const grassTypeLink = page.getByRole("link", { name: /grass/i });
    await expect(grassTypeLink).toBeVisible();
    await grassTypeLink.click();

    await page.waitForLoadState("networkidle");
    await expect(page).toHaveURL(/\?type=grass/);

    await expect(
      page.getByRole("heading", { level: 2 }).filter({ hasText: /grass/i })
    ).toBeVisible();

    const bulbasaurLink = page
      .getByRole("link")
      .filter({ hasText: /^bulbasaur$/i })
      .first();
    await expect(bulbasaurLink).toBeVisible();
    await bulbasaurLink.click();

    await page.waitForLoadState("networkidle");

    await expect(
      page.getByRole("heading", { level: 1 }).filter({ hasText: /bulbasaur/i })
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { level: 2 }).filter({ hasText: /Base Stats/i })
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { level: 2 }).filter({ hasText: /Abilities/i })
    ).toBeVisible();
  });

  test("should navigate to gigantamax special type and verify nav highlighting with empty search", async ({
    page,
  }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const searchInput = page.getByPlaceholder("Search Pokemon...");
    await expect(searchInput).toHaveValue("");

    const gigantamaxLink = page.getByRole("link", { name: /gigantamax/i });
    await expect(gigantamaxLink).toBeVisible();
    await gigantamaxLink.click();

    await page.waitForLoadState("networkidle");

    await expect(page).toHaveURL(/\?special=gmax/);
    await expect(gigantamaxLink).toHaveClass(/active/);
    await expect(searchInput).toHaveValue("");

    await expect(
      page.getByRole("heading", { level: 2 }).filter({ hasText: /gigantamax/i })
    ).toBeVisible();
  });
});
