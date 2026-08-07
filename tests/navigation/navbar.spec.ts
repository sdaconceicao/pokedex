import { test, expect } from "@playwright/test";

test.describe("Navbar", () => {
  test("should navigate to grass type and load Bulbasaur details", async ({
    page,
  }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const grassTypeLink = page.getByRole("link", { name: /^Grass \(\d+\)/ });
    await expect(grassTypeLink).toBeVisible();
    await grassTypeLink.click();

    // Types have a page of their own, with the type's profile above its Pokemon
    await page.waitForLoadState("networkidle");
    await expect(page).toHaveURL(/\/type\/grass/);
    await expect(grassTypeLink).toHaveClass(/active/);

    await expect(
      page.getByRole("heading", { level: 1 }).filter({ hasText: /^grass$/i }),
    ).toBeVisible();
    await expect(
      page
        .getByRole("heading", { level: 2 })
        .filter({ hasText: /Pokemon of this type/i }),
    ).toBeVisible();

    const bulbasaurLink = page
      .getByRole("link")
      .filter({ hasText: /bulbasaur/i })
      .first();
    await expect(bulbasaurLink).toBeVisible();
    await bulbasaurLink.click();

    // Opened from a type, the detail comes up over the list it came from
    await page.waitForLoadState("networkidle");
    await expect(page).toHaveURL(/\/type\/grass\/pokemon\/1/);

    const detail = page.getByRole("dialog");
    await expect(
      detail.getByRole("heading", { level: 1 }).filter({ hasText: /bulbasaur/i }),
    ).toBeVisible();
    await expect(
      detail.getByRole("heading", { level: 2 }).filter({ hasText: /Base Stats/i }),
    ).toBeVisible();
    await expect(
      detail.getByRole("heading", { level: 2 }).filter({ hasText: /Abilities/i }),
    ).toBeVisible();

    // Back drops the detail and leaves the type's list as it was
    await page.goBack();
    await expect(page.getByRole("dialog")).toHaveCount(0);
    await expect(page).toHaveURL(/\/type\/grass$/);
  });

  test("should navigate to gigantamax special type and verify nav highlighting with empty search", async ({
    page,
  }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const searchInput = page.getByPlaceholder("Search Pokemon...");
    await expect(searchInput).toHaveValue("");

    const gigantamaxLink = page.getByRole("link", { name: /^Gigantamax$/ });
    await expect(gigantamaxLink).toBeVisible();
    await gigantamaxLink.click();

    await page.waitForLoadState("networkidle");

    await expect(page).toHaveURL(/\?special=gmax/);
    await expect(gigantamaxLink).toHaveClass(/active/);
    await expect(searchInput).toHaveValue("");

    await expect(
      page
        .getByRole("heading", { level: 2 })
        .filter({ hasText: /gigantamax/i }),
    ).toBeVisible();
  });
});
