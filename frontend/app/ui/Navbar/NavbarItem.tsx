"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import styles from "./Navbar.module.css";

interface NavbarItemProps {
  label: string;
  href: string;
  activeWhenQueryParamEquals?: { key: string; value: string };
}

export default function NavbarItem({
  label,
  href,
  activeWhenQueryParamEquals,
}: NavbarItemProps) {
  const searchParams = useSearchParams();
  const isActive = activeWhenQueryParamEquals
    ? searchParams.get(activeWhenQueryParamEquals.key) ===
      activeWhenQueryParamEquals.value
    : false;

  return (
    <li className={styles.listItem}>
      <Link
        href={href}
        className={`${styles.link} ${isActive ? styles.active : ""}`}
      >
        {label}
      </Link>
    </li>
  );
}
