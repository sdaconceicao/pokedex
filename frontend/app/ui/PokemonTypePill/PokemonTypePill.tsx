import styles from "./PokemonTypePill.module.css";

interface PokemonTypePillProps {
  type: string;
}

export const PokemonTypePill = ({ type }: PokemonTypePillProps) => {
  return (
    <span
      key={type}
      className={`${styles.typePill} ${styles[type.toLowerCase()]}`}
    >
      {type}
    </span>
  );
};
