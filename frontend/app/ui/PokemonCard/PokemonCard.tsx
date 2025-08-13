"use client";

import Link from "next/link";
import Image from "next/image";
import { Pokemon } from "@/lib/types";

import styles from "./PokemonCard.module.css";

interface PokemonCardProps {
  pokemon: Pokemon;
}

export default function PokemonCard({ pokemon }: PokemonCardProps) {
  const firstType = pokemon.type[0]?.toLowerCase();

  return (
    <div
      className={`${styles.card} ${
        firstType ? styles[`type-${firstType}` as keyof typeof styles] : ""
      }`}
    >
      <Image
        src={pokemon.image}
        alt={pokemon.name}
        width={239}
        height={128}
        className={styles.pokemonImage}
        loading="lazy"
        placeholder="blur"
        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
      />
      <h3 className={styles.pokemonName}>
        <Link href={`pokemon/${pokemon.id}`}>
          {pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}
        </Link>
      </h3>
      <div className={styles.typeList}>
        {pokemon.type.map((type: string) => (
          <span
            key={type}
            className={`${styles.type} ${
              styles[type.toLowerCase() as keyof typeof styles]
            }`}
          >
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
  );
}
