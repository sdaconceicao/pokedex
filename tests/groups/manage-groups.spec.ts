import { expect, test, type Page } from "@playwright/test";
import {
  groupRow,
  openGroupPopover,
  pokemonCard,
  registerFreshUser,
  submitNewGroup,
  toggleGroupSelection,
} from "../helpers/groups";

/** Registers a fresh user and gives them "Favorites" and "Team", each holding
 *  one of the two Pokemon on /forms/gmax. */
async function createTwoGroups(page: Page): Promise<void> {
  await page.goto("/");
  await registerFreshUser(page);

  await page.goto("/forms/gmax");
  await page.waitForLoadState("networkidle");

  const first = await openGroupPopover(page, pokemonCard(page, 0));
  await expect(first.popover.getByRole("textbox", { name: "New group" })).toHaveValue("Favorites");
  await submitNewGroup(first.popover);
  await expect(first.popover).not.toBeVisible();

  const second = await openGroupPopover(page, pokemonCard(page, 1));
  await expect(second.popover.getByRole("checkbox", { name: "Favorites" })).not.toBeChecked();
  await submitNewGroup(second.popover, { name: "Team" });
  await expect(second.popover).not.toBeVisible();
}

async function gotoGroups(page: Page): Promise<void> {
  await page.goto("/groups");
  await page.waitForLoadState("networkidle");
  await expect(page.getByRole("heading", { level: 1, name: "Your groups" })).toBeVisible();
}

test.describe("Managing saved groups", () => {
  test("editing membership through the multiselect adds one group and removes another", async ({
    page,
  }) => {
    await createTwoGroups(page);

    const { popover } = await openGroupPopover(page, pokemonCard(page, 1));
    const updateButton = popover.getByRole("button", { name: "Update" });

    await expect(updateButton).toBeDisabled();

    await toggleGroupSelection(page, popover, ["Favorites", "Team"]);
    await expect(updateButton).toBeEnabled();
    await updateButton.click();
    await expect(popover).not.toBeVisible();

    await page.getByRole("button", { name: "Account menu" }).click();
    await page.getByRole("menuitem", { name: "My groups" }).click();
    await page.waitForLoadState("networkidle");

    await expect(groupRow(page, "Favorites").getByText("2", { exact: true })).toBeVisible();
    await expect(groupRow(page, "Team").getByText("0", { exact: true })).toBeVisible();
  });

  test("rows are alphabetical and only the default one is tagged", async ({ page }) => {
    await createTwoGroups(page);
    await gotoGroups(page);

    // Scoped to the page's own section: the sidebar's browse nav is also a
    // list of links, so an unscoped listitem query picks those up too.
    const section = page
      .locator("section")
      .filter({ has: page.getByRole("heading", { level: 1, name: "Your groups" }) });
    await expect(section.getByRole("listitem").getByRole("link")).toHaveText([
      "Favorites",
      "Team",
    ]);

    // "Favorites" was created first, so it became the default automatically.
    await expect(groupRow(page, "Favorites").getByText("Default")).toBeVisible();
    await expect(groupRow(page, "Team").getByText("Default")).toHaveCount(0);
  });

  test("renaming through edit mode is reflected after a reload", async ({ page }) => {
    await createTwoGroups(page);
    await gotoGroups(page);

    await page.getByRole("button", { name: "Edit Favorites" }).click();

    const field = page.getByRole("textbox", { name: "Favorites group name" });
    await expect(field).toHaveValue("Favorites");
    await field.fill("Faves");
    await page.getByRole("button", { name: "Save" }).click();

    await expect(groupRow(page, "Faves")).toBeVisible();

    await page.reload();
    await page.waitForLoadState("networkidle");
    await expect(groupRow(page, "Faves")).toBeVisible();
    await expect(page.getByRole("link", { name: "Favorites", exact: true })).toHaveCount(0);
  });

  test("cancelling edit mode discards the change", async ({ page }) => {
    await createTwoGroups(page);
    await gotoGroups(page);

    await page.getByRole("button", { name: "Edit Team" }).click();
    await page.getByRole("textbox", { name: "Team group name" }).fill("Discarded");
    await page.getByRole("button", { name: "Cancel" }).click();

    await expect(groupRow(page, "Team")).toBeVisible();
    await expect(page.getByRole("link", { name: "Discarded", exact: true })).toHaveCount(0);
  });

  test("promoting another group to default moves the tag", async ({ page }) => {
    await createTwoGroups(page);
    await gotoGroups(page);

    // The already-default group is offered no default checkbox at all: the API
    // ignores isDefault: false, so there is no un-defaulting to offer -- a
    // different group has to be promoted instead.
    await page.getByRole("button", { name: "Edit Favorites" }).click();
    await expect(page.getByRole("textbox", { name: "Favorites group name" })).toBeVisible();
    await expect(
      page.getByRole("checkbox", { name: "Make this my default group" }),
    ).toHaveCount(0);
    await page.getByRole("button", { name: "Cancel" }).click();

    await page.getByRole("button", { name: "Edit Team" }).click();
    await page
      .getByRole("checkbox", { name: "Make this my default group" })
      .click({ force: true });
    await page.getByRole("button", { name: "Save" }).click();

    await expect(groupRow(page, "Team").getByText("Default")).toBeVisible();
    await expect(groupRow(page, "Favorites").getByText("Default")).toHaveCount(0);
  });

  test("clicking a row opens that group", async ({ page }) => {
    await createTwoGroups(page);
    await gotoGroups(page);

    await groupRow(page, "Team").getByRole("link", { name: "Team", exact: true }).click();
    await page.waitForLoadState("networkidle");

    await expect(page).toHaveURL(/\/groups\/.+/);
    await expect(page.getByRole("heading", { level: 1, name: "Team" })).toBeVisible();
  });

  test("deleting a group removes its row", async ({ page }) => {
    await createTwoGroups(page);
    await gotoGroups(page);

    await page.getByRole("button", { name: "Delete Team" }).click();

    const confirmDialog = page.getByRole("dialog");
    await expect(confirmDialog.getByRole("heading", { name: "Delete Team?" })).toBeVisible();
    await confirmDialog.getByRole("button", { name: "Delete" }).click();
    await expect(confirmDialog).not.toBeVisible();

    await expect(page.getByRole("link", { name: "Team", exact: true })).toHaveCount(0);
    await expect(groupRow(page, "Favorites")).toBeVisible();
  });
});
