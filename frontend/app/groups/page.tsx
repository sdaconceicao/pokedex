"use client";

import GroupSettings from "./components/GroupSettings";
import styles from "./page.module.css";

export default function Page() {
  return (
    <div className={styles.container}>
      <GroupSettings />
    </div>
  );
}
