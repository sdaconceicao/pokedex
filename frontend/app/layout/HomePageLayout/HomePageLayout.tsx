"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Pagination from "@/components/Pagination";
import PokemonInstructions from "@/layout/HomePageLayout/components/PokemonInstructions";
import PokemonList, { PokemonListSkeleton } from "@/layout/HomePageLayout/components/PokemonList";
import styles from "./HomePageLayout.module.css";
import { usePokemonUnifiedQuery } from "./usePokemonUnifiedQuery";

interface HomePageProps {
  searchQuery?: string;
  selectedType?: string;
  selectedPokedex?: string;
  selectedSpecial?: string;
  selectedRegion?: string;
}

export default function HomePage({
  searchQuery,
  selectedType,
  selectedPokedex,
  selectedSpecial,
  selectedRegion,
}: HomePageProps) {
  const headerRef = useRef<HTMLHeadingElement>(null);
  const { loading, data, title, page, setPage, itemsPerPage, shouldShowInstructions } =
    usePokemonUnifiedQuery({
      searchQuery,
      selectedType,
      selectedPokedex,
      selectedSpecial,
      selectedRegion,
    });
  const [pokemon, setPokemon] = useState(data?.pokemon || []);
  const [total, setTotal] = useState(data?.total || 0);

  useEffect(() => {
    if (data) {
      setPokemon(data.pokemon);
      setTotal(data.total);
    }
  }, [data]);

  const handlePageChange = useCallback(
    (page: number) => {
      headerRef.current?.scrollIntoView({ behavior: "smooth" });
      setPage(page);
    },
    [setPage],
  );

  if (shouldShowInstructions) {
    return <PokemonInstructions />;
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.heading} ref={headerRef}>
        {title}
      </h2>
      {loading ? (
        <PokemonListSkeleton count={itemsPerPage} />
      ) : (
        <PokemonList pokemon={pokemon} loading={loading} itemsPerPage={itemsPerPage} />
      )}

      <Pagination
        currentPage={page}
        onPageChange={handlePageChange}
        totalItems={total || 0}
        itemsPerPage={itemsPerPage}
      />
    </div>
  );
}
