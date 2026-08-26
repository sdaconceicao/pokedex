import { fireEvent, render, screen } from "@testing-library/react";
import { notify } from "@/lib/toast";
import AuthModalProvider, { useAuthModal } from "./AuthModalProvider";

vi.mock("@/lib/toast", () => ({ notify: vi.fn() }));

const mockAuth = {
  loginAsync: vi.fn(),
  registerAsync: vi.fn().mockResolvedValue({
    message: "Check your email — we have sent you a message with next steps",
  }),
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
  afterEach(() => vi.clearAllMocks());

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

  it("closes the modal and toasts the server's message after registering", async () => {
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

    await vi.waitFor(() =>
      expect(notify).toHaveBeenCalledWith({
        // The API's wording verbatim, identical for new, unverified and
        // already-registered addresses.
        title: "Check your email — we have sent you a message with next steps",
        variant: "success",
      }),
    );
    expect(screen.queryByRole("heading", { name: "Create Account" })).not.toBeInTheDocument();
  });

  it("toasts an error and keeps the modal open when registering fails", async () => {
    mockAuth.registerAsync.mockRejectedValueOnce(new Error("boom"));
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

    await vi.waitFor(() =>
      expect(notify).toHaveBeenCalledWith(expect.objectContaining({ variant: "error" })),
    );
    // Still open, so the user can correct and retry.
    expect(screen.getByRole("heading", { name: "Create Account" })).toBeInTheDocument();
  });

  it("toasts a generic error when signing in fails", async () => {
    mockAuth.loginAsync.mockRejectedValueOnce(new Error("nope"));
    render(
      <AuthModalProvider>
        <Consumer />
      </AuthModalProvider>,
    );

    fireEvent.click(screen.getByText("trigger sign in"));
    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "ash@pallet.town" },
    });
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "Pikachu123!" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Sign In" }));

    await vi.waitFor(() =>
      expect(notify).toHaveBeenCalledWith(
        expect.objectContaining({
          // Must not distinguish "unverified" from "wrong password".
          title: "Could not sign in",
          variant: "error",
        }),
      ),
    );
  });

  it("throws when useAuthModal is used outside the provider", () => {
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});

    expect(() => render(<Consumer />)).toThrow(
      "useAuthModal must be used within an AuthModalProvider",
    );

    consoleError.mockRestore();
  });
});
