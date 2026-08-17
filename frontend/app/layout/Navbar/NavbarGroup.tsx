import type { ReactNode } from "react";
import styles from "./Navbar.module.css";

interface NavbarGroupProps {
  title: string;
  children: ReactNode;
}

/**
 * A titled band of the sidebar — "Search" over the filter form, "Browse" over
 * the link sections.
 *
 * Deliberately a plain labelled section rather than another `Disclosure`: the
 * sections inside Browse already collapse, and nesting a second chevron over
 * the same content would give one body two competing toggles. It also keeps
 * `NAV_SECTIONS` untouched, which the collapsed icon rail maps over.
 */
export default function NavbarGroup({ title, children }: NavbarGroupProps) {
  const headingId = `navbar-group-${title.toLowerCase().replace(/\s+/g, "-")}`;

  return (
    <section className={styles.group} aria-labelledby={headingId}>
      <h2 id={headingId} className={styles.groupTitle}>
        {title}
      </h2>
      {children}
    </section>
  );
}
