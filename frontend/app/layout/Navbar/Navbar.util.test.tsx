import { IconFire, IconGrass, IconNormal } from "@pokemonle/icons-react";
import {
  getPokedexItems,
  getRegionItems,
  getSpecialItems,
  getTypeItems,
  paramIncludes,
} from "./Navbar.util";

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
    expect(getTypeItems([{ name: "bacon", count: 0 }])[0].icon).toEqual(<IconNormal />);
  });
  it("links to the type's own page", () => {
    const [item] = getTypeItems([{ name: "fire", count: 12 }]);
    expect(item.href).toBe("/type/fire");
    expect(item.activeWhenPathnameEquals).toBe("/type/fire");
  });
});

describe("getRegionItems", () => {
  it("links to the region's own page", () => {
    const [item] = getRegionItems([{ name: "johto", count: 100 }]);
    expect(item.label).toBe("Johto (100)");
    expect(item.href).toBe("/region/johto");
    expect(item.activeWhenPathnameEquals).toBe("/region/johto");
  });
});

describe("getPokedexItems", () => {
  it("links to the pokedex as one facet of the search results", () => {
    const [item] = getPokedexItems([{ name: "letsgo-kanto", count: 153 }]);
    expect(item.label).toBe("Letsgo kanto (153)");
    expect(item.href).toBe("/search?pokedexes=letsgo-kanto");
  });

  it("is current when the param lists it among others, not only on its own", () => {
    const [item] = getPokedexItems([{ name: "kanto", count: 151 }]);
    expect(item.activeWhenSearchParamIncludes).toEqual({ key: "pokedexes", value: "kanto" });
  });
});

describe("getSpecialItems", () => {
  it("links each curated collection to the search results", () => {
    expect(getSpecialItems()).toEqual([
      {
        label: "Gigantamax",
        href: "/search?special=gmax",
        activeWhenSearchParamIncludes: { key: "special", value: "gmax" },
      },
      {
        label: "Mega Evolve",
        href: "/search?special=mega",
        activeWhenSearchParamIncludes: { key: "special", value: "mega" },
      },
    ]);
  });
});

describe("paramIncludes", () => {
  it("matches a value among a comma-joined list", () => {
    expect(paramIncludes("fire,grass,water", "grass")).toBe(true);
    expect(paramIncludes("fire", "fire")).toBe(true);
  });

  it("does not match a value that is only a substring of another", () => {
    expect(paramIncludes("firered", "fire")).toBe(false);
  });

  it("ignores spacing and case", () => {
    expect(paramIncludes("fire, Grass ", "grass")).toBe(true);
  });

  it("is false when the param is absent or empty", () => {
    expect(paramIncludes(null, "fire")).toBe(false);
    expect(paramIncludes("", "fire")).toBe(false);
  });
});
