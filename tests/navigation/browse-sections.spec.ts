import { expect, test } from "@playwright/test";

/** Each Browse section's header, whose `aria-expanded` is the open/closed state. */
const header = (page: import("@playwright/test").Page, title: string) =>
  page.getByRole("button", { name: title, exact: true });

const SECTIONS = ["Types", "Special", "Regions", "Pokedexes"] as const;

/** Which sections report themselves open. */
const openSections = async (page: import("@playwright/test").Page) => {
  const states = await Promise.all(
    SECTIONS.map(async (title) => [
      title,
      await header(page, title).getAttribute("aria-expanded"),
    ] as const),
  );

  return states.filter(([, expanded]) => expanded === "true").map(([title]) => title);
};

/** Opens a section if it is not already the open one. */
const openSection = async (page: import("@playwright/test").Page, title: string) => {
  if ((await header(page, title).getAttribute("aria-expanded")) !== "true") {
    await header(page, title).click();
    await expect(header(page, title)).toHaveAttribute("aria-expanded", "true");
  }
};

test.describe("Browse sections", () => {
  // All four open at once ran the sidebar to roughly three screens
  test("opens only the section the route belongs to", async ({ page }) => {
    await page.goto("/type/grass");
    await page.waitForLoadState("networkidle");
    expect(await openSections(page)).toEqual(["Types"]);

    await page.goto("/pokedex/kanto");
    await page.waitForLoadState("networkidle");
    expect(await openSections(page)).toEqual(["Pokedexes"]);
  });

  test("opens the first section on a route no section owns", async ({ page }) => {
    for (const url of ["/", "/pokemon/1", "/search"]) {
      await page.goto(url);
      await page.waitForLoadState("networkidle");
      expect(await openSections(page), url).toEqual(["Types"]);
    }
  });

  test("opening one section closes the one that was open", async ({ page }) => {
    await page.goto("/type/grass");
    await page.waitForLoadState("networkidle");
    expect(await openSections(page)).toEqual(["Types"]);

    await header(page, "Pokedexes").click();
    await expect(header(page, "Pokedexes")).toHaveAttribute("aria-expanded", "true");

    expect(await openSections(page)).toEqual(["Pokedexes"]);
  });

  // The route only re-picks when it crosses into a different section, so a
  // deliberate choice isn't undone by moving around inside the current one.
  test("keeps a hand-picked section open while the route stays in one section", async ({
    page,
  }) => {
    await page.goto("/type/grass");
    await page.waitForLoadState("networkidle");

    await header(page, "Regions").click();
    await expect(header(page, "Regions")).toHaveAttribute("aria-expanded", "true");

    // A region link is a route in the Regions section — the pick still stands
    await page.getByRole("link", { name: /^Kanto \(\d+\)/ }).first().click();
    await page.waitForLoadState("networkidle");
    expect(await openSections(page)).toEqual(["Regions"]);

    // Crossing into another section hands over to it
    await page.goto("/pokedex/kanto");
    await page.waitForLoadState("networkidle");
    expect(await openSections(page)).toEqual(["Pokedexes"]);
  });

  test("keeps the sidebar to one scroller", async ({ page }) => {
    await page.goto("/pokedex/kanto");
    await page.waitForLoadState("networkidle");

    const scrollers = await page.evaluate(() => {
      const sidebar = document.querySelector('[class*="sidebar"]') as HTMLElement;
      return [...sidebar.querySelectorAll("*"), sidebar].filter((el) => {
        const cs = getComputedStyle(el);
        return /auto|scroll/.test(cs.overflowY) && el.scrollHeight > el.clientHeight + 1;
      }).length;
    });

    expect(scrollers).toBeLessThanOrEqual(1);
  });

  /**
   * Reads every option row in a section: where its columns start, how many rows
   * they make, and whether any label wraps or clips.
   *
   * Wrapping is the one to watch. A label with too little room grows to a second
   * line rather than overflowing, so it never trips a `scrollWidth` check — it
   * just silently knocks the second column out of step with the first.
   */
  const readRows = (page: import("@playwright/test").Page, hrefPrefix: string) =>
    page.evaluate((prefix) => {
      const links = [...document.querySelectorAll(`nav a[href^="${prefix}"]`)] as HTMLElement[];
      const shortest = Math.min(...links.map((a) => a.getBoundingClientRect().height));

      return {
        items: links.length,
        columns: [...new Set(links.map((a) => Math.round(a.getBoundingClientRect().left)))].sort(
          (a, b) => a - b,
        ),
        rows: new Set(links.map((a) => Math.round(a.getBoundingClientRect().top))).size,
        wrapped: links
          .filter((a) => a.getBoundingClientRect().height > shortest + 2)
          .map((a) => a.textContent?.trim()),
        clipped: links
          .filter((a) => a.scrollWidth > a.clientWidth + 1)
          .map((a) => a.textContent?.trim()),
      };
    }, hrefPrefix);

  test("lays the flat sections out in two columns, unwrapped", async ({ page }) => {
    await page.goto("/region/kanto");
    await page.waitForLoadState("networkidle");

    for (const [section, prefix] of [
      ["Types", "/type/"],
      ["Regions", "/region/"],
    ] as const) {
      await openSection(page, section);
      const { items, columns, rows, wrapped, clipped } = await readRows(page, prefix);

      expect(columns, section).toHaveLength(2);
      // Halved, which only holds while every label sits on one line
      expect(rows, section).toBe(Math.ceil(items / 2));
      expect(wrapped, section).toEqual([]);
      expect(clipped, section).toEqual([]);
    }
  });

  test("leaves the banded section in one column", async ({ page }) => {
    await page.goto("/pokedex/kanto");
    await page.waitForLoadState("networkidle");

    const { items, columns, rows, wrapped } = await readRows(page, "/pokedex/");

    // Region bands would leave a second column empty on the five that hold one dex
    expect(columns).toHaveLength(1);
    expect(rows).toBe(items);
    expect(wrapped).toEqual([]);
  });

  test("starts every section's first column on the same left edge", async ({ page }) => {
    await page.goto("/region/kanto");
    await page.waitForLoadState("networkidle");

    const edges: number[] = [];
    for (const [section, prefix] of [
      ["Types", "/type/"],
      ["Regions", "/region/"],
      ["Pokedexes", "/pokedex/"],
    ] as const) {
      await openSection(page, section);
      edges.push((await readRows(page, prefix)).columns[0]);
    }

    expect(new Set(edges).size).toBe(1);
  });
});
