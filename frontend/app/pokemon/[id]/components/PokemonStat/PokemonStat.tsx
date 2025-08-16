import { useMemo } from "react";
import { getStatPercentage } from "./PokemonStat.util";

import styles from "./PokemonStat.module.css";
interface PokemonStatProps {
  name: string;
  value: number;
}

export const PokemonStat = ({ name, value }: PokemonStatProps) => {
  const statPercentage = useMemo(() => getStatPercentage(value), [value]);
  return (
    <div className={styles.statItem}>
      <span className={styles.statLabel}>{name}</span>
      <div className={styles.statBar}>
        <div
          className={styles.statFill}
          style={{ width: `${statPercentage}%` }}
        ></div>
      </div>
      <span className={styles.statValue}>{value}</span>
    </div>
  );
};
