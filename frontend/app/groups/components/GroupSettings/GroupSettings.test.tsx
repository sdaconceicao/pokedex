import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useAuth } from "@/hooks/useAuth";
import { useGroups } from "@/hooks/useGroups";
import { useAuthModal } from "@/providers/AuthModalProvider";
import type { PokemonGroup, User } from "@/types";
import GroupSettings from "./GroupSettings";

vi.mock("@/hooks/useAuth", () => ({
  useAuth: vi.fn(),
}));

vi.mock("@/hooks/useGroups", () => ({
  useGroups: vi.fn(),
}));

vi.mock("@/providers/AuthModalProvider", () => ({
  useAuthModal: vi.fn(),
}));

// GroupRow's own behaviour (edit/save/cancel/delete) is covered directly in
// GroupRow.test.tsx. Here we only care that GroupSettings hands it the right
// group, in the right order.
vi.mock("./GroupRow", () => ({
  default: ({ group }: { group: PokemonGroup }) => <li>{group.name}</li>,
}));

const USER: User = {
  id: "1",
  email: "ash@pallet.town",
  firstName: "Ash",
  lastName: "Ketchum",
  username: "ash",
};

const GROUPS: PokemonGroup[] = [
  { id: "1", name: "Favorites", isDefault: true, pokemonCount: 3 },
  { id: "2", name: "Team", isDefault: false, pokemonCount: 6 },
];

const openSignIn = vi.fn();

const setAuth = (overrides: Partial<ReturnType<typeof useAuth>> = {}) =>
  vi.mocked(useAuth).mockReturnValue({
    user: USER,
    isLoading: false,
    ...overrides,
  } as unknown as ReturnType<typeof useAuth>);

const setGroups = (overrides: Partial<ReturnType<typeof useGroups>> = {}) =>
  vi.mocked(useGroups).mockReturnValue({
    groups: GROUPS,
    defaultGroup: GROUPS[0],
    isLoading: false,
    error: null,
    ...overrides,
  } as unknown as ReturnType<typeof useGroups>);

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(useAuthModal).mockReturnValue({
    openSignIn,
    openSignUp: vi.fn(),
    isAuthModalOpen: false,
  });
  setAuth();
  setGroups();
});

describe("GroupSettings", () => {
  it("shows the heading and intro line explaining the default group", () => {
    render(<GroupSettings />);

    expect(screen.getByRole("heading", { name: "Your groups" })).toBeInTheDocument();
    expect(screen.getByText(/preselected whenever you add a Pokémon/)).toBeInTheDocument();
  });

  describe("loading", () => {
    it("shows a skeleton while auth is resolving", () => {
      setAuth({ user: undefined, isLoading: true });

      render(<GroupSettings />);

      expect(screen.getByLabelText("Loading your groups")).toBeInTheDocument();
    });

    it("shows a skeleton while the groups query is in flight", () => {
      setGroups({ groups: undefined, isLoading: true });

      render(<GroupSettings />);

      expect(screen.getByLabelText("Loading your groups")).toBeInTheDocument();
    });
  });

  describe("signed out", () => {
    it("prompts to sign in", async () => {
      const user = userEvent.setup();
      setAuth({ user: undefined, isLoading: false });

      render(<GroupSettings />);
      expect(screen.getByText("Sign in to manage your Pokémon groups.")).toBeInTheDocument();

      await user.click(screen.getByRole("button", { name: "Sign In" }));
      expect(openSignIn).toHaveBeenCalledTimes(1);
    });
  });

  describe("error", () => {
    it("surfaces the groups query's error", () => {
      setGroups({ groups: undefined, error: new Error("network down") });

      render(<GroupSettings />);

      expect(screen.getByRole("status")).toHaveTextContent("network down");
    });
  });

  describe("empty", () => {
    it("explains how to create the first group", () => {
      setGroups({ groups: [] });

      render(<GroupSettings />);

      expect(screen.getByText(/create your first group/)).toBeInTheDocument();
    });
  });

  describe("populated", () => {
    it("renders one row per group, in the order given", () => {
      render(<GroupSettings />);

      const rows = screen.getAllByRole("listitem");
      expect(rows.map((row) => row.textContent)).toEqual(["Favorites", "Team"]);
    });
  });
});
