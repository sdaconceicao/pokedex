import { render, screen } from "@testing-library/react";
import { PokemonTypePill } from "./PokemonTypePill";

describe("PokemonTypePill", () => {
  const defaultProps = {
    type: "fire",
  };

  it("renders with correct type text", () => {
    render(<PokemonTypePill {...defaultProps} />);
    expect(screen.getByText("fire")).toBeInTheDocument();
  });

  it("applies correct CSS classes", () => {
    render(<PokemonTypePill {...defaultProps} />);
    const pill = screen.getByText("fire");
    expect(pill).toHaveClass("pokemonTypePill", "fire");
  });

  it("handles different Pokemon types", () => {
    const { rerender } = render(<PokemonTypePill type="water" />);
    expect(screen.getByText("water")).toBeInTheDocument();
    expect(screen.getByText("water")).toHaveClass("pokemonTypePill", "water");

    rerender(<PokemonTypePill type="grass" />);
    expect(screen.getByText("grass")).toBeInTheDocument();
    expect(screen.getByText("grass")).toHaveClass("pokemonTypePill", "grass");
  });

  it("handles uppercase type names", () => {
    render(<PokemonTypePill type="ELECTRIC" />);
    const pill = screen.getByText("ELECTRIC");
    expect(pill).toHaveClass("pokemonTypePill", "electric");
  });

  it("applies custom className when provided", () => {
    render(<PokemonTypePill {...defaultProps} className="custom-class" />);
    const pill = screen.getByText("fire");
    expect(pill).toHaveClass("pokemonTypePill", "fire", "custom-class");
  });

  it("renders without custom className when not provided", () => {
    render(<PokemonTypePill {...defaultProps} />);
    const pill = screen.getByText("fire");
    expect(pill).not.toHaveClass("undefined");
  });

  it("renders as a span element", () => {
    render(<PokemonTypePill {...defaultProps} />);
    const pill = screen.getByText("fire");
    expect(pill.tagName).toBe("SPAN");
  });

  it("renders an icon inside the pill when provided", () => {
    const { container } = render(
      <PokemonTypePill {...defaultProps} icon={<svg data-testid="icon" />} />,
    );
    const pill = container.querySelector(".pokemonTypePill");
    expect(pill?.querySelector("[data-testid='icon']")).toBeInTheDocument();
  });

  it("renders without an icon wrapper when no icon is provided", () => {
    render(<PokemonTypePill {...defaultProps} />);
    const pill = screen.getByText("fire");
    expect(pill.querySelector("svg")).not.toBeInTheDocument();
  });
});
