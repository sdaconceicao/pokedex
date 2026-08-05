import { titleCase } from "@/lib/string";
import type { RegionDetail } from "@/types";
import styles from "./RegionHero.module.css";
import { formatGeneration } from "./RegionHero.utils";

interface RegionHeroProps {
  region: RegionDetail;
}

/** The chip rows along the bottom of the hero. Rendered only when the API
 *  actually returned entries, so an empty region shows no bare label. */
const RegionFacts = ({ label, items }: { label: string; items: string[] }) => {
  if (items.length === 0) return null;

  return (
    <div className={styles.factRow}>
      <span className={styles.factLabel}>{label}</span>
      <ul className={styles.chips}>
        {items.map((item) => (
          <li key={item} className={styles.chip}>
            {titleCase(item)}
          </li>
        ))}
      </ul>
    </div>
  );
};

/** The region profile above the Pokemon list: what the region is called, when
 *  it debuted, and what it holds. Every value comes from the API. */
export const RegionHero = ({ region }: RegionHeroProps) => {
  const generation = formatGeneration(region.generation);

  return (
    <section className={styles.hero}>
      <div className={styles.heroBody}>
        <div className={styles.heroInfo}>
          <span className={styles.eyebrow}>Region</span>
          <h1 className={styles.regionName}>{region.displayName}</h1>
          {generation && <span className={styles.generation}>{generation}</span>}
        </div>

        {/* Counts for what the footer doesn't list out: the region's Pokemon,
            and its locations, of which there are far too many to name. */}
        <dl className={styles.stats}>
          <div className={styles.stat}>
            <dt className={styles.statLabel}>Pokemon</dt>
            <dd className={styles.statValue}>{region.pokemonCount}</dd>
          </div>
          <div className={styles.stat}>
            <dt className={styles.statLabel}>Locations</dt>
            <dd className={styles.statValue}>{region.locations.length}</dd>
          </div>
        </dl>
      </div>

      <div className={styles.heroFooter}>
        <RegionFacts label="Pokedexes" items={region.pokedexes} />
        <RegionFacts label="Games" items={region.versionGroups} />
      </div>
    </section>
  );
};
