"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import LoginForm from "@/components/AuthButtons/LoginForm";
import RegisterForm from "@/components/AuthButtons/RegisterForm";
import { Modal } from "@/components/Modal";
import { useAuth } from "@/hooks/useAuth";

interface AuthModalContextValue {
  openSignIn: () => void;
  openSignUp: () => void;
}

const AuthModalContext = createContext<AuthModalContextValue | null>(null);

export function useAuthModal(): AuthModalContextValue {
  const context = useContext(AuthModalContext);
  if (!context) {
    throw new Error("useAuthModal must be used within an AuthModalProvider");
  }
  return context;
}

export default function AuthModalProvider({ children }: { children: React.ReactNode }) {
  const { loginAsync, registerAsync, isLoginLoading, isRegisterLoading } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<"login" | "register">("login");

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
    [loginAsync],
  );

  const handleRegisterSubmit = useCallback(
    async (data: { email: string; password: string }) => {
      await registerAsync(data);
      setIsOpen(false);
    },
    [registerAsync],
  );

  const value = useMemo(() => ({ openSignIn, openSignUp }), [openSignIn, openSignUp]);

  return (
    <AuthModalContext.Provider value={value}>
      {children}
      {isOpen && (
        <Modal
          isOpen
          onClose={handleClose}
          title={mode === "login" ? "Sign In" : "Create Account"}
          size={mode === "register" ? "lg" : "sm"}
        >
          {mode === "login" ? (
            <LoginForm
              key="login"
              onSubmit={handleLoginSubmit}
              onSwitchToRegister={() => setMode("register")}
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
