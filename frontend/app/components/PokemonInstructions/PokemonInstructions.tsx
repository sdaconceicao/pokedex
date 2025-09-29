import styles from "./PokemonInstructions.module.css";

export const PokemonInstructions: React.FunctionComponent = () => {
  return (
    <div className={styles.instructions}>
      <p>
        Select a Pokemon type, pokedex, or region from the sidebar or search for
        Pokemon to get started
      </p>
      <p className={styles.note}>
        Note: Search, type selection, pokedex selection, and region selection
        are separate - use one at a time
      </p>
    </div>
  );
};

export default PokemonInstructions;
