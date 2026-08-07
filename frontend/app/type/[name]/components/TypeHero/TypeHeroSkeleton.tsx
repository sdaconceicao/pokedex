import styles from "./TypeHeroSkeleton.module.css";

const STAT_KEYS = ["pokemon", "moves"];
const ROW_KEYS = ["attacking-1", "attacking-2", "defending-1", "defending-2"];

export default function TypeHeroSkeleton() {
  return (
    <div className={styles.hero}>
      <div className={styles.heroBody}>
        <div className={styles.heroInfo}>
          <div className={styles.eyebrowSkeleton}></div>
          <div className={styles.nameSkeleton}></div>
          <div className={styles.generationSkeleton}></div>
          <div className={styles.stats}>
            {STAT_KEYS.map((key) => (
              <div key={key} className={styles.statSkeleton}></div>
            ))}
          </div>
        </div>
        <div className={styles.spriteSkeleton}></div>
      </div>
      <div className={styles.heroFooter}>
        {ROW_KEYS.map((key) => (
          <div key={key} className={styles.rowSkeleton}></div>
        ))}
      </div>
    </div>
  );
}
