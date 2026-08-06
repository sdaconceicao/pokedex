import type { ReactNode } from "react";
import styles from "./HeroToolbar.module.css";

interface HeroToolbarProps {
  /** What the hero was titled — the region's or the Pokemon's name */
  title: string;
  /** The hero's actions, kept reachable while it is scrolled away */
  actions?: ReactNode;
  /** A small stand-in for the hero's artwork, where there is any */
  icon?: ReactNode;
  /** Carries the caller's palette class so --type-* cascades in */
  className?: string;
}

/**
 * The condensed form of a hero: it sticks to the top of whatever is scrolling
 * the page — the app shell's main, or a modal's body — once the hero itself has
 * gone. Actions stay on the left, the title and artwork move to the right.
 *
 * Mounted only while it is wanted, so it leaves no duplicate buttons or names
 * behind it in the accessibility tree.
 */
export const HeroToolbar = ({ title, actions, icon, className }: HeroToolbarProps) => (
  <div className={`${styles.slot} ${className || ""}`}>
    <div className={styles.bar}>
      <div className={styles.actions}>{actions}</div>
      <div className={styles.identity}>
        <span className={styles.title}>{title}</span>
        {icon}
      </div>
    </div>
  </div>
);

export default HeroToolbar;
