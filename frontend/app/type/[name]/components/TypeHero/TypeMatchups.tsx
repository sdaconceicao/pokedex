import PokemonTypePill from "@/components/PokemonTypePill";
import type { TypeDamageRelations } from "@/types";
import styles from "./TypeMatchups.module.css";

interface TypeMatchupsProps {
  relations: TypeDamageRelations;
}

interface Row {
  /** The damage multiplier this row stands for */
  multiplier: string;
  label: string;
  types: string[];
}

/** One side of the chart: the multiplier, what it means, and the types it
 *  applies to. Rows the API left empty are dropped rather than shown bare. */
const MatchupGroup = ({ heading, rows }: { heading: string; rows: Row[] }) => {
  const filled = rows.filter((row) => row.types.length > 0);
  if (filled.length === 0) return null;

  return (
    <div className={styles.group}>
      <h2 className={styles.groupHeading}>{heading}</h2>
      <dl className={styles.rows}>
        {filled.map(({ multiplier, label, types }) => (
          <div key={label} className={styles.row}>
            <dt className={styles.rowLabel}>
              <span className={styles.multiplier}>{multiplier}</span>
              {label}
            </dt>
            <dd className={styles.rowTypes}>
              {types.map((type) => (
                <PokemonTypePill key={type} type={type} className={styles.pill} />
              ))}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
};

/**
 * How the type fares against every other: what its own attacks do on the left,
 * what it takes on the right. Both sides come straight from the API's damage
 * relations — only the wording is ours.
 */
export default function TypeMatchups({ relations }: TypeMatchupsProps) {
  return (
    <div className={styles.chart}>
      <MatchupGroup
        heading="Attacking"
        rows={[
          { multiplier: "2×", label: "Strong against", types: relations.doubleDamageTo },
          { multiplier: "½×", label: "Not very effective", types: relations.halfDamageTo },
          { multiplier: "0×", label: "No effect on", types: relations.noDamageTo },
        ]}
      />
      <MatchupGroup
        heading="Defending"
        rows={[
          { multiplier: "2×", label: "Weak to", types: relations.doubleDamageFrom },
          { multiplier: "½×", label: "Resists", types: relations.halfDamageFrom },
          { multiplier: "0×", label: "Immune to", types: relations.noDamageFrom },
        ]}
      />
    </div>
  );
}
