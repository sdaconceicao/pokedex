import { useMemo } from "react";
import styles from "./PokemonDetailSkeleton.module.css";

export default function PokemonDetailSkeleton() {
  const statKeys = useMemo(() => Array.from({ length: 6 }, (_, i) => i), []);
  const abilityKeys = useMemo(() => Array.from({ length: 3 }, (_, i) => i), []);

  return (
    <div className={styles.container}>
      <div className={styles.backButton}>
        <div className={styles.backButtonSkeleton}></div>
      </div>

      {/* Hero skeleton */}
      <div className={styles.hero}>
        <div className={styles.heroInfo}>
          <div className={styles.numberSkeleton}></div>
          <div className={styles.nameSkeleton}></div>
          <div className={styles.typesContainer}>
            <div className={styles.typeSkeleton}></div>
            <div className={styles.typeSkeleton}></div>
          </div>
        </div>
        <div className={styles.heroImage}>
          <div className={styles.imageSkeleton}></div>
        </div>
      </div>

      {/* Stats skeleton */}
      <div className={styles.statsSection}>
        <div className={styles.titleSkeleton}></div>
        <div className={styles.statsGrid}>
          {statKeys.map((key) => (
            <div key={key} className={styles.statItem}>
              <div className={styles.statLabelSkeleton}></div>
              <div className={styles.statBarSkeleton}>
                <div className={styles.statFillSkeleton}></div>
              </div>
              <div className={styles.statValueSkeleton}></div>
            </div>
          ))}
        </div>
      </div>

      {/* Abilities skeleton */}
      <div className={styles.abilitiesSection}>
        <div className={styles.titleSkeleton}></div>
        <div className={styles.abilitiesGrid}>
          {abilityKeys.map((key) => (
            <div key={key} className={styles.abilityCard}>
              <div className={styles.abilityHeader}>
                <div className={styles.abilityNameSkeleton}></div>
                <div className={styles.abilitySlotSkeleton}></div>
              </div>
              <div className={styles.abilityDetails}>
                <div className={styles.abilityDescriptionSkeleton}></div>
                <div className={styles.abilityEffectSkeleton}></div>
                <div className={styles.abilityGenerationSkeleton}></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
