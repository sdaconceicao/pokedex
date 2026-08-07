import type { NameEntry, Region } from "../datasources/pokemon-api.types.js";
import type { RegionDetail } from "../types.js";

// PokeAPI ships one localized name per language. The region page wants the
// English one, but not every region has every language, so callers pass the
// raw slug as the fallback.
export const getEnglishName = (names: NameEntry[], fallback: string): string =>
  names.find((entry) => entry.language.name === "en")?.name ?? fallback;

// Flattens the region response into the shape the schema exposes: the nested
// NamedAPIResource lists become plain slugs, since the page only shows names.
export const convertRegionToRegionDetail = (
  region: Region,
  pokemonCount: number,
): RegionDetail => ({
  id: region.id.toString(),
  name: region.name,
  displayName: getEnglishName(region.names, region.name),
  generation: region.main_generation?.name ?? null,
  pokemonCount,
  locations: region.locations.map(({ name }) => name),
  pokedexes: region.pokedexes.map(({ name }) => name),
  versionGroups: region.version_groups.map(({ name }) => name),
});
