"use client";

import { Heading } from "@code-x/lago";
import Image from "next/image";
import { useCallback } from "react";
import CountPill from "@/components/CountPill";
import HeroToolbar from "@/components/HeroToolbar";
import SortToggle from "@/components/SortToggle";
import StatTile from "@/components/StatTile";
import { useScrolledPast, useSortParam } from "@/hooks";
import { buildBrowseUrl } from "@/lib/browseUrls";
import { formatGeneration } from "@/lib/string";
import type { PokemonSort, TypeDetail } from "@/types";
import TypeWheel from "../TypeWheel/TypeWheel";
import styles from "./TypeHero.module.css";

interface TypeHeroProps {
  type: TypeDetail;
}

/** The type profile above the Pokemon list: what the type is called, when it
 *  debuted, how much of the Pokedex it covers and how it fares in battle.
 *  Tinted by the type's own palette, from typePalette.css. */
export const TypeHero = ({ type }: TypeHeroProps) => {
  const generation = formatGeneration(type.generation);
  const { ref, scrolledPast } = useScrolledPast<HTMLElement>();
  const typeClass = `type-${type.name.toLowerCase()}`;

  const buildSortUrl = useCallback(
    (next: PokemonSort) => buildBrowseUrl("type", type.name, { page: 1, sort: next }),
    [type.name],
  );
  const { sort, setSort } = useSortParam(buildSortUrl);

  return (
    <>
      {scrolledPast && (
        <HeroToolbar
          className={typeClass}
          title={type.displayName}
          titleSide="left"
          icon={
            type.sprite && (
              <Image
                src={type.sprite}
                alt=""
                className={styles.toolbarSprite}
                width={26}
                height={26}
              />
            )
          }
          aside={
            <>
              <CountPill
                value={type.pokemonCount}
                label="Pokemon"
                className={styles.toolbarCount}
              />
              <CountPill value={type.moveCount} label="Moves" className={styles.toolbarCount} />
              <SortToggle value={sort} onChange={setSort} />
            </>
          }
        />
      )}

      <section ref={ref} className={`${styles.hero} ${typeClass}`}>
        <div className={styles.heroBody}>
          <div className={styles.heroInfo}>
            <span className={styles.eyebrow}>Type</span>
            <Heading level={1} className={styles.typeName}>
              {type.displayName}
            </Heading>
            {generation && <span className={styles.generation}>{generation}</span>}
          </div>

          {/* Its own cell, so stacking can place it between the name and the
              counts rather than after both */}
          <div className={styles.heroWheel}>
            <TypeWheel
              name={type.name}
              displayName={type.displayName}
              relations={type.damageRelations}
            />
          </div>

          <dl className={styles.stats}>
            <StatTile label="Pokemon" value={type.pokemonCount} />
            <StatTile label="Moves" value={type.moveCount} />
          </dl>
        </div>
      </section>
    </>
  );
};

export default TypeHero;
