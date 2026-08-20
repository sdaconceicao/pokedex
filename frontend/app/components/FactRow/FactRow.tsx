import ChipList from "@/components/ChipList";
import { titleCase } from "@/lib/string";
import styles from "./FactRow.module.css";

interface FactRowProps {
  label: string;
  /** API slugs — humanized here, so hand them over as the API spells them */
  items: string[];
}

/**
 * A labelled row of chips along the bottom of a hero — its games, its
 * pokedexes, its region.
 *
 * Renders nothing when the API returned no entries, so a subject that has none
 * of a given fact shows no bare label rather than an empty row.
 */
export const FactRow = ({ label, items }: FactRowProps) => {
  if (items.length === 0) return null;

  return (
    <div className={styles.factRow}>
      <span className={styles.factLabel}>{label}</span>
      <ChipList items={items.map(titleCase)} />
    </div>
  );
};

export default FactRow;
