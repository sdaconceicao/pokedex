import type { DualTypeFilter, PokemonFilter, PokemonSort, PokemonType } from "@/types";
import { parsePage } from "./pagination";
import { DEFAULT_SORT, encodeSort, parseSort } from "./sort";
import { titleCase } from "./string";

export interface SearchFilterState {
  q: string;
  types: readonly string[];
  dualType?: DualTypeFilter;
  regions: readonly string[];
  pokedexes: readonly string[];
  sort: PokemonSort;
  page: number;
}

export interface DualTypeOption {
  id: string;
  label: string;
}

const NO_VALUES: readonly string[] = Object.freeze([]);

export const EMPTY_SEARCH_FILTERS: SearchFilterState = Object.freeze({
  q: "",
  types: NO_VALUES,
  regions: NO_VALUES,
  pokedexes: NO_VALUES,
  sort: DEFAULT_SORT,
  page: 1,
});

export type SearchParamsLike = Record<string, string | string[] | undefined> | URLSearchParams;

const readParam = (params: SearchParamsLike, key: string): string | undefined => {
  if (typeof (params as URLSearchParams).get === "function") {
    return (params as URLSearchParams).get(key) ?? undefined;
  }

  const value = (params as Record<string, string | string[] | undefined>)[key];
  return Array.isArray(value) ? value[0] : value;
};

const parseSlugList = (value: string | undefined): readonly string[] => {
  if (!value) return NO_VALUES;

  const slugs = value
    .split(",")
    .map((slug) => slug.trim().toLowerCase())
    .filter(Boolean);

  return slugs.length ? [...new Set(slugs)] : NO_VALUES;
};

const joinSlugs = (slugs: readonly string[] | undefined): string | undefined => {
  const cleaned = parseSlugList(slugs?.join(","));
  return cleaned.length ? cleaned.join(",") : undefined;
};

export const parseDualType = (value?: string | null): DualTypeFilter | undefined => {
  const slugs = [...parseSlugList(value ?? undefined)].sort();

  return slugs.length === 2 ? { primary: slugs[0], secondary: slugs[1] } : undefined;
};

export const encodeDualType = (pair?: DualTypeFilter): string | undefined => {
  if (!pair?.primary || !pair.secondary) return undefined;
  return joinSlugs([pair.primary, pair.secondary].sort());
};

export const parseSearchParams = (params: SearchParamsLike): SearchFilterState => {
  const q = (readParam(params, "q") ?? "").trim();

  return {
    q,
    types: parseSlugList(readParam(params, "types")),
    dualType: parseDualType(readParam(params, "dual")),
    regions: parseSlugList(readParam(params, "regions")),
    pokedexes: parseSlugList(readParam(params, "pokedexes")),
    sort: parseSort(readParam(params, "sort")),
    page: parsePage(readParam(params, "page")),
  };
};

/**
 * Builds the `/search` URL for a filter. Params are emitted in a fixed order and
 * empty facets are left off, so the same filter always produces the same link.
 *
 * @param state - The filter to link to; anything omitted is treated as unset
 * @returns A root-relative URL
 */
export const buildSearchUrl = (state: Partial<SearchFilterState> = {}): string => {
  const params = new URLSearchParams();
  const append = (key: string, value: string | undefined) => {
    if (value) params.set(key, value);
  };

  const q = state.q?.trim();

  append("q", q);
  append("types", joinSlugs(state.types));
  append("dual", encodeDualType(state.dualType));
  append("regions", joinSlugs(state.regions));
  append("pokedexes", joinSlugs(state.pokedexes));
  append("sort", encodeSort(state.sort));

  const page = state.page ?? 1;
  if (page > 1) params.set("page", String(page));

  // URLSearchParams escapes the separator to %2C. It is a legal query character
  // and these URLs are read by people, so it is put back — everything else stays
  // encoded.
  const query = params.toString().replace(/%2C/g, ",");

  return query ? `/search?${query}` : "/search";
};

/**
 * Maps parsed state onto the schema's `PokemonFilter` input.
 *
 * Empty facets are omitted rather than sent as null: the backend skips absent
 * facets, and a filter with none of them returns the whole dex.
 *
 * @param state - The parsed filter state
 * @returns The `filter` variable for the `pokemonFilter` query
 */
export const toPokemonFilter = (state: SearchFilterState): PokemonFilter => {
  const filter: PokemonFilter = {};

  const query = state.q.trim();

  if (query) filter.query = query;
  if (state.types.length) filter.types = [...state.types];
  if (state.dualType) filter.dualType = state.dualType;
  if (state.regions.length) filter.regions = [...state.regions];
  if (state.pokedexes.length) filter.pokedexes = [...state.pokedexes];

  return filter;
};

export const buildDualTypeOptions = (types: PokemonType[]): DualTypeOption[] => {
  const slugs = [...new Set(types.map((type) => type.name.trim().toLowerCase()).filter(Boolean))];
  slugs.sort();

  const options: DualTypeOption[] = [];

  for (let i = 0; i < slugs.length; i++) {
    for (let j = i + 1; j < slugs.length; j++) {
      options.push({
        id: `${slugs[i]},${slugs[j]}`,
        label: `${titleCase(slugs[i])} / ${titleCase(slugs[j])}`,
      });
    }
  }

  return options;
};

export const hasActiveFilters = (state: SearchFilterState): boolean =>
  Boolean(state.q.trim() || state.dualType) ||
  state.types.length > 0 ||
  state.regions.length > 0 ||
  state.pokedexes.length > 0;

const describeSoleFacet = (state: SearchFilterState): string | null => {
  if (state.q.trim()) return `Search results for "${state.q.trim()}"`;
  if (state.dualType) {
    return `Pokemon of type: ${titleCase(state.dualType.primary)} / ${titleCase(state.dualType.secondary)}`;
  }
  if (state.types.length === 1) return `Pokemon of type: ${titleCase(state.types[0])}`;
  if (state.regions.length === 1) return `Pokemon from region: ${titleCase(state.regions[0])}`;
  if (state.pokedexes.length === 1) {
    return `Pokemon from pokedex: ${titleCase(state.pokedexes[0])}`;
  }

  return null;
};

export const getSearchHeading = (state: SearchFilterState): string => {
  if (!hasActiveFilters(state)) return "All Pokemon";

  const facets = [
    state.q.trim(),
    state.dualType,
    state.types.length,
    state.regions.length,
    state.pokedexes.length,
  ].filter(Boolean).length;

  return (facets === 1 && describeSoleFacet(state)) || "Filtered Pokemon";
};
