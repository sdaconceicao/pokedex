"use client";

import React, { Suspense } from "react";
import { Pokemon } from "@/types";
import PokemonCard, { PokemonCardSkeleton } from "@/ui/PokemonCard";
import PokemonListSkeleton from "./PokemonListSkeleton";

import styles from "./PokemonList.module.css";

interface PokemonListProps {
  pokemon: Pokemon[];
  loading?: boolean;
  error?: string | null;
  itemsPerPage: number;
}

export default function PokemonList({
  pokemon,
  loading = false,
  error = null,
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

  return (
    <div className={styles.grid}>
      {pokemon.map((pokemon: Pokemon) => (
        <Suspense key={pokemon.id} fallback={<PokemonCardSkeleton />}>
          <PokemonCard pokemon={pokemon} />
        </Suspense>
      ))}
    </div>
  );
}
