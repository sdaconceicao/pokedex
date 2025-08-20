"use client";

import { useState } from "react";
import Input from "@/ui/Input";
import Label from "@/ui/Label";
import Button from "@/ui/Button";
import {
  validatePassword,
  validateEmail,
  validateUsername,
  validateName,
} from "@/lib/validation";
import styles from "./AuthButtons.module.css";

interface RegisterFormProps {
  onSubmit: (data: {
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    password: string;
  }) => void;
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

    // First name validation
    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    } else if (!validateName(formData.firstName.trim())) {
      newErrors.firstName =
        "First name must be 2-50 characters and contain only letters and spaces";
    }

    // Last name validation
    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    } else if (!validateName(formData.lastName.trim())) {
      newErrors.lastName =
        "Last name must be 2-50 characters and contain only letters and spaces";
    }

    // Username validation
    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    } else if (!validateUsername(formData.username.trim())) {
      newErrors.username =
        "Username must be 3-20 characters and contain only letters, numbers, and underscores";
    }

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors = validateForm();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit({
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      username: formData.username.trim(),
      email: formData.email.trim(),
      password: formData.password,
    });
  };

  return (
    <form onSubmit={handleSubmit} className={styles.registerForm}>
      <div className={styles.formRow}>
        <div className={styles.formGroup}>
          <Label htmlFor="firstName" required>
            First Name
          </Label>
          <Input
            id="firstName"
            type="text"
            value={formData.firstName}
            onChange={(e) => handleInputChange("firstName", e.target.value)}
            placeholder="Enter your first name"
            autoComplete="given-name"
            error={!!errors.firstName}
            errorMessage={errors.firstName}
            disabled={isLoading}
          />
        </div>

        <div className={styles.formGroup}>
          <Label htmlFor="lastName" required>
            Last Name
          </Label>
          <Input
            id="lastName"
            type="text"
            value={formData.lastName}
            onChange={(e) => handleInputChange("lastName", e.target.value)}
            placeholder="Enter your last name"
            autoComplete="family-name"
            error={!!errors.lastName}
            errorMessage={errors.lastName}
            disabled={isLoading}
          />
        </div>
      </div>

      <div className={styles.formGroup}>
        <Label htmlFor="username" required>
          Username
        </Label>
        <Input
          id="username"
          type="text"
          value={formData.username}
          onChange={(e) => handleInputChange("username", e.target.value)}
          placeholder="Enter your username"
          autoComplete="username"
          error={!!errors.username}
          errorMessage={errors.username}
          disabled={isLoading}
        />
      </div>

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
