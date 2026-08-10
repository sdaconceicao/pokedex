import { Skeleton } from "@/lib/lago";
import styles from "./TypeHeroSkeleton.module.css";

const STAT_KEYS = ["pokemon", "moves"];
const ROW_KEYS = ["attacking-1", "attacking-2", "defending-1", "defending-2"];

export default function TypeHeroSkeleton() {
  return (
    <div className={styles.hero}>
      <div className={styles.heroBody}>
        <div className={styles.heroInfo}>
          <Skeleton variant="line" width={56} height={14} />
          {/* The one labelled shape — lago's convention for a hero built from
              several — so the whole thing announces a single loading status. */}
          <Skeleton
            variant="box"
            width={200}
            height={52}
            className={styles.nameSkeleton}
            label="Loading type"
          />
          <Skeleton variant="line" width={132} height={30} />
          <div className={styles.stats}>
            {STAT_KEYS.map((key) => (
              <Skeleton key={key} variant="box" height={74} className={styles.statSkeleton} />
            ))}
          </div>
        </div>
        <Skeleton variant="circle" className={styles.spriteSkeleton} />
      </div>
      <div className={styles.heroFooter}>
        {ROW_KEYS.map((key) => (
          <Skeleton
            key={key}
            variant="line"
            width="70%"
            height={24}
            className={styles.rowSkeleton}
          />
        ))}
      </div>
    </div>
  );
}
