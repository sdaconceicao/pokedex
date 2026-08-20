import { IconFire, IconGrass, IconNormal } from "@pokemonle/icons-react";
import {
  getOpenSectionKey,
  getPokedexGroups,
  getRegionItems,
  getSpecialItems,
  getTypeItems,
  NAV_SECTIONS,
  paramIncludes,
} from "./Navbar.util";

describe("getOpenSectionKey", () => {
  it("names the section a browse route belongs to", () => {
    expect(getOpenSectionKey("/type/grass")).toBe("types");
    expect(getOpenSectionKey("/forms/gmax")).toBe("special");
    expect(getOpenSectionKey("/region/kanto")).toBe("regions");
    expect(getOpenSectionKey("/pokedex/updated-johto")).toBe("pokedexes");
  });

  it("reads the section off the first segment, however deep the route goes", () => {
    expect(getOpenSectionKey("/pokedex/kanto/pokemon/1")).toBe("pokedexes");
    expect(getOpenSectionKey("/type/fire/pokemon/4/forms/10")).toBe("types");
  });

  it("falls back to the first section on a route no section owns", () => {
    expect(getOpenSectionKey("/")).toBe("types");
    expect(getOpenSectionKey("/search")).toBe("types");
    expect(getOpenSectionKey("/pokemon/1")).toBe("types");
  });

  it("stays in step with the sidebar's order rather than naming a section", () => {
    expect(getOpenSectionKey("/")).toBe(NAV_SECTIONS[0].key);
  });

  // A prefix of a section's segment is not that section
  it("matches whole segments only, falling back rather than guessing", () => {
    expect(getOpenSectionKey("/types")).toBe("types");
    expect(getOpenSectionKey("/regional")).toBe("types");
  });
});

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

describe("getPokedexGroups", () => {
  const dex = (name: string, displayName: string, region: string | null, count: number) => ({
    name,
    displayName,
    region,
    count,
  });

  const pokedexes = [
    dex("hoenn", "Original Hoenn", "hoenn", 202),
    dex("kanto", "Kanto", "kanto", 151),
    dex("letsgo-kanto", "Let’s Go Kanto", "kanto", 153),
    dex("national", "National", null, 1025),
    dex("original-johto", "Original Johto", "johto", 251),
    dex("updated-hoenn", "New Hoenn", "hoenn", 211),
    dex("updated-johto", "Updated Johto", "johto", 256),
  ];

  const group = (title: string) =>
    getPokedexGroups(pokedexes).find((candidate) => candidate.title === title);

  it("titles a band per region, in the order the games introduced them", () => {
    expect(getPokedexGroups(pokedexes).map(({ title }) => title)).toEqual([
      "Kanto",
      "Johto",
      "Hoenn",
      "Other",
    ]);
  });

  it("uses the name the dex's own page shows, not the slug", () => {
    // The slug would read "Letsgo kanto"
    expect(group("Kanto")?.items.map(({ label }) => label)).toEqual([
      "Kanto (151)",
      "Let’s Go Kanto (153)",
    ]);
  });

  it("collapses a family to one item that opens its newest revision", () => {
    const [item] = group("Johto")?.items ?? [];

    expect(item.label).toBe("Johto (256)");
    expect(item.href).toBe("/pokedex/updated-johto");
  });

  it("marks a family's item current on any of its revisions", () => {
    const [item] = group("Johto")?.items ?? [];

    expect(item.activeWhenPathnameIn).toEqual([
      "/pokedex/original-johto",
      "/pokedex/updated-johto",
    ]);
  });

  it("pairs a family whose older revision has no marker in its slug", () => {
    const [item] = group("Hoenn")?.items ?? [];

    expect(item.label).toBe("Hoenn (211)");
    expect(item.activeWhenPathnameIn).toEqual(["/pokedex/hoenn", "/pokedex/updated-hoenn"]);
  });

  it("keeps a standalone dex on its own page, not a search facet", () => {
    const [item] = group("Other")?.items ?? [];

    expect(item.href).toBe("/pokedex/national");
    expect(item.activeWhenPathnameEquals).toBe("/pokedex/national");
    expect(item.activeWhenSearchParamIncludes).toBeUndefined();
  });
});

describe("getSpecialItems", () => {
  it("links each curated collection to its own page", () => {
    expect(getSpecialItems()).toEqual([
      {
        label: "Gigantamax",
        href: "/forms/gmax",
        activeWhenPathnameEquals: "/forms/gmax",
      },
      {
        label: "Mega Evolve",
        href: "/forms/mega",
        activeWhenPathnameEquals: "/forms/mega",
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
