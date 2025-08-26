"use client";

import React, { FunctionComponent } from "react";
import Link from "next/link";
import styles from "./Button.module.css";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "danger";
export type ButtonSize = "sm" | "md" | "lg";

interface ButtonBaseProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
  "data-testid"?: string;
  "aria-label"?: string;
  "aria-describedby"?: string;
  "aria-expanded"?: boolean;
  "aria-pressed"?: boolean;
}

interface ButtonAsButtonProps extends ButtonBaseProps {
  as?: "button";
  type?: "button" | "submit" | "reset";
}

interface ButtonAsLinkProps extends ButtonBaseProps {
  as: "link";
  href: string;
}

type ButtonProps = ButtonAsButtonProps | ButtonAsLinkProps;

export const Button: FunctionComponent<ButtonProps> = (props) => {
  const {
    variant = "primary",
    size = "md",
    disabled = false,
    className = "",
    children,
    "data-testid": testId,
    "aria-label": ariaLabel,
    "aria-describedby": ariaDescribedby,
    "aria-expanded": ariaExpanded,
    "aria-pressed": ariaPressed,
    ...restProps
  } = props;

  const buttonClasses = [
    styles.button,
    styles[variant],
    styles[size],
    disabled ? styles.disabled : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  // Handle link variant
  if ("as" in restProps && restProps.as === "link") {
    return (
      <Link
        href={restProps.href}
        className={buttonClasses}
        data-testid={testId || "button-link"}
        aria-label={ariaLabel}
        aria-describedby={ariaDescribedby}
        aria-expanded={ariaExpanded}
        aria-pressed={ariaPressed}
      >
        {children}
      </Link>
    );
  }

  // Handle button variant
  const { onClick, type = "button" } = restProps as ButtonAsButtonProps;

  return (
    <button
      type={type}
      className={buttonClasses}
      disabled={disabled}
      onClick={onClick}
      data-testid={testId || "button"}
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedby}
      aria-expanded={ariaExpanded}
      aria-pressed={ariaPressed}
    >
      {children}
    </button>
  );
};

export default Button;
