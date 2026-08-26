import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ForgotPasswordForm from "./ForgotPasswordForm";

function setup(onSubmit = vi.fn().mockResolvedValue(undefined)) {
  const onSwitchToLogin = vi.fn();
  render(<ForgotPasswordForm onSubmit={onSubmit} onSwitchToLogin={onSwitchToLogin} />);
  return { onSubmit, onSwitchToLogin, user: userEvent.setup() };
}

describe("ForgotPasswordForm", () => {
  it("requires an email", async () => {
    const { onSubmit, user } = setup();

    await user.click(screen.getByRole("button", { name: "Send reset link" }));

    expect(await screen.findByText("Email is required")).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("rejects a malformed email", async () => {
    const { onSubmit, user } = setup();

    await user.type(screen.getByLabelText("Email"), "not-an-email");
    await user.click(screen.getByRole("button", { name: "Send reset link" }));

    expect(await screen.findByText("Please enter a valid email address")).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("submits a trimmed email and leaves the form in place", async () => {
    const { onSubmit, user } = setup();

    await user.type(screen.getByLabelText("Email"), "  ash@pallet.town  ");
    await user.click(screen.getByRole("button", { name: "Send reset link" }));

    expect(onSubmit).toHaveBeenCalledWith("ash@pallet.town");
    // AuthModalProvider closes the modal and toasts; the form itself renders
    // no outcome, so the field is still mounted at this point.
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
  });

  it("returns to sign in from the switch prompt", async () => {
    const { onSwitchToLogin, user } = setup();

    await user.click(screen.getByRole("button", { name: "Back to sign in" }));

    expect(onSwitchToLogin).toHaveBeenCalled();
  });
});
