"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import PokemonList, { usePokemonUnifiedQuery } from "@/ui/PokemonList";
import Pagination from "@/ui/Pagination";

import styles from "./HomePage.module.css";

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
  const [currentPage, setCurrentPage] = useState(1);
  const {
    loading,
    error,
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
      setCurrentPage(page);
    },
    [setCurrentPage]
  );

  if (shouldShowInstructions) {
    return (
      <div style={{ textAlign: "center", padding: "2rem" }}>
        <p>
          Select a Pokemon type, pokedex, or region from the sidebar or search
          for Pokemon to get started
        </p>
        <p style={{ fontSize: "0.9rem", color: "#666", marginTop: "0.5rem" }}>
          Note: Search, type selection, pokedex selection, and region selection
          are separate - use one at a time
        </p>
      </div>
    );
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
          currentPage={currentPage}
          onPageChange={handlePageChange}
          totalItems={total || 0}
          itemsPerPage={itemsPerPage}
        />
      )}
    </div>
  );
}
