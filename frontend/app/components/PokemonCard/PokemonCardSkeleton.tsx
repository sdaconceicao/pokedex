import type { FunctionComponent } from "react";
import PokemonTypePill from "@/components/PokemonTypePill";
import css from "./PokemonCard.module.css";

/**
 * A ghost of PokemonCard: same tags, same classes, placeholder text hidden with
 * `color: transparent`. Heights therefore come from the real card's own rules
 * rather than hand-tuned values, so a skeleton is exactly as tall as a loaded
 * card and the grid doesn't reflow when data arrives.
 */
export const PokemonCardSkeleton: FunctionComponent = () => {
  return (
    <div className={css.pokemonCard} data-testid="pokemon-card-skeleton" aria-hidden="true">
      <div className={css.cardHeader}>
        <h3 className={`${css.pokemonName} ${css.skeletonName}`}>Loading</h3>
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
