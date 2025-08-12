"use client";

import React from "react";
import { Pokemon } from "../lib/types";
import styles from "./PokemonList.module.css";
import Image from "next/image";
import Pagination from "./Pagination";

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
    return (
      <div className={styles.centerText}>
        <p>Loading Pokemon...</p>
      </div>
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

  const totalPages = Math.ceil(total / itemsPerPage);

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>{title}</h2>
      <div className={styles.grid}>
        {pokemon.map((pokemon: Pokemon) => (
          <div key={pokemon.id} className={styles.card}>
            <Image
              src={pokemon.image}
              alt={pokemon.name}
              width={239}
              height={128}
              className={styles.pokemonImage}
            />
            <h3 className={styles.pokemonName}>
              {pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}
            </h3>
            <div className={styles.typeList}>
              {pokemon.type.map((type: string) => (
                <span key={type} className={styles.type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </span>
              ))}
            </div>
            <div className={styles.stats}>
              <p>HP: {pokemon.stats.hp}</p>
              <p>Attack: {pokemon.stats.attack}</p>
              <p>Defense: {pokemon.stats.defense}</p>
            </div>
          </div>
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
