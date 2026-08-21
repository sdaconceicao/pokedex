import type { GroupMembership, PokemonGroup } from "@/types/groups";
import {
  diffListSelection,
  getMembershipGroupIds,
  getNewListDefaults,
  hasListChanges,
  isValidNewListName,
  resolveExistingListsMode,
} from "./AddToGroupControl.utils";

const favorites: PokemonGroup = { id: "1", name: "Favorites", isDefault: true, pokemonCount: 3 };
const team: PokemonGroup = { id: "2", name: "Team", isDefault: false, pokemonCount: 1 };

describe("resolveExistingListsMode", () => {
  it("returns none for an empty list", () => {
    expect(resolveExistingListsMode([])).toBe("none");
  });

  it("returns single for exactly one list", () => {
    expect(resolveExistingListsMode([favorites])).toBe("single");
  });

  it("returns dropdown for more than one list", () => {
    expect(resolveExistingListsMode([favorites, team])).toBe("dropdown");
  });
});

describe("getMembershipGroupIds", () => {
  const memberships: GroupMembership[] = [
    { groupId: "1", pokemonId: "25" },
    { groupId: "2", pokemonId: "25" },
    { groupId: "3", pokemonId: "1" },
  ];

  it("returns the ids of every list containing the given Pokemon", () => {
    expect(getMembershipGroupIds(memberships, "25")).toEqual(["1", "2"]);
  });

  it("returns an empty array when the Pokemon is in none of the lists", () => {
    expect(getMembershipGroupIds(memberships, "999")).toEqual([]);
  });

  it("returns an empty array for an empty memberships list", () => {
    expect(getMembershipGroupIds([], "25")).toEqual([]);
  });

  it("does not mutate the memberships array", () => {
    const copy = [...memberships];

    getMembershipGroupIds(memberships, "25");

    expect(memberships).toEqual(copy);
  });
});

describe("diffListSelection", () => {
  it("returns nothing to apply when the selection matches current membership", () => {
    expect(diffListSelection(["1", "2"], ["1", "2"])).toEqual({ toAdd: [], toRemove: [] });
  });

  it("treats a newly selected list as an add", () => {
    expect(diffListSelection(["1"], ["1", "3"])).toEqual({ toAdd: ["3"], toRemove: [] });
  });

  it("treats a deselected list as a remove", () => {
    expect(diffListSelection(["1", "2"], ["1"])).toEqual({ toAdd: [], toRemove: ["2"] });
  });

  it("handles an add and a remove in the same selection", () => {
    expect(diffListSelection(["1", "2"], ["2", "3"])).toEqual({ toAdd: ["3"], toRemove: ["1"] });
  });

  it("adds every selected list when the Pokemon is in none of them", () => {
    expect(diffListSelection([], ["1", "2"])).toEqual({ toAdd: ["1", "2"], toRemove: [] });
  });

  it("removes every list when the selection is cleared", () => {
    expect(diffListSelection(["1", "2"], [])).toEqual({ toAdd: [], toRemove: ["1", "2"] });
  });

  it("ignores selection order", () => {
    expect(diffListSelection(["1", "2"], ["2", "1"])).toEqual({ toAdd: [], toRemove: [] });
  });

  it("does not mutate its inputs", () => {
    const members = ["1", "2"];
    const selected = ["2", "3"];

    diffListSelection(members, selected);

    expect(members).toEqual(["1", "2"]);
    expect(selected).toEqual(["2", "3"]);
  });
});

describe("hasListChanges", () => {
  it("is false when there is nothing to apply", () => {
    expect(hasListChanges({ toAdd: [], toRemove: [] })).toBe(false);
  });

  it("is true when there is something to add", () => {
    expect(hasListChanges({ toAdd: ["1"], toRemove: [] })).toBe(true);
  });

  it("is true when there is something to remove", () => {
    expect(hasListChanges({ toAdd: [], toRemove: ["1"] })).toBe(true);
  });
});

describe("getNewListDefaults", () => {
  it("prefills Favorites, checked as default, when the user has no lists yet", () => {
    expect(getNewListDefaults([])).toEqual({ name: "Favorites", isDefault: true });
  });

  it("starts blank and unchecked once the user already has at least one list", () => {
    expect(getNewListDefaults([favorites])).toEqual({ name: "", isDefault: false });
  });
});

describe("isValidNewListName", () => {
  it("accepts a non-blank name", () => {
    expect(isValidNewListName("Shiny Hunt")).toBe(true);
  });

  it("rejects an empty name", () => {
    expect(isValidNewListName("")).toBe(false);
  });

  it("rejects a whitespace-only name", () => {
    expect(isValidNewListName("   ")).toBe(false);
  });

  it("accepts a name with leading/trailing whitespace around real content", () => {
    expect(isValidNewListName("  Shiny Hunt  ")).toBe(true);
  });
});
