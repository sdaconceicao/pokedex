import { BookOpen01, MarkerPin01, Star01, Tag01 } from "@untitled-ui/icons-react";
import type { ReactNode } from "react";
import { getPokemonTypeIcon } from "@/lib/pokemonTypeIcons";
import { capitalize } from "@/lib/string";
import type { PokemonPokedex, PokemonRegion, PokemonType } from "@/types";
import type { NavItem } from "./NavbarItem";

export type NavSectionKey = "types" | "special" | "regions" | "pokedexes";

export interface NavSection {
  key: NavSectionKey;
  title: string;
  icon: ReactNode;
}

/** The sections of the sidebar, in order. Shared by the expanded navbar and the
 *  collapsed icon rail so both stay in step. */
export const NAV_SECTIONS: NavSection[] = [
  { key: "types", title: "Types", icon: <Tag01 width={18} height={18} /> },
  { key: "special", title: "Special", icon: <Star01 width={18} height={18} /> },
  {
    key: "regions",
    title: "Regions",
    icon: <MarkerPin01 width={18} height={18} />,
  },
  {
    key: "pokedexes",
    title: "Pokedexes",
    icon: <BookOpen01 width={18} height={18} />,
  },
];

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

// Regions get a page of their own — the region's profile above its Pokemon —
// rather than filtering the results on the home page.
export const getRegionItems = (regions: PokemonRegion[]): NavItem[] =>
  regions.map((region) => ({
    label: `${capitalize(region.name)} (${region.count})`,
    href: `/region/${encodeURIComponent(region.name)}`,
    activeWhenPathnameEquals: `/region/${region.name}`,
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
