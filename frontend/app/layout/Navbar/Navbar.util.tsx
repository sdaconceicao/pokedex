import { getPokemonTypeIcon } from "@/lib/pokemonTypeIcons";
import { capitalize } from "@/lib/string";
import type { PokemonPokedex, PokemonRegion, PokemonType } from "@/types";
import type { NavItem } from "./NavbarItem";

export const getTypeItems = (types: PokemonType[]): NavItem[] =>
  types.map((type) => ({
    label: `${capitalize(type.name)} (${type.count})`,
    href: `/?type=${encodeURIComponent(type.name)}`,
    icon: getPokemonTypeIcon(type.name),
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
