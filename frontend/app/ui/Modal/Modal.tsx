"use client";

import React, { useCallback, useMemo } from "react";
import { X } from "@untitled-ui/icons-react";
import clsx from "clsx";

import Button from "@/ui/Button";
import { useModal } from "./Modal.hooks";
import { isBackdropClick, shouldRenderModal } from "./Modal.utils";
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

export const Modal: React.FC<ModalProps> = ({
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
}: ModalProps) => {
  const { dialogRef } = useModal(isOpen, onClose);

  // Memoized computed values
  const dialogClassName = useMemo(() => {
    return clsx(styles.dialog, styles[size], className);
  }, [size, className]);

  const shouldShowHeader = useMemo(() => {
    return !!(header || title || showCloseButton);
  }, [header, title, showCloseButton]);

  const shouldShowFooter = useMemo(() => {
    return !!footer;
  }, [footer]);

  // Memoized callbacks
  const handleBackdropClick = useCallback(
    (e: React.MouseEvent<HTMLDialogElement>) => {
      if (!closeOnBackdropClick) return;

      if (isBackdropClick(e)) {
        onClose();
      }
    },
    [closeOnBackdropClick, onClose]
  );

  // Early return if modal should not be rendered
  if (!shouldRenderModal(isOpen)) return null;

  return (
    <>
      {showBackdrop && <div className={styles.backdrop} />}
      <dialog
        ref={dialogRef}
        className={dialogClassName}
        onClick={handleBackdropClick}
      >
        <div className={styles.content}>
          {/* Header */}
          {shouldShowHeader && (
            <div className={styles.header}>
              {header || (title && <h2 className={styles.title}>{title}</h2>)}
              {showCloseButton && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
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
          {shouldShowFooter && <div className={styles.footer}>{footer}</div>}
        </div>
      </dialog>
    </>
  );
};

export default Modal;
