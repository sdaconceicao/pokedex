import styles from "./PokemonDetailSkeleton.module.css";

export default function PokemonDetailSkeleton() {
  return (
    <div className={styles.container}>
      <div className={styles.backButton}>
        <div className={styles.backButtonSkeleton}></div>
      </div>

      <div className={styles.mainSection}>
        <div className={styles.imageSection}>
          <div className={styles.imageSkeleton}></div>
          <div className={styles.numberSkeleton}></div>
        </div>

        <div className={styles.infoSection}>
          <div className={styles.nameSkeleton}></div>

          <div className={styles.typesContainer}>
            <div className={styles.typeSkeleton}></div>
            <div className={styles.typeSkeleton}></div>
          </div>

          <div className={styles.statsSection}>
            <div className={styles.statsTitleSkeleton}></div>
            <div className={styles.statsGrid}>
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className={styles.statItem}>
                  <div className={styles.statLabelSkeleton}></div>
                  <div className={styles.statBarSkeleton}>
                    <div className={styles.statFillSkeleton}></div>
                  </div>
                  <div className={styles.statValueSkeleton}></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Abilities section skeleton */}
      <div className={styles.abilitiesSection}>
        <div className={styles.abilitiesTitleSkeleton}></div>
        <div className={styles.abilitiesGrid}>
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className={styles.abilityCard}>
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
