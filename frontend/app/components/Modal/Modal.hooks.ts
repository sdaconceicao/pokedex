import { useEffect, useRef, useCallback } from "react";

/**
 * Custom hook for managing modal state and side effects
 */
export const useModal = (isOpen: boolean, onClose: () => void) => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  // Handle modal open/close and body scroll
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

  // Handle escape key
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

  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  return {
    dialogRef,
    handleClose,
  };
};
