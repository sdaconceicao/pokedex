import type { DefensiveMatchup, TypeOffense } from "@/types";
import {
  formatMultiplier,
  groupDefensiveMatchups,
  groupOffensiveMatchups,
} from "./PokemonMatchups.utils";

const m = (type: string, multiplier: number): DefensiveMatchup => ({ type, multiplier });

// Both payloads are what the running backend returns for these two, so a
// fixture can't drift from what the API actually sends.
const charizard: DefensiveMatchup[] = [
  m("rock", 4),
  m("electric", 2),
  m("water", 2),
  m("fairy", 0.5),
  m("fighting", 0.5),
  m("fire", 0.5),
  m("steel", 0.5),
  m("bug", 0.25),
  m("grass", 0.25),
  m("ground", 0),
];

const bulbasaur: DefensiveMatchup[] = [
  m("fire", 2),
  m("flying", 2),
  m("ice", 2),
  m("psychic", 2),
  m("electric", 0.5),
  m("fairy", 0.5),
  m("fighting", 0.5),
  m("water", 0.5),
  m("grass", 0.25),
];

const offense = (type: string, parts: Partial<TypeOffense>): TypeOffense => ({
  type,
  superEffective: [],
  notVeryEffective: [],
  noEffect: [],
  ...parts,
});

describe("formatMultiplier", () => {
  it("writes each reachable multiplier the way the games do", () => {
    expect(formatMultiplier(4)).toBe("4×");
    expect(formatMultiplier(2)).toBe("2×");
    expect(formatMultiplier(0.5)).toBe("½×");
    expect(formatMultiplier(0.25)).toBe("¼×");
    expect(formatMultiplier(0)).toBe("0×");
  });

  it("falls back rather than rendering undefined for anything unexpected", () => {
    expect(formatMultiplier(8)).toBe("8×");
  });
});

describe("groupDefensiveMatchups", () => {
  it("always returns all three headings, in reading order", () => {
    for (const payload of [charizard, bulbasaur, []]) {
      expect(groupDefensiveMatchups(payload).map(({ heading }) => heading)).toEqual([
        "Weak to",
        "Resists",
        "Immune",
      ]);
    }
  });

  it("gathers 4x and 2x under one weakness heading", () => {
    const [weakTo] = groupDefensiveMatchups(charizard);

    expect(weakTo.rows).toEqual([
      { multiplier: 4, symbol: "4×", types: ["rock"] },
      { multiplier: 2, symbol: "2×", types: ["electric", "water"] },
    ]);
  });

  it("gathers both resistances under one heading", () => {
    const [, resists] = groupDefensiveMatchups(charizard);

    expect(resists.rows).toEqual([
      { multiplier: 0.5, symbol: "½×", types: ["fairy", "fighting", "fire", "steel"] },
      { multiplier: 0.25, symbol: "¼×", types: ["bug", "grass"] },
    ]);
  });

  it("leaves a heading with nothing to say empty, so the caller can say None", () => {
    // Bulbasaur has no immunity, and nothing at 4x either
    const [weakTo, , immune] = groupDefensiveMatchups(bulbasaur);

    expect(immune.rows).toEqual([]);
    expect(weakTo.rows.map(({ multiplier }) => multiplier)).toEqual([2]);
  });

  it("drops a multiplier row rather than showing it with no types", () => {
    const rows = groupDefensiveMatchups(bulbasaur).flatMap(({ rows }) => rows);

    expect(rows.every(({ types }) => types.length > 0)).toBe(true);
  });

  it("tints weaknesses bad, resistances good and immunity as no-damage", () => {
    expect(groupDefensiveMatchups(charizard).map(({ tint }) => tint)).toEqual([
      "bad",
      "good",
      "none",
    ]);
  });

  it("keeps the order the backend sent", () => {
    const [, resists] = groupDefensiveMatchups(bulbasaur);

    expect(resists.rows[0].types).toEqual(["electric", "fairy", "fighting", "water"]);
  });
});

describe("groupOffensiveMatchups", () => {
  it("never reaches 4x or ¼x, because offence does not stack", () => {
    const multipliers = groupOffensiveMatchups([
      offense("fire", { superEffective: ["grass"] }),
      offense("flying", { superEffective: ["grass"] }),
    ]).flatMap(({ rows }) => rows.map(({ multiplier }) => multiplier));

    expect(new Set(multipliers)).toEqual(new Set([2, 0.5, 0]));
  });

  it("keeps one group per type rather than combining them", () => {
    const groups = groupOffensiveMatchups([
      offense("fire", { superEffective: ["bug", "steel", "grass", "ice"] }),
      offense("flying", { superEffective: ["fighting", "bug", "grass"] }),
    ]);

    expect(groups.map(({ type }) => type)).toEqual(["fire", "flying"]);
    // Both are 2x into grass; two readings of 2x, never one of 4x
    expect(groups.every(({ rows }) => rows[0].types.includes("grass"))).toBe(true);
  });

  it("keeps all three multipliers even when a list is empty", () => {
    const [fire] = groupOffensiveMatchups([offense("fire", { superEffective: ["grass"] })]);

    expect(fire.rows.map(({ symbol }) => symbol)).toEqual(["2×", "½×", "0×"]);
    expect(fire.rows[2].types).toEqual([]);
  });

  it("carries each list onto the matching multiplier and tint", () => {
    const [poison] = groupOffensiveMatchups([
      offense("poison", {
        superEffective: ["grass", "fairy"],
        notVeryEffective: ["poison", "ground", "rock", "ghost"],
        noEffect: ["steel"],
      }),
    ]);

    expect(poison.rows).toEqual([
      { multiplier: 2, symbol: "2×", tint: "good", types: ["grass", "fairy"] },
      {
        multiplier: 0.5,
        symbol: "½×",
        tint: "bad",
        types: ["poison", "ground", "rock", "ghost"],
      },
      { multiplier: 0, symbol: "0×", tint: "none", types: ["steel"] },
    ]);
  });
});
