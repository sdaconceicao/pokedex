import { buildFormHref } from "./FormSelect.utils";

const target = (formId: string, speciesId = "25") => ({ speciesId, formId });

describe("buildFormHref", () => {
  it("nests the form under its species", () => {
    expect(buildFormHref("/pokemon/25", "", target("10199"))).toBe("/pokemon/25/forms/10199");
  });

  it("swaps one form for another without deepening the path", () => {
    expect(buildFormHref("/pokemon/25/forms/10199", "", target("10080"))).toBe(
      "/pokemon/25/forms/10080",
    );
  });

  it("drops the form segment when the default is picked", () => {
    expect(buildFormHref("/pokemon/25/forms/10199", "", target("25"))).toBe("/pokemon/25");
  });

  it("stays in the region modal, keeping the list's page and sort", () => {
    expect(buildFormHref("/region/kanto/pokemon/25", "page=2&sort=NAME_ASC", target("10199"))).toBe(
      "/region/kanto/pokemon/25/forms/10199?page=2&sort=NAME_ASC",
    );
  });

  it("swaps forms inside the region modal", () => {
    expect(buildFormHref("/region/kanto/pokemon/25/forms/10199", "page=2", target("10080"))).toBe(
      "/region/kanto/pokemon/25/forms/10080?page=2",
    );
  });

  it("returns to the species inside the modal when the default is picked", () => {
    expect(
      buildFormHref("/type/fire/pokemon/6/forms/10034", "sort=NAME_ASC", target("6", "6")),
    ).toBe("/type/fire/pokemon/6?sort=NAME_ASC");
  });

  it("stays in the type modal too", () => {
    expect(buildFormHref("/type/fire/pokemon/6", "sort=NAME_ASC", target("10034", "6"))).toBe(
      "/type/fire/pokemon/6/forms/10034?sort=NAME_ASC",
    );
  });

  it("normalizes a form addressed by its own id onto the species", () => {
    expect(buildFormHref("/pokemon/10199", "", target("10080"))).toBe("/pokemon/25/forms/10080");
  });

  it("tolerates a leading question mark on the search string", () => {
    expect(buildFormHref("/type/fire/pokemon/6", "?page=3", target("10034", "6"))).toBe(
      "/type/fire/pokemon/6/forms/10034?page=3",
    );
  });

  it("leaves the query off when there is none", () => {
    expect(buildFormHref("/region/kanto/pokemon/25", "", target("10199"))).toBe(
      "/region/kanto/pokemon/25/forms/10199",
    );
  });

  it("tolerates a trailing slash", () => {
    expect(buildFormHref("/pokemon/25/", "", target("10199"))).toBe("/pokemon/25/forms/10199");
  });

  it("falls back to the Pokemon's own page off a detail route", () => {
    expect(buildFormHref("/search", "q=char", target("10199"))).toBe("/pokemon/25/forms/10199");
    expect(buildFormHref("/", "", target("25"))).toBe("/pokemon/25");
  });

  it("does not mistake the form collections route for a detail", () => {
    expect(buildFormHref("/forms/gmax", "", target("10199"))).toBe("/pokemon/25/forms/10199");
  });

  it("encodes the ids", () => {
    expect(buildFormHref("/pokemon/25", "", target("a b", "c d"))).toBe(
      "/pokemon/c%20d/forms/a%20b",
    );
  });
});
