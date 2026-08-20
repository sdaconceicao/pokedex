import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { PokedexFamily } from "@/lib/pokedexFamilies";
import type { PokedexDetail } from "@/types";
import { PokedexHero } from "./PokedexHero";

const mockPush = vi.fn();

// useSortParam reads the sort out of the URL via this hook; the switcher
// navigates with the router.
vi.mock("next/navigation", () => ({
  useSearchParams: () => new URLSearchParams(),
  useRouter: () => ({ push: mockPush }),
}));

const johto: PokedexFamily = {
  place: "Johto",
  variants: [
    { name: "original-johto", label: "Original", count: 251 },
    { name: "updated-johto", label: "Updated", count: 256 },
  ],
};

const updatedJohto: PokedexDetail = {
  id: "7",
  name: "updated-johto",
  displayName: "Updated Johto",
  description: null,
  region: "johto",
  pokemonCount: 256,
  versionGroups: ["heartgold-soulsilver"],
  isMainSeries: true,
};

beforeEach(() => {
  mockPush.mockClear();
});

const kanto: PokedexDetail = {
  id: "2",
  name: "kanto",
  displayName: "Kanto",
  description: "Red and Blue version Pokémon",
  region: "kanto",
  pokemonCount: 151,
  versionGroups: ["red-blue", "yellow"],
  isMainSeries: true,
};

describe("PokedexHero", () => {
  it("renders the pokedex name as the page heading", () => {
    render(<PokedexHero pokedex={kanto} />);

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Kanto");
  });

  it("renders the dex's description", () => {
    render(<PokedexHero pokedex={kanto} />);

    expect(screen.getByText("Red and Blue version Pokémon")).toBeInTheDocument();
  });

  it("omits the description when the API doesn't give one", () => {
    render(<PokedexHero pokedex={{ ...kanto, description: null }} />);

    expect(screen.queryByText(/version Pokémon/)).not.toBeInTheDocument();
  });

  it("marks a main series dex apart from a spin-off", () => {
    const { unmount } = render(<PokedexHero pokedex={kanto} />);
    expect(screen.getByText("Main series")).toBeInTheDocument();
    unmount();

    render(<PokedexHero pokedex={{ ...kanto, isMainSeries: false }} />);
    expect(screen.getByText("Spin-off")).toBeInTheDocument();
    expect(screen.queryByText("Main series")).not.toBeInTheDocument();
  });

  it("counts the dex's entries", () => {
    render(<PokedexHero pokedex={kanto} />);

    expect(screen.getByText("Pokemon").nextSibling).toHaveTextContent("151");
  });

  it("renders a chip for the region and every game, humanized", () => {
    render(<PokedexHero pokedex={kanto} />);

    expect(screen.getByText("Kanto", { selector: "li" })).toBeInTheDocument();
    expect(screen.getByText("Red Blue")).toBeInTheDocument();
    expect(screen.getByText("Yellow")).toBeInTheDocument();
  });

  it("drops the region row for a dex the API ties to no region", () => {
    render(<PokedexHero pokedex={{ ...kanto, region: null }} />);

    expect(screen.queryByText("Region")).not.toBeInTheDocument();
    // The games row is untouched
    expect(screen.getByText("Games")).toBeInTheDocument();
  });

  // The national dex and the spin-offs have neither upstream, and an empty
  // footer strip under the body is what showed up the first time round.
  it("drops the whole footer for a dex with no region and no games", () => {
    const { container } = render(
      <PokedexHero pokedex={{ ...kanto, region: null, versionGroups: [] }} />,
    );

    expect(screen.queryByText("Region")).not.toBeInTheDocument();
    expect(screen.queryByText("Games")).not.toBeInTheDocument();
    expect(container.querySelector("[class*=heroFooter]")).toBeNull();
  });

  describe("a dex with several revisions", () => {
    it("is titled by the place the revisions share, not the revision itself", () => {
      render(<PokedexHero pokedex={updatedJohto} family={johto} />);

      // "Updated Johto" would repeat what the switcher already says
      expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Johto");
    });

    it("offers every revision and marks the one on screen", () => {
      render(<PokedexHero pokedex={updatedJohto} family={johto} />);

      const group = screen.getByRole("radiogroup", { name: "Dex revision" });
      expect(
        within(group)
          .getAllByRole("radio")
          .map((item) => item.textContent),
      ).toEqual(["Original", "Updated"]);
      expect(within(group).getByRole("radio", { name: "Updated" })).toBeChecked();
    });

    it("navigates to the picked revision, back at page 1", async () => {
      const user = userEvent.setup();
      render(<PokedexHero pokedex={updatedJohto} family={johto} />);

      await user.click(screen.getByRole("radio", { name: "Original" }));

      expect(mockPush).toHaveBeenCalledWith("/pokedex/original-johto");
    });

    it("shows no switcher for a dex that stands alone", () => {
      render(<PokedexHero pokedex={kanto} />);

      expect(screen.queryByRole("radiogroup", { name: "Dex revision" })).not.toBeInTheDocument();
      expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Kanto");
    });
  });
});
