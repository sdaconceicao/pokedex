import { useMemo } from "react";
import type { NavigationData } from "@/providers/NavigationDataProvider";
import styles from "./Navbar.module.css";
import {
  getPokedexItems,
  getRegionItems,
  getSpecialItems,
  getTypeItems,
  NAV_SECTIONS,
  type NavSectionKey,
} from "./Navbar.util";
import type { NavItem } from "./NavbarItem";
import NavbarSection from "./NavbarSection";

interface NavbarProps {
  navigationData: NavigationData;
}

export default function Navbar({ navigationData }: NavbarProps) {
  const { types, pokedexes, regions } = navigationData;

  const typeItems = useMemo(() => getTypeItems(types), [types]);
  const specialItems = useMemo(() => getSpecialItems(), []);
  const regionItems = useMemo(() => getRegionItems(regions), [regions]);
  const pokedexItems = useMemo(() => getPokedexItems(pokedexes), [pokedexes]);

  const itemsByKey: Record<NavSectionKey, NavItem[]> = {
    types: typeItems,
    special: specialItems,
    regions: regionItems,
    pokedexes: pokedexItems,
  };

  return (
    <nav className={styles.navbar}>
      {NAV_SECTIONS.map(({ key, title, icon }) => (
        <NavbarSection
          key={key}
          title={title}
          icon={icon}
          items={itemsByKey[key]}
        />
      ))}
    </nav>
  );
}
