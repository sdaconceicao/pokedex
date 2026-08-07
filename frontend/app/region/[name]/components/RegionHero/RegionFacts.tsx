import ChipList from "@/components/ChipList";
import { titleCase } from "@/lib/string";
import styles from "./RegionFacts.module.css";

interface RegionFactsProps {
  label: string;
  /** API slugs — pokedex or version group names */
  items: string[];
}

/** One of the chip rows along the bottom of the region hero. Renders nothing
 *  when the API returned no entries, so an empty region shows no bare label. */
export default function RegionFacts({ label, items }: RegionFactsProps) {
  if (items.length === 0) return null;

  return (
    <div className={styles.factRow}>
      <span className={styles.factLabel}>{label}</span>
      <ChipList items={items.map(titleCase)} />
    </div>
  );
}
