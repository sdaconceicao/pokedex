import { render, screen } from "@testing-library/react";
import { MatchupChip } from "./MatchupChip";

describe("MatchupChip", () => {
  it("shows the type name capitalised, as real text", () => {
    render(<MatchupChip type="flying" tint="good" />);

    expect(screen.getByText("Flying")).toBeInTheDocument();
  });

  it("hides the icon from assistive tech, since the name already carries it", () => {
    const { container } = render(<MatchupChip type="flying" tint="good" />);
    const icon = container.querySelector('[class*="chipIcon"]');

    expect(icon).toHaveAttribute("aria-hidden", "true");
  });

  it("applies the tint it was given", () => {
    for (const tint of ["good", "bad", "none"] as const) {
      const { unmount } = render(<MatchupChip type="rock" tint={tint} />);

      expect(screen.getByText("Rock").className).toMatch(new RegExp(tint));
      unmount();
    }
  });
});
