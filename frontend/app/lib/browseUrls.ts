/** The browse pages that list Pokemon under a slug — and open one over that
 *  list from a nested route. Both are laid out identically. */
export type BrowseSection = "region" | "type";

/**
 * Builds any URL in a browse section: the section's own page, or a Pokemon
 * opened from it.
 *
 * Page 1 is left off so the canonical link stays clean, and a Pokemon keeps the
 * page it was opened from, so closing its detail — or landing on the link cold
 * — lands on that page.
 *
 * @param section - Which browse section the URL belongs to
 * @param slug - The region or type name, as the API spells it
 * @param page - The 1-based page of the list
 * @param pokemonId - Set to address a Pokemon opened from that list
 */
export const buildBrowseUrl = (
  section: BrowseSection,
  slug: string,
  page: number,
  pokemonId?: string,
): string => {
  const base = `/${section}/${encodeURIComponent(slug)}`;
  const path = pokemonId ? `${base}/pokemon/${encodeURIComponent(pokemonId)}` : base;

  return page > 1 ? `${path}?page=${page}` : path;
};
