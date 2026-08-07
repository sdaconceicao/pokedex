import { buildBrowseUrl } from "./browseUrls";

describe("buildBrowseUrl", () => {
  it("builds a section's own page", () => {
    expect(buildBrowseUrl("region", "johto", 1)).toBe("/region/johto");
    expect(buildBrowseUrl("type", "fire", 1)).toBe("/type/fire");
  });

  it("leaves the page off the first page and carries later ones", () => {
    expect(buildBrowseUrl("region", "johto", 1)).toBe("/region/johto");
    expect(buildBrowseUrl("region", "johto", 2)).toBe("/region/johto?page=2");
    expect(buildBrowseUrl("type", "fire", 14)).toBe("/type/fire?page=14");
  });

  it("nests a Pokemon under the section, keeping the page", () => {
    expect(buildBrowseUrl("region", "johto", 2, "251")).toBe("/region/johto/pokemon/251?page=2");
    expect(buildBrowseUrl("type", "fire", 3, "4")).toBe("/type/fire/pokemon/4?page=3");
  });

  it("leaves the page off a Pokemon opened from the first page", () => {
    expect(buildBrowseUrl("type", "fire", 1, "4")).toBe("/type/fire/pokemon/4");
  });

  it("escapes anything odd in the slug or the id", () => {
    expect(buildBrowseUrl("region", "hisui/../johto", 1)).toBe("/region/hisui%2F..%2Fjohto");
    expect(buildBrowseUrl("type", "fire", 1, "4?x=1")).toBe("/type/fire/pokemon/4%3Fx%3D1");
  });
});
