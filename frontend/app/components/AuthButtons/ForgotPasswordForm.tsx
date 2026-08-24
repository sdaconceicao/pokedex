"use client";

import { Button, Form, TextField } from "@code-x/lago";
import type React from "react";
import { useState } from "react";
import { validateEmail } from "@/lib/validation";
import styles from "./AuthButtons.module.css";

interface ForgotPasswordFormProps {
  onSubmit: (email: string) => Promise<{ message: string }>;
  onSwitchToLogin: () => void;
  isLoading?: boolean;
  submitLabel?: string;
  pendingLabel?: string;
}

export default function ForgotPasswordForm({
  onSubmit,
  onSwitchToLogin,
  isLoading = false,
  submitLabel = "Send reset link",
  pendingLabel = "Sending…",
}: ForgotPasswordFormProps) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string>("");
  const [submitError, setSubmitError] = useState<string>("");
  const [sentMessage, setSentMessage] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitError("");

    if (!email.trim()) {
      setError("Email is required");
      return;
    }
    if (!validateEmail(email.trim())) {
      setError("Please enter a valid email address");
      return;
    }

    try {
      const result = await onSubmit(email.trim());
      setSentMessage(result.message);
    } catch {
      setSubmitError("Something went wrong. Please try again.");
    }
  };

  const handleEmailChange = (value: string) => {
    setEmail(value);
    if (error) setError("");
  };

  // Replaces the form outright — a still-submittable field under a
  // confirmation just invites duplicate sends.
  if (sentMessage) {
    return (
      <div>
        <p className={styles.sentMessage}>{sentMessage}</p>
        <p className={styles.switchPrompt}>
          <button type="button" className={styles.switchLink} onClick={onSwitchToLogin}>
            Back to sign in
          </button>
        </p>
      </div>
    );
  }

  return (
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
        isInvalid={!!error}
        errorMessage={error}
        isDisabled={isLoading}
      />

      <div className={styles.formActions}>
        <Button type="submit" variant="primary" isDisabled={isLoading}>
          {isLoading ? pendingLabel : submitLabel}
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
