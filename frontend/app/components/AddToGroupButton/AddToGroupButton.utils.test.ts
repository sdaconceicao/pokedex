import type { GroupMembership } from "@/types/groups";
import { isPokemonSaved } from "./AddToGroupButton.utils";

describe("isPokemonSaved", () => {
  const memberships: GroupMembership[] = [
    { groupId: "1", pokemonId: "25" },
    { groupId: "2", pokemonId: "1" },
  ];

  it("returns true when the pokemon is in at least one list", () => {
    expect(isPokemonSaved(memberships, "25")).toBe(true);
  });

  it("returns false when the pokemon is in none of the lists", () => {
    expect(isPokemonSaved(memberships, "999")).toBe(false);
  });

  it("returns false for an empty memberships list", () => {
    expect(isPokemonSaved([], "25")).toBe(false);
  });

  it("does not mutate the memberships array", () => {
    const copy = [...memberships];

    isPokemonSaved(memberships, "25");

    expect(memberships).toEqual(copy);
  });
});
