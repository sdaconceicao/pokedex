"use client";

import React, { Suspense, useCallback, useMemo, useRef } from "react";
import { Pokemon } from "@/lib/types";
import PokemonCard, { PokemonCardSkeleton } from "@/ui/PokemonCard";
import Pagination from "@/ui/Pagination";
import PokemonListSkeleton from "./PokemonListSkeleton";

import styles from "./PokemonList.module.css";

interface PokemonListProps {
  pokemon: Pokemon[];
  total: number;
  title: string;
  loading?: boolean;
  error?: string | null;
  currentPage: number;
  onPageChange: (page: number) => void;
  itemsPerPage: number;
  hasQueryContext?: boolean; // New prop to determine if we should show pagination
}

export default function PokemonList({
  pokemon,
  total,
  title,
  loading = false,
  error = null,
  currentPage,
  onPageChange,
  itemsPerPage,
  hasQueryContext = false,
}: PokemonListProps) {
  const headerRef = useRef<HTMLHeadingElement>(null);
  const shouldShowPagination = useMemo(
    () => hasQueryContext && total > itemsPerPage,
    [hasQueryContext, total, itemsPerPage]
  );

  const handlePageChange = useCallback(
    (page: number) => {
      headerRef.current?.scrollIntoView({ behavior: "smooth" });

      onPageChange(page);
    },
    [onPageChange]
  );

  if (loading) {
    return (
      <>
        <PokemonListSkeleton count={itemsPerPage} />
        {shouldShowPagination && (
          <Pagination
            currentPage={currentPage}
            onPageChange={onPageChange}
            totalItems={total}
            itemsPerPage={itemsPerPage}
          />
        )}
      </>
    );
  }

  if (error) {
    return (
      <div className={styles.error}>
        <p>Error loading Pokemon: {error}</p>
      </div>
    );
  }

  if (pokemon.length === 0) {
    return (
      <div className={styles.centerText}>
        <p>No Pokemon found</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.heading} ref={headerRef}>
        {title}
      </h2>
      <div className={styles.grid}>
        {pokemon.map((pokemon: Pokemon) => (
          <Suspense key={pokemon.id} fallback={<PokemonCardSkeleton />}>
            <PokemonCard pokemon={pokemon} />
          </Suspense>
        ))}
      </div>
      {shouldShowPagination && (
        <Pagination
          currentPage={currentPage}
          onPageChange={handlePageChange}
          totalItems={total}
          itemsPerPage={itemsPerPage}
        />
      )}
    </div>
  );
}
