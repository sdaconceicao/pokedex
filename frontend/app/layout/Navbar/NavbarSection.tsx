"use client";

import { ChevronDown } from "@untitled-ui/icons-react";
import { type ReactNode, useState } from "react";
import styles from "./Navbar.module.css";
import NavbarItem, { type NavItem } from "./NavbarItem";

interface NavbarSectionProps {
  title: string;
  items: NavItem[];
  icon?: ReactNode;
  defaultOpen?: boolean;
}

export default function NavbarSection({
  title,
  items,
  icon,
  defaultOpen = true,
}: NavbarSectionProps) {
  const [open, setOpen] = useState<boolean>(defaultOpen);

  return (
    <section className={styles.section}>
      <button
        type="button"
        className={styles.sectionHeader}
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={`section-${title}`}
      >
        <span className={styles.sectionHeaderLeft}>
          {icon && (
            <span className={styles.sectionIcon} aria-hidden="true">
              {icon}
            </span>
          )}
          <span className={styles.sectionTitle}>{title}</span>
        </span>
        <ChevronDown className={`${styles.chevron} ${open ? styles.chevronOpen : ""}`} />
      </button>
      {open && (
        <ul id={`section-${title}`} className={styles.list}>
          {items.map((item) => (
            <li key={item.href} className={styles.listItem}>
              <NavbarItem item={item} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
