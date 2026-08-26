import { render, screen } from "@testing-library/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import VerifyEmailForm from "./VerifyEmailForm";

vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
  useSearchParams: vi.fn(),
}));

vi.mock("@/hooks/useAuth", () => ({
  useAuth: vi.fn(),
}));

function setup({
  token = "verify-token-123",
  confirmEmailVerificationAsync = vi.fn().mockResolvedValue({ access_token: "at-1" }),
} = {}) {
  const replace = vi.fn();
  vi.mocked(useRouter).mockReturnValue({ replace } as unknown as ReturnType<typeof useRouter>);
  vi.mocked(useSearchParams).mockReturnValue(
    new URLSearchParams(token ? `token=${token}` : "") as unknown as ReturnType<
      typeof useSearchParams
    >,
  );
  vi.mocked(useAuth).mockReturnValue({
    confirmEmailVerificationAsync,
  } as unknown as ReturnType<typeof useAuth>);

  const view = render(<VerifyEmailForm />);
  return { replace, confirmEmailVerificationAsync, view };
}

describe("VerifyEmailForm", () => {
  afterEach(() => vi.clearAllMocks());

  it("does not call the API when the link has no token", () => {
    const { confirmEmailVerificationAsync } = setup({ token: "" });

    expect(screen.getByText(/missing its token/)).toBeInTheDocument();
    expect(confirmEmailVerificationAsync).not.toHaveBeenCalled();
  });

  it("verifies on mount, then replaces the URL", async () => {
    const { replace, confirmEmailVerificationAsync } = setup();

    expect(confirmEmailVerificationAsync).toHaveBeenCalledWith("verify-token-123");
    // replace, not push — the token must not survive in history.
    await vi.waitFor(() => expect(replace).toHaveBeenCalledWith("/"));
  });

  it("shows the API error and does not navigate", async () => {
    const { replace } = setup({
      confirmEmailVerificationAsync: vi
        .fn()
        .mockRejectedValue(new Error("Invalid or expired verification link")),
    });

    expect(await screen.findByText("Invalid or expired verification link")).toBeInTheDocument();
    // Copy must cover expired, tampered and reused — the API collapses them.
    expect(screen.getByText(/expire and can only be used once/)).toBeInTheDocument();
    expect(replace).not.toHaveBeenCalled();
  });

  it("verifies only once when the effect re-runs", () => {
    const { confirmEmailVerificationAsync, view } = setup();

    view.rerender(<VerifyEmailForm />);

    // Without the hasRun guard a second call would fail against the
    // already-flipped flag and surface a spurious error.
    expect(confirmEmailVerificationAsync).toHaveBeenCalledTimes(1);
  });
});
