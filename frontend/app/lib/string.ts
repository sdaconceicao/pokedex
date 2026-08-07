/**
 * Capitalizes the first character of a string
 * @param str - The string to capitalize
 * @returns The string with the first character capitalized
 */
export const capitalize = (str: string): string => {
  if (!str || str.length === 0) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
};

/**
 * Turns an API slug into a display label: "letsgo-kanto" -> "Letsgo Kanto"
 * @param str - The hyphenated slug to humanize
 * @returns The slug with hyphens as spaces and every word capitalized
 */
export const titleCase = (str: string): string => {
  if (!str || str.length === 0) return str;
  return str.split("-").map(capitalize).join(" ");
};
