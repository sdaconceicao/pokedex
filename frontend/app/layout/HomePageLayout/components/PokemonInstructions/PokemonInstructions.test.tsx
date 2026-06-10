import { render, screen } from "@testing-library/react";
import { PokemonInstructions } from "./PokemonInstructions";

describe("PokemonInstructions", () => {
  it("renders instructions text", () => {
    render(<PokemonInstructions />);

    expect(
      screen.getByText(
        "Select a Pokemon type, pokedex, or region from the sidebar or search for Pokemon to get started"
      )
    ).toBeInTheDocument();
  });
});
