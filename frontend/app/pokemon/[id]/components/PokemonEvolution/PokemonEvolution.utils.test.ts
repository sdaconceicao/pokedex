import type { EvolutionChain, EvolutionNode } from "@/types/graphql";
import { getEvolutionCondition, hasEvolutions, humanize } from "./PokemonEvolution.utils";

const makeNode = (overrides: Partial<EvolutionNode>): EvolutionNode => ({
  id: "1",
  name: "test",
  image: "https://example.com/test.png",
  minLevel: null,
  trigger: null,
  item: null,
  evolvesTo: [],
  ...overrides,
});

describe("hasEvolutions", () => {
  it("returns true when the base Pokemon evolves", () => {
    const evolution: EvolutionChain = {
      id: "1",
      chain: makeNode({ evolvesTo: [makeNode({ id: "2" })] }),
    };
    expect(hasEvolutions(evolution)).toBe(true);
  });

  it("returns false when the chain has a single, non-evolving Pokemon", () => {
    const evolution: EvolutionChain = {
      id: "1",
      chain: makeNode({ evolvesTo: [] }),
    };
    expect(hasEvolutions(evolution)).toBe(false);
  });

  it("returns false when evolvesTo is absent (unselected by the query)", () => {
    const chain = makeNode({});
    delete (chain as { evolvesTo?: unknown }).evolvesTo;
    expect(hasEvolutions({ id: "1", chain })).toBe(false);
  });

  it("returns false for null or undefined", () => {
    expect(hasEvolutions(null)).toBe(false);
    expect(hasEvolutions(undefined)).toBe(false);
  });
});

describe("humanize", () => {
  it("capitalizes a hyphenated slug", () => {
    expect(humanize("water-stone")).toBe("Water Stone");
  });

  it("capitalizes a single word", () => {
    expect(humanize("trade")).toBe("Trade");
  });

  it("capitalizes level-up trigger", () => {
    expect(humanize("level-up")).toBe("Level Up");
  });
});

describe("getEvolutionCondition", () => {
  it("prefers the item when present", () => {
    const node = makeNode({
      item: "water-stone",
      trigger: "use-item",
      minLevel: null,
    });
    expect(getEvolutionCondition(node)).toBe("Use Water Stone");
  });

  it("falls back to the level when there is no item", () => {
    const node = makeNode({ minLevel: 16, trigger: "level-up" });
    expect(getEvolutionCondition(node)).toBe("Lv. 16");
  });

  it("falls back to the trigger when there is no item or level", () => {
    const node = makeNode({ trigger: "trade" });
    expect(getEvolutionCondition(node)).toBe("Trade");
  });

  it("returns an empty string for the base form with no details", () => {
    expect(getEvolutionCondition(makeNode({}))).toBe("");
  });
});
