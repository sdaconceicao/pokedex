import type { FunctionComponent, ReactNode } from "react";
import styles from "./PokemonTypePill.module.css";

interface PokemonTypePillProps {
  type: string;
  icon?: ReactNode;
  className?: string;
}

export const PokemonTypePill: FunctionComponent<PokemonTypePillProps> = ({
  type,
  icon,
  className,
}: PokemonTypePillProps) => {
  return (
    <span className={`${styles.pokemonTypePill} ${styles[type.toLowerCase()]} ${className || ""}`}>
      {icon && (
        <span className={styles.icon} aria-hidden="true">
          {icon}
        </span>
      )}
      {type}
    </span>
  );
};
