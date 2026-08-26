import { test, expect } from "@playwright/test";
import {
  getAuthDialog,
  getToast,
  openSignInModal,
  expectLoggedIn,
  logout,
} from "../helpers/auth";

const VALID_EMAIL = "test@test.com";
const VALID_PASSWORD = "Test@Password123";

test.describe("User Login", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("should display login form when clicking sign in button", async ({
    page,
  }) => {
    await openSignInModal(page);

    const dialog = getAuthDialog(page);
    await expect(dialog.getByRole("heading", { name: "Sign In" })).toBeVisible();
    await expect(dialog.getByLabel("Email")).toBeVisible();
    await expect(dialog.getByPlaceholder("Enter your password")).toBeVisible();
    await expect(dialog.getByRole("button", { name: "Sign In" })).toBeVisible();
    await expect(dialog.getByRole("button", { name: "Sign up" })).toBeVisible();
  });

  test("should successfully login with valid credentials and let user logout", async ({
    page,
  }) => {
    await openSignInModal(page);

    const dialog = getAuthDialog(page);
    await dialog.getByLabel("Email").fill(VALID_EMAIL);
    await dialog.getByPlaceholder("Enter your password").fill(VALID_PASSWORD);
    await dialog.getByRole("button", { name: "Sign In" }).click();

    await expectLoggedIn(page);
    await expect(page.getByRole("dialog")).not.toBeVisible();

    await logout(page);
  });

  test("should show error with invalid credentials", async ({ page }) => {
    await openSignInModal(page);

    const dialog = getAuthDialog(page);
    await dialog.getByLabel("Email").fill("invalid@example.com");
    await dialog.getByPlaceholder("Enter your password").fill("wrongpassword");
    await dialog.getByRole("button", { name: "Sign In" }).click();

    // Failure toasts now; the modal stays open so the user can retry.
    await expect(getToast(page).getByText("Could not sign in")).toBeVisible();
    await expect(dialog).toBeVisible();
  });

  test("should validate required fields", async ({ page }) => {
    await openSignInModal(page);

    const dialog = getAuthDialog(page);
    await dialog.getByRole("button", { name: "Sign In" }).click();

    await expect(dialog.getByText("Email is required")).toBeVisible();
    await expect(dialog.getByText("Password is required")).toBeVisible();
  });
});
