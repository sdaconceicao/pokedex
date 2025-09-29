"use client";

import React, { useCallback, useMemo, useRef } from "react";

import PokemonList from "@/components/PokemonList";
import PokemonInstructions from "@/components/PokemonInstructions";
import Pagination from "@/ui/Pagination";
import { usePokemonUnifiedQuery } from "./usePokemonUnifiedQuery";

import styles from "./HomePageLayout.module.css";

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
  const {
    loading,
    data,
    title,
    currentQueryContext,
    page,
    setPage,
    itemsPerPage,
    shouldShowInstructions,
  } = usePokemonUnifiedQuery({
    searchQuery,
    selectedType,
    selectedPokedex,
    selectedSpecial,
    selectedRegion,
  });

  const { pokemon, total } = data;
  // Only show pagination when we have a query context and data has loaded
  const shouldShowPagination = useMemo(
    () => !!currentQueryContext && total > 0,
    [currentQueryContext, total]
  );

  const handlePageChange = useCallback(
    (page: number) => {
      headerRef.current?.scrollIntoView({ behavior: "smooth" });
      setPage(page);
    },
    [setPage]
  );

  if (shouldShowInstructions) {
    return <PokemonInstructions />;
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.heading} ref={headerRef}>
        {title}
      </h2>
      <PokemonList
        pokemon={pokemon}
        loading={loading}
        itemsPerPage={itemsPerPage}
      />
      {shouldShowPagination && (
        <Pagination
          currentPage={page}
          onPageChange={handlePageChange}
          totalItems={total || 0}
          itemsPerPage={itemsPerPage}
        />
      )}
    </div>
  );
}
