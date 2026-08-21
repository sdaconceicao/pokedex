"use client";

import { Heading } from "@code-x/lago";
import Image from "next/image";
import Link from "next/link";
import { type FunctionComponent, useState } from "react";
import AddToGroupButton from "@/components/AddToGroupButton";
import PokeballMark from "@/components/PokeballMark";
import PokemonTypePill from "@/components/PokemonTypePill";
import { formatPokemonName } from "@/lib/formNames";
import { buildPokemonPath } from "@/lib/pokemonUrls";
import type { Pokemon } from "@/types/graphql";
import css from "./PokemonCard.module.css";
import { getPokemonTypeClass, getPrimaryType } from "./PokemonCard.utils";

interface PokemonCardProps {
  pokemon: Pokemon;
  /** Where the card links, for lists that scope the detail to their own route
   *  (the region page opens it at /region/[name]/pokemon/[id]) */
  href?: string;
}

export const PokemonCard: FunctionComponent<PokemonCardProps> = ({
  pokemon,
  href,
}) => {
  const primaryType = getPrimaryType(pokemon.type);
  const typeClass = getPokemonTypeClass(primaryType);
  const formattedName = formatPokemonName(pokemon);
  const dexNumber = `#${String(pokemon.speciesId).padStart(3, "0")}`;
  const [imageLoaded, setImageLoaded] = useState(false);

  // Absolute by default: the card also renders from nested routes like
  // /region/kanto, where a relative href would resolve under the current path
  return (
    <div className={css.cardWrapper}>
      <Link href={href ?? buildPokemonPath(pokemon.speciesId, pokemon.id)}>
        <div
          className={`${css.pokemonCard} ${css[typeClass as keyof typeof css]}`}
          data-testid="pokemon-card"
        >
          <PokeballMark className={css.cardWatermark} />
          <div className={css.cardHeader}>
            <Heading level={3} className={css.pokemonName}>
              {formattedName}
            </Heading>
            <span className={css.pokemonId}>{dexNumber}</span>
          </div>
          <div className={css.typeList}>
            {pokemon.type.map((type: string) => (
              <PokemonTypePill
                key={type}
                type={type}
                className={css.cardPill}
              />
            ))}
          </div>
          <div className={css.imageWrap}>
            {!imageLoaded && <PokeballMark className={css.imagePlaceholder} />}
            <Image
              src={pokemon.image}
              alt={pokemon.name}
              width={239}
              height={128}
              className={css.pokemonImage}
              loading="lazy"
              onLoad={() => setImageLoaded(true)}
            />
          </div>
          <div className={css.stats}>
            <p>HP: {pokemon.stats.hp}</p>
            <p>Attack: {pokemon.stats.attack}</p>
            <p>Defense: {pokemon.stats.defense}</p>
          </div>
        </div>
      </Link>
      {/* Outside the link to avoid nested interactive controls */}
      <AddToGroupButton pokemon={pokemon} className={css.addButton} />
    </div>
  );
};

export default PokemonCard;
