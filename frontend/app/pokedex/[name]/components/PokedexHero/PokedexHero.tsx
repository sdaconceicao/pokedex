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
import type { PokedexFamily } from "@/lib/pokedexFamilies";
import type { PokedexDetail, PokemonSort } from "@/types";
import styles from "./PokedexHero.module.css";
import VariantSwitch from "./VariantSwitch";

interface PokedexHeroProps {
  pokedex: PokedexDetail;
  /** The revisions of this dex's place, when it is one of several */
  family?: PokedexFamily | null;
}

/** The pokedex profile above the Pokemon list: what the dex is called, what it
 *  is for, and which games and region it belongs to. Every value comes from the
 *  API. */
export const PokedexHero = ({ pokedex, family }: PokedexHeroProps) => {
  const { ref, scrolledPast } = useScrolledPast<HTMLElement>();

  // Several dexes — the national one, and the spin-offs — have neither a region
  // nor version groups upstream. Both rows would hide themselves, but the strip
  // they sit on would stay, so it is dropped here rather than left as an empty
  // band under the body.
  const hasFacts = Boolean(pokedex.region) || pokedex.versionGroups.length > 0;

  // A family member is titled by the place its revisions share, since the
  // switcher below already says which revision this is — "Johto" over
  // [Original|Updated] rather than "Updated Johto" over the same pair.
  const title = family ? family.place : pokedex.displayName;

  const buildSortUrl = useCallback(
    (next: PokemonSort) => buildBrowseUrl("pokedex", pokedex.name, { page: 1, sort: next }),
    [pokedex.name],
  );
  const { sort, setSort } = useSortParam(buildSortUrl);

  return (
    <>
      {/* Ahead of the hero in the flow, so it is already pinned to the top of
          the scroll area when it appears and lands over the hero's last sliver
          instead of stacking under it. The pokedex has no hero actions, so its
          count takes the side opposite the name. */}
      {scrolledPast && (
        <HeroToolbar
          title={title}
          titleSide="left"
          aside={
            <>
              <CountPill
                value={pokedex.pokemonCount}
                label="Pokemon"
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
            <span className={styles.eyebrow}>Pokedex</span>
            <Heading level={1} className={styles.pokedexName}>
              {title}
            </Heading>
            {/* A dex is a list a set of games shipped with rather than a
                generation, so what it is worth saying about it is whether it
                counts towards the main series. */}
            <div className={styles.tags}>
              {family && (
                <VariantSwitch variants={family.variants} current={pokedex.name} sort={sort} />
              )}
              <span className={styles.tag}>
                {pokedex.isMainSeries ? "Main series" : "Spin-off"}
              </span>
            </div>
            {pokedex.description && <p className={styles.description}>{pokedex.description}</p>}
          </div>

          {/* One tile: the entries are the only thing a dex counts. Its games
              and region are named in the footer instead. */}
          <dl className={styles.stats}>
            <StatTile label="Pokemon" value={pokedex.pokemonCount} />
          </dl>
        </div>

        {hasFacts && (
          <div className={styles.heroFooter}>
            {/* Each row drops itself when the API gave nothing, which is how a
                dex with games but no region shows only the one row. */}
            <FactRow label="Region" items={pokedex.region ? [pokedex.region] : []} />
            <FactRow label="Games" items={pokedex.versionGroups} />
          </div>
        )}
      </section>
    </>
  );
};
