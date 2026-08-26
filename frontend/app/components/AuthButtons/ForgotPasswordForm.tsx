"use client";

import { Button, Form, TextField } from "@code-x/lago";
import type React from "react";
import { useState } from "react";
import { validateEmail } from "@/lib/validation";
import styles from "./AuthButtons.module.css";

interface ForgotPasswordFormProps {
  onSubmit: (email: string) => Promise<void>;
  onSwitchToLogin: () => void;
  isLoading?: boolean;
}

export default function ForgotPasswordForm({
  onSubmit,
  onSwitchToLogin,
  isLoading = false,
}: ForgotPasswordFormProps) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("Email is required");
      return;
    }
    if (!validateEmail(email.trim())) {
      setError("Please enter a valid email address");
      return;
    }

    await onSubmit(email.trim());
  };

  const handleEmailChange = (value: string) => {
    setEmail(value);
    if (error) setError("");
  };

  return (
    <Form onSubmit={handleSubmit} validationBehavior="aria">
      <TextField
        type="email"
        label="Email"
        isRequired
        value={email}
        onChange={handleEmailChange}
        placeholder="Enter your email"
        autoComplete="email"
        isInvalid={!!error}
        errorMessage={error}
        isDisabled={isLoading}
      />

      <div className={styles.formActions}>
        <Button type="submit" variant="primary" isDisabled={isLoading}>
          {isLoading ? "Sending…" : "Send reset link"}
        </Button>
      </div>

      <p className={styles.switchPrompt}>
        <button
          type="button"
          className={styles.switchLink}
          onClick={onSwitchToLogin}
          disabled={isLoading}
        >
          Back to sign in
        </button>
      </p>
    </Form>
  );
}
