import { render, screen } from "@testing-library/react";
import { PokeballMark } from "./PokeballMark";

describe("PokeballMark", () => {
  it("renders an svg marked as decorative", () => {
    render(<PokeballMark />);

    const mark = screen.getByTestId("pokeball-mark");
    expect(mark.tagName.toLowerCase()).toBe("svg");
    expect(mark).toHaveAttribute("aria-hidden", "true");
  });

  it("applies a custom className", () => {
    render(<PokeballMark className="custom" />);

    expect(screen.getByTestId("pokeball-mark")).toHaveClass("custom");
  });
});
