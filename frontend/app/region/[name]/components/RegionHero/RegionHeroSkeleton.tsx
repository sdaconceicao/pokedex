import styles from "./RegionHeroSkeleton.module.css";

const STAT_KEYS = ["pokemon", "locations"];
const CHIP_ROW_KEYS = ["pokedexes", "games"];

export default function RegionHeroSkeleton() {
  return (
    <div className={styles.hero}>
      <div className={styles.heroBody}>
        <div className={styles.heroInfo}>
          <div className={styles.eyebrowSkeleton}></div>
          <div className={styles.nameSkeleton}></div>
          <div className={styles.generationSkeleton}></div>
        </div>
        <div className={styles.stats}>
          {STAT_KEYS.map((key) => (
            <div key={key} className={styles.statSkeleton}></div>
          ))}
        </div>
      </div>
      <div className={styles.heroFooter}>
        {CHIP_ROW_KEYS.map((key) => (
          <div key={key} className={styles.factRowSkeleton}></div>
        ))}
      </div>
    </div>
  );
}
