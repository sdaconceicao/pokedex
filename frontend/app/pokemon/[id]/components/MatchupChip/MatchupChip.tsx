import { getPokemonTypeIcon } from "@/lib/pokemonTypeIcons";
import { capitalize } from "@/lib/string";
import styles from "./MatchupChip.module.css";

/**
 * Which way a matchup falls, for the global --matchup-* scale. Green where it
 * favours this Pokemon, red where it does not, black where nothing gets through
 * either way. There is no "neutral": the backend drops every 1x before sending,
 * which is why this is a narrower set than the wheel's own Tint — the wheel
 * draws all eighteen types and still needs somewhere to put normal damage.
 *
 * Defined here, with the component that paints it, so the matchup helpers can
 * import it without anything importing back down into them.
 */
export type Tint = "good" | "bad" | "none";

interface MatchupChipProps {
  type: string;
  tint: Tint;
}

/** A type as a chip. The icon is decorative, so the accessible reading of a row
 *  is just the type names. */
export const MatchupChip = ({ type, tint }: MatchupChipProps) => (
  <span className={`${styles.chip} ${styles[tint]}`}>
    <span className={styles.chipIcon} aria-hidden="true">
      {getPokemonTypeIcon(type)}
    </span>
    {capitalize(type)}
  </span>
);
