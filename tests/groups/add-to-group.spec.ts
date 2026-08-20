import { expect, test } from "@playwright/test";
import {
  cardGroupButton,
  openGroupPopover,
  pokemonCard,
  registerFreshUser,
  submitNewList,
} from "../helpers/groups";

test.describe("Saving a Pokemon to a list", () => {
  test("creates a first list from a card's + and the list shows up on /groups", async ({
    page,
  }) => {
    await page.goto("/");
    await registerFreshUser(page);

    await page.goto("/pokedex/kanto");
    await page.waitForLoadState("networkidle");

    const card = pokemonCard(page, 0);
    const { popover, name } = await openGroupPopover(page, card);

    await expect(popover.getByRole("combobox", { name: "Your lists" })).toHaveCount(0);
    await expect(popover.getByRole("textbox", { name: "New list" })).toHaveValue("Favorites");
    await expect(
      popover.getByRole("checkbox", { name: "Make this my default list" }),
    ).toBeChecked();

    await submitNewList(popover);
    await expect(popover).not.toBeVisible();

    await expect(cardGroupButton(card)).toHaveAccessibleName(`Manage ${name}'s lists`);

    await page.getByRole("button", { name: "Account menu" }).click();
    await page.getByRole("menuitem", { name: "My lists" }).click();
    await page.waitForLoadState("networkidle");
    await expect(page).toHaveURL(/\/groups$/);
    await expect(page.getByRole("heading", { level: 1, name: "Your lists" })).toBeVisible();

    const favoritesLink = page.getByRole("link", { name: "View Favorites" });
    await expect(favoritesLink).toBeVisible();
    await expect(favoritesLink.getByText("1", { exact: true })).toBeVisible();

    await favoritesLink.click();
    await page.waitForLoadState("networkidle");
    await expect(page).toHaveURL(/\/groups\/.+/);
    await expect(page.getByRole("heading", { level: 1, name: "Favorites" })).toBeVisible();

    const savedCards = page.getByTestId("pokemon-card");
    await expect(savedCards).toHaveCount(1);
    await expect(savedCards.first().getByRole("heading", { level: 3 })).toHaveText(name);
  });
});
