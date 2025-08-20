"use client";

import { useState } from "react";
import Input from "@/ui/Input";
import Label from "@/ui/Label";
import Button from "@/ui/Button";
import styles from "./AuthButtons.module.css";

interface LoginFormProps {
  onSubmit: (email: string, password: string) => void | Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
  error?: string;
}

export default function LoginForm({
  onSubmit,
  onCancel,
  isLoading = false,
  error: propError,
}: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {}
  );
  const [submitError, setSubmitError] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Clear previous errors
    setErrors({});
    setSubmitError("");

    // Basic validation
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
    } catch (error) {
      console.error("Login failed:", error);
      setSubmitError("Invalid credentials. Please try again.");
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (errors.email) {
      setErrors((prev) => ({ ...prev, email: undefined }));
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (errors.password) {
      setErrors((prev) => ({ ...prev, password: undefined }));
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={styles.loginForm}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          e.stopPropagation();
          // Manually trigger form submission logic
          const mockEvent = { preventDefault: () => {} } as React.FormEvent;
          handleSubmit(mockEvent);
        }
      }}
    >
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

      {/* Display submit error if any */}
      {(submitError || propError) && (
        <div className={styles.submitError}>{submitError || propError}</div>
      )}

      <div className={styles.formActions}>
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button type="submit" variant="primary" disabled={isLoading}>
          {isLoading ? "Logging in..." : "Login"}
        </Button>
      </div>
    </form>
  );
}
