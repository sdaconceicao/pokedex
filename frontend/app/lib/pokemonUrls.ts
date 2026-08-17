export const buildPokemonPath = (speciesId: string, pokemonId: string): string => {
  const base = `/pokemon/${encodeURIComponent(speciesId)}`;

  return pokemonId === speciesId ? base : `${base}/forms/${encodeURIComponent(pokemonId)}`;
};
