import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ForgotPasswordForm from "./ForgotPasswordForm";

const GENERIC = "If an account exists for that address, a reset link has been sent";

function setup(onSubmit = vi.fn().mockResolvedValue({ message: GENERIC })) {
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

  it("submits a trimmed email and replaces the form with the server's message", async () => {
    const { onSubmit, user } = setup();

    await user.type(screen.getByLabelText("Email"), "  ash@pallet.town  ");
    await user.click(screen.getByRole("button", { name: "Send reset link" }));

    expect(onSubmit).toHaveBeenCalledWith("ash@pallet.town");
    expect(await screen.findByText(GENERIC)).toBeInTheDocument();
    // The field is gone, so the link cannot be requested twice by accident.
    expect(screen.queryByLabelText("Email")).not.toBeInTheDocument();
  });

  it("keeps the form and shows a generic error when the request fails", async () => {
    const { user } = setup(vi.fn().mockRejectedValue(new Error("network down")));

    await user.type(screen.getByLabelText("Email"), "ash@pallet.town");
    await user.click(screen.getByRole("button", { name: "Send reset link" }));

    expect(await screen.findByText("Something went wrong. Please try again.")).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
  });

  it("returns to sign in from the confirmation view", async () => {
    const { onSwitchToLogin, user } = setup();

    await user.type(screen.getByLabelText("Email"), "ash@pallet.town");
    await user.click(screen.getByRole("button", { name: "Send reset link" }));
    await user.click(await screen.findByRole("button", { name: "Back to sign in" }));

    expect(onSwitchToLogin).toHaveBeenCalled();
  });
});
