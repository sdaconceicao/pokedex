import { useMemo } from "react";
import type { NavigationData } from "@/providers/NavigationDataProvider";
import styles from "./Navbar.module.css";
import { getPokedexItems, getRegionItems, getSpecialItems, getTypeItems } from "./Navbar.util";
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

  return (
    <nav className={styles.navbar}>
      <NavbarSection title="Types" items={typeItems} />
      <NavbarSection title="Special" items={specialItems} />
      <NavbarSection title="Regions" items={regionItems} />
      <NavbarSection title="Pokedexes" items={pokedexItems} />
    </nav>
  );
}
