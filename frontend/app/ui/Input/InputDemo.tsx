"use client";

import React, { useState } from "react";
import Label from "@/ui/Label";
import Input from "@/ui/Input";
import Button from "@/ui/Button";
import styles from "./InputDemo.module.css";

export default function InputDemo() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    website: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    // Validation
    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      alert("Form submitted successfully!");
      console.log("Form data:", formData);
    }
  };

  return (
    <div className={styles.container}>
      <h2>Input & Label Components Demo</h2>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formRow}>
          <Label htmlFor="username" required>
            Username
          </Label>
          <Input
            id="username"
            name="username"
            type="text"
            placeholder="Enter your username"
            value={formData.username}
            onChange={(e) => handleInputChange("username", e.target.value)}
            error={!!errors.username}
            errorMessage={errors.username}
            autoComplete="username"
          />
        </div>

        <div className={styles.formRow}>
          <Label htmlFor="email" required>
            Email Address
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            error={!!errors.email}
            errorMessage={errors.email}
            autoComplete="email"
          />
        </div>

        <div className={styles.formRow}>
          <Label htmlFor="password" required>
            Password
          </Label>
          <Input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            value={formData.password}
            onChange={(e) => handleInputChange("password", e.target.value)}
            error={!!errors.password}
            errorMessage={errors.password}
            autoComplete="new-password"
            minLength={8}
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setShowPassword(!showPassword)}
            className={styles.togglePassword}
          >
            {showPassword ? "Hide" : "Show"}
          </Button>
        </div>

        <div className={styles.formRow}>
          <Label htmlFor="confirmPassword" required>
            Confirm Password
          </Label>
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            placeholder="Confirm your password"
            value={formData.confirmPassword}
            onChange={(e) =>
              handleInputChange("confirmPassword", e.target.value)
            }
            error={!!errors.confirmPassword}
            errorMessage={errors.confirmPassword}
            autoComplete="new-password"
          />
        </div>

        <div className={styles.formRow}>
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            placeholder="Enter your phone number"
            value={formData.phone}
            onChange={(e) => handleInputChange("phone", e.target.value)}
            autoComplete="tel"
          />
        </div>

        <div className={styles.formRow}>
          <Label htmlFor="website">Website</Label>
          <Input
            id="website"
            name="website"
            type="url"
            placeholder="https://example.com"
            value={formData.website}
            onChange={(e) => handleInputChange("website", e.target.value)}
            autoComplete="url"
          />
        </div>

        <div className={styles.formRow}>
          <Label htmlFor="age">Age</Label>
          <Input
            id="age"
            name="age"
            type="number"
            placeholder="Enter your age"
            min={0}
            max={120}
            autoComplete="off"
          />
        </div>

        <div className={styles.buttonRow}>
          <Button type="submit" variant="primary">
            Submit Form
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setFormData({
                username: "",
                email: "",
                password: "",
                confirmPassword: "",
                phone: "",
                website: "",
              });
              setErrors({});
            }}
          >
            Reset Form
          </Button>
        </div>
      </form>

      <div className={styles.sizeDemo}>
        <h3>Size Variants</h3>
        <div className={styles.sizeExamples}>
          <div>
            <Label htmlFor="small-input">Small Input</Label>
            <Input id="small-input" size="sm" placeholder="Small size" />
          </div>
          <div>
            <Label htmlFor="medium-input">Medium Input (Default)</Label>
            <Input id="medium-input" size="md" placeholder="Medium size" />
          </div>
          <div>
            <Label htmlFor="large-input">Large Input</Label>
            <Input id="large-input" size="lg" placeholder="Large size" />
          </div>
        </div>
      </div>

      <div className={styles.stateDemo}>
        <h3>Input States</h3>
        <div className={styles.stateExamples}>
          <div>
            <Label htmlFor="disabled-input">Disabled Input</Label>
            <Input id="disabled-input" value="Disabled value" disabled />
          </div>
          <div>
            <Label htmlFor="readonly-input">Read-only Input</Label>
            <Input id="readonly-input" value="Read-only value" readOnly />
          </div>
          <div>
            <Label htmlFor="error-input">Error Input</Label>
            <Input
              id="error-input"
              value="Error value"
              error
              errorMessage="This field has an error"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
