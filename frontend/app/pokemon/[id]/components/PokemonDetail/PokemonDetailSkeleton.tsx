import { Skeleton, SkeletonParagraph } from "@code-x/lago";
import { useMemo } from "react";
import PokemonHeroSkeleton from "../PokemonHero/PokemonHeroSkeleton";
import styles from "./PokemonDetailSkeleton.module.css";

interface PokemonDetailSkeletonProps {
  /** Passed through to the hero placeholder so the loading state matches the
   *  flush detail it stands in for. */
  flush?: boolean;
}

export default function PokemonDetailSkeleton({ flush }: PokemonDetailSkeletonProps) {
  const statKeys = useMemo(() => Array.from({ length: 6 }, (_, i) => i), []);
  const abilityKeys = useMemo(() => Array.from({ length: 3 }, (_, i) => i), []);
  // Three headings a side: the columns are uneven in reality, so an even
  // pair of stacks is the honest placeholder rather than a guess at shape.
  const matchupKeys = useMemo(() => Array.from({ length: 3 }, (_, i) => i), []);

  return (
    <div className={styles.container}>
      {/* PokemonHeroSkeleton carries the one labeled placeholder for the whole
       *  page; every skeleton below stays decorative so a screen reader
       *  announces the loading state once, not once per shape. */}
      <PokemonHeroSkeleton flush={flush} />

      {/* Stats skeleton */}
      <div className={styles.statsSection}>
        <Skeleton variant="line" width={130} height={24} className={styles.titleSkeleton} />
        <div className={styles.statsGrid}>
          {statKeys.map((key) => (
            <div key={key} className={styles.statItem}>
              <Skeleton variant="line" width={70} height={14} />
              <Skeleton variant="line" height={8} />
              <Skeleton
                variant="line"
                width={30}
                height={16}
                className={styles.statValueSkeleton}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Type matchups skeleton */}
      <div className={styles.matchupsSection}>
        <Skeleton variant="line" width={160} height={24} className={styles.titleSkeleton} />
        <div className={styles.matchupsGrid}>
          {["attacking", "defending"].map((side) => (
            <div key={side} className={styles.matchupsColumn}>
              {matchupKeys.map((key) => (
                <div key={key}>
                  <Skeleton variant="line" width={90} height={14} />
                  <Skeleton variant="line" height={28} />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Abilities skeleton */}
      <div className={styles.abilitiesSection}>
        <Skeleton variant="line" width={130} height={24} className={styles.titleSkeleton} />
        <div className={styles.abilitiesGrid}>
          {abilityKeys.map((key) => (
            <div key={key} className={styles.abilityCard}>
              <div className={styles.abilityHeader}>
                <Skeleton variant="line" width={120} height={22} />
                <Skeleton variant="line" width={64} height={22} />
              </div>
              <div className={styles.abilityDetails}>
                <SkeletonParagraph lines={3} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
