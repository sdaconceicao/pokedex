"use client";

import { Select, SelectItem } from "@code-x/lago";
import type { Key } from "react-aria-components";
import { SORT_OPTIONS } from "@/lib/sort";
import type { PokemonSort } from "@/types";
import styles from "./SortSelect.module.css";

interface SortSelectProps {
  value: PokemonSort;
  onChange: (sort: PokemonSort) => void;
  className?: string;
}

/** The four-option sort dropdown shared by /search and the region/type list
 *  headings. */
export function SortSelect({ value, onChange, className }: SortSelectProps) {
  const handleChange = (key: Key | null) => {
    if (key != null) onChange(key as PokemonSort);
  };

  return (
    <Select
      size="sm"
      value={value}
      onChange={handleChange}
      label="Sort by"
      className={[styles.select, className].filter(Boolean).join(" ")}
    >
      {SORT_OPTIONS.map(({ id, label }) => (
        <SelectItem key={id} id={id} textValue={label}>
          {label}
        </SelectItem>
      ))}
    </Select>
  );
}

export default SortSelect;
