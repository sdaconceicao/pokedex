/**
 * Formats Pokemon name with first letter capitalized
 */
export const formatPokemonName = (name: string): string => {
  return name.charAt(0).toUpperCase() + name.slice(1);
};

/**
 * Generates CSS class for Pokemon type styling
 */
export const getPokemonTypeClass = (type: string): string => {
  return `type-${type.toLowerCase()}`;
};

/**
 * Gets the primary type for styling purposes
 */
export const getPrimaryType = (types: string[]): string => {
  if (types.length === 0) return "normal";
  const firstType = types[0];
  return firstType || "normal";
};
