import { render, screen } from "@testing-library/react";
import { CountPill } from "./CountPill";

describe("CountPill", () => {
  it("renders the figure and what it counts", () => {
    render(<CountPill value={153} label="Pokemon" />);

    expect(screen.getByText("153")).toBeInTheDocument();
    expect(screen.getByText(/Pokemon/)).toBeInTheDocument();
  });

  it("emphasises the figure", () => {
    render(<CountPill value={96} label="Locations" />);

    expect(screen.getByText("96").tagName).toBe("STRONG");
  });

  it("accepts a class from the caller", () => {
    const { container } = render(<CountPill value={1} label="Move" className="tight" />);

    expect(container.firstChild).toHaveClass("tight");
  });
});
