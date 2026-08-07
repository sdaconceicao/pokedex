import type { ReactNode } from "react";
import styles from "./HeroToolbar.module.css";

interface HeroToolbarProps {
  /** What the hero was titled — the region's or the Pokemon's name */
  title: string;
  /** Which end the title sits at. The aside takes the other. */
  titleSide?: "left" | "right";
  /** A small stand-in for the hero's artwork, beside the title */
  icon?: ReactNode;
  /** The group opposite the title: the hero's actions, or a fact or two off it */
  aside?: ReactNode;
  /** Carries the caller's palette class so --type-* cascades in */
  className?: string;
}

/**
 * The condensed form of a hero: it sticks to the top of whatever is scrolling
 * the page — the app shell's main, or a modal's body — and lands over the hero
 * as it leaves.
 *
 * Mounted only while it is wanted, so it leaves no duplicate buttons or names
 * behind it in the accessibility tree.
 */
export const HeroToolbar = ({
  title,
  titleSide = "right",
  icon,
  aside,
  className,
}: HeroToolbarProps) => {
  const identity = (
    <div className={styles.identity}>
      <span className={styles.title}>{title}</span>
      {icon}
    </div>
  );
  const asideGroup = <div className={styles.aside}>{aside}</div>;

  return (
    <div className={`${styles.slot} ${className || ""}`}>
      <div className={styles.bar}>
        {titleSide === "left" ? (
          <>
            {identity}
            {asideGroup}
          </>
        ) : (
          <>
            {asideGroup}
            {identity}
          </>
        )}
      </div>
    </div>
  );
};

export default HeroToolbar;
