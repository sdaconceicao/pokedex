import { fireEvent, render, screen } from "@testing-library/react";
import type { PokemonType } from "@/types";
import { HomeScreen } from "./HomeScreen";
import { UPDATES } from "./updates";

const mockUseIsAuthenticated = vi.fn();
const mockOpenSignUp = vi.fn();

vi.mock("@/hooks/useAuth", () => ({
  useIsAuthenticated: () => mockUseIsAuthenticated(),
}));

vi.mock("@/providers/AuthModalProvider", () => ({
  useAuthModal: () => ({ openSignIn: vi.fn(), openSignUp: mockOpenSignUp }),
}));

const MOCK_TYPES: PokemonType[] = [
  { name: "normal", count: 160 },
  { name: "fire", count: 109 },
  { name: "water", count: 192 },
  { name: "electric", count: 114 },
  { name: "grass", count: 156 },
];

beforeEach(() => {
  mockUseIsAuthenticated.mockReturnValue({
    isAuthenticated: false,
    isLoading: false,
  });
  mockOpenSignUp.mockClear();
  Element.prototype.scrollIntoView = vi.fn();
});

describe("HomeScreen", () => {
  it("renders the hero heading and subtitle", () => {
    render(<HomeScreen types={MOCK_TYPES} />);

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Every Pokémon.One Pokédex.",
    );
    expect(
      screen.getByText((content, element) => {
        const hasText = (node: Element) =>
          node.textContent?.startsWith("Search for every Pokémon by name") ??
          false;
        const elementHasText = element ? hasText(element) : false;
        return (
          elementHasText &&
          // Exclude ancestors that also contain the text
          !Array.from(element?.children ?? []).some((child) => hasText(child))
        );
      }),
    ).toBeInTheDocument();
  });

  it("shows a Sign Up CTA that opens the sign up modal when logged out", () => {
    mockUseIsAuthenticated.mockReturnValue({
      isAuthenticated: false,
      isLoading: false,
    });
    render(<HomeScreen types={MOCK_TYPES} />);

    const cta = screen.getByRole("button", { name: "Sign Up today" });
    fireEvent.click(cta);

    expect(mockOpenSignUp).toHaveBeenCalledTimes(1);
  });

  it("shows a Start exploring CTA that scrolls to the types section when logged in", () => {
    mockUseIsAuthenticated.mockReturnValue({
      isAuthenticated: true,
      isLoading: false,
    });
    render(<HomeScreen types={MOCK_TYPES} />);

    expect(
      screen.queryByRole("button", { name: "Sign Up today" }),
    ).not.toBeInTheDocument();

    const cta = screen.getByRole("button", { name: "Start exploring" });
    fireEvent.click(cta);

    expect(Element.prototype.scrollIntoView).toHaveBeenCalledTimes(1);
  });

  it("scrolls to the updates section when clicking What's new", () => {
    render(<HomeScreen types={MOCK_TYPES} />);

    fireEvent.click(screen.getByRole("button", { name: "What's new" }));

    expect(Element.prototype.scrollIntoView).toHaveBeenCalledTimes(1);
  });

  it("renders feature highlights explaining app usage", () => {
    render(<HomeScreen types={MOCK_TYPES} />);

    expect(screen.getByText("Search instantly")).toBeInTheDocument();
    expect(screen.getByText("Browse your way")).toBeInTheDocument();
    expect(screen.getByText("Discover special forms")).toBeInTheDocument();
    expect(screen.getByText("Go deep on stats")).toBeInTheDocument();
  });

  it("renders a link for every Pokemon type passed in", () => {
    render(<HomeScreen types={MOCK_TYPES} />);

    const fireLink = screen.getByRole("link", { name: "Browse fire Pokémon" });
    expect(fireLink).toHaveAttribute("href", "/?type=fire");

    const typeLinks = screen.getAllByRole("link", {
      name: /Browse .+ Pokémon/,
    });
    expect(typeLinks).toHaveLength(MOCK_TYPES.length);
  });

  it("renders no type links when given an empty types list", () => {
    render(<HomeScreen types={[]} />);

    expect(
      screen.queryAllByRole("link", { name: /Browse .+ Pokémon/ }),
    ).toHaveLength(0);
  });

  it("renders the latest updates", () => {
    render(<HomeScreen types={MOCK_TYPES} />);

    expect(
      screen.getByRole("heading", { name: "Latest updates" }),
    ).toBeInTheDocument();
    for (const update of UPDATES) {
      expect(screen.getByText(update.title)).toBeInTheDocument();
    }
  });
});
