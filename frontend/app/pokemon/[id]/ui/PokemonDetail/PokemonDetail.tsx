import Image from "next/image";
import { Ability } from "@/lib/types";
import BackButton from "@/ui/BackButton";
import styles from "./PokemonDetail.module.css";

import { Pokemon } from "@/lib/types";

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
              <span
                key={type}
                className={`${styles.typeBadge} ${styles[type.toLowerCase()]}`}
              >
                {type}
              </span>
            ))}
          </div>

          <div className={styles.statsSection}>
            <h2>Base Stats</h2>
            <div className={styles.statsGrid}>
              <div className={styles.statItem}>
                <span className={styles.statLabel}>HP</span>
                <div className={styles.statBar}>
                  <div
                    className={styles.statFill}
                    style={{ width: `${(pokemon.stats.hp / 255) * 100}%` }}
                  ></div>
                </div>
                <span className={styles.statValue}>{pokemon.stats.hp}</span>
              </div>

              <div className={styles.statItem}>
                <span className={styles.statLabel}>Attack</span>
                <div className={styles.statBar}>
                  <div
                    className={styles.statFill}
                    style={{
                      width: `${(pokemon.stats.attack / 255) * 100}%`,
                    }}
                  ></div>
                </div>
                <span className={styles.statValue}>{pokemon.stats.attack}</span>
              </div>

              <div className={styles.statItem}>
                <span className={styles.statLabel}>Defense</span>
                <div className={styles.statBar}>
                  <div
                    className={styles.statFill}
                    style={{
                      width: `${(pokemon.stats.defense / 255) * 100}%`,
                    }}
                  ></div>
                </div>
                <span className={styles.statValue}>
                  {pokemon.stats.defense}
                </span>
              </div>

              <div className={styles.statItem}>
                <span className={styles.statLabel}>Sp. Atk</span>
                <div className={styles.statBar}>
                  <div
                    className={styles.statFill}
                    style={{
                      width: `${(pokemon.stats.specialAttack / 255) * 100}%`,
                    }}
                  ></div>
                </div>
                <span className={styles.statValue}>
                  {pokemon.stats.specialAttack}
                </span>
              </div>

              <div className={styles.statItem}>
                <span className={styles.statLabel}>Sp. Def</span>
                <div className={styles.statBar}>
                  <div
                    className={styles.statFill}
                    style={{
                      width: `${(pokemon.stats.specialDefense / 255) * 100}%`,
                    }}
                  ></div>
                </div>
                <span className={styles.statValue}>
                  {pokemon.stats.specialDefense}
                </span>
              </div>

              <div className={styles.statItem}>
                <span className={styles.statLabel}>Speed</span>
                <div className={styles.statBar}>
                  <div
                    className={styles.statFill}
                    style={{ width: `${(pokemon.stats.speed / 255) * 100}%` }}
                  ></div>
                </div>
                <span className={styles.statValue}>{pokemon.stats.speed}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.abilitiesSection}>
        <h2>Abilities</h2>
        <div className={styles.abilitiesGrid}>
          {pokemon.abilities &&
            pokemon.abilities.map((ability: Ability) => (
              <div
                key={ability.id}
                className={`${styles.abilityCard} ${
                  styles[`type-${pokemon.type[0].toLowerCase()}`]
                }`}
              >
                <div className={styles.abilityHeader}>
                  <h3 className={styles.abilityName}>{ability.name}</h3>
                  <span className={styles.abilitySlot}>
                    Slot {ability.slot}
                  </span>
                </div>

                <div className={styles.abilityDetails}>
                  <p className={styles.abilityDescription}>
                    {ability.description}
                  </p>
                  <p className={styles.abilityEffect}>
                    <strong>Effect:</strong> {ability.effect}
                  </p>
                  <p className={styles.abilityGeneration}>
                    <strong>Generation:</strong> {ability.generation}
                  </p>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
