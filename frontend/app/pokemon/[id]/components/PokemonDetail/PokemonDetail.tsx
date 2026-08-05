import type { Ability, Pokemon } from "@/types";
import PokemonHero from "../PokemonHero";
import PokemonSection from "../PokemonSection";
import PokemonStat from "../PokemonStat";
import PokemonAbility from "../PokemonAbility";
import styles from "./PokemonDetail.module.css";
import PokemonEvolution from "../PokemonEvolution";
import { hasEvolutions } from "../PokemonEvolution/PokemonEvolution.utils";

interface PokemonDetailProps {
  pokemon: Pokemon;
}

export default function PokemonDetail({ pokemon }: PokemonDetailProps) {
  const primaryType = pokemon.type[0].toLowerCase();
  // Sets the --type-* palette every section reads from
  const typeClass = styles[`type-${primaryType}`];

  return (
    <div className={styles.container}>
      <PokemonHero pokemon={pokemon} className={typeClass} />
      <PokemonSection title="Base Stats" className={typeClass}>
        <div className={styles.statsGrid}>
          <PokemonStat name="HP" value={pokemon.stats.hp} />
          <PokemonStat name="Attack" value={pokemon.stats.attack} />
          <PokemonStat name="Defense" value={pokemon.stats.defense} />
          <PokemonStat name="SP Attack" value={pokemon.stats.specialAttack} />
          <PokemonStat name="SP Defense" value={pokemon.stats.specialDefense} />
          <PokemonStat name="Speed" value={pokemon.stats.speed} />
        </div>
      </PokemonSection>
      <PokemonSection title="Abilities" className={typeClass}>
        <div className={styles.abilitiesGrid}>
          {pokemon.abilities?.map((ability: Ability) => (
            <PokemonAbility key={ability.id} ability={ability} type={primaryType} />
          ))}
        </div>
      </PokemonSection>
      {pokemon.evolution && hasEvolutions(pokemon.evolution) && (
        <PokemonSection title="Evolution" className={typeClass}>
          <div className={styles.evolutionGrid}>
            <PokemonEvolution evolution={pokemon.evolution} currentId={String(pokemon.id)} />
          </div>
        </PokemonSection>
      )}
    </div>
  );
}
