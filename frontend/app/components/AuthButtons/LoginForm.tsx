"use client";

import { Button, Form, Password, TextField } from "@code-x/lago";
import type React from "react";
import { useState } from "react";
import styles from "./AuthButtons.module.css";

interface LoginFormProps {
  onSubmit: (email: string, password: string) => void | Promise<void>;
  onSwitchToRegister: () => void;
  onForgotPassword: () => void;
  isLoading?: boolean;
}

export default function LoginForm({
  onSubmit,
  onSwitchToRegister,
  onForgotPassword,
  isLoading = false,
}: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [submitError, setSubmitError] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setSubmitError("");

    const newErrors: { email?: string; password?: string } = {};

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!password.trim()) {
      newErrors.password = "Password is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      await onSubmit(email, password);
    } catch {
      setSubmitError("Invalid credentials. Please try again.");
    }
  };

  const handleEmailChange = (value: string) => {
    setEmail(value);
    if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
  };

  return (
    // `validationBehavior="aria"` keeps the browser's native constraint-validation
    // popups out of the way so the manual checks above stay the single source of
    // truth for errors, same as the hand-rolled form before it.
    <Form onSubmit={handleSubmit} validationBehavior="aria">
      {submitError && <div className={styles.submitError}>{submitError}</div>}

      <TextField
        type="email"
        label="Email"
        isRequired
        value={email}
        onChange={handleEmailChange}
        placeholder="Enter your email"
        autoComplete="email"
        isInvalid={!!errors.email}
        errorMessage={errors.email}
        isDisabled={isLoading}
      />

      <Password
        label="Password"
        isRequired
        value={password}
        onChange={handlePasswordChange}
        placeholder="Enter your password"
        autoComplete="current-password"
        isInvalid={!!errors.password}
        errorMessage={errors.password}
        isDisabled={isLoading}
      />

      <div className={styles.formActions}>
        <Button type="submit" variant="primary" isDisabled={isLoading}>
          {isLoading ? "Signing in…" : "Sign In"}
        </Button>
      </div>

      <p className={styles.switchPrompt}>
        <button
          type="button"
          className={styles.switchLink}
          onClick={onForgotPassword}
          disabled={isLoading}
        >
          Forgot your password?
        </button>
      </p>

      <p className={styles.switchPrompt}>
        Don&apos;t have an account?{" "}
        <button
          type="button"
          className={styles.switchLink}
          onClick={onSwitchToRegister}
          disabled={isLoading}
        >
          Sign up
        </button>
      </p>
    </Form>
  );
}
