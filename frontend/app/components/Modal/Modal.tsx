"use client";

import clsx from "clsx";
import type React from "react";
import { useCallback } from "react";
import { Dialog, DialogBody, DialogFooter, DialogHeader, Modal as LagoModal } from "@/lib/lago";
import styles from "./Modal.module.css";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  header?: React.ReactNode;
  footer?: React.ReactNode;
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
  showCloseButton = true,
  closeOnBackdropClick = true,
  className = "",
  size = "md",
}: ModalProps) => {
  // This modal is always externally controlled (isOpen/onClose), so the only
  // half of react-aria's open/close callback that matters is the close one —
  // opening happens by a parent flipping `isOpen`, never by the overlay itself.
  const handleOpenChange = useCallback(
    (open: boolean) => {
      if (!open) onClose();
    },
    [onClose],
  );

  // A custom header overrides the title, same as the old hand-rolled header did.
  const shouldShowHeader = !!(header || title || showCloseButton);

  return (
    <LagoModal
      isOpen={isOpen}
      onOpenChange={handleOpenChange}
      isDismissable={closeOnBackdropClick}
      isKeyboardDismissDisabled={false}
      className={clsx(styles.overlay, styles[size], className)}
    >
      {/* No className here: lago's Dialog replaces its default class list
          wholesale when one is passed, dropping the padding/scroll styling
          that makes it a working dialog rather than merging like its
          Header/Body/Footer siblings do. */}
      <Dialog>
        {shouldShowHeader && (
          <DialogHeader hideCloseButton={!showCloseButton} title={header ? undefined : title}>
            {header}
          </DialogHeader>
        )}
        <DialogBody className={styles.body}>{children}</DialogBody>
        {footer && <DialogFooter>{footer}</DialogFooter>}
      </Dialog>
    </LagoModal>
  );
};

export default Modal;
