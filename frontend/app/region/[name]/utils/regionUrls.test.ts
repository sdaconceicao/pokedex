import { buildRegionPokemonUrl, buildRegionUrl } from "./regionUrls";

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
