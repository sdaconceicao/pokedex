"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import styles from "./TypesSidebar.module.css";

interface TypesSidebarClientProps {
  types: string[];
}

export default function TypesSidebarClient({ types }: TypesSidebarClientProps) {
  const searchParams = useSearchParams();
  const currentType = searchParams.get("type");

  return (
    <div className={styles.sidebar}>
      <h2 className={styles.heading}>Pokemon Types</h2>
      <ul className={styles.list}>
        {types.map((type: string) => (
          <li key={type} className={styles.listItem}>
            <Link
              href={`/?type=${encodeURIComponent(type)}`}
              className={`${styles.link} ${
                currentType === type ? styles.active : ""
              }`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
