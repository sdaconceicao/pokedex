import { test, expect } from "@playwright/test";

const VALID_EMAIL = "test@test.com";
const VALID_PASSWORD = "Test@Password123";

test.describe("Authentication", () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the main page before each test
    await page.goto("/");
  });

  test.describe("Login", () => {
    test("should display login form when clicking login button", async ({
      page,
    }) => {
      // Click the login button in the navbar
      await page.click('button:has-text("Login")');

      // Wait for modal to be fully rendered
      await page.waitForSelector("dialog[open]", { state: "visible" });

      // Verify login form is displayed
      await expect(page.locator("dialog[open] form")).toBeVisible();
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
      await page.click('button:has-text("Login")');

      // Wait for modal to be fully rendered
      await page.waitForSelector("dialog[open]", { state: "visible" });

      // Fill in credentials (using seeded test data)
      await page.getByRole("textbox", { name: "Email" }).fill(VALID_EMAIL);
      await page
        .getByRole("textbox", { name: "Password" })
        .fill(VALID_PASSWORD);

      // Submit form
      await page.click('dialog[open] button[type="submit"]:has-text("Login")');

      // Verify successful login
      await expect(
        page.locator('span:has-text("Welcome, ' + VALID_EMAIL + '")')
      ).toBeVisible();
      await expect(page.locator('button:has-text("Logout")')).toBeVisible();

      // Verify login form is hidden
      await expect(page.locator("dialog[open]")).not.toBeVisible();

      await page.click('button:has-text("Logout")');

      // Verify user is logged out

      await expect(page.getByText("Welcome, " + VALID_EMAIL)).not.toBeVisible();
    });

    test("should show error with invalid credentials", async ({ page }) => {
      // Open login form
      await page.click('button:has-text("Login")');

      // Wait for modal to be fully rendered
      await page.waitForSelector("dialog[open]", { state: "visible" });

      // Fill in invalid credentials
      await page.fill(
        'dialog[open] input[type="email"]',
        "invalid@example.com"
      );
      await page.fill('dialog[open] input[type="password"]', "wrongpassword");

      // Submit form
      await page.click('dialog[open] button[type="submit"]:has-text("Login")');

      // Verify error message appears in the dialog
      await expect(page.locator("dialog[open]")).toContainText(
        "Invalid credentials. Please try again."
      );
    });

    test("should validate required fields", async ({ page }) => {
      // Open login form
      await page.click('button:has-text("Login")');

      // Wait for modal to be fully rendered
      await page.waitForSelector("dialog[open]", { state: "visible" });

      // Try to submit without filling fields
      await page.click('dialog[open] button[type="submit"]:has-text("Login")');

      // Verify validation messages
      await expect(page.getByText("Email is required")).toBeVisible();
      await expect(page.getByText("Password is required")).toBeVisible();
    });
  });

  test.describe("Register", () => {
    test("should display register form when clicking register button", async ({
      page,
    }) => {
      // Click the register button in the navbar
      await page.click('button:has-text("Sign Up")');

      // Wait for modal to be fully rendered
      await page.waitForSelector("dialog[open]", { state: "visible" });

      // Verify register form is displayed
      await expect(page.locator("dialog[open] form")).toBeVisible();
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
      await page.click('button:has-text("Sign Up")');

      // Wait for modal to be fully rendered
      await page.waitForSelector("dialog[open]", { state: "visible" });

      // Generate unique email for test
      const uniqueEmail = `test${Date.now()}@example.com`;

      // Fill in registration form
      await page.fill('dialog[open] input[type="email"]', uniqueEmail);
      await page
        .getByRole("textbox", { name: "Password" })
        .first()
        .fill("P@ssw0rd123");
      await page
        .getByRole("textbox", { name: "Confirm Password" })
        .fill("P@ssw0rd123");

      // Submit form
      await page.click(
        'dialog[open] button[type="submit"]:has-text("Create Account")'
      );

      // Verify successful registration (should auto-login)
      await expect(
        page.locator('span:has-text("Welcome, ' + uniqueEmail + '")')
      ).toBeVisible();
      await expect(page.locator('button:has-text("Logout")')).toBeVisible();

      // Verify register form is hidden
      await expect(page.locator("dialog[open]")).not.toBeVisible();
    });

    test("should show error with existing email", async ({ page }) => {
      // Open register form
      await page.click('button:has-text("Sign Up")');

      // Wait for modal to be fully rendered
      await page.waitForSelector("dialog[open]", { state: "visible" });

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
      await page.click(
        'dialog[open] button[type="submit"]:has-text("Create Account")'
      );

      // Verify error message
      await expect(page.getByText("Email already exists")).toBeVisible();
    });

    test("should validate password confirmation", async ({ page }) => {
      // Open register form
      await page.click('button:has-text("Sign Up")');

      // Wait for modal to be fully rendered
      await page.waitForSelector("dialog[open]", { state: "visible" });

      // Fill in form with mismatched passwords
      await page
        .getByRole("textbox", { name: "Email" })
        .fill("new@example.com");
      await page
        .getByRole("textbox", { name: "Password" })
        .first()
        .fill("P@ssw0rd123");
      await page
        .getByRole("textbox", { name: "Confirm Password" })
        .fill("P@sssw0rd123");

      // Submit form
      await page.click(
        'dialog[open] button[type="submit"]:has-text("Create Account")'
      );

      // Verify validation message
      await expect(page.getByText("Passwords do not match")).toBeVisible();
    });
  });
});
