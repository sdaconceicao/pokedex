import styles from "./CountPill.module.css";

interface CountPillProps {
  value: number;
  label: string;
  className?: string;
}

/** A figure and what it counts, tight enough for a condensed toolbar. Tints
 *  itself against whatever it sits on, as StatTile does. */
export const CountPill = ({ value, label, className }: CountPillProps) => (
  <span className={`${styles.count} ${className || ""}`}>
    <strong>{value}</strong>
    {label}
  </span>
);

export default CountPill;
