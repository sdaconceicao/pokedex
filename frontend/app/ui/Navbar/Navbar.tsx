import { useMemo } from "react";
import { NavigationData } from "@/providers/NavigationDataProvider";
import {
  getTypeItems,
  getSpecialItems,
  getRegionItems,
  getPokedexItems,
} from "./Navbar.util";
import NavbarSection from "./NavbarSection";

import styles from "./Navbar.module.css";

interface NavbarProps {
  navigationData: NavigationData;
}

export default function Navbar({ navigationData }: NavbarProps) {
  const { types, pokedexes, regions } = navigationData;

  const typeItems = useMemo(() => getTypeItems(types), [types]);
  const specialItems = useMemo(() => getSpecialItems(), []);
  const regionItems = useMemo(() => getRegionItems(regions), [regions]);
  const pokedexItems = useMemo(() => getPokedexItems(pokedexes), [pokedexes]);

  return (
    <nav className={styles.navbar}>
      <NavbarSection title="Types" items={typeItems} />
      <NavbarSection title="Special" items={specialItems} />
      <NavbarSection title="Regions" items={regionItems} />
      <NavbarSection title="Pokedexes" items={pokedexItems} />
    </nav>
  );
}
