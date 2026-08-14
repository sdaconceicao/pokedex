import { expect, test } from "@playwright/test";

/** The sidebar form, which sits above the Browse sections. */
const filters = (page: import("@playwright/test").Page) =>
  page.getByRole("search", { name: "Filter Pokemon" });

test.describe("Search filters", () => {
  test("shows the form under a Search heading, above Browse", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const search = page.getByRole("heading", { name: "Search", exact: true });
    const browse = page.getByRole("heading", { name: "Browse", exact: true });

    await expect(search).toBeVisible();
    await expect(browse).toBeVisible();

    // The two headings are siblings in the sidebar, Search first
    const [searchTop, browseTop] = await Promise.all([
      search.boundingBox().then((box) => box?.y ?? 0),
      browse.boundingBox().then((box) => box?.y ?? 0),
    ]);
    expect(searchTop).toBeLessThan(browseTop);

    for (const label of ["Types", "Regions", "Pokedexes"]) {
      await expect(filters(page).getByRole("combobox", { name: label })).toBeVisible();
    }
    await expect(filters(page).getByRole("combobox", { name: /Dual type/ })).toBeVisible();
    await expect(filters(page).getByRole("searchbox", { name: "Name" })).toBeVisible();
  });

  test("searches by name and keeps the query in the URL", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    await filters(page).getByRole("searchbox", { name: "Name" }).fill("bulbasaur");
    await page.getByRole("button", { name: "Search with these filters" }).click();

    await page.waitForLoadState("networkidle");
    await expect(page).toHaveURL(/\/search\?q=bulbasaur/);
    await expect(
      page.getByRole("heading", { level: 1 }).filter({ hasText: /bulbasaur/i }),
    ).toBeVisible();
    await expect(page.getByRole("link").filter({ hasText: /bulbasaur/i }).first()).toBeVisible();
  });

  test("restores every facet from the URL", async ({ page }) => {
    await page.goto("/search?q=saur&types=grass&dual=grass,poison&regions=kanto");
    await page.waitForLoadState("networkidle");

    await expect(filters(page).getByRole("searchbox", { name: "Name" })).toHaveValue("saur");
    await expect(filters(page).getByRole("combobox", { name: /Dual type/ })).toHaveValue(
      "Grass / Poison",
    );
    // The multi-selects show their picks as removable tags
    await expect(filters(page).getByText("Grass", { exact: true }).first()).toBeVisible();
    await expect(filters(page).getByText("Kanto", { exact: true }).first()).toBeVisible();
  });

  test("combines a type with a name, and clearing goes back to everything", async ({ page }) => {
    await page.goto("/search?q=saur&types=grass");
    await page.waitForLoadState("networkidle");

    await expect(page).toHaveURL(/types=grass/);
    await expect(page.getByRole("heading", { level: 1, name: "Filtered Pokemon" })).toBeVisible();

    // Exact: the fields carry their own "Clear search" buttons
    await page.getByRole("button", { name: "Clear", exact: true }).click();
    await page.waitForLoadState("networkidle");

    await expect(page).toHaveURL(/\/search$/);
    await expect(page.getByRole("heading", { level: 1, name: "All Pokemon" })).toBeVisible();
  });

  test("forwards a pre-move home page link to the results", async ({ page }) => {
    await page.goto("/?q=bulbasaur");
    await page.waitForLoadState("networkidle");

    await expect(page).toHaveURL(/\/search\?q=bulbasaur/);
  });

  test("the header bar sends its query to the same results page", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    await page.getByPlaceholder("Search Pokemon...").fill("charmander");
    await page.getByPlaceholder("Search Pokemon...").press("Enter");

    await page.waitForLoadState("networkidle");
    await expect(page).toHaveURL(/\/search\?q=charmander/);
  });
});
