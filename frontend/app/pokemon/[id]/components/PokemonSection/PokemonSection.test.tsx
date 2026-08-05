import { render, screen } from "@testing-library/react";
import { PokemonSection } from "./PokemonSection";

describe("PokemonSection", () => {
  it("renders the title as a level 2 heading", () => {
    render(<PokemonSection title="Base Stats">content</PokemonSection>);

    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent("Base Stats");
  });

  it("renders its children", () => {
    render(
      <PokemonSection title="Abilities">
        <p>Blaze</p>
      </PokemonSection>,
    );

    expect(screen.getByText("Blaze")).toBeInTheDocument();
  });

  it("applies the caller's type class so the --type-* palette cascades in", () => {
    const { container } = render(
      <PokemonSection title="Evolution" className="type-fire">
        content
      </PokemonSection>,
    );

    expect(container.firstChild).toHaveClass("type-fire");
  });

  it("renders without a className", () => {
    const { container } = render(<PokemonSection title="Evolution">content</PokemonSection>);

    expect(container.firstChild).toBeInTheDocument();
  });
});
