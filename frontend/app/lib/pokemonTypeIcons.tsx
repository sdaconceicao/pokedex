import {
  IconBug,
  IconDark,
  IconDragon,
  IconElectric,
  IconFairy,
  IconFighting,
  IconFire,
  IconFlying,
  IconGhost,
  IconGrass,
  IconGround,
  IconIce,
  IconNormal,
  IconPoison,
  IconPsychic,
  IconRock,
  IconSteel,
  IconWater,
} from "@pokemonle/icons-react";
import type { ReactNode } from "react";

export const POKEMON_TYPE_ICONS: Record<string, ReactNode> = {
  bug: <IconBug />,
  dark: <IconDark />,
  dragon: <IconDragon />,
  electric: <IconElectric />,
  fairy: <IconFairy />,
  fighting: <IconFighting />,
  fire: <IconFire />,
  flying: <IconFlying />,
  ghost: <IconGhost />,
  grass: <IconGrass />,
  ground: <IconGround />,
  ice: <IconIce />,
  normal: <IconNormal />,
  poison: <IconPoison />,
  psychic: <IconPsychic />,
  rock: <IconRock />,
  steel: <IconSteel />,
  water: <IconWater />,
};

export const getPokemonTypeIcon = (type: string): ReactNode =>
  POKEMON_TYPE_ICONS[type.toLowerCase()] ?? <IconNormal />;
