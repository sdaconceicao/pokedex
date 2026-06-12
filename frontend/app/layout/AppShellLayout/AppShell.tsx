"use client";

import { ChevronLeft, ChevronRight, Menu01, XClose } from "@untitled-ui/icons-react";
import { Suspense, useEffect, useState } from "react";
import AuthButtons from "@/components/AuthButtons";
import { SearchBar } from "@/components/Search";
import Navbar from "@/layout/Navbar";
import type { NavigationData } from "@/providers/NavigationDataProvider";
import styles from "./AppShell.module.css";

interface AppShellProps {
  children: React.ReactNode;
  navigationData: NavigationData;
}

const SIDEBAR_WIDTH = "17rem";
const MOBILE_BREAKPOINT = 768;

export default function AppShell({ children, navigationData }: AppShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // Track viewport; drawer starts closed on mobile, docked open on desktop
  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT}px)`);
    setIsMobile(mq.matches);
    if (mq.matches) setSidebarOpen(false);
    const onChange = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  // Close the mobile drawer on Escape
  useEffect(() => {
    if (!sidebarOpen || !isMobile) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSidebarOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [sidebarOpen, isMobile]);

  return (
    <div
      className={styles.container}
      style={
        {
          "--sidebar-width": sidebarOpen ? SIDEBAR_WIDTH : "0px",
        } as React.CSSProperties
      }
    >
      {/* ── App bar ────────────────────────────────── */}
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <button
            className={styles.hamburger}
            onClick={() => setSidebarOpen((v) => !v)}
            aria-label={sidebarOpen ? "Close menu" : "Open menu"}
            aria-expanded={sidebarOpen}
          >
            <Menu01 width={22} height={22} />
          </button>
          <span className={styles.logo}>
            <svg
              className={styles.logoMark}
              viewBox="0 0 100 100"
              width="24"
              height="24"
              aria-hidden="true"
            >
              <circle cx="50" cy="50" r="44" fill="#fff" stroke="currentColor" strokeWidth="10" />
              <path d="M6 50a44 44 0 0 1 88 0Z" fill="currentColor" />
              <path d="M6 50h88" stroke="currentColor" strokeWidth="10" />
              <circle cx="50" cy="50" r="15" fill="#fff" stroke="currentColor" strokeWidth="8" />
            </svg>
            Pokédex
          </span>
        </div>

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

      {/* ── Body: sidebar + main ───────────────────── */}
      <div className={styles.body}>
        {/* Mobile-only backdrop */}
        {sidebarOpen && isMobile && (
          <div
            className={styles.backdrop}
            onClick={() => setSidebarOpen(false)}
            aria-hidden="true"
          />
        )}

        <aside
          className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ""}`}
          aria-hidden={!sidebarOpen}
          inert={!sidebarOpen}
        >
          <div className={styles.sidebarInner}>
            <div className={styles.drawerHeader}>
              <span className={styles.drawerTitle}>Browse</span>
              <button
                className={styles.drawerClose}
                onClick={() => setSidebarOpen(false)}
                aria-label="Close menu"
              >
                <XClose width={18} height={18} />
              </button>
            </div>
            <Navbar navigationData={navigationData} />
          </div>
        </aside>

        {/* Desktop edge toggle — sits on the sidebar border */}
        <button
          className={styles.edgeToggle}
          onClick={() => setSidebarOpen((v) => !v)}
          aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
          aria-expanded={sidebarOpen}
        >
          {sidebarOpen ? (
            <ChevronLeft width={14} height={14} />
          ) : (
            <ChevronRight width={14} height={14} />
          )}
        </button>

        <main className={styles.main}>{children}</main>
      </div>
    </div>
  );
}
