import type { PokemonGroup, User } from "@/types";
import { resolveGroupSettingsState, shouldCommitRename } from "./GroupSettings.utils";

const USER: User = {
  id: "1",
  email: "ash@pallet.town",
  firstName: "Ash",
  lastName: "Ketchum",
  username: "ash",
};

const GROUPS: PokemonGroup[] = [{ id: "1", name: "Favorites", isDefault: true, pokemonCount: 3 }];

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

  it("returns list once loaded with at least one group", () => {
    expect(resolveGroupSettingsState(false, USER, false, undefined, GROUPS)).toBe("list");
  });
});

describe("shouldCommitRename", () => {
  it("commits a new, non-blank name", () => {
    expect(shouldCommitRename("Favorites", "Team")).toBe(true);
  });

  it("does not commit when the name is unchanged", () => {
    expect(shouldCommitRename("Favorites", "Favorites")).toBe(false);
  });

  it("does not commit a blank name", () => {
    expect(shouldCommitRename("Favorites", "   ")).toBe(false);
  });

  it("trims surrounding whitespace before comparing", () => {
    expect(shouldCommitRename("Favorites", "  Favorites  ")).toBe(false);
    expect(shouldCommitRename("Favorites", "  Team  ")).toBe(true);
  });
});
