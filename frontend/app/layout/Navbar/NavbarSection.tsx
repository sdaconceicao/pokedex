import { Button, Disclosure, DisclosurePanel } from "@code-x/lago";
import { ChevronDown } from "@untitled-ui/icons-react";
import type { ReactNode } from "react";
import styles from "./Navbar.module.css";
import NavbarItem, { type NavItem } from "./NavbarItem";

export interface NavGroup {
  title: string;
  items: NavItem[];
}

interface NavbarSectionProps {
  /** Identifies the section to the DisclosureGroup that owns which one is open */
  id: string;
  title: string;
  items?: NavItem[];
  /** Sub-headed bands of items, for a section too long to read flat. Given
   *  instead of `items`, not alongside it. */
  groups?: NavGroup[];
  icon?: ReactNode;
  /** Options per row — see `NavSection.columns` for why it is per section */
  columns?: 2;
}

export default function NavbarSection({
  id,
  title,
  items,
  groups,
  icon,
  columns,
}: NavbarSectionProps) {
  const sectionId = title.toLowerCase().replace(/\s+/g, "-");
  return (
    // The enclosing DisclosureGroup owns which section is expanded — one at a
    // time — so this passes an `id` and reads its own state back off the
    // `data-expanded` Disclosure stamps on its root, so the
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
    <Disclosure id={id} className={styles.section}>
      <Button slot="trigger" className={styles.sectionHeader}>
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
        {/* A sub-heading per band rather than another Disclosure, for the same
            reason NavbarGroup isn't one: a second chevron inside this one would
            give the same content two competing toggles. */}
        {groups
          ? groups.map((group) => {
              const groupId = `navbar-${sectionId}-${group.title.toLowerCase().replace(/\s+/g, "-")}`;

              return (
                <div key={group.title} className={styles.subGroup}>
                  <h3 id={groupId} className={styles.subGroupTitle}>
                    {group.title}
                  </h3>
                  <ul className={styles.list} data-columns={columns} aria-labelledby={groupId}>
                    {group.items.map((item) => (
                      <li key={item.href} className={styles.listItem}>
                        <NavbarItem item={item} />
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })
          : items && (
              <ul className={styles.list} data-columns={columns}>
                {items.map((item) => (
                  <li key={item.href} className={styles.listItem}>
                    <NavbarItem item={item} />
                  </li>
                ))}
              </ul>
            )}
      </DisclosurePanel>
    </Disclosure>
  );
}
