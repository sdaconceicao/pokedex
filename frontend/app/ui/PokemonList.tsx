"use client";

import { useQuery } from "@apollo/client";
import { GET_POKEMON_BY_TYPE } from "../lib/queries";
import { Pokemon, PokemonByTypeData } from "../lib/types";
import styles from "./PokemonList.module.css";
import Image from "next/image";

interface PokemonListProps {
  selectedType?: string;
}

export default function PokemonList({ selectedType }: PokemonListProps) {
  const { loading, error, data } = useQuery<PokemonByTypeData>(
    GET_POKEMON_BY_TYPE,
    {
      variables: { type: selectedType, limit: 20 },
      skip: !selectedType,
    }
  );

  if (!selectedType) {
    return (
      <div className={styles.centerText}>
        <p>Select a Pokemon type from the sidebar to view Pokemon</p>
      </div>
    );
  }

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
        <p>Error loading Pokemon: {error.message}</p>
      </div>
    );
  }

  const pokemon = data?.pokemonByType || [];

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>
        Pokemon of type:{" "}
        {selectedType.charAt(0).toUpperCase() + selectedType.slice(1)}
      </h2>
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
      {pokemon.length === 0 && (
        <div className={styles.centerText}>
          <p>No Pokemon found for this type</p>
        </div>
      )}
    </div>
  );
}
