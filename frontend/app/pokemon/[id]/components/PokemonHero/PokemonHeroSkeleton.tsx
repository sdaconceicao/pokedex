import styles from "./PokemonHeroSkeleton.module.css";

export default function PokemonHeroSkeleton() {
  return (
    <div className={styles.hero}>
      <div className={styles.heroToolbar}>
        <div className={styles.backButtonSkeleton}></div>
        <div className={styles.numberSkeleton}></div>
      </div>
      <div className={styles.heroBody}>
        <div className={styles.heroInfo}>
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
    </div>
  );
}
