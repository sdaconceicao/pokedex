"use client";

import Image from "next/image";
import Link from "next/link";
import type { FunctionComponent } from "react";
import PokeballMark from "@/components/PokeballMark";
import PokemonTypePill from "@/components/PokemonTypePill";
import type { Pokemon } from "@/types/graphql";
import css from "./PokemonCard.module.css";
import { formatPokemonName, getPokemonTypeClass, getPrimaryType } from "./PokemonCard.utils";

interface PokemonCardProps {
  pokemon: Pokemon;
}

export const PokemonCard: FunctionComponent<PokemonCardProps> = ({ pokemon }) => {
  const primaryType = getPrimaryType(pokemon.type);
  const typeClass = getPokemonTypeClass(primaryType);
  const formattedName = formatPokemonName(pokemon.name);
  const dexNumber = `#${String(pokemon.id).padStart(3, "0")}`;

  return (
    <Link href={`pokemon/${pokemon.id}`}>
      <div
        className={`${css.pokemonCard} ${css[typeClass as keyof typeof css]}`}
        data-testid="pokemon-card"
      >
        <PokeballMark className={css.cardWatermark} />
        <div className={css.cardHeader}>
          <h3 className={css.pokemonName}>{formattedName}</h3>
          <span className={css.pokemonId}>{dexNumber}</span>
        </div>
        <div className={css.typeList}>
          {pokemon.type.map((type: string) => (
            <PokemonTypePill key={type} type={type} className={css.cardPill} />
          ))}
        </div>
        <Image
          src={pokemon.image}
          alt={pokemon.name}
          width={239}
          height={128}
          className={css.pokemonImage}
          loading="lazy"
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaHfbcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
        />
        <div className={css.stats}>
          <p>HP: {pokemon.stats.hp}</p>
          <p>Attack: {pokemon.stats.attack}</p>
          <p>Defense: {pokemon.stats.defense}</p>
        </div>
      </div>
    </Link>
  );
};

export default PokemonCard;
