"use client";

import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { RouterProvider } from "react-aria-components";
import { ThemeProvider } from "@/lib/lago";

declare module "react-aria-components" {
  interface RouterConfig {
    routerOptions: NonNullable<Parameters<ReturnType<typeof useRouter>["push"]>[1]>;
  }
}

/**
 * Wires the design system into Next.js: `RouterProvider` hands react-aria's
 * `href` handling (Link, Button, MenuItem, Breadcrumbs…) to the app router so
 * those navigate client-side instead of doing a full document load, and
 * `ThemeProvider` owns the `dark-mode` class the lago tokens key off.
 */
export default function LagoProvider({ children }: { children: ReactNode }) {
  const router = useRouter();

  return (
    <RouterProvider navigate={router.push}>
      <ThemeProvider defaultTheme="system">{children}</ThemeProvider>
    </RouterProvider>
  );
}
