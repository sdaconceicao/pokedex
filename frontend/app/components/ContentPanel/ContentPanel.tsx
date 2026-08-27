import clsx from "clsx";
import type { ReactNode } from "react";
import styles from "./ContentPanel.module.css";

interface ContentPanelProps {
  children: ReactNode;
  /** Page-owned layout: width, inner spacing, and `--content-panel-padding`. */
  className?: string;
}

export const ContentPanel: React.FunctionComponent<ContentPanelProps> = ({
  children,
  className,
}) => <div className={clsx(styles.panel, className)}>{children}</div>;

export default ContentPanel;
