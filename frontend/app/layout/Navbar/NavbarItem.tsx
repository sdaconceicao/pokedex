"use client";

import NextLink from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

import { Link } from "@/lib/lago";
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

  return (
    // lago's Link supplies the interaction/state contract (hover, focus-visible
    // and, via `aria-current` below, a `data-current` hook for styling) while
    // delegating the actual anchor to Next's own Link through `render`, so
    // clicks still get Next's client-side transition *and* prefetching — a
    // plain `href` on lago's Link would navigate through the app router too
    // (see LagoProvider's RouterProvider), but without Next's prefetch.
    <Link
      href={item.href}
      aria-current={isActive ? "page" : undefined}
      className={styles.navItem}
      render={(props) => (
        // lago types `render`'s props as anchor-or-span, because Link drops to
        // a <span> when it has no href. This one always has one, so the anchor
        // branch is the only reachable case and the narrowing is sound.
        <NextLink {...(props as ComponentPropsWithoutRef<"a">)} href={item.href}>
          {item.label} {item.icon}
        </NextLink>
      )}
    />
  );
}
