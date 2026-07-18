import { render, screen } from "@testing-library/react";
import { Pokeball } from "./Pokeball";

describe("Pokeball", () => {
  it("renders at the default size", () => {
    render(<Pokeball />);

    const icon = screen.getByTestId("pokeball");
    expect(icon).toHaveAttribute("width", "24");
    expect(icon).toHaveAttribute("height", "24");
  });

  it("renders at a custom size with a custom className", () => {
    render(<Pokeball size={40} className="custom" />);

    const icon = screen.getByTestId("pokeball");
    expect(icon).toHaveAttribute("width", "40");
    expect(icon).toHaveAttribute("height", "40");
    expect(icon).toHaveClass("custom");
  });
});
