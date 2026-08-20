"use client";

import GroupDetail from "./components/GroupDetail";
import styles from "./page.module.css";

export default function Page() {
  return (
    <div className={styles.container}>
      <GroupDetail />
    </div>
  );
}
