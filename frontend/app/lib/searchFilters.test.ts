import {
  buildDualTypeOptions,
  buildSearchUrl,
  EMPTY_SEARCH_FILTERS,
  encodeDualType,
  getSearchHeading,
  hasActiveFilters,
  parseDualType,
  parseSearchParams,
  type SearchFilterState,
  toPokemonFilter,
} from "./searchFilters";

const state = (overrides: Partial<SearchFilterState> = {}): SearchFilterState => ({
  ...EMPTY_SEARCH_FILTERS,
  ...overrides,
});

describe("parseSearchParams", () => {
  it("reads every facet out of a plain searchParams object", () => {
    expect(
      parseSearchParams({
        q: "char",
        types: "fire,grass",
        dual: "fire,flying",
        regions: "kanto",
        pokedexes: "kanto,national",
        sort: "NAME_DESC",
        page: "3",
      }),
    ).toEqual({
      q: "char",
      types: ["fire", "grass"],
      dualType: { primary: "fire", secondary: "flying" },
      regions: ["kanto"],
      pokedexes: ["kanto", "national"],
      special: undefined,
      sort: "NAME_DESC",
      page: 3,
    });
  });

  it("reads the same facets out of a URLSearchParams", () => {
    const params = new URLSearchParams("q=char&types=fire,grass&page=2");

    expect(parseSearchParams(params)).toEqual(
      state({ q: "char", types: ["fire", "grass"], page: 2 }),
    );
  });

  it("falls back to an empty filter for a bare URL", () => {
    expect(parseSearchParams({})).toEqual(state());
    expect(parseSearchParams(new URLSearchParams())).toEqual(state());
  });

  it("trims, lowercases, dedupes and drops empty slugs", () => {
    expect(parseSearchParams({ types: " Fire , grass ,,fire, " })).toEqual(
      state({ types: ["fire", "grass"] }),
    );
  });

  it("takes the first value when a key is repeated", () => {
    expect(parseSearchParams({ types: ["fire", "water"] })).toEqual(state({ types: ["fire"] }));
  });

  it("ignores unknown params", () => {
    expect(parseSearchParams({ bogus: "nonsense", type: "fire" })).toEqual(state());
  });

  it("defaults sort when absent and falls back to it when malformed", () => {
    expect(parseSearchParams({}).sort).toBe("ID_ASC");
    expect(parseSearchParams({ sort: "bogus" }).sort).toBe("ID_ASC");
  });

  it("parses a recognised sort", () => {
    expect(parseSearchParams({ sort: "NAME_ASC" }).sort).toBe("NAME_ASC");
  });

  it("clamps a missing, malformed or out-of-range page to 1", () => {
    expect(parseSearchParams({ page: "0" }).page).toBe(1);
    expect(parseSearchParams({ page: "-4" }).page).toBe(1);
    expect(parseSearchParams({ page: "two" }).page).toBe(1);
    expect(parseSearchParams({}).page).toBe(1);
  });

  it("keeps a recognised special and drops anything else", () => {
    expect(parseSearchParams({ special: "gmax" }).special).toBe("gmax");
    expect(parseSearchParams({ special: " MEGA " }).special).toBe("mega");
    expect(parseSearchParams({ special: "shiny" }).special).toBeUndefined();
  });

  it("lets free text win over special, since the schema has one query field", () => {
    expect(parseSearchParams({ q: "char", special: "gmax" })).toEqual(
      state({ q: "char", special: undefined }),
    );
  });

  it("does not mutate the shared empty filter", () => {
    parseSearchParams({ types: "fire" });
    expect(EMPTY_SEARCH_FILTERS.types).toEqual([]);
  });
});

describe("parseDualType", () => {
  it("sorts the pair so it matches the option key however it was written", () => {
    expect(parseDualType("flying,fire")).toEqual({ primary: "fire", secondary: "flying" });
    expect(parseDualType("fire,flying")).toEqual({ primary: "fire", secondary: "flying" });
  });

  it("rejects anything that is not two distinct types", () => {
    expect(parseDualType("fire")).toBeUndefined();
    expect(parseDualType("fire,fire")).toBeUndefined();
    expect(parseDualType("fire,flying,water")).toBeUndefined();
    expect(parseDualType("")).toBeUndefined();
    expect(parseDualType(null)).toBeUndefined();
    expect(parseDualType(undefined)).toBeUndefined();
  });
});

describe("encodeDualType", () => {
  it("round-trips with parseDualType", () => {
    const pair = parseDualType("flying,fire");
    expect(encodeDualType(pair)).toBe("fire,flying");
    expect(parseDualType(encodeDualType(pair))).toEqual(pair);
  });

  it("returns nothing for an incomplete pair", () => {
    expect(encodeDualType(undefined)).toBeUndefined();
    expect(encodeDualType({ primary: "fire", secondary: "" })).toBeUndefined();
  });
});

describe("buildSearchUrl", () => {
  it("builds a bare URL for an empty filter", () => {
    expect(buildSearchUrl()).toBe("/search");
    expect(buildSearchUrl(state())).toBe("/search");
  });

  it("emits set facets in a fixed order and leaves the rest off", () => {
    expect(
      buildSearchUrl(
        state({
          q: "char",
          types: ["fire", "grass"],
          dualType: { primary: "fire", secondary: "flying" },
          regions: ["kanto"],
          pokedexes: ["national"],
        }),
      ),
    ).toBe("/search?q=char&types=fire,grass&dual=fire,flying&regions=kanto&pokedexes=national");
  });

  it("leaves the page off page 1 and carries later ones", () => {
    expect(buildSearchUrl(state({ types: ["fire"], page: 1 }))).toBe("/search?types=fire");
    expect(buildSearchUrl(state({ types: ["fire"], page: 4 }))).toBe("/search?types=fire&page=4");
  });

  it("omits sort at the default and emits it otherwise, before page", () => {
    expect(buildSearchUrl(state({ sort: "ID_ASC" }))).toBe("/search");
    expect(buildSearchUrl(state({ sort: "NAME_ASC" }))).toBe("/search?sort=NAME_ASC");
    expect(buildSearchUrl(state({ sort: "NAME_ASC", page: 2 }))).toBe(
      "/search?sort=NAME_ASC&page=2",
    );
  });

  it("normalizes slugs on the way out too", () => {
    expect(buildSearchUrl(state({ types: [" Fire ", "fire", "Grass"] }))).toBe(
      "/search?types=fire,grass",
    );
  });

  it("drops special when free text is set, matching how it is parsed back", () => {
    expect(buildSearchUrl(state({ q: "char", special: "gmax" }))).toBe("/search?q=char");
    expect(buildSearchUrl(state({ special: "gmax" }))).toBe("/search?special=gmax");
  });

  it("escapes free text while leaving the list separator readable", () => {
    expect(buildSearchUrl(state({ q: "mr mime&", types: ["fire", "grass"] }))).toBe(
      "/search?q=mr+mime%26&types=fire,grass",
    );
  });

  it("round-trips through parseSearchParams", () => {
    const original = state({
      q: "char",
      types: ["fire", "grass"],
      dualType: { primary: "fire", secondary: "flying" },
      regions: ["kanto", "johto"],
      pokedexes: ["national"],
      sort: "NAME_DESC",
      page: 3,
    });

    const parsed = parseSearchParams(new URLSearchParams(buildSearchUrl(original).split("?")[1]));

    // Selection order survives the trip — only the dual pair is canonicalized.
    expect(parsed).toEqual(original);
  });
});

describe("toPokemonFilter", () => {
  it("omits every empty facet rather than sending nulls", () => {
    expect(toPokemonFilter(state())).toEqual({});
  });

  it("maps each set facet onto the schema input", () => {
    expect(
      toPokemonFilter(
        state({
          q: "char",
          types: ["fire"],
          dualType: { primary: "fire", secondary: "flying" },
          regions: ["kanto"],
          pokedexes: ["national"],
        }),
      ),
    ).toEqual({
      query: "char",
      types: ["fire"],
      dualType: { primary: "fire", secondary: "flying" },
      regions: ["kanto"],
      pokedexes: ["national"],
    });
  });

  it("sends special as the query, since it is really a name substring", () => {
    expect(toPokemonFilter(state({ special: "gmax" }))).toEqual({ query: "gmax" });
  });

  it("prefers free text over special", () => {
    expect(toPokemonFilter(state({ q: "char", special: "gmax" }))).toEqual({ query: "char" });
  });

  it("copies the lists so the caller cannot reach back into the state", () => {
    const source = state({ types: ["fire"] });
    expect(toPokemonFilter(source).types).not.toBe(source.types);
  });
});

describe("buildDualTypeOptions", () => {
  it("builds every unordered pair, sorted and keyed the way the URL spells it", () => {
    expect(
      buildDualTypeOptions([
        { name: "flying", count: 1 },
        { name: "fire", count: 1 },
        { name: "grass", count: 1 },
      ]),
    ).toEqual([
      { id: "fire,flying", label: "Fire / Flying" },
      { id: "fire,grass", label: "Fire / Grass" },
      { id: "flying,grass", label: "Flying / Grass" },
    ]);
  });

  it("keys match what encodeDualType writes, so a URL restores the right option", () => {
    const options = buildDualTypeOptions([
      { name: "fire", count: 1 },
      { name: "flying", count: 1 },
    ]);

    expect(options[0].id).toBe(encodeDualType(parseDualType("flying,fire")));
  });

  it("needs two types before there is a pair", () => {
    expect(buildDualTypeOptions([])).toEqual([]);
    expect(buildDualTypeOptions([{ name: "fire", count: 1 }])).toEqual([]);
  });

  it("dedupes and normalizes the type names it is given", () => {
    expect(
      buildDualTypeOptions([
        { name: " Fire ", count: 1 },
        { name: "fire", count: 1 },
        { name: "flying", count: 1 },
      ]),
    ).toEqual([{ id: "fire,flying", label: "Fire / Flying" }]);
  });
});

describe("hasActiveFilters", () => {
  it("is false only when nothing at all is set", () => {
    expect(hasActiveFilters(state())).toBe(false);
    expect(hasActiveFilters(state({ page: 5 }))).toBe(false);
  });

  it("does not count whitespace typed into the name field", () => {
    expect(hasActiveFilters(state({ q: "   " }))).toBe(false);
  });

  it("is true for any single facet", () => {
    expect(hasActiveFilters(state({ q: "char" }))).toBe(true);
    expect(hasActiveFilters(state({ types: ["fire"] }))).toBe(true);
    expect(hasActiveFilters(state({ dualType: { primary: "fire", secondary: "flying" } }))).toBe(
      true,
    );
    expect(hasActiveFilters(state({ regions: ["kanto"] }))).toBe(true);
    expect(hasActiveFilters(state({ pokedexes: ["national"] }))).toBe(true);
    expect(hasActiveFilters(state({ special: "mega" }))).toBe(true);
  });
});

describe("getSearchHeading", () => {
  it("names the collection for a special", () => {
    expect(getSearchHeading(state({ special: "gmax" }))).toBe("Gigantamax Pokemon");
    expect(getSearchHeading(state({ special: "mega" }))).toBe("Mega Evolve Pokemon");
  });

  it("keeps the old search wording when free text is the only facet", () => {
    expect(getSearchHeading(state({ q: "char" }))).toBe('Search results for "char"');
  });

  it("reads as a browse-all when nothing is filtered", () => {
    expect(getSearchHeading(state())).toBe("All Pokemon");
  });

  it("keeps each facet's own wording when it is the only one set", () => {
    expect(getSearchHeading(state({ types: ["fire"] }))).toBe("Pokemon of type: Fire");
    expect(getSearchHeading(state({ regions: ["kanto"] }))).toBe("Pokemon from region: Kanto");
    expect(getSearchHeading(state({ pokedexes: ["letsgo-kanto"] }))).toBe(
      "Pokemon from pokedex: Letsgo Kanto",
    );
    expect(getSearchHeading(state({ dualType: { primary: "fire", secondary: "flying" } }))).toBe(
      "Pokemon of type: Fire / Flying",
    );
  });

  it("falls back to a generic heading once facets combine", () => {
    expect(getSearchHeading(state({ q: "char", types: ["fire"] }))).toBe("Filtered Pokemon");
    expect(getSearchHeading(state({ types: ["fire"], regions: ["kanto"] }))).toBe(
      "Filtered Pokemon",
    );
  });

  it("falls back when one facet holds several values, which no single name covers", () => {
    expect(getSearchHeading(state({ types: ["fire", "grass"] }))).toBe("Filtered Pokemon");
    expect(getSearchHeading(state({ regions: ["kanto", "johto"] }))).toBe("Filtered Pokemon");
  });
});
