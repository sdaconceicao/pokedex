import type { TypeDamageRelations } from "@/types";
import {
  buildTrackGradient,
  describeMatchup,
  getMatchups,
  summariseMatchups,
  TYPE_ORDER,
} from "./TypeWheel.utils";

const relations: TypeDamageRelations = {
  doubleDamageTo: ["grass", "ice", "bug", "steel"],
  halfDamageTo: ["fire", "water", "rock", "dragon"],
  noDamageTo: [],
  doubleDamageFrom: ["ground", "rock", "water"],
  halfDamageFrom: ["fairy"],
  noDamageFrom: [],
};

const byType = (rels = relations) => new Map(getMatchups(rels).map((m) => [m.type, m]));

describe("getMatchups", () => {
  it("covers every type, in chart order", () => {
    const matchups = getMatchups(relations);

    expect(matchups).toHaveLength(18);
    expect(matchups.map((m) => m.type)).toEqual(TYPE_ORDER);
  });

  it("reads what this type's attacks do off the *To relations", () => {
    const types = byType();

    expect(types.get("grass")?.attack).toMatchObject({
      multiplier: "double",
      symbol: "2×",
      label: "Super effective",
      tint: "good",
    });
    expect(types.get("water")?.attack).toMatchObject({
      multiplier: "half",
      label: "Not very effective",
      tint: "bad",
    });
  });

  it("reads what it takes off the *From relations", () => {
    const types = byType();

    expect(types.get("ground")?.defense).toMatchObject({
      multiplier: "double",
      symbol: "2×",
      label: "Weak to",
      tint: "bad",
    });
    expect(types.get("fairy")?.defense).toMatchObject({
      multiplier: "half",
      label: "Resists",
      tint: "good",
    });
  });

  it("colours by advantage, not by multiplier — 2× is a win attacking and a weakness defending", () => {
    const types = byType();

    expect(types.get("grass")?.attack).toMatchObject({ symbol: "2×", tint: "good" });
    expect(types.get("ground")?.defense).toMatchObject({ symbol: "2×", tint: "bad" });
  });

  it("colours a zero multiplier black either way — nothing gets through", () => {
    const types = byType({ ...relations, noDamageTo: ["ghost"], noDamageFrom: ["dragon"] });

    expect(types.get("ghost")?.attack).toMatchObject({ symbol: "0×", tint: "none" });
    expect(types.get("dragon")?.defense).toMatchObject({ symbol: "0×", tint: "none" });
  });

  it("gives a type both sides at once", () => {
    // Water resists fire's attacks and hits back hard
    expect(byType().get("water")).toMatchObject({
      attack: { symbol: "½×", tint: "bad" },
      defense: { symbol: "2×", tint: "bad" },
    });
  });

  it("treats anything the API didn't single out as an even trade", () => {
    const psychic = byType().get("psychic");

    expect(psychic?.attack).toMatchObject({ symbol: "1×", tint: "neutral" });
    expect(psychic?.defense).toMatchObject({ symbol: "1×", tint: "neutral" });
  });

  it("handles the zero cases on both sides", () => {
    const types = byType({ ...relations, noDamageTo: ["ghost"], noDamageFrom: ["dragon"] });

    expect(types.get("ghost")?.attack).toMatchObject({
      symbol: "0×",
      label: "No effect",
      tint: "none",
    });
    expect(types.get("dragon")?.defense).toMatchObject({
      symbol: "0×",
      label: "Immune",
      tint: "none",
    });
  });
});

describe("summariseMatchups", () => {
  it("counts one thing from each ring", () => {
    expect(summariseMatchups(getMatchups(relations))).toBe("4 super effective · 3 weaknesses");
  });

  it("keeps a single weakness singular", () => {
    const one = { ...relations, doubleDamageFrom: ["ground"] };

    expect(summariseMatchups(getMatchups(one))).toBe("4 super effective · 1 weakness");
  });
});

describe("buildTrackGradient", () => {
  it("tints the outer ring by what the type's attacks do", () => {
    const gradient = buildTrackGradient(getMatchups(relations), "attack");

    expect(gradient).toContain("conic-gradient(from -10deg");
    // grass is the fifth type, and fire is super effective against it
    expect(gradient).toContain("var(--wheel-good) 80deg 100deg");
    expect(gradient).toContain("340deg 360deg");
  });

  it("paints a zero slice black on whichever ring it falls", () => {
    const matchups = getMatchups({ ...relations, noDamageFrom: ["dragon"] });

    // dragon is fifteenth in chart order
    expect(buildTrackGradient(matchups, "defense")).toContain("var(--wheel-none) 280deg 300deg");
  });

  it("tints the inner ring by what the type takes", () => {
    const gradient = buildTrackGradient(getMatchups(relations), "defense");

    // water is third, and it hits fire for double
    expect(gradient).toContain("var(--wheel-bad) 40deg 60deg");
    // grass only trades evenly on the way in
    expect(gradient).toContain("var(--wheel-neutral) 80deg 100deg");
  });
});

describe("describeMatchup", () => {
  it("says both halves in one sentence", () => {
    const grass = byType().get("grass");

    expect(grass && describeMatchup(grass)).toBe(
      "grass: attacking 2× super effective, defending 1× normal damage",
    );
  });
});
