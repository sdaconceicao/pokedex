import { fireEvent, render, screen } from "@testing-library/react";
import AuthModalProvider, { useAuthModal } from "./AuthModalProvider";

const mockAuth = {
  loginAsync: vi.fn(),
  registerAsync: vi.fn(),
  requestPasswordResetAsync: vi.fn().mockResolvedValue({ message: "sent" }),
  isLoginLoading: false,
  isRegisterLoading: false,
  isRequestPasswordResetLoading: false,
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

  it("throws when useAuthModal is used outside the provider", () => {
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});

    expect(() => render(<Consumer />)).toThrow(
      "useAuthModal must be used within an AuthModalProvider",
    );

    consoleError.mockRestore();
  });
});
