import { usePathname } from "next/navigation";
import { useMemo } from "react";
import { DisclosureGroup } from "react-aria-components";
import type { NavigationData } from "@/providers/NavigationDataProvider";
import SearchFilters from "./components/SearchFilters";
import styles from "./Navbar.module.css";
import {
  getOpenSectionKey,
  getPokedexGroups,
  getRegionItems,
  getSpecialItems,
  getTypeItems,
  NAV_SECTIONS,
  type NavSectionKey,
} from "./Navbar.util";
import NavbarGroup from "./NavbarGroup";
import type { NavItem } from "./NavbarItem";
import NavbarSection from "./NavbarSection";

interface NavbarProps {
  navigationData: NavigationData;
}

export default function Navbar({ navigationData }: NavbarProps) {
  const { types, pokedexes, regions } = navigationData;
  const openSection = getOpenSectionKey(usePathname());

  const typeItems = useMemo(() => getTypeItems(types), [types]);
  const specialItems = useMemo(() => getSpecialItems(), []);
  const regionItems = useMemo(() => getRegionItems(regions), [regions]);
  // Pokedexes are the one section grouped rather than flat: there are ~35 of
  // them, ten in Alola alone.
  const pokedexGroups = useMemo(() => getPokedexGroups(pokedexes), [pokedexes]);

  const itemsByKey: Record<Exclude<NavSectionKey, "pokedexes">, NavItem[]> = {
    types: typeItems,
    special: specialItems,
    regions: regionItems,
  };

  return (
    <nav className={styles.navbar}>
      {/* Search first: it combines facets, so it is the more capable of the
          two, and Browse below is the one-facet shortcut to the same results. */}
      <NavbarGroup title="Search">
        <SearchFilters types={types} regions={regions} pokedexes={pokedexes} />
      </NavbarGroup>

      <NavbarGroup title="Browse">
        {/* One section open at a time (DisclosureGroup's default), starting on
            whichever one the current route belongs to — and on the first section
            from a route that belongs to none. All four open at once ran the
            sidebar to roughly three screens.

            Keyed by that section so arriving in a different one opens it, while
            a toggle within the same one is left alone — remounting is what
            re-applies `defaultExpandedKeys`, and it only happens when the route
            crosses into another section. */}
        <DisclosureGroup key={openSection} defaultExpandedKeys={[openSection]}>
          {NAV_SECTIONS.map(({ key, title, icon, columns }) =>
            key === "pokedexes" ? (
              <NavbarSection key={key} id={key} title={title} icon={icon} groups={pokedexGroups} />
            ) : (
              <NavbarSection
                key={key}
                id={key}
                title={title}
                icon={icon}
                columns={columns}
                items={itemsByKey[key]}
              />
            ),
          )}
        </DisclosureGroup>
      </NavbarGroup>
    </nav>
  );
}
