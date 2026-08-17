import { buildBrowseUrl } from "./browseUrls";

describe("buildBrowseUrl", () => {
  it("builds a section's own page", () => {
    expect(buildBrowseUrl("region", "johto")).toBe("/region/johto");
    expect(buildBrowseUrl("type", "fire")).toBe("/type/fire");
  });

  it("leaves the page off the first page and carries later ones", () => {
    expect(buildBrowseUrl("region", "johto", { page: 1 })).toBe("/region/johto");
    expect(buildBrowseUrl("region", "johto", { page: 2 })).toBe("/region/johto?page=2");
    expect(buildBrowseUrl("type", "fire", { page: 14 })).toBe("/type/fire?page=14");
  });

  it("nests a Pokemon under the section, keeping the page", () => {
    expect(buildBrowseUrl("region", "johto", { page: 2, pokemonId: "251" })).toBe(
      "/region/johto/pokemon/251?page=2",
    );
    expect(buildBrowseUrl("type", "fire", { page: 3, pokemonId: "4" })).toBe(
      "/type/fire/pokemon/4?page=3",
    );
  });

  it("leaves the page off a Pokemon opened from the first page", () => {
    expect(buildBrowseUrl("type", "fire", { page: 1, pokemonId: "4" })).toBe(
      "/type/fire/pokemon/4",
    );
  });

  it("escapes anything odd in the slug or the id", () => {
    expect(buildBrowseUrl("region", "hisui/../johto")).toBe("/region/hisui%2F..%2Fjohto");
    expect(buildBrowseUrl("type", "fire", { pokemonId: "4?x=1" })).toBe(
      "/type/fire/pokemon/4%3Fx%3D1",
    );
  });

  it("leaves sort off at the default and emits it otherwise", () => {
    expect(buildBrowseUrl("region", "johto", { sort: "ID_ASC" })).toBe("/region/johto");
    expect(buildBrowseUrl("region", "johto", { sort: "NAME_ASC" })).toBe(
      "/region/johto?sort=NAME_ASC",
    );
  });

  it("orders sort before page when both are set", () => {
    expect(buildBrowseUrl("region", "johto", { page: 2, sort: "NAME_ASC" })).toBe(
      "/region/johto?sort=NAME_ASC&page=2",
    );
  });

  it("combines sort with a Pokemon opened from the list", () => {
    expect(buildBrowseUrl("type", "fire", { sort: "NAME_DESC", pokemonId: "4" })).toBe(
      "/type/fire/pokemon/4?sort=NAME_DESC",
    );
  });
});
