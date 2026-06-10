import { expect, type Locator, type Page } from "@playwright/test";

export function getAuthDialog(page: Page): Locator {
  return page.getByRole("dialog");
}

export async function openSignInModal(page: Page) {
  await page.getByRole("button", { name: "Sign In" }).click();
  await expect(getAuthDialog(page)).toBeVisible();
}

export async function openRegisterForm(page: Page) {
  await openSignInModal(page);
  await getAuthDialog(page).getByRole("button", { name: "Sign up" }).click();
  await expect(
    getAuthDialog(page).getByRole("heading", { name: "Create Account" })
  ).toBeVisible();
}

export async function expectLoggedIn(page: Page) {
  await expect(page.getByRole("button", { name: "Account menu" })).toBeVisible();
}

export async function logout(page: Page) {
  await page.getByRole("button", { name: "Account menu" }).click();
  await page.getByRole("menuitem", { name: "Log out" }).click();
  await expect(page.getByRole("button", { name: "Sign In" })).toBeVisible();
}
