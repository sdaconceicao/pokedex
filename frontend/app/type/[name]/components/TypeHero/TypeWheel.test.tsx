import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { TypeDamageRelations } from "@/types";
import TypeWheel from "./TypeWheel";

const relations: TypeDamageRelations = {
  doubleDamageTo: ["grass", "ice", "bug", "steel"],
  halfDamageTo: ["fire", "water", "rock", "dragon"],
  noDamageTo: [],
  doubleDamageFrom: ["ground", "rock", "water"],
  halfDamageFrom: ["fairy"],
  noDamageFrom: [],
};

const renderWheel = (overrides?: Partial<Parameters<typeof TypeWheel>[0]>) =>
  render(<TypeWheel name="fire" displayName="Fire" relations={relations} {...overrides} />);

const spoke = (name: RegExp) => screen.getByRole("button", { name });
// The key spells out the same words, so readings are taken off the readout
const readout = () => screen.getByTestId("type-wheel-readout");

describe("TypeWheel", () => {
  it("gives every one of the eighteen types a spoke", () => {
    renderWheel();

    expect(screen.getAllByRole("button")).toHaveLength(18);
  });

  it("labels each spoke with both halves of the matchup", () => {
    renderWheel();

    expect(
      spoke(/^Grass: attacking 2× super effective, defending 1× normal damage$/),
    ).toBeInTheDocument();
    expect(
      spoke(/^Water: attacking ½× not very effective, defending 2× weak to$/),
    ).toBeInTheDocument();
  });

  it("puts the type's own icon at the centre, filling the middle", () => {
    renderWheel();

    const core = screen.getByTestId("type-wheel-core");
    expect(core.querySelector("svg")).toBeInTheDocument();
    expect(core).toHaveTextContent("fire");
  });

  it("says which ring is which, since the two carry different halves", () => {
    renderWheel();

    expect(screen.getByText(/Outer ring attacking · inner ring defending/i)).toBeInTheDocument();
  });

  it("summarises both rings until a spoke is picked", () => {
    renderWheel();

    expect(readout()).toHaveTextContent("4 super effective · 3 weaknesses");
  });

  it("reads out both directions for the spoke a touch taps", async () => {
    const user = userEvent.setup();
    renderWheel();

    await user.click(spoke(/^Grass: /));

    expect(readout()).toHaveTextContent(/Grass/);
    expect(readout()).toHaveTextContent(/Atk\s*2×\s*Super effective/);
    expect(readout()).toHaveTextContent(/Def\s*1×\s*Normal damage/);
    expect(spoke(/^Grass: /)).toHaveAttribute("aria-pressed", "true");
  });

  it("reads out both directions for the spoke a pointer hovers", async () => {
    const user = userEvent.setup();
    renderWheel();

    await user.hover(spoke(/^Water: /));

    expect(readout()).toHaveTextContent(/Water/);
    expect(readout()).toHaveTextContent(/Atk\s*½×\s*Not very effective/);
    expect(readout()).toHaveTextContent(/Def\s*2×\s*Weak to/);
  });

  it("swaps the reading when another spoke is picked", async () => {
    const user = userEvent.setup();
    renderWheel();

    await user.click(spoke(/^Grass: /));
    await user.click(spoke(/^Steel: /));

    expect(readout()).toHaveTextContent(/Steel/);
    expect(readout()).not.toHaveTextContent(/Grass/);
  });

  it("reads out the zero cases on either side", async () => {
    const user = userEvent.setup();
    renderWheel({
      relations: { ...relations, noDamageTo: ["ghost"], noDamageFrom: ["dragon"] },
    });

    await user.click(spoke(/^Ghost: /));
    expect(readout()).toHaveTextContent(/Atk\s*0×\s*No effect/);

    await user.click(spoke(/^Dragon: /));
    expect(readout()).toHaveTextContent(/Def\s*0×\s*Immune/);
  });
});
