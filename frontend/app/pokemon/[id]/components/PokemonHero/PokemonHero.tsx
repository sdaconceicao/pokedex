import Image from "next/image";
import BackButton from "@/components/BackButton";
import PokemonTypePill from "@/components/PokemonTypePill";
import type { Pokemon } from "@/types";
import styles from "./PokemonHero.module.css";
import { getDexNumber } from "./PokemonHero.utils";

interface PokemonHeroProps {
  pokemon: Pokemon;
  className?: string;
}

export const PokemonHero = ({ pokemon, className }: PokemonHeroProps) => {
  return (
    <section className={`${styles.hero} ${className || ""}`}>
      <div className={styles.heroToolbar}>
        <BackButton>Back to Results</BackButton>
        <span className={styles.pokemonNumber}>{getDexNumber(pokemon.id)}</span>
      </div>

      <div className={styles.heroBody}>
        <div className={styles.heroInfo}>
          <h1 className={styles.pokemonName}>{pokemon.name}</h1>
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
  );
};
