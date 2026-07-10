"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./UserAvatar.module.css";

interface UserAvatarProps {
  email: string;
  onLogout: () => void;
  isLogoutLoading?: boolean;
}

function getInitials(email: string): string {
  const prefix = email.split("@")[0];
  const parts = prefix.split(/[._-]/).filter(Boolean);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return parts[0].slice(0, 2).toUpperCase();
}

export default function UserAvatar({ email, onLogout, isLogoutLoading = false }: UserAvatarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [isOpen]);

  return (
    <div className={styles.wrapper} ref={wrapperRef}>
      <button
        type="button"
        className={styles.avatar}
        onClick={() => setIsOpen((v) => !v)}
        aria-label="Account menu"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <span className={styles.initials}>{getInitials(email)}</span>
      </button>
      {isOpen && (
        <div className={styles.dropdown} role="menu">
          <span className={styles.email}>{email}</span>
          <hr className={styles.divider} />
          <button
            type="button"
            className={styles.logoutItem}
            role="menuitem"
            onClick={() => {
              onLogout();
              setIsOpen(false);
            }}
            disabled={isLogoutLoading}
          >
            {isLogoutLoading ? "Logging out…" : "Log out"}
          </button>
        </div>
      )}
    </div>
  );
}
