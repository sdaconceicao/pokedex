import { buildRegionPokemonUrl, buildRegionUrl, parsePage } from "./RegionPokemon.utils";

describe("parsePage", () => {
  it("reads a valid page number", () => {
    expect(parsePage("2")).toBe(2);
    expect(parsePage("14")).toBe(14);
  });

  it("falls back to the first page for anything unusable", () => {
    expect(parsePage(null)).toBe(1);
    expect(parsePage("")).toBe(1);
    expect(parsePage("0")).toBe(1);
    expect(parsePage("-3")).toBe(1);
    expect(parsePage("1.5")).toBe(1);
    expect(parsePage("banana")).toBe(1);
  });
});

describe("buildRegionUrl", () => {
  it("leaves the page off the first page", () => {
    expect(buildRegionUrl("johto", 1)).toBe("/region/johto");
  });

  it("carries later pages in the query", () => {
    expect(buildRegionUrl("johto", 2)).toBe("/region/johto?page=2");
  });
});

describe("buildRegionPokemonUrl", () => {
  it("nests the Pokemon under the region and keeps the page", () => {
    expect(buildRegionPokemonUrl("johto", "1", 2)).toBe("/region/johto/pokemon/1?page=2");
  });

  it("leaves the page off the first page", () => {
    expect(buildRegionPokemonUrl("johto", "1", 1)).toBe("/region/johto/pokemon/1");
  });
});
