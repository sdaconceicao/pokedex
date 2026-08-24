import { fireEvent, render, screen } from "@testing-library/react";
import AuthModalProvider, { useAuthModal } from "./AuthModalProvider";

const mockAuth = {
  loginAsync: vi.fn(),
  registerAsync: vi.fn().mockResolvedValue({
    message: "Check your email for a link to verify your account",
  }),
  requestPasswordResetAsync: vi.fn().mockResolvedValue({ message: "sent" }),
  resendEmailVerificationAsync: vi.fn().mockResolvedValue({ message: "sent" }),
  isLoginLoading: false,
  isRegisterLoading: false,
  isRequestPasswordResetLoading: false,
  isResendEmailVerificationLoading: false,
};

vi.mock("@/hooks/useAuth", () => ({
  useAuth: () => mockAuth,
}));

vi.mock("@/components/Modal", () => ({
  Modal: ({
    isOpen,
    title,
    children,
  }: {
    isOpen: boolean;
    title?: string;
    children: React.ReactNode;
  }) =>
    isOpen ? (
      <div>
        {title && <h2>{title}</h2>}
        {children}
      </div>
    ) : null,
}));

function Consumer() {
  const { openSignIn, openSignUp } = useAuthModal();
  return (
    <>
      <button type="button" onClick={openSignIn}>
        trigger sign in
      </button>
      <button type="button" onClick={openSignUp}>
        trigger sign up
      </button>
    </>
  );
}

describe("AuthModalProvider", () => {
  it("renders children and no modal by default", () => {
    render(
      <AuthModalProvider>
        <Consumer />
      </AuthModalProvider>,
    );

    expect(screen.queryByText("Sign In")).not.toBeInTheDocument();
    expect(screen.queryByText("Create Account")).not.toBeInTheDocument();
  });

  it("opens the sign in modal via openSignIn", () => {
    render(
      <AuthModalProvider>
        <Consumer />
      </AuthModalProvider>,
    );

    fireEvent.click(screen.getByText("trigger sign in"));

    expect(screen.getByRole("heading", { name: "Sign In" })).toBeInTheDocument();
  });

  it("opens the sign up modal via openSignUp", () => {
    render(
      <AuthModalProvider>
        <Consumer />
      </AuthModalProvider>,
    );

    fireEvent.click(screen.getByText("trigger sign up"));

    expect(screen.getByRole("heading", { name: "Create Account" })).toBeInTheDocument();
  });

  it("switches to the reset mode and back from the sign in form", () => {
    render(
      <AuthModalProvider>
        <Consumer />
      </AuthModalProvider>,
    );

    fireEvent.click(screen.getByText("trigger sign in"));
    fireEvent.click(screen.getByRole("button", { name: "Forgot your password?" }));

    expect(screen.getByRole("heading", { name: "Reset Password" })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Back to sign in" }));

    expect(screen.getByRole("heading", { name: "Sign In" })).toBeInTheDocument();
  });

  it("switches to the resend verification mode from the sign in form", () => {
    render(
      <AuthModalProvider>
        <Consumer />
      </AuthModalProvider>,
    );

    fireEvent.click(screen.getByText("trigger sign in"));
    fireEvent.click(screen.getByRole("button", { name: "Need a new verification link?" }));

    expect(screen.getByRole("heading", { name: "Resend Verification" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Resend verification link" })).toBeInTheDocument();
  });

  it("keeps the modal open on the notice after registering", async () => {
    render(
      <AuthModalProvider>
        <Consumer />
      </AuthModalProvider>,
    );

    fireEvent.click(screen.getByText("trigger sign up"));
    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "ash@pallet.town" },
    });
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "Pikachu123!" },
    });
    fireEvent.change(screen.getByLabelText("Confirm Password"), {
      target: { value: "Pikachu123!" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Create Account" }));

    // Registration no longer signs the user in, so closing here would hide
    // the only instruction they have.
    expect(
      await screen.findByText("Check your email for a link to verify your account"),
    ).toBeInTheDocument();
  });

  it("throws when useAuthModal is used outside the provider", () => {
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});

    expect(() => render(<Consumer />)).toThrow(
      "useAuthModal must be used within an AuthModalProvider",
    );

    consoleError.mockRestore();
  });
});
