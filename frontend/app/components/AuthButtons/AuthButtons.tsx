"use client";

import Button from "@/components/Button";
import { useAuth } from "@/hooks/useAuth";
import { useAuthModal } from "@/providers/AuthModalProvider";
import UserAvatar from "../Avatar/UserAvatar";

export default function AuthButtons() {
  const { user, logout, isLogoutLoading } = useAuth();
  const { openSignIn } = useAuthModal();

  if (user) {
    return <UserAvatar email={user.email} onLogout={logout} isLogoutLoading={isLogoutLoading} />;
  }

  return (
    <Button variant="primary" size="sm" onClick={openSignIn}>
      Sign In
    </Button>
  );
}
