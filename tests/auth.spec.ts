import { test, expect } from "@playwright/test";

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
      await expect(
        page.locator('dialog[open] label:has-text("Email")')
      ).toBeVisible();
      await expect(
        page.locator('dialog[open] label:has-text("Password")')
      ).toBeVisible();
      await expect(
        page.locator('dialog[open] button[type="submit"]:has-text("Login")')
      ).toBeVisible();
    });

    test("should successfully login with valid credentials", async ({
      page,
    }) => {
      // Open login form
      await page.click('button:has-text("Login")');

      // Wait for modal to be fully rendered
      await page.waitForSelector("dialog[open]", { state: "visible" });

      // Fill in credentials (using seeded test data)
      await page.fill('dialog[open] input[type="email"]', "test@test.com");
      await page.fill('dialog[open] input[type="password"]', "test");

      // Submit form
      await page.click('dialog[open] button[type="submit"]:has-text("Login")');

      // Verify successful login
      await expect(
        page.locator('span:has-text("Welcome, test@test.com")')
      ).toBeVisible();
      await expect(page.locator('button:has-text("Logout")')).toBeVisible();

      // Verify login form is hidden
      await expect(page.locator("dialog[open]")).not.toBeVisible();
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

      // Verify error message
      await expect(
        page.locator('dialog[open] div:has-text("Invalid credentials")')
      ).toBeVisible();
    });

    test("should validate required fields", async ({ page }) => {
      // Open login form
      await page.click('button:has-text("Login")');

      // Wait for modal to be fully rendered
      await page.waitForSelector("dialog[open]", { state: "visible" });

      // Try to submit without filling fields
      await page.click('dialog[open] button[type="submit"]:has-text("Login")');

      // Verify validation messages
      await expect(
        page.locator('dialog[open] div:has-text("Email is required")')
      ).toBeVisible();
      await expect(
        page.locator('dialog[open] div:has-text("Password is required")')
      ).toBeVisible();
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
      await expect(
        page.locator('dialog[open] label:has-text("Email")')
      ).toBeVisible();
      await expect(
        page.locator('dialog[open] label:has-text("Password")')
      ).toBeVisible();
      await expect(
        page.locator('dialog[open] label:has-text("Confirm Password")')
      ).toBeVisible();
      await expect(
        page.locator(
          'dialog[open] button[type="submit"]:has-text("Create Account")'
        )
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
      await page.fill('dialog[open] input[type="password"]', "password123");
      await page.fill(
        'dialog[open] input[type="password"]:nth-of-type(2)',
        "password123"
      );

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
      await page.fill('dialog[open] input[type="email"]', "test@test.com");
      await page.fill('dialog[open] input[type="password"]', "test");
      await page.fill(
        'dialog[open] input[type="password"]:nth-of-type(2)',
        "test"
      );

      // Submit form
      await page.click(
        'dialog[open] button[type="submit"]:has-text("Create Account")'
      );

      // Verify error message
      await expect(
        page.locator('dialog[open] div:has-text("Email already exists")')
      ).toBeVisible();
    });

    test("should validate password confirmation", async ({ page }) => {
      // Open register form
      await page.click('button:has-text("Sign Up")');

      // Wait for modal to be fully rendered
      await page.waitForSelector("dialog[open]", { state: "visible" });

      // Fill in form with mismatched passwords
      await page.fill('dialog[open] input[type="email"]', "new@example.com");
      await page.fill('dialog[open] input[type="password"]', "password123");
      await page.fill(
        'dialog[open] input[type="password"]:nth-of-type(2)',
        "differentpassword"
      );

      // Submit form
      await page.click(
        'dialog[open] button[type="submit"]:has-text("Create Account")'
      );

      // Verify validation message
      await expect(
        page.locator('dialog[open] div:has-text("Passwords do not match")')
      ).toBeVisible();
    });
  });

  test.describe("Logout", () => {
    test("should successfully logout user", async ({ page }) => {
      // First login
      await page.click('button:has-text("Login")');
      await page.waitForSelector("dialog[open]", { state: "visible" });
      await page.fill('dialog[open] input[type="email"]', "test@example.com");
      await page.fill('dialog[open] input[type="password"]', "password123");
      await page.click('dialog[open] button[type="submit"]:has-text("Login")');

      // Wait for login to complete
      await expect(
        page.locator('span:has-text("Welcome, test@example.com")')
      ).toBeVisible();

      // Logout
      await page.click('button:has-text("Logout")');

      // Verify user is logged out
      await expect(page.locator('button:has-text("Login")')).toBeVisible();
      await expect(page.locator('button:has-text("Sign Up")')).toBeVisible();
      await expect(
        page.locator('span:has-text("Welcome, test@example.com")')
      ).not.toBeVisible();
    });
  });

  test.describe("Authentication State", () => {
    test("should persist login state across page refresh", async ({ page }) => {
      // Login first
      await page.click('button:has-text("Login")');
      await page.waitForSelector("dialog[open]", { state: "visible" });
      await page.fill('dialog[open] input[type="email"]', "test@example.com");
      await page.fill('dialog[open] input[type="password"]', "password123");
      await page.click('dialog[open] button[type="submit"]:has-text("Login")');

      // Wait for login to complete
      await expect(
        page.locator('span:has-text("Welcome, test@example.com")')
      ).toBeVisible();

      // Refresh page
      await page.reload();

      // Verify user is still logged in
      await expect(
        page.locator('span:has-text("Welcome, test@example.com")')
      ).toBeVisible();
      await expect(page.locator('button:has-text("Logout")')).toBeVisible();
    });

    test("should redirect to login for protected routes when not authenticated", async ({
      page,
    }) => {
      // Try to access a protected route (like user profile)
      await page.goto("/profile");

      // Should redirect to login or show login form
      await expect(page.locator("form")).toBeVisible();
    });
  });
});
