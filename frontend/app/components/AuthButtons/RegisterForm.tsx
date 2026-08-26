"use client";

import { Button, Form, Password, TextField } from "@code-x/lago";
import { useState } from "react";
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

    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Outcome handling lives in AuthModalProvider, which closes the modal
    // and raises a toast; this form only validates and submits.
    await onSubmit({
      email: formData.email.trim(),
      password: formData.password,
    });
  };

  return (
    // `validationBehavior="aria"` keeps the browser's native constraint-validation
    // popups out of the way so `validateForm` above stays the single source of
    // truth for errors, same as the hand-rolled form before it.
    <Form onSubmit={handleSubmit} validationBehavior="aria">
      <TextField
        type="email"
        label="Email"
        isRequired
        value={formData.email}
        onChange={(value) => handleInputChange("email", value)}
        placeholder="Enter your email"
        autoComplete="email"
        isInvalid={!!errors.email}
        errorMessage={errors.email}
        isDisabled={isLoading}
      />

      <Password
        label="Password"
        isRequired
        value={formData.password}
        onChange={(value) => handleInputChange("password", value)}
        placeholder="Enter your password"
        autoComplete="new-password"
        isInvalid={!!errors.password}
        errorMessage={errors.password}
        isDisabled={isLoading}
      />

      <Password
        label="Confirm Password"
        isRequired
        value={formData.confirmPassword}
        onChange={(value) => handleInputChange("confirmPassword", value)}
        placeholder="Confirm your password"
        autoComplete="new-password"
        isInvalid={!!errors.confirmPassword}
        errorMessage={errors.confirmPassword}
        isDisabled={isLoading}
      />

      <div className={styles.formActions}>
        <Button type="submit" variant="primary" isDisabled={isLoading}>
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
    </Form>
  );
}
