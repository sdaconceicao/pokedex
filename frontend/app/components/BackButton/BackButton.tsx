"use client";

import { Button, Link } from "@code-x/lago";
import { ArrowLeft } from "@untitled-ui/icons-react";
import { useRouter } from "next/navigation";
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
    // Link, not Button: react-aria's `useButton` never talks to a router, so
    // a Button here could only fake navigation from `onPress`, losing the
    // modifier-click handling — open in a new tab, new window — a real
    // anchor gets for free. The app's RouterProvider gives a Link's `href` a
    // client-side transition automatically. Link carries no variant styling
    // of its own, though, so the primary-button look is restated below from
    // lago's public tokens rather than the private, size-scoped classes a
    // real Button reads its own geometry from.
    return (
      <Link href={href} className={`${styles.backButton} ${styles.linkButton} ${styles[size]}`}>
        {content}
      </Link>
    );
  }

  // No fixed destination to point at, so this is a real action, not a link:
  // a Button driven by `onPress`. `render` swaps in the gap and hover-arrow
  // classes below — passing `className` to Button directly doesn't merge it
  // with Button's own classes the way every other lago component does, so
  // this reaches into the DOM props `render` is handed instead.
  return (
    <Button
      variant="primary"
      size={size}
      onPress={() => router.back()}
      render={(props) => (
        <button {...props} className={`${props.className} ${styles.backButton}`} />
      )}
    >
      {content}
    </Button>
  );
}
