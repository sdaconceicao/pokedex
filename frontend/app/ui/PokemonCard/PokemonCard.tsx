"use client";

import Link from "next/link";
import Image from "next/image";
import { FunctionComponent } from "react";
import { Pokemon } from "@/types/graphql";
import PokemonTypePill from "@/ui/PokemonTypePill";
import {
  formatPokemonName,
  getPokemonTypeClass,
  getPrimaryType,
} from "./PokemonCard.utils";

import css from "./PokemonCard.module.css";

interface PokemonCardProps {
  pokemon: Pokemon;
}

export const PokemonCard: FunctionComponent<PokemonCardProps> = ({
  pokemon,
}) => {
  const primaryType = getPrimaryType(pokemon.type);
  const typeClass = getPokemonTypeClass(primaryType);
  const formattedName = formatPokemonName(pokemon.name);

  return (
    <div
      className={`${css.pokemonCard} ${css[typeClass as keyof typeof css]}`}
      data-testid="pokemon-card"
    >
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
      <h3 className={css.pokemonName}>
        <Link href={`pokemon/${pokemon.id}`}>{formattedName}</Link>
      </h3>
      <div className={css.typeList}>
        {pokemon.type.map((type: string) => (
          <PokemonTypePill key={type} type={type} />
        ))}
      </div>
      <div className={css.stats}>
        <p>HP: {pokemon.stats.hp}</p>
        <p>Attack: {pokemon.stats.attack}</p>
        <p>Defense: {pokemon.stats.defense}</p>
      </div>
    </div>
  );
};

export default PokemonCard;
