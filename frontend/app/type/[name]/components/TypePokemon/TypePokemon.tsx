"use client";

import { useQuery } from "@apollo/client/react";
import { useSearchParams } from "next/navigation";
import { useCallback, useRef } from "react";
import ListHeader from "@/components/ListHeader";
import Pagination from "@/components/Pagination";
import PokemonList, { PokemonListSkeleton } from "@/components/PokemonList";
import { useSortParam } from "@/hooks";
import { buildBrowseUrl } from "@/lib/browseUrls";
import { parsePage } from "@/lib/pagination";
import { GET_POKEMON_BY_TYPE } from "@/lib/queries";
import type { Pokemon, PokemonSort } from "@/types";
import styles from "./TypePokemon.module.css";

interface TypePokemonProps {
  /** The type slug from the route — what the API keys off */
  type: string;
}

const ITEMS_PER_PAGE = 20;

/** The paginated Pokemon list below the type profile. The page lives in the
 *  URL, so a page is linkable, survives a reload, and is where Back returns
 *  you to from a Pokemon. */
export default function TypePokemon({ type }: TypePokemonProps) {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const searchParams = useSearchParams();
  const page = parsePage(searchParams.get("page"));

  const buildSortUrl = useCallback(
    (next: PokemonSort) => buildBrowseUrl("type", type, { page: 1, sort: next }),
    [type],
  );
  const { sort, setSort } = useSortParam(buildSortUrl);

  const { loading, data, previousData } = useQuery<{
    pokemonByType: { pokemon: Pokemon[]; total: number };
  }>(GET_POKEMON_BY_TYPE, {
    variables: {
      type,
      limit: ITEMS_PER_PAGE,
      offset: (page - 1) * ITEMS_PER_PAGE,
      sort,
    },
  });

  // A page change swaps the variables, which empties `data` until the next
  // page lands. Falling back to the last result keeps the pagination bar in
  // place instead of letting it vanish and reappear on every click.
  const results = data?.pokemonByType ?? previousData?.pokemonByType;

  // pushState rather than router.push: the page belongs to this list, and a
  // real navigation would re-run the server page and re-fetch the profile
  // above, which never changes between pages.
  const handlePageChange = useCallback(
    (nextPage: number) => {
      headingRef.current?.scrollIntoView({ behavior: "smooth" });
      window.history.pushState(null, "", buildBrowseUrl("type", type, { page: nextPage, sort }));
    },
    [type, sort],
  );

  const getPokemonHref = useCallback(
    (pokemon: Pokemon) => buildBrowseUrl("type", type, { page, sort, pokemonId: pokemon.id }),
    [type, page, sort],
  );

  return (
    <section className={styles.container}>
      <ListHeader
        title="Pokemon of this type"
        sort={sort}
        onSortChange={setSort}
        ref={headingRef}
      />

      {loading ? (
        <PokemonListSkeleton count={ITEMS_PER_PAGE} />
      ) : (
        <PokemonList pokemon={results?.pokemon ?? []} getHref={getPokemonHref} />
      )}

      <Pagination
        currentPage={page}
        onPageChange={handlePageChange}
        totalItems={results?.total ?? 0}
        itemsPerPage={ITEMS_PER_PAGE}
      />
    </section>
  );
}
