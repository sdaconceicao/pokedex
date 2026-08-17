import { useQuery } from "@apollo/client/react";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useSearchParams } from "next/navigation";
import type { Pokemon } from "@/types";
import RegionPokemon from "./RegionPokemon";

vi.mock("@apollo/client/react", () => ({
  useQuery: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useSearchParams: vi.fn(),
}));

// The list and the pagination bar are covered by their own tests; standing them
// in keeps this one about the query, the sort and the URLs it produces.
vi.mock("@/components/PokemonList", () => ({
  __esModule: true,
  default: ({
    pokemon,
    getHref,
  }: {
    pokemon: Pokemon[];
    getHref?: (pokemon: Pokemon) => string;
  }) => (
    <ul data-testid="pokemon-list">
      {pokemon.map((entry) => (
        <li key={entry.id}>
          <a href={getHref?.(entry)}>{entry.name}</a>
        </li>
      ))}
    </ul>
  ),
  PokemonListSkeleton: ({ count }: { count: number }) => (
    <div data-testid="pokemon-list-skeleton">{count}</div>
  ),
}));

vi.mock("@/components/Pagination", () => ({
  __esModule: true,
  default: ({
    currentPage,
    totalItems,
    onPageChange,
  }: {
    currentPage: number;
    totalItems: number;
    onPageChange: (page: number) => void;
  }) => (
    <button type="button" data-testid="pagination" onClick={() => onPageChange(currentPage + 1)}>
      page {currentPage} of {totalItems}
    </button>
  ),
}));

const pokemon = [{ id: "4", name: "charmander" }] as Pokemon[];

const setParams = (params: string) =>
  vi
    .mocked(useSearchParams)
    .mockReturnValue(new URLSearchParams(params) as unknown as ReturnType<typeof useSearchParams>);

const setResults = ({
  loading = false,
  total = 1,
  data = pokemon,
}: {
  loading?: boolean;
  total?: number;
  data?: Pokemon[];
} = {}) =>
  vi.mocked(useQuery).mockReturnValue({
    loading,
    data: { pokemonByRegion: { pokemon: data, total } },
  } as unknown as ReturnType<typeof useQuery>);

beforeEach(() => {
  vi.clearAllMocks();
  vi.spyOn(window.history, "pushState").mockImplementation(() => {});
  setParams("");
  setResults();
});

describe("RegionPokemon", () => {
  describe("the query", () => {
    it("sends the sort from the URL alongside limit and offset", () => {
      setParams("sort=NAME_DESC&page=3");

      render(<RegionPokemon region="kanto" />);

      expect(vi.mocked(useQuery).mock.calls[0][1]).toMatchObject({
        variables: { sort: "NAME_DESC", limit: 20, offset: 40 },
      });
    });

    it("defaults to dex number order when nothing is in the URL", () => {
      render(<RegionPokemon region="kanto" />);

      expect(vi.mocked(useQuery).mock.calls[0][1]).toMatchObject({
        variables: { sort: "ID_ASC" },
      });
    });
  });

  describe("sorting", () => {
    it("writes the new sort to the URL and drops back to page 1", async () => {
      const user = userEvent.setup();
      setParams("page=3");

      render(<RegionPokemon region="kanto" />);
      await user.click(screen.getByRole("combobox", { name: "Sort by" }));
      await user.click(
        within(await screen.findByRole("listbox")).getByRole("option", { name: "Name Z–A" }),
      );

      expect(window.history.pushState).toHaveBeenCalledWith(
        null,
        "",
        "/region/kanto?sort=NAME_DESC",
      );
    });
  });

  describe("rendering", () => {
    it("shows its own heading", () => {
      render(<RegionPokemon region="kanto" />);

      expect(screen.getByRole("heading", { name: "Pokemon from this region" })).toBeInTheDocument();
    });

    it("shows a full page of placeholders on the first load", () => {
      vi.mocked(useQuery).mockReturnValue({
        loading: true,
        data: undefined,
        previousData: undefined,
      } as unknown as ReturnType<typeof useQuery>);

      render(<RegionPokemon region="kanto" />);

      expect(screen.getByTestId("pokemon-list-skeleton")).toHaveTextContent("20");
      expect(screen.queryByTestId("pokemon-list")).not.toBeInTheDocument();
    });

    // Swapping the sort or the page empties `data` until the next result lands;
    // tearing the grid out here is what reset scroll position and dropped the
    // sticky toolbar the last two times this regressed.
    it("keeps the current grid up while the next result set loads", () => {
      vi.mocked(useQuery).mockReturnValue({
        loading: true,
        data: undefined,
        previousData: { pokemonByRegion: { pokemon, total: 1 } },
      } as unknown as ReturnType<typeof useQuery>);

      render(<RegionPokemon region="kanto" />);

      expect(screen.queryByTestId("pokemon-list-skeleton")).not.toBeInTheDocument();
      expect(screen.getByText("charmander")).toBeInTheDocument();
    });
  });

  describe("Pokemon links", () => {
    it("carries the page and sort so closing a Pokemon returns to the same list", () => {
      setParams("page=3&sort=NAME_DESC");

      render(<RegionPokemon region="kanto" />);

      expect(screen.getByRole("link", { name: "charmander" })).toHaveAttribute(
        "href",
        "/region/kanto/pokemon/4?sort=NAME_DESC&page=3",
      );
    });
  });

  describe("paging", () => {
    it("keeps the current sort when moving to another page", async () => {
      const user = userEvent.setup();
      setParams("sort=NAME_DESC");
      setResults({ total: 60 });

      render(<RegionPokemon region="kanto" />);
      await user.click(screen.getByTestId("pagination"));

      expect(window.history.pushState).toHaveBeenCalledWith(
        null,
        "",
        "/region/kanto?sort=NAME_DESC&page=2",
      );
    });
  });
});
