import { test, expect } from "@playwright/test";
import {
  getAuthDialog,
  openRegisterForm,
  expectLoggedIn,
} from "../helpers/auth";

const VALID_EMAIL = "test@test.com";

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

  test("should successfully register with valid credentials", async ({
    page,
  }) => {
    await openRegisterForm(page);

    const dialog = getAuthDialog(page);
    const uniqueEmail = `test${Date.now()}@example.com`;

    await dialog.getByLabel("Email").fill(uniqueEmail);
    await dialog.getByPlaceholder("Enter your password").fill("P@ssw0rd123");
    await dialog.getByPlaceholder("Confirm your password").fill("P@ssw0rd123");
    await dialog.getByRole("button", { name: "Create Account" }).click();

    await expectLoggedIn(page);
    await expect(page.getByRole("dialog")).not.toBeVisible();
  });

  test("should show error with existing email", async ({ page }) => {
    await openRegisterForm(page);

    const dialog = getAuthDialog(page);
    await dialog.getByLabel("Email").fill(VALID_EMAIL);
    await dialog.getByPlaceholder("Enter your password").fill("P@ssw0rd123");
    await dialog.getByPlaceholder("Confirm your password").fill("P@ssw0rd123");
    await dialog.getByRole("button", { name: "Create Account" }).click();

    await expect(
      dialog.getByText("An account with this email already exists.")
    ).toBeVisible();
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
