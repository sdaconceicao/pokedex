import type { PokemonIndex } from "../datasources/pokemon-api.types.js";

// National dex number is the canonical order for every list this API returns.
// Facet sources disagree on their own natural order (the type endpoint returns
// API order, the region merge used to sort by name), so ordering is applied
// once, after set composition, rather than trusted from upstream.
export const byNumber = (a: PokemonIndex, b: PokemonIndex): number => a.number - b.number;

export const sortByNumber = (results: PokemonIndex[]): PokemonIndex[] =>
  [...results].sort(byNumber);

/**
 * OR within a facet: every entry that appeared in at least one list, deduped by
 * id, first occurrence winning.
 */
export const union = (lists: PokemonIndex[][]): PokemonIndex[] => {
  const merged = new Map<string, PokemonIndex>();

  for (const list of lists) {
    for (const entry of list) {
      if (!merged.has(entry.id)) {
        merged.set(entry.id, entry);
      }
    }
  }

  return Array.from(merged.values());
};

/**
 * AND across facets: only entries present in every group. An empty group list
 * yields nothing — callers that mean "no filters applied" handle that case
 * before calling, since the two are not the same thing.
 */
export const intersect = (groups: PokemonIndex[][]): PokemonIndex[] => {
  if (groups.length === 0) return [];

  const [first, ...rest] = groups;
  const others = rest.map((group) => new Set(group.map((entry) => entry.id)));
  const merged = new Map<string, PokemonIndex>();

  for (const entry of first) {
    if (merged.has(entry.id)) continue;
    if (others.every((ids) => ids.has(entry.id))) {
      merged.set(entry.id, entry);
    }
  }

  return Array.from(merged.values());
};
