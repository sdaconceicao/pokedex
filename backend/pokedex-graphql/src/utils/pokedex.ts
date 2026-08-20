import type { NameEntry, Pokedex } from "../datasources/pokemon-api.types.js";
import type { PokedexDetail } from "../types.js";

// The description list is shaped like `names` but keys off `description`, so it
// needs its own pick. Plenty of dexes ship none at all, hence null rather than a
// slug fallback — there is nothing sensible to stand in for a blurb.
export const getEnglishDescription = (descriptions: Pokedex["descriptions"]): string | null =>
  descriptions.find((entry) => entry.language.name === "en")?.description ?? null;

/** Compares names by their words alone, so "Ula’ula" and "ulaula" line up. */
const words = (value: string): Set<string> =>
  new Set(
    value
      .toLowerCase()
      .split(/[^a-z0-9]+/i)
      .filter(Boolean),
  );

const isSubset = (inner: Set<string>, outer: Set<string>): boolean =>
  inner.size < outer.size && [...inner].every((word) => outer.has(word));

const titleCase = (slug: string): string =>
  slug
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

/**
 * The name to show for a dex.
 *
 * PokeAPI's English name is usually the better of the two — it spells
 * "Let’s Go Kanto" and calls the bare `hoenn` dex "Original Hoenn". But a few
 * are named only for their part of the slug: `conquest-gallery` is "Gallery"
 * and `lumiose-city` is "Lumiose". When the API's name is made up entirely of
 * words the slug already has, and fewer of them, it has dropped context the
 * slug still carries, so the slug wins.
 *
 * @param names - The dex's localized names, as PokeAPI returns them
 * @param slug - The dex's own name, used both as the fallback and as the test
 * @returns The name to display
 */
export const getDisplayName = (names: NameEntry[], slug: string): string => {
  const english = names.find((entry) => entry.language.name === "en")?.name;

  // No English name, or one built only from words the slug already has and
  // fewer of them: the slug is the fuller of the two, so humanize that.
  if (!english || isSubset(words(english), words(slug))) {
    return titleCase(slug);
  }

  return english;
};

// Flattens the pokedex response into the shape the schema exposes: the nested
// NamedAPIResource lists become plain slugs, and the entry list becomes its
// length, since the page counts the entries rather than listing them here.
export const convertPokedexToPokedexDetail = (pokedex: Pokedex): PokedexDetail => ({
  id: pokedex.id.toString(),
  name: pokedex.name,
  displayName: getDisplayName(pokedex.names, pokedex.name),
  description: getEnglishDescription(pokedex.descriptions),
  region: pokedex.region?.name ?? null,
  pokemonCount: pokedex.pokemon_entries.length,
  versionGroups: pokedex.version_groups.map(({ name }) => name),
  isMainSeries: pokedex.is_main_series,
});
