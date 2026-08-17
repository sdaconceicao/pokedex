import { expect, test, type Page } from "@playwright/test";

/** The sidebar form, also used here to reach the Name field for the facet
 *  round-trip on /search. */
const filters = (page: Page) => page.getByRole("search", { name: "Filter Pokemon" });

/** The lone "Sort by" ComboBox in the title bar. */
const sortBySelect = (page: Page) => page.getByRole("combobox", { name: /sort by/i });

/** lago's Select defaults to menuTrigger: "input", so once it holds a value the
 *  chevron re-opens the list rather than the input itself. Open it through the
 *  widget's own button, scoped so the sidebar's four other ComboBoxes are
 *  never matched. */
const openSortBySelect = (page: Page) =>
  page
    .locator(".react-aria-ComboBox")
    .filter({ has: sortBySelect(page) })
    .first()
    .getByRole("button")
    .click();

const sortOption = (page: Page, label: string) =>
  page.getByRole("option", { name: label, exact: true });

/** Opens the title-bar select and picks an option. Waits for the listbox to
 *  actually close afterwards — reopening the widget while its previous close
 *  is still in flight silently fails to reopen it. */
const selectSortOption = async (page: Page, label: string) => {
  await openSortBySelect(page);
  await sortOption(page, label).click();
  await expect(page.getByRole("listbox")).toHaveCount(0);
};

const sortFieldGroup = (page: Page) => page.getByRole("radiogroup", { name: "Sort field" });

const sortRadio = (page: Page, name: string) => page.getByRole("radio", { name });

const main = (page: Page) => page.locator("main");

const pokemonCards = (page: Page) => page.getByTestId("pokemon-card");

/** True once main actually has room to scroll. The mock backend's handful of
 *  Pokemon may not fill the page, so scroll-dependent tests skip rather than
 *  give false confidence. */
const isScrollable = (page: Page) =>
  main(page).evaluate((el) => el.scrollHeight > el.clientHeight + 200);

/** Samples the painted card count on every frame via requestAnimationFrame, so
 *  a regression that tears the grid out for a skeleton mid-sort shows up even
 *  if it only lasts one frame. */
const startCardCountRecorder = (page: Page) =>
  page.evaluate(() => {
    const w = window as unknown as { __cardCounts: number[]; __recordingCards: boolean };
    w.__cardCounts = [];
    w.__recordingCards = true;
    const sample = () => {
      if (!w.__recordingCards) return;
      w.__cardCounts.push(document.querySelectorAll('[data-testid="pokemon-card"]').length);
      requestAnimationFrame(sample);
    };
    requestAnimationFrame(sample);
  });

const stopCardCountRecorder = (page: Page): Promise<number[]> =>
  page.evaluate(() => {
    const w = window as unknown as { __cardCounts: number[]; __recordingCards: boolean };
    w.__recordingCards = false;
    return w.__cardCounts;
  });

test.describe("Pokemon list sorting", () => {
  test("shows the order named by the URL, and falls back for a bad one", async ({ page }) => {
    const cases: [sort: string | undefined, label: string][] = [
      [undefined, "Dex number ↑"],
      ["ID_ASC", "Dex number ↑"],
      ["ID_DESC", "Dex number ↓"],
      ["NAME_ASC", "Name A–Z"],
      ["NAME_DESC", "Name Z–A"],
      ["bogus", "Dex number ↑"],
    ];

    for (const [sort, label] of cases) {
      await page.goto(sort ? `/type/grass?sort=${sort}` : "/type/grass");
      await page.waitForLoadState("networkidle");
      await expect(sortBySelect(page)).toHaveValue(label);
    }
  });

  test("choosing an order writes the URL, and returning to the default removes it", async ({
    page,
  }) => {
    await page.goto("/type/grass");
    await page.waitForLoadState("networkidle");

    await selectSortOption(page, "Name A–Z");
    await page.waitForLoadState("networkidle");
    await expect(page).toHaveURL(/sort=NAME_ASC/);

    await selectSortOption(page, "Dex number ↑");
    await page.waitForLoadState("networkidle");
    await expect(page).not.toHaveURL(/sort=/);
  });

  test("keeps sort through paging and a Pokemon's detail, and back", async ({ page }) => {
    await page.goto("/type/grass?sort=NAME_DESC");
    await page.waitForLoadState("networkidle");

    // The mock backend's handful of Pokemon never fill a page, so pagination
    // may not render at all — only exercise it when it's actually there.
    const pageTwo = page.getByRole("button", { name: "Go to page 2" });
    if (await pageTwo.count()) {
      await pageTwo.click();
      await page.waitForLoadState("networkidle");
      await expect(page).toHaveURL(/page=2/);
    }

    await expect(page).toHaveURL(/sort=NAME_DESC/);
    const listUrl = page.url();

    await pokemonCards(page).first().click();
    await page.waitForLoadState("networkidle");
    await expect(page).toHaveURL(/\/type\/grass\/pokemon\/.+/);
    await expect(page).toHaveURL(/sort=NAME_DESC/);

    await page.goBack();
    await page.waitForLoadState("networkidle");
    await expect(page).toHaveURL(listUrl);
  });

  test("keeps facets and sort together on /search", async ({ page }) => {
    await page.goto("/search?types=grass");
    await page.waitForLoadState("networkidle");

    await selectSortOption(page, "Name A–Z");
    await page.waitForLoadState("networkidle");
    await expect(page).toHaveURL(/types=grass/);
    await expect(page).toHaveURL(/sort=NAME_ASC/);

    // And vice versa: submitting a new facet from a sorted list keeps the sort.
    await page.goto("/search?sort=NAME_DESC");
    await page.waitForLoadState("networkidle");

    await filters(page).getByRole("searchbox", { name: "Name" }).fill("char");
    await page.getByRole("button", { name: "Search with these filters" }).click();
    await page.waitForLoadState("networkidle");
    await expect(page).toHaveURL(/q=char/);
    await expect(page).toHaveURL(/sort=NAME_DESC/);
  });

  test("the sticky toolbar appears once scrolled past the hero, checked to match the URL", async ({
    page,
  }) => {
    await page.goto("/type/grass?sort=NAME_DESC");
    await page.waitForLoadState("networkidle");
    test.skip(
      !(await isScrollable(page)),
      "not enough content under the mock backend to scroll past the hero",
    );

    await main(page).evaluate((el) => {
      el.scrollTop = el.scrollHeight;
    });

    await expect(sortFieldGroup(page)).toBeVisible();
    await expect(sortRadio(page, "Name")).toHaveAttribute("aria-checked", "true");
    await expect(sortRadio(page, "Descending")).toHaveAttribute("aria-checked", "true");
  });

  test("choosing a toolbar radio updates the URL, and the title-bar select stays in sync", async ({
    page,
  }) => {
    await page.goto("/type/grass");
    await page.waitForLoadState("networkidle");
    test.skip(
      !(await isScrollable(page)),
      "not enough content under the mock backend to scroll past the hero",
    );

    await main(page).evaluate((el) => {
      el.scrollTop = el.scrollHeight;
    });
    await expect(sortFieldGroup(page)).toBeVisible();

    await sortRadio(page, "Name").click();
    await page.waitForLoadState("networkidle");
    await expect(page).toHaveURL(/sort=NAME_ASC/);
    await expect(sortBySelect(page)).toHaveValue("Name A–Z");

    await sortRadio(page, "Descending").click();
    await page.waitForLoadState("networkidle");
    await expect(page).toHaveURL(/sort=NAME_DESC/);
    await expect(sortBySelect(page)).toHaveValue("Name Z–A");
  });

  test("the grid never empties while a sort change is in flight", async ({ page }) => {
    await page.goto("/type/grass");
    await page.waitForLoadState("networkidle");
    await expect(pokemonCards(page).first()).toBeVisible();

    await startCardCountRecorder(page);

    await selectSortOption(page, "Name A–Z");
    await page.waitForLoadState("networkidle");

    const counts = await stopCardCountRecorder(page);
    expect(counts.length).toBeGreaterThan(0);
    expect(Math.min(...counts)).toBeGreaterThan(0);
  });

  test("scroll position survives a sort change", async ({ page }) => {
    await page.goto("/type/grass");
    await page.waitForLoadState("networkidle");
    test.skip(
      !(await isScrollable(page)),
      "not enough content under the mock backend to scroll past the hero",
    );

    await main(page).evaluate((el) => {
      el.scrollTop = el.scrollHeight;
    });
    const scrollTop = await main(page).evaluate((el) => el.scrollTop);
    await expect(sortFieldGroup(page)).toBeVisible();

    await sortRadio(page, "Name").click();
    await page.waitForLoadState("networkidle");

    await expect(main(page)).toHaveJSProperty("scrollTop", scrollTop);
    await expect(sortFieldGroup(page)).toBeVisible();
  });

  test("the grid sets overflow-anchor: none", async ({ page }) => {
    // Without this, the browser's own scroll anchoring latches onto a card that
    // a sort change replaces and throws the reader up the page — a one-line CSS
    // fix that's easy to lose, so it's asserted directly rather than inferred.
    await page.goto("/type/grass");
    await page.waitForLoadState("networkidle");
    await expect(pokemonCards(page).first()).toBeVisible();

    const overflowAnchor = await page.evaluate(() => {
      const grid = document.querySelector('[data-testid="pokemon-card"]')?.closest('[class*="grid"]');
      return grid ? getComputedStyle(grid).overflowAnchor : null;
    });

    expect(overflowAnchor).toBe("none");
  });
});
