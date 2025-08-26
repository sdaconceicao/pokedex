import { test, expect } from "@playwright/test";

const VALID_EMAIL = "test@test.com";

test.describe("User Registration", () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the main page before each test
    await page.goto("/");
  });

  test("should display register form when clicking register button", async ({
    page,
  }) => {
    // Click the register button in the navbar
    await page.getByRole("button", { name: "Sign Up" }).click();

    // Wait for modal to be fully rendered
    await expect(page.getByRole("dialog")).toBeVisible();

    // Verify register form is displayed
    await expect(page.getByText("Email")).toBeVisible();
    await expect(page.getByText("Password").first()).toBeVisible();
    await expect(page.getByText("Confirm Password")).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Create Account" })
    ).toBeVisible();
  });

  test("should successfully register with valid credentials", async ({
    page,
  }) => {
    // Open register form
    await page.getByRole("button", { name: "Sign Up" }).click();

    // Wait for modal to be fully rendered
    await expect(page.getByRole("dialog")).toBeVisible();

    // Generate unique email for test
    const uniqueEmail = `test${Date.now()}@example.com`;

    // Fill in registration form
    await page.getByRole("textbox", { name: "Email" }).fill(uniqueEmail);
    await page
      .getByRole("textbox", { name: "Password" })
      .first()
      .fill("P@ssw0rd123");
    await page
      .getByRole("textbox", { name: "Confirm Password" })
      .fill("P@ssw0rd123");

    // Submit form
    await page.getByRole("button", { name: "Create Account" }).click();

    // Verify successful registration (should auto-login)
    await expect(page.getByText("Welcome, " + uniqueEmail)).toBeVisible();
    await expect(page.getByRole("button", { name: "Logout" })).toBeVisible();

    // Verify register form is hidden
    await expect(page.getByRole("dialog")).not.toBeVisible();
  });

  test("should show error with existing email", async ({ page }) => {
    // Open register form
    await page.getByRole("button", { name: "Sign Up" }).click();

    // Wait for modal to be fully rendered
    await expect(page.getByRole("dialog")).toBeVisible();

    // Try to register with existing email (from seeded data)
    await page.getByRole("textbox", { name: "Email" }).fill(VALID_EMAIL);
    await page
      .getByRole("textbox", { name: "Password" })
      .first()
      .fill("P@ssw0rd123");
    await page
      .getByRole("textbox", { name: "Confirm Password" })
      .fill("P@ssw0rd123");

    // Submit form
    await page.getByRole("button", { name: "Create Account" }).click();

    // Verify error message
    await expect(page.getByText("Email already exists")).toBeVisible();
  });

  test("should validate password confirmation", async ({ page }) => {
    // Open register form
    await page.getByRole("button", { name: "Sign Up" }).click();

    // Wait for modal to be fully rendered
    await expect(page.getByRole("dialog")).toBeVisible();

    // Fill in form with mismatched passwords
    await page.getByRole("textbox", { name: "Email" }).fill("new@example.com");
    await page
      .getByRole("textbox", { name: "Password" })
      .first()
      .fill("P@ssw0rd123");
    await page
      .getByRole("textbox", { name: "Confirm Password" })
      .fill("P@sssw0rd123");

    // Submit form
    await page.getByRole("button", { name: "Create Account" }).click();

    // Verify validation message
    await expect(page.getByText("Passwords do not match")).toBeVisible();
  });
});
