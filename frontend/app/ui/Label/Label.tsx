"use client";

import React from "react";
import styles from "./Label.module.css";

interface LabelProps {
  htmlFor?: string;
  children: React.ReactNode;
  required?: boolean;
  className?: string;
}

export default function Label({
  htmlFor,
  children,
  required = false,
  className = "",
}: LabelProps) {
  return (
    <label htmlFor={htmlFor} className={`${styles.label} ${className}`}>
      {children}
      {required && <span className={styles.required}>*</span>}
    </label>
  );
}
