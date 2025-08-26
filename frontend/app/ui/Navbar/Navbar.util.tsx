import { PokemonType, PokemonRegion } from "@/lib/types";
import { NavItem } from "./NavbarItem";

export const getTypeItems = (types: PokemonType[]): NavItem[] =>
  types.map((type) => ({
    label: `${type.name.charAt(0).toUpperCase()}${type.name.slice(1)} (${type.count})`,
    href: `/?type=${encodeURIComponent(type.name)}`,
    activeWhenQueryParamEquals: { key: "type", value: type.name },
  }));

export const getPokedexItems = (pokedexes: string[]): NavItem[] =>
  pokedexes.map((pokedex) => ({
    label:
      pokedex.charAt(0).toUpperCase() + pokedex.slice(1).replace(/-/g, " "),
    href: `/?pokedex=${encodeURIComponent(pokedex)}`,
    activeWhenQueryParamEquals: { key: "pokedex", value: pokedex },
  }));

export const getRegionItems = (regions: PokemonRegion[]): NavItem[] =>
  regions.map((region) => ({
    label: `${region.name.charAt(0).toUpperCase()}${region.name.slice(1)} (${region.count})`,
    href: `/?region=${encodeURIComponent(region.name)}`,
    activeWhenQueryParamEquals: { key: "region", value: region.name },
  }));

export const getSpecialItems = (): NavItem[] => [
  {
    label: "Gigantamax",
    href: "/?q=gmax",
    activeWhenQueryParamEquals: { key: "query", value: "gmax" },
  },
  {
    label: "Mega Evolve",
    href: "/?q=-mega",
    activeWhenQueryParamEquals: { key: "query", value: "mega" },
  },
];
