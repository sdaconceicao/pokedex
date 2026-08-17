import { Heading } from "@code-x/lago";
import type { FunctionComponent } from "react";
import PokemonTypePill from "@/components/PokemonTypePill";
import css from "./PokemonCard.module.css";

interface PokemonCardSkeletonProps {
  /**
   * Accessible name announced for this one placeholder. lago's Skeleton
   * convention is to label exactly one shape in a repeated region so
   * assistive tech hears a single "loading" status rather than one per card
   * — pass it on only the first card in a grid (see PokemonListSkeleton) and
   * leave the rest of this prop unset, which keeps them `aria-hidden`.
   */
  label?: string;
}

/**
 * A ghost of PokemonCard: same tags, same classes, placeholder text hidden with
 * `color: transparent`. Heights therefore come from the real card's own rules
 * rather than hand-tuned values, so a skeleton is exactly as tall as a loaded
 * card and the grid doesn't reflow when data arrives.
 *
 * This deliberately doesn't reach for lago's `Skeleton`: swapping any of
 * these leaves for lago's shapes would size them off `Skeleton`'s own
 * defaults (a line's height tracks the inherited font size, not this card's
 * padding/line-height stack), reintroducing the drift this component exists
 * to avoid. The one piece of lago's Skeleton this does borrow is its
 * labelling convention, above.
 */
export const PokemonCardSkeleton: FunctionComponent<PokemonCardSkeletonProps> = ({ label }) => {
  return (
    <div
      className={css.pokemonCard}
      data-testid="pokemon-card-skeleton"
      aria-hidden={label ? undefined : true}
      role="status"
      aria-label={label}
    >
      <div className={css.cardHeader}>
        <Heading level={3} className={`${css.pokemonName} ${css.skeletonName}`}>
          Loading
        </Heading>
        <span className={`${css.pokemonId} ${css.skeletonId}`}>#000</span>
      </div>
      <div className={css.typeList}>
        <PokemonTypePill
          type="normal"
          className={`${css.cardPill} ${css.skeletonType} ${css.skeletonType1}`}
        />
        <PokemonTypePill
          type="normal"
          className={`${css.cardPill} ${css.skeletonType} ${css.skeletonType2}`}
        />
      </div>
      <div className={css.imageWrap}>
        <div className={`${css.pokemonImage} ${css.skeletonImage}`} />
      </div>
      <div className={css.stats}>
        <p className={css.skeletonStat}>HP: 00</p>
        <p className={css.skeletonStat}>Attack: 00</p>
        <p className={css.skeletonStatLast}>Defense: 00</p>
      </div>
    </div>
  );
};

export default PokemonCardSkeleton;
