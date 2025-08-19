"use client";

import React from "react";
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

export default function Button(props: ButtonProps) {
  const {
    variant = "primary",
    size = "md",
    disabled = false,
    className = "",
    children,
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
      <Link href={restProps.href} className={buttonClasses}>
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
    >
      {children}
    </button>
  );
}
