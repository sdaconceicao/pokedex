import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { notify } from "@/lib/toast";
import { useAuthModal } from "@/providers/AuthModalProvider";
import type { User } from "@/types";
import ChangePasswordForm from "./ChangePasswordForm";

vi.mock("@/lib/toast", () => ({ notify: vi.fn() }));

vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
}));

vi.mock("@/hooks/useAuth", () => ({
  useAuth: vi.fn(),
}));

vi.mock("@/providers/AuthModalProvider", () => ({
  useAuthModal: vi.fn(),
}));

const CURRENT_PASSWORD = "OldPikachu123!";
const NEW_PASSWORD = "NewPikachu123!";

const USER: User = {
  id: "1",
  email: "ash@pallet.town",
  username: "ash@pallet.town",
  firstName: "",
  lastName: "",
};

function setup({
  signedOut = false,
  isLoading = false,
  changePasswordAsync = vi.fn().mockResolvedValue({ message: "Password updated" }),
} = {}) {
  const replace = vi.fn();
  vi.mocked(useRouter).mockReturnValue({ replace } as unknown as ReturnType<typeof useRouter>);
  vi.mocked(useAuthModal).mockReturnValue({
    openSignIn: vi.fn(),
    openSignUp: vi.fn(),
    isAuthModalOpen: false,
  });
  vi.mocked(useAuth).mockReturnValue({
    user: signedOut ? undefined : USER,
    isLoading,
    changePasswordAsync,
    isChangePasswordLoading: false,
  } as unknown as ReturnType<typeof useAuth>);

  render(<ChangePasswordForm />);
  return { replace, changePasswordAsync, ui: userEvent.setup() };
}

const submit = (ui: ReturnType<typeof userEvent.setup>) =>
  ui.click(screen.getByRole("button", { name: "Change password" }));

describe("ChangePasswordForm", () => {
  afterEach(() => vi.clearAllMocks());

  // useAuth reports no user until it has mounted, so the loading branch is what
  // stops a signed-in visitor seeing the sign-in prompt flash first.
  it("renders nothing while auth is still resolving", () => {
    setup({ signedOut: true, isLoading: true });

    expect(screen.queryByLabelText("Current password")).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Sign In" })).not.toBeInTheDocument();
  });

  it("prompts a signed-out visitor to sign in instead of showing the form", () => {
    setup({ signedOut: true });

    expect(screen.getByText("Sign in to change your password.")).toBeInTheDocument();
    expect(screen.queryByLabelText("Current password")).not.toBeInTheDocument();
  });

  it("asks a signed-in user for the current password and the new one twice", () => {
    setup();

    expect(screen.getByLabelText("Current password")).toBeInTheDocument();
    expect(screen.getByLabelText("New password")).toBeInTheDocument();
    expect(screen.getByLabelText("Confirm new password")).toBeInTheDocument();
  });

  it("requires the current password before submitting", async () => {
    const { changePasswordAsync, ui } = setup();

    await ui.type(screen.getByLabelText("New password"), NEW_PASSWORD);
    await ui.type(screen.getByLabelText("Confirm new password"), NEW_PASSWORD);
    await submit(ui);

    expect(await screen.findByText("Your current password is required")).toBeInTheDocument();
    expect(changePasswordAsync).not.toHaveBeenCalled();
  });

  it("rejects a new password that fails the shared policy", async () => {
    const { changePasswordAsync, ui } = setup();

    await ui.type(screen.getByLabelText("Current password"), CURRENT_PASSWORD);
    await ui.type(screen.getByLabelText("New password"), "weak");
    await ui.type(screen.getByLabelText("Confirm new password"), "weak");
    await submit(ui);

    expect(
      await screen.findByText("Password must be at least 8 characters long"),
    ).toBeInTheDocument();
    expect(changePasswordAsync).not.toHaveBeenCalled();
  });

  it("rejects a mismatched confirmation", async () => {
    const { changePasswordAsync, ui } = setup();

    await ui.type(screen.getByLabelText("Current password"), CURRENT_PASSWORD);
    await ui.type(screen.getByLabelText("New password"), NEW_PASSWORD);
    await ui.type(screen.getByLabelText("Confirm new password"), "Different1!");
    await submit(ui);

    expect(await screen.findByText("Passwords do not match")).toBeInTheDocument();
    expect(changePasswordAsync).not.toHaveBeenCalled();
  });

  it("submits both passwords, then returns to the account page", async () => {
    const { replace, changePasswordAsync, ui } = setup();

    await ui.type(screen.getByLabelText("Current password"), CURRENT_PASSWORD);
    await ui.type(screen.getByLabelText("New password"), NEW_PASSWORD);
    await ui.type(screen.getByLabelText("Confirm new password"), NEW_PASSWORD);
    await submit(ui);

    // The confirmation field is a client-side concern only — the API takes two.
    expect(changePasswordAsync).toHaveBeenCalledWith({
      currentPassword: CURRENT_PASSWORD,
      password: NEW_PASSWORD,
    });
    expect(replace).toHaveBeenCalledWith("/account");
    expect(notify).toHaveBeenCalledWith(
      expect.objectContaining({ title: "Password updated", variant: "success" }),
    );
  });

  it("toasts the API error and stays put", async () => {
    const { replace, ui } = setup({
      changePasswordAsync: vi.fn().mockRejectedValue(new Error("Password does not match")),
    });

    await ui.type(screen.getByLabelText("Current password"), "wrong");
    await ui.type(screen.getByLabelText("New password"), NEW_PASSWORD);
    await ui.type(screen.getByLabelText("Confirm new password"), NEW_PASSWORD);
    await submit(ui);

    await vi.waitFor(() =>
      expect(notify).toHaveBeenCalledWith(
        expect.objectContaining({
          title: "Password does not match",
          variant: "error",
        }),
      ),
    );
    expect(replace).not.toHaveBeenCalled();
  });
});
