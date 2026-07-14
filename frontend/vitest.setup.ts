import * as matchers from "@testing-library/jest-dom/matchers";
import { expect } from "vitest";

// Register jest-dom matchers against this package's own Vitest `expect`.
// jest-dom's `/vitest` entry does a bare `require('vitest')`, which in this
// pnpm monorepo resolves to the hoisted Vitest 3 (still used by the backend)
// rather than the frontend's Vitest 4 — so its matchers would never reach the
// test runner. Extending explicitly avoids the version mismatch.
// (The matcher *types* are wired up separately in vitest-env.d.ts.)
expect.extend(matchers);
