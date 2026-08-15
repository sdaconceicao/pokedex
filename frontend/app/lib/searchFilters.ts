import type { DualTypeFilter, PokemonFilter, PokemonSort, PokemonType } from "@/types";
import { parsePage } from "./pagination";
import { DEFAULT_SORT, encodeSort, parseSort } from "./sort";
import { titleCase } from "./string";

/** The two curated collections the sidebar links to. They are not a facet of
 *  their own in the schema — each is really a name substring — so they ride in
 *  on `query` and only exist to keep their own heading. */
export const SPECIALS = ["gmax", "mega"] as const;
export type Special = (typeof SPECIALS)[number];

export const SPECIAL_TITLES: Record<Special, string> = {
  gmax: "Gigantamax",
  mega: "Mega Evolve",
};

/** Everything `/search` can be asked for, parsed out of the URL. The lists are
 *  `readonly` because they are shared with lago's `MultiSelect`, whose `value`
 *  is a `readonly Key[]`, and because `EMPTY_SEARCH_FILTERS` below is a shared
 *  default nothing should be able to reach back into. */
export interface SearchFilterState {
  q: string;
  types: readonly string[];
  dualType?: DualTypeFilter;
  regions: readonly string[];
  pokedexes: readonly string[];
  special?: Special;
  sort: PokemonSort;
  page: number;
}

/** One entry in the dual-type `Select`. `id` is the same string `dual` carries
 *  in the URL, so restoring a filter selects the matching option by key. */
export interface DualTypeOption {
  id: string;
  label: string;
}

const NO_VALUES: readonly string[] = Object.freeze([]);

/** A filter with nothing set: the fallback for a bare `/search`, and what Clear
 *  resets the form to. */
export const EMPTY_SEARCH_FILTERS: SearchFilterState = Object.freeze({
  q: "",
  types: NO_VALUES,
  regions: NO_VALUES,
  pokedexes: NO_VALUES,
  sort: DEFAULT_SORT,
  page: 1,
});

/** Either half of the two shapes a URL query arrives in: Next's `searchParams`
 *  on the server, or `useSearchParams()` on the client. */
export type SearchParamsLike = Record<string, string | string[] | undefined> | URLSearchParams;

const readParam = (params: SearchParamsLike, key: string): string | undefined => {
  // Duck-typed rather than `instanceof`: Next's client-side ReadonlyURLSearchParams
  // is a distinct class, and on the server this is a plain object.
  if (typeof (params as URLSearchParams).get === "function") {
    return (params as URLSearchParams).get(key) ?? undefined;
  }

  const value = (params as Record<string, string | string[] | undefined>)[key];
  // Nothing here ever emits a repeated key, but a hand-typed URL can, and Next
  // hands those back as an array. Take the first rather than "fire,water".
  return Array.isArray(value) ? value[0] : value;
};

/** Normalizes a comma-joined slug list. Applied on the way out as well as in,
 *  so a URL this module builds always re-parses to the state it came from. */
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

/**
 * Reads the `dual` param into the pair the schema wants.
 *
 * The pair is sorted, because the backend matches it regardless of slot order
 * while the `Select` matches its restored value by exact `id` — an unsorted
 * "flying,fire" would filter correctly but leave the field looking empty.
 *
 * @param value - The raw `dual` param
 * @returns The pair, or nothing if it isn't two distinct types
 */
export const parseDualType = (value?: string | null): DualTypeFilter | undefined => {
  // parseSlugList dedupes, so a doubled type collapses to one and falls out
  // here — a Pokemon cannot be a dual type of one type.
  const slugs = [...parseSlugList(value ?? undefined)].sort();

  return slugs.length === 2 ? { primary: slugs[0], secondary: slugs[1] } : undefined;
};

/**
 * The inverse of {@link parseDualType} — sorted the same way, for the same reason.
 * @param pair - The dual type pair, if one is selected
 * @returns The `dual` param value, or nothing when there is no complete pair
 */
export const encodeDualType = (pair?: DualTypeFilter): string | undefined => {
  if (!pair?.primary || !pair.secondary) return undefined;
  return joinSlugs([pair.primary, pair.secondary].sort());
};

const parseSpecial = (value: string | undefined): Special | undefined => {
  const special = value?.trim().toLowerCase();
  return SPECIALS.includes(special as Special) ? (special as Special) : undefined;
};

/**
 * Reads a whole filter out of a URL query. Unknown params are ignored and
 * malformed ones fall back to their empty value rather than throwing — a URL is
 * user input, and a bad facet should narrow to nothing, not break the page.
 *
 * Slugs are not checked against the live option lists, which keeps this pure;
 * an unknown slug simply ANDs the result set down to zero.
 *
 * @param params - Next's `searchParams` object, or a `URLSearchParams`
 * @returns The parsed filter state
 */
export const parseSearchParams = (params: SearchParamsLike): SearchFilterState => {
  const q = (readParam(params, "q") ?? "").trim();

  // `PokemonFilter` has a single `query` field, so free text and a `special`
  // shortcut cannot both be honoured. Free text wins and the shortcut is
  // dropped outright, so the URL, the heading and the form all agree.
  const special = q ? undefined : parseSpecial(readParam(params, "special"));

  return {
    q,
    types: parseSlugList(readParam(params, "types")),
    dualType: parseDualType(readParam(params, "dual")),
    regions: parseSlugList(readParam(params, "regions")),
    pokedexes: parseSlugList(readParam(params, "pokedexes")),
    special,
    sort: parseSort(readParam(params, "sort")),
    page: parsePage(readParam(params, "page")),
  };
};

/** What the home page used to accept, before every facet moved to `/search`:
 *  one value per facet, under a singular name. */
const LEGACY_PARAMS = [
  ["type", "types"],
  ["pokedex", "pokedexes"],
  ["region", "regions"],
] as const;

/**
 * Reads a pre-`/search` home page URL, so old links and bookmarks still land on
 * the results they asked for instead of the browse screen.
 *
 * @param params - Next's `searchParams` object, or a `URLSearchParams`
 * @returns The equivalent filter, or nothing if this isn't a legacy link
 */
export const parseLegacySearchParams = (params: SearchParamsLike): SearchFilterState | null => {
  const legacy: Record<string, string> = {};

  for (const [from, to] of LEGACY_PARAMS) {
    const value = readParam(params, from);
    if (value) legacy[to] = value;
  }

  const q = readParam(params, "q");
  const special = readParam(params, "special");

  // These two kept their names, but the home page no longer answers them, so
  // they still need forwarding.
  if (q) legacy.q = q;
  if (special) legacy.special = special;

  // A bare `/` asks for nothing and stays where it is.
  return Object.keys(legacy).length ? parseSearchParams(legacy) : null;
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
  // Mirrors the precedence in parseSearchParams, so a URL never carries a
  // `special` that reading it back would discard.
  if (!q) append("special", state.special);

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

  // `special` is only ever a name substring, and `query` is the one field for
  // both, so the two share it.
  const query = state.q.trim() || state.special;

  if (query) filter.query = query;
  if (state.types.length) filter.types = [...state.types];
  if (state.dualType) filter.dualType = state.dualType;
  if (state.regions.length) filter.regions = [...state.regions];
  if (state.pokedexes.length) filter.pokedexes = [...state.pokedexes];

  return filter;
};

/**
 * Every unordered pair of the live types, as options for the dual-type `Select`.
 * Around 150 for a full dex — a lot for a list, but the field filters as you
 * type, and the alternative is two coupled selects.
 *
 * @param types - The types the API reports, in any order
 * @returns The pairs, sorted, keyed the way the URL spells them
 */
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

/**
 * Whether anything is being filtered on — an empty filter is a request to
 * browse the whole dex, not an error.
 * @param state - The parsed filter state
 * @returns True when at least one facet is set
 */
export const hasActiveFilters = (state: SearchFilterState): boolean =>
  // Trimmed, because this is asked of a draft straight out of a text field as
  // well as of a parsed URL, and whitespace is not a filter.
  Boolean(state.q.trim() || state.special || state.dualType) ||
  state.types.length > 0 ||
  state.regions.length > 0 ||
  state.pokedexes.length > 0;

/** Names the one facet that is set, in the wording the per-facet pages used
 *  before they all became `/search`. Only for a single value: "Pokemon from
 *  region: Kanto, Johto" reads as one place with a comma in it. */
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

/**
 * The `<h1>` for a set of results.
 *
 * A search on one facet keeps the wording that facet's own page used, because
 * that is what most of the sidebar's links are — "Pokemon from pokedex: Kanto"
 * rather than a generic results header. Only once facets combine, or one of
 * them holds several values, does the heading fall back to naming the shape of
 * the thing instead of its contents.
 *
 * @param state - The parsed filter state
 * @returns The heading text
 */
export const getSearchHeading = (state: SearchFilterState): string => {
  if (state.special) return `${SPECIAL_TITLES[state.special]} Pokemon`;
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
