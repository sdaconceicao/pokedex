import Image from "next/image";
import { Pokemon, Ability } from "@/types";
import BackButton from "@/ui/BackButton";
import PokemonTypePill from "@/ui/PokemonTypePill";
import PokemonStat from "../PokemonStat";
import PokemonAbility from "../PokemonAbility";

import styles from "./PokemonDetail.module.css";

interface PokemonDetailProps {
  pokemon: Pokemon;
}

export default function PokemonDetail({ pokemon }: PokemonDetailProps) {
  return (
    <div className={styles.container}>
      <div className={styles.backButton}>
        <BackButton>← Back to Pokédex</BackButton>
      </div>

      <div
        className={`${styles.mainSection} ${
          styles[`type-${pokemon.type[0].toLowerCase()}`]
        }`}
      >
        <div className={styles.imageSection}>
          <Image
            src={pokemon.image}
            alt={pokemon.name}
            className={styles.pokemonImage}
            width={182}
            height={182}
          />
          <div className={styles.pokemonNumber}>#{pokemon.id}</div>
        </div>

        <div className={styles.infoSection}>
          <h1 className={styles.pokemonName}>{pokemon.name}</h1>

          <div className={styles.typesContainer}>
            {pokemon.type.map((type: string) => (
              <PokemonTypePill key={type} type={type} />
            ))}
          </div>

          <div className={styles.statsSection}>
            <h2>Base Stats</h2>
            <div className={styles.statsGrid}>
              <PokemonStat name="HP" value={pokemon.stats.hp} />
              <PokemonStat name="Attack" value={pokemon.stats.attack} />
              <PokemonStat name="Defense" value={pokemon.stats.defense} />
              <PokemonStat
                name="SP Attack"
                value={pokemon.stats.specialAttack}
              />
              <PokemonStat
                name="SP Defense"
                value={pokemon.stats.specialDefense}
              />
              <PokemonStat name="Speed" value={pokemon.stats.speed} />
            </div>
          </div>
        </div>
      </div>

      <div className={styles.abilitiesSection}>
        <h2>Abilities</h2>
        <div className={styles.abilitiesGrid}>
          {pokemon.abilities?.map((ability: Ability) => (
            <PokemonAbility
              key={ability.id}
              ability={ability}
              type={pokemon.type[0].toLowerCase()}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
