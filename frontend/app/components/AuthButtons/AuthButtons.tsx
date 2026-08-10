"use client";

import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/lib/lago";
import { useAuthModal } from "@/providers/AuthModalProvider";
import UserAvatar from "../Avatar/UserAvatar";

export default function AuthButtons() {
  const { user, logout, isLogoutLoading } = useAuth();
  const { openSignIn } = useAuthModal();

  if (user) {
    return <UserAvatar email={user.email} onLogout={logout} isLogoutLoading={isLogoutLoading} />;
  }

  return (
    <Button variant="primary" size="sm" onPress={openSignIn}>
      Sign In
    </Button>
  );
}
