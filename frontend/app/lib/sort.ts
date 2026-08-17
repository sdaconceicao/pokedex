import type { PokemonSort } from "@/types";

export const DEFAULT_SORT: PokemonSort = "ID_ASC";

/** The sort select's options, in the order they are offered. `id` is the value
 *  the URL carries and the schema's enum spells. */
export const SORT_OPTIONS: readonly { id: PokemonSort; label: string }[] = [
  { id: "ID_ASC", label: "Dex number ↑" },
  { id: "ID_DESC", label: "Dex number ↓" },
  { id: "NAME_ASC", label: "Name A–Z" },
  { id: "NAME_DESC", label: "Name Z–A" },
];

const SORTS = new Set<string>(SORT_OPTIONS.map((option) => option.id));

/**
 * Reads a sort out of a URL query. Mirrors {@link parsePage}: a missing or
 * unrecognised value means the default order rather than an error.
 *
 * @param value - The raw `sort` search param
 * @returns A sort the schema accepts
 */
export const parseSort = (value: string | null | undefined): PokemonSort =>
  SORTS.has(value ?? "") ? (value as PokemonSort) : DEFAULT_SORT;

/** The `sort` param for a URL, or nothing when it is the default — the default
 *  order is the bare URL, the way page 1 is. */
export const encodeSort = (sort: PokemonSort | undefined): string | undefined =>
  sort && sort !== DEFAULT_SORT ? sort : undefined;

/** The two axes a `PokemonSort` composes. SortToggle offers them as
 *  independent choices; these move between that shape and the flat values above. */
export type SortField = "ID" | "NAME";
export type SortDirection = "ASC" | "DESC";

export const sortField = (sort: PokemonSort): SortField => (sort.startsWith("ID") ? "ID" : "NAME");

export const sortDirection = (sort: PokemonSort): SortDirection =>
  sort.endsWith("ASC") ? "ASC" : "DESC";

export const composeSort = (field: SortField, direction: SortDirection): PokemonSort =>
  `${field}_${direction}` as PokemonSort;
