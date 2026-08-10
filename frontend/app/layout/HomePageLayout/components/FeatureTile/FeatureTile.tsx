import type { ReactNode } from "react";
import { Heading } from "@/lib/lago";
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
        <Heading level={3} className={styles.featureTitle}>
          {title}
        </Heading>
      </div>
      <p className={styles.featureBody}>{body}</p>
    </li>
  );
};

export default FeatureTile;
