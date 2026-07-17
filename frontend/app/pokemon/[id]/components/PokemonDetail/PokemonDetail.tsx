import Image from "next/image";
import BackButton from "@/components/BackButton";
import PokemonTypePill from "@/components/PokemonTypePill";
import type { Ability, Pokemon } from "@/types";
import PokemonAbility from "../PokemonAbility";
import PokemonStat from "../PokemonStat";

import styles from "./PokemonDetail.module.css";

interface PokemonDetailProps {
  pokemon: Pokemon;
}

export default function PokemonDetail({ pokemon }: PokemonDetailProps) {
  const typeClass = styles[`type-${pokemon.type[0].toLowerCase()}`];
  const dexNumber = `#${String(pokemon.id).padStart(3, "0")}`;

  return (
    <div className={styles.container}>
      <div className={styles.backButton}>
        <BackButton>← Back to Results</BackButton>
      </div>

      {/* ── Hero ─────────────────────────────────── */}
      <section className={`${styles.hero} ${typeClass}`}>
        <div className={styles.heroInfo}>
          <span className={styles.pokemonNumber}>{dexNumber}</span>
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
      </section>

      {/* ── Base stats ───────────────────────────── */}
      <section className={`${styles.statsSection} ${typeClass}`}>
        <h2 className={styles.sectionTitle}>Base Stats</h2>
        <div className={styles.statsGrid}>
          <PokemonStat name="HP" value={pokemon.stats.hp} />
          <PokemonStat name="Attack" value={pokemon.stats.attack} />
          <PokemonStat name="Defense" value={pokemon.stats.defense} />
          <PokemonStat name="SP Attack" value={pokemon.stats.specialAttack} />
          <PokemonStat name="SP Defense" value={pokemon.stats.specialDefense} />
          <PokemonStat name="Speed" value={pokemon.stats.speed} />
        </div>
      </section>

      {/* ── Abilities ────────────────────────────── */}
      <section className={`${styles.abilitiesSection} ${typeClass}`}>
        <h2 className={styles.sectionTitle}>Abilities</h2>
        <div className={styles.abilitiesGrid}>
          {pokemon.abilities?.map((ability: Ability) => (
            <PokemonAbility
              key={ability.id}
              ability={ability}
              type={pokemon.type[0].toLowerCase()}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
