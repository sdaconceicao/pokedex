"use client";

import type { CSSProperties } from "react";
import { useMemo, useState } from "react";
import { getPokemonTypeIcon } from "@/lib/pokemonTypeIcons";
import { capitalize } from "@/lib/string";
import type { TypeDamageRelations } from "@/types";
import styles from "./TypeWheel.module.css";
import {
  buildTrackGradient,
  describeMatchup,
  getMatchups,
  type Side,
  summariseMatchups,
  TINT_LABELS,
  type Tint,
} from "./TypeWheel.utils";

interface TypeWheelProps {
  /** The type at the centre of the wheel */
  name: string;
  displayName: string;
  relations: TypeDamageRelations;
}

const LEGEND: Tint[] = ["good", "neutral", "bad", "none"];

/** One half of a reading: which way round it is, the multiplier, and the word
 *  for it. */
const Reading = ({ direction, side }: { direction: string; side: Side }) => (
  <span className={styles.reading}>
    <span className={styles.direction}>{direction}</span>
    <span className={`${styles.multiplier} ${styles[side.tint]}`}>{side.symbol}</span>
    {side.label}
  </span>
);

/**
 * The type chart as two rings: the outer one is what this type's attacks do to
 * each of the eighteen, the inner one is what it takes from them. Both are
 * tinted green where the matchup falls this type's way and red where it does
 * not, so one look covers both halves.
 *
 * Every spoke is a button, so the wheel works the same by pointer, keyboard and
 * touch: hovering or focusing one reads it out, and on a touchscreen — where
 * there is no hover — a tap does the same and the reading stays put.
 */
export default function TypeWheel({ name, displayName, relations }: TypeWheelProps) {
  const matchups = useMemo(() => getMatchups(relations), [relations]);
  const attackGradient = useMemo(() => buildTrackGradient(matchups, "attack"), [matchups]);
  const defenseGradient = useMemo(() => buildTrackGradient(matchups, "defense"), [matchups]);
  const summary = useMemo(() => summariseMatchups(matchups), [matchups]);
  const [activeType, setActiveType] = useState<string | null>(null);

  const active = matchups.find((matchup) => matchup.type === activeType);

  return (
    <div className={styles.wheel}>
      <div
        className={styles.ring}
        style={{ "--slice": `${360 / matchups.length}deg` } as CSSProperties}
      >
        <div className={styles.trackAttack} style={{ background: attackGradient }} />
        <div className={styles.trackDefense} style={{ background: defenseGradient }} />

        {/* The same icon the types sidebar uses, filling the rings' middle */}
        <div className={styles.core} data-testid="type-wheel-core">
          <span className={styles.coreIcon}>{getPokemonTypeIcon(name)}</span>
        </div>

        {/* A fieldset, so the eighteen buttons announce as one group. Each sits
            on the outer ring but speaks for both. */}
        <fieldset className={styles.segments}>
          <legend className={styles.segmentsLegend}>{displayName} type matchups</legend>
          {matchups.map((matchup, index) => {
            const description = capitalize(describeMatchup(matchup));

            return (
              <button
                key={matchup.type}
                type="button"
                className={`${styles.segment} ${styles[matchup.attack.tint]} ${
                  activeType === matchup.type ? styles.active : ""
                }`}
                style={{ "--index": index } as CSSProperties}
                // Native tooltip for pointers, on top of the readout below
                title={description}
                aria-label={description}
                aria-pressed={activeType === matchup.type}
                onPointerEnter={() => setActiveType(matchup.type)}
                // Touch fires this the moment the finger lifts, which would wipe
                // the reading the tap just asked for
                onPointerLeave={(event) => {
                  if (event.pointerType === "mouse") setActiveType(null);
                }}
                onClick={() => setActiveType(matchup.type)}
                onFocus={() => setActiveType(matchup.type)}
                onBlur={() => setActiveType(null)}
              >
                <span className={styles.icon} aria-hidden="true">
                  {getPokemonTypeIcon(matchup.type)}
                </span>
              </button>
            );
          })}
        </fieldset>
      </div>

      {/* Visual only: each spoke already carries the same words in its label */}
      <p className={styles.readout} data-testid="type-wheel-readout" aria-hidden="true">
        {active ? (
          <>
            <span className={styles.readoutType}>{capitalize(active.type)}</span>
            <span className={styles.readings}>
              <Reading direction="Atk" side={active.attack} />
              <Reading direction="Def" side={active.defense} />
            </span>
          </>
        ) : (
          summary
        )}
      </p>

      <div className={styles.key} aria-hidden="true">
        <p className={styles.rings}>Outer ring attacking · inner ring defending</p>
        <ul className={styles.legend}>
          {LEGEND.map((tint) => (
            <li key={tint} className={styles.legendItem}>
              <span className={`${styles.swatch} ${styles[tint]}`} />
              {TINT_LABELS[tint]}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
