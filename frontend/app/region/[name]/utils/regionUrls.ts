/** The region page's URLs. Shared by the list, which writes them, and the
 *  Pokemon slot route, which needs to know the page it was opened from. */

/** The region's own URL. Page 1 is left off so the canonical link stays clean. */
export const buildRegionUrl = (region: string, page: number): string => {
  const path = `/region/${encodeURIComponent(region)}`;
  return page > 1 ? `${path}?page=${page}` : path;
};

/** A Pokemon opened from a region keeps the page it was opened from, so
 *  closing the detail — or landing on the link cold — lands on that page. */
export const buildRegionPokemonUrl = (region: string, id: string, page: number): string => {
  const path = `/region/${encodeURIComponent(region)}/pokemon/${encodeURIComponent(id)}`;
  return page > 1 ? `${path}?page=${page}` : path;
};
