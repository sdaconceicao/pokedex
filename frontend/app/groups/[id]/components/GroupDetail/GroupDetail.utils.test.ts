import type { GroupPokemon, User } from "@/types";
import { resolveGroupDetailState, toPokemonIds } from "./GroupDetail.utils";

const USER: User = {
  id: "1",
  email: "ash@pallet.town",
  firstName: "Ash",
  lastName: "Ketchum",
  username: "ash",
};

const GROUP_POKEMON: GroupPokemon[] = [
  { pokemonId: "25", speciesId: "25" },
  { pokemonId: "4", speciesId: "4" },
];

describe("toPokemonIds", () => {
  it("maps each entry to its pokemonId, preserving order", () => {
    expect(toPokemonIds(GROUP_POKEMON)).toEqual(["25", "4"]);
  });

  it("returns an empty array for an empty group", () => {
    expect(toPokemonIds([])).toEqual([]);
  });

  it("returns an empty array when the query hasn't resolved yet", () => {
    expect(toPokemonIds(undefined)).toEqual([]);
  });

  it("does not mutate its input", () => {
    const pokemon = [...GROUP_POKEMON];
    const original = [...pokemon];

    toPokemonIds(pokemon);

    expect(pokemon).toEqual(original);
  });
});

describe("resolveGroupDetailState", () => {
  it("returns loading while auth is resolving", () => {
    expect(resolveGroupDetailState(true, undefined, false, undefined, [], false)).toBe("loading");
  });

  it("returns signedOut once auth has resolved with no user", () => {
    expect(resolveGroupDetailState(false, undefined, false, undefined, [], false)).toBe(
      "signedOut",
    );
  });

  it("returns loading while the group's pokemon ids are in flight", () => {
    expect(resolveGroupDetailState(false, USER, true, undefined, [], false)).toBe("loading");
  });

  it("returns notFound when the id list fails to load (a 404, or otherwise)", () => {
    expect(resolveGroupDetailState(false, USER, false, new Error("Not Found"), [], false)).toBe(
      "notFound",
    );
  });

  it("returns empty once loaded with no pokemon in the group", () => {
    expect(resolveGroupDetailState(false, USER, false, undefined, [], false)).toBe("empty");
  });

  it("returns loading while pokemonByIds is fetching the cards", () => {
    expect(resolveGroupDetailState(false, USER, false, undefined, ["25"], true)).toBe("loading");
  });

  it("returns list once both queries have resolved with pokemon to show", () => {
    expect(resolveGroupDetailState(false, USER, false, undefined, ["25"], false)).toBe("list");
  });
});
