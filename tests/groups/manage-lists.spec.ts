import { expect, test, type Page } from "@playwright/test";
import {
  openGroupPopover,
  pokemonCard,
  registerFreshUser,
  submitNewList,
  toggleListSelection,
} from "../helpers/groups";

async function createTwoLists(page: Page): Promise<void> {
  await page.goto("/");
  await registerFreshUser(page);

  await page.goto("/forms/gmax");
  await page.waitForLoadState("networkidle");

  const first = await openGroupPopover(page, pokemonCard(page, 0));
  await expect(first.popover.getByRole("textbox", { name: "New list" })).toHaveValue("Favorites");
  await submitNewList(first.popover);
  await expect(first.popover).not.toBeVisible();

  const second = await openGroupPopover(page, pokemonCard(page, 1));
  await expect(second.popover.getByRole("checkbox", { name: "Favorites" })).not.toBeChecked();
  await submitNewList(second.popover, { name: "Team" });
  await expect(second.popover).not.toBeVisible();
}

test.describe("Managing saved lists", () => {
  test("editing membership through the multiselect adds one list and removes another", async ({
    page,
  }) => {
    await createTwoLists(page);

    const card = pokemonCard(page, 1);
    const { popover } = await openGroupPopover(page, card);
    const updateButton = popover.getByRole("button", { name: "Update" });

    await expect(updateButton).toBeDisabled();

    await toggleListSelection(page, popover, ["Favorites", "Team"]);
    await expect(updateButton).toBeEnabled();
    await updateButton.click();
    await expect(popover).not.toBeVisible();

    await page.getByRole("button", { name: "Account menu" }).click();
    await page.getByRole("menuitem", { name: "My lists" }).click();
    await page.waitForLoadState("networkidle");

    const favoritesLink = page.getByRole("link", { name: "View Favorites" });
    const teamLink = page.getByRole("link", { name: "View Team" });
    await expect(favoritesLink.getByText("2", { exact: true })).toBeVisible();
    await expect(teamLink.getByText("0", { exact: true })).toBeVisible();
  });

  test("renaming a list is reflected after a reload", async ({ page }) => {
    await createTwoLists(page);

    await page.goto("/groups");
    await page.waitForLoadState("networkidle");

    const favoritesField = page.getByRole("textbox", { name: "Favorites list name" });
    await favoritesField.fill("Faves");
    await favoritesField.press("Enter");
    await expect(page.getByRole("textbox", { name: "Faves list name" })).toHaveValue("Faves");

    await page.reload();
    await page.waitForLoadState("networkidle");
    await expect(page.getByRole("textbox", { name: "Faves list name" })).toHaveValue("Faves");
    await expect(page.getByRole("textbox", { name: "Favorites list name" })).toHaveCount(0);
  });

  test("choosing a different default list moves the radio", async ({ page }) => {
    await createTwoLists(page);

    await page.goto("/groups");
    await page.waitForLoadState("networkidle");

    await expect(
      page.getByRole("radio", { name: "Make Favorites the default list" }),
    ).toBeChecked();
    await expect(page.getByRole("radio", { name: "Make Team the default list" })).not.toBeChecked();

    await page.getByRole("radio", { name: "Make Team the default list" }).click({ force: true });

    await expect(page.getByRole("radio", { name: "Make Team the default list" })).toBeChecked();
    await expect(
      page.getByRole("radio", { name: "Make Favorites the default list" }),
    ).not.toBeChecked();
  });

  test("deleting a list removes its row", async ({ page }) => {
    await createTwoLists(page);

    await page.goto("/groups");
    await page.waitForLoadState("networkidle");

    await page.getByRole("button", { name: "Delete Team" }).click();

    const confirmDialog = page.getByRole("dialog");
    await expect(confirmDialog.getByRole("heading", { name: "Delete Team?" })).toBeVisible();
    await confirmDialog.getByRole("button", { name: "Delete" }).click();
    await expect(confirmDialog).not.toBeVisible();

    await expect(page.getByRole("textbox", { name: "Team list name" })).toHaveCount(0);
    await expect(page.getByRole("textbox", { name: "Favorites list name" })).toBeVisible();
  });
});
