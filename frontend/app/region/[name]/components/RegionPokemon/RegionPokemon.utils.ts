/** Page 1 is the bare URL, so a missing, malformed or out-of-range `page`
 *  param all mean the first page rather than an error. */
export const parsePage = (value: string | null): number => {
  const page = Number(value);
  return Number.isInteger(page) && page > 0 ? page : 1;
};

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
