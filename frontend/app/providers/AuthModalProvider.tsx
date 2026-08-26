"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import ForgotPasswordForm from "@/components/AuthButtons/ForgotPasswordForm";
import LoginForm from "@/components/AuthButtons/LoginForm";
import RegisterForm from "@/components/AuthButtons/RegisterForm";
import { Modal } from "@/components/Modal";
import { useAuth } from "@/hooks/useAuth";
import { notify } from "@/lib/toast";

interface AuthModalContextValue {
  openSignIn: () => void;
  openSignUp: () => void;
  isAuthModalOpen: boolean;
}

const AuthModalContext = createContext<AuthModalContextValue | null>(null);

export function useAuthModal(): AuthModalContextValue {
  const context = useContext(AuthModalContext);
  if (!context) {
    throw new Error("useAuthModal must be used within an AuthModalProvider");
  }
  return context;
}

const MODAL_TITLES = {
  login: "Sign In",
  register: "Create Account",
  forgot: "Reset Password",
} as const;

export default function AuthModalProvider({ children }: { children: React.ReactNode }) {
  const {
    loginAsync,
    registerAsync,
    requestPasswordResetAsync,
    isLoginLoading,
    isRegisterLoading,
    isRequestPasswordResetLoading,
  } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<"login" | "register" | "forgot">("login");

  const openSignIn = useCallback(() => {
    setMode("login");
    setIsOpen(true);
  }, []);

  const openSignUp = useCallback(() => {
    setMode("register");
    setIsOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  const handleLoginSubmit = useCallback(
    async (email: string, password: string) => {
      try {
        await loginAsync({ email, password });
        setIsOpen(false);
        notify({ title: "Signed in", variant: "success" });
      } catch {
        // Generic on purpose: the API refuses unverified accounts and bad
        // passwords with the same message, and so must we.
        notify({
          title: "Could not sign in",
          description: "Check your email and password, then try again.",
          variant: "error",
        });
      }
    },
    [loginAsync],
  );

  const handleRegisterSubmit = useCallback(
    async (data: { email: string; password: string }) => {
      try {
        const result = await registerAsync(data);
        setIsOpen(false);
        // The API's own wording, identical for new, unverified and already
        // registered addresses, which is the whole point.
        notify({ title: result.message, variant: "success" });
      } catch {
        notify({
          title: "Could not create your account",
          description: "Please try again.",
          variant: "error",
        });
      }
    },
    [registerAsync],
  );

  const handleForgotSubmit = useCallback(
    async (email: string) => {
      try {
        const result = await requestPasswordResetAsync(email);
        setIsOpen(false);
        notify({ title: result.message, variant: "success" });
      } catch {
        notify({
          title: "Could not send the reset link",
          description: "Please try again.",
          variant: "error",
        });
      }
    },
    [requestPasswordResetAsync],
  );

  const value = useMemo(
    () => ({ openSignIn, openSignUp, isAuthModalOpen: isOpen }),
    [openSignIn, openSignUp, isOpen],
  );

  return (
    <AuthModalContext.Provider value={value}>
      {children}
      {isOpen && (
        <Modal
          isOpen
          onClose={handleClose}
          title={MODAL_TITLES[mode]}
          size={mode === "register" ? "lg" : "sm"}
        >
          {mode === "forgot" ? (
            <ForgotPasswordForm
              key="forgot"
              onSubmit={handleForgotSubmit}
              onSwitchToLogin={() => setMode("login")}
              isLoading={isRequestPasswordResetLoading}
            />
          ) : mode === "login" ? (
            <LoginForm
              key="login"
              onSubmit={handleLoginSubmit}
              onSwitchToRegister={() => setMode("register")}
              onForgotPassword={() => setMode("forgot")}
              isLoading={isLoginLoading}
            />
          ) : (
            <RegisterForm
              key="register"
              onSubmit={handleRegisterSubmit}
              onSwitchToLogin={() => setMode("login")}
              isLoading={isRegisterLoading}
            />
          )}
        </Modal>
      )}
    </AuthModalContext.Provider>
  );
}
