import type { TypeDamageRelations } from "@/types";

/** The eighteen types in the order the games chart them, so the wheel always
 *  reads the same way whichever type you are looking at. */
export const TYPE_ORDER = [
  "normal",
  "fire",
  "water",
  "electric",
  "grass",
  "ice",
  "fighting",
  "poison",
  "ground",
  "flying",
  "psychic",
  "bug",
  "rock",
  "ghost",
  "dragon",
  "dark",
  "steel",
  "fairy",
];

/** How much damage changes hands, whichever way round it is going */
export type Multiplier = "double" | "normal" | "half" | "zero";

/**
 * How a slice is coloured. Mostly by whether the multiplier falls this type's
 * way rather than by the multiplier itself, because the same 2× is a win when
 * attacking and a weakness when defending — one green-is-good scale reads the
 * same on both rings. A multiplier of zero gets black either way: nothing gets
 * through, whichever direction it was going.
 */
export type Tint = "good" | "neutral" | "bad" | "none";

export interface Side {
  multiplier: Multiplier;
  /** "2×", "½×" and so on */
  symbol: string;
  label: string;
  tint: Tint;
}

export interface Matchup {
  type: string;
  /** What this type's attacks do to that one — the outer ring */
  attack: Side;
  /** What that type's attacks do to this one — the inner ring */
  defense: Side;
}

export type Direction = "attack" | "defense";

const SYMBOLS: Record<Multiplier, string> = {
  double: "2×",
  normal: "1×",
  half: "½×",
  zero: "0×",
};

const SIDES: Record<Direction, Record<Multiplier, { label: string; tint: Tint }>> = {
  attack: {
    double: { label: "Super effective", tint: "good" },
    normal: { label: "Normal damage", tint: "neutral" },
    half: { label: "Not very effective", tint: "bad" },
    zero: { label: "No effect", tint: "none" },
  },
  defense: {
    double: { label: "Weak to", tint: "bad" },
    normal: { label: "Normal damage", tint: "neutral" },
    half: { label: "Resists", tint: "good" },
    zero: { label: "Immune", tint: "none" },
  },
};

export const TINT_LABELS: Record<Tint, string> = {
  good: "Advantage",
  neutral: "Neutral",
  bad: "Disadvantage",
  none: "No effect",
};

const toSide = (direction: Direction, multiplier: Multiplier): Side => ({
  multiplier,
  symbol: SYMBOLS[multiplier],
  ...SIDES[direction][multiplier],
});

/**
 * Both halves of the type chart for one type: what its attacks do, and what it
 * takes. Anything the API didn't single out trades normal damage, which is most
 * of the eighteen on either side.
 */
export const getMatchups = (relations: TypeDamageRelations): Matchup[] => {
  const dealt = new Map<string, Multiplier>();
  for (const type of relations.doubleDamageTo) dealt.set(type, "double");
  for (const type of relations.halfDamageTo) dealt.set(type, "half");
  for (const type of relations.noDamageTo) dealt.set(type, "zero");

  const taken = new Map<string, Multiplier>();
  for (const type of relations.doubleDamageFrom) taken.set(type, "double");
  for (const type of relations.halfDamageFrom) taken.set(type, "half");
  for (const type of relations.noDamageFrom) taken.set(type, "zero");

  return TYPE_ORDER.map((type) => ({
    type,
    attack: toSide("attack", dealt.get(type) ?? "normal"),
    defense: toSide("defense", taken.get(type) ?? "normal"),
  }));
};

/**
 * What the readout says when nothing is picked: one count from each ring, a line
 * apiece so it sits the same way a picked matchup does.
 */
export const summariseMatchups = (matchups: Matchup[]): string[] => {
  const superEffective = matchups.filter((m) => m.attack.multiplier === "double").length;
  const weaknesses = matchups.filter((m) => m.defense.multiplier === "double").length;

  return [
    `${superEffective} super effective`,
    `${weaknesses} ${weaknesses === 1 ? "weakness" : "weaknesses"}`,
  ];
};

/**
 * A ring: one hard-stopped slice per type, tinted by whether that matchup falls
 * this type's way. Starts half a slice early so the first type sits at the top
 * rather than straddling it, and names colours as variables so the stylesheet
 * still owns them.
 */
export const buildTrackGradient = (matchups: Matchup[], direction: Direction): string => {
  const slice = 360 / matchups.length;
  const stops = matchups.map(
    (matchup, index) =>
      `var(--matchup-${matchup[direction].tint}) ${index * slice}deg ${(index + 1) * slice}deg`,
  );

  return `conic-gradient(from ${-slice / 2}deg, ${stops.join(", ")})`;
};

/** The whole matchup in a sentence, for the slice's label and tooltip. */
export const describeMatchup = ({ type, attack, defense }: Matchup): string =>
  `${type}: attacking ${attack.symbol} ${attack.label.toLowerCase()}, defending ${
    defense.symbol
  } ${defense.label.toLowerCase()}`;
