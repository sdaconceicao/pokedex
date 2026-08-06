import type { ReactNode } from "react";
import styles from "./StatTile.module.css";

interface StatTileProps {
  label: string;
  value: ReactNode;
  className?: string;
}

/**
 * A labelled figure — "Pokemon 153" — in a tile that tints itself against
 * whatever it sits on.
 *
 * Renders a `dt`/`dd` pair, so it belongs inside a `dl`; the `dl` owns how the
 * tiles are laid out.
 */
export const StatTile = ({ label, value, className }: StatTileProps) => (
  <div className={`${styles.stat} ${className || ""}`}>
    <dt className={styles.label}>{label}</dt>
    <dd className={styles.value}>{value}</dd>
  </div>
);

export default StatTile;
