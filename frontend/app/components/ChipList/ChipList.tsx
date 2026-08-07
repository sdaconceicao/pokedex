import styles from "./ChipList.module.css";

interface ChipListProps {
  /** Shown as given — format them before handing them over */
  items: string[];
  className?: string;
}

/**
 * A wrapping row of small pills, for a set of short labels that belong
 * together. Tints itself against whatever it sits on.
 */
export const ChipList = ({ items, className }: ChipListProps) => (
  <ul className={`${styles.list} ${className || ""}`}>
    {items.map((item) => (
      <li key={item} className={styles.chip}>
        {item}
      </li>
    ))}
  </ul>
);

export default ChipList;
