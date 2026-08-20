import { Skeleton } from "@code-x/lago";
import styles from "./PokedexHeroSkeleton.module.css";

const CHIP_ROW_KEYS = ["region", "games"];

export default function PokedexHeroSkeleton() {
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
            label="Loading pokedex"
          />
          <Skeleton variant="line" width={112} height={30} />
          <Skeleton variant="line" width={280} height={16} />
        </div>
        <div className={styles.stats}>
          <Skeleton variant="box" height={74} className={styles.statSkeleton} />
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
