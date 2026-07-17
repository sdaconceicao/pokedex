import type { FunctionComponent } from "react";
import PokemonTypePill from "@/components/PokemonTypePill";
import { getPokemonTypeIcon } from "@/lib/pokemonTypeIcons";

interface TypeTagProps {
  type: string;
  className?: string;
}

/**
 * A Pokemon type pill with the same icon used for that type in the sidebar
 * navigation rendered inside it.
 */
export const TypeTag: FunctionComponent<TypeTagProps> = ({ type, className }) => {
  return <PokemonTypePill type={type} icon={getPokemonTypeIcon(type)} className={className} />;
};

export default TypeTag;
