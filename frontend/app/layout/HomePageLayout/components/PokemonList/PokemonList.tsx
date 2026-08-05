"use client";

import { Suspense } from "react";
import PokemonCard, { PokemonCardSkeleton } from "@/components/PokemonCard";
import type { Pokemon } from "@/types";
import styles from "./PokemonList.module.css";

interface PokemonListProps {
  pokemon: Pokemon[];
  error?: string | null;
}

export default function PokemonList({ pokemon, error = null }: PokemonListProps) {
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
