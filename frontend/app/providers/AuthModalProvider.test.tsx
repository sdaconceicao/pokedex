import { fireEvent, render, screen } from "@testing-library/react";
import AuthModalProvider, { useAuthModal } from "./AuthModalProvider";

const mockAuth = {
  loginAsync: vi.fn(),
  registerAsync: vi.fn(),
  isLoginLoading: false,
  isRegisterLoading: false,
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

  it("throws when useAuthModal is used outside the provider", () => {
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});

    expect(() => render(<Consumer />)).toThrow(
      "useAuthModal must be used within an AuthModalProvider",
    );

    consoleError.mockRestore();
  });
});
