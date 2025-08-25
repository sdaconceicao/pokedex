import { GET_TYPES, GET_POKEDEXES, GET_REGIONS } from "@/lib/queries";
import { client } from "@/lib/apollo-client";
import { PokemonType, PokemonRegion } from "@/lib/types";
import NavbarSection from "./NavbarSection";
import { NavItem } from "./NavbarItem";

import styles from "./Navbar.module.css";

async function getTypes(): Promise<PokemonType[]> {
  try {
    const { data } = await client.query<{ types: PokemonType[] }>({
      query: GET_TYPES,
    });
    return data.types.filter((type) => type.count > 0) || [];
  } catch (error) {
    console.error("Error fetching types:", error);
    return [];
  }
}

async function getPokedexes(): Promise<string[]> {
  try {
    const { data } = await client.query<{ pokedexes: string[] }>({
      query: GET_POKEDEXES,
    });
    return data.pokedexes || [];
  } catch (error) {
    console.error("Error fetching pokedexes:", error);
    return [];
  }
}

async function getRegions(): Promise<PokemonRegion[]> {
  try {
    const { data } = await client.query<{ regions: PokemonRegion[] }>({
      query: GET_REGIONS,
    });
    return data.regions.filter((region) => region.count > 0) || [];
  } catch (error) {
    console.error("Error fetching regions:", error);
    return [];
  }
}

export default async function Navbar() {
  const [types, pokedexes, regions] = await Promise.all([
    getTypes(),
    getPokedexes(),
    getRegions(),
  ]);

  const typeItems: NavItem[] = types.map((type) => ({
    label: `${type.name.charAt(0).toUpperCase()}${type.name.slice(1)} (${type.count})`,
    href: `/?type=${encodeURIComponent(type.name)}`,
    activeWhenQueryParamEquals: { key: "type", value: type.name },
  }));

  const pokedexItems: NavItem[] = pokedexes.map((pokedex) => ({
    label:
      pokedex.charAt(0).toUpperCase() + pokedex.slice(1).replace(/-/g, " "),
    href: `/?pokedex=${encodeURIComponent(pokedex)}`,
    activeWhenQueryParamEquals: { key: "pokedex", value: pokedex },
  }));

  const regionItems: NavItem[] = regions.map((region) => ({
    label: `${region.name.charAt(0).toUpperCase()}${region.name.slice(1)} (${region.count})`,
    href: `/?region=${encodeURIComponent(region.name)}`,
    activeWhenQueryParamEquals: { key: "region", value: region.name },
  }));

  const specialItems: NavItem[] = [
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

  return (
    <nav className={styles.navbar}>
      <NavbarSection title="Types" items={typeItems} />
      <NavbarSection title="Special" items={specialItems} />
      <NavbarSection title="Regions" items={regionItems} />
      <NavbarSection title="Pokedexes" items={pokedexItems} />
    </nav>
  );
}
