"use client";

import { SegmentedControl, SegmentedControlItem } from "@code-x/lago";
import { useRouter } from "next/navigation";
import type { Key } from "react-aria-components";
import { buildBrowseUrl } from "@/lib/browseUrls";
import type { PokedexVariant } from "@/lib/pokedexFamilies";
import type { PokemonSort } from "@/types";
import styles from "./VariantSwitch.module.css";

interface VariantSwitchProps {
  /** The family's revisions, oldest first */
  variants: PokedexVariant[];
  /** The slug of the dex on screen */
  current: string;
  /** Carried across the switch, since it is a preference rather than a place */
  sort: PokemonSort;
}

/**
 * Picks which revision of a dex to show — Johto's Original against its Updated.
 *
 * A real navigation rather than the `pushState` the sort and page use: a
 * different revision is a different dex, so both the profile above and the list
 * below have to be refetched.
 */
export const VariantSwitch = ({ variants, current, sort }: VariantSwitchProps) => {
  const router = useRouter();

  const handleChange = (keys: Set<Key>) => {
    const next = [...keys][0];
    if (next == null || next === current) return;

    // Page 1: the revisions hold different Pokemon, so the old page number
    // means nothing in the one being opened.
    router.push(buildBrowseUrl("pokedex", String(next), { page: 1, sort }));
  };

  return (
    <SegmentedControl
      size="sm"
      aria-label="Dex revision"
      disallowEmptySelection
      selectedKeys={[current]}
      onSelectionChange={handleChange}
      className={styles.group}
    >
      {variants.map((variant) => (
        <SegmentedControlItem key={variant.name} id={variant.name}>
          {variant.label}
        </SegmentedControlItem>
      ))}
    </SegmentedControl>
  );
};

export default VariantSwitch;
