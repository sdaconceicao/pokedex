"use client";

import { useQuery } from "@apollo/client/react";
import { useSearchParams } from "next/navigation";
import { useCallback, useRef } from "react";
import Pagination from "@/components/Pagination";
import PokemonList, { PokemonListSkeleton } from "@/components/PokemonList";
import { buildBrowseUrl } from "@/lib/browseUrls";
import { parsePage } from "@/lib/pagination";
import { GET_POKEMON_BY_REGION } from "@/lib/queries";
import type { Pokemon } from "@/types";
import styles from "./RegionPokemon.module.css";

interface RegionPokemonProps {
  /** The region slug from the route — what the API keys off */
  region: string;
}

const ITEMS_PER_PAGE = 20;

/** The paginated Pokemon list below the region profile. The page lives in the
 *  URL, so a page is linkable, survives a reload, and is where Back returns
 *  you to from a Pokemon. */
export default function RegionPokemon({ region }: RegionPokemonProps) {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const searchParams = useSearchParams();
  const page = parsePage(searchParams.get("page"));

  const { loading, data, previousData } = useQuery<{
    pokemonByRegion: { pokemon: Pokemon[]; total: number };
  }>(GET_POKEMON_BY_REGION, {
    variables: {
      region,
      limit: ITEMS_PER_PAGE,
      offset: (page - 1) * ITEMS_PER_PAGE,
    },
  });

  // A page change swaps the variables, which empties `data` until the next
  // page lands. Falling back to the last result keeps the pagination bar in
  // place instead of letting it vanish and reappear on every click.
  const results = data?.pokemonByRegion ?? previousData?.pokemonByRegion;

  // pushState rather than router.push: the page belongs to this list, and a
  // real navigation would re-run the server page and re-fetch the profile
  // above, which never changes between pages.
  const handlePageChange = useCallback(
    (nextPage: number) => {
      headingRef.current?.scrollIntoView({ behavior: "smooth" });
      window.history.pushState(null, "", buildBrowseUrl("region", region, nextPage));
    },
    [region],
  );

  const getPokemonHref = useCallback(
    (pokemon: Pokemon) => buildBrowseUrl("region", region, page, pokemon.id),
    [region, page],
  );

  return (
    <section className={styles.container}>
      <h2 className={styles.heading} ref={headingRef}>
        Pokemon from this region
      </h2>

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
