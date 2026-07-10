"use client";

import { useCallback, useState } from "react";
import Button from "@/components/Button";
import { Modal } from "@/components/Modal";
import { useAuth } from "@/hooks/useAuth";
import UserAvatar from "../Avatar/UserAvatar";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

export default function AuthButtons() {
  const {
    user,
    loginAsync,
    registerAsync,
    logout,
    isLoginLoading,
    isRegisterLoading,
    isLogoutLoading,
  } = useAuth();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"login" | "register">("login");

  const openSignIn = useCallback(() => {
    setModalMode("login");
    setIsModalOpen(true);
  }, []);

  const handleLoginSubmit = useCallback(
    async (email: string, password: string) => {
      await loginAsync({ email, password });
      setIsModalOpen(false);
    },
    [loginAsync],
  );

  const handleRegisterSubmit = useCallback(
    async (data: { email: string; password: string }) => {
      await registerAsync(data);
      setIsModalOpen(false);
    },
    [registerAsync],
  );

  const handleModalClose = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  if (user) {
    return <UserAvatar email={user.email} onLogout={logout} isLogoutLoading={isLogoutLoading} />;
  }

  return (
    <>
      <Button variant="primary" size="sm" onClick={openSignIn}>
        Sign In
      </Button>
      {isModalOpen && (
        <Modal
          isOpen
          onClose={handleModalClose}
          title={modalMode === "login" ? "Sign In" : "Create Account"}
          size={modalMode === "register" ? "lg" : "sm"}
        >
          {modalMode === "login" ? (
            <LoginForm
              key="login"
              onSubmit={handleLoginSubmit}
              onSwitchToRegister={() => setModalMode("register")}
              isLoading={isLoginLoading}
            />
          ) : (
            <RegisterForm
              key="register"
              onSubmit={handleRegisterSubmit}
              onSwitchToLogin={() => setModalMode("login")}
              isLoading={isRegisterLoading}
            />
          )}
        </Modal>
      )}
    </>
  );
}
