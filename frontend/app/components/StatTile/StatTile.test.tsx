import { render, screen } from "@testing-library/react";
import { StatTile } from "./StatTile";

describe("StatTile", () => {
  it("renders the label and the figure", () => {
    render(
      <dl>
        <StatTile label="Pokemon" value={153} />
      </dl>,
    );

    expect(screen.getByText("Pokemon")).toBeInTheDocument();
    expect(screen.getByText("153")).toBeInTheDocument();
  });

  it("pairs them as a term and its definition", () => {
    render(
      <dl>
        <StatTile label="Locations" value={96} />
      </dl>,
    );

    const label = screen.getByText("Locations");
    expect(label.tagName).toBe("DT");
    expect(label.nextElementSibling).toBe(screen.getByText("96"));
    expect(screen.getByText("96").tagName).toBe("DD");
  });

  it("takes a value that isn't a number", () => {
    render(
      <dl>
        <StatTile label="Generation" value={<em>I</em>} />
      </dl>,
    );

    expect(screen.getByText("I")).toBeInTheDocument();
  });

  it("accepts a class from the caller", () => {
    const { container } = render(
      <dl>
        <StatTile label="Pokemon" value={1} className="wide" />
      </dl>,
    );

    expect(container.querySelector(".wide")).toBeInTheDocument();
  });
});
