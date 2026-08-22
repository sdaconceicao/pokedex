import { Heading } from "@code-x/lago";
import { getPokemonTypeIcon } from "@/lib/pokemonTypeIcons";
import { capitalize } from "@/lib/string";
// The generated GraphQL type shares this component's name, so it comes in aliased
import type { PokemonMatchups as MatchupsData } from "@/types";
import MatchupRow from "../MatchupRow";
import styles from "./PokemonMatchups.module.css";
import { groupDefensiveMatchups, groupOffensiveMatchups } from "./PokemonMatchups.utils";

interface PokemonMatchupsProps {
  matchups: MatchupsData;
  /** The Pokemon's primary type, carrying the --type-* palette in, the way
   *  PokemonAbility takes it. */
  type: string;
}

/**
 * Two columns: what this Pokemon's types deal, and what it takes. They do not
 * share arithmetic — defence multiplies across both types, offence does not —
 * so they are built by separate helpers rather than one shared shape, and the
 * attacking side stays split per type so a 2x from each never reads as 4x.
 *
 * "Attacking" and "Defending" rather than Attack and Defense: the nouns are
 * already on this page as stats, the gerunds are what the type wheel's key uses.
 */
export const PokemonMatchups = ({ matchups, type }: PokemonMatchupsProps) => {
  const attacking = groupOffensiveMatchups(matchups.attacking);
  const defending = groupDefensiveMatchups(matchups.defending);

  return (
    <div className={styles.columns} data-type={type}>
      <div className={styles.column}>
        <Heading level={3} className={styles.columnTitle}>
          Attacking
        </Heading>
        {attacking.map(({ type: source, rows }) => (
          <div key={source} className={styles.group}>
            <Heading level={4} className={styles.groupTitle}>
              <span className={styles.groupIcon} aria-hidden="true">
                {getPokemonTypeIcon(source)}
              </span>
              {capitalize(source)}
            </Heading>
            {rows.map(({ symbol, tint, types }) => (
              <MatchupRow key={symbol} label={symbol} tint={tint} types={types} />
            ))}
          </div>
        ))}
      </div>

      <div className={styles.column}>
        <Heading level={3} className={styles.columnTitle}>
          Defending
        </Heading>
        {defending.map(({ heading, tint, rows }) => (
          <div key={heading} className={styles.group}>
            <Heading level={4} className={styles.groupTitle}>
              {heading}
            </Heading>
            {rows.length ? (
              rows.map(({ symbol, types }) => (
                <MatchupRow key={symbol} label={symbol} tint={tint} types={types} />
              ))
            ) : (
              <MatchupRow label="" tint={tint} types={[]} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
