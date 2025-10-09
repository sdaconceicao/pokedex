import { IconNormal, IconFire, IconGrass } from "@pokemonle/icons-react";
import { getTypeItems } from "./Navbar.util";

describe("getTypeItems", () => {
  it("handles known types with a proper icon", () => {
    const items = getTypeItems([
      { name: "fire", count: 0 },
      { name: "grass", count: 0 },
    ]);
    expect(items[0].icon).toEqual(<IconFire />);
    expect(items[1].icon).toEqual(<IconGrass />);
  });
  it("handles unknown types with a normal icon", () => {
    expect(getTypeItems([{ name: "bacon", count: 0 }])[0].icon).toEqual(
      <IconNormal />
    );
  });
});
