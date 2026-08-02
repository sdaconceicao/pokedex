import { render } from "@testing-library/react";
import { TypeTag } from "./TypeTag";

describe("TypeTag", () => {
  it("renders the type pill", () => {
    const { container } = render(<TypeTag type="fire" />);

    expect(container.querySelector(".pokemonTypePill")).toHaveTextContent("fire");
  });

  it("renders the matching sidebar icon inside the pill", () => {
    const { container } = render(<TypeTag type="fire" />);

    const pill = container.querySelector(".pokemonTypePill");
    expect(pill?.querySelector("svg")).toBeInTheDocument();
  });

  it("falls back to the normal icon for an unknown type", () => {
    const { container } = render(<TypeTag type="bacon" />);

    const pill = container.querySelector(".pokemonTypePill");
    expect(pill?.querySelector("svg")).toBeInTheDocument();
    expect(pill).toHaveTextContent("bacon");
  });

  it("applies a custom className to the pill", () => {
    const { container } = render(<TypeTag type="fire" className="custom" />);

    expect(container.querySelector(".pokemonTypePill")).toHaveClass("custom");
  });
});
