"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Pagination from "@/components/Pagination";
import HomeScreen from "@/layout/HomePageLayout/components/HomeScreen";
import PokemonList, { PokemonListSkeleton } from "@/layout/HomePageLayout/components/PokemonList";
import type { PokemonType } from "@/types";
import styles from "./AppLayout.module.css";
import { usePokemonUnifiedQuery } from "./usePokemonUnifiedQuery";

interface AppLayoutProps {
  searchQuery?: string;
  selectedType?: string;
  selectedPokedex?: string;
  selectedSpecial?: string;
  selectedRegion?: string;
  types: PokemonType[];
}

export default function AppLayout({
  searchQuery,
  selectedType,
  selectedPokedex,
  selectedSpecial,
  selectedRegion,
  types,
}: AppLayoutProps) {
  const headerRef = useRef<HTMLHeadingElement>(null);
  const { loading, data, title, page, setPage, itemsPerPage, shouldShowHomeScreen } =
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

  if (shouldShowHomeScreen) {
    return <HomeScreen types={types} />;
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
