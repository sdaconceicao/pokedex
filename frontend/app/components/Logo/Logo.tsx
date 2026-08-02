import type { FunctionComponent } from "react";
import Pokeball from "@/components/Pokeball";
import styles from "./Logo.module.css";

interface LogoProps {
  className?: string;
}

export const Logo: FunctionComponent<LogoProps> = ({ className }) => {
  return (
    <span className={`${styles.logo} ${className || ""}`}>
      <Pokeball className={styles.logoMark} />
      Poképendium
    </span>
  );
};

export default Logo;
