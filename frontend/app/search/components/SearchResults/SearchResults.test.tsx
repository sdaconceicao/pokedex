import { useQuery } from "@apollo/client/react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useSearchParams } from "next/navigation";
import { EMPTY_SEARCH_FILTERS, type SearchFilterState } from "@/lib/searchFilters";
import type { Pokemon } from "@/types";
import SearchResults from "./SearchResults";

vi.mock("@apollo/client/react", () => ({
  useQuery: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useSearchParams: vi.fn(),
}));

// The list and the pagination bar are covered by their own tests; standing them
// in keeps this one about the query, the heading and the page in the URL.
vi.mock("@/components/PokemonList", () => ({
  __esModule: true,
  default: ({ pokemon }: { pokemon: Pokemon[] }) => (
    <ul data-testid="pokemon-list">
      {pokemon.map((entry) => (
        <li key={entry.id}>{entry.name}</li>
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

const filters = (overrides: Partial<SearchFilterState> = {}): SearchFilterState => ({
  ...EMPTY_SEARCH_FILTERS,
  ...overrides,
});

const setPage = (page: string) =>
  vi
    .mocked(useSearchParams)
    .mockReturnValue(
      new URLSearchParams(page ? `page=${page}` : "") as unknown as ReturnType<
        typeof useSearchParams
      >,
    );

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
    data: { pokemonFilter: { pokemon: data, total } },
  } as unknown as ReturnType<typeof useQuery>);

beforeEach(() => {
  vi.clearAllMocks();
  vi.spyOn(window.history, "pushState").mockImplementation(() => {});
  vi.spyOn(window.history, "replaceState").mockImplementation(() => {});
  setPage("");
  setResults();
});

describe("SearchResults", () => {
  describe("the query", () => {
    it("sends every facet as one filter rather than one query per facet", () => {
      render(
        <SearchResults filters={filters({ q: "char", types: ["fire"], regions: ["kanto"] })} />,
      );

      expect(vi.mocked(useQuery).mock.calls[0][1]).toMatchObject({
        variables: {
          filter: { query: "char", types: ["fire"], regions: ["kanto"] },
          limit: 20,
          offset: 0,
        },
      });
    });

    it("offsets by the page in the URL", () => {
      setPage("3");

      render(<SearchResults filters={filters({ types: ["fire"] })} />);

      expect(vi.mocked(useQuery).mock.calls[0][1]).toMatchObject({
        variables: { limit: 20, offset: 40 },
      });
    });

    it("asks for the whole dex when nothing is filtered", () => {
      render(<SearchResults filters={filters()} />);

      expect(vi.mocked(useQuery).mock.calls[0][1]).toMatchObject({ variables: { filter: {} } });
    });
  });

  describe("rendering", () => {
    it("names the results after what was asked for", () => {
      render(<SearchResults filters={filters({ q: "char" })} />);

      expect(
        screen.getByRole("heading", { name: 'Search results for "char"' }),
      ).toBeInTheDocument();
    });

    it("shows a full page of placeholders on the first load", () => {
      vi.mocked(useQuery).mockReturnValue({
        loading: true,
        data: undefined,
        previousData: undefined,
      } as unknown as ReturnType<typeof useQuery>);

      render(<SearchResults filters={filters({ q: "char" })} />);

      expect(screen.getByTestId("pokemon-list-skeleton")).toHaveTextContent("20");
      expect(screen.queryByTestId("pokemon-list")).not.toBeInTheDocument();
    });

    it("keeps the current grid up while the next result set loads", () => {
      vi.mocked(useQuery).mockReturnValue({
        loading: true,
        data: undefined,
        previousData: { pokemonFilter: { pokemon, total: 1 } },
      } as unknown as ReturnType<typeof useQuery>);

      render(<SearchResults filters={filters({ q: "char" })} />);

      expect(screen.queryByTestId("pokemon-list-skeleton")).not.toBeInTheDocument();
      expect(screen.getByText("charmander")).toBeInTheDocument();
    });

    it("shows the matches once they land", () => {
      render(<SearchResults filters={filters({ q: "char" })} />);

      expect(screen.getByText("charmander")).toBeInTheDocument();
    });

    it("holds the pagination bar in place while the next page loads", () => {
      vi.mocked(useQuery).mockReturnValue({
        loading: true,
        data: undefined,
        previousData: { pokemonFilter: { pokemon, total: 60 } },
      } as unknown as ReturnType<typeof useQuery>);

      render(<SearchResults filters={filters({ q: "char" })} />);

      expect(screen.getByTestId("pagination")).toHaveTextContent("of 60");
    });
  });

  describe("paging", () => {
    it("moves through pages without re-running the server page", async () => {
      const user = userEvent.setup();
      setResults({ total: 60 });

      render(<SearchResults filters={filters({ types: ["fire"] })} />);
      await user.click(screen.getByTestId("pagination"));

      expect(window.history.pushState).toHaveBeenCalledWith(null, "", "/search?types=fire&page=2");
    });

    it("falls back to the last page when a narrower filter leaves the URL past the end", () => {
      setPage("40");
      setResults({ total: 25 });

      render(<SearchResults filters={filters({ types: ["fire"] })} />);

      // Replace, not push, so Back doesn't land on the empty page again.
      expect(window.history.replaceState).toHaveBeenCalledWith(
        null,
        "",
        "/search?types=fire&page=2",
      );
    });

    it("leaves a page inside the results alone", () => {
      setPage("2");
      setResults({ total: 60 });

      render(<SearchResults filters={filters({ types: ["fire"] })} />);

      expect(window.history.replaceState).not.toHaveBeenCalled();
    });

    it("does not clamp an empty result set, which has no last page", () => {
      setPage("3");
      setResults({ total: 0, data: [] });

      render(<SearchResults filters={filters({ types: ["fire"] })} />);

      expect(window.history.replaceState).not.toHaveBeenCalled();
    });
  });
});
