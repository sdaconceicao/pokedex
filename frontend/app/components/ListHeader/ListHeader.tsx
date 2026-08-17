import type { Ref } from "react";
import SortSelect from "@/components/SortSelect";
import type { PokemonSort } from "@/types";
import styles from "./ListHeader.module.css";

interface ListHeaderProps {
  title: string;
  /** h1 on /search, h2 on the region and type pages */
  level?: 1 | 2;
  sort: PokemonSort;
  onSortChange: (sort: PokemonSort) => void;
  ref?: Ref<HTMLHeadingElement>;
}

/** The heading + sort control shared by /search and the region/type list
 *  sections. The ref lands on the heading itself: callers use it both as a
 *  `scrollIntoView` target on page change and as `useScrolledPast`'s
 *  observation target. */
export function ListHeader({ title, level = 2, sort, onSortChange, ref }: ListHeaderProps) {
  const Heading = level === 1 ? "h1" : "h2";

  return (
    <div className={styles.container}>
      <Heading ref={ref} className={styles.heading} data-level={level}>
        {title}
      </Heading>
      <SortSelect value={sort} onChange={onSortChange} />
    </div>
  );
}

export default ListHeader;
