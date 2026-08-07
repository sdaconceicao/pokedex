import { buildTypePokemonUrl, buildTypeUrl } from "./typeUrls";

describe("buildTypeUrl", () => {
  it("leaves the page off the first page", () => {
    expect(buildTypeUrl("fire", 1)).toBe("/type/fire");
  });

  it("carries later pages in the query", () => {
    expect(buildTypeUrl("fire", 3)).toBe("/type/fire?page=3");
  });
});

describe("buildTypePokemonUrl", () => {
  it("nests the Pokemon under the type and keeps the page", () => {
    expect(buildTypePokemonUrl("fire", "4", 2)).toBe("/type/fire/pokemon/4?page=2");
  });

  it("leaves the page off the first page", () => {
    expect(buildTypePokemonUrl("fire", "4", 1)).toBe("/type/fire/pokemon/4");
  });
});
