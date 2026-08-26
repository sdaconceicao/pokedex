"use client";

import { Heading } from "@code-x/lago";
import { useCallback } from "react";
import CountPill from "@/components/CountPill";
import FactRow from "@/components/FactRow";
import HeroToolbar from "@/components/HeroToolbar";
import SortToggle from "@/components/SortToggle";
import StatTile from "@/components/StatTile";
import { useScrolledPast, useSortParam } from "@/hooks";
import { buildBrowseUrl } from "@/lib/browseUrls";
import { formatGeneration } from "@/lib/string";
import type { PokemonSort, RegionDetail } from "@/types";
import styles from "./RegionHero.module.css";

interface RegionHeroProps {
  region: RegionDetail;
}

/** The region profile above the Pokemon list: what the region is called, when
 *  it debuted, and what it holds. Every value comes from the API. */
export const RegionHero = ({ region }: RegionHeroProps) => {
  const generation = formatGeneration(region.generation);
  const { ref, scrolledPast } = useScrolledPast<HTMLElement>();

  const buildSortUrl = useCallback(
    (next: PokemonSort) => buildBrowseUrl("region", region.name, { page: 1, sort: next }),
    [region.name],
  );
  const { sort, setSort } = useSortParam(buildSortUrl);

  return (
    <>
      {/* Ahead of the hero in the flow, so it is already pinned to the top of
          the scroll area when it appears and lands over the hero's last sliver
          instead of stacking under it. The region has no hero actions, so its
          counts take the side opposite the name. */}
      {scrolledPast && (
        <HeroToolbar
          title={region.displayName}
          titleSide="left"
          aside={
            <>
              <CountPill
                value={region.pokemonCount}
                label="Pokemon"
                className={styles.toolbarCount}
              />
              <CountPill
                value={region.locations.length}
                label="Locations"
                className={styles.toolbarCount}
              />
              <SortToggle value={sort} onChange={setSort} />
            </>
          }
        />
      )}

      <section ref={ref} className={styles.hero}>
        <div className={styles.heroBody}>
          <div className={styles.heroInfo}>
            <span className={styles.eyebrow}>Region</span>
            <Heading level={1} className={styles.regionName}>
              {region.displayName}
            </Heading>
            {generation && <span className={styles.generation}>{generation}</span>}
          </div>

          {/* Counts for what the footer doesn't list out: the region's Pokemon,
              and its locations, of which there are far too many to name. */}
          <dl className={styles.stats}>
            <StatTile label="Pokemon" value={region.pokemonCount} />
            <StatTile label="Locations" value={region.locations.length} />
          </dl>
        </div>

        <div className={styles.heroFooter}>
          <FactRow label="Pokedexes" items={region.pokedexes} />
          <FactRow label="Games" items={region.versionGroups} />
        </div>
      </section>
    </>
  );
};
