"use client";

import { useState } from "react";
import Button from "@/components/Button";
import Input from "@/components/Input";
import Label from "@/components/Label";
import Password from "@/components/Password";
import { validateEmail, validatePassword } from "@/lib/validation";
import styles from "./AuthButtons.module.css";

interface RegisterFormProps {
  onSubmit: (data: { email: string; password: string }) => Promise<void>;
  onSwitchToLogin: () => void;
  isLoading?: boolean;
}

export default function RegisterForm({
  onSubmit,
  onSwitchToLogin,
  isLoading = false,
}: RegisterFormProps) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string>("");

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(formData.email.trim())) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else {
      const passwordValidation = validatePassword(formData.password);
      if (!passwordValidation.isValid) {
        newErrors.password = passwordValidation.errors[0];
      }
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setSubmitError("");

    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      await onSubmit({
        email: formData.email.trim(),
        password: formData.password,
      });
    } catch (error) {
      if (
        error instanceof Error &&
        (error.message.includes("already exists") || error.message.includes("Email"))
      ) {
        setSubmitError("An account with this email already exists.");
      } else {
        setSubmitError("Registration failed. Please try again.");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.registerForm}>
      {submitError && <div className={styles.submitError}>{submitError}</div>}

      <div className={styles.formGroup}>
        <Label htmlFor="reg-email" required>
          Email
        </Label>
        <Input
          id="reg-email"
          type="email"
          value={formData.email}
          onChange={(e) => handleInputChange("email", e.target.value)}
          placeholder="Enter your email"
          autoComplete="email"
          error={!!errors.email}
          errorMessage={errors.email}
          disabled={isLoading}
        />
      </div>

      <div className={styles.formGroup}>
        <Label htmlFor="reg-password" required>
          Password
        </Label>
        <Password
          id="reg-password"
          value={formData.password}
          onChange={(e) => handleInputChange("password", e.target.value)}
          placeholder="Enter your password"
          autoComplete="new-password"
          error={!!errors.password}
          errorMessage={errors.password}
          disabled={isLoading}
        />
      </div>

      <div className={styles.formGroup}>
        <Label htmlFor="reg-confirm-password" required>
          Confirm Password
        </Label>
        <Password
          id="reg-confirm-password"
          value={formData.confirmPassword}
          onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
          placeholder="Confirm your password"
          autoComplete="new-password"
          error={!!errors.confirmPassword}
          errorMessage={errors.confirmPassword}
          disabled={isLoading}
        />
      </div>

      <div className={styles.formActions}>
        <Button type="submit" variant="primary" disabled={isLoading}>
          {isLoading ? "Creating Account…" : "Create Account"}
        </Button>
      </div>

      <p className={styles.switchPrompt}>
        Already have an account?{" "}
        <button
          type="button"
          className={styles.switchLink}
          onClick={onSwitchToLogin}
          disabled={isLoading}
        >
          Sign in
        </button>
      </p>
    </form>
  );
}
