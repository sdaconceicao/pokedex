"use client";

import { useQuery } from "@apollo/client/react";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo } from "react";
import HeroToolbar from "@/components/HeroToolbar";
import ListHeader from "@/components/ListHeader";
import Pagination from "@/components/Pagination";
import { getTotalPages } from "@/components/Pagination/Pagination.util";
import PokemonList, { PokemonListSkeleton } from "@/components/PokemonList";
import SortToggle from "@/components/SortToggle";
import { useScrolledPast, useSortParam } from "@/hooks";
import { parsePage } from "@/lib/pagination";
import { FILTER_POKEMON } from "@/lib/queries";
import {
  buildSearchUrl,
  getSearchHeading,
  type SearchFilterState,
  toPokemonFilter,
} from "@/lib/searchFilters";
import type { Pokemon, PokemonSort } from "@/types";
import styles from "./SearchResults.module.css";

interface SearchResultsProps {
  /** The filter parsed from the URL by the server page. */
  filters: SearchFilterState;
}

const ITEMS_PER_PAGE = 20;

/**
 * The results for one filter. Every facet the sidebar offers resolves to a
 * single `pokemonFilter` call, so combining them costs one request rather than
 * one per facet.
 */
export default function SearchResults({ filters }: SearchResultsProps) {
  const { ref: headingRef, scrolledPast } = useScrolledPast<HTMLHeadingElement>();
  const searchParams = useSearchParams();

  // The page lives in the URL rather than in state, so it survives a reload and
  // is where Back returns you to. The rest of the filter arrives from the
  // server, already parsed.
  const page = parsePage(searchParams.get("page"));

  // Sort changes go through pushState (see useSortParam), which never re-runs
  // this component's server parent — so `filters.sort` would freeze at
  // whatever it was on first load. Read it from the URL here instead, and use
  // this value everywhere below, never `filters.sort`.
  const buildSortUrl = useCallback(
    (next: PokemonSort) => buildSearchUrl({ ...filters, page: 1, sort: next }),
    [filters],
  );
  const { sort, setSort } = useSortParam(buildSortUrl);

  const filter = useMemo(() => toPokemonFilter(filters), [filters]);

  const { loading, data, previousData } = useQuery<{
    pokemonFilter: { pokemon: Pokemon[]; total: number };
  }>(FILTER_POKEMON, {
    variables: {
      filter,
      limit: ITEMS_PER_PAGE,
      offset: (page - 1) * ITEMS_PER_PAGE,
      sort,
    },
  });

  // A page change swaps the variables, which empties `data` until the next page
  // lands. Falling back to the last result keeps the pagination bar in place
  // instead of letting it vanish and reappear on every click.
  const results = data?.pokemonFilter ?? previousData?.pokemonFilter;
  const total = results?.total ?? 0;

  // Narrowing a filter can leave the URL pointing past the end of the new,
  // shorter result set — an empty grid under a bar offering pages that no
  // longer exist. Replace rather than push, so Back doesn't land here again.
  useEffect(() => {
    const totalPages = getTotalPages(total, ITEMS_PER_PAGE);
    if (total > 0 && page > totalPages) {
      window.history.replaceState(null, "", buildSearchUrl({ ...filters, page: totalPages, sort }));
    }
  }, [total, page, filters, sort]);

  // pushState rather than router.push: the page belongs to this list, and a
  // real navigation would re-run the server page for a filter that hasn't
  // changed.
  const handlePageChange = useCallback(
    (nextPage: number) => {
      headingRef.current?.scrollIntoView({ behavior: "smooth" });
      window.history.pushState(null, "", buildSearchUrl({ ...filters, page: nextPage, sort }));
    },
    [filters, sort, headingRef],
  );

  return (
    <section className={styles.container}>
      {/* Ahead of ListHeader in the flow, so it is already pinned to the top of
          the scroll area when it appears and lands over the heading instead of
          stacking under it. */}
      {scrolledPast && (
        <HeroToolbar
          title={getSearchHeading(filters)}
          titleSide="left"
          aside={<SortToggle value={sort} onChange={setSort} />}
        />
      )}

      <ListHeader
        title={getSearchHeading(filters)}
        level={1}
        sort={sort}
        onSortChange={setSort}
        ref={headingRef}
      />

      {/* Keeping the previous grid up while the next one lands also keeps the scroll position */}
      {loading && !results ? (
        <PokemonListSkeleton count={ITEMS_PER_PAGE} />
      ) : (
        <PokemonList pokemon={results?.pokemon ?? []} />
      )}

      <Pagination
        currentPage={page}
        onPageChange={handlePageChange}
        totalItems={total}
        itemsPerPage={ITEMS_PER_PAGE}
      />
    </section>
  );
}
