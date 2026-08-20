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
import { GET_POKEMON_BY_POKEDEX } from "@/lib/queries";
import type { Pokemon, PokemonSort } from "@/types";
import styles from "./PokedexPokemon.module.css";

interface PokedexPokemonProps {
  /** The pokedex slug from the route — what the API keys off */
  pokedex: string;
}

const ITEMS_PER_PAGE = 20;

/** The paginated Pokemon list below the pokedex profile. The page lives in the
 *  URL, so a page is linkable, survives a reload, and is where Back returns
 *  you to from a Pokemon. */
export default function PokedexPokemon({ pokedex }: PokedexPokemonProps) {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const searchParams = useSearchParams();
  const page = parsePage(searchParams.get("page"));

  const buildSortUrl = useCallback(
    (next: PokemonSort) => buildBrowseUrl("pokedex", pokedex, { page: 1, sort: next }),
    [pokedex],
  );
  const { sort, setSort } = useSortParam(buildSortUrl);

  const { loading, data, previousData } = useQuery<{
    pokemonByPokedex: { pokemon: Pokemon[]; total: number };
  }>(GET_POKEMON_BY_POKEDEX, {
    variables: {
      pokedex,
      limit: ITEMS_PER_PAGE,
      offset: (page - 1) * ITEMS_PER_PAGE,
      sort,
    },
  });

  // A page change swaps the variables, which empties `data` until the next
  // page lands. Falling back to the last result keeps the pagination bar in
  // place instead of letting it vanish and reappear on every click.
  const results = data?.pokemonByPokedex ?? previousData?.pokemonByPokedex;

  // pushState rather than router.push: the page belongs to this list, and a
  // real navigation would re-run the server page and re-fetch the profile
  // above, which never changes between pages.
  const handlePageChange = useCallback(
    (nextPage: number) => {
      headingRef.current?.scrollIntoView({ behavior: "smooth" });
      window.history.pushState(
        null,
        "",
        buildBrowseUrl("pokedex", pokedex, { page: nextPage, sort }),
      );
    },
    [pokedex, sort],
  );

  const getPokemonHref = useCallback(
    (pokemon: Pokemon) => buildBrowseUrl("pokedex", pokedex, { page, sort, pokemonId: pokemon.id }),
    [pokedex, page, sort],
  );

  return (
    <section className={styles.container}>
      <ListHeader
        title="Pokemon in this pokedex"
        sort={sort}
        onSortChange={setSort}
        ref={headingRef}
      />

      {/* Keeping the previous grid up while the next one lands also keeps the scroll position */}
      {loading && !results ? (
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
