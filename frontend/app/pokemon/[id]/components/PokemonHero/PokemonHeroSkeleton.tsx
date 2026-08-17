import { Skeleton } from "@code-x/lago";
import clsx from "clsx";
import styles from "./PokemonHeroSkeleton.module.css";

interface PokemonHeroSkeletonProps {
  /** Matches the real hero's flush variant, so the placeholder occupies the
   *  same band and the modal doesn't jump when the data lands. */
  flush?: boolean;
}

export default function PokemonHeroSkeleton({ flush }: PokemonHeroSkeletonProps) {
  return (
    <div className={clsx(styles.hero, flush && styles.flush)}>
      <div className={styles.heroToolbar}>
        <Skeleton variant="box" width={175} height={38} className={styles.onGradient} />
        <Skeleton variant="line" width={64} height={30} className={styles.onGradient} />
      </div>
      <div className={styles.heroBody}>
        <div className={styles.heroInfo}>
          {/* The one labeled skeleton for this region — the rest stay
           *  decorative so a screen reader announces the loading state once,
           *  not once per placeholder shape. */}
          <Skeleton
            variant="box"
            width={240}
            height={52}
            label="Loading Pokémon"
            className={styles.onGradient}
          />
          <div className={styles.typesContainer}>
            <Skeleton variant="line" width={80} height={30} className={styles.onGradient} />
            <Skeleton variant="line" width={80} height={30} className={styles.onGradient} />
          </div>
        </div>
        <div className={styles.heroImage}>
          {/* No explicit height: `aspect-ratio: 1` from the circle variant
           *  keeps it round as `width` scales down on narrow viewports,
           *  standing in for the breakpoint the real artwork resizes at. */}
          <Skeleton variant="circle" width="min(340px, 64vw)" className={styles.onGradient} />
        </div>
      </div>
    </div>
  );
}
