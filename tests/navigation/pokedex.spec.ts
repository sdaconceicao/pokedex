import { expect, test } from "@playwright/test";

/** The sidebar's Pokedexes section. Scoped, because a dex and a region can
 *  share a name — "Kanto" is both — and only one of them belongs here. */
const pokedexSection = (page: import("@playwright/test").Page) =>
  page.getByRole("group", { name: "Pokedexes" });

/** One region's band inside that section. */
const regionBand = (page: import("@playwright/test").Page, region: string) =>
  page.getByRole("list", { name: region });

/**
 * Opens a Browse section. They start collapsed unless the current route belongs
 * to one, and only one is open at a time, so a test that reaches into the
 * sidebar from elsewhere has to open the section first — same as a reader would.
 */
const openSection = async (page: import("@playwright/test").Page, title: string) => {
  const header = page.getByRole("button", { name: title, exact: true });

  if ((await header.getAttribute("aria-expanded")) !== "true") {
    await header.click();
    await expect(header).toHaveAttribute("aria-expanded", "true");
  }
};

test.describe("Pokedex page", () => {
  test("should navigate from the sidebar to a pokedex and open a Pokemon over its list", async ({
    page,
  }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await openSection(page, "Pokedexes");

    const kantoLink = regionBand(page, "Kanto").getByRole("link", { name: /^Kanto \(\d+\)$/ });
    await expect(kantoLink).toBeVisible();
    await kantoLink.click();

    // Pokedexes have a page of their own rather than being a search facet
    await page.waitForLoadState("networkidle");
    await expect(page).toHaveURL(/\/pokedex\/kanto/);
    await expect(kantoLink).toHaveAttribute("aria-current", "page");

    // The profile is what the dex endpoint returns: its name, its blurb, and
    // whether it counts towards the main series
    await expect(
      page.getByRole("heading", { level: 1 }).filter({ hasText: /^kanto$/i }),
    ).toBeVisible();
    await expect(page.getByText("Main series")).toBeVisible();
    await expect(page.getByText("Games", { exact: true })).toBeVisible();
    await expect(
      page.getByRole("heading", { level: 2 }).filter({ hasText: /Pokemon in this pokedex/i }),
    ).toBeVisible();

    const bulbasaurLink = page
      .getByRole("link")
      .filter({ hasText: /bulbasaur/i })
      .first();
    await expect(bulbasaurLink).toBeVisible();
    await bulbasaurLink.click();

    // Opened from a pokedex, the detail comes up over the list it came from
    await page.waitForLoadState("networkidle");
    await expect(page).toHaveURL(/\/pokedex\/kanto\/pokemon\/1/);

    const detail = page.getByRole("dialog");
    await expect(
      detail.getByRole("heading", { level: 1 }).filter({ hasText: /bulbasaur/i }),
    ).toBeVisible();

    // Back drops the detail and leaves the dex's list as it was
    await page.goBack();
    await expect(page.getByRole("dialog")).toHaveCount(0);
    await expect(page).toHaveURL(/\/pokedex\/kanto$/);
  });

  test("should keep the sort in the URL and across a reload", async ({ page }) => {
    await page.goto("/pokedex/kanto");
    await page.waitForLoadState("networkidle");

    const sort = page.getByRole("combobox", { name: "Sort by" });
    await sort.click();
    await page.getByRole("option", { name: "Name A–Z" }).click();

    await expect(page).toHaveURL(/\/pokedex\/kanto\?sort=NAME_ASC/);

    // The sort survives a reload, so a sorted page is linkable
    await page.reload();
    await page.waitForLoadState("networkidle");
    await expect(page.getByRole("combobox", { name: "Sort by" })).toHaveValue("Name A–Z");
  });

  test("groups the dexes under the region they cover", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await openSection(page, "Pokedexes");

    // The section is grouped rather than one flat list of every dex
    await expect(pokedexSection(page).getByRole("heading", { level: 3 }).first()).toBeVisible();

    const kanto = regionBand(page, "Kanto");
    await expect(kanto).toBeVisible();
    await expect(kanto.getByRole("link").first()).toBeVisible();
  });

  test("names a dex the same in the sidebar as on its page", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await openSection(page, "Pokedexes");

    const link = pokedexSection(page).getByRole("link").first();
    const label = ((await link.textContent()) ?? "").replace(/\s*\(\d+\)\s*$/, "").trim();
    await link.click();
    await page.waitForLoadState("networkidle");

    // The sidebar shows the dex's own name or the place its revisions share —
    // either way the same words, never a raw slug. Asserted rather than read, so
    // it retries past the route transition instead of catching the old heading.
    await expect(page).toHaveURL(/\/pokedex\//);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(label);
    expect(label).not.toMatch(/-/);
  });

  test("collapses a place's revisions to one item that opens the newest", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await openSection(page, "Pokedexes");

    // Original Johto and Updated Johto are one entry, named for the place
    const johto = regionBand(page, "Johto").getByRole("link");
    await expect(johto).toHaveCount(1);
    await expect(johto).toHaveText(/^Johto \(\d+\)\s*$/);

    await johto.click();
    await page.waitForLoadState("networkidle");
    await expect(page).toHaveURL(/\/pokedex\/updated-johto/);

    // The item stays current on the older revision too, since it stands for both
    await expect(johto).toHaveAttribute("aria-current", "page");
  });

  test("switches between a place's revisions", async ({ page }) => {
    await page.goto("/pokedex/updated-johto");
    await page.waitForLoadState("networkidle");

    // Titled by the place, with the revision on the switcher rather than in it
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Johto");

    const revisions = page.getByRole("radiogroup", { name: "Dex revision" });
    await expect(revisions.getByRole("radio", { name: "Updated" })).toBeChecked();

    await revisions.getByRole("radio", { name: "Original" }).click();
    await page.waitForLoadState("networkidle");

    await expect(page).toHaveURL(/\/pokedex\/original-johto$/);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Johto");
    await expect(revisions.getByRole("radio", { name: "Original" })).toBeChecked();

    // The sidebar item still points at the newest, and still reads as current
    await expect(regionBand(page, "Johto").getByRole("link")).toHaveAttribute(
      "aria-current",
      "page",
    );
  });

  test("drops the region row for a dex the API ties to no region", async ({ page }) => {
    await page.goto("/pokedex/national");
    await page.waitForLoadState("networkidle");

    await expect(page.getByRole("heading", { level: 1 })).toHaveText("National");
    await expect(page.getByText("Region", { exact: true })).toHaveCount(0);
    await expect(page.getByText("Games", { exact: true })).toHaveCount(0);
  });

  // lago pads every div inside a DisclosurePanel, so wrapping the options in
  // region bands silently indented them past every other section's.
  test("lines a grouped section's options up with a flat section's", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const left = async (locator: import("@playwright/test").Locator) => {
      const box = await locator.first().boundingBox();
      return box?.x ?? -1;
    };

    // Measured one section at a time, since only one is ever open — the sidebar
    // does not move between them, so the offsets are still comparable.
    await openSection(page, "Types");
    const flat = await left(page.getByRole("group", { name: "Types" }).getByRole("link"));

    await openSection(page, "Pokedexes");
    const [grouped, heading] = await Promise.all([
      left(pokedexSection(page).getByRole("link")),
      left(pokedexSection(page).getByRole("heading", { level: 3 })),
    ]);

    expect(grouped).toBe(flat);
    // The band's own caption shares that edge rather than sitting outside it
    expect(heading).toBe(flat);
  });
});
