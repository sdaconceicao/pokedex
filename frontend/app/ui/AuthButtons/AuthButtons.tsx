"use client";

import { useCallback, useState } from "react";
import Button from "@/ui/Button";
import Modal from "@/ui/Modal";
import LoginForm from "./LoginForm";
import { useAuth } from "@/lib/auth";

import styles from "./AuthButtons.module.css";

export default function AuthButtons() {
  const { user, login, logout, isLoginLoading, isLogoutLoading } = useAuth();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const handleSignUp = useCallback(() => {
    // TODO: Implement sign up functionality
    console.log("Sign up clicked");
  }, []);

  const handleLogin = useCallback(() => {
    setIsLoginModalOpen(true);
  }, []);

  const handleLoginSubmit = useCallback(
    async (email: string, password: string) => {
      try {
        login({ email, password });
        setIsLoginModalOpen(false);
      } catch (error) {
        console.error("Login failed:", error);
        // Error handling is now managed by TanStack Query
      }
    },
    [login]
  );

  const handleLoginCancel = useCallback(() => {
    setIsLoginModalOpen(false);
  }, []);

  const handleLogout = useCallback(() => {
    logout();
  }, [logout]);

  if (user) {
    return (
      <div className={styles.authContainer}>
        <span>Welcome, {user.email}</span>
        <Button
          variant="outline"
          onClick={handleLogout}
          disabled={isLogoutLoading}
        >
          {isLogoutLoading ? "Logging out..." : "Logout"}
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className={styles.authContainer}>
        <Button variant="outline" onClick={handleLogin}>
          Login
        </Button>
        <Button variant="primary" onClick={handleSignUp}>
          Sign Up
        </Button>
      </div>

      <Modal
        isOpen={isLoginModalOpen}
        onClose={handleLoginCancel}
        title="Login"
        size="sm"
      >
        <LoginForm
          onSubmit={handleLoginSubmit}
          onCancel={handleLoginCancel}
          isLoading={isLoginLoading}
        />
      </Modal>
    </>
  );
}
