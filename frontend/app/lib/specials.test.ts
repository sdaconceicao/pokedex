import { parseSpecial, SPECIAL_TITLES, SPECIALS } from "./specials";

describe("parseSpecial", () => {
  it("accepts each collection", () => {
    expect(parseSpecial("gmax")).toBe("gmax");
    expect(parseSpecial("mega")).toBe("mega");
  });

  it("trims and lowercases, since this comes out of a URL", () => {
    expect(parseSpecial(" MEGA ")).toBe("mega");
  });

  it("rejects anything else, so the route can 404 rather than list nothing", () => {
    expect(parseSpecial("shiny")).toBeUndefined();
    expect(parseSpecial("")).toBeUndefined();
    expect(parseSpecial(undefined)).toBeUndefined();
  });
});

describe("SPECIAL_TITLES", () => {
  it("titles every collection", () => {
    for (const special of SPECIALS) {
      expect(SPECIAL_TITLES[special]).toBeTruthy();
    }
  });
});
