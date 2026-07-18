import { render, screen } from "@testing-library/react";
import { Logo } from "./Logo";

describe("Logo", () => {
  it("renders the Pokédex wordmark", () => {
    render(<Logo />);

    expect(screen.getByText("Poképendium")).toBeInTheDocument();
  });

  it("applies a custom className", () => {
    render(<Logo className="custom" />);

    expect(screen.getByText("Poképendium")).toHaveClass("custom");
  });
});
