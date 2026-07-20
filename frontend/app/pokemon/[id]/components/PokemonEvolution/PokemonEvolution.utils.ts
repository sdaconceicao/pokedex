import type { EvolutionChain, EvolutionNode } from "@/types/graphql";

/**
 * True when the chain has at least one evolution beyond the base Pokemon.
 * Pokemon that never evolve still return a chain (a single node with no
 * `evolvesTo`), so this is used to hide the evolution section entirely.
 */
export const hasEvolutions = (evolution: EvolutionChain | null | undefined): boolean =>
  (evolution?.chain?.evolvesTo?.length ?? 0) > 0;

/**
 * Turns a hyphenated PokeAPI slug into a human readable label,
 * e.g. "water-stone" -> "Water Stone", "level-up" -> "Level Up"
 */
export const humanize = (slug: string): string =>
  slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

/**
 * Describes how a Pokemon evolves into the given node — shown on the arrow
 * between two stages. Prefers the most specific info available:
 * item > level > trigger. Returns an empty string when nothing is known.
 */
export const getEvolutionCondition = (node: EvolutionNode): string => {
  if (node.item) return `Use ${humanize(node.item)}`;
  if (node.minLevel) return `Lv. ${node.minLevel}`;
  if (node.trigger) return humanize(node.trigger);
  return "";
};
