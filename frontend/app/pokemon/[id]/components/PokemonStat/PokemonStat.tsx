import { useMemo } from "react";
import styles from "./PokemonStat.module.css";
import { getStatPercentage } from "./PokemonStat.util";

interface PokemonStatProps {
  name: string;
  value: number;
}

/**
 * Deliberately not lago's `Meter`: its fill colour is hardcoded by percentage
 * (green under 70%, red at 90%+) via an inline `--fill-color`, which is the
 * opposite of what a stat bar needs — a high stat is good, not alarming — and
 * inline styles can't be overridden from CSS. Its root also drops any
 * `className` passed to it (the hardcoded one is applied after the prop
 * spread) and hardcodes `width: 250px`, so there's no way to scope an
 * override to a single instance or make it responsive. Hand-rolling stays
 * the honest choice here; only the palette below is retokened onto lago.
 */
export const PokemonStat = ({ name, value }: PokemonStatProps) => {
  const statPercentage = useMemo(() => getStatPercentage(value), [value]);
  return (
    <div className={styles.statItem}>
      <span className={styles.statLabel}>{name}</span>
      <div className={styles.statBar}>
        <div className={styles.statFill} style={{ width: `${statPercentage}%` }}></div>
      </div>
      <span className={styles.statValue}>{value}</span>
    </div>
  );
};
