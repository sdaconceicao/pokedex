"use client";

import { useState } from "react";
import { ChevronDown } from "@untitled-ui/icons-react";
import styles from "./Navbar.module.css";
import NavbarItem, { NavItem } from "./NavbarItem";

interface NavbarSectionProps {
  title: string;
  items: NavItem[];
  defaultOpen?: boolean;
}

export default function NavbarSection({
  title,
  items,
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
          <span className={styles.sectionTitle}>{title}</span>
        </span>
        <ChevronDown
          className={`${styles.chevron} ${open ? styles.chevronOpen : ""}`}
        />
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
