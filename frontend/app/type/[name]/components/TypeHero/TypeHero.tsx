"use client";

import Image from "next/image";
import CountPill from "@/components/CountPill";
import HeroToolbar from "@/components/HeroToolbar";
import StatTile from "@/components/StatTile";
import { useScrolledPast } from "@/hooks";
import { formatGeneration } from "@/lib/string";
import type { TypeDetail } from "@/types";
import styles from "./TypeHero.module.css";
import TypeMatchups from "./TypeMatchups";
import TypeWheel from "./TypeWheel";

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
              <CountPill value={type.pokemonCount} label="Pokemon" />
              <CountPill value={type.moveCount} label="Moves" />
            </>
          }
        />
      )}

      <section ref={ref} className={`${styles.hero} ${typeClass}`}>
        <div className={styles.heroBody}>
          <div className={styles.heroInfo}>
            <span className={styles.eyebrow}>Type</span>
            <h1 className={styles.typeName}>{type.displayName}</h1>
            {generation && <span className={styles.generation}>{generation}</span>}

            <dl className={styles.stats}>
              <StatTile label="Pokemon" value={type.pokemonCount} />
              <StatTile label="Moves" value={type.moveCount} />
            </dl>
          </div>

          {/* The sprite's slot, now the advantage wheel — the sprite sits at
              its centre */}
          <TypeWheel
            name={type.name}
            displayName={type.displayName}
            relations={type.damageRelations}
          />
        </div>

        <div className={styles.heroFooter}>
          <TypeMatchups relations={type.damageRelations} />
        </div>
      </section>
    </>
  );
};

export default TypeHero;
