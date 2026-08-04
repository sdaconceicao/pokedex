import type { ReactNode } from "react";
import styles from "./PokemonSection.module.css";

interface PokemonSectionProps {
  title: string;
  className?: string;
  children: ReactNode;
}

/** The titled card every section of the detail page sits in. `className`
 *  carries the Pokemon's type class so the --type-* palette cascades in. */
export const PokemonSection = ({ title, className, children }: PokemonSectionProps) => {
  return (
    <section className={`${styles.section} ${className || ""}`}>
      <h2 className={styles.sectionTitle}>{title}</h2>
      {children}
    </section>
  );
};
