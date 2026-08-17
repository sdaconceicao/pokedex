import { BookOpen01, MarkerPin01, Star01, Tag01 } from "@untitled-ui/icons-react";
import type { ReactNode } from "react";
import { getPokemonTypeIcon } from "@/lib/pokemonTypeIcons";
import { buildSearchUrl, SPECIAL_TITLES, SPECIALS } from "@/lib/searchFilters";
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
    href: `/type/${encodeURIComponent(type.name)}`,
    icon: getPokemonTypeIcon(type.name),
    activeWhenPathnameEquals: `/type/${type.name}`,
  }));

/** Pokedexes have no page of their own — they are one facet of `/search`, so a
 *  nav item is the same link the sidebar form would build for that one pick. */
export const getPokedexItems = (pokedexes: PokemonPokedex[]): NavItem[] =>
  pokedexes.map((pokedex) => ({
    label: `${capitalize(pokedex.name).replace(/-/g, " ")} (${pokedex.count})`,
    href: buildSearchUrl({ pokedexes: [pokedex.name] }),
    activeWhenSearchParamIncludes: { key: "pokedexes", value: pokedex.name },
  }));

export const getRegionItems = (regions: PokemonRegion[]): NavItem[] =>
  regions.map((region) => ({
    label: `${capitalize(region.name)} (${region.count})`,
    href: `/region/${encodeURIComponent(region.name)}`,
    activeWhenPathnameEquals: `/region/${region.name}`,
  }));

export const getSpecialItems = (): NavItem[] =>
  SPECIALS.map((special) => ({
    label: SPECIAL_TITLES[special],
    href: buildSearchUrl({ special }),
    activeWhenSearchParamIncludes: { key: "special", value: special },
  }));

/**
 * Whether a comma-joined search param carries a value. The multi-value facets
 * put several slugs behind one key, so an item is current when it is *among*
 * them rather than the whole value.
 *
 * @param raw - The raw param, as `useSearchParams().get()` returns it
 * @param value - The slug to look for
 * @returns True when the param lists that slug
 */
export const paramIncludes = (raw: string | null, value: string): boolean =>
  (raw ?? "").split(",").some((entry) => entry.trim().toLowerCase() === value.toLowerCase());
