"use client";

import { Heading } from "@code-x/lago";
import clsx from "clsx";
import Image from "next/image";
import BackButton from "@/components/BackButton";
import HeroToolbar from "@/components/HeroToolbar";
import PokemonTypePill from "@/components/PokemonTypePill";
import { useScrolledPast } from "@/hooks";
import type { Pokemon } from "@/types";
import styles from "./PokemonHero.module.css";
import { getDexNumber } from "./PokemonHero.utils";

interface PokemonHeroProps {
  pokemon: Pokemon;
  className?: string;
  /** Run the hero out to its container's edges and square off its bottom so it
   *  reads as that container's header rather than a card sitting inside it.
   *  The container has to publish --panel-inset and --panel-radius for this to
   *  have anything to measure against — see Modal's body. */
  flush?: boolean;
}

export const PokemonHero = ({ pokemon, className, flush }: PokemonHeroProps) => {
  const { ref, scrolledPast } = useScrolledPast<HTMLElement>();

  return (
    <>
      {scrolledPast && (
        <HeroToolbar
          className={className}
          flush={flush}
          title={pokemon.name}
          aside={<BackButton size="sm">Back</BackButton>}
          icon={
            <Image
              src={pokemon.image}
              alt=""
              className={styles.toolbarSprite}
              width={32}
              height={32}
            />
          }
        />
      )}

      <section ref={ref} className={clsx(styles.hero, flush && styles.flush, className)}>
        <div className={styles.heroToolbar}>
          <BackButton>Back</BackButton>
          <span className={styles.pokemonNumber}>{getDexNumber(pokemon.id)}</span>
        </div>

        <div className={styles.heroBody}>
          <div className={styles.heroInfo}>
            <Heading level={1} className={styles.pokemonName}>
              {pokemon.name}
            </Heading>
            <div className={styles.typesContainer}>
              {pokemon.type.map((type: string) => (
                <PokemonTypePill key={type} type={type} className={styles.heroPill} />
              ))}
            </div>
          </div>

          <div className={styles.heroImage}>
            <Image
              src={pokemon.image}
              alt={pokemon.name}
              className={styles.pokemonImage}
              width={360}
              height={360}
              priority
            />
          </div>
        </div>
      </section>
    </>
  );
};
