"use client";

import { useCallback, useState } from "react";
import Button from "@/ui/Button";
import Modal from "@/ui/Modal";
import LoginForm from "./LoginForm";
import { loginUser } from "@/lib/api";
import styles from "./AuthButtons.module.css";

export default function AuthButtons() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSignUp = useCallback(() => {
    // TODO: Implement sign up functionality
    console.log("Sign up clicked");
  }, []);

  const handleLogin = useCallback(() => {
    setIsLoginModalOpen(true);
  }, []);

  const handleLoginSubmit = useCallback(
    async (email: string, password: string) => {
      setIsLoading(true);
      try {
        const response = await loginUser({ email, password });

        // Store the access token (you might want to use a more secure method)
        localStorage.setItem("access_token", response.access_token);

        console.log("Login successful", response);
        setIsLoginModalOpen(false);

        // TODO: Update app state to reflect logged-in user
        // You might want to trigger a context update or redirect
      } catch (error) {
        console.error("Login failed:", error);
        // TODO: Display error message to user
        alert(
          error instanceof Error
            ? error.message
            : "Login failed. Please try again."
        );
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const handleLoginCancel = useCallback(() => {
    setIsLoginModalOpen(false);
  }, []);

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
          isLoading={isLoading}
        />
      </Modal>
    </>
  );
}
