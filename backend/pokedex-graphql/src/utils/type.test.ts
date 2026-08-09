import type { TypeResponse, TypeSprites } from "../datasources/pokemon-api.types";
import { convertTypeToTypeDetail, getTypeSprite } from "./type";

const named = (...names: string[]) => names.map((name) => ({ name, url: "" }));

const sprites: TypeSprites = {
  "generation-iii": { emerald: { name_icon: "iii/emerald.png", symbol_icon: null } },
  "generation-ix": {
    "scarlet-violet": { name_icon: "ix/name.png", symbol_icon: "ix/symbol.png" },
  },
  "generation-viii": {
    "sword-shield": { name_icon: "viii/name.png", symbol_icon: "viii/symbol.png" },
  },
};

const fire = {
  id: 10,
  name: "fire",
  names: [
    { name: "ほのお", language: { name: "ja-hrkt", url: "" } },
    { name: "Fire", language: { name: "en", url: "" } },
  ],
  generation: { name: "generation-i", url: "" },
  damage_relations: {
    double_damage_to: named("grass", "ice", "bug", "steel"),
    half_damage_to: named("fire", "water", "rock", "dragon"),
    no_damage_to: [],
    double_damage_from: named("ground", "rock", "water"),
    half_damage_from: named("fire", "grass", "ice", "bug", "steel", "fairy"),
    no_damage_from: [],
  },
  pokemon: new Array(109).fill({ slot: 1, pokemon: { name: "charmander", url: "" } }),
  moves: new Array(47).fill({ name: "fire-punch", url: "" }),
  sprites,
} as unknown as TypeResponse;

describe("getTypeSprite", () => {
  it("prefers the newest generation's symbol icon", () => {
    expect(getTypeSprite(sprites)).toBe("ix/symbol.png");
  });

  it("falls back to another generation's symbol icon", () => {
    const older: TypeSprites = {
      "generation-viii": {
        "sword-shield": { name_icon: "viii/name.png", symbol_icon: "viii/symbol.png" },
      },
    };

    expect(getTypeSprite(older)).toBe("viii/symbol.png");
  });

  it("falls back to a name badge when no symbol exists", () => {
    const nameOnly: TypeSprites = {
      "generation-iii": { emerald: { name_icon: "iii/emerald.png", symbol_icon: null } },
    };

    expect(getTypeSprite(nameOnly)).toBe("iii/emerald.png");
  });

  it("returns null when there are no icons at all", () => {
    expect(getTypeSprite({})).toBeNull();
    expect(getTypeSprite(undefined)).toBeNull();
  });
});

describe("convertTypeToTypeDetail", () => {
  it("flattens the type response into the schema shape", () => {
    expect(convertTypeToTypeDetail(fire)).toEqual({
      id: "10",
      name: "fire",
      displayName: "Fire",
      generation: "generation-i",
      sprite: "ix/symbol.png",
      pokemonCount: 109,
      moveCount: 47,
      damageRelations: {
        doubleDamageTo: ["grass", "ice", "bug", "steel"],
        halfDamageTo: ["fire", "water", "rock", "dragon"],
        noDamageTo: [],
        doubleDamageFrom: ["ground", "rock", "water"],
        halfDamageFrom: ["fire", "grass", "ice", "bug", "steel", "fairy"],
        noDamageFrom: [],
      },
    });
  });

  it("returns a null generation when the type has none", () => {
    const orphan = { ...fire, generation: undefined } as unknown as TypeResponse;

    expect(convertTypeToTypeDetail(orphan).generation).toBeNull();
  });
});
