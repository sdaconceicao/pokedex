import { ChevronDown } from "@untitled-ui/icons-react";
import type { ReactNode } from "react";

import { Button, Disclosure, DisclosurePanel } from "@/lib/lago";
import { withButtonClass } from "@/lib/lagoButton";
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
  return (
    // lago's Disclosure owns the expanded state itself (uncontrolled here via
    // `defaultExpanded`, since nothing outside this section needs to know
    // whether it's open) and stamps `data-expanded` on its own root, so the
    // chevron rotation in Navbar.module.css is a plain attribute selector
    // instead of the old `open ? styles.chevronOpen : ""` ternary. It also
    // gets the collapse/expand animation for free (`--disclosure-panel-height`
    // in lago's CSS) in place of the previous instant mount/unmount.
    //
    // The header keeps its own bespoke markup — a leading icon, the title,
    // then a chevron flush right — via a plain Button dropped onto the
    // `trigger` slot Disclosure exposes through context (aria-expanded,
    // aria-controls and the toggle handler all arrive that way, no props
    // needed here), rather than lago's canned DisclosureHeader: that renders
    // its chevron *before* the label with no leading-icon slot, a different
    // layout than this sidebar uses.
    <Disclosure defaultExpanded={defaultOpen} className={styles.section}>
      <Button slot="trigger" render={withButtonClass(styles.sectionHeader)}>
        <span className={styles.sectionHeaderLeft}>
          {icon && (
            <span className={styles.sectionIcon} aria-hidden="true">
              {icon}
            </span>
          )}
          <span className={styles.sectionTitle}>{title}</span>
        </span>
        <ChevronDown className={styles.chevron} aria-hidden="true" />
      </Button>
      <DisclosurePanel>
        <ul className={styles.list}>
          {items.map((item) => (
            <li key={item.href} className={styles.listItem}>
              <NavbarItem item={item} />
            </li>
          ))}
        </ul>
      </DisclosurePanel>
    </Disclosure>
  );
}
