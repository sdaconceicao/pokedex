"use client";

import { useQuery } from "@apollo/client/react";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect } from "react";
import HeroToolbar from "@/components/HeroToolbar";
import ListHeader from "@/components/ListHeader";
import Pagination from "@/components/Pagination";
import { getTotalPages } from "@/components/Pagination/Pagination.util";
import PokemonList, { PokemonListSkeleton } from "@/components/PokemonList";
import SortToggle from "@/components/SortToggle";
import { useScrolledPast, useSortParam } from "@/hooks";
import { buildBrowseUrl } from "@/lib/browseUrls";
import { parsePage } from "@/lib/pagination";
import { GET_POKEMON_FORMS } from "@/lib/queries";
import { SPECIAL_TITLES, type Special } from "@/lib/specials";
import type { Pokemon, PokemonSort } from "@/types";
import styles from "./FormsResults.module.css";

interface FormsResultsProps {
  special: Special;
}

const ITEMS_PER_PAGE = 20;

export default function FormsResults({ special }: FormsResultsProps) {
  const { ref: headingRef, scrolledPast } = useScrolledPast<HTMLHeadingElement>();
  const searchParams = useSearchParams();
  const page = parsePage(searchParams.get("page"));

  const buildSortUrl = useCallback(
    (next: PokemonSort) => buildBrowseUrl("forms", special, { page: 1, sort: next }),
    [special],
  );
  const { sort, setSort } = useSortParam(buildSortUrl);

  const { loading, data, previousData } = useQuery<{
    pokemonForms: { pokemon: Pokemon[]; total: number };
  }>(GET_POKEMON_FORMS, {
    variables: {
      query: special,
      limit: ITEMS_PER_PAGE,
      offset: (page - 1) * ITEMS_PER_PAGE,
      sort,
    },
  });

  const results = data?.pokemonForms ?? previousData?.pokemonForms;
  const total = results?.total ?? 0;
  const title = `${SPECIAL_TITLES[special]} Pokemon`;

  useEffect(() => {
    const totalPages = getTotalPages(total, ITEMS_PER_PAGE);
    if (total > 0 && page > totalPages) {
      window.history.replaceState(
        null,
        "",
        buildBrowseUrl("forms", special, { page: totalPages, sort }),
      );
    }
  }, [total, page, special, sort]);

  const handlePageChange = useCallback(
    (nextPage: number) => {
      headingRef.current?.scrollIntoView({ behavior: "smooth" });
      window.history.pushState(
        null,
        "",
        buildBrowseUrl("forms", special, { page: nextPage, sort }),
      );
    },
    [special, sort, headingRef],
  );

  return (
    <section className={styles.container}>
      {scrolledPast && (
        <HeroToolbar
          title={title}
          titleSide="left"
          aside={<SortToggle value={sort} onChange={setSort} />}
        />
      )}

      <ListHeader title={title} level={1} sort={sort} onSortChange={setSort} ref={headingRef} />

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
