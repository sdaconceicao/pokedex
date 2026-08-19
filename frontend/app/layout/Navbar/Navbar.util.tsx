import { BookOpen01, MarkerPin01, Star01, Tag01 } from "@untitled-ui/icons-react";
import type { ReactNode } from "react";
import {
  getDefaultVariant,
  getPokedexRegionGroups,
  type PokedexGroupEntry,
  UNGROUPED_TITLE,
} from "@/lib/pokedexFamilies";
import { getPokemonTypeIcon } from "@/lib/pokemonTypeIcons";
import { SPECIAL_TITLES, SPECIALS } from "@/lib/specials";
import { capitalize } from "@/lib/string";
import type { PokemonPokedex, PokemonRegion, PokemonType } from "@/types";
import type { NavItem } from "./NavbarItem";
import type { NavGroup } from "./NavbarSection";

export type NavSectionKey = "types" | "special" | "regions" | "pokedexes";

export interface NavSection {
  key: NavSectionKey;
  title: string;
  icon: ReactNode;
  /**
   * Lay this section's options out in two columns rather than one.
   *
   * Opted into per section rather than applied to every flat one: at this
   * sidebar's width a column is ~135px, which the type and region labels clear
   * (99px at their widest) but the pokedex ones do not — and Pokedexes would
   * gain least anyway, since five of its eleven region bands hold a single dex.
   */
  columns?: 2;
}

/** The sections of the sidebar, in order. Shared by the expanded navbar and the
 *  collapsed icon rail so both stay in step. */
export const NAV_SECTIONS: NavSection[] = [
  { key: "types", title: "Types", icon: <Tag01 width={18} height={18} />, columns: 2 },
  { key: "special", title: "Special", icon: <Star01 width={18} height={18} /> },
  {
    key: "regions",
    title: "Regions",
    icon: <MarkerPin01 width={18} height={18} />,
    columns: 2,
  },
  {
    key: "pokedexes",
    title: "Pokedexes",
    icon: <BookOpen01 width={18} height={18} />,
  },
];

/**
 * The first path segment each Browse section owns. `/pokemon` and `/search` are
 * absent on purpose: they belong to no one section, so they open none.
 */
const SECTION_BY_SEGMENT: Record<string, NavSectionKey> = {
  type: "types",
  forms: "special",
  region: "regions",
  pokedex: "pokedexes",
};

/**
 * Which Browse section should be the open one — the section the current route
 * sits in, and the first section on a route that sits in none, so the sidebar
 * always opens on something rather than on four closed headers.
 *
 * Falls back to `NAV_SECTIONS[0]` rather than naming a section, so reordering the
 * sidebar reorders what a bare route opens with it.
 *
 * @param pathname - The current path, as `usePathname()` gives it
 * @returns The key of the section to open
 */
export const getOpenSectionKey = (pathname: string): NavSectionKey => {
  const [segment] = pathname.split("/").filter(Boolean);

  return SECTION_BY_SEGMENT[segment ?? ""] ?? NAV_SECTIONS[0].key;
};

export const getTypeItems = (types: PokemonType[]): NavItem[] =>
  types.map((type) => ({
    label: `${capitalize(type.name)} (${type.count})`,
    href: `/type/${encodeURIComponent(type.name)}`,
    icon: getPokemonTypeIcon(type.name),
    activeWhenPathnameEquals: `/type/${type.name}`,
  }));

const pokedexHref = (name: string): string => `/pokedex/${encodeURIComponent(name)}`;

/**
 * The dexes of one region, as nav items.
 *
 * A family collapses to a single item that opens its newest revision — the
 * switcher on the page reaches the older ones — so Johto reads as one entry
 * instead of "Original Johto" and "Updated Johto" side by side.
 */
export const getPokedexItems = (entries: PokedexGroupEntry[]): NavItem[] =>
  entries.map((entry) => {
    if (entry.kind === "single") {
      return {
        label: `${entry.pokedex.displayName} (${entry.pokedex.count})`,
        href: pokedexHref(entry.pokedex.name),
        activeWhenPathnameEquals: `/pokedex/${entry.pokedex.name}`,
      };
    }

    const opens = getDefaultVariant(entry.family);

    return {
      label: `${entry.place} (${opens.count})`,
      href: pokedexHref(opens.name),
      // Any revision of the place marks this item, since it is the only one
      // standing for them
      activeWhenPathnameIn: entry.family.variants.map(({ name }) => `/pokedex/${name}`),
    };
  });

/**
 * The Pokedexes section, grouped by region.
 *
 * @param pokedexes - The dex list, as the API returns it
 * @returns One titled group per region, in the order the games introduced them
 */
export const getPokedexGroups = (pokedexes: PokemonPokedex[]): NavGroup[] =>
  getPokedexRegionGroups(pokedexes).map(({ region, entries }) => ({
    title: region ? capitalize(region) : UNGROUPED_TITLE,
    items: getPokedexItems(entries),
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
    href: `/forms/${special}`,
    activeWhenPathnameEquals: `/forms/${special}`,
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
