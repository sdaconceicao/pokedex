import type { Ability, Pokemon } from "@/types";
import PokemonAbility from "../PokemonAbility";
import PokemonEvolution from "../PokemonEvolution";
import { hasEvolutions } from "../PokemonEvolution/PokemonEvolution.utils";
import PokemonHero from "../PokemonHero";
import PokemonMatchups from "../PokemonMatchups";
import PokemonSection from "../PokemonSection";
import PokemonStat from "../PokemonStat";
import styles from "./PokemonDetail.module.css";

interface PokemonDetailProps {
  pokemon: Pokemon;
  flush?: boolean;
}

export default function PokemonDetail({ pokemon, flush }: PokemonDetailProps) {
  const primaryType = pokemon.type[0].toLowerCase();
  const typeClass = `type-${primaryType}`;

  return (
    <div className={styles.container}>
      <PokemonHero pokemon={pokemon} className={typeClass} flush={flush} />
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
      {pokemon.matchups && (
        <PokemonSection title="Type Matchups" className={typeClass}>
          <PokemonMatchups matchups={pokemon.matchups} type={primaryType} />
        </PokemonSection>
      )}
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
            <PokemonEvolution evolution={pokemon.evolution} currentId={String(pokemon.speciesId)} />
          </div>
        </PokemonSection>
      )}
    </div>
  );
}
