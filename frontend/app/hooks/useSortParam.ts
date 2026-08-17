"use client";

import { useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";
import { parseSort } from "@/lib/sort";
import type { PokemonSort } from "@/types";

/** Reads and writes the `sort` URL param for a Pokemon list. */
export function useSortParam(buildUrl: (sort: PokemonSort) => string): {
  sort: PokemonSort;
  setSort: (next: PokemonSort) => void;
} {
  const searchParams = useSearchParams();
  const sort = useMemo(() => parseSort(searchParams.get("sort")), [searchParams]);

  // pushState rather than router.push, matching the existing page-change
  // handlers: a real navigation would re-run the server page and re-fetch the
  // hero above the list, which a sort change never touches.
  const setSort = useCallback(
    (next: PokemonSort) => {
      window.history.pushState(null, "", buildUrl(next));
    },
    [buildUrl],
  );

  return { sort, setSort };
}
