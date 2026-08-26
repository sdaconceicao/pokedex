import { expect, test } from "@playwright/test";
import {
  expectLoggedIn,
  getAuthDialog,
  getToast,
  logout,
  openSignInModal,
} from "../helpers/auth";
import {
  cardGroupButton,
  cardName,
  groupPopover,
  pokemonCard,
  registerFreshUser,
  uniqueEmail,
} from "../helpers/groups";

const PASSWORD = "P@ssw0rd123";
const SUBMITTED_NOTICE =
  "Check your email — we have sent you a message with next steps";

test.describe("Adding to a group while signed out", () => {
  test("opens sign-up instead of the popover, and does not resume the add after registering", async ({
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

    // Registration no longer signs the user in, so the modal closes with a
    // verification notice and AddToGroupProvider drops the pending add. The
    // user has to verify, sign in, and start the add again.
    await expect(getToast(page).getByText(SUBMITTED_NOTICE)).toBeVisible();
    await expect(page.getByRole("dialog")).toHaveCount(0);
    await expect(groupPopover(page, name)).toHaveCount(0);
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
