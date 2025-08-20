"use client";

import { useCallback, useState } from "react";
import Button from "@/ui/Button";
import Modal from "@/ui/Modal";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import { useAuth } from "@/hooks/useAuth";

import styles from "./AuthButtons.module.css";

export default function AuthButtons() {
  const {
    user,
    loginAsync,
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
        // Use loginAsync to get a promise we can await
        const result = await loginAsync({ email, password });
      } catch (error) {
        console.error("Login failed:", error);
        // Don't close the modal on error - let the form handle it
        throw error; // Re-throw so the form can handle the error
      }
    },
    [loginAsync]
  );

  const handleRegisterSubmit = useCallback(
    async (data: { email: string; password: string }) => {
      try {
        register(data);
        setIsRegisterModalOpen(false);
      } catch (error) {
        console.error("Registration failed:", error);
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
      {isLoginModalOpen && (
        <Modal
          isOpen={true}
          onClose={handleLoginCancel}
          title="Login"
          size="sm"
        >
          <LoginForm
            key={isLoginModalOpen ? "open" : "closed"}
            onSubmit={handleLoginSubmit}
            onCancel={handleLoginCancel}
            isLoading={isLoginLoading}
          />
        </Modal>
      )}
      {isRegisterModalOpen && (
        <Modal
          isOpen={true}
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
      )}
    </>
  );
}
