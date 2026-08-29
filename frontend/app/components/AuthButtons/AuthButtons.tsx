"use client";

import { Button } from "@code-x/lago";
import { useAuth } from "@/hooks/useAuth";
import { useAvatar } from "@/hooks/useAvatar";
import { useAuthModal } from "@/providers/AuthModalProvider";
import UserAvatar from "../Avatar/UserAvatar";

export default function AuthButtons() {
  const { user, logout, isLogoutLoading } = useAuth();
  // Runs app-wide, since the header shows the avatar on every page. One cached
  // request per session; the profile fetch stays small either way.
  const { avatarSrc } = useAvatar();
  const { openSignIn } = useAuthModal();

  if (user) {
    return (
      <UserAvatar
        email={user.email}
        avatarSrc={avatarSrc}
        onLogout={logout}
        isLogoutLoading={isLogoutLoading}
      />
    );
  }

  return (
    <Button variant="primary" size="sm" onPress={openSignIn}>
      Sign In
    </Button>
  );
}
