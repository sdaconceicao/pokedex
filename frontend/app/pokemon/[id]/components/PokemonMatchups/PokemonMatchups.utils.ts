import type { DefensiveMatchup, TypeOffense } from "@/types";
import type { Tint } from "../MatchupChip/MatchupChip";

export interface MultiplierRow {
  multiplier: number;
  symbol: string;
  types: string[];
}

export interface MatchupGroup {
  heading: string;
  tint: Tint;
  rows: MultiplierRow[];
}

export interface OffenseRow extends MultiplierRow {
  tint: Tint;
}

export interface OffenseGroup {
  type: string;
  rows: OffenseRow[];
}

const SYMBOLS = new Map<number, string>([
  [4, "4×"],
  [2, "2×"],
  [0.5, "½×"],
  [0.25, "¼×"],
  [0, "0×"],
]);

const DEFENSIVE_GROUPS: { heading: string; tint: Tint; multipliers: number[] }[] = [
  { heading: "Weak to", tint: "bad", multipliers: [4, 2] },
  { heading: "Resists", tint: "good", multipliers: [0.5, 0.25] },
  { heading: "Immune", tint: "none", multipliers: [0] },
];

export const formatMultiplier = (multiplier: number): string =>
  SYMBOLS.get(multiplier) ?? `${multiplier}×`;

export const groupDefensiveMatchups = (matchups: DefensiveMatchup[]): MatchupGroup[] =>
  DEFENSIVE_GROUPS.map(({ heading, tint, multipliers }) => ({
    heading,
    tint,
    rows: multipliers
      .map((multiplier) => ({
        multiplier,
        symbol: formatMultiplier(multiplier),
        types: matchups
          .filter((matchup) => matchup.multiplier === multiplier)
          .map(({ type }) => type),
      }))
      .filter(({ types }) => types.length > 0),
  }));

const OFFENSIVE_ROWS: {
  multiplier: number;
  tint: Tint;
  pick: (offense: TypeOffense) => string[];
}[] = [
  { multiplier: 2, tint: "good", pick: ({ superEffective }) => superEffective },
  { multiplier: 0.5, tint: "bad", pick: ({ notVeryEffective }) => notVeryEffective },
  { multiplier: 0, tint: "none", pick: ({ noEffect }) => noEffect },
];

export const groupOffensiveMatchups = (attacking: TypeOffense[]): OffenseGroup[] =>
  attacking.map((offense) => ({
    type: offense.type,
    rows: OFFENSIVE_ROWS.map(({ multiplier, tint, pick }) => ({
      multiplier,
      symbol: formatMultiplier(multiplier),
      tint,
      types: pick(offense),
    })),
  }));
