import React from "react";
import styles from "./layout.module.css";

export default function Loading() {
  return (
    <div className={styles.centerText}>
      <p>Loading Pokemon...</p>
    </div>
  );
}
