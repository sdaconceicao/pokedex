import { useApolloClient } from "@apollo/client/react";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useRouter, useSearchParams } from "next/navigation";
import SearchFilters from "./SearchFilters";

vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
  useSearchParams: vi.fn(),
}));

vi.mock("@apollo/client/react", () => ({
  useApolloClient: vi.fn(),
}));

const mockPush = vi.fn();
const mockQuery = vi.fn();

const types = [
  { name: "fire", count: 60 },
  { name: "flying", count: 100 },
  { name: "grass", count: 90 },
];
const regions = [{ name: "kanto", count: 151 }];
const pokedexes = [{ name: "letsgo-kanto", count: 153 }];

const setParams = (search: string) =>
  vi
    .mocked(useSearchParams)
    .mockReturnValue(new URLSearchParams(search) as unknown as ReturnType<typeof useSearchParams>);

const renderFilters = () =>
  render(<SearchFilters types={types} regions={regions} pokedexes={pokedexes} />);

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

describe("SearchFilters", () => {
  describe("rendering", () => {
    it("renders a field for every facet", () => {
      renderFilters();

      expect(screen.getByRole("combobox", { name: "Types" })).toBeInTheDocument();
      expect(screen.getByRole("combobox", { name: /Dual type/ })).toBeInTheDocument();
      expect(screen.getByRole("combobox", { name: "Regions" })).toBeInTheDocument();
      expect(screen.getByRole("combobox", { name: "Pokedexes" })).toBeInTheDocument();
      expect(screen.getByRole("searchbox", { name: "Name" })).toBeInTheDocument();
    });

    it("is a labelled search landmark, so it is distinct from the header bar", () => {
      const { container } = renderFilters();

      expect(container.querySelector("search")).toHaveAttribute("aria-label", "Filter Pokemon");
    });

    it("explains that values widen within a field and narrow across fields", () => {
      renderFilters();

      expect(screen.getByText(/widen the results/i)).toBeInTheDocument();
    });

    it("warns that dual type widens rather than narrows", () => {
      renderFilters();

      expect(screen.getByText(/Widens the search/i)).toBeInTheDocument();
    });

    it("offers Search and Clear", () => {
      renderFilters();

      expect(screen.getByRole("button", { name: "Search with these filters" })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Clear" })).toBeInTheDocument();
    });
  });

  describe("options", () => {
    it("lists the types it was given", async () => {
      const user = userEvent.setup();
      renderFilters();

      await user.click(screen.getByRole("combobox", { name: "Types" }));

      const listbox = await screen.findByRole("listbox");
      expect(within(listbox).getByRole("option", { name: "Fire" })).toBeInTheDocument();
      expect(within(listbox).getByRole("option", { name: "Grass" })).toBeInTheDocument();
    });

    it("humanizes a hyphenated pokedex slug", async () => {
      const user = userEvent.setup();
      renderFilters();

      await user.click(screen.getByRole("combobox", { name: "Pokedexes" }));

      expect(
        within(await screen.findByRole("listbox")).getByRole("option", { name: "Letsgo Kanto" }),
      ).toBeInTheDocument();
    });

    it("narrows a multi-select as you type", async () => {
      const user = userEvent.setup();
      renderFilters();

      await user.click(screen.getByRole("combobox", { name: "Types" }));
      expect(within(await screen.findByRole("listbox")).getAllByRole("option")).toHaveLength(3);

      await user.keyboard("fl");

      const listbox = await screen.findByRole("listbox");
      expect(within(listbox).getAllByRole("option")).toHaveLength(1);
      expect(within(listbox).getByRole("option", { name: "Flying" })).toBeInTheDocument();
    });

    it("narrows the dual type pairs as you type", async () => {
      const user = userEvent.setup();
      renderFilters();

      await user.click(screen.getByRole("combobox", { name: /Dual type/ }));
      await user.keyboard("grass");

      const listbox = await screen.findByRole("listbox");
      // Of the three pairs, only Fire / Grass and Flying / Grass mention grass
      expect(within(listbox).getAllByRole("option")).toHaveLength(2);
    });

    it("offers every pair of types as a dual type", async () => {
      const user = userEvent.setup();
      renderFilters();

      await user.click(screen.getByRole("combobox", { name: /Dual type/ }));

      const listbox = await screen.findByRole("listbox");
      // Three types make three pairs, each written in the same order the URL uses.
      expect(within(listbox).getAllByRole("option")).toHaveLength(3);
      expect(within(listbox).getByRole("option", { name: "Fire / Flying" })).toBeInTheDocument();
    });
  });

  describe("searching", () => {
    it("navigates to the results for what was picked", async () => {
      const user = userEvent.setup();
      renderFilters();

      await user.click(screen.getByRole("combobox", { name: "Types" }));
      await user.click(
        within(await screen.findByRole("listbox")).getByRole("option", { name: "Fire" }),
      );
      // Options stay visible after a pick so several can be toggled; the
      // popover has to close before the rest of the sidebar is reachable again.
      await user.keyboard("{Escape}");

      await user.click(screen.getByRole("button", { name: "Search with these filters" }));

      expect(mockPush).toHaveBeenCalledWith("/search?types=fire");
    });

    it("searches on Enter in the name field, without a form to fight over it", async () => {
      const user = userEvent.setup();
      renderFilters();

      await user.type(screen.getByRole("searchbox", { name: "Name" }), "char{Enter}");

      expect(mockPush).toHaveBeenCalledWith("/search?q=char");
    });

    it("restores the fields from the URL", () => {
      setParams("q=char&types=fire&dual=fire,flying");
      renderFilters();

      expect(screen.getByRole("searchbox", { name: "Name" })).toHaveValue("char");
      expect(screen.getByRole("combobox", { name: /Dual type/ })).toHaveValue("Fire / Flying");
    });

    it("empties the fields and shows the unfiltered results on Clear", async () => {
      const user = userEvent.setup();
      setParams("q=char&types=fire");
      renderFilters();

      await user.click(screen.getByRole("button", { name: "Clear" }));

      expect(screen.getByRole("searchbox", { name: "Name" })).toHaveValue("");
      expect(mockPush).toHaveBeenCalledWith("/search");
    });
  });
});
