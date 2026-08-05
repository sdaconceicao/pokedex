/**
 * Formats a Pokemon id as a zero-padded Pokédex number, e.g. 4 -> "#004".
 * Ids past three digits are left intact rather than truncated.
 */
export const getDexNumber = (id: string | number): string => `#${String(id).padStart(3, "0")}`;
