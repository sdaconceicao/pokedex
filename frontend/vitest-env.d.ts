/// <reference types="vitest/globals" />

import type { TestingLibraryMatchers } from "@testing-library/jest-dom/matchers";

// Vitest 4 declares the `Assertion` interface in `@vitest/expect` and only
// re-exports it from `vitest`, so jest-dom's `declare module 'vitest'`
// augmentation (via `@testing-library/jest-dom/vitest`) no longer merges into
// the type that `expect()` returns. Augment the declaring module directly.
declare module "@vitest/expect" {
  interface Assertion<T = unknown> extends TestingLibraryMatchers<unknown, T> {}
  interface AsymmetricMatchersContaining extends TestingLibraryMatchers<unknown, unknown> {}
}

declare module "*.module.css" {
  const classes: { readonly [key: string]: string };
  export default classes;
}
