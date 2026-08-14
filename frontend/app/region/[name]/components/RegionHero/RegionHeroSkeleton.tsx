import { Skeleton } from "@code-x/lago";
import styles from "./RegionHeroSkeleton.module.css";

const STAT_KEYS = ["pokemon", "locations"];
const CHIP_ROW_KEYS = ["pokedexes", "games"];

export default function RegionHeroSkeleton() {
  return (
    <div className={styles.hero}>
      <div className={styles.heroBody}>
        <div className={styles.heroInfo}>
          <Skeleton variant="line" width={72} height={14} />
          {/* The one labelled shape — lago's convention for a region built
              from several — so the hero announces a single loading status. */}
          <Skeleton
            variant="box"
            width={240}
            height={52}
            className={styles.nameSkeleton}
            label="Loading region"
          />
          <Skeleton variant="line" width={132} height={30} />
        </div>
        <div className={styles.stats}>
          {STAT_KEYS.map((key) => (
            <Skeleton key={key} variant="box" height={74} className={styles.statSkeleton} />
          ))}
        </div>
      </div>
      <div className={styles.heroFooter}>
        {CHIP_ROW_KEYS.map((key) => (
          <Skeleton
            key={key}
            variant="line"
            width="60%"
            height={24}
            className={styles.rowSkeleton}
          />
        ))}
      </div>
    </div>
  );
}
