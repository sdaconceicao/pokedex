import { MatchupChip, type Tint } from "../MatchupChip/MatchupChip";
import styles from "./MatchupRow.module.css";

interface MatchupRowProps {
  /** The multiplier, as the games write it — "4×", "½×". Blank for a group that
   *  has nothing in it, where the word None carries the row on its own. */
  label: string;
  tint: Tint;
  types: string[];
}

/** A multiplier and the types under it, or the word None when there are none.
 *  Kept rather than dropped so both columns hold their shape between Pokemon. */
export const MatchupRow = ({ label, tint, types }: MatchupRowProps) => (
  <div className={styles.row}>
    <span className={styles.rowLabel}>{label}</span>
    {types.length ? (
      <span className={styles.chips}>
        {types.map((type) => (
          <MatchupChip key={type} type={type} tint={tint} />
        ))}
      </span>
    ) : (
      <span className={styles.empty}>None</span>
    )}
  </div>
);
