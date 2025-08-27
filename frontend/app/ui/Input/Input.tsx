"use client";

import React, { forwardRef, useMemo } from "react";
import clsx from "clsx";
import {
  generateTypeClass,
  generateErrorMessageId,
  shouldShowErrorMessage,
} from "./Input.utils";

import styles from "./Input.module.css";

export type InputType =
  | "text"
  | "password"
  | "email"
  | "number"
  | "tel"
  | "url"
  | "search";

export type InputSize = "sm" | "md" | "lg";

export interface InputProps {
  type?: InputType;
  size?: InputSize;
  placeholder?: string;
  value?: string;
  defaultValue?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  name?: string;
  id?: string;
  className?: string;
  error?: boolean;
  errorMessage?: string;
  autoComplete?: string;
  autoFocus?: boolean;
  maxLength?: number;
  minLength?: number;
  min?: number;
  max?: number;
  pattern?: string;
  "data-testid"?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      type = "text",
      size = "md",
      placeholder,
      value,
      defaultValue,
      onChange,
      onBlur,
      onFocus,
      disabled = false,
      readOnly = false,
      required = false,
      name,
      id,
      className = "",
      error = false,
      errorMessage,
      autoComplete,
      autoFocus = false,
      maxLength,
      minLength,
      min,
      max,
      pattern,
      "data-testid": testId,
    },
    ref
  ) => {
    // Generate classes directly in component using clsx
    const inputClasses = useMemo(() => {
      const typeClass = generateTypeClass(type);

      return clsx(
        styles.input,
        styles[size],
        {
          [styles.error]: error,
          [styles.disabled]: disabled,
        },
        typeClass && styles[typeClass],
        className
      );
    }, [type, size, error, disabled, className]);

    const errorMessageId = useMemo(() => {
      return generateErrorMessageId(id, errorMessage);
    }, [id, errorMessage]);

    const showErrorMessage = useMemo(() => {
      return shouldShowErrorMessage(error, errorMessage);
    }, [error, errorMessage]);

    return (
      <div className={styles.container} data-testid={testId}>
        <input
          ref={ref}
          type={type}
          className={inputClasses}
          placeholder={placeholder}
          value={value}
          defaultValue={defaultValue}
          onChange={onChange}
          onBlur={onBlur}
          onFocus={onFocus}
          disabled={disabled}
          readOnly={readOnly}
          required={required}
          name={name}
          id={id}
          autoComplete={autoComplete}
          autoFocus={autoFocus}
          maxLength={maxLength}
          minLength={minLength}
          min={min}
          max={max}
          pattern={pattern}
          aria-invalid={error}
          aria-describedby={errorMessageId}
          data-testid={`${testId}-input`}
        />
        {showErrorMessage && (
          <div
            id={errorMessageId}
            className={styles.errorMessage}
            role="alert"
            data-testid={`${testId}-error`}
          >
            {errorMessage}
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
