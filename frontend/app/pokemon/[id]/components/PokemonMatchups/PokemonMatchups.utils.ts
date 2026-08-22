import type { DefensiveMatchup, TypeOffense } from "@/types";
import type { Tint } from "../MatchupChip/MatchupChip";

/** One multiplier's worth of types, under a heading that may hold several. */
export interface MultiplierRow {
  multiplier: number;
  /** "4×", "½×" and so on */
  symbol: string;
  types: string[];
}

/** A defensive heading — "Weak to" gathers both 4x and 2x beneath it. */
export interface MatchupGroup {
  heading: string;
  tint: Tint;
  rows: MultiplierRow[];
}

/** A defensive row carries its tint on the group; an offensive one carries its
 *  own, because one type deals all three multipliers at once. */
export interface OffenseRow extends MultiplierRow {
  tint: Tint;
}

/** One of the Pokemon's own types, and what it deals. Never merged with the
 *  other: each type attacks on its own. */
export interface OffenseGroup {
  type: string;
  rows: OffenseRow[];
}

/** Every multiplier a dual type can produce, and nothing else: 153 type pairs
 *  against 18 attackers reach exactly these five once 1x is dropped. */
const SYMBOLS = new Map<number, string>([
  [4, "4×"],
  [2, "2×"],
  [0.5, "½×"],
  [0.25, "¼×"],
  [0, "0×"],
]);

/**
 * Headings in reading order, each claiming the multipliers that belong to it.
 * Wording is the wheel's own defensive vocabulary, so the same matchup is
 * described the same way on the type page and here.
 */
const DEFENSIVE_GROUPS: { heading: string; tint: Tint; multipliers: number[] }[] = [
  { heading: "Weak to", tint: "bad", multipliers: [4, 2] },
  { heading: "Resists", tint: "good", multipliers: [0.5, 0.25] },
  { heading: "Immune", tint: "none", multipliers: [0] },
];

/** The multiplier as the games write it. */
export const formatMultiplier = (multiplier: number): string =>
  SYMBOLS.get(multiplier) ?? `${multiplier}×`;

/**
 * The defensive column. Every heading is returned whether or not it has any
 * types, so the column keeps its shape between Pokemon and the caller can say
 * "None"; the rows inside it are dropped when empty, since a heading with no 4x
 * has nothing to say about 4x.
 */
export const groupDefensiveMatchups = (matchups: DefensiveMatchup[]): MatchupGroup[] =>
  DEFENSIVE_GROUPS.map(({ heading, tint, multipliers }) => ({
    heading,
    tint,
    rows: multipliers
      .map((multiplier) => ({
        multiplier,
        symbol: formatMultiplier(multiplier),
        // Already ordered upstream, so no re-sorting here
        types: matchups
          .filter((matchup) => matchup.multiplier === multiplier)
          .map(({ type }) => type),
      }))
      .filter(({ types }) => types.length > 0),
  }));

/**
 * What each of a type's three lists is worth. Offence never stacks, so 2x, ½x
 * and 0x are the only multipliers it can produce — the absence of 4x and ¼x here
 * is the asymmetry with the defending column, in plain sight.
 */
const OFFENSIVE_ROWS: {
  multiplier: number;
  tint: Tint;
  pick: (offense: TypeOffense) => string[];
}[] = [
  { multiplier: 2, tint: "good", pick: ({ superEffective }) => superEffective },
  { multiplier: 0.5, tint: "bad", pick: ({ notVeryEffective }) => notVeryEffective },
  { multiplier: 0, tint: "none", pick: ({ noEffect }) => noEffect },
];

/**
 * The attacking column, one group per type and never combined: two types that
 * are both 2x into grass give two separate 2x readings, not 4x. Labelled by
 * multiplier rather than by wording, so both columns are read the same way and a
 * 2x dealt sits plainly beside a ½x taken. All three rows are kept even when
 * empty, matching the defensive column's fixed headings.
 */
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
