"use client";

import React, { Suspense } from "react";
import { Pokemon } from "../../lib/types";
import styles from "./PokemonList.module.css";
import PokemonCard from "../PokemonCard/PokemonCard";
import PokemonCardSkeleton from "../PokemonCard/PokemonCardSkeleton";
import PokemonListSkeleton from "./PokemonListSkeleton";
import Pagination from "../Pagination";

interface PokemonListProps {
  pokemon: Pokemon[];
  total: number;
  title: string;
  loading?: boolean;
  error?: string | null;
  currentPage: number;
  onPageChange: (page: number) => void;
  itemsPerPage: number;
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
}: PokemonListProps) {
  if (loading) {
    return <PokemonListSkeleton count={itemsPerPage} />;
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

  const totalPages = Math.ceil(total / itemsPerPage);

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>{title}</h2>
      <div className={styles.grid}>
        {pokemon.map((pokemon: Pokemon) => (
          <Suspense key={pokemon.id} fallback={<PokemonCardSkeleton />}>
            <PokemonCard pokemon={pokemon} />
          </Suspense>
        ))}
      </div>

      {total > itemsPerPage && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
          totalItems={total}
          itemsPerPage={itemsPerPage}
        />
      )}
    </div>
  );
}
