import type { PokemonPokedex } from "@/types";
import {
  findPokedexFamily,
  getDefaultVariant,
  getPokedexFamilies,
  getPokedexRegionGroups,
  shownName,
  splitVariant,
} from "./pokedexFamilies";

const dex = (
  name: string,
  displayName: string,
  region: string | null,
  count = 100,
): PokemonPokedex => ({ name, displayName, region, count });

// The shapes the API actually returns, slug-sorted as `pokedexes` gives them
const johto = [
  dex("original-johto", "Original Johto", "johto", 251),
  dex("updated-johto", "Updated Johto", "johto", 256),
];

describe("splitVariant", () => {
  it("splits a marked name into its revision and its place", () => {
    expect(splitVariant("Updated Johto")).toEqual({ label: "Updated", place: "Johto" });
    expect(splitVariant("Extended Sinnoh")).toEqual({ label: "Extended", place: "Sinnoh" });
    expect(splitVariant("New Hoenn")).toEqual({ label: "New", place: "Hoenn" });
    expect(splitVariant("Original Ula’ula")).toEqual({ label: "Original", place: "Ula’ula" });
  });

  it("returns null for a name that carries no marker", () => {
    expect(splitVariant("Kanto")).toBeNull();
    expect(splitVariant("Let’s Go Kanto")).toBeNull();
    expect(splitVariant("Central Kalos")).toBeNull();
    expect(splitVariant("Isle of Armor")).toBeNull();
    expect(splitVariant("National")).toBeNull();
  });

  // "Original" as a whole word only — a place merely starting with those
  // letters is not a revision of anything.
  it("does not match a marker that is only a prefix of the first word", () => {
    expect(splitVariant("Originals")).toBeNull();
    expect(splitVariant("Newton Town")).toBeNull();
  });
});

describe("getPokedexFamilies", () => {
  it("groups the revisions of one place, oldest first", () => {
    expect(getPokedexFamilies(johto)).toEqual([
      {
        place: "Johto",
        variants: [
          { name: "original-johto", label: "Original", count: 251 },
          { name: "updated-johto", label: "Updated", count: 256 },
        ],
      },
    ]);
  });

  it("orders Extended and New after Original, whatever order they arrive in", () => {
    const sinnoh = getPokedexFamilies([
      dex("extended-sinnoh", "Extended Sinnoh", "sinnoh", 210),
      dex("original-sinnoh", "Original Sinnoh", "sinnoh", 151),
    ]);
    expect(sinnoh[0].variants.map((v) => v.label)).toEqual(["Original", "Extended"]);

    // The bare `hoenn` slug is "Original Hoenn" upstream, paired with "New Hoenn"
    const hoenn = getPokedexFamilies([
      dex("updated-hoenn", "New Hoenn", "hoenn", 211),
      dex("hoenn", "Original Hoenn", "hoenn", 202),
    ]);
    expect(hoenn[0].variants.map((v) => v.name)).toEqual(["hoenn", "updated-hoenn"]);
  });

  it("leaves a place with only one revision out of the families", () => {
    expect(getPokedexFamilies([dex("original-johto", "Original Johto", "johto")])).toEqual([]);
  });

  it("ignores the dexes whose names carry no marker", () => {
    expect(
      getPokedexFamilies([dex("kanto", "Kanto", "kanto"), dex("galar", "Galar", "galar")]),
    ).toEqual([]);
  });

  it("keeps the island dexes apart from the region they sit in", () => {
    const alola = getPokedexFamilies([
      dex("original-alola", "Original Alola", "alola"),
      dex("updated-alola", "Updated Alola", "alola"),
      dex("original-poni", "Original Poni", "alola"),
      dex("updated-poni", "Updated Poni", "alola"),
    ]);

    expect(alola.map((family) => family.place)).toEqual(["Alola", "Poni"]);
  });
});

describe("getDefaultVariant", () => {
  it("opens a family on its newest revision", () => {
    const [family] = getPokedexFamilies(johto);

    expect(getDefaultVariant(family).name).toBe("updated-johto");
  });
});

describe("findPokedexFamily", () => {
  it("finds the family from any of its variants", () => {
    expect(findPokedexFamily(johto, "original-johto")?.place).toBe("Johto");
    expect(findPokedexFamily(johto, "updated-johto")?.place).toBe("Johto");
  });

  it("returns null for a dex that stands alone", () => {
    expect(findPokedexFamily([...johto, dex("kanto", "Kanto", "kanto")], "kanto")).toBeNull();
  });
});

describe("getPokedexRegionGroups", () => {
  const all = [
    dex("blueberry", "Blueberry", "paldea", 243),
    dex("champions", "Champions", null, 208),
    dex("conquest-gallery", "Conquest Gallery", null, 200),
    dex("hoenn", "Original Hoenn", "hoenn", 202),
    dex("kanto", "Kanto", "kanto", 151),
    dex("letsgo-kanto", "Let’s Go Kanto", "kanto", 153),
    dex("national", "National", null, 1025),
    dex("original-johto", "Original Johto", "johto", 251),
    dex("paldea", "Paldea", "paldea", 400),
    dex("updated-hoenn", "New Hoenn", "hoenn", 211),
    dex("updated-johto", "Updated Johto", "johto", 256),
  ];

  it("orders the regions the way the games introduced them", () => {
    expect(getPokedexRegionGroups(all).map((group) => group.region)).toEqual([
      "kanto",
      "johto",
      "hoenn",
      "paldea",
      null,
    ]);
  });

  it("collapses a family to one entry and leaves standalone dexes alone", () => {
    const groups = getPokedexRegionGroups(all);
    const byRegion = (region: string | null) =>
      groups.find((group) => group.region === region)?.entries ?? [];

    expect(byRegion("johto")).toEqual([
      { kind: "family", place: "Johto", family: findPokedexFamily(all, "original-johto") },
    ]);

    // Kanto's two dexes are separate dexes, not revisions of one
    expect(byRegion("kanto").map((entry) => entry.kind)).toEqual(["single", "single"]);
  });

  it("lists a region's entries by the name shown, not the slug", () => {
    // Slug order would put hyperspace before kalos-central
    const kalos = getPokedexRegionGroups([
      dex("hyperspace", "Hyperspace", "kalos", 132),
      dex("kalos-central", "Central Kalos", "kalos", 150),
      dex("lumiose-city", "Lumiose City", "kalos", 232),
    ]);

    expect(kalos[0].entries.map(shownName)).toEqual([
      "Central Kalos",
      "Hyperspace",
      "Lumiose City",
    ]);
  });

  it("puts the dexes that belong to no region last", () => {
    const groups = getPokedexRegionGroups(all);
    const last = groups[groups.length - 1];

    expect(last.region).toBeNull();
    expect(last.entries).toHaveLength(3);
  });

  it("sorts a region the API adds later after the known ones but before the ungrouped", () => {
    const groups = getPokedexRegionGroups([
      dex("somewhere", "Somewhere", "newregion"),
      dex("national", "National", null),
      dex("kanto", "Kanto", "kanto"),
    ]);

    expect(groups.map((group) => group.region)).toEqual(["kanto", "newregion", null]);
  });
});
