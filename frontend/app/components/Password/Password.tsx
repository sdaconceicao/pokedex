"use client";

import { Eye, EyeOff } from "@untitled-ui/icons-react";
import { useCallback, useState } from "react";
import Button from "@/components/Button";
import Input, { type InputSize } from "@/components/Input";
import styles from "./Password.module.css";

export interface PasswordProps {
  id?: string;
  name?: string;
  value?: string;
  defaultValue?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  placeholder?: string;
  autoComplete?: string;
  disabled?: boolean;
  required?: boolean;
  size?: InputSize;
  error?: boolean;
  errorMessage?: string;
  className?: string;
  wrapperClassName?: string;
  "data-testid"?: string;
}

export default function Password({
  id,
  name,
  value,
  defaultValue,
  onChange,
  onBlur,
  placeholder,
  autoComplete,
  disabled = false,
  required = false,
  size = "md",
  error = false,
  errorMessage,
  className = "",
  wrapperClassName = "",
  "data-testid": testId,
}: PasswordProps) {
  const [showPassword, setShowPassword] = useState(false);

  const toggleVisibility = useCallback(() => {
    setShowPassword((current) => !current);
  }, []);

  return (
    <div className={styles.passwordField} data-testid={testId}>
      <div className={styles.inputRow}>
        <Input
          id={id}
          name={name}
          type={showPassword ? "text" : "password"}
          value={value}
          defaultValue={defaultValue}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          autoComplete={autoComplete}
          disabled={disabled}
          required={required}
          size={size}
          error={error}
          errorMessage={errorMessage}
          wrapperClassName={`${styles.inputWrapper} ${wrapperClassName}`.trim()}
          className={`${styles.passwordInput} ${className}`.trim()}
          data-testid={testId ? `${testId}-input` : undefined}
        />
        <Button
          type="button"
          variant="primary"
          size={size}
          onClick={toggleVisibility}
          className={`${styles.toggleButton} ${styles[size]}`}
          disabled={disabled}
          aria-label={showPassword ? "Hide password" : "Show password"}
          aria-pressed={showPassword}
        >
          {showPassword ? (
            <EyeOff width={18} height={18} aria-hidden="true" />
          ) : (
            <Eye width={18} height={18} aria-hidden="true" />
          )}
        </Button>
      </div>
    </div>
  );
}
