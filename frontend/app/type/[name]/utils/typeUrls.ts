/** The type page's URLs. Shared by the list, which writes them, and the
 *  Pokemon slot route, which needs to know the page it was opened from. */

/** The type's own URL. Page 1 is left off so the canonical link stays clean. */
export const buildTypeUrl = (type: string, page: number): string => {
  const path = `/type/${encodeURIComponent(type)}`;
  return page > 1 ? `${path}?page=${page}` : path;
};

/** A Pokemon opened from a type keeps the page it was opened from, so closing
 *  the detail — or landing on the link cold — lands on that page. */
export const buildTypePokemonUrl = (type: string, id: string, page: number): string => {
  const path = `/type/${encodeURIComponent(type)}/pokemon/${encodeURIComponent(id)}`;
  return page > 1 ? `${path}?page=${page}` : path;
};
