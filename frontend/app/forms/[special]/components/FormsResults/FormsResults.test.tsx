import { useQuery } from "@apollo/client/react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useSearchParams } from "next/navigation";
import type { Pokemon } from "@/types";
import FormsResults from "./FormsResults";

vi.mock("@apollo/client/react", () => ({
  useQuery: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useSearchParams: vi.fn(),
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

const pokemon = [{ id: "10199", name: "pikachu-gmax" }] as Pokemon[];

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
    data: { pokemonForms: { pokemon: data, total } },
  } as unknown as ReturnType<typeof useQuery>);

beforeEach(() => {
  vi.clearAllMocks();
  vi.spyOn(window.history, "pushState").mockImplementation(() => {});
  vi.spyOn(window.history, "replaceState").mockImplementation(() => {});
  setPage("");
  setResults();
});

describe("FormsResults", () => {
  describe("the query", () => {
    it("asks the forms index for the collection", () => {
      render(<FormsResults special="gmax" />);

      expect(vi.mocked(useQuery).mock.calls[0][1]).toMatchObject({
        variables: { query: "gmax", limit: 20, offset: 0 },
      });
    });

    it("offsets by the page in the URL", () => {
      setPage("3");

      render(<FormsResults special="mega" />);

      expect(vi.mocked(useQuery).mock.calls[0][1]).toMatchObject({
        variables: { query: "mega", limit: 20, offset: 40 },
      });
    });
  });

  describe("rendering", () => {
    it("names the collection", () => {
      render(<FormsResults special="gmax" />);

      expect(screen.getByRole("heading", { name: "Gigantamax Pokemon" })).toBeInTheDocument();
    });

    it("titles the other collection too", () => {
      render(<FormsResults special="mega" />);

      expect(screen.getByRole("heading", { name: "Mega Evolve Pokemon" })).toBeInTheDocument();
    });

    it("shows a full page of placeholders on the first load", () => {
      vi.mocked(useQuery).mockReturnValue({
        loading: true,
        data: undefined,
      } as unknown as ReturnType<typeof useQuery>);

      render(<FormsResults special="gmax" />);

      expect(screen.getByTestId("pokemon-list-skeleton")).toHaveTextContent("20");
    });

    it("keeps the previous grid up while the next page lands", () => {
      vi.mocked(useQuery).mockReturnValue({
        loading: true,
        data: undefined,
        previousData: { pokemonForms: { pokemon, total: 1 } },
      } as unknown as ReturnType<typeof useQuery>);

      render(<FormsResults special="gmax" />);

      expect(screen.getByTestId("pokemon-list")).toHaveTextContent("pikachu-gmax");
      expect(screen.queryByTestId("pokemon-list-skeleton")).not.toBeInTheDocument();
    });
  });

  describe("paging", () => {
    it("puts the next page in the URL without re-running the server page", async () => {
      const user = userEvent.setup();
      setResults({ total: 100 });

      render(<FormsResults special="gmax" />);
      await user.click(screen.getByTestId("pagination"));

      expect(window.history.pushState).toHaveBeenCalledWith(null, "", "/forms/gmax?page=2");
    });

    it("clamps a page past the end of the collection", () => {
      setPage("9");
      setResults({ total: 21 });

      render(<FormsResults special="gmax" />);

      expect(window.history.replaceState).toHaveBeenCalledWith(null, "", "/forms/gmax?page=2");
    });

    it("leaves an empty collection alone rather than clamping to page zero", () => {
      setPage("3");
      setResults({ total: 0, data: [] });

      render(<FormsResults special="gmax" />);

      expect(window.history.replaceState).not.toHaveBeenCalled();
    });
  });
});
