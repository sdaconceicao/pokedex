import { Heading } from "@code-x/lago";
import type { Ability } from "@/types";
import styles from "./PokemonAbility.module.css";

interface PokemonAbilityProps {
  ability: Ability;
  type: string;
}

export const PokemonAbility = ({ ability, type }: PokemonAbilityProps) => {
  return (
    <div key={ability.id} className={styles.abilityCard} data-type={type}>
      <div className={styles.abilityHeader}>
        <Heading level={3} className={styles.abilityName}>
          {ability.name}
        </Heading>
        {/* A static label, not a selectable/removable chip — lago's Tag models
         *  an interactive collection (arrow-key navigable, focusable items),
         *  which doesn't fit a single decorative badge, so this stays plain. */}
        <span className={styles.abilitySlot}>Slot {ability.slot}</span>
      </div>

      <div className={styles.abilityDetails}>
        <p className={styles.abilityDescription}>{ability.description}</p>
        <p className={styles.abilityEffect}>
          <strong>Effect:</strong> {ability.effect}
        </p>
        <p className={styles.abilityGeneration}>
          <strong>Generation:</strong> {ability.generation}
        </p>
      </div>
    </div>
  );
};
