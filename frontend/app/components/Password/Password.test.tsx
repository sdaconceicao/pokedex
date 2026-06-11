import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Password from "./Password";

describe("Password", () => {
  const defaultProps = {
    id: "password",
    "data-testid": "password-field",
  };

  it("renders a password input by default", () => {
    render(<Password {...defaultProps} />);

    const input = screen.getByTestId("password-field-input-input");
    expect(input).toHaveAttribute("type", "password");
  });

  it("toggles password visibility when the eye button is clicked", async () => {
    const user = userEvent.setup();
    render(<Password {...defaultProps} />);

    const input = screen.getByTestId("password-field-input-input");
    const toggleButton = screen.getByRole("button", { name: "Show password" });

    expect(input).toHaveAttribute("type", "password");

    await user.click(toggleButton);
    expect(input).toHaveAttribute("type", "text");
    expect(screen.getByRole("button", { name: "Hide password" })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Hide password" }));
    expect(input).toHaveAttribute("type", "password");
  });

  it("forwards value and onChange to the input", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(<Password {...defaultProps} value="" onChange={handleChange} />);

    const input = screen.getByTestId("password-field-input-input");
    await user.type(input, "secret");

    expect(handleChange).toHaveBeenCalled();
  });

  it("renders error message when provided", () => {
    render(<Password {...defaultProps} error errorMessage="Password is required" />);

    expect(screen.getByText("Password is required")).toBeInTheDocument();
  });

  it("disables the toggle button when the input is disabled", () => {
    render(<Password {...defaultProps} disabled />);

    expect(screen.getByRole("button", { name: "Show password" })).toBeDisabled();
  });
});
