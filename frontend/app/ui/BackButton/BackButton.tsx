"use client";

import { useRouter } from "next/navigation";
import Button from "@/ui/Button";

interface BackButtonProps {
  href?: string;
  children: React.ReactNode;
}

export default function BackButton({ href, children }: BackButtonProps) {
  const router = useRouter();

  if (href) {
    return (
      <Button as="link" href={href} variant="primary">
        {children}
      </Button>
    );
  }

  return (
    <Button variant="primary" onClick={() => router.back()}>
      {children}
    </Button>
  );
}
