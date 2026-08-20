import type { PokemonPokedex } from "@/types";

/**
 * The words PokeAPI puts in front of a dex's name when a place has more than
 * one, oldest revision first — Sinnoh went Original then Extended, Johto
 * Original then Updated, Hoenn Original then New.
 *
 * Order matters: it is what decides which variant a family opens on.
 */
export const VARIANT_MARKERS = ["Original", "Extended", "Updated", "New"] as const;

export type VariantMarker = (typeof VARIANT_MARKERS)[number];

export interface PokedexVariant {
  /** The dex's own slug — what the route and the API key off */
  name: string;
  /** The marker alone, for a switcher that already names the place */
  label: VariantMarker;
  count: number;
}

export interface PokedexFamily {
  /** The place the variants share, e.g. "Johto" */
  place: string;
  /** Oldest revision first */
  variants: PokedexVariant[];
}

/**
 * Splits a dex's display name into the revision it is and the place it covers.
 *
 * @param displayName - The dex's name as the API spells it, e.g. "Updated Johto"
 * @returns The marker and the place, or null when the name carries no marker
 */
export const splitVariant = (
  displayName: string,
): { label: VariantMarker; place: string } | null => {
  const marker = VARIANT_MARKERS.find((candidate) => displayName.startsWith(`${candidate} `));

  return marker ? { label: marker, place: displayName.slice(marker.length + 1) } : null;
};

/** Oldest revision first, by where the marker sits in VARIANT_MARKERS. */
const byAge = (a: PokedexVariant, b: PokedexVariant): number =>
  VARIANT_MARKERS.indexOf(a.label) - VARIANT_MARKERS.indexOf(b.label);

/**
 * Groups the dexes whose names mark them as revisions of one place.
 *
 * A place only counts as a family once two dexes claim it — a lone "Original
 * Something" is just a dex, and collapsing it would hide it behind a switcher
 * with nothing to switch to.
 *
 * @param pokedexes - The dex list, as the API returns it
 * @returns One family per place with two or more revisions, place-name sorted
 */
export const getPokedexFamilies = (pokedexes: PokemonPokedex[]): PokedexFamily[] => {
  const byPlace = new Map<string, PokedexVariant[]>();

  for (const pokedex of pokedexes) {
    const split = splitVariant(pokedex.displayName);
    if (!split) continue;

    const variant = { name: pokedex.name, label: split.label, count: pokedex.count };
    byPlace.set(split.place, [...(byPlace.get(split.place) ?? []), variant]);
  }

  return [...byPlace.entries()]
    .filter(([, variants]) => variants.length > 1)
    .map(([place, variants]) => ({ place, variants: [...variants].sort(byAge) }))
    .sort((a, b) => a.place.localeCompare(b.place));
};

/**
 * The variant a family opens on: its newest revision.
 *
 * @param family - The family to pick from
 * @returns The last variant, which `getPokedexFamilies` ordered newest-last
 */
export const getDefaultVariant = (family: PokedexFamily): PokedexVariant =>
  family.variants[family.variants.length - 1];

/**
 * Finds the family a dex belongs to, for the switcher on its own page.
 *
 * @param pokedexes - The dex list, as the API returns it
 * @param name - The slug of the dex being shown
 * @returns Its family, or null when the dex stands alone
 */
export const findPokedexFamily = (
  pokedexes: PokemonPokedex[],
  name: string,
): PokedexFamily | null =>
  getPokedexFamilies(pokedexes).find((family) =>
    family.variants.some((variant) => variant.name === name),
  ) ?? null;

/**
 * The regions in the order the games introduced them, which is the order players
 * expect to read them in. Anything the API adds later is unknown here and sorts
 * after these, alphabetically, rather than being dropped.
 */
export const REGION_ORDER = [
  "kanto",
  "johto",
  "hoenn",
  "sinnoh",
  "unova",
  "kalos",
  "alola",
  "galar",
  "hisui",
  "paldea",
] as const;

/** The heading for the dexes the API ties to no region at all. */
export const UNGROUPED_TITLE = "Other";

export interface PokedexRegionGroup {
  /** The region slug, or null for the dexes that belong to no region */
  region: string | null;
  /** One entry per dex or family, in the order they should be listed */
  entries: PokedexGroupEntry[];
}

/** A dex that stands alone, or a family shown as its newest revision. */
export type PokedexGroupEntry =
  | { kind: "single"; pokedex: PokemonPokedex }
  | { kind: "family"; family: PokedexFamily; place: string };

/** The name an entry is listed under: a family's place, or the dex's own name. */
export const shownName = (entry: PokedexGroupEntry): string =>
  entry.kind === "family" ? entry.place : entry.pokedex.displayName;

const byShownName = (a: PokedexGroupEntry, b: PokedexGroupEntry): number =>
  shownName(a).localeCompare(shownName(b));

const regionRank = (region: string | null): number => {
  if (region === null) return REGION_ORDER.length + 1;

  const index = REGION_ORDER.indexOf(region as (typeof REGION_ORDER)[number]);

  // Unknown regions sit between the known ones and the ungrouped tail
  return index === -1 ? REGION_ORDER.length : index;
};

/**
 * Groups the dex list by region, collapsing each family to a single entry.
 *
 * Alola alone ships ten dexes — the whole region plus four islands, each in two
 * revisions — so a flat list buries everything else. Grouping by the region the
 * API already reports turns that into one heading with five entries under it.
 *
 * @param pokedexes - The dex list, as the API returns it
 * @returns One group per region in REGION_ORDER, with the regionless dexes last
 */
export const getPokedexRegionGroups = (pokedexes: PokemonPokedex[]): PokedexRegionGroup[] => {
  const families = getPokedexFamilies(pokedexes);
  const familyByName = new Map<string, PokedexFamily>(
    families.flatMap((family) => family.variants.map((variant) => [variant.name, family])),
  );

  const groups = new Map<string | null, PokedexGroupEntry[]>();
  const seenFamilies = new Set<string>();

  for (const pokedex of pokedexes) {
    const family = familyByName.get(pokedex.name);
    const region = pokedex.region ?? null;

    // A family is listed once, where its first variant falls
    if (family) {
      if (seenFamilies.has(family.place)) continue;
      seenFamilies.add(family.place);
    }

    const entry: PokedexGroupEntry = family
      ? { kind: "family", family, place: family.place }
      : { kind: "single", pokedex };

    groups.set(region, [...(groups.get(region) ?? []), entry]);
  }

  return (
    [...groups.entries()]
      // Sorted by the name each entry shows rather than the slug the API sorted
      // by, so a region doesn't read "Hyperspace" before "Central Kalos"
      .map(([region, entries]) => ({ region, entries: [...entries].sort(byShownName) }))
      .sort((a, b) => {
        const rank = regionRank(a.region) - regionRank(b.region);
        return rank === 0 ? (a.region ?? "").localeCompare(b.region ?? "") : rank;
      })
  );
};
