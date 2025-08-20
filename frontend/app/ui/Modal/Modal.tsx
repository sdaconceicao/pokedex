"use client";

import React, { useEffect, useRef } from "react";
import { X } from "@untitled-ui/icons-react";
import Button from "@/ui/Button";
import styles from "./Modal.module.css";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  showBackdrop?: boolean;
  showCloseButton?: boolean;
  closeOnBackdropClick?: boolean;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

export default function Modal({
  isOpen,
  onClose,
  children,
  title,
  header,
  footer,
  showBackdrop = true,
  showCloseButton = true,
  closeOnBackdropClick = true,
  className = "",
  size = "md",
}: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen) {
      dialog.showModal();
      // Prevent body scroll when modal is open
      document.body.style.overflow = "hidden";
    } else {
      dialog.close();
      // Restore body scroll when modal is closed
      document.body.style.overflow = "unset";
    }

    // Cleanup function to restore body scroll
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    if (!closeOnBackdropClick) return;

    // Check if the click was on the backdrop (dialog element itself)
    const rect = e.currentTarget.getBoundingClientRect();
    const isInDialog =
      e.clientX >= rect.left &&
      e.clientX <= rect.right &&
      e.clientY >= rect.top &&
      e.clientY <= rect.bottom;

    // If click is outside the dialog content, close the modal
    if (!isInDialog) {
      onClose();
    }
  };

  const handleClose = () => {
    onClose();
  };

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      {showBackdrop && <div className={styles.backdrop} />}
      <dialog
        ref={dialogRef}
        className={`${styles.dialog} ${styles[size]} ${className}`}
        onClick={handleBackdropClick}
      >
        <div className={styles.content}>
          {/* Header */}
          {(header || title) && (
            <div className={styles.header}>
              {header || (title && <h2 className={styles.title}>{title}</h2>)}
              {showCloseButton && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClose}
                  className={styles.closeButton}
                  aria-label="Close modal"
                >
                  <X width={20} height={20} />
                </Button>
              )}
            </div>
          )}

          {/* Body */}
          <div className={styles.body}>{children}</div>

          {/* Footer */}
          {footer && <div className={styles.footer}>{footer}</div>}
        </div>
      </dialog>
    </>
  );
}
