"use client";

import React, { useState } from "react";
import Input from "@/components/Input";
import Label from "@/components/Label";
import Button from "@/components/Button";
import styles from "./AuthButtons.module.css";

interface LoginFormProps {
  onSubmit: (email: string, password: string) => void | Promise<void>;
  onSwitchToRegister: () => void;
  isLoading?: boolean;
}

export default function LoginForm({
  onSubmit,
  onSwitchToRegister,
  isLoading = false,
}: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {}
  );
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

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (errors.password)
      setErrors((prev) => ({ ...prev, password: undefined }));
  };

  return (
    <form onSubmit={handleSubmit} className={styles.loginForm}>
      {submitError && <div className={styles.submitError}>{submitError}</div>}

      <div className={styles.formGroup}>
        <Label htmlFor="email" required>
          Email
        </Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={handleEmailChange}
          placeholder="Enter your email"
          autoComplete="email"
          error={!!errors.email}
          errorMessage={errors.email}
          disabled={isLoading}
        />
      </div>

      <div className={styles.formGroup}>
        <Label htmlFor="password" required>
          Password
        </Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={handlePasswordChange}
          placeholder="Enter your password"
          autoComplete="current-password"
          error={!!errors.password}
          errorMessage={errors.password}
          disabled={isLoading}
        />
      </div>

      <div className={styles.formActions}>
        <Button type="submit" variant="primary" disabled={isLoading}>
          {isLoading ? "Signing in…" : "Sign In"}
        </Button>
      </div>

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
    </form>
  );
}
