"use client";

import { ChevronLeft, ChevronRight, Menu01, XClose } from "@untitled-ui/icons-react";
import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import AuthButtons from "@/components/AuthButtons";
import Logo from "@/components/Logo";
import Pokeball from "@/components/Pokeball";
import { SearchBar } from "@/components/Search";
import Navbar, { NAV_SECTIONS } from "@/layout/Navbar";
import type { NavigationData } from "@/providers/NavigationDataProvider";
import styles from "./AppShell.module.css";

interface AppShellProps {
  children: React.ReactNode;
  navigationData: NavigationData;
}

const MOBILE_BREAKPOINT = 768;

export default function AppShell({ children, navigationData }: AppShellProps) {
  // Two separate things, deliberately not one boolean: how wide the docked
  // sidebar is on desktop, and whether the overlay drawer is showing on
  // mobile. Both default to what the server can safely render — expanded on
  // desktop, closed on mobile — so nothing flips after hydration.
  const [collapsed, setCollapsed] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Track the viewport so the toggle knows which of the two it drives
  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT}px)`);
    setIsMobile(mq.matches);
    const onChange = (e: MediaQueryListEvent) => {
      setIsMobile(e.matches);
      // Growing past the breakpoint shouldn't strand the drawer open
      if (!e.matches) setDrawerOpen(false);
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  // Close the mobile drawer on Escape
  useEffect(() => {
    if (!drawerOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setDrawerOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [drawerOpen]);

  const expanded = isMobile ? drawerOpen : !collapsed;
  const toggle = () => (isMobile ? setDrawerOpen((v) => !v) : setCollapsed((v) => !v));

  return (
    <div className={styles.container}>
      {/* Mobile-only backdrop — the class is display:none above the breakpoint */}
      {drawerOpen && (
        <div className={styles.backdrop} onClick={() => setDrawerOpen(false)} aria-hidden="true" />
      )}

      {/* ── Sidebar: full height, carries the brand ─── */}
      <aside
        id="app-sidebar"
        className={`${styles.sidebar} ${collapsed ? styles.sidebarCollapsed : ""} ${
          drawerOpen ? styles.drawerOpen : ""
        }`}
        inert={isMobile && !drawerOpen}
      >
        <div className={styles.brand}>
          <Link href="/" className={styles.brandLink} aria-label="Poképendium home">
            <Logo className={styles.brandLogo} />
            <Pokeball size={28} className={styles.brandMark} />
          </Link>
          <span className={styles.drawerTitle}>Browse</span>
          {/* The drawer covers the header toggle while open, so it needs its
              own dismiss. Hidden on desktop, where the toggle stays reachable. */}
          <button
            className={styles.drawerClose}
            onClick={() => setDrawerOpen(false)}
            aria-label="Close menu"
            type="button"
          >
            <XClose width={18} height={18} />
          </button>
        </div>

        <div className={styles.sidebarBody}>
          <div className={styles.sidebarNav}>
            <Suspense fallback={null}>
              <Navbar navigationData={navigationData} />
            </Suspense>
          </div>

          {/* Collapsed rail — icons stand in for the sections */}
          <div className={styles.rail}>
            {NAV_SECTIONS.map(({ key, title, icon }) => (
              <button
                key={key}
                className={styles.railButton}
                onClick={() => setCollapsed(false)}
                aria-label={`Expand sidebar to browse ${title}`}
                title={title}
                type="button"
              >
                {icon}
              </button>
            ))}
          </div>
        </div>
      </aside>

      {/* ── Content column: header + page ───────────── */}
      <div className={styles.contentColumn}>
        <header className={styles.header}>
          {/* The one place the sidebar is opened and closed, at every size.
              Both icons render and CSS picks one, so neither the glyph nor the
              position depends on JS resolving the viewport first. */}
          <button
            className={styles.sidebarToggle}
            onClick={toggle}
            aria-label={expanded ? "Hide navigation" : "Show navigation"}
            aria-expanded={expanded}
            aria-controls="app-sidebar"
            type="button"
          >
            <Menu01 className={styles.toggleIconMobile} width={18} height={18} />
            {collapsed ? (
              <ChevronRight className={styles.toggleIconDesktop} width={14} height={14} />
            ) : (
              <ChevronLeft className={styles.toggleIconDesktop} width={14} height={14} />
            )}
          </button>

          {/* Mobile only — on desktop the brand lives in the sidebar */}
          <Link href="/" className={styles.headerLogo} aria-label="Poképendium home">
            <Logo />
          </Link>

          <div className={styles.headerSearch}>
            <Suspense fallback={null}>
              <SearchBar />
            </Suspense>
          </div>

          <div className={styles.headerRight}>
            <Suspense fallback={null}>
              <AuthButtons />
            </Suspense>
          </div>
        </header>

        <main className={styles.main}>{children}</main>
      </div>
    </div>
  );
}
