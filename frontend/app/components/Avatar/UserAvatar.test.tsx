import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import UserAvatar from "./UserAvatar";

const EMAIL = "ash@pallet.town";

async function openMenu(props: Partial<React.ComponentProps<typeof UserAvatar>> = {}) {
  const user = userEvent.setup();
  const onLogout = props.onLogout ?? vi.fn();
  render(<UserAvatar email={EMAIL} onLogout={onLogout} {...props} />);
  await user.click(screen.getByRole("button", { name: "Account menu" }));
  return { user, onLogout };
}

describe("UserAvatar", () => {
  it("renders the account menu trigger", () => {
    render(<UserAvatar email={EMAIL} onLogout={vi.fn()} />);

    expect(screen.getByRole("button", { name: "Account menu" })).toBeInTheDocument();
  });

  describe("the menu", () => {
    it("links My lists to /groups", async () => {
      await openMenu();

      expect(screen.getByRole("menuitem", { name: "My lists" })).toHaveAttribute("href", "/groups");
    });

    it("offers no account-settings entry -- list management lives on /groups", async () => {
      await openMenu();

      expect(screen.queryByRole("menuitem", { name: "Account settings" })).not.toBeInTheDocument();
    });

    it("shows the signed-in user's email", async () => {
      await openMenu();

      expect(screen.getByText(EMAIL)).toBeInTheDocument();
    });

    it("still finds the logout item by its accessible name (used by the e2e auth helper)", async () => {
      await openMenu();

      expect(screen.getByRole("menuitem", { name: "Log out" })).toBeInTheDocument();
    });

    it("fires onLogout when Log out is chosen", async () => {
      const { user, onLogout } = await openMenu();

      await user.click(screen.getByRole("menuitem", { name: "Log out" }));

      expect(onLogout).toHaveBeenCalledTimes(1);
    });

    it("does not fire onLogout for the navigation items", async () => {
      const { user, onLogout } = await openMenu();

      await user.click(screen.getByRole("menuitem", { name: "My lists" }));

      expect(onLogout).not.toHaveBeenCalled();
    });

    it("shows a pending label and disables the item while logging out", async () => {
      await openMenu({ isLogoutLoading: true });

      const item = screen.getByRole("menuitem", { name: "Logging out…" });
      expect(item).toHaveAttribute("data-disabled", "true");
    });

    it("keeps the logout item enabled by default", async () => {
      await openMenu();

      expect(screen.getByRole("menuitem", { name: "Log out" })).not.toHaveAttribute(
        "data-disabled",
      );
    });
  });
});
