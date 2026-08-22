import { render, screen, within } from "@testing-library/react";
import type { PokemonMatchups as MatchupsData } from "@/types";
import { PokemonMatchups } from "./PokemonMatchups";

// Magcargo (fire/rock), as the backend actually returns it: the one Pokemon that
// shows Flying on both sides at once — dealt 2x by its Rock, taken at ½x.
const magcargo: MatchupsData = {
  attacking: [
    {
      type: "fire",
      superEffective: ["bug", "steel", "grass", "ice"],
      notVeryEffective: ["rock", "fire", "water", "dragon"],
      noEffect: [],
    },
    {
      type: "rock",
      superEffective: ["flying", "bug", "fire", "ice"],
      notVeryEffective: ["fighting", "ground", "steel"],
      noEffect: [],
    },
  ],
  defending: [
    { type: "ground", multiplier: 4 },
    { type: "water", multiplier: 4 },
    { type: "fighting", multiplier: 2 },
    { type: "flying", multiplier: 0.5 },
    { type: "fire", multiplier: 0.25 },
  ],
};

const render219 = () => render(<PokemonMatchups matchups={magcargo} type="fire" />);

/** Several types appear in both columns, so a tint assertion has to say which
 *  side it means. The column heading is the handle. */
const column = (name: string) =>
  screen.getByRole("heading", { level: 3, name }).parentElement as HTMLElement;

describe("PokemonMatchups", () => {
  it("labels the two columns as level 3 headings", () => {
    render219();

    expect(screen.getByRole("heading", { level: 3, name: "Attacking" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 3, name: "Defending" })).toBeInTheDocument();
  });

  it("gives each attacking type its own level 4 group, never merging them", () => {
    render219();

    expect(screen.getByRole("heading", { level: 4, name: "Fire" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 4, name: "Rock" })).toBeInTheDocument();
  });

  it("heads the defensive groups even when one has nothing in it", () => {
    render219();

    for (const heading of ["Weak to", "Resists", "Immune"]) {
      expect(screen.getByRole("heading", { level: 4, name: heading })).toBeInTheDocument();
    }
  });

  it("says None where a group has no types rather than leaving a gap", () => {
    render219();

    // Immune, plus No-effect for each of the two attacking types
    expect(screen.getAllByText("None")).toHaveLength(3);
  });

  it("labels every row by multiplier, on both sides", () => {
    render219();

    expect(screen.getByText("4×")).toBeInTheDocument();
    expect(screen.getAllByText("2×").length).toBeGreaterThan(1);
    expect(screen.getByText("¼×")).toBeInTheDocument();
  });

  it("shows a type name as text, so the icon beside it is decorative only", () => {
    const { container } = render219();

    // Flying appears twice: dealt 2x by Rock, and taken at ½x
    expect(screen.getAllByText("Flying")).toHaveLength(2);
    for (const icon of container.querySelectorAll('[class*="chipIcon"]')) {
      expect(icon).toHaveAttribute("aria-hidden", "true");
    }
  });

  it("tints a chip by which way its matchup falls", () => {
    render219();

    // The same type can fall either way depending on the direction: Ground is a
    // 4x weakness here, while Rock dealing 2x into Flying is in this Pokemon's
    // favour.
    const taken = within(column("Defending")).getByText("Ground");
    const dealt = within(column("Attacking")).getByText("Flying");

    // The chip's own text is the type name, so getByText lands on the chip
    expect(taken.className).toMatch(/bad/);
    expect(dealt.className).toMatch(/good/);
  });

  it("carries the type palette so the section can tint itself", () => {
    const { container } = render219();

    expect(container.querySelector('[data-type="fire"]')).toBeInTheDocument();
  });
});
