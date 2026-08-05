import { render, screen } from "@testing-library/react";
import type { RegionDetail } from "@/types";
import { RegionHero } from "./RegionHero";

const kanto: RegionDetail = {
  id: "1",
  name: "kanto",
  displayName: "Kanto",
  generation: "generation-i",
  pokemonCount: 232,
  locations: ["pallet-town", "viridian-forest"],
  pokedexes: ["kanto", "letsgo-kanto"],
  versionGroups: ["red-blue", "yellow"],
};

describe("RegionHero", () => {
  it("renders the region name as the page heading", () => {
    render(<RegionHero region={kanto} />);

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Kanto");
  });

  it("renders the formatted generation", () => {
    render(<RegionHero region={kanto} />);

    expect(screen.getByText("Generation I")).toBeInTheDocument();
  });

  it("omits the generation when the API doesn't give one", () => {
    render(<RegionHero region={{ ...kanto, generation: null }} />);

    expect(screen.queryByText(/generation/i)).not.toBeInTheDocument();
  });

  it("counts the region's Pokemon and locations", () => {
    render(<RegionHero region={kanto} />);

    expect(screen.getByText("Pokemon").nextSibling).toHaveTextContent("232");
    expect(screen.getByText("Locations").nextSibling).toHaveTextContent("2");
  });

  it("renders a chip for every pokedex and game, humanized", () => {
    render(<RegionHero region={kanto} />);

    expect(screen.getByText("Letsgo Kanto")).toBeInTheDocument();
    expect(screen.getByText("Red Blue")).toBeInTheDocument();
    expect(screen.getByText("Yellow")).toBeInTheDocument();
  });

  it("drops a fact row the API returned empty", () => {
    render(<RegionHero region={{ ...kanto, versionGroups: [] }} />);

    expect(screen.queryByText("Games")).not.toBeInTheDocument();
    expect(screen.queryByText("Red Blue")).not.toBeInTheDocument();
    // The pokedex row is untouched
    expect(screen.getByText("Pokedexes")).toBeInTheDocument();
  });
});
