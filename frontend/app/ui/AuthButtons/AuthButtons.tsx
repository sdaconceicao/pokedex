"use client";

import { useCallback, useState } from "react";
import Button from "@/ui/Button";
import Modal from "@/ui/Modal";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import { useAuth } from "@/lib/auth";

import styles from "./AuthButtons.module.css";

export default function AuthButtons() {
  const {
    user,
    login,
    register,
    logout,
    isLoginLoading,
    isRegisterLoading,
    isLogoutLoading,
  } = useAuth();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  const handleSignUp = useCallback(() => {
    setIsRegisterModalOpen(true);
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

  const handleRegisterSubmit = useCallback(
    async (data: {
      firstName: string;
      lastName: string;
      username: string;
      email: string;
      password: string;
    }) => {
      try {
        register(data);
        setIsRegisterModalOpen(false);
      } catch (error) {
        console.error("Registration failed:", error);
        // Error handling is now managed by TanStack Query
      }
    },
    [register]
  );

  const handleLoginCancel = useCallback(() => {
    setIsLoginModalOpen(false);
  }, []);

  const handleRegisterCancel = useCallback(() => {
    setIsRegisterModalOpen(false);
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

      <Modal
        isOpen={isRegisterModalOpen}
        onClose={handleRegisterCancel}
        title="Create Account"
        size="lg"
      >
        <RegisterForm
          onSubmit={handleRegisterSubmit}
          onCancel={handleRegisterCancel}
          isLoading={isRegisterLoading}
        />
      </Modal>
    </>
  );
}
