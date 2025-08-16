import { Ability } from "@/lib/types";
import styles from "./PokemonAbility.module.css";

interface PokemonAbilityProps {
  ability: Ability;
  type: string;
}

export const PokemonAbility = ({ ability, type }: PokemonAbilityProps) => {
  return (
    <div
      key={ability.id}
      className={`${styles.abilityCard} ${styles[`type-${type}`]}`}
    >
      <div className={styles.abilityHeader}>
        <h3 className={styles.abilityName}>{ability.name}</h3>
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
