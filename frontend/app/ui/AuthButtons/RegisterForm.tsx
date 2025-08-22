"use client";

import { useState } from "react";
import Input from "@/ui/Input";
import Label from "@/ui/Label";
import Button from "@/ui/Button";
import { validatePassword, validateEmail } from "@/lib/validation";
import styles from "./AuthButtons.module.css";

interface RegisterFormProps {
  onSubmit: (data: { email: string; password: string }) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function RegisterForm({
  onSubmit,
  onCancel,
  isLoading = false,
}: RegisterFormProps) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(formData.email.trim())) {
      newErrors.email = "Please enter a valid email address";
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else {
      const passwordValidation = validatePassword(formData.password);
      if (!passwordValidation.isValid) {
        newErrors.password = passwordValidation.errors[0]; // Show first error
      }
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Clear previous errors
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
      console.error("Registration failed:", error);
      // Handle specific error messages from the server
      if (error instanceof Error) {
        if (
          error.message.includes("already exists") ||
          error.message.includes("Email")
        ) {
          setSubmitError(
            "Email already exists. Please use a different email address."
          );
        } else {
          setSubmitError("Registration failed. Please try again.");
        }
      } else {
        setSubmitError("Registration failed. Please try again.");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.registerForm}>
      {/* Display submit error if any */}
      {submitError && <div className={styles.submitError}>{submitError}</div>}

      <div className={styles.formGroup}>
        <Label htmlFor="email" required>
          Email
        </Label>
        <Input
          id="email"
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
        <Label htmlFor="password" required>
          Password
        </Label>
        <div className={styles.passwordContainer}>
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            value={formData.password}
            onChange={(e) => handleInputChange("password", e.target.value)}
            placeholder="Enter your password"
            autoComplete="new-password"
            error={!!errors.password}
            errorMessage={errors.password}
            disabled={isLoading}
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setShowPassword(!showPassword)}
            className={styles.togglePassword}
            disabled={isLoading}
          >
            {showPassword ? "Hide" : "Show"}
          </Button>
        </div>
      </div>

      <div className={styles.formGroup}>
        <Label htmlFor="confirmPassword" required>
          Confirm Password
        </Label>
        <div className={styles.passwordContainer}>
          <Input
            id="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            value={formData.confirmPassword}
            onChange={(e) =>
              handleInputChange("confirmPassword", e.target.value)
            }
            placeholder="Confirm your password"
            autoComplete="new-password"
            error={!!errors.confirmPassword}
            errorMessage={errors.confirmPassword}
            disabled={isLoading}
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className={styles.togglePassword}
            disabled={isLoading}
          >
            {showConfirmPassword ? "Hide" : "Show"}
          </Button>
        </div>
      </div>

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
          {isLoading ? "Creating Account..." : "Create Account"}
        </Button>
      </div>
    </form>
  );
}
