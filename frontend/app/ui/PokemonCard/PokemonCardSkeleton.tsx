import { FunctionComponent } from "react";
import css from "./PokemonCard.module.css";

export const PokemonCardSkeleton: FunctionComponent = () => {
  return (
    <div className={css.pokemonCard} data-testid="pokemon-card-skeleton">
      <div className={`${css.pokemonImage} ${css.skeletonImage}`} />
      <div className={`${css.pokemonName} ${css.skeletonName}`} />
      <div className={css.typeList}>
        <div className={`${css.skeletonType} ${css.skeletonType1}`} />
        <div className={`${css.skeletonType} ${css.skeletonType2}`} />
      </div>
      <div className={css.stats}>
        <div className={css.skeletonStat} />
        <div className={css.skeletonStat} />
        <div className={css.skeletonStatLast} />
      </div>
    </div>
  );
};

export default PokemonCardSkeleton;
