import styles from "./PokemonCard.module.css";

export default function PokemonCardSkeleton() {
  return (
    <div className={styles.card}>
      <div className={`${styles.pokemonImage} ${styles.skeletonImage}`} />
      <div className={`${styles.pokemonName} ${styles.skeletonName}`} />
      <div className={styles.typeList}>
        <div className={`${styles.skeletonType} ${styles.skeletonType1}`} />
        <div className={`${styles.skeletonType} ${styles.skeletonType2}`} />
      </div>
      <div className={styles.stats}>
        <div className={styles.skeletonStat} />
        <div className={styles.skeletonStat} />
        <div className={styles.skeletonStatLast} />
      </div>
    </div>
  );
}
