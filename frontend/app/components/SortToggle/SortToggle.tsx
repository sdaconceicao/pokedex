"use client";

import { SegmentedControl, SegmentedControlItem } from "@code-x/lago";
import type { Key } from "react-aria-components";
import {
  composeSort,
  type SortDirection,
  type SortField,
  sortDirection,
  sortField,
} from "@/lib/sort";
import type { PokemonSort } from "@/types";
import styles from "./SortToggle.module.css";

interface SortToggleProps {
  value: PokemonSort;
  onChange: (sort: PokemonSort) => void;
  className?: string;
}

/**
 * The toolbar-only sort control: the same four `PokemonSort` values as two
 * inline SegmentedControls (field, direction) rather than SortSelect's
 * dropdown. HeroToolbar's slot is a zero-height sticky rail, and opening a
 * popover-based field there makes the browser snap the scroller back to the
 * rail's static position mid-interaction, unmounting the toolbar and the open
 * dropdown with it — a SegmentedControl is a plain ToggleButtonGroup with no
 * overlay, so it doesn't trigger that. Don't swap this back for a Select.
 */
export function SortToggle({ value, onChange, className }: SortToggleProps) {
  const field = sortField(value);
  const direction = sortDirection(value);

  const handleFieldChange = (keys: Set<Key>) => {
    const next = [...keys][0] as SortField | undefined;
    if (next) onChange(composeSort(next, direction));
  };

  const handleDirectionChange = (keys: Set<Key>) => {
    const next = [...keys][0] as SortDirection | undefined;
    if (next) onChange(composeSort(field, next));
  };

  return (
    <div className={`${styles.toggle} ${className || ""}`}>
      <SegmentedControl
        size="sm"
        aria-label="Sort field"
        disallowEmptySelection
        selectedKeys={[field]}
        onSelectionChange={handleFieldChange}
        className={styles.group}
      >
        <SegmentedControlItem id="ID" aria-label="Dex number">
          #
        </SegmentedControlItem>
        <SegmentedControlItem id="NAME" aria-label="Name">
          A
        </SegmentedControlItem>
      </SegmentedControl>
      <SegmentedControl
        size="sm"
        aria-label="Sort direction"
        disallowEmptySelection
        selectedKeys={[direction]}
        onSelectionChange={handleDirectionChange}
        className={styles.group}
      >
        <SegmentedControlItem id="ASC" aria-label="Ascending">
          ↑
        </SegmentedControlItem>
        <SegmentedControlItem id="DESC" aria-label="Descending">
          ↓
        </SegmentedControlItem>
      </SegmentedControl>
    </div>
  );
}

export default SortToggle;
