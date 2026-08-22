import { render, screen } from "@testing-library/react";
import { MatchupRow } from "./MatchupRow";

describe("MatchupRow", () => {
  it("labels the row and lists a chip per type", () => {
    render(<MatchupRow label="2×" tint="bad" types={["fire", "water"]} />);

    expect(screen.getByText("2×")).toBeInTheDocument();
    expect(screen.getByText("Fire")).toBeInTheDocument();
    expect(screen.getByText("Water")).toBeInTheDocument();
  });

  it("says None instead of leaving the row blank", () => {
    render(<MatchupRow label="0×" tint="none" types={[]} />);

    expect(screen.getByText("None")).toBeInTheDocument();
  });

  it("passes its tint down to every chip", () => {
    render(<MatchupRow label="½×" tint="good" types={["fire", "water"]} />);

    for (const name of ["Fire", "Water"]) {
      expect(screen.getByText(name).className).toMatch(/good/);
    }
  });

  it("holds the row together when the label is blank, for an empty group", () => {
    render(<MatchupRow label="" tint="none" types={[]} />);

    expect(screen.getByText("None")).toBeInTheDocument();
  });
});
