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
      await page.click('[data-testid="login-button"]');

      // Verify login form is displayed
      await expect(page.locator('[data-testid="login-form"]')).toBeVisible();
      await expect(page.locator('[data-testid="email-input"]')).toBeVisible();
      await expect(
        page.locator('[data-testid="password-input"]')
      ).toBeVisible();
      await expect(page.locator('[data-testid="login-submit"]')).toBeVisible();
    });

    test("should successfully login with valid credentials", async ({
      page,
    }) => {
      // Open login form
      await page.click('[data-testid="login-button"]');

      // Fill in credentials (using seeded test data)
      await page.fill('[data-testid="email-input"]', "test@example.com");
      await page.fill('[data-testid="password-input"]', "password123");

      // Submit form
      await page.click('[data-testid="login-submit"]');

      // Verify successful login
      await expect(page.locator('[data-testid="user-menu"]')).toBeVisible();
      await expect(page.locator('[data-testid="logout-button"]')).toBeVisible();

      // Verify login form is hidden
      await expect(
        page.locator('[data-testid="login-form"]')
      ).not.toBeVisible();
    });

    test("should show error with invalid credentials", async ({ page }) => {
      // Open login form
      await page.click('[data-testid="login-button"]');

      // Fill in invalid credentials
      await page.fill('[data-testid="email-input"]', "invalid@example.com");
      await page.fill('[data-testid="password-input"]', "wrongpassword");

      // Submit form
      await page.click('[data-testid="login-submit"]');

      // Verify error message
      await expect(page.locator('[data-testid="error-message"]')).toBeVisible();
      await expect(page.locator('[data-testid="error-message"]')).toContainText(
        "Invalid credentials"
      );
    });

    test("should validate required fields", async ({ page }) => {
      // Open login form
      await page.click('[data-testid="login-button"]');

      // Try to submit without filling fields
      await page.click('[data-testid="login-submit"]');

      // Verify validation messages
      await expect(page.locator('[data-testid="email-error"]')).toBeVisible();
      await expect(
        page.locator('[data-testid="password-error"]')
      ).toBeVisible();
    });
  });

  test.describe("Register", () => {
    test("should display register form when clicking register button", async ({
      page,
    }) => {
      // Click the register button in the navbar
      await page.click('[data-testid="register-button"]');

      // Verify register form is displayed
      await expect(page.locator('[data-testid="register-form"]')).toBeVisible();
      await expect(page.locator('[data-testid="email-input"]')).toBeVisible();
      await expect(
        page.locator('[data-testid="password-input"]')
      ).toBeVisible();
      await expect(
        page.locator('[data-testid="confirm-password-input"]')
      ).toBeVisible();
      await expect(
        page.locator('[data-testid="register-submit"]')
      ).toBeVisible();
    });

    test("should successfully register with valid credentials", async ({
      page,
    }) => {
      // Open register form
      await page.click('[data-testid="register-button"]');

      // Generate unique email for test
      const uniqueEmail = `test${Date.now()}@example.com`;

      // Fill in registration form
      await page.fill('[data-testid="email-input"]', uniqueEmail);
      await page.fill('[data-testid="password-input"]', "password123");
      await page.fill('[data-testid="confirm-password-input"]', "password123");

      // Submit form
      await page.click('[data-testid="register-submit"]');

      // Verify successful registration (should auto-login)
      await expect(page.locator('[data-testid="user-menu"]')).toBeVisible();
      await expect(page.locator('[data-testid="logout-button"]')).toBeVisible();

      // Verify register form is hidden
      await expect(
        page.locator('[data-testid="register-form"]')
      ).not.toBeVisible();
    });

    test("should show error with existing email", async ({ page }) => {
      // Open register form
      await page.click('[data-testid="register-button"]');

      // Try to register with existing email (from seeded data)
      await page.fill('[data-testid="email-input"]', "test@example.com");
      await page.fill('[data-testid="password-input"]', "password123");
      await page.fill('[data-testid="confirm-password-input"]', "password123");

      // Submit form
      await page.click('[data-testid="register-submit"]');

      // Verify error message
      await expect(page.locator('[data-testid="error-message"]')).toBeVisible();
      await expect(page.locator('[data-testid="error-message"]')).toContainText(
        "Email already exists"
      );
    });

    test("should validate password confirmation", async ({ page }) => {
      // Open register form
      await page.click('[data-testid="register-button"]');

      // Fill in form with mismatched passwords
      await page.fill('[data-testid="email-input"]', "new@example.com");
      await page.fill('[data-testid="password-input"]', "password123");
      await page.fill(
        '[data-testid="confirm-password-input"]',
        "differentpassword"
      );

      // Submit form
      await page.click('[data-testid="register-submit"]');

      // Verify validation message
      await expect(
        page.locator('[data-testid="confirm-password-error"]')
      ).toBeVisible();
      await expect(
        page.locator('[data-testid="confirm-password-error"]')
      ).toContainText("Passwords do not match");
    });
  });

  test.describe("Logout", () => {
    test("should successfully logout user", async ({ page }) => {
      // First login
      await page.click('[data-testid="login-button"]');
      await page.fill('[data-testid="email-input"]', "test@example.com");
      await page.fill('[data-testid="password-input"]', "password123");
      await page.click('[data-testid="login-submit"]');

      // Wait for login to complete
      await expect(page.locator('[data-testid="user-menu"]')).toBeVisible();

      // Logout
      await page.click('[data-testid="logout-button"]');

      // Verify user is logged out
      await expect(page.locator('[data-testid="login-button"]')).toBeVisible();
      await expect(
        page.locator('[data-testid="register-button"]')
      ).toBeVisible();
      await expect(page.locator('[data-testid="user-menu"]')).not.toBeVisible();
    });
  });

  test.describe("Authentication State", () => {
    test("should persist login state across page refresh", async ({ page }) => {
      // Login first
      await page.click('[data-testid="login-button"]');
      await page.fill('[data-testid="email-input"]', "test@example.com");
      await page.fill('[data-testid="password-input"]', "password123");
      await page.click('[data-testid="login-submit"]');

      // Wait for login to complete
      await expect(page.locator('[data-testid="user-menu"]')).toBeVisible();

      // Refresh page
      await page.reload();

      // Verify user is still logged in
      await expect(page.locator('[data-testid="user-menu"]')).toBeVisible();
      await expect(page.locator('[data-testid="logout-button"]')).toBeVisible();
    });

    test("should redirect to login for protected routes when not authenticated", async ({
      page,
    }) => {
      // Try to access a protected route (like user profile)
      await page.goto("/profile");

      // Should redirect to login or show login form
      await expect(page.locator('[data-testid="login-form"]')).toBeVisible();
    });
  });
});
