import type { ReactNode } from "react";
import styles from "./FeatureTile.module.css";

export type FeatureTileAccent = "red" | "blue" | "purple" | "green";

interface FeatureTileProps {
  icon: ReactNode;
  accent: FeatureTileAccent;
  title: string;
  body: string;
}

export const FeatureTile: React.FunctionComponent<FeatureTileProps> = ({
  icon,
  accent,
  title,
  body,
}) => {
  return (
    <li className={styles.featureCard}>
      <div className={styles.featureHeader}>
        <span className={`${styles.featureIcon} ${styles[accent]}`}>{icon}</span>
        <h3 className={styles.featureTitle}>{title}</h3>
      </div>
      <p className={styles.featureBody}>{body}</p>
    </li>
  );
};

export default FeatureTile;
