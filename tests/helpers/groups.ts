import { expect, type Locator, type Page } from "@playwright/test";
import { expectLoggedIn, getAuthDialog, openRegisterForm } from "./auth";

const PASSWORD = "P@ssw0rd123";

export function uniqueEmail(prefix = "e2e"): string {
  const stamp = Date.now().toString(36);
  const rand = Math.random().toString(36).slice(2, 6);
  const domain = "@e2e.test";
  const local = `${prefix}-${stamp}-${rand}`.slice(0, 40 - domain.length);
  return `${local}${domain}`;
}

export async function registerFreshUser(
  page: Page,
  email: string = uniqueEmail(),
): Promise<{ email: string; password: string }> {
  await openRegisterForm(page);
  const dialog = getAuthDialog(page);

  await dialog.getByLabel("Email").fill(email);
  await dialog.getByPlaceholder("Enter your password").fill(PASSWORD);
  await dialog.getByPlaceholder("Confirm your password").fill(PASSWORD);
  await dialog.getByRole("button", { name: "Create Account" }).click();

  await expectLoggedIn(page);
  await expect(page.getByRole("dialog")).not.toBeVisible();

  return { email, password: PASSWORD };
}

export function pokemonCard(page: Page, index = 0): Locator {
  return page.getByTestId("pokemon-card").nth(index);
}

export async function cardName(card: Locator): Promise<string> {
  const text = await card.getByRole("heading", { level: 3 }).textContent();
  if (!text?.trim()) throw new Error("Pokemon card is missing its name heading");
  return text.trim();
}

const escapeRegExp = (value: string): string => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export function cardGroupButton(card: Locator): Locator {
  return card.locator("xpath=../..").getByRole("button", {
    name: /^(Add .+ to a group|Manage .+'s groups)$/,
  });
}

export function groupPopover(page: Page, name?: string): Locator {
  const pattern = name
    ? new RegExp(`^(Add ${escapeRegExp(name)} to a group|Manage ${escapeRegExp(name)}'s groups)$`)
    : /^(Add .+ to a group|Manage .+'s groups)$/;
  return page.getByRole("dialog", { name: pattern });
}

export async function openGroupPopover(
  page: Page,
  card: Locator,
): Promise<{ popover: Locator; name: string }> {
  const name = await cardName(card);
  await cardGroupButton(card).click();
  const popover = groupPopover(page, name);
  await expect(popover).toBeVisible();
  return { popover, name };
}

export async function submitNewGroup(
  popover: Locator,
  options: { name?: string; makeDefault?: boolean } = {},
): Promise<void> {
  if (options.name !== undefined) {
    await popover.getByRole("textbox", { name: "New group" }).fill(options.name);
  }
  if (options.makeDefault !== undefined) {
    const checkbox = popover.getByRole("checkbox", { name: "Make this my default group" });
    const isChecked = await checkbox.isChecked();
    if (isChecked !== options.makeDefault) await checkbox.click({ force: true });
  }
  await popover.getByRole("button", { name: "Add" }).click();
}

/**
 * Toggles groups in the popover's multiselect. The listbox has to be dismissed
 * afterwards: react-aria hides everything outside an open popover from the
 * accessibility tree, so Update stays unreachable while it is showing.
 */
export async function toggleGroupSelection(
  page: Page,
  popover: Locator,
  names: string[],
): Promise<void> {
  await popover.getByRole("combobox", { name: "Your groups" }).click();
  for (const name of names) {
    await page.getByRole("option", { name }).click();
  }
  await page.keyboard.press("Escape");
}

/** A row on /groups, located by the group's name link. */
export function groupRow(page: Page, name: string): Locator {
  return page.getByRole("listitem").filter({ has: page.getByRole("link", { name, exact: true }) });
}
