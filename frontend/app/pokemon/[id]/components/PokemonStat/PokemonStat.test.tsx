import { render, screen } from "@testing-library/react";
import { PokemonStat } from "./PokemonStat";

describe("PokemonStat Component", () => {
  it("should render stat name correctly", () => {
    render(<PokemonStat name="HP" value={100} />);
    expect(screen.getByText("HP")).toBeInTheDocument();
  });

  it("should render stat value correctly", () => {
    render(<PokemonStat name="Attack" value={85} />);
    expect(screen.getByText("85")).toBeInTheDocument();
  });

  it("should render both name and value", () => {
    render(<PokemonStat name="Defense" value={120} />);
    expect(screen.getByText("Defense")).toBeInTheDocument();
    expect(screen.getByText("120")).toBeInTheDocument();
  });

  it("should apply correct width percentage to stat fill bar", () => {
    render(<PokemonStat name="Speed" value={255} />);
    const statFill = screen
      .getByText("Speed")
      .parentElement?.querySelector('[class*="statFill"]');
    expect(statFill).toHaveStyle({ width: "100%" });
  });

  it("should apply correct width percentage for minimum stat value", () => {
    render(<PokemonStat name="Special Attack" value={0} />);
    const statFill = screen
      .getByText("Special Attack")
      .parentElement?.querySelector('[class*="statFill"]');
    expect(statFill).toHaveStyle({ width: "0%" });
  });

  it("should apply correct width percentage for middle stat value", () => {
    render(<PokemonStat name="Special Defense" value={127} />);
    const statFill = screen
      .getByText("Special Defense")
      .parentElement?.querySelector('[class*="statFill"]');
    // Check that the width is approximately 49.8% (allowing for floating point precision)
    const computedWidth = statFill?.getAttribute("style");
    expect(computedWidth).toContain("width: 49.8");
  });

  it("should apply correct width percentage for high stat value", () => {
    render(<PokemonStat name="HP" value={200} />);
    const statFill = screen
      .getByText("HP")
      .parentElement?.querySelector('[class*="statFill"]');
    // Check that the width is approximately 78.4% (allowing for floating point precision)
    const computedWidth = statFill?.getAttribute("style");
    expect(computedWidth).toContain("width: 78.4");
  });

  it("should handle decimal stat values correctly", () => {
    render(<PokemonStat name="Attack" value={127.5} />);
    const statFill = screen
      .getByText("Attack")
      .parentElement?.querySelector('[class*="statFill"]');
    expect(statFill).toHaveStyle({ width: "50%" });
  });

  it("should render multiple stats with different values", () => {
    const stats = [
      { name: "HP", value: 100 },
      { name: "Attack", value: 150 },
      { name: "Defense", value: 200 },
    ];

    stats.forEach(({ name, value }) => {
      render(<PokemonStat key={name} name={name} value={value} />);
      expect(screen.getByText(name)).toBeInTheDocument();
      expect(screen.getByText(value.toString())).toBeInTheDocument();
    });
  });

  it("should have proper CSS classes applied", () => {
    render(<PokemonStat name="Speed" value={180} />);
    const statItem = screen.getByText("Speed").closest('[class*="statItem"]');
    const statLabel = screen.getByText("Speed");
    const statValue = screen.getByText("180");
    const statBar = statItem?.querySelector('[class*="statBar"]');
    const statFill = statItem?.querySelector('[class*="statFill"]');

    expect(statItem).toBeInTheDocument();
    expect(statLabel).toBeInTheDocument();
    expect(statValue).toBeInTheDocument();
    expect(statBar).toBeInTheDocument();
    expect(statFill).toBeInTheDocument();
  });
});
