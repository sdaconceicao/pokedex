import { GET_TYPES } from "../../lib/queries";
import { client } from "../../lib/apollo-client";
import type { TypesData } from "../../lib/types";
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

export default async function Navbar() {
  const types = await getTypes();

  const typeItems: NavItem[] = types.map((type) => ({
    label: type.charAt(0).toUpperCase() + type.slice(1),
    href: `/?type=${encodeURIComponent(type)}`,
    activeWhenQueryParamEquals: { key: "type", value: type },
  }));

  return (
    <nav className={styles.navbar}>
      <NavbarSection title="Types" items={typeItems} />
    </nav>
  );
}
