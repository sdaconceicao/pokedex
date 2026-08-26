import type { PokemonSort } from "@/types";

export const DEFAULT_SORT: PokemonSort = "ID_ASC";

export const SORT_OPTIONS: readonly { id: PokemonSort; label: string }[] = [
  { id: "ID_ASC", label: "Dex number ↑" },
  { id: "ID_DESC", label: "Dex number ↓" },
  { id: "NAME_ASC", label: "Name A–Z" },
  { id: "NAME_DESC", label: "Name Z–A" },
];

const SORTS = new Set<string>(SORT_OPTIONS.map((option) => option.id));

export const parseSort = (value: string | null | undefined): PokemonSort =>
  SORTS.has(value ?? "") ? (value as PokemonSort) : DEFAULT_SORT;

export const encodeSort = (sort: PokemonSort | undefined): string | undefined =>
  sort && sort !== DEFAULT_SORT ? sort : undefined;

export type SortField = "ID" | "NAME";
export type SortDirection = "ASC" | "DESC";

export const sortField = (sort: PokemonSort): SortField => (sort.startsWith("ID") ? "ID" : "NAME");

export const sortDirection = (sort: PokemonSort): SortDirection =>
  sort.endsWith("ASC") ? "ASC" : "DESC";

export const composeSort = (field: SortField, direction: SortDirection): PokemonSort =>
  `${field}_${direction}` as PokemonSort;
