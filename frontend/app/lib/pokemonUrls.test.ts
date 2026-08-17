import { buildPokemonPath } from "./pokemonUrls";

describe("buildPokemonPath", () => {
  it("addresses the default form as the species' own page", () => {
    expect(buildPokemonPath("25", "25")).toBe("/pokemon/25");
  });

  it("nests an alternate form under its species", () => {
    expect(buildPokemonPath("25", "10199")).toBe("/pokemon/25/forms/10199");
    expect(buildPokemonPath("6", "10034")).toBe("/pokemon/6/forms/10034");
  });

  it("escapes both segments", () => {
    expect(buildPokemonPath("a b", "c/d")).toBe("/pokemon/a%20b/forms/c%2Fd");
  });
});
