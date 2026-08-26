import type { PokemonGroup, User } from "@/types";
import {
  buildGroupUpdatePayload,
  isValidGroupName,
  resolveGroupSettingsState,
} from "./GroupSettings.utils";

const USER: User = {
  id: "1",
  email: "ash@pallet.town",
  firstName: "Ash",
  lastName: "Ketchum",
  username: "ash",
};

const GROUPS: PokemonGroup[] = [{ id: "1", name: "Favorites", isDefault: true, pokemonCount: 3 }];

const GROUP: PokemonGroup = { id: "1", name: "Favorites", isDefault: false, pokemonCount: 3 };
const DEFAULT_GROUP: PokemonGroup = { id: "2", name: "Team", isDefault: true, pokemonCount: 6 };

describe("resolveGroupSettingsState", () => {
  it("returns loading while auth is resolving", () => {
    expect(resolveGroupSettingsState(true, undefined, false, undefined, undefined)).toBe("loading");
  });

  it("returns signedOut once auth has resolved with no user", () => {
    expect(resolveGroupSettingsState(false, undefined, false, undefined, undefined)).toBe(
      "signedOut",
    );
  });

  it("returns loading while the groups query is in flight", () => {
    expect(resolveGroupSettingsState(false, USER, true, undefined, undefined)).toBe("loading");
  });

  it("returns error when the groups query fails", () => {
    expect(
      resolveGroupSettingsState(false, USER, false, new Error("network down"), undefined),
    ).toBe("error");
  });

  it("returns empty once loaded with no groups", () => {
    expect(resolveGroupSettingsState(false, USER, false, undefined, [])).toBe("empty");
  });

  it("returns populated once loaded with at least one group", () => {
    expect(resolveGroupSettingsState(false, USER, false, undefined, GROUPS)).toBe("populated");
  });
});

describe("isValidGroupName", () => {
  it("accepts a non-blank name", () => {
    expect(isValidGroupName("Team")).toBe(true);
  });

  it("rejects an empty name", () => {
    expect(isValidGroupName("")).toBe(false);
  });

  it("rejects a whitespace-only name", () => {
    expect(isValidGroupName("   ")).toBe(false);
  });

  it("trims surrounding whitespace before checking", () => {
    expect(isValidGroupName("  Team  ")).toBe(true);
  });
});

describe("buildGroupUpdatePayload", () => {
  it("returns null for a blank name", () => {
    expect(buildGroupUpdatePayload(GROUP, { name: "   ", makeDefault: false })).toBeNull();
  });

  it("returns null when nothing changed", () => {
    expect(
      buildGroupUpdatePayload(GROUP, { name: GROUP.name, makeDefault: GROUP.isDefault }),
    ).toBeNull();
  });

  it("includes the trimmed name when it changed", () => {
    expect(
      buildGroupUpdatePayload(GROUP, { name: "  Squad  ", makeDefault: GROUP.isDefault }),
    ).toEqual({ name: "Squad" });
  });

  it("includes isDefault: true when newly checked on a non-default group", () => {
    expect(buildGroupUpdatePayload(GROUP, { name: GROUP.name, makeDefault: true })).toEqual({
      isDefault: true,
    });
  });

  it("includes both when the name and default both changed", () => {
    expect(buildGroupUpdatePayload(GROUP, { name: "Squad", makeDefault: true })).toEqual({
      name: "Squad",
      isDefault: true,
    });
  });

  it("never re-sends isDefault for a group that is already the default", () => {
    expect(
      buildGroupUpdatePayload(DEFAULT_GROUP, { name: DEFAULT_GROUP.name, makeDefault: true }),
    ).toBeNull();
  });

  it("does not mutate its inputs", () => {
    const group = { ...GROUP };
    const edited = { name: "Squad", makeDefault: true };

    buildGroupUpdatePayload(group, edited);

    expect(group).toEqual(GROUP);
    expect(edited).toEqual({ name: "Squad", makeDefault: true });
  });
});
