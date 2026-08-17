import { render, screen } from "@testing-library/react";
import { ChipList } from "./ChipList";

describe("ChipList", () => {
  it("renders a chip per item", () => {
    render(<ChipList items={["Red Blue", "Yellow"]} />);

    expect(screen.getAllByRole("listitem")).toHaveLength(2);
    expect(screen.getByText("Red Blue")).toBeInTheDocument();
    expect(screen.getByText("Yellow")).toBeInTheDocument();
  });

  it("renders items as given, leaving formatting to the caller", () => {
    render(<ChipList items={["letsgo-kanto"]} />);

    expect(screen.getByText("letsgo-kanto")).toBeInTheDocument();
  });

  it("renders an empty list without complaint", () => {
    render(<ChipList items={[]} />);

    expect(screen.queryAllByRole("listitem")).toHaveLength(0);
    expect(screen.getByRole("list")).toBeInTheDocument();
  });

  it("accepts a class from the caller", () => {
    const { container } = render(<ChipList items={["Yellow"]} className="tight" />);

    expect(container.firstChild).toHaveClass("tight");
  });
});
