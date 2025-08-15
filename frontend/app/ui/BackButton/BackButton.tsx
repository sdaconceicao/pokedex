"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "./BackButton.module.css";

interface BackButtonProps {
  href?: string;
  children: React.ReactNode;
}

export default function BackButton({ href, children }: BackButtonProps) {
  const router = useRouter();

  if (href) {
    return (
      <Link href={href} className={styles.backLink}>
        {children}
      </Link>
    );
  }

  return (
    <button className={styles.backLink} onClick={() => router.back()}>
      {children}
    </button>
  );
}
