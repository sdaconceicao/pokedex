"use client";

import { Avatar, Button, Heading, Menu, MenuItem, MenuSection, MenuTrigger } from "@code-x/lago";
import styles from "./UserAvatar.module.css";

interface UserAvatarProps {
  email: string;
  onLogout: () => void;
  isLogoutLoading?: boolean;
}

const LOGOUT_KEY = "logout";

// `Avatar`'s initials fallback already splits an email on "._-" the same way
// the old hand-rolled `getInitials` did (see its "Initials" story), so there's
// nothing left for a local helper to do.
export default function UserAvatar({ email, onLogout, isLogoutLoading = false }: UserAvatarProps) {
  return (
    <MenuTrigger>
      {/* react-aria wires aria-haspopup/aria-expanded onto this trigger itself,
          so the aria-label is the only accessibility prop left to supply. */}
      <Button aria-label="Account menu" variant="quiet" className={styles.trigger}>
        <Avatar name={email} className={styles.avatar} />
      </Button>
      <Menu
        onAction={(key) => {
          if (key === LOGOUT_KEY) onLogout();
        }}
        disabledKeys={isLogoutLoading ? [LOGOUT_KEY] : []}
      >
        <MenuSection>
          <Heading>{email}</Heading>
          <MenuItem id={LOGOUT_KEY}>{isLogoutLoading ? "Logging out…" : "Log out"}</MenuItem>
        </MenuSection>
      </Menu>
    </MenuTrigger>
  );
}
