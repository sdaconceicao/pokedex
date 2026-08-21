import { useQuery } from "@apollo/client/react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useGroupPokemon, useGroups } from "@/hooks/useGroups";
import { useAuthModal } from "@/providers/AuthModalProvider";
import type { GroupPokemon, Pokemon, PokemonGroup, User } from "@/types";
import GroupDetail from "./GroupDetail";

vi.mock("@apollo/client/react", () => ({
  useQuery: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useParams: vi.fn(),
}));

vi.mock("@/hooks/useAuth", () => ({
  useAuth: vi.fn(),
}));

vi.mock("@/hooks/useGroups", () => ({
  useGroups: vi.fn(),
  useGroupPokemon: vi.fn(),
}));

vi.mock("@/providers/AuthModalProvider", () => ({
  useAuthModal: vi.fn(),
}));

vi.mock("@/components/PokemonList", () => ({
  __esModule: true,
  default: ({ pokemon }: { pokemon: Pokemon[] }) => (
    <ul data-testid="pokemon-list">
      {pokemon.map((entry) => (
        <li key={entry.id}>{entry.name}</li>
      ))}
    </ul>
  ),
  PokemonListSkeleton: ({ count }: { count?: number }) => (
    <div data-testid="pokemon-list-skeleton">{count ?? "default"}</div>
  ),
}));

const USER: User = {
  id: "1",
  email: "ash@pallet.town",
  firstName: "Ash",
  lastName: "Ketchum",
  username: "ash",
};

const GROUPS: PokemonGroup[] = [{ id: "1", name: "Favorites", isDefault: true, pokemonCount: 2 }];

const GROUP_POKEMON: GroupPokemon[] = [
  { pokemonId: "25", speciesId: "25" },
  { pokemonId: "4", speciesId: "4" },
];

const POKEMON = [
  { id: "25", name: "pikachu" },
  { id: "4", name: "charmander" },
] as Pokemon[];

const openSignIn = vi.fn();

const setAuth = (overrides: Partial<ReturnType<typeof useAuth>> = {}) =>
  vi.mocked(useAuth).mockReturnValue({
    user: USER,
    isLoading: false,
    ...overrides,
  } as unknown as ReturnType<typeof useAuth>);

const setGroups = (groups: PokemonGroup[] | undefined = GROUPS) =>
  vi.mocked(useGroups).mockReturnValue({
    groups,
    defaultGroup: groups?.[0],
    isLoading: false,
    error: null,
  } as unknown as ReturnType<typeof useGroups>);

const setGroupPokemon = (overrides: Partial<ReturnType<typeof useGroupPokemon>> = {}) =>
  vi.mocked(useGroupPokemon).mockReturnValue({
    pokemon: GROUP_POKEMON,
    isLoading: false,
    error: null,
    ...overrides,
  } as unknown as ReturnType<typeof useGroupPokemon>);

const setDetailQuery = (overrides: Partial<ReturnType<typeof useQuery>> = {}) =>
  vi.mocked(useQuery).mockReturnValue({
    loading: false,
    data: { pokemonByIds: POKEMON },
    ...overrides,
  } as unknown as ReturnType<typeof useQuery>);

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(useParams).mockReturnValue({ id: "1" });
  vi.mocked(useAuthModal).mockReturnValue({
    openSignIn,
    openSignUp: vi.fn(),
    isAuthModalOpen: false,
  });
  setAuth();
  setGroups();
  setGroupPokemon();
  setDetailQuery();
});

describe("GroupDetail", () => {
  it("shows the group's name, found by id in the user's group list", () => {
    render(<GroupDetail />);

    expect(screen.getByRole("heading", { name: "Favorites" })).toBeInTheDocument();
  });

  it("falls back to a generic heading when the group isn't in the list yet", () => {
    setGroups([]);

    render(<GroupDetail />);

    expect(screen.getByRole("heading", { name: "Group" })).toBeInTheDocument();
  });

  it("sends pokemonByIds the ids from the group's pokemon, in order", () => {
    render(<GroupDetail />);

    expect(vi.mocked(useQuery).mock.calls[0][1]).toMatchObject({
      variables: { ids: ["25", "4"] },
      skip: false,
    });
  });

  describe("loading", () => {
    it("shows a skeleton while auth is resolving", () => {
      setAuth({ user: undefined, isLoading: true });

      render(<GroupDetail />);

      expect(screen.getByTestId("pokemon-list-skeleton")).toBeInTheDocument();
    });

    it("shows a skeleton while the group's pokemon ids are in flight", () => {
      setGroupPokemon({ pokemon: undefined, isLoading: true });

      render(<GroupDetail />);

      expect(screen.getByTestId("pokemon-list-skeleton")).toHaveTextContent("default");
    });

    it("sizes the skeleton to the known id count while pokemonByIds is loading", () => {
      setDetailQuery({ loading: true, data: undefined });

      render(<GroupDetail />);

      expect(screen.getByTestId("pokemon-list-skeleton")).toHaveTextContent("2");
    });
  });

  describe("signed out", () => {
    it("prompts to sign in", async () => {
      const user = userEvent.setup();
      setAuth({ user: undefined, isLoading: false });

      render(<GroupDetail />);
      expect(screen.getByText("Sign in to see this group.")).toBeInTheDocument();

      await user.click(screen.getByRole("button", { name: "Sign In" }));
      expect(openSignIn).toHaveBeenCalledTimes(1);
    });
  });

  describe("a group that isn't found", () => {
    it("surfaces a not-found message instead of crashing on the 404", () => {
      setGroupPokemon({ pokemon: undefined, error: new Error("Not Found") });

      render(<GroupDetail />);

      expect(screen.getByRole("status")).toHaveTextContent("Group not found");
      expect(screen.queryByTestId("pokemon-list")).not.toBeInTheDocument();
    });
  });

  describe("empty", () => {
    it("explains the group has no pokemon yet", () => {
      setGroupPokemon({ pokemon: [] });

      render(<GroupDetail />);

      expect(screen.getByText("This group doesn't have any Pokémon yet.")).toBeInTheDocument();
    });
  });

  describe("populated", () => {
    it("renders the hydrated pokemon", () => {
      render(<GroupDetail />);

      const list = screen.getByTestId("pokemon-list");
      expect(list).toHaveTextContent("pikachu");
      expect(list).toHaveTextContent("charmander");
    });

    it("renders an empty list rather than crashing if pokemonByIds somehow resolves with no data", () => {
      setDetailQuery({ loading: false, data: undefined });

      render(<GroupDetail />);

      expect(screen.getByTestId("pokemon-list")).toBeEmptyDOMElement();
    });
  });
});
