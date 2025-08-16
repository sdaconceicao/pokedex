import styles from "./PokemonStat.module.css";

interface PokemonStatProps {
  name: string;
  value: number;
}

export const PokemonStat = ({ name, value }: PokemonStatProps) => {
  return (
    <div className={styles.statItem}>
      <span className={styles.statLabel}>{name}</span>
      <div className={styles.statBar}>
        <div
          className={styles.statFill}
          style={{ width: `${(value / 255) * 100}%` }}
        ></div>
      </div>
      <span className={styles.statValue}>{value}</span>
    </div>
  );
};
