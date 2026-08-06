import styles from "./RegionCount.module.css";

interface RegionCountProps {
  value: number;
  label: string;
}

/** One of the counts the region's condensed toolbar carries, standing in for
 *  the hero's larger stat tiles. */
export default function RegionCount({ value, label }: RegionCountProps) {
  return (
    <span className={styles.count}>
      <strong>{value}</strong>
      {label}
    </span>
  );
}
