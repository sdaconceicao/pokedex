"use client";

import CountPill from "@/components/CountPill";
import HeroToolbar from "@/components/HeroToolbar";
import StatTile from "@/components/StatTile";
import { useScrolledPast } from "@/hooks";
import { formatGeneration } from "@/lib/string";
import type { RegionDetail } from "@/types";
import RegionFacts from "../RegionFacts/RegionFacts";
import styles from "./RegionHero.module.css";

interface RegionHeroProps {
  region: RegionDetail;
}

/** The region profile above the Pokemon list: what the region is called, when
 *  it debuted, and what it holds. Every value comes from the API. */
export const RegionHero = ({ region }: RegionHeroProps) => {
  const generation = formatGeneration(region.generation);
  const { ref, scrolledPast } = useScrolledPast<HTMLElement>();

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
              <CountPill value={region.pokemonCount} label="Pokemon" />
              <CountPill value={region.locations.length} label="Locations" />
            </>
          }
        />
      )}

      <section ref={ref} className={styles.hero}>
        <div className={styles.heroBody}>
          <div className={styles.heroInfo}>
            <span className={styles.eyebrow}>Region</span>
            <h1 className={styles.regionName}>{region.displayName}</h1>
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
          <RegionFacts label="Pokedexes" items={region.pokedexes} />
          <RegionFacts label="Games" items={region.versionGroups} />
        </div>
      </section>
    </>
  );
};
