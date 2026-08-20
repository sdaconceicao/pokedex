import { expect, test } from "@playwright/test";
import { expectLoggedIn, getAuthDialog, logout, openSignInModal } from "../helpers/auth";
import {
  cardGroupButton,
  cardName,
  groupPopover,
  pokemonCard,
  registerFreshUser,
  uniqueEmail,
} from "../helpers/groups";

const PASSWORD = "P@ssw0rd123";

test.describe("Adding to a list while signed out", () => {
  test("opens sign-up instead of the popover, then resumes the same add after registering", async ({
    page,
  }) => {
    await page.goto("/forms/mega");
    await page.waitForLoadState("networkidle");

    const card = pokemonCard(page, 0);
    const name = await cardName(card);
    await cardGroupButton(card).click();

    const dialog = getAuthDialog(page);
    await expect(dialog).toBeVisible();
    await expect(dialog.getByRole("heading", { name: "Sign In" })).toBeVisible();
    await expect(page.getByRole("dialog")).toHaveCount(1);
    await expect(groupPopover(page, name)).toHaveCount(0);

    await dialog.getByRole("button", { name: "Sign up" }).click();
    await expect(dialog.getByRole("heading", { name: "Create Account" })).toBeVisible();

    const email = uniqueEmail("e2e-groups-resume");
    await dialog.getByLabel("Email").fill(email);
    await dialog.getByPlaceholder("Enter your password").fill(PASSWORD);
    await dialog.getByPlaceholder("Confirm your password").fill(PASSWORD);
    await dialog.getByRole("button", { name: "Create Account" }).click();

    await expect(page.getByRole("dialog")).toHaveCount(1);
    await expect(groupPopover(page, name)).toBeVisible();
  });

  test("does not resume the popover after the auth dialog is dismissed without signing in", async ({
    page,
  }) => {
    await page.goto("/");
    const { email, password } = await registerFreshUser(page);
    await logout(page);

    await page.goto("/forms/mega");
    await page.waitForLoadState("networkidle");

    const card = pokemonCard(page, 0);
    await cardGroupButton(card).click();

    const dialog = getAuthDialog(page);
    await expect(dialog).toBeVisible();

    await dialog.getByRole("button", { name: "Close" }).click();
    await expect(page.getByRole("dialog")).toHaveCount(0);

    await openSignInModal(page);
    const signInDialog = getAuthDialog(page);
    await signInDialog.getByLabel("Email").fill(email);
    await signInDialog.getByPlaceholder("Enter your password").fill(password);
    await signInDialog.getByRole("button", { name: "Sign In" }).click();

    await expectLoggedIn(page);
    await expect(page.getByRole("dialog")).toHaveCount(0);
  });
});
