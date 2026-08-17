import type { PokemonSort } from "@/types";
import { encodeSort } from "./sort";

/** The browse pages that list Pokemon under a slug — and open one over that
 *  list from a nested route. */
export type BrowseSection = "region" | "type" | "forms";

/**
 * Builds any URL in a browse section: the section's own page, or a Pokemon
 * opened from it.
 *
 * Page 1 and the default sort are left off so the canonical link stays clean,
 * and a Pokemon keeps the page and sort it was opened from, so closing its
 * detail — or landing on the link cold — lands back on the same list.
 *
 * @param section - Which browse section the URL belongs to
 * @param slug - The region or type name, as the API spells it
 * @param options - `page` (the 1-based page of the list, default 1), `sort`
 * (the list's order) and `pokemonId` (set to address a Pokemon opened from
 * that list)
 */
export const buildBrowseUrl = (
  section: BrowseSection,
  slug: string,
  options?: { page?: number; sort?: PokemonSort; pokemonId?: string },
): string => {
  const { page = 1, sort, pokemonId } = options ?? {};

  const base = `/${section}/${encodeURIComponent(slug)}`;
  const path = pokemonId ? `${base}/pokemon/${encodeURIComponent(pokemonId)}` : base;

  const params = new URLSearchParams();
  const encodedSort = encodeSort(sort);
  if (encodedSort) params.set("sort", encodedSort);
  if (page > 1) params.set("page", String(page));

  const query = params.toString();

  return query ? `${path}?${query}` : path;
};
