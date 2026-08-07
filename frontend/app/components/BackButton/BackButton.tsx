"use client";

import { ArrowLeft } from "@untitled-ui/icons-react";
import { useRouter } from "next/navigation";
import Button from "@/components/Button";
import styles from "./BackButton.module.css";

interface BackButtonProps {
  href?: string;
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
}

export default function BackButton({ href, size = "md", children }: BackButtonProps) {
  const router = useRouter();

  const content = (
    <>
      <ArrowLeft width={16} height={16} aria-hidden="true" />
      {children}
    </>
  );

  if (href) {
    return (
      <Button as="link" href={href} variant="primary" size={size} className={styles.backButton}>
        {content}
      </Button>
    );
  }

  return (
    <Button
      variant="primary"
      size={size}
      onClick={() => router.back()}
      className={styles.backButton}
    >
      {content}
    </Button>
  );
}
