import { test, expect } from "@playwright/test";

const VALID_EMAIL = "test@test.com";
const VALID_PASSWORD = "Test@Password123";

test.describe("User Login", () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the main page before each test
    await page.goto("/");
  });

  test("should display login form when clicking login button", async ({
    page,
  }) => {
    // Click the login button in the navbar
    await page.getByRole("button", { name: "Login" }).click();

    // Wait for modal to be fully rendered
    await expect(page.getByRole("dialog")).toBeVisible();

    // Verify login form is displayed
    await expect(page.getByText("Email")).toBeVisible();
    await expect(page.getByText("Password")).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Login" }).last()
    ).toBeVisible();
  });

  test("should successfully login with valid credentials and let user logout", async ({
    page,
  }) => {
    // Open login form
    await page.getByRole("button", { name: "Login" }).click();

    // Wait for modal to be fully rendered
    await expect(page.getByRole("dialog")).toBeVisible();

    // Fill in credentials (using seeded test data)
    await page.getByRole("textbox", { name: "Email" }).fill(VALID_EMAIL);
    await page.getByRole("textbox", { name: "Password" }).fill(VALID_PASSWORD);

    // Submit form
    await page.getByRole("button", { name: "Login" }).last().click();

    // Verify successful login
    await expect(page.getByText("Welcome, " + VALID_EMAIL)).toBeVisible();
    await expect(page.getByRole("button", { name: "Logout" })).toBeVisible();

    // Verify login form is hidden
    await expect(page.getByRole("dialog")).not.toBeVisible();

    await page.getByRole("button", { name: "Logout" }).click();

    // Verify user is logged out
    await expect(page.getByText("Welcome, " + VALID_EMAIL)).not.toBeVisible();
  });

  test("should show error with invalid credentials", async ({ page }) => {
    // Open login form
    await page.getByRole("button", { name: "Login" }).click();

    // Wait for modal to be fully rendered
    await expect(page.getByRole("dialog")).toBeVisible();

    // Fill in invalid credentials
    await page
      .getByRole("textbox", { name: "Email" })
      .fill("invalid@example.com");
    await page.getByRole("textbox", { name: "Password" }).fill("wrongpassword");

    // Submit form
    await page.getByRole("button", { name: "Login" }).last().click();

    // Verify error message appears in the dialog
    await expect(page.getByRole("dialog")).toContainText(
      "Invalid credentials. Please try again."
    );
  });

  test("should validate required fields", async ({ page }) => {
    // Open login form
    await page.getByRole("button", { name: "Login" }).click();

    // Wait for modal to be fully rendered
    await expect(page.getByRole("dialog")).toBeVisible();

    // Try to submit without filling fields
    await page.getByRole("button", { name: "Login" }).last().click();

    // Verify validation messages
    await expect(page.getByText("Email is required")).toBeVisible();
    await expect(page.getByText("Password is required")).toBeVisible();
  });
});
