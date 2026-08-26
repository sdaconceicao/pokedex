import { test, expect } from "@playwright/test";
import {
  getAuthDialog,
  getToast,
  openRegisterForm,
  openSignInModal,
} from "../helpers/auth";

const VALID_EMAIL = "test@test.com";
const SUBMITTED_NOTICE =
  "Check your email — we have sent you a message with next steps";

test.describe("User Registration", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("should display register form when switching from sign in", async ({
    page,
  }) => {
    await openRegisterForm(page);

    const dialog = getAuthDialog(page);
    await expect(dialog.getByLabel("Email")).toBeVisible();
    await expect(dialog.getByPlaceholder("Enter your password")).toBeVisible();
    await expect(dialog.getByPlaceholder("Confirm your password")).toBeVisible();
    await expect(
      dialog.getByRole("button", { name: "Create Account" })
    ).toBeVisible();
    await expect(dialog.getByRole("button", { name: "Sign in" })).toBeVisible();
  });

  test("should show a verification notice after registering", async ({
    page,
  }) => {
    await openRegisterForm(page);

    const dialog = getAuthDialog(page);
    const uniqueEmail = `test${Date.now()}@example.com`;

    await dialog.getByLabel("Email").fill(uniqueEmail);
    await dialog.getByPlaceholder("Enter your password").fill("P@ssw0rd123");
    await dialog.getByPlaceholder("Confirm your password").fill("P@ssw0rd123");
    await dialog.getByRole("button", { name: "Create Account" }).click();

    // Registration no longer authenticates: the account cannot sign in until
    // the emailed link is used, so the dialog stays open with the notice.
    await expect(getToast(page).getByText(SUBMITTED_NOTICE)).toBeVisible();
    // Success closes the modal; the notice lives in the toast instead.
    await expect(page.getByRole("dialog")).not.toBeVisible();
    await expect(
      page.getByRole("button", { name: "Account menu" })
    ).not.toBeVisible();
  });

  test("should refuse sign in for an unverified account", async ({ page }) => {
    await openRegisterForm(page);

    const dialog = getAuthDialog(page);
    const uniqueEmail = `test${Date.now()}@example.com`;

    await dialog.getByLabel("Email").fill(uniqueEmail);
    await dialog.getByPlaceholder("Enter your password").fill("P@ssw0rd123");
    await dialog.getByPlaceholder("Confirm your password").fill("P@ssw0rd123");
    await dialog.getByRole("button", { name: "Create Account" }).click();

    await page.reload();
    await openSignInModal(page);

    const signIn = getAuthDialog(page);
    await signIn.getByLabel("Email").fill(uniqueEmail);
    await signIn.getByPlaceholder("Enter your password").fill("P@ssw0rd123");
    await signIn.getByRole("button", { name: "Sign In" }).click();

    await expect(getToast(page).getByText("Could not sign in")).toBeVisible();
  });

  test("shows the identical notice for an already-registered email", async ({
    page,
  }) => {
    await openRegisterForm(page);

    const dialog = getAuthDialog(page);
    await dialog.getByLabel("Email").fill(VALID_EMAIL);
    await dialog.getByPlaceholder("Enter your password").fill("P@ssw0rd123");
    await dialog.getByPlaceholder("Confirm your password").fill("P@ssw0rd123");
    await dialog.getByRole("button", { name: "Create Account" }).click();

    // VALID_EMAIL is the seeded, verified fixture. The reply must be
    // indistinguishable from a brand-new address — the difference goes only
    // to the inbox.
    // Indistinguishable from a brand-new address — same toast, same close.
    await expect(getToast(page).getByText(SUBMITTED_NOTICE)).toBeVisible();
    await expect(page.getByRole("dialog")).not.toBeVisible();
  });

  test("should validate password confirmation", async ({ page }) => {
    await openRegisterForm(page);

    const dialog = getAuthDialog(page);
    await dialog.getByLabel("Email").fill("new@example.com");
    await dialog.getByPlaceholder("Enter your password").fill("P@ssw0rd123");
    await dialog.getByPlaceholder("Confirm your password").fill("P@sssw0rd123");
    await dialog.getByRole("button", { name: "Create Account" }).click();

    await expect(dialog.getByText("Passwords do not match")).toBeVisible();
  });
});
