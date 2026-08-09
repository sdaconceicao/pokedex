/**
 * Reads a page number out of a URL query. Page 1 is the bare URL, so a missing,
 * malformed or out-of-range `page` param all mean the first page rather than an
 * error.
 * @param value - The raw `page` search param
 * @returns A 1-based page number
 */
export const parsePage = (value: string | null | undefined): number => {
  const page = Number(value);
  return Number.isInteger(page) && page > 0 ? page : 1;
};
