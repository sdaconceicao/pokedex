import { expect, test } from "@playwright/test";
import {
  cardGroupButton,
  openGroupPopover,
  pokemonCard,
  registerFreshUser,
  groupRow,
  submitNewGroup,
} from "../helpers/groups";

test.describe("Saving a Pokemon to a group", () => {
  test("creates a first group from a card's + and the group shows up on /groups", async ({
    page,
  }) => {
    await page.goto("/");
    await registerFreshUser(page);

    await page.goto("/pokedex/kanto");
    await page.waitForLoadState("networkidle");

    const card = pokemonCard(page, 0);
    const { popover, name } = await openGroupPopover(page, card);

    await expect(popover.getByRole("combobox", { name: "Your groups" })).toHaveCount(0);
    await expect(popover.getByRole("textbox", { name: "New group" })).toHaveValue("Favorites");
    await expect(
      popover.getByRole("checkbox", { name: "Make this my default group" }),
    ).toBeChecked();

    await submitNewGroup(popover);
    await expect(popover).not.toBeVisible();

    await expect(cardGroupButton(card)).toHaveAccessibleName(`Manage ${name}'s groups`);

    await page.getByRole("button", { name: "Account menu" }).click();
    await page.getByRole("menuitem", { name: "My groups" }).click();
    await page.waitForLoadState("networkidle");
    await expect(page).toHaveURL(/\/groups$/);
    await expect(page.getByRole("heading", { level: 1, name: "Your groups" })).toBeVisible();

    const row = groupRow(page, "Favorites");
    await expect(row).toBeVisible();
    await expect(row.getByText("1", { exact: true })).toBeVisible();
    // The first group a user creates is made their default automatically.
    await expect(row.getByText("Default")).toBeVisible();

    await row.getByRole("link", { name: "Favorites", exact: true }).click();
    await page.waitForLoadState("networkidle");
    await expect(page).toHaveURL(/\/groups\/.+/);
    await expect(page.getByRole("heading", { level: 1, name: "Favorites" })).toBeVisible();

    const savedCards = page.getByTestId("pokemon-card");
    await expect(savedCards).toHaveCount(1);
    await expect(savedCards.first().getByRole("heading", { level: 3 })).toHaveText(name);
  });
});
