"use client";

/**
 * Client boundary for the design system.
 *
 * `@code-x/lago` ships as a single bundled ESM file, and Rollup drops the
 * per-module `"use client"` directives when it concatenates them — so importing
 * the package straight into a Server Component makes React try to render
 * react-aria's hooks and context on the server. Re-exporting it from a module
 * that carries the directive itself puts the boundary back: every symbol below
 * reaches server components as a client reference.
 *
 * Import lago from here (`@/lib/lago`), never from `@code-x/lago` directly.
 *
 * One consequence to know about: everything crossing this boundary becomes a
 * client-reference proxy, and a proxy carries no static properties. So the
 * `Dialog.Header` / `Skeleton.Card` style of access that lago's own docs use
 * resolves to `undefined` here — and it fails only in a production build, not
 * in dev or under vitest, both of which load the real module. Reach for the
 * flat exports instead: `DialogHeader`, `DialogBody`, `DialogFooter`,
 * `SkeletonCard`, `SkeletonParagraph`.
 */
export * from "@code-x/lago";
