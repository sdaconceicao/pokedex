"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import ForgotPasswordForm from "@/components/AuthButtons/ForgotPasswordForm";
import LoginForm from "@/components/AuthButtons/LoginForm";
import RegisterForm from "@/components/AuthButtons/RegisterForm";
import { Modal } from "@/components/Modal";
import { useAuth } from "@/hooks/useAuth";

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
  verify: "Resend Verification",
} as const;

export default function AuthModalProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const {
    loginAsync,
    registerAsync,
    requestPasswordResetAsync,
    resendEmailVerificationAsync,
    isLoginLoading,
    isRegisterLoading,
    isRequestPasswordResetLoading,
    isResendEmailVerificationLoading,
  } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<"login" | "register" | "forgot" | "verify">(
    "login"
  );

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
      await loginAsync({ email, password });
      setIsOpen(false);
    },
    [loginAsync]
  );

  const handleRegisterSubmit = useCallback(
    async (data: { email: string; password: string }) => {
      return registerAsync(data);
    },
    [registerAsync]
  );

  const value = useMemo(
    () => ({ openSignIn, openSignUp, isAuthModalOpen: isOpen }),
    [openSignIn, openSignUp, isOpen]
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
          {mode === "verify" ? (
            <ForgotPasswordForm
              key="verify"
              onSubmit={resendEmailVerificationAsync}
              onSwitchToLogin={() => setMode("login")}
              isLoading={isResendEmailVerificationLoading}
              submitLabel="Resend verification link"
              pendingLabel="Sending…"
            />
          ) : mode === "forgot" ? (
            <ForgotPasswordForm
              key="forgot"
              onSubmit={requestPasswordResetAsync}
              onSwitchToLogin={() => setMode("login")}
              isLoading={isRequestPasswordResetLoading}
            />
          ) : mode === "login" ? (
            <LoginForm
              key="login"
              onSubmit={handleLoginSubmit}
              onSwitchToRegister={() => setMode("register")}
              onForgotPassword={() => setMode("forgot")}
              onResendVerification={() => setMode("verify")}
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
