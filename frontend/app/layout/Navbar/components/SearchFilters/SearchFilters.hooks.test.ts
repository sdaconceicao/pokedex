import { useApolloClient } from "@apollo/client/react";
import { act, renderHook, waitFor } from "@testing-library/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSearchFilterForm } from "./SearchFilters.hooks";

vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
  useSearchParams: vi.fn(),
}));

vi.mock("@apollo/client/react", () => ({
  useApolloClient: vi.fn(),
}));

const mockPush = vi.fn();
const mockQuery = vi.fn();

/** The hook holds the params by identity, so one instance per "navigation". */
const setParams = (search: string) =>
  vi
    .mocked(useSearchParams)
    .mockReturnValue(new URLSearchParams(search) as unknown as ReturnType<typeof useSearchParams>);

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(useRouter).mockReturnValue({ push: mockPush } as unknown as ReturnType<
    typeof useRouter
  >);
  vi.mocked(useApolloClient).mockReturnValue({ query: mockQuery } as unknown as ReturnType<
    typeof useApolloClient
  >);
  setParams("");
});

describe("useSearchFilterForm", () => {
  describe("seeding from the URL", () => {
    it("starts from what is already being filtered on", () => {
      setParams("q=char&types=fire,grass&dual=fire,flying&regions=kanto&pokedexes=national");

      const { result } = renderHook(() => useSearchFilterForm());

      expect(result.current.draft).toMatchObject({
        q: "char",
        types: ["fire", "grass"],
        regions: ["kanto"],
        pokedexes: ["national"],
        dualType: { primary: "fire", secondary: "flying" },
      });
    });

    it("re-seeds when the URL changes, so the header bar and the form agree", () => {
      const { result, rerender } = renderHook(() => useSearchFilterForm());
      expect(result.current.draft.q).toBe("");

      setParams("q=pikachu");
      rerender();

      expect(result.current.draft.q).toBe("pikachu");
    });

    it("exposes the dual type as the key its Select matches on", () => {
      setParams("dual=flying,fire");

      const { result } = renderHook(() => useSearchFilterForm());

      expect(result.current.dualTypeKey).toBe("fire,flying");
    });

    it("has no dual type key when none is selected", () => {
      const { result } = renderHook(() => useSearchFilterForm());

      expect(result.current.dualTypeKey).toBeNull();
    });
  });

  describe("editing", () => {
    it("records each facet without navigating", () => {
      const { result } = renderHook(() => useSearchFilterForm());

      act(() => result.current.setTypes(["fire", "grass"]));
      act(() => result.current.setRegions(["kanto"]));
      act(() => result.current.setPokedexes(["national"]));
      act(() => result.current.setName("char"));

      expect(result.current.draft).toMatchObject({
        types: ["fire", "grass"],
        regions: ["kanto"],
        pokedexes: ["national"],
        q: "char",
      });
      expect(mockPush).not.toHaveBeenCalled();
    });

    it("reads the dual type back out of the option key", () => {
      const { result } = renderHook(() => useSearchFilterForm());

      act(() => result.current.setDualTypeKey("fire,flying"));

      expect(result.current.draft.dualType).toEqual({ primary: "fire", secondary: "flying" });
    });

    it("clears the dual type when the Select is emptied", () => {
      setParams("dual=fire,flying");
      const { result } = renderHook(() => useSearchFilterForm());

      act(() => result.current.setDualTypeKey(null));

      expect(result.current.draft.dualType).toBeUndefined();
      expect(result.current.dualTypeKey).toBeNull();
    });
  });

  describe("submitting", () => {
    it("navigates to the results for the whole draft", () => {
      const { result } = renderHook(() => useSearchFilterForm());

      act(() => result.current.setTypes(["fire", "grass"]));
      act(() => result.current.setName("char"));
      act(() => result.current.submit());

      expect(mockPush).toHaveBeenCalledWith("/search?q=char&types=fire,grass");
    });

    it("drops the page, which belonged to the previous results", () => {
      setParams("types=fire&page=7");
      const { result } = renderHook(() => useSearchFilterForm());

      act(() => result.current.submit());

      expect(mockPush).toHaveBeenCalledWith("/search?types=fire");
    });

    it("browses the whole dex when nothing is filled in", () => {
      const { result } = renderHook(() => useSearchFilterForm());

      act(() => result.current.submit());

      expect(mockPush).toHaveBeenCalledWith("/search");
    });
  });

  describe("clearing", () => {
    it("empties the form and shows the unfiltered results", () => {
      setParams("types=fire&q=char");
      const { result } = renderHook(() => useSearchFilterForm());

      act(() => result.current.clear());

      expect(result.current.draft.types).toEqual([]);
      expect(result.current.draft.q).toBe("");
      expect(mockPush).toHaveBeenCalledWith("/search");
    });

    it("stays put when there was nothing to clear", () => {
      const { result } = renderHook(() => useSearchFilterForm());

      act(() => result.current.clear());

      expect(mockPush).not.toHaveBeenCalled();
    });
  });

  describe("name suggestions", () => {
    it("looks up matching names and returns them as suggestions", async () => {
      mockQuery.mockResolvedValue({
        data: { pokemonSearch: { pokemon: [{ id: "4", name: "charmander" }] } },
      });

      const { result } = renderHook(() => useSearchFilterForm());

      await expect(result.current.loadSuggestions("char")).resolves.toEqual([
        { id: "4", label: "charmander" },
      ]);
      expect(mockQuery).toHaveBeenCalledWith(
        expect.objectContaining({ variables: { query: "char", limit: 8 } }),
      );
    });

    it("does not fetch for a query too short to narrow anything", async () => {
      const { result } = renderHook(() => useSearchFilterForm());

      await expect(result.current.loadSuggestions("c")).resolves.toEqual([]);
      await expect(result.current.loadSuggestions("  ")).resolves.toEqual([]);
      expect(mockQuery).not.toHaveBeenCalled();
    });

    it("offers nothing rather than failing when the lookup errors", async () => {
      mockQuery.mockRejectedValue(new Error("offline"));

      const { result } = renderHook(() => useSearchFilterForm());

      await expect(result.current.loadSuggestions("char")).resolves.toEqual([]);
    });

    it("survives a response with no matches", async () => {
      mockQuery.mockResolvedValue({ data: { pokemonSearch: null } });

      const { result } = renderHook(() => useSearchFilterForm());

      await waitFor(async () => {
        await expect(result.current.loadSuggestions("char")).resolves.toEqual([]);
      });
    });
  });
});
