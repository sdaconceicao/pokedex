"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import type { ReactNode } from "react";

import styles from "./NavbarItem.module.css";

export interface NavItem {
  label: string;
  href: string;
  activeWhenQueryParamEquals?: {
    key: string;
    value: string;
  };
  /** For items that navigate to a page of their own rather than filtering the
   *  results on the home page */
  activeWhenPathnameEquals?: string;
  icon?: ReactNode;
}

interface NavbarItemProps {
  item: NavItem;
}

export default function NavbarItem({ item }: NavbarItemProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const isActive = item.activeWhenPathnameEquals
    ? pathname === item.activeWhenPathnameEquals
    : item.activeWhenQueryParamEquals
      ? searchParams.get(item.activeWhenQueryParamEquals.key) ===
        item.activeWhenQueryParamEquals.value
      : false;

  // Clear search parameter when navigating to type links
  const handleTypeClick = () => {
    // The href will navigate to the type, clearing search
    // This is handled by the router navigation
  };

  return (
    <Link
      href={item.href}
      className={`${styles.navItem} ${isActive ? styles.active : ""}`}
      onClick={handleTypeClick}
    >
      {item.label} {item.icon}
    </Link>
  );
}
