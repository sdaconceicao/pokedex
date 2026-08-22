import type { PokemonIndex } from "../datasources/pokemon-api.types.js";
import { PokemonSort } from "../types.js";

export const byNumber = (a: PokemonIndex, b: PokemonIndex): number => a.number - b.number;

export const sortByNumber = (results: PokemonIndex[]): PokemonIndex[] =>
  [...results].sort(byNumber);

const collator = new Intl.Collator("en");
export const byName = (a: PokemonIndex, b: PokemonIndex): number =>
  collator.compare(a.name, b.name);

export const sortResults = (
  results: PokemonIndex[],
  sort: PokemonSort = PokemonSort.IdAsc,
): PokemonIndex[] => {
  const compare = sort === PokemonSort.NameAsc || sort === PokemonSort.NameDesc ? byName : byNumber;
  const direction = sort.endsWith("_DESC") ? -1 : 1;
  return [...results].sort((a, b) => compare(a, b) * direction);
};

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
