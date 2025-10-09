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
import { PokemonType, PokemonRegion, PokemonPokedex } from "@/types";
import { NavItem } from "./NavbarItem";
import { capitalize } from "@/lib/string";

export const ICONS_BY_TYPE = {
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

export const getTypeItems = (types: PokemonType[]): NavItem[] =>
  types.map((type) => ({
    label: `${capitalize(type.name)} (${type.count})`,
    href: `/?type=${encodeURIComponent(type.name)}`,
    icon: ICONS_BY_TYPE[type.name as keyof typeof ICONS_BY_TYPE] || (
      <IconNormal />
    ),
    activeWhenQueryParamEquals: { key: "type", value: type.name },
  }));

export const getPokedexItems = (pokedexes: PokemonPokedex[]): NavItem[] =>
  pokedexes.map((pokedex) => ({
    label: `${capitalize(pokedex.name).replace(/-/g, " ")} (${pokedex.count})`,
    href: `/?pokedex=${encodeURIComponent(pokedex.name)}`,
    activeWhenQueryParamEquals: { key: "pokedex", value: pokedex.name },
  }));

export const getRegionItems = (regions: PokemonRegion[]): NavItem[] =>
  regions.map((region) => ({
    label: `${capitalize(region.name)} (${region.count})`,
    href: `/?region=${encodeURIComponent(region.name)}`,
    activeWhenQueryParamEquals: { key: "region", value: region.name },
  }));

export const getSpecialItems = (): NavItem[] => [
  {
    label: "Gigantamax",
    href: "/?special=gmax",
    activeWhenQueryParamEquals: { key: "special", value: "gmax" },
  },
  {
    label: "Mega Evolve",
    href: "/?special=mega",
    activeWhenQueryParamEquals: { key: "special", value: "mega" },
  },
];

export const mapSpecialToTitle = (special: string) => {
  switch (special) {
    case "gmax":
      return "Gigantamax";
    case "mega":
      return "Mega Evolve";
    default:
      return "";
  }
};
