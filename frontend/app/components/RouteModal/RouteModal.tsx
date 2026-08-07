"use client";

import clsx from "clsx";
import { useRouter } from "next/navigation";
import { type ReactNode, useCallback } from "react";
import { Modal } from "@/components/Modal";
import styles from "./RouteModal.module.css";

interface RouteModalProps {
  children: ReactNode;
  /** Where dismissing navigates to. Pass a URL so a link opened cold has
   *  somewhere to land; omit it to step back through history instead. */
  closeHref?: string;
  title?: string;
  /** Set false when the content carries its own way out — Modal drops the
   *  whole header along with the button, leaving the content flush to the top.
   *  Escape and a backdrop click still dismiss. */
  showCloseButton?: boolean;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

/**
 * Holds a route's own content in a modal over whatever is behind it — the slot
 * half of a parallel route. Dismissing is a navigation rather than local
 * state, so the URL and what's on screen can't disagree.
 */
export default function RouteModal({
  children,
  closeHref,
  title,
  showCloseButton = true,
  size = "xl",
  className,
}: RouteModalProps) {
  const router = useRouter();

  const handleClose = useCallback(() => {
    // replace, not push: closing shouldn't leave the overlay's own URL on the
    // stack for Back to walk straight into again
    if (closeHref) {
      router.replace(closeHref, { scroll: false });
      return;
    }
    router.back();
  }, [router, closeHref]);

  return (
    <Modal
      isOpen
      onClose={handleClose}
      title={title}
      showCloseButton={showCloseButton}
      size={size}
      className={clsx(styles.modal, className)}
    >
      {children}
    </Modal>
  );
}
