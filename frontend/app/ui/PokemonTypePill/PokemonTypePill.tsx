import { FunctionComponent } from "react";
import styles from "./PokemonTypePill.module.css";

interface PokemonTypePillProps {
  type: string;
  className?: string;
}

export const PokemonTypePill: FunctionComponent<PokemonTypePillProps> = ({
  type,
  className,
}: PokemonTypePillProps) => {
  return (
    <span
      className={`${styles.pokemonTypePill} ${styles[type.toLowerCase()]} ${className || ""}`}
    >
      {type}
    </span>
  );
};
