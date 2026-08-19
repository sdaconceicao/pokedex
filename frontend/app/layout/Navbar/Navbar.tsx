import { useMemo } from "react";
import { DisclosureGroup } from "react-aria-components";
import type { NavigationData } from "@/providers/NavigationDataProvider";
import SearchFilters from "./components/SearchFilters";
import styles from "./Navbar.module.css";
import {
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
  /** Which Browse section is open, or none. Owned by AppShell, since the
   *  collapsed rail opens a section too. */
  openSection: NavSectionKey | null;
  /** The section the route sits in — marked wherever it is, open or closed, so
   *  the sidebar says where you are even when you have opened another one. */
  currentSection: NavSectionKey | null;
  onOpenSectionChange: (key: NavSectionKey | null) => void;
}

export default function Navbar({
  navigationData,
  openSection,
  currentSection,
  onOpenSectionChange,
}: NavbarProps) {
  const { types, pokedexes, regions } = navigationData;

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
        {/* One section open at a time (DisclosureGroup's default). Controlled
            rather than left to itself, because the collapsed rail's buttons open
            a section as well — so which one is open is AppShell's to hold, not
            this group's. All four open at once ran the sidebar to three screens. */}
        <DisclosureGroup
          expandedKeys={openSection ? [openSection] : []}
          onExpandedChange={(keys) => onOpenSectionChange(([...keys][0] as NavSectionKey) ?? null)}
        >
          {NAV_SECTIONS.map(({ key, title, icon, columns }) =>
            key === "pokedexes" ? (
              <NavbarSection
                key={key}
                id={key}
                title={title}
                icon={icon}
                isCurrent={key === currentSection}
                groups={pokedexGroups}
              />
            ) : (
              <NavbarSection
                key={key}
                id={key}
                title={title}
                icon={icon}
                isCurrent={key === currentSection}
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
