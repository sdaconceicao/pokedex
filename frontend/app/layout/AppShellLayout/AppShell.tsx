"use client";

import { ChevronLeft, ChevronRight, Menu01 } from "@untitled-ui/icons-react";
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

const SIDEBAR_WIDTH = "16rem";

export default function AppShell({ children, navigationData }: AppShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    if (window.innerWidth <= 768) {
      setSidebarOpen(false);
    }
  }, []);

  return (
    <div
      className={styles.container}
      style={
        {
          "--sidebar-width": sidebarOpen ? SIDEBAR_WIDTH : "0px",
        } as React.CSSProperties
      }
    >
      {/* ── Main header: logo + auth ───────────────── */}
      <header className={styles.header}>
        <span className={styles.logo}>
          <svg
            className={styles.logoMark}
            viewBox="0 0 100 100"
            width="22"
            height="22"
            aria-hidden="true"
          >
            <circle cx="50" cy="50" r="44" fill="#fff" stroke="currentColor" strokeWidth="10" />
            <path d="M6 50a44 44 0 0 1 88 0Z" fill="currentColor" />
            <path d="M6 50h88" stroke="currentColor" strokeWidth="10" />
            <circle cx="50" cy="50" r="15" fill="#fff" stroke="currentColor" strokeWidth="8" />
          </svg>
          Pokédex
        </span>
        <div className={styles.headerRight}>
          <Suspense fallback={null}>
            <AuthButtons />
          </Suspense>
        </div>
      </header>

      {/* ── Subheader: hamburger (mobile) + search ─── */}
      <div className={styles.subheader}>
        <button
          className={styles.mobileHamburger}
          onClick={() => setSidebarOpen((v) => !v)}
          aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
          aria-expanded={sidebarOpen}
        >
          <Menu01 width={20} height={20} />
        </button>
        <Suspense fallback={null}>
          <SearchBar />
        </Suspense>
      </div>

      {/* ── Body: sidebar + edge toggle + main ─────── */}
      <div className={styles.body}>
        {/* Mobile backdrop */}
        {sidebarOpen && (
          <div
            className={styles.backdrop}
            onClick={() => setSidebarOpen(false)}
            aria-hidden="true"
          />
        )}

        <aside
          className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : styles.sidebarClosed}`}
        >
          <Navbar navigationData={navigationData} />
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
