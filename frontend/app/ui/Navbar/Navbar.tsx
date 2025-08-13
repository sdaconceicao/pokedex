import { GET_TYPES, GET_POKEDEXES } from "../../lib/queries";
import { client } from "../../lib/apollo-client";
import type { TypesData, PokedexesData } from "../../lib/types";
import NavbarSection from "./NavbarSection";
import { NavItem } from "./NavbarItem";
import styles from "./Navbar.module.css";

async function getTypes(): Promise<string[]> {
  try {
    const { data } = await client.query<TypesData>({ query: GET_TYPES });
    return data.types || [];
  } catch (error) {
    console.error("Error fetching types:", error);
    return [];
  }
}

async function getPokedexes(): Promise<string[]> {
  try {
    const { data } = await client.query<PokedexesData>({
      query: GET_POKEDEXES,
    });
    return data.pokedexes || [];
  } catch (error) {
    console.error("Error fetching pokedexes:", error);
    return [];
  }
}

export default async function Navbar() {
  const [types, pokedexes] = await Promise.all([getTypes(), getPokedexes()]);

  const typeItems: NavItem[] = types.map((type) => ({
    label: type.charAt(0).toUpperCase() + type.slice(1),
    href: `/?type=${encodeURIComponent(type)}`,
    activeWhenQueryParamEquals: { key: "type", value: type },
  }));

  const pokedexItems: NavItem[] = pokedexes.map((pokedex) => ({
    label:
      pokedex.charAt(0).toUpperCase() + pokedex.slice(1).replace(/-/g, " "),
    href: `/?pokedex=${encodeURIComponent(pokedex)}`,
    activeWhenQueryParamEquals: { key: "pokedex", value: pokedex },
  }));

  return (
    <nav className={styles.navbar}>
      <NavbarSection title="Types" items={typeItems} />
      <NavbarSection title="Pokedexes" items={pokedexItems} />
    </nav>
  );
}
