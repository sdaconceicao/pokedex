"use client";

import React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import styles from "./NavbarItem.module.css";

export interface NavItem {
  label: string;
  href: string;
  activeWhenQueryParamEquals?: {
    key: string;
    value: string;
  };
}

interface NavbarItemProps {
  item: NavItem;
}

export default function NavbarItem({ item }: NavbarItemProps) {
  const searchParams = useSearchParams();
  const isActive = item.activeWhenQueryParamEquals
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
      {item.label}
    </Link>
  );
}
